import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaDumbbell,
  FaFire,
  FaTrash,
  FaComments,
} from "react-icons/fa";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_BASE = "https://fittrack-backend1.onrender.com/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [overview, setOverview] = useState({
    users: 0,
    workouts: 0,
    challenges: 0,
    communityPosts: 0,
  });
  const [activeTab, setActiveTab] = useState("Users");
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchAdminData = async () => {
    try {
      const [
        overviewRes,
        usersRes,
        workoutsRes,
        challengesRes,
        postsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE}/admin/overview`, getAuthConfig()),
        axios.get(`${API_BASE}/admin/users`, getAuthConfig()),
        axios.get(`${API_BASE}/admin/workouts`, getAuthConfig()),
        axios.get(`${API_BASE}/admin/challenges`, getAuthConfig()),
        axios.get(`${API_BASE}/admin/community-posts`, getAuthConfig()),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data.users || []);
      setWorkouts(workoutsRes.data.workouts || []);
      setChallenges(challengesRes.data.challenges || []);
      setCommunityPosts(postsRes.data.communityPosts || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, getAuthConfig());
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      await axios.delete(`${API_BASE}/admin/workouts/${id}`, getAuthConfig());
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete workout");
    }
  };

  const deleteChallenge = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;

    try {
      await axios.delete(`${API_BASE}/admin/challenges/${id}`, getAuthConfig());
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete challenge");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(
        `${API_BASE}/admin/community-posts/${id}`,
        getAuthConfig()
      );
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  const pieData = {
    labels: ["Users", "Workouts", "Challenges", "Community Posts"],
    datasets: [
      {
        data: [
          overview.users,
          overview.workouts,
          overview.challenges,
          overview.communityPosts,
        ],
        backgroundColor: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b"],
      },
    ],
  };

  const barData = {
    labels: ["Users", "Workouts", "Challenges", "Community Posts"],
    datasets: [
      {
        label: "Count",
        data: [
          overview.users,
          overview.workouts,
          overview.challenges,
          overview.communityPosts,
        ],
        backgroundColor: "#10b981",
      },
    ],
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-emerald-600 font-bold">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-zinc-100 to-emerald-100">
      <h1 className="text-3xl font-bold mb-6 text-emerald-800">
        Admin Dashboard 🛠️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <Stat title="Users" value={overview.users} icon={<FaUsers />} />
        <Stat title="Workouts" value={overview.workouts} icon={<FaDumbbell />} />
        <Stat title="Challenges" value={overview.challenges} icon={<FaFire />} />
        <Stat
          title="Community Posts"
          value={overview.communityPosts}
          icon={<FaComments />}
        />
      </div>

      <div className="flex gap-4 mb-6">
        {["Users", "Workouts", "Challenges", "Community Posts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-emerald-500 text-white"
                : "bg-zinc-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/5 space-y-6">
          {activeTab === "Users" && (
            <Section
              title="Users"
              data={users}
              onDelete={deleteUser}
              render={(u) => (
                <>
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-sm text-gray-500">
                    {u.userType || "User"}
                  </span>
                </>
              )}
            />
          )}

          {activeTab === "Workouts" && (
            <Section
              title="Workouts"
              data={workouts}
              onDelete={deleteWorkout}
              render={(w) => (
                <>
                  <span className="font-semibold">{w.name}</span>
                  <span className="text-sm text-gray-500">
                    By {w.creatorName}
                  </span>
                </>
              )}
            />
          )}

          {activeTab === "Challenges" && (
            <Section
              title="Challenges"
              data={challenges}
              onDelete={deleteChallenge}
              render={(c) => (
                <>
                  <span className="font-semibold">{c.title}</span>
                  <span className="text-sm text-gray-500">
                    By {c.creatorName}
                  </span>
                </>
              )}
            />
          )}

          {activeTab === "Community Posts" && (
            <Section
              title="Community Posts"
              data={communityPosts}
              onDelete={deletePost}
              render={(p) => (
                <>
                  <span className="font-semibold">{p.userName}</span>
                  <span className="text-sm text-gray-500">
                    {p.content?.slice(0, 40) || "Image post"}...
                  </span>
                </>
              )}
            />
          )}
        </div>

        <div className="md:w-2/5 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border-2 border-emerald-300">
            <h2 className="font-bold mb-4 text-emerald-700">Overview (Pie)</h2>
            <Pie data={pieData} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-2 border-emerald-300">
            <h2 className="font-bold mb-4 text-emerald-700">Overview (Bar)</h2>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow border-l-4 border-emerald-400">
    <div className="text-2xl mb-2 text-emerald-600">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Section = ({ title, data, onDelete, render }) => (
  <div className="bg-white p-6 rounded-xl shadow border-2 border-emerald-300 mb-8">
    <h2 className="text-xl font-bold mb-4 text-emerald-700">{title}</h2>

    {data.length === 0 ? (
      <p className="text-gray-500">No data</p>
    ) : (
      <ul className="space-y-3">
        {data.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex flex-col">{render(item)}</div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Admin;
