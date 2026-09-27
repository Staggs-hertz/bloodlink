import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { jwtConfig } from "../config/jwt";

const JWT_ALGORITHM = "HS256" as const;

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  type: "access";
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  type: "refresh";
}

export const generateAccessToken = (payload: {
  userId: string;
  email: string;
  role: string;
}): string => {
  const tokenPayload: AccessTokenPayload = {
    ...payload,
    type: "access",
  };

  return jwt.sign(tokenPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithm: JWT_ALGORITHM,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (
  userId: string,
): {
  token: string;
  tokenId: string;
} => {
  const tokenId = randomUUID();

  const tokenPayload: RefreshTokenPayload = {
    userId,
    tokenId,
    type: "refresh",
  };

  const token = jwt.sign(tokenPayload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithm: JWT_ALGORITHM,
  } as jwt.SignOptions);

  return {
    token,
    tokenId,
  };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, jwtConfig.accessSecret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithms: [JWT_ALGORITHM],
  }) as AccessTokenPayload;

  if (
    decoded.type !== "access" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, jwtConfig.refreshSecret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithms: [JWT_ALGORITHM],
  }) as RefreshTokenPayload;

  if (
    decoded.type !== "refresh" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.tokenId !== "string"
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
};
