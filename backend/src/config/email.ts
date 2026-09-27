import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_HOST) {
  throw new Error("SMTP_HOST is not defined in environment variables");
}

if (!SMTP_USER) {
  throw new Error("SMTP_USER is not defined in environment variables");
}

if (!SMTP_PASS) {
  throw new Error("SMTP_PASS is not defined in environment variables");
}

export const emailConfig = {
  host: SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  from: process.env.EMAIL_FROM || "BloodLink <noreply@bloodlink.com>",
};

export const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth,
});
