import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_BASE = "https://fittrack-backend1.onrender.com/api";

const Challenges = ({ searchTerm = "" }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchChallengeData = async () => {
    try {
      const [challengeRes, notificationRes, leaderboardRes, profileRes] =
        await Promise.all([
          axios.get(`${API_BASE}/challenges`, getAuthConfig()),
          axios.get(`${API_BASE}/challenges/notifications`, getAuthConfig()),
          axios.get(`${API_BASE}/challenges/leaderboard`, getAuthConfig()),
          axios.get(`${API_BASE}/users/profile`, getAuthConfig()),
        ]);

      setChallenges(challengeRes.data.challenges || []);
      setNotifications(notificationRes.data.notifications || []);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setCurrentUser(profileRes.data.user || null);

      if (profileRes.data.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(profileRes.data.user)
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  const getRecentNotifications = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return notifications.filter((n) => new Date(n.timestamp) >= weekAgo);
  };

  const postChallenge = async () => {
    if (!challengeForm.title.trim()) return alert("Title required!");

    try {
      const res = await axios.post(
        `${API_BASE}/challenges`,
        challengeForm,
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      setChallengeForm({ title: "", description: "" });
      setShowAddChallenge(false);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post challenge");
    }
  };

  const editChallenge = async (id) => {
    const currentChallenge = challenges.find((c) => c.id === id);
    const newTitle = prompt("New Title", currentChallenge?.title || "") || "";
    const newDesc =
      prompt("New Description", currentChallenge?.description || "") || "";

    if (!newTitle.trim()) return alert("Title is required");

    try {
      const res = await axios.put(
        `${API_BASE}/challenges/${id}`,
        {
          title: newTitle,
          description: newDesc,
        },
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update challenge");
    }
  };

  const deleteChallenge = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/challenges/${id}`,
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete challenge");
    }
  };

  const acceptChallenge = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE}/challenges/${id}/accept`,
        {},
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept challenge");
    }
  };

  const rejectChallenge = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/challenges/${id}/reject`,
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject challenge");
    }
  };

  const completeChallenge = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE}/challenges/${id}/complete`,
        {},
        getAuthConfig()
      );

      setChallenges(res.data.challenges || []);
      fetchChallengeData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete challenge");
    }
  };

  const filteredChallenges = challenges.filter((c) =>
    [c.title, c.description, c.status, c.senderName, c.sender]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const completedCount = filteredChallenges.filter(
    (c) => c.status === "completed"
  ).length;
  const readyCount = filteredChallenges.filter(
    (c) => c.status === "ready"
  ).length;
  const notStartedCount = filteredChallenges.filter(
    (c) => c.status === "notStarted"
  ).length;

  const challengeBarData = {
    labels: ["Completed", "Accepted", "Not Started"],
    datasets: [
      {
        label: "Challenges",
        data: [completedCount, readyCount, notStartedCount],
        backgroundColor: ["#10b981", "#0ea5e9", "#9ca3af"],
        borderRadius: 8,
      },
    ],
  };

  const challengeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  const cardColors = ["bg-emerald-50", "bg-teal-50", "bg-zinc-100"];

  if (loading) {
    return (
      <p className="text-center mt-10 text-emerald-600 font-bold">
        Loading...
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p className="text-red-500 text-center mt-10">
        No logged-in user found!
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-zinc-900 overflow-x-hidden">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-600 break-words">
            Welcome, {currentUser.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 min-w-0">
              <p className="text-xs text-zinc-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-700">
                {completedCount}
              </p>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 min-w-0">
              <p className="text-xs text-zinc-500">Accepted</p>
              <p className="text-2xl font-bold text-sky-700">{readyCount}</p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 min-w-0">
              <p className="text-xs text-zinc-500">Not Started</p>
              <p className="text-2xl font-bold text-zinc-700">
                {notStartedCount}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowAddChallenge(!showAddChallenge)}
              className="bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600 text-white flex items-center gap-1"
            >
              <FaPlus /> {showAddChallenge ? "Cancel" : "Add Challenge"}
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 text-white flex items-center gap-1"
            >
              <FaBell /> Notifications ({getRecentNotifications().length})
            </button>
          </div>

          {showAddChallenge && (
            <div className="p-4 rounded-2xl shadow border border-zinc-300 bg-white min-w-0">
              <input
                type="text"
                placeholder="Challenge Title"
                value={challengeForm.title}
                onChange={(e) =>
                  setChallengeForm({
                    ...challengeForm,
                    title: e.target.value,
                  })
                }
                className="w-full mb-2 p-3 rounded-xl border border-zinc-300 outline-none focus:ring-2 focus:ring-emerald-200 min-w-0"
              />
              <textarea
                placeholder="Description"
                value={challengeForm.description}
                onChange={(e) =>
                  setChallengeForm({
                    ...challengeForm,
                    description: e.target.value,
                  })
                }
                className="w-full mb-2 p-3 rounded-xl border border-zinc-300 outline-none focus:ring-2 focus:ring-teal-200 min-w-0"
              />
              <button
                onClick={postChallenge}
                className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 text-white flex items-center gap-1"
              >
                <FaPlus /> Post Challenge
              </button>
            </div>
          )}

          {showNotifications && (
            <div className="bg-white p-4 rounded-2xl shadow border border-emerald-100 max-h-72 overflow-y-auto min-w-0">
              <h3 className="font-semibold text-teal-700 mb-3">
                Recent Notifications
              </h3>

              {getRecentNotifications().length === 0 ? (
                <p className="text-zinc-500 text-center">No new notifications</p>
              ) : (
                getRecentNotifications().map((n) => (
                  <div
                    key={n.id}
                    className="border-l-4 border-emerald-500 bg-emerald-50/40 rounded-r-lg pl-3 py-2 mb-3 min-w-0"
                  >
                    <p className="text-sm font-semibold text-zinc-800 break-words">
                      {n.challengeTitle}
                    </p>
                    <p className="text-xs text-teal-700 mt-1 break-words">
                      From: {n.senderName || n.senderUsername || "Unknown"}
                    </p>
                    <p className="text-xs text-zinc-500 italic mt-1 break-words">
                      {n.type} - {new Date(n.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <h3 className="text-lg font-bold mb-2 text-teal-600">
            Your Challenges
          </h3>

          {filteredChallenges.length === 0 ? (
            <p className="text-zinc-500">No challenges yet</p>
          ) : (
            filteredChallenges.map((c, i) => (
              <div
                key={c.id}
                className={`${cardColors[i % cardColors.length]} p-4 rounded-2xl shadow-inner border border-zinc-200 mb-2 min-w-0`}
              >
                <h4 className="font-semibold text-emerald-600 break-words">
                  {c.title}
                </h4>
                <p className="text-zinc-700 break-words">{c.description}</p>
                <p className="text-xs text-zinc-500 mt-1 break-words">
                  Created: {c.createdAt}
                </p>

                {c.senderName && (
                  <p className="text-xs text-zinc-500 mt-1 break-words">
                    Sender: {c.senderName}
                  </p>
                )}

                {c.acceptedAt && (
                  <p className="text-xs text-teal-600 mt-1 break-words">
                    Accepted: {c.acceptedAt}
                  </p>
                )}

                {c.completedAt && (
                  <p className="text-xs text-emerald-600 mt-1 break-words">
                    Completed: {c.completedAt}
                  </p>
                )}

                <div className="flex gap-2 mt-3 flex-wrap">
                  {c.sender === currentUser.username ? (
                    <>
                      <button
                        onClick={() => editChallenge(c.id)}
                        className="bg-emerald-500 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-emerald-600"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => deleteChallenge(c.id)}
                        className="bg-red-500 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-red-600"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      {c.status === "notStarted" && (
                        <>
                          <button
                            onClick={() => acceptChallenge(c.id)}
                            className="bg-teal-500 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-teal-600"
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            onClick={() => rejectChallenge(c.id)}
                            className="bg-red-500 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-red-600"
                          >
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}

                      {c.status === "ready" && (
                        <>
                          <span className="text-teal-600 px-2 py-1 rounded border border-teal-600 flex items-center gap-1">
                            <FaCheck /> Ready
                          </span>
                          <button
                            onClick={() => completeChallenge(c.id)}
                            className="bg-emerald-500 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-emerald-600"
                          >
                            <FaCheck /> Complete
                          </button>
                        </>
                      )}

                      {c.status === "completed" && (
                        <span className="text-emerald-600 px-2 py-1 rounded border border-emerald-600 flex items-center gap-1">
                          <FaCheck /> Completed
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="bg-white p-4 rounded-2xl shadow border border-zinc-200 mt-4 min-w-0">
            <h3 className="text-lg font-bold mb-3 text-center text-teal-600">
              Challenge Activity Overview
            </h3>
            <div className="h-64 sm:h-72">
              <Bar data={challengeBarData} options={challengeBarOptions} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden min-w-0">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-4">
              <h3 className="text-lg font-bold text-white text-center">
                Challenge Leaderboard
              </h3>
              <p className="text-xs text-emerald-50 text-center mt-1">
                Users who accepted or completed challenges
              </p>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto min-w-0">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-500 font-medium">
                    No active challengers yet
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Accept and complete challenges to appear here
                  </p>
                </div>
              ) : (
                leaderboard.map((u, idx) => (
                  <div
                    key={`${u.username || u.name}-${idx}`}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 mb-3 border gap-3 ${
                      idx === 0
                        ? "bg-amber-50 border-amber-200"
                        : idx === 1
                        ? "bg-zinc-50 border-zinc-200"
                        : idx === 2
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          idx === 0
                            ? "bg-amber-400 text-white"
                            : idx === 1
                            ? "bg-zinc-400 text-white"
                            : idx === 2
                            ? "bg-orange-400 text-white"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-800 break-words">
                          {u.name}
                        </p>
                        <p className="text-xs text-zinc-500 break-words">
                          Accepted: {u.accepted} | Completed: {u.completed}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-emerald-600">
                        {u.completed}
                      </p>
                      <p className="text-[11px] text-zinc-500">completed</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
