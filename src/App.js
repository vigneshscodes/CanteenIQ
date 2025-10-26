import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; 
import Signup from "./components/Signup"; 
import Landing from "./components/Landing";
import User1 from "./components/User1";
import User2 from "./components/User2";
import Management1 from "./components/Management1";
import Verify from "./components/Verify";
import Analytics from "./components/Analytics";
function App() {
  return (
    <Router>
      <div className="font-[Poppins]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user1" element={<User1 />} />
          <Route path="/user2/:orderId" element={<User2 />} />
          <Route path="/management" element={<Management1 />} />
          <Route path="/otp" element={<Verify />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
