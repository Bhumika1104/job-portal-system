import React, { useEffect, useState } from "react";
import API from "../service/api";

const HrDashboard = ({ hrId }) => {
  const [hrName, setHrName] = useState("");

  useEffect(() => {
    const fetchHr = async () => {
      try {
        const res = await API.get(`/hr/${hrId}`);
        setHrName(res.data.name);
      } catch (error) {
        console.log("error hr name fetching", error);
      }
    };
    fetchHr();
  }, [hrId]);

  const handleLogout = () => {
    localStorage.removeItem("hrId");
    window.location.href = "/";
  };

  return (
    <>
      {/* navbar */}
      <div className="bg-[#f5f7fb] text-blue-900 px-6 py-3 flex justify-between items-center shadow-md font-bold ">
        <h1 className="text-xl font-bold tracking-wide"> 💼 JobPortalSystem</h1>
        <div className="bg-white text-black px-4 py-1 rounded-full font-medium">
          {hrName ? `${hrName}` : "Loading.."}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default HrDashboard;
