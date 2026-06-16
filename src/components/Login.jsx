import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);

  // ── SESSION PERSISTENCE ──
  // If a valid token already exists in localStorage, skip login and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      if (savedRole === "management") {
        navigate("/management", { replace: true });
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user) navigate("/user1", { state: { user }, replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint =
        role === "management" ? "/managers/login" : "/users/login";

      const res = await API.post(endpoint, { email, password });
      const data = res.data;

      // ── STORE SESSION ──
      // Save JWT token returned from backend
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save role so session persistence check above works on next visit
      localStorage.setItem("role", role === "management" ? "management" : "user");

      if (role === "management") {
        // Store manager data for session
        localStorage.setItem("user", JSON.stringify(data.manager));
        navigate("/management", { replace: true });
      } else {
        // Store user data for session
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/user1", { state: { user: data.user }, replace: true });
      }
    } catch (err) {
      // Show actual server error message if available
      const serverMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // Allow login on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
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

          <div className="space-y-5">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
            />

            {/* Password with show/hide toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 pr-16 rounded-full bg-[#dbd9d5]/50 placeholder-[#56473a]/70 text-[#56473a] outline-none focus:ring-2 focus:ring-[#199b74] shadow-lg transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#56473a]/70 hover:text-[#199b74] transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 font-medium text-sm px-2">{error}</p>
            )}

            {/* Login button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#199b74] text-[#dbd9d5] font-semibold hover:bg-[#56473a] transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          {role !== "management" && (
            <p className="mt-6 text-[#56473a] text-sm">
              Don't have an account?{" "}
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