import { Target, Eye } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-3/4">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="bg-card rounded-xl p-7 shadow-lg">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To eliminate delays in blood availability by creating a reliable
              digital bridge between blood donors and healthcare institutions,
              ensuring that no patient suffers due to shortage of blood.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card rounded-xl p-7 shadow-lg">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5">
              <Eye size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A Nigeria where every hospital can access the blood they need
              within minutes, and every willing donor can easily contribute to
              saving lives in their community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
