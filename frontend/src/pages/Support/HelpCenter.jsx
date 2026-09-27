import { Link } from "react-router-dom";

const HelpCenter = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      description:
        "Learn how to create your BloodLink account, complete your profile, and get started with the platform.",
    },
    {
      title: "Donor Support",
      description:
        "Find information about managing your donor profile, updating your blood type, availability, and donation details.",
    },
    {
      title: "Blood Requests",
      description:
        "Hospitals can learn how to create and manage blood requests, track request status, and review available blood information.",
    },
    {
      title: "Account & Profile",
      description:
        "Update your personal information, manage your account, and keep your BloodLink profile up to date.",
    },
    {
      title: "Notifications",
      description:
        "Learn how BloodLink keeps you informed about blood requests, account updates, and other important activities.",
    },
    {
      title: "Need More Help?",
      description:
        "If you cannot find the information you need, contact the BloodLink support team for assistance.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-gray-800">
      {/* Hero Section */}
      <section className="bg-white/80 px-[8vw] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 font-semibold mb-3">BLOODLINK SUPPORT</p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            How can we help?
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Find answers and guidance for using BloodLink, whether you are a
            donor, hospital, or another member of the BloodLink community.
          </p>
        </div>
      </section>

      {/* Help Topics */}
      <section className="px-[8vw] py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {topic.title}
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="bg-card px-[8vw] py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                How do I become a donor?
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Create a BloodLink donor account and complete your donor
                profile. You can provide your blood type, contact information,
                location, and availability from your profile.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                How can a hospital request blood?
              </h3>

              <p className="text-gray-600 leading-relaxed">
                A registered hospital can create a blood request from its
                dashboard by providing the required blood type, urgency,
                quantity, and patient information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                How will I know about important updates?
              </h3>

              <p className="text-gray-600 leading-relaxed">
                BloodLink provides notifications for relevant account and
                blood-management activities. You can view your notifications
                from the Notifications section of your dashboard.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                What if I need urgent assistance?
              </h3>

              <p className="text-gray-600 leading-relaxed">
                BloodLink is a management and coordination platform and should
                not replace emergency medical services. For a medical emergency,
                contact the appropriate emergency or healthcare service
                immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="px-[8vw] py-16">
        <div className="max-w-4xl mx-auto bg-red-50 rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Still need help?
          </h2>

          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            If you cannot find the information you are looking for, reach out to
            the BloodLink support team.
          </p>

          <a
            href="mailto:info@bloodlink.org"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Contact Support
          </a>
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

export default HelpCenter;
