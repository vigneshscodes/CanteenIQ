import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; 
import Signup from "./components/Signup"; 
import Landing from "./components/Landing";
import User1 from "./components/User1";
import User2 from "./components/User2";
function App() {
  return (
    <Router>
      <div className="font-[Poppins]">
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user1" element={<User1 />} />
          <Route path="/user2/:orderId" element={<User2 />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
