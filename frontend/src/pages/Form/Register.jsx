import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api.js";
import { Eye, EyeOff, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { assets } from "../../assets/assets";

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "One uppercase letter (A–Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter (a–z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "One number (0–9)",
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: "One special character (e.g. !@#$%)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "DONOR",
    organizationName: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const passwordIsValid = passwordRequirements.every((requirement) =>
      requirement.test(formData.password),
    );

    if (!passwordIsValid) {
      setError("Please meet all the password requirements listed below.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please check both password fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "HOSPITAL") {
        if (formData.organizationName) {
          payload.organizationName = formData.organizationName;
        }

        if (formData.registrationNumber) {
          payload.registrationNumber = formData.registrationNumber;
        }

        if (formData.city) payload.city = formData.city;
        if (formData.state) payload.state = formData.state;
        if (formData.address) payload.address = formData.address;
        if (formData.country) payload.country = formData.country;
      }

      await api.register(payload);

      setSuccess(
        "Account created successfully! Please check your email to verify your account.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isHospital = formData.role === "HOSPITAL";

  const errorMessages = error
    ? error
        .split("\n")
        .map((message) => message.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center max-md:w-10/12 m-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm hover:text-foreground transition-colors mb-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src={assets.logo_light} alt="BloodLink logo" />
            </div>
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100 sm:px-10">
            {errorMessages.length > 0 && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="font-semibold">
                      Please check your information
                    </p>

                    {errorMessages.length === 1 ? (
                      <p className="mt-1">{errorMessages[0]}</p>
                    ) : (
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {errorMessages.map((message, index) => (
                          <li key={`${message}-${index}`}>{message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg"
              >
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  I want to register as
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="DONOR">Donor</option>
                  <option value="HOSPITAL">
                    Hospital / Healthcare Institution
                  </option>
                </select>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isHospital ? "Contact First Name" : "First Name"}
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    maxLength={50}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isHospital ? "Contact Last Name" : "Last Name"}
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    maxLength={50}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {isHospital && (
                <p className="text-xs text-gray-500">
                  Enter the name of the person who will manage this hospital
                  account.
                </p>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="mt-2 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      aria-invalid={
                        formData.confirmPassword.length > 0 &&
                        formData.password !== formData.confirmPassword
                      }
                      className="block w-full px-3 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {formData.confirmPassword.length > 0 && (
                    <p
                      className={`mt-2 text-xs ${
                        formData.password === formData.confirmPassword
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {formData.password === formData.confirmPassword
                        ? "Passwords match."
                        : "Passwords do not match."}
                    </p>
                  )}
                </div>

                <p className="mt-2 text-xs font-medium text-gray-600">
                  Your password must contain:
                </p>

                <ul className="mt-2 space-y-1.5">
                  {passwordRequirements.map((requirement) => {
                    const passed = requirement.test(formData.password);
                    const hasTypedPassword = formData.password.length > 0;
                    const RequirementIcon =
                      passed && hasTypedPassword ? CheckCircle2 : Circle;

                    return (
                      <li
                        key={requirement.label}
                        className={`flex items-center gap-2 text-xs ${
                          passed && hasTypedPassword
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        <RequirementIcon size={15} />
                        {requirement.label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Hospital fields */}
              {isHospital && (
                <>
                  <div>
                    <label
                      htmlFor="organizationName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hospital / Institution Name *
                    </label>

                    <input
                      id="organizationName"
                      type="text"
                      name="organizationName"
                      autoComplete="organization"
                      required
                      maxLength={150}
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="e.g. Lagos University Teaching Hospital"
                      className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registrationNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Registration Number
                    </label>

                    <input
                      id="registrationNumber"
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Official registration number"
                      maxLength={100}
                      className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      type="text"
                      name="address"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleChange}
                      maxLength={200}
                      placeholder="Street address"
                      className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleChange}
                        maxLength={100}
                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        type="text"
                        name="state"
                        autoComplete="address-level1"
                        value={formData.state}
                        onChange={handleChange}
                        maxLength={100}
                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      type="text"
                      name="country"
                      autoComplete="country-name"
                      value={formData.country}
                      onChange={handleChange}
                      maxLength={100}
                      className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
