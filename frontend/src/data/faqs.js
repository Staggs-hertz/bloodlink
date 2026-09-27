export const faqs = [
  // For Donors
  {
    category: "For Donors",
    question: "Who can donate blood?",
    answer:
      "Anyone between the ages of 17 and 65 who weighs at least 50kg and is in good general health can donate. Certain medical conditions, medications, or recent travel may temporarily defer you. BloodLink checks your eligibility profile before allowing you to schedule a donation.",
  },
  {
    category: "For Donors",
    question: "How often can I donate blood?",
    answer:
      "You must wait at least 56 days (8 weeks) between whole blood donations. This is enforced automatically by BloodLink — your next eligible date is displayed on your donor dashboard after each completed donation.",
  },
  {
    category: "For Donors",
    question: "What should I do before donating?",
    answer:
      "Drink at least 500ml of water before your appointment. Eat a healthy iron-rich meal and avoid fatty foods. Get a full night's sleep and avoid alcohol for 24 hours before donating. Wear a short-sleeved or loose-fitting top.",
  },
  {
    category: "For Donors",
    question: "Will donating blood affect my health?",
    answer:
      "No. Your body replaces donated plasma within 24 hours and red blood cells within 4–6 weeks. The process uses sterile, single-use needles — there is zero risk of infection from donating.",
  },

  // For Recipients
  {
    category: "For Recipients",
    question: "How do I submit a blood request?",
    answer:
      'After verifying your account, navigate to "Blood Requests" and click "Submit Request." Provide the required blood type, number of units, hospital name, urgency level, and the date by which blood is needed. Requests are reviewed and processed by BloodLink administrators.',
  },
  {
    category: "For Recipients",
    question: "How long does it take to fulfill a blood request?",
    answer:
      "Normal urgency requests are typically fulfilled within 24–72 hours. Urgent requests are prioritized and usually processed within 12–24 hours. Critical requests are flagged immediately and escalate to all eligible matching donors in the system.",
  },
  {
    category: "For Recipients",
    question: "Can I track the status of my request?",
    answer:
      "Yes. Your Blood Requests dashboard shows the real-time status of every request — Pending, Approved, Fulfilled, or Cancelled — along with units provided versus units needed.",
  },

  // General
  {
    category: "General",
    question: "What is BloodLink?",
    answer:
      "BloodLink is a blood donation management system that connects voluntary blood donors with patients and medical facilities in need. It handles scheduling, inventory tracking, request management, and donor-recipient matching — all in one platform.",
  },
  {
    category: "General",
    question: "Which blood types does BloodLink support?",
    answer:
      "BloodLink supports all eight standard blood types: A+, A−, B+, B−, AB+, AB−, O+, and O−. The inventory dashboard tracks real-time availability for each type.",
  },

  // Account & Safety
  {
    category: "Account & Safety",
    question: "Why do I need to verify my email?",
    answer:
      "Email verification confirms your identity and ensures that critical notifications — donation reminders, blood request alerts, password resets — reach the right person. You cannot schedule donations or submit blood requests until your email is verified.",
  },
  {
    category: "Account & Safety",
    question: "How is my personal health data protected?",
    answer:
      "All health-related data is encrypted at rest and in transit. BloodLink does not share your personal information with third parties. Only verified administrators can access donor health screening records, and only when operationally necessary.",
  },
  {
    category: "Account & Safety",
    question: "What if I forget my password?",
    answer:
      'Click "Forgot Password" on the login page and enter your registered email. You\'ll receive a secure reset link valid for one hour. If you don\'t receive it within a few minutes, check your spam folder or use "Resend Verification" on the login page.',
  },
];

export const faqCategories = ["All", ...new Set(faqs.map((f) => f.category))];
