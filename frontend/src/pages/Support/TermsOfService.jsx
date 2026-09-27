import { Link } from "react-router-dom";

const TermsOfService = () => {
  const lastUpdated = "September 2026";

  return (
    <div className="min-h-screen bg-secondary text-gray-800">
      {/* Hero Section */}
      <section className="bg-white px-[8vw] py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600 font-semibold mb-3">BLOODLINK</p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            Terms of Service
          </h1>

          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="px-[8vw] py-14">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
          {/* Introduction */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Acceptance of These Terms
            </h2>

            <p className="text-gray-600 leading-relaxed">
              These Terms of Service describe the general rules for using the
              BloodLink platform. By creating an account or using BloodLink, you
              agree to use the platform responsibly and in accordance with these
              terms.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              If you do not agree with these terms, you should not use the
              BloodLink platform.
            </p>
          </div>

          {/* About BloodLink */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. About BloodLink
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink is a blood donation management platform designed to
              support the coordination of blood donors, registered hospitals,
              blood requests, notifications, and blood inventory information.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              BloodLink is a technology platform and does not replace hospitals,
              doctors, nurses, emergency services, blood banks, or other
              qualified healthcare professionals.
            </p>
          </div>

          {/* Eligibility */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Account Eligibility
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Users must provide accurate information when creating an account
              and must meet any applicable requirements for the role they
              select. Hospital accounts may be subject to additional
              verification before accessing certain institutional functions.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              BloodLink administrators may restrict, suspend, or deactivate
              accounts when there are reasonable grounds to believe that an
              account is being used improperly or in violation of these terms.
            </p>
          </div>

          {/* Account Security */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Account Security
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their
              account credentials and for activities carried out through their
              accounts.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              If you believe that someone has gained unauthorized access to your
              account, you should take appropriate steps to secure the account
              and notify the BloodLink support or administrative team.
            </p>
          </div>

          {/* Donor Responsibilities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Donor Responsibilities
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Donors using BloodLink agree to:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Provide accurate information about their donor profile.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Keep their blood type, contact information, location, and
                  availability information reasonably up to date.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Only indicate availability when they are genuinely willing and
                  able to respond to a blood donation request.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Follow the instructions and eligibility requirements of the
                  qualified healthcare or blood donation facility.
                </span>
              </li>
            </ul>
          </div>

          {/* Hospital Responsibilities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Hospital Responsibilities
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Registered hospitals are responsible for:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Providing accurate institutional information during
                  registration.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Submitting legitimate blood requests through the platform.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Ensuring that information submitted in blood requests is
                  accurate and appropriate for the intended purpose.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Using patient-related information responsibly and only when
                  authorized to provide it.
                </span>
              </li>
            </ul>
          </div>

          {/* Prohibited Use */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Prohibited Activities
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Users must not use BloodLink to:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Create false or misleading accounts or provide intentionally
                  inaccurate information.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Submit fraudulent, malicious, or unauthorized blood requests.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Access another user's account or information without
                  authorization.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Attempt to bypass authentication, authorization, or other
                  security controls.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Interfere with the normal operation or availability of the
                  BloodLink platform.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Use BloodLink for unlawful, harmful, or abusive activities.
                </span>
              </li>
            </ul>
          </div>

          {/* Blood Donation Disclaimer */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. Blood Donation and Medical Disclaimer
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink provides technology for managing and coordinating blood
              donation information. The platform does not determine whether a
              person is medically fit to donate blood and does not replace the
              screening or professional judgment of qualified healthcare
              personnel.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Donors must follow the medical guidance and eligibility
              requirements provided by the relevant blood donation centre or
              healthcare professional.
            </p>
          </div>

          {/* Blood Requests */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Blood Requests and Matching
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink may use information submitted by authorized users to
              support blood request processing and donor matching. A match,
              notification, or request status shown by the platform does not by
              itself guarantee the availability of blood, the availability of a
              donor, or the successful completion of a donation.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Hospitals and donors remain responsible for following appropriate
              professional and operational procedures outside the platform.
            </p>
          </div>

          {/* Platform Availability */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Platform Availability
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink is intended to provide reliable access to its features,
              but uninterrupted availability cannot be guaranteed. The platform
              may occasionally be unavailable because of maintenance, updates,
              technical problems, network issues, or circumstances outside the
              control of the platform administrators.
            </p>
          </div>

          {/* Account Suspension */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Account Suspension or Termination
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink administrators may suspend, restrict, or deactivate an
              account where necessary to protect users, maintain platform
              security, investigate suspected misuse, or enforce these terms.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Users may also stop using the platform at any time. Where account
              deletion or data removal is supported, requests may be handled
              according to the platform's applicable procedures.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Intellectual Property
            </h2>

            <p className="text-gray-600 leading-relaxed">
              The BloodLink name, branding, interface design, software,
              documentation, and other original platform materials are protected
              by applicable intellectual property rights unless otherwise
              stated.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              Users may not copy, modify, distribute, or commercially exploit
              protected BloodLink materials without appropriate authorization.
            </p>
          </div>

          {/* Limitation */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              13. Limitation of Responsibility
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink is provided as a technology platform for blood donation
              management and coordination. Users remain responsible for the
              accuracy of information they provide and for decisions made
              outside the platform. Medical decisions, emergency responses,
              donor eligibility decisions, and clinical procedures should be
              handled by appropriately qualified professionals.
            </p>
          </div>

          {/* Changes */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              14. Changes to These Terms
            </h2>

            <p className="text-gray-600 leading-relaxed">
              These Terms of Service may be updated as BloodLink develops,
              introduces new features, or changes how the platform operates. An
              updated version should include a revised date so that users can
              identify when the terms were last changed.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              15. Contact Us
            </h2>

            <p className="text-gray-600 leading-relaxed">
              If you have questions about these Terms of Service or need
              assistance with your BloodLink account, contact the BloodLink
              support team.
            </p>

            <a
              href="mailto:info@bloodlink.org"
              className="inline-block mt-5 text-red-600 font-medium hover:underline"
            >
              info@bloodlink.org
            </a>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center pb-12">
        <Link to="/" className="text-red-600 font-medium hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsOfService;
