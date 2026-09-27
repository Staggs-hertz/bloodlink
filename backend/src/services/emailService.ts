import { transporter, emailConfig } from "../config/email";

const BRAND_COLOR = "#DC2626";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * Escape user-provided values before inserting them into HTML.
 */
const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const baseTemplate = (title: string, bodyContent: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background-color:#f3f4f6;padding:40px 0;"
  >
    <tr>
      <td align="center">
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);"
        >
          <!-- Header -->
          <tr>
            <td
              style="background-color:${BRAND_COLOR};padding:24px 32px;text-align:center;"
            >
              <h1
                style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:0.5px;"
              >
                BloodLink
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;"
            >
              <p
                style="margin:0;color:#6b7280;font-size:12px;line-height:1.5;"
              >
                © ${new Date().getFullYear()} BloodLink. All rights reserved.<br/>
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: emailConfig.from,
      to,
      subject,
      html,
    });
  } catch (error) {
    /*
     * Email delivery should not break the main application flow.
     * Registration, verification, request approval, etc. should
     * still complete even if the email provider is temporarily
     * unavailable.
     */
    console.error(`[Email Service] Failed to send email to ${to}:`, error);
  }
};

export const sendVerificationEmail = async (
  to: string,
  firstName: string,
  token: string,
): Promise<void> => {
  /*
   * The token is intentionally NOT hashed here.
   *
   * authService stores only the hash in the database, while the
   * raw token is sent to the user's email so the frontend can
   * submit it back for verification.
   */
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const safeFirstName = escapeHtml(firstName);

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">
      Verify your email address
    </h2>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${safeFirstName},
    </p>

    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for registering with BloodLink. Please click the button below
      to verify your email address. This link will expire in
      <strong>24 hours</strong>.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a
            href="${verificationLink}"
            style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;"
          >
            Verify Email
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <a
        href="${verificationLink}"
        style="color:${BRAND_COLOR};word-break:break-all;"
      >
        ${verificationLink}
      </a>
    </p>
  `;

  await sendEmail(
    to,
    "Verify your BloodLink account",
    baseTemplate("Verify Email", body),
  );
};

export const sendWelcomeEmail = async (
  to: string,
  firstName: string,
): Promise<void> => {
  const safeFirstName = escapeHtml(firstName);

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">
      Welcome to BloodLink!
    </h2>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${safeFirstName},
    </p>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Your email has been successfully verified and your account is now active.
    </p>

    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      You can now log in and start using BloodLink to save lives.
    </p>
  `;

  await sendEmail(to, "Welcome to BloodLink", baseTemplate("Welcome", body));
};

export const sendRequestApprovalEmail = async (
  to: string,
  firstName: string,
  bloodType: string,
  units: number,
  hospitalName: string,
): Promise<void> => {
  const safeFirstName = escapeHtml(firstName);
  const safeBloodType = escapeHtml(bloodType.replace("_", " "));
  const safeHospitalName = escapeHtml(hospitalName);

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">
      Blood Request Approved
    </h2>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${safeFirstName},
    </p>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Great news! Your blood request has been approved.
    </p>

    <table
      cellpadding="0"
      cellspacing="0"
      style="margin:0 0 24px;width:100%;background-color:#f9fafb;border-radius:6px;"
    >
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 8px;color:#374151;font-size:14px;">
            <strong>Blood Type:</strong> ${safeBloodType}
          </p>

          <p style="margin:0 0 8px;color:#374151;font-size:14px;">
            <strong>Units Approved:</strong> ${units}
          </p>

          <p style="margin:0;color:#374151;font-size:14px;">
            <strong>Hospital:</strong> ${safeHospitalName}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      Please follow the instructions provided by the hospital for the next steps.
    </p>
  `;

  await sendEmail(
    to,
    "Your Blood Request Has Been Approved",
    baseTemplate("Request Approved", body),
  );
};

export const sendDonorMatchEmail = async (
  to: string,
  firstName: string,
  bloodType: string,
): Promise<void> => {
  const safeFirstName = escapeHtml(firstName);
  const safeBloodType = escapeHtml(bloodType.replace("_", " "));

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">
      You Have Been Matched!
    </h2>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${safeFirstName},
    </p>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for being a hero. You have been matched to a blood request
      that needs your help.
    </p>

    <table
      cellpadding="0"
      cellspacing="0"
      style="margin:0 0 24px;width:100%;background-color:#f9fafb;border-radius:6px;"
    >
      <tr>
        <td style="padding:16px;">
          <p style="margin:0;color:#374151;font-size:14px;">
            <strong>Blood Type Needed:</strong> ${safeBloodType}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      Please attend the designated donation center as soon as possible.
      Your donation can save a life.
    </p>
  `;

  await sendEmail(
    to,
    "You Have Been Matched to a Blood Request",
    baseTemplate("Donor Match", body),
  );
};
