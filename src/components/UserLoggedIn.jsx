import React, { useEffect, useState } from "react";
import API from "../service/api";
import UserPage from "./UserPage";
import StatsCards from "./StatsCards";

const UserLoggedIn = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [file, setFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showAll, setShowAll] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);

  const [showUpload, setShowUpload] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user?.id) fetchStatus();
  }, [user]);

  const fetchJobs = async () => {
    const res = await API.get("/jobs/all");
    setJobs(res.data.sort((a, b) => b.id - a.id));
  };

  const fetchStatus = async () => {
    const res = await API.get(`/applications/user/${user.id}`);
    setStatus(res.data.sort((a, b) => b.id - a.id));
  };

  const handleApply = async (jobId) => {
    setShowUpload(jobId);
    // fetchStatus();
  };

  const handleApplyWithResume = async (jobId) => {
    if (!file) return alert("Upload resume");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("jobId", jobId);

    await API.post("/applications/applyWithResume", formData);

    alert("Applied with resume ✅");
    setShowUpload(null);
    setFile(null);
    fetchStatus();
  };

  // FILTER (title + company)
  const filteredJobs = jobs.filter((j) =>
    ((j.title || "") + " " + (j.company || ""))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, 6);
  const visibleApps = showAllApps ? status : status.slice(0, 6);

  const getStatusColor = (s) => {
    const status = (s || "").toLowerCase();

    if (status === "accepted") return "bg-green-200 text-green-700";
    if (status === "rejected") return "bg-red-200 text-red-700";
    return "bg-yellow-200 text-yellow-700"; // pending
  };

  const isApplied = (jobId) => {
    return status.some((a) => a.job.id === jobId);
  };
  const stats = {
    total: status.length,

    accepted: status.filter(
      (a) => (a.status || "").toLowerCase().trim() === "accepted",
    ).length,

    rejected: status.filter(
      (a) => (a.status || "").toLowerCase().trim() === "rejected",
    ).length,

    pending: status.filter((a) => {
      const s = (a.status || "").toLowerCase().trim();

      return s === "pending" || s === "applied" || s === "" || s === " ";
    }).length,
  };
  return (
    <>
      <UserPage user={user} />
      <br />
      <StatsCards stats={stats} />

      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-xl shadow flex gap-3 items-center w-full md:w-[500px]">
            <input
              type="text"
              placeholder="🔍 Search by Job Title or Company"
              className="border px-3 py-2 rounded w-full text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <button
              onClick={() => setSearch(searchInput)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* DETAILS PANEL  */}
        {selectedJob && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <button
              onClick={() => setSelectedJob(null)}
              className="mb-3 text-blue-600 underline"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>

            <p className="mb-2">
              <b>Description:</b> {selectedJob.description}
            </p>
            <p>
              <b>Company:</b> {selectedJob.company}
            </p>
            <p>
              <b>Salary:</b> ₹{selectedJob.salary}
            </p>
            <p>
              <b>Location:</b> {selectedJob.location}
            </p>

            <p className="mt-2">
              <b>Status:</b>{" "}
              <span
                className={
                  selectedJob.jobStatus?.toUpperCase() === "CLOSED"
                    ? "text-red-500"
                    : "text-green-600"
                }
              >
                {selectedJob.jobStatus?.toUpperCase() === "CLOSED"
                  ? "CLOSED"
                  : "OPEN"}
              </span>
            </p>

            <div className="mt-4">
              {selectedJob.jobStatus?.toUpperCase() === "CLOSED" ? (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                >
                  Job Closed
                </button>
              ) : !isApplied(selectedJob.id) ? (
                <>
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Apply
                  </button>

                  {showUpload === selectedJob.id && (
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      <button
                        onClick={() => handleApplyWithResume(selectedJob.id)}
                        className="bg-blue-500 text-white px-3 py-1 ml-2 rounded"
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-gray-500 font-medium text-lg">
                  Applied
                </span>
              )}
            </div>
          </div>
        )}

        {/* 🧾 AVAILABLE JOBS */}
        {!selectedJob && (
          <>
            <h2 className="text-xl font-bold mb-3">Available Jobs</h2>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left border border-blue-500">
                      Job Title
                    </th>
                    <th className="p-3 border border-blue-500">Company Name</th>
                    <th className="p-3 border border-blue-500">Job Status</th>
                    <th className="p-3 border border-blue-500">Job Details</th>
                    <th className="p-3 border border-blue-500">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleJobs.map((job) => {
                    const applied = status.some((a) => a.job.id === job.id);

                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition duration-200"
                      >
                        <td className="p-3 border border-gray-200">
                          {job.title}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {job.company}
                        </td>

                        <td className="p-3 border border-gray-200 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.jobStatus?.toUpperCase() === "CLOSED"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {job.jobStatus?.toUpperCase() === "CLOSED"
                              ? "CLOSED"
                              : "OPEN"}
                          </span>
                        </td>

                        <td className="p-3 border border-gray-200 text-center">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                        <td className="p-3 border border-gray-200 text-center">
                          {/* CLOSED */}
                          {job.jobStatus?.toUpperCase() === "CLOSED" ? (
                            <button
                              disabled
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                            >
                              Closed
                            </button>
                          ) : applied ? (
                            /* ALREADY APPLIED */
                            <span className="text-gray-500 font-medium">
                              Applied
                            </span>
                          ) : selectedJobId === job.id ? (
                            /* SHOW UPLOAD UI AFTER APPLY CLICK */
                            <div className="flex flex-col gap-2 items-center">
                              <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="border p-1 rounded"
                              />

                              <button
                                onClick={() => handleApplyWithResume(job.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                              >
                                Upload
                              </button>
                            </div>
                          ) : (
                            /* APPLY BUTTON */
                            <button
                              onClick={() => setSelectedJobId(job.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition cursor-pointer"
                            >
                              Apply
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*  VIEW MORE / LESS */}
            {filteredJobs.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-3 text-blue-600 underline"
              >
                {showAll ? "View Less" : "View More"}
              </button>
            )}

            {/* 📋 MY APPLICATIONS */}
            <h2 className="text-xl font-bold mt-8 mb-3">My Applications</h2>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left border border-gray-300">
                      Job Title
                    </th>
                    <th className="p-3 border border-gray-300">Company Name</th>
                    <th className="p-3 border border-gray-300">
                      Application Status
                    </th>
                    <th className="p-3 border border-gray-300">Job Details</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 border border-gray-200">
                        {app.job.title}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {app.job.company}
                      </td>

                      <td className="p-3 border border-gray-200 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-3 border border-gray-200 text-center">
                        <button
                          onClick={() => setSelectedJob(app.job)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VIEW MORE / LESS APPLICATIONS */}
            {status.length > 6 && (
              <button
                onClick={() => setShowAllApps(!showAllApps)}
                className="mt-3 text-blue-600 underline"
              >
                {showAllApps ? "View Less" : "View More"}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserLoggedIn;
