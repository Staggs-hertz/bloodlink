export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  issuer: "bloodlink-api",
  audience: "bloodlink-client",
};

if (!jwtConfig.accessSecret || !jwtConfig.refreshSecret) {
  throw new Error("JWT secrets are not defined in environment variables");
}
