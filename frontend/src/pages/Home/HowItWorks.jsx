import { UserPlus, Search, Heart, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create an Account",
    description:
      "Sign up as a Donor or as a Hospital/Institution in just a few minutes.",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Complete Your Profile",
    description:
      "Donors add their blood type and location. Hospitals get verified by our team.",
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Request or Donate",
    description:
      "Verified hospitals submit blood requests. Compatible donors get notified instantly.",
    icon: Search,
  },
  {
    id: 4,
    title: "Save Lives",
    description:
      "Donors respond, blood is matched, and patients receive the help they need.",
    icon: Heart,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-10/12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How BloodLink Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A simple process designed to connect donors with those in need,
            quickly and safely.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative bg-gray-50 rounded-lg p-5 shadow-lg hover:scale-105 transition-transform duration-400"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5">
                <step.icon size={24} />
              </div>

              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">
                {step.id}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <small className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
