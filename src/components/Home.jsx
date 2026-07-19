import React, { useState } from "react";
import Registration from "./Registration";
import Login from "./Login";

const Home = ({ setUser, setHrId }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen font-sans">
      {/* NAVBAR */}
      <nav className="flex items-center px-10 py-4 bg-white shadow-sm">
        <div className="text-blue-600 font-bold text-xl flex items-center gap-2">
          💼 JobPortalSystem
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 max-w-7xl mx-auto">
        {/* LEFT */}
        <div className="max-w-xl">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm">
            Find Your Dream Job
          </span>

          <h1 className="text-5xl font-bold text-gray-800 mt-4 leading-tight">
            Discover Opportunities,
            <br />
            <span className="text-blue-600">Build Your Future</span>
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Explore thousands of jobs from top companies and find the perfect
            opportunity for your career.
          </p>

          {/* FEATURES */}
          <div className="flex gap-10 mt-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">📁</div>
              <div>
                <p className="font-semibold">Thousands of Jobs</p>
                <p className="text-gray-400 text-xs">Find the right job</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">👥</div>
              <div>
                <p className="font-semibold">Top Companies</p>
                <p className="text-gray-400 text-xs">Trusted employers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">🔒</div>
              <div>
                <p className="font-semibold">Easy & Secure</p>
                <p className="text-gray-400 text-xs">Safe & reliable</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-10 md:mt-0">
          <img
            src="/src/assets/men.png" // 👉 your way
            alt="job"
            className="w-[520px] object-contain"
          />
        </div>
      </section>

      {/* GET STARTED */}
      <section className="text-center px-6 pb-16">
        <h2 className="text-3xl font-semibold text-gray-800">Get Started</h2>

        <p className="text-gray-500 mt-2">
          Join as a Job Seeker or Recruiter and start your journey with us.
        </p>

        <div className="flex justify-center mt-6">
          {/* Register/Login */}
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 text-left hover:shadow-lg transition">
            <div className="bg-blue-100 p-4 rounded-full text-2xl text-blue-600">
              👤
            </div>

            <div>
              <h3 className="font-semibold text-lg">Welcome Back</h3>
              <p className="text-gray-500 text-sm">
                Sign in to continue your journey
              </p>

              <button
                onClick={() => setShowRegister(true)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Register / Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {showRegister && (
        <Registration
          onClose={() => setShowRegister(false)}
          openLogin={openLogin}
        />
      )}
      {showLogin && (
        <Login
          setUser={setUser}
          setHrId={setHrId}
          onClose={() => setShowLogin(false)}
          openRegister={openRegister}
        />
      )}
    </div>
  );
};

export default Home;
