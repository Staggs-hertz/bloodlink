import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const lastUpdated = "September 2026";

  return (
    <div className="min-h-screen bg-secondary text-gray-800">
      {/* Hero Section */}
      <section className="bg-white px-[8vw] py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600 font-semibold mb-3">BLOODLINK</p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            Privacy Policy
          </h1>

          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="px-[8vw] py-14">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
          {/* Introduction */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Introduction
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink is a blood donation management platform designed to
              support communication and coordination between blood donors and
              registered hospitals. This Privacy Policy explains the types of
              information that may be collected through the platform, how that
              information is used, and the steps taken to protect it.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              By using BloodLink, you acknowledge that information provided
              through the platform may be processed for the purposes described
              in this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Information We Collect
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Depending on how you use BloodLink, the platform may collect
              information such as:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Basic account information such as your name and email address.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Donor information such as blood type, gender, date of birth,
                  phone number, location, and availability.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Hospital information such as organization name, registration
                  details, address, and contact information.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Blood request information submitted by registered hospitals,
                  including blood type, urgency, units requested, and relevant
                  patient or request details.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Account activity and notification information generated while
                  using the platform.
                </span>
              </li>
            </ul>
          </div>

          {/* How We Use Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. How We Use Information
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Information collected through BloodLink may be used to:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Create and manage user accounts.</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Authenticate users and maintain account security.</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Support blood donor matching and blood request management.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Send relevant notifications and account-related
                  communications.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Maintain, monitor, and improve the functionality of the
                  BloodLink platform.
                </span>
              </li>
            </ul>
          </div>

          {/* Donor Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Donor Information
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Donor information is used to support blood donation coordination.
              Information such as blood type, availability, and location may be
              used to identify potentially suitable donors for relevant blood
              requests. Users should only provide information that is accurate
              and appropriate for use on the platform.
            </p>
          </div>

          {/* Hospital Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Hospital Information
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Hospital accounts may provide organization and registration
              information to support institutional verification and blood
              request management. Hospital information may be reviewed by
              authorized BloodLink administrators for account and platform
              management purposes.
            </p>
          </div>

          {/* Patient Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Patient and Blood Request Information
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Registered hospitals may submit information associated with a
              blood request, including patient-related information required by
              the system. Hospitals are responsible for ensuring that they have
              the appropriate authorization to provide such information through
              the platform and should avoid submitting unnecessary information.
            </p>
          </div>

          {/* Information Sharing */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Information Sharing
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink is designed to make relevant information available to
              authorized users for legitimate blood donation and request
              management activities. Access to information is intended to be
              controlled according to user roles and system permissions.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              BloodLink does not intend to make personal information publicly
              available. Information may be disclosed when necessary to operate
              the platform, protect users, comply with applicable obligations,
              or respond to legitimate requests from authorized parties.
            </p>
          </div>

          {/* Account Security */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. Account Security
            </h2>

            <p className="text-gray-600 leading-relaxed">
              BloodLink uses authentication and access-control mechanisms to
              help protect user accounts and restrict access to authorized
              functions. Users are responsible for keeping their account
              credentials confidential and should notify the appropriate
              administrator if they believe their account has been compromised.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Data Retention
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Information may be retained for as long as necessary to support
              account management, blood request records, platform operation,
              security, and other legitimate operational purposes. Specific
              retention periods may depend on the type of information and the
              requirements applicable to the BloodLink deployment.
            </p>
          </div>

          {/* User Responsibilities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. User Responsibilities
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Users are expected to:
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Provide accurate information when creating and maintaining an
                  account.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Keep login credentials secure.</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Avoid submitting unnecessary or inappropriate personal
                  information.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  Use the platform only for legitimate blood donation and
                  blood-management purposes.
                </span>
              </li>
            </ul>
          </div>

          {/* Changes to Policy */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Changes to This Privacy Policy
            </h2>

            <p className="text-gray-600 leading-relaxed">
              This Privacy Policy may be updated when the BloodLink platform,
              its features, or its information-handling practices change. Any
              updated version should include a revised date so that users can
              identify when the policy was last changed.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Contact Us
            </h2>

            <p className="text-gray-600 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or the
              handling of information on BloodLink, contact the BloodLink
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

export default PrivacyPolicy;
