import React, { useEffect, useState, useRef } from "react";
import JobForm from "./JobForm";
import API from "../service/api";

const HrPage = ({ hrId }) => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);

  useEffect(() => {
    if (!hrId) {
      console.log("HR id not found.Please login");
      return;
    }
    fetchJobs();
  }, [hrId]);

  // Fetch jobs & all applicants
  const fetchJobs = async () => {
    try {
      const res = await API.get(`/jobs/hr/${hrId}`);
      setJobs(res.data.sort((a, b) => b.id - a.id));

      // 👉 Fetch all applicants for all jobs
      let allApps = [];
      for (let job of res.data) {
        try {
          const appRes = await API.get(`/applications/job/${job.id}`);
          allApps = [...allApps, ...appRes.data];
        } catch (e) {
          console.log("error fetching apps", e);
        }
      }
      setAllApplications(allApps);
    } catch (error) {
      alert("Error to fetch jobs");
    }
  };

  const applicantRef = useRef(null);

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplications(res.data);

      //Scroll to applicants table
      setTimeout(() => {
        applicantRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const closeJob = async (id) => {
    try {
      await API.put(`/jobs/close/${id}`);
      fetchJobs();
    } catch (err) {
      alert("Failed to close job");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}?status=${status}`);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );

      //update allApplications
      setAllApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const downloadResume = (fileName) => {
    if (!fileName) {
      alert("No resume uploaded");
      return;
    }
    window.open(`http://localhost:8080/applications/resume/${fileName}`);
  };

  const visibleJobs = showAllJobs ? jobs : jobs.slice(0, 5);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="flex min-h-screen">
        <div className="flex-1">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome,
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
            >
              {showForm ? "Close Form" : "+ Post New Job"}
            </button>
          </div>

          {/*STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-5 rounded-xl shadow">
              <h1 className="text-gray-500 text-sm">📄 Total Jobs</h1>
              <h3 className="text-2xl font-bold text-blue-700">
                {jobs.length}
              </h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">📄 Total Applications</p>
              <h2 className="text-2xl font-bold text-blue-700">
                {allApplications.length}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">✅ Accepted Applications</p>
              <h2 className="text-2xl font-bold text-green-700">
                {allApplications.filter((a) => a.status === "Accepted").length}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">❌ Rejected Applications</p>
              <h2 className="text-2xl font-bold text-red-700">
                {allApplications.filter((a) => a.status === "Rejected").length}
              </h2>
            </div>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="mb-6">
              <JobForm fetchJobs={fetchJobs} />
            </div>
          )}

          {/* JOB TABLE */}
          {!showForm && (
            <div className="bg-white p-5 rounded-xl shadow mb-8">
              <h2 className="text-lg font-semibold mb-4">My Uploaded Jobs</h2>

              {jobs.length === 0 ? (
                <p className="text-gray-500">No Jobs Found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-3 text-center border border-blue-500">
                          Job Title
                        </th>
                        <th className="p-3 text-center border border-blue-500">
                          Company Name
                        </th>
                        <th className="p-3 text-center border border-blue-500">
                          Location
                        </th>
                        <th className="p-3 text-center border border-blue-500">
                          Salary
                        </th>
                        <th className="p-3 text-center border border-blue-500">
                          View Applicants
                        </th>
                        <th className="p-3 text-center border border-blue-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleJobs.map((job) => (
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
                          <td className="p-3 border border-gray-200">
                            {job.location}
                          </td>
                          <td className="p-3 border border-gray-200">
                            {job.salary}
                          </td>

                          <td className="p-3 border border-gray-200 text-center">
                            <button
                              onClick={() => handleViewApplicants(job.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              View
                            </button>
                          </td>

                          <td className="p-3 border border-gray-200 text-center">
                            {job.jobStatus?.toUpperCase() === "CLOSED" ? (
                              <span className="text-gray-500 font-medium">
                                Closed
                              </span>
                            ) : (
                              <button
                                onClick={() => closeJob(job.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                              >
                                Close
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {jobs.length > 5 && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => setShowAllJobs(!showAllJobs)}
                        className="text-blue-600 underline"
                      >
                        {showAllJobs ? "View Less" : "View More"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* APPLICATION TABLE */}
          {!showForm && (
            <div ref={applicantRef} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Job Applications</h2>

              {applications.length === 0 ? (
                <p>No Applications</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-3 border-gray-300">Applicant Name</th>
                        <th className="p-3 border-gray-300">Email Address</th>
                        <th className="p-3 border-gray-300">Resume/CV</th>
                        <th className="p-3 border-gray-300">
                          Application Status
                        </th>
                        <th className="p-3 border-gray-300">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-gray-50 transition duration-200"
                        >
                          <td className="p-3 border border-gray-200">
                            {app.user?.name}
                          </td>
                          <td className="p-3 border border-gray-200">
                            {app.user?.email}
                          </td>

                          <td className="p-3 border border-gray-200 text-center">
                            <button
                              onClick={() => downloadResume(app.resumePath)}
                              className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Download
                            </button>
                          </td>

                          <td className="p-3 border border-gray-200 text-center">
                            {app.status}
                          </td>

                          <td className="p-3 space-x-2 border border-gray-200 text-center">
                            <button
                              onClick={() => updateStatus(app.id, "Accepted")}
                              className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "Rejected")}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrPage;
