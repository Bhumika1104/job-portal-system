import React, { useState } from "react";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLoggedIn from "./components/UserLoggedIn";
import HrLoggedIn from "./components/HrLoggedIn";
import Home from "./components/Home";   // ✅ FIX

function App() {
  const [user, setUser] = useState(null);
  const [hrId, setHrId] = useState(null);

  return (
    <Router>
      <Routes>

        {/* 👉 Home */}
        <Route 
          path="/" 
          element={
            <Home 
              setUser={setUser} 
              setHrId={setHrId} 
            />
          } 
        />

        {/* 👉 Login */}
        <Route 
          path="/login" 
          element={
            <Login 
              setUser={setUser}
              setHrId={setHrId}   // ✅ IMPORTANT FIX
            />
          } 
        />

        {/* 👉 USER */}
        <Route
          path="/user"
          element={
            user?.role === "USER" ? (
              <UserLoggedIn 
                user={user}
                // userId={user?.id}   // ✅ BEST PRACTICE
              />
            ) : (
              <h2>ACCESS DENIED</h2>
            )
          }
        />

        {/* 👉 HR */}
        <Route
          path="/hr"
          element={
            user?.role === "HR" ? (
              <HrLoggedIn hrId={hrId} />
            ) : (
              <h2>ACCESS DENIED</h2>
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;