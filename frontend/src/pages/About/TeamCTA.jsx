import { Link } from "react-router-dom";
import { Btn } from "../../components/Btn";

const TeamCTA = () => {
  return (
    <section className="py-10 md:py-16 bg-red-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Join Us in Saving Lives
        </h2>
        <p className="text-lg text-white mb-10 max-w-2xl mx-auto">
          Whether you want to donate blood or represent a hospital, BloodLink
          gives you the tools to make a real difference in your community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Btn to="/register" variant="pale">
            Get Started
          </Btn>
          <Link
            to="/login"
            className="px-8 py-3 border-2 border-gray-300 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamCTA;
