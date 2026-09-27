// import { assets } from "../assets/assets";

const StatTab = ({ title, icon, stat, subtitle, color }) => {
  return (
    <div className="bg-[#FEF2F4] p-5 rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-400">
      <div className="flex justify-between pb-6">
        <p className="font-semibold">{title}</p>
        <img src={icon} alt="" className="w-5" />
      </div>
      <p className={`text-left text-xl font-semibold ${color}`}>{stat}</p>
      <small className="text-gray-500">{subtitle}</small>
    </div>
  );
};

export default StatTab;
