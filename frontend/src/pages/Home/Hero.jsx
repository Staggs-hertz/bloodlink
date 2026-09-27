import Button from "../../components/Button";

const Hero = () => {
  return (
    <div className="h-[80vh] flex justify-center flex-col items-center text-center max-md:w-full w-4/5 mx-auto pb-0">
      <h1 className="text-5xl font-bold pb-5 max-md:w-10/12 bg-linear-to-r from-red-500 via-red-500 to-[#F73397] bg-clip-text text-transparent">
        Save Lives Through Blood Donation
      </h1>
      <p className="text-lg w-[50%] max-md:w-10/12 text-gray-600">
        Connect donors with those in need. Join our community and help save
        lives through the gift of blood donation.
      </p>
      <div className="mt-10">
        <Button text="Starting Saving Lives" />
      </div>
    </div>
  );
};

export default Hero;
