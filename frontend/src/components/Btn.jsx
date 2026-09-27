import { useNavigate } from "react-router-dom";

export function Btn({
  to,
  variant = "red", // 'red' | 'pale'
  children,
  onClick,
  className = "",
  ...props
}) {
  const navigate = useNavigate();

  // Base layout and transition styles
  const baseStyles =
    "px-6 py-2 rounded-md hover:scale-105 transition-transform duration-300 focus:outline-none";

  // Variant class mappings
  const variantStyles = {
    red: "bg-linear-to-r from-red-500 via-red-500 to-[#F73397] text-white text-lg",
    pale: "bg-secondary text-red-500 text-lg font-semibold",
  };

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.solid} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
