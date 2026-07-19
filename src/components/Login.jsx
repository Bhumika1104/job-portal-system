import React, { useState } from "react";
import API from "../service/api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Login = ({ setUser, setHrId, onClose, openRegister }) => {
  const navigate = useNavigate();

  const [forgotEmail, setForgotEmail] = useState("");
  const [showReset, setShowReset] = useState(false); // ✅ new
  const [newPassword, setNewPassword] = useState(""); // ✅ new

  const [user, setFormUser] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "";

      if (user.role === "USER") {
        url = "/users/login";
      } else if (user.role === "HR") {
        url = "/hr/login";
      } else {
        alert("Please select role");
        return;
      }

      const res = await API.post(url, user);

      if (typeof res.data === "string") {
        alert(res.data);
        return;
      }

      const loggedInUser = res.data;

      setUser(loggedInUser);

      if (loggedInUser.role === "HR") {
        setHrId(loggedInUser.id);
        localStorage.setItem("hrId", loggedInUser.id);
      }

      setTimeout(() => {
        if (loggedInUser.role === "USER") {
          navigate("/user");
        } else if (loggedInUser.role === "HR") {
          navigate("/hr");
        } else {
          alert("Role not found");
        }
      }, 100);
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  // ✅ Forgot click → show reset UI
  const send = () => {
    if (!forgotEmail) {
      alert("Enter email first");
      return;
    }
    setShowReset(true);
  };

  // ✅ Reset Password API (no token)
  const resetPassword = async () => {
    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    try {
      let url = "";

      if (user.role === "USER") {
        url = `/users/reset-password-direct?email=${forgotEmail}&newPassword=${newPassword}`;
      } else if (user.role === "HR") {
        url = `/hr/reset-password-direct?email=${forgotEmail}&newPassword=${newPassword}`;
      } else {
        alert("Please select role first");
        return;
      }

      await API.post(url);

      alert("Password updated successfully");
      setShowReset(false);
    } catch (err) {
      console.log(err);
      alert("Error updating password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[420px] bg-white p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={(e) => {
              handleChange(e);
              setForgotEmail(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {!showReset && (
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}

          {/* ✅ Show new password field */}
          {showReset && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={resetPassword}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Reset Password
              </button>
            </>
          )}

          {!showReset && (
            <>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    onChange={handleChange}
                  />{" "}
                  User
                </label>

                <label>
                  <input
                    type="radio"
                    name="role"
                    value="HR"
                    onChange={handleChange}
                  />{" "}
                  HR
                </label>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Login
              </button>
            </>
          )}

          <p className="text-center text-sm mt-2">
            New user?{" "}
            <span
              onClick={() => {
                onClose();
                openRegister();
              }}
              className="text-blue-600 cursor-pointer"
            >
              Register
            </span>
          </p>

          {!showReset && (
            <p
              onClick={send}
              className="text-right text-sm text-blue-600 cursor-pointer"
            >
              Forgot Password?
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
