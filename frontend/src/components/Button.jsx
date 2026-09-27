const Button = ({ text }) => {
  return (
    <div className="hover:scale-105 transition-transform duration-400 px-6 py-2 rounded-md bg-linear-to-r from-red-500 via-red-500 to-[#F73397]">
      <a href="#" className="text-white text-lg">
        {text}
      </a>
    </div>
  );
};

export default Button;
