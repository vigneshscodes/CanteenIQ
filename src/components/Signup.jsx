import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logofinalbg0.png";
import LoginBG from "../assets/loginbgtemp.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Get role from LandingPage
  const role = location.state?.role || "user";

  useEffect(() => {
    if (role === "management") {
      setError("Management accounts cannot sign up. Please contact admin.");
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
  const { name, contact, email, password } = formData;

  // Basic validation
  if (!name || !contact || !email || !password) {
    setError("All fields are required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: name,
        contactnumber: contact,
        email,
        passwordhash: password, // In production, hash with bcrypt
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Signup failed");
    }

    setSuccess("Signup successful! Redirecting to login...");
    setError("");
    setTimeout(() => navigate("/login", { state: { role } }), 2000);
  } catch (err) {
    setError(err.message);
    setSuccess("");
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins transition-opacity duration-500 ease-in-out opacity-100"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-[90%] max-w-3xl min-h-[500px] rounded-3xl overflow-hidden border border-[#dbd9d5]/40 shadow-2xl">
        {/* Left side - Signup Form */}
        <div className="w-1/2 bg-[#dbd9d5]/95 p-10 flex flex-col justify-center shadow-inner">
          <h1 className="text-3xl font-bold text-[#56473a] mb-6 tracking-wide">
            Sign Up
          </h1>

          {error && (
            <div className="text-red-600 font-medium bg-red-100 p-3 rounded-lg shadow-md text-center mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-700 font-medium bg-green-100 p-3 rounded-lg shadow-md text-center mb-4">
              {success}
            </div>
          )}

          {role !== "management" && (
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Set Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
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
                onClick={handleSignup}
                className="w-full py-3 rounded-full bg-[#199b74] text-[#dbd9d5] font-semibold hover:bg-[#56473a] transition-all duration-300 shadow-lg"
              >
                Sign Up
              </button>
            </form>
          )}

          <p className="mt-6 text-[#56473a] text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ role }}
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
