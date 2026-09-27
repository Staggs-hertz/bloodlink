import { Shield, Zap, Users, HeartHandshake } from "lucide-react";

const values = [
  {
    title: "Trust & Safety",
    description:
      "We verify institutions and protect donor information with the highest standards.",
    icon: Shield,
  },
  {
    title: "Speed",
    description:
      "Every second counts. Our platform is built for rapid matching and response.",
    icon: Zap,
  },
  {
    title: "Community",
    description:
      "We believe in the power of people helping people within their own cities.",
    icon: Users,
  },
  {
    title: "Compassion",
    description:
      "Everything we build is driven by the desire to save lives and support families.",
    icon: HeartHandshake,
  },
];

const OurValues = () => {
  return (
    <section className="py-10 md:py-15 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-10/12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Core Values
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The principles that guide everything we do at BloodLink.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-lg p-6 text-center shadow-lg hover:scale-105 transition-transform duration-500"
            >
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <value.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
