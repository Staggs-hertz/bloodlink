const AboutHero = () => {
  return (
    <div>
      <div className="relative bg-[url('aboutImg.jpg')] bg-cover bg-center h-[30vh] md:h-[60vh] px-15 mb-5">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <h1 className="relative z-10 font-semibold text-4xl flex justify-center items-center h-full text-white">
          About Us
        </h1>
      </div>
    </div>
  );
};

export default AboutHero;
