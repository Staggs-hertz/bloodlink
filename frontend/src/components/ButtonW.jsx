const ButtonW = ({ text }) => {
  return (
    <div className="hover:scale-105 transition-transform duration-400 px-6 py-2 rounded-md bg-secondary">
      <a href="#" className="text-red-500 text-lg font-semibold">
        {text}
      </a>
    </div>
  );
};

export default ButtonW;
