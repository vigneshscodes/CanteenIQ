import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logofinalbg0.png";
import LoginBG from "../assets/loginbgtemp.png";
import API from "../api/api.js";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      // Determine API endpoint based on role
      const res = await API.post(
        role === "management" ? "/managers/login" : "/users/login",
        { email, password }
      );

      const data = res.data;


      // Redirect based on role
      if (role === "management") {
        navigate("/management");
      } else {
        navigate("/user1", { state: { user: data.user } });
      }
    } catch (err) {
      setError(err.message);
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
        {/* Left side - Logo */}
        <div className="w-1/2 flex items-center justify-center bg-[#e5b141] p-10">
          <img
            src={Logo}
            alt="Logo"
            className="w-60 h-60"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-1/2 bg-[#dbd9d5]/90 p-10 flex flex-col justify-center shadow-inner relative">
          <h1 className="text-3xl font-bold text-[#56473a] mb-2 tracking-wide">
            {role === "management" ? "Management Login" : "Login"}
          </h1>
          <p className="text-sm text-[#56473a]/80 mb-6">
            {role === "management"
              ? "Sign in to access management controls."
              : "Sign in to place your canteen orders."}
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />
            {/*<button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#56473a]"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>*/}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3 rounded-full bg-[#199b74] text-[#dbd9d5] font-semibold hover:bg-[#56473a] transition-all duration-300 shadow-lg"
            >
              Login
            </button>
          </form>
              
          {error && (
            <p className="mt-4 text-red-600 font-medium text-sm">{error}</p>
          )}
          {role !== "management" && (
            <p className="mt-6 text-[#56473a] text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                state={{ role }}
                className="font-semibold text-[#199b74] hover:text-[#56473a] transition-colors"
              >
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
