import bcrypt from "bcryptjs";
import { createHash, randomUUID } from "crypto";
import { prisma } from "../config/database";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} from "../utils/error";
import { sendVerificationEmail, sendWelcomeEmail } from "./emailService";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

const BCRYPT_DUMMY_HASH: string = (() => {
  const hash = process.env.BCRYPT_DUMMY_HASH;

  if (!hash) {
    throw new Error(
      "BCRYPT_DUMMY_HASH is not defined in environment variables",
    );
  }

  return hash;
})();

const REFRESH_TOKEN_DAYS = Number(process.env.JWT_REFRESH_TOKEN_DAYS) || 7;

const hashRefreshToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

const hashVerificationToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export class AuthService {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "DONOR" | "HOSPITAL";
    organizationName?: string;
    registrationNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  }) {
    const email = data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError(
        "If this email is already registered, try logging in instead",
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email,
          password: hashedPassword,
          role: data.role,

          organizationName:
            data.role === "HOSPITAL" ? data.organizationName : null,

          registrationNumber:
            data.role === "HOSPITAL" ? data.registrationNumber : null,

          isVerifiedInstitution: false,

          address: data.role === "HOSPITAL" ? data.address : null,

          city: data.role === "HOSPITAL" ? data.city : null,

          state: data.role === "HOSPITAL" ? data.state : null,

          country: data.role === "HOSPITAL" ? data.country || "Nigeria" : null,
        },
      });

      if (data.role === "DONOR") {
        await tx.donorProfile.create({
          data: {
            userId: user.id,
            isAvailable: true,
          },
        });
      }

      /*
       * Generate a random token for the verification link.
       * Only its hash is stored in the database.
       */
      const verificationToken = randomUUID();

      const verificationTokenHash = hashVerificationToken(verificationToken);

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          token: verificationTokenHash,
          expiresAt,
        },
      });

      /*
       * The raw token is returned from the transaction so it
       * can be sent to the user by email.
       */
      return {
        user,
        verificationToken,
      };
    });

    sendVerificationEmail(
      result.user.email,
      result.user.firstName,
      result.verificationToken,
    ).catch(() => {});

    const { password, ...userWithoutPassword } = result.user;

    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, BCRYPT_DUMMY_HASH);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is inactive");
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError("Please verify your email before logging in");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { token: refreshToken } = generateRefreshToken(user.id);

    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
      registrationNumber: user.registrationNumber,
      isVerifiedInstitution: user.isVerifiedInstitution,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(incomingToken: string) {
    let decoded;

    try {
      decoded = verifyRefreshToken(incomingToken);
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const tokenHash = hashRefreshToken(incomingToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.userId !== decoded.userId) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: decoded.userId,
        },
        data: {
          isRevoked: true,
        },
      });

      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      throw new UnauthorizedError("Refresh token has expired");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    /*
     * Atomically consume the refresh token.
     *
     * Only one request can change this particular token
     * from isRevoked=false to isRevoked=true.
     */
    const consumedToken = await prisma.refreshToken.updateMany({
      where: {
        id: storedToken.id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    if (consumedToken.count !== 1) {
      /*
       * Another request already consumed this token.
       * This indicates refresh-token reuse.
       */
      await prisma.refreshToken.updateMany({
        where: {
          userId: decoded.userId,
        },
        data: {
          isRevoked: true,
        },
      });

      throw new UnauthorizedError(
        "Refresh token reuse detected. All sessions revoked.",
      );
    }

    const { token: newRefreshToken } = generateRefreshToken(user.id);

    const newTokenHash = hashRefreshToken(newRefreshToken);

    const newExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationName: true,
        registrationNumber: true,
        isVerifiedInstitution: true,
        address: true,
        city: true,
        state: true,
        country: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  async verifyEmail(token: string) {
    /*
     * The client sends the raw verification token.
     * Hash it before looking it up in the database.
     */
    const tokenHash = hashVerificationToken(token);

    const record = await prisma.emailVerificationToken.findUnique({
      where: {
        token: tokenHash,
      },
    });

    if (!record) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    /*
     * Atomically mark the verification token as used.
     *
     * Only one request can change this token from
     * isUsed=false to isUsed=true.
     */
    const consumedToken = await prisma.emailVerificationToken.updateMany({
      where: {
        id: record.id,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    if (consumedToken.count !== 1) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    await prisma.user.update({
      where: {
        id: record.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: record.userId,
      },
      select: {
        email: true,
        firstName: true,
      },
    });

    if (user) {
      sendWelcomeEmail(user.email, user.firstName).catch(() => {});
    }

    return {
      message: "Email verified successfully",
    };
  }

  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    /*
     * Do not reveal whether an email address exists.
     */
    if (!user) {
      return {
        message: "If the email exists, a verification link has been sent",
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestError("Email is already verified");
    }

    const verificationToken = randomUUID();

    const verificationTokenHash = hashVerificationToken(verificationToken);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      /*
       * Invalidate every previous unused verification token
       * before creating the new one.
       */
      await tx.emailVerificationToken.updateMany({
        where: {
          userId: user.id,
          isUsed: false,
        },
        data: {
          isUsed: true,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          token: verificationTokenHash,
          expiresAt,
        },
      });
    });

    /*
     * Only the raw token is sent to the user.
     * The database contains only its hash.
     */
    sendVerificationEmail(user.email, user.firstName, verificationToken).catch(
      () => {},
    );

    return {
      message: "If the email exists, a verification link has been sent",
    };
  }
}

export const authService = new AuthService();
