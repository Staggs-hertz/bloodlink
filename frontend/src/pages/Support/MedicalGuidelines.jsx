import { Link } from "react-router-dom";

const MedicalGuidelines = () => {
  const preparationSteps = [
    {
      title: "Get enough rest",
      description:
        "Try to get a good night's sleep before donating blood. Being well rested can help you feel more comfortable during the donation process.",
    },
    {
      title: "Eat before donating",
      description:
        "Have a normal meal before your donation and avoid donating on an empty stomach. Follow any specific dietary instructions provided by the donation centre.",
    },
    {
      title: "Stay hydrated",
      description:
        "Drink enough water before and after donating. Good hydration can help you feel better during the donation process.",
    },
    {
      title: "Bring identification",
      description:
        "Take the identification or documentation required by the blood donation centre or healthcare facility.",
    },
  ];

  const afterDonationSteps = [
    "Rest for a short period after donating and follow the instructions provided by the donation staff.",
    "Drink fluids to help replace the fluid lost during donation.",
    "Have a meal or snack after donating if one is provided or recommended.",
    "Avoid strenuous physical activity immediately after donation and follow the guidance given by the donation centre.",
    "Keep the dressing on the donation site for the period recommended by the healthcare professional.",
  ];

  const eligibilityFactors = [
    "Age and general health.",
    "Body weight and other physical requirements established by the donation centre.",
    "Recent illness, infection, or medical treatment.",
    "Current medications or recent medical procedures.",
    "Previous blood donation and the time since the last donation.",
    "Pregnancy, recent childbirth, or other circumstances that may affect eligibility.",
    "Recent travel or other circumstances that may be relevant to blood-donation safety.",
  ];

  return (
    <div className="min-h-screen bg-secondary text-gray-800">
      {/* Hero Section */}
      <section className="bg-white px-[8vw] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 font-semibold mb-3">
            BLOODLINK INFORMATION
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            Medical Guidelines
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            General information to help potential donors prepare for blood
            donation and understand what to expect before and after donating.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="px-[8vw] pt-12">
        <div className="max-w-5xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-red-700 mb-3">
            Important Medical Notice
          </h2>

          <p className="text-gray-700 leading-relaxed">
            The information on this page is provided for general educational
            purposes. It does not replace medical advice, professional
            screening, or the eligibility requirements of a qualified blood
            donation centre or healthcare professional. Final decisions about
            whether someone can donate blood should be made by qualified
            healthcare personnel.
          </p>
        </div>
      </section>

      {/* Before Donation */}
      <section className="px-[8vw] py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Before You Donate
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {preparationSteps.map((step, index) => (
              <div
                key={step.title}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-white px-[8vw] py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">
            Blood Donation Eligibility
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            Blood donation centres assess donors before each donation. The
            requirements can vary depending on local regulations, the type of
            donation, and the policies of the facility.
          </p>

          <p className="text-gray-600 leading-relaxed mb-5">
            Factors that may be considered include:
          </p>

          <ul className="space-y-4">
            {eligibilityFactors.map((factor) => (
              <li key={factor} className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              If you are unsure whether you are eligible to donate, speak with
              the staff at a qualified blood donation centre before attempting
              to donate.
            </p>
          </div>
        </div>
      </section>

      {/* During Donation */}
      <section className="px-[8vw] py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">
            During the Donation
          </h2>

          <p className="text-gray-600 leading-relaxed mb-5">
            Blood donation is performed by trained healthcare or blood donation
            personnel using appropriate equipment and procedures. Donors should
            follow the instructions given by the staff throughout the process.
          </p>

          <p className="text-gray-600 leading-relaxed">
            If you feel unwell, dizzy, uncomfortable, or experience any
            unexpected symptoms during the donation, inform the donation staff
            immediately.
          </p>
        </div>
      </section>

      {/* After Donation */}
      <section className="bg-white px-[8vw] py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            After You Donate
          </h2>

          <ul className="space-y-4">
            {afterDonationSteps.map((step) => (
              <li key={step} className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* When to Seek Medical Help */}
      <section className="px-[8vw] py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">
            When to Seek Medical Advice
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            Contact a healthcare professional if you experience concerning or
            persistent symptoms after donating blood, particularly if the
            symptoms are severe, unusual, or getting worse.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              If you believe you are experiencing a medical emergency, seek
              immediate emergency medical assistance rather than relying on
              BloodLink or information provided on this page.
            </p>
          </div>
        </div>
      </section>

      {/* BloodLink Reminder */}
      <section className="bg-white px-[8vw] py-14">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready to support someone in need?
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            If you are eligible and ready to donate, keep your BloodLink donor
            profile up to date so that you can be contacted when your blood type
            and availability are relevant to a request.
          </p>

          <Link
            to="/register"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Join BloodLink
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

export default MedicalGuidelines;
