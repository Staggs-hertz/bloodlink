import { assets } from "../../assets/assets";
import StatTab from "../../components/StatTab";

const Stats = () => {
  return (
    <div className="flex w-4/5 mx-auto justify-between gap-5 max-md:flex-col mb-10">
      <StatTab
        title={"Total Requests"}
        stat={1021}
        subtitle={"+10% from last month"}
        icon={assets.users_two}
        color={"text-primary"}
      />
      <StatTab
        title={"Completed Donations"}
        stat={200}
        subtitle={"+8% from last month"}
        icon={assets.heart_icon}
        color={"text-[#F73397]"}
      />
      <StatTab
        title={"Active Donors"}
        stat={347}
        subtitle={"Available Now"}
        icon={assets.users_three}
        color={"text-[#00A63E]"}
      />
      <StatTab
        title={"Blood Banks"}
        stat={12}
        subtitle={"Registered Partners"}
        icon={assets.location_pin}
        color={"text-[#155DFC]"}
      />
    </div>
  );
};

export default Stats;
