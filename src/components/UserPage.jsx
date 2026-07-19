import React, { useEffect, useState } from "react";
import API from "../service/api";

const UserPage = ({ user }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.id) return;

        const res = await API.get(`/users/${user.id}`);
        setUserName(res.data.name);
      } catch (error) {
        console.log("error user name fetching", error);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <>
      {/* navbar */}
      <div className="bg-[#f5f7fb] text-blue-900 px-6 py-3 flex justify-between items-center shadow-md font-bold">
        <h1 className="text-xl font-bold tracking-wide"> 💼 JobPortalSystem</h1>

        <div className="bg-white text-black px-4 py-1 rounded-full font-bold">
          {userName ? userName : "Loading.."}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default UserPage;
