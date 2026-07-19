import React, { useState } from "react";
import API from "../service/api";
import { useNavigate } from "react-router-dom";

const Registration = ({ onClose, openLogin }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "";

      if (user.role?.toUpperCase() === "USER") {
        url = "/users/register";
      } else if (user.role?.toUpperCase() === "HR") {
        url = "/hr/register";
      } else {
        alert("Please select role");
        return;
      }

      const { name, email, password } = user;

      const res = await API.post(url, { name, email, password });

      if (res.data === "❌ Email already registered") {
        alert(res.data);
      } else {
        alert("✅ Registration Successful");
      }
    } catch (error) {
      console.log(error);
      alert("❌ Registration Failed");
    }
  };

  return (
    /* blur bg */
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      {/* MODAL CARD */}
      <div className="w-[420px] bg-white p-8 rounded-2xl shadow-2xl relative">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-600 mb-2">Role</label>

            <div className="flex gap-4">
              {/* USER CARD */}
              <label
                className={`flex-1 border p-3 rounded-lg cursor-pointer flex items-center gap-2 
                ${user.role === "USER" ? "border-blue-500 bg-blue-50" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  onChange={handleChange}
                  className="accent-blue-500"
                  required
                />
                👤 User
              </label>

              {/* HR CARD */}
              <label
                className={`flex-1 border p-3 rounded-lg cursor-pointer flex items-center gap-2 
                ${user.role === "HR" ? "border-green-500 bg-green-50" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="HR"
                  onChange={handleChange}
                  className="accent-green-500"
                />
                🏢 HR
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-center text-sm mt-2">
            Already have account?{" "}
            <span
              onClick={openLogin}
              className="text-blue-600 cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
