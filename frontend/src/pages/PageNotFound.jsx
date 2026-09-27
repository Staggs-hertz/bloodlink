import { Btn } from "../components/Btn";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PageNotFound = () => {
  return (
    <div className="h-dvh bg-secondary relative">
      <Navbar />
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <h1 className="text-[250px] font-bold absolute m-auto text-white/70">
          404
        </h1>
        <h2 className="text-3xl text-primary font-semibold z-10">
          Page not found
        </h2>
        <p className="z-10">
          The page you are looking for doesn't exist or an error occured
        </p>
        <div className="z-10 pt-7">
          <Btn to="/" variant="red">
            Go to Home
          </Btn>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PageNotFound;
