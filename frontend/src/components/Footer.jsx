import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import { assets } from "../assets/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-800 bg-white/80 flex flex-col items-center gap-5 pt-5 pb-5 px-[8vw]">
      <div className="w-full gap-20 grid grid-cols-[2fr_1fr_1fr_1fr] max-md:flex max-md:flex-col max-md:gap-8 *:pt-10 *:max-md:pt-1">
        {/* Footer Content */}
        <div className="flex flex-col gap-5">
          <img src={assets.logo_light} className="w-22" alt="BloodLink logo" />

          <p className="leading-7 max-w-md">
            Connect donors with those in need. Join our community and help save
            lives through the gift of blood donation.
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="BloodLink on Facebook"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              aria-label="BloodLink on X"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
            >
              <FaXTwitter size={16} />
            </a>

            <a
              href="#"
              aria-label="BloodLink on LinkedIn"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-start gap-5">
          <h2 className="font-semibold text-xl text-gray-700">Quick Links</h2>

          <ul className="space-y-2.5">
            <li>
              <Link to="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-red-600 transition-colors"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link to="/faq" className="hover:text-red-600 transition-colors">
                FAQs
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="hover:text-red-600 transition-colors"
              >
                Become a Donor
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col items-start gap-5">
          <h2 className="font-semibold text-xl text-gray-700">Support</h2>

          <ul className="space-y-2.5">
            <li>
              <Link to="/help" className="hover:text-red-600 transition-colors">
                Help Center
              </Link>
            </li>

            <li>
              <Link
                to="/emergency-contacts"
                className="hover:text-red-600 transition-colors"
              >
                Emergency Contacts
              </Link>
            </li>

            <li>
              <Link
                to="/medical-guidelines"
                className="hover:text-red-600 transition-colors"
              >
                Medical Guidelines
              </Link>
            </li>

            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-red-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link
                to="/terms"
                className="hover:text-red-600 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-start gap-5">
          <h2 className="font-semibold text-xl text-gray-700">Contact Us</h2>

          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <FaPhone className="text-red-600 shrink-0" size={15} />
              <a
                href="tel:+2340000000000"
                className="hover:text-red-600 transition-colors"
              >
                +234 000 000 0000
              </a>
            </li>

            <li className="flex items-center gap-3">
              <FaEnvelope className="text-red-600 shrink-0" size={15} />
              <a
                href="mailto:info@bloodlink.org"
                className="hover:text-red-600 transition-colors"
              >
                info@bloodlink.org
              </a>
            </li>

            <li className="flex items-start gap-3">
              <FaLocationDot className="text-red-600 shrink-0 mt-1" size={15} />
              <span>Nigeria</span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="w-full border-gray-200" />

      <p className="text-sm text-center text-gray-500">
        Copyright {currentYear} @ BloodLink. All Rights Reserved. Save lives
        through blood donation.
      </p>
    </footer>
  );
};

export default Footer;
