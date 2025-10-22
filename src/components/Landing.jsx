import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logofinalbg0.png";
import LoginBG from "../assets/loginbgtemp.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const handleRoleSelection = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#dbd9d5] font-poppins" style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Logo Circle */}
      <div className="w-60 h-60 rounded-full bg-[#e5b141] flex items-center justify-center shadow-xl mb-1">
        <img
          src={Logo}
          alt="Logo"
          className="w-40 h-40"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <p className="mt-2 mb-10 text-white font-bold text-2xl">
        Smart Canteen Ordering System
      </p>
      <div className="flex flex-col gap-6 w-64">
        <button
          className="w-full py-3 rounded-full bg-[#b94419] text-white font-semibold hover:bg-[#873213] transition-all shadow-lg"
          onClick={() => handleRoleSelection("user")}
        >
          User
        </button>
        <button
          className="w-full py-3 rounded-full bg-[#b94419] text-white font-semibold hover:bg-[#873213] transition-all shadow-lg"
          onClick={() => handleRoleSelection("management")}
        >
          Management
        </button>
      </div>
    </div>
  );
}
