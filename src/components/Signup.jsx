import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logofinalbg0.png";
import LoginBG from "../assets/loginbgtemp.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins transition-opacity duration-500 ease-in-out opacity-100"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="flex w-[90%] max-w-3xl min-h-[500px] rounded-3xl overflow-hidden border border-[#dbd9d5]/40 shadow-2xl"
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Left side - Signup Form */}
        <div className="w-1/2 bg-[#dbd9d5]/95 p-10 flex flex-col justify-center shadow-inner">
          <h1 className="text-3xl font-bold text-[#56473a] mb-6 tracking-wide">Sign Up</h1>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Set Password"
                className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg  transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#56473a]"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="button"
              className="w-full py-3 rounded-full bg-[#199b74] text-[#dbd9d5] font-semibold hover:bg-[#56473a] transition-all duration-300 shadow-lg"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-[#56473a] text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#199b74] hover:text-[#56473a] transition-colors"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right side - Logo */}
        <div className="w-1/2 flex items-center justify-center bg-[#e5b141] p-10">
          <img
            src={Logo}
            alt="Logo"
            className="w-60 h-60"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
}
