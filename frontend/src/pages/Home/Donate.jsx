import { Btn } from "../../components/Btn";

const Donate = () => {
  return (
    <div className="bg-red-600 w-full h-90 flex flex-col justify-center items-center text-center">
      <h2 className="text-white text-3xl max-md:w-10/12 font-bold pb-5">
        Ready to Give Hope? Become a Blood Donor Today.
      </h2>
      <p className="text-white text-md max-md:w-10/12 pb-5">
        Join our community of heroes and start making a difference. Your
        donation can save lives.
      </p>
      <Btn to="/register" variant="pale">
        Become a donor
      </Btn>
    </div>
  );
};

export default Donate;
