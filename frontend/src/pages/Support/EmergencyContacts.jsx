import { Link } from "react-router-dom";

const EmergencyContacts = () => {
  const emergencyServices = [
    {
      title: "General Emergency",
      description:
        "For immediate emergencies requiring urgent assistance, contact the appropriate emergency service in your area.",
      contact: "112",
      action: "tel:112",
      actionText: "Call 112",
    },
    {
      title: "Nearest Hospital",
      description:
        "For serious medical situations, contact or visit the nearest suitable hospital or emergency department.",
      contact: "Nearest hospital",
      action: null,
      actionText: null,
    },
    {
      title: "BloodLink Support",
      description:
        "For questions about your BloodLink account, blood requests, or platform-related issues.",
      contact: "info@bloodlink.org",
      action: "mailto:info@bloodlink.org",
      actionText: "Email Support",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-gray-800">
      {/* Hero Section */}
      <section className="bg-card px-[8vw] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 font-semibold mb-3">BLOODLINK SUPPORT</p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            Emergency Contacts
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Important contact information for situations that require urgent
            assistance or support while using BloodLink.
          </p>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="px-[8vw] pt-12">
        <div className="max-w-5xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-red-700 mb-3">
            Medical Emergency?
          </h2>

          <p className="text-gray-700 leading-relaxed">
            BloodLink is a blood donation and request management platform. It
            does not replace emergency medical services, hospitals, doctors, or
            other qualified healthcare professionals. If someone is experiencing
            a life-threatening emergency, seek immediate professional medical
            assistance.
          </p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="px-[8vw] py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Important Contacts
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyServices.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-5">
                  {service.description}
                </p>

                <div className="mt-auto">
                  <p className="text-lg font-semibold text-red-600 mb-4">
                    {service.contact}
                  </p>

                  {service.action && (
                    <a
                      href={service.action}
                      className="inline-block bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      {service.actionText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Seek Emergency Help */}
      <section className="bg-white px-[8vw] py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            When to Seek Emergency Help
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            Seek immediate professional medical attention when a person has a
            serious or potentially life-threatening condition. Examples may
            include:
          </p>

          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Severe or uncontrolled bleeding.</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Loss of consciousness or an unresponsive person.</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Severe difficulty breathing.</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Serious injuries or situations requiring immediate medical
                attention.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Any situation where you believe someone's life may be in
                immediate danger.
              </span>
            </li>
          </ul>

          <p className="text-gray-600 leading-relaxed mt-6">
            These examples are not a complete list. When in doubt, seek
            professional medical assistance rather than relying on the BloodLink
            platform.
          </p>
        </div>
      </section>

      {/* BloodLink Request Reminder */}
      <section className="px-[8vw] py-14">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Need to manage a blood request?
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            Registered hospitals can use BloodLink to create and monitor blood
            requests through their dashboard.
          </p>

          <Link
            to="/login"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go to BloodLink
          </Link>
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

export default EmergencyContacts;
