import React from "react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black w-full py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-white text-sm font-mono">

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left">
          <li>&copy; {new Date().getFullYear()} DashCraft Products LLC.</li>
          <li>|</li>
          <li>All Rights Reserved A</li>
          <li>|</li>
          <li>
            <a
              href="#"
              className="hover:underline hover:opacity-70 transition-all duration-300 ease-in-out"
            > Terms & Conditions
            </a>
          </li>
          <li>|</li>
          <li>
            <a
              href="#"
              className="hover:underline hover:opacity-70 transition-all duration-300 ease-in-out"
            >
              Privacy Policy
            </a>
          </li>

        </ul>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://instagram.com/dapahardan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://facebook.com/dapahardan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <FaFacebookF size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
