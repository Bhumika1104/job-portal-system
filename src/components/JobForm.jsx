import React, { useState } from "react";
import API from "../service/api";

const JobForm = ({ fetchJobs }) => {
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hrId = localStorage.getItem("hrId");

    if (!hrId) {
      alert("❌ Please login first");
      return;
    }

    try {
      const res = await API.post(`/jobs/add/${hrId}`, {
        ...jobForm,
      });

      alert("Upload job Successful");
      fetchJobs();
      console.log(res.data);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error);
      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Post a New Job
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to publish a job
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. React Developer"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g. TCS"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Pune"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Salary (₹)
              </label>
              <input
                type="text"
                name="salary"
                placeholder="e.g. 25000"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Enter job details..."
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-medium shadow hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition duration-300"
          >
            + Upload Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
