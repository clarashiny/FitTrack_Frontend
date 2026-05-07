import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRunning, FaDumbbell, FaTrash, FaEdit } from "react-icons/fa";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_BASE = "https://fittrack-backend1.onrender.com/api";

const Workout = ({ searchTerm = "" }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
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

  const syncCurrentUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("authChange"));
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/profile`, getAuthConfig());
      syncCurrentUser(res.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    activityLevel: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        age: currentUser.age || "",
        height: currentUser.height || "",
        weight: currentUser.weight || "",
        goalWeight: currentUser.goalWeight || "",
        activityLevel: currentUser.activityLevel || "",
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    if (!profileForm.name || !profileForm.weight || !profileForm.goalWeight) {
      return alert("Fill required fields");
    }

    try {
      const res = await axios.put(
        `${API_BASE}/users/profile`,
        profileForm,
        getAuthConfig()
      );

      syncCurrentUser(res.data.user);
      setShowProfileForm(false);
      alert("Profile updated!");
    } catch (error) {
      alert(error.response?.data?.message || "Profile update failed");
    }
  };

  const calculateBMI = () => {
    const h = Number(profileForm.height) / 100;
    const w = Number(profileForm.weight);
    return w && h ? (w / (h * h)).toFixed(1) : "-";
  };

  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    type: "",
    description: "",
    duration: "",
    dateTime: "",
  });
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);

  const handleWorkoutChange = (e) =>
    setWorkoutForm({ ...workoutForm, [e.target.name]: e.target.value });

  const addOrUpdateWorkout = async (e) => {
    e.preventDefault();

    if (!workoutForm.name || !workoutForm.type || !workoutForm.duration) {
      return alert("Fill required fields");
    }

    try {
      let res;

      if (isEditingWorkout) {
        res = await axios.put(
          `${API_BASE}/workouts/${workoutForm.id}`,
          {
            name: workoutForm.name,
            type: workoutForm.type,
            description: workoutForm.description,
            duration: workoutForm.duration,
            dateTime:
              workoutForm.dateTime || new Date().toISOString().slice(0, 16),
          },
          getAuthConfig()
        );
      } else {
        res = await axios.post(
          `${API_BASE}/workouts`,
          {
            name: workoutForm.name,
            type: workoutForm.type,
            description: workoutForm.description,
            duration: workoutForm.duration,
            dateTime:
              workoutForm.dateTime || new Date().toISOString().slice(0, 16),
          },
          getAuthConfig()
        );
      }

      syncCurrentUser(res.data.user);
      setWorkoutForm({
        name: "",
        type: "",
        description: "",
        duration: "",
        dateTime: "",
      });
      setIsEditingWorkout(false);
    } catch (error) {
      alert(error.response?.data?.message || "Workout save failed");
    }
  };

  const editWorkout = (w) => {
    setWorkoutForm({
      ...w,
      dateTime: w.dateTime ? String(w.dateTime).slice(0, 16) : "",
    });
    setIsEditingWorkout(true);
  };

  const deleteWorkout = async (w) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      const res = await axios.delete(
        `${API_BASE}/workouts/${w.id}`,
        getAuthConfig()
      );
      syncCurrentUser(res.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const shareWorkoutToCommunity = async (workout) => {
    try {
      await axios.post(
        `${API_BASE}/community/posts`,
        {
          content: `Completed ${workout.name} for ${workout.duration} mins today! 💪`,
          image: null,
        },
        getAuthConfig()
      );

      alert("Workout shared to community!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to share workout");
    }
  };

  useEffect(() => {
    if (!isActive || !activeWorkout) return;

    if (secondsLeft <= 0) {
      const completeWorkout = async () => {
        try {
          setIsActive(false);

          const res = await axios.post(
            `${API_BASE}/workouts/${activeWorkout.id}/complete`,
            {},
            getAuthConfig()
          );

          syncCurrentUser(res.data.user);
          alert(`${activeWorkout.name} completed!`);

          if (
            window.confirm("Do you want to share this completed workout to the community?")
          ) {
            await shareWorkoutToCommunity(activeWorkout);
          }

          setActiveWorkout(null);
        } catch (error) {
          alert(error.response?.data?.message || "Failed to complete workout");
        }
      };

      completeWorkout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft, activeWorkout]);

  const startWorkout = (w) => {
    setActiveWorkout(w);
    setSecondsLeft(Number(w.duration) * 60);
    setIsActive(true);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const filteredWorkouts = (currentUser?.workouts || []).filter((w) =>
    [w.name, w.type, w.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalWorkouts = currentUser?.workouts?.length || 0;
  const completedCount =
    currentUser?.workoutHistory?.filter((h) => h.type === "completed").length ||
    0;
  const pendingWorkouts = Math.max(totalWorkouts - completedCount, 0);

  const weightHistory = currentUser?.weightHistory || [];
  const latestWeightEntry = weightHistory[weightHistory.length - 1];
  const previousWeightEntry = weightHistory[weightHistory.length - 2];

  const latestWeight = Number(
    latestWeightEntry?.weight || currentUser?.weight || 0
  );
  const previousWeight = Number(previousWeightEntry?.weight || latestWeight);
  const weightChange = latestWeight - previousWeight;
  const goalDifference = latestWeight - Number(currentUser?.goalWeight || 0);

  const workoutsById = Object.fromEntries(
    (currentUser?.workouts || []).map((w) => [w.id, w])
  );

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyMinutes = Array(7).fill(0);

  (currentUser?.workoutHistory || []).forEach((item) => {
    if (item.type === "completed") {
      const dayIndex = new Date(item.timestamp).getDay();
      const duration = Number(workoutsById[item.workoutId]?.duration || 0);
      weeklyMinutes[dayIndex] += duration;
    }
  });

  const weeklyBarData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Completed Minutes",
        data: weeklyMinutes,
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  const weeklyBarOptions = {
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
          stepSize: 10,
        },
      },
    },
  };

  if (loading) {
    return (
      <p className="text-center text-emerald-600 mt-20 font-bold">
        Loading...
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p className="text-center text-red-500 mt-20 font-bold">
        No user logged in.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 overflow-x-hidden">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-4 min-w-0">
          <div className="flex justify-between items-center border-b pb-2 gap-3">
            <h2 className="font-bold text-teal-700 text-xl sm:text-2xl">
              Profile
            </h2>
            <button
              onClick={() => setShowProfileForm(!showProfileForm)}
              className="text-emerald-600 font-semibold text-sm hover:underline shrink-0"
            >
              {showProfileForm ? "Cancel" : "Edit"}
            </button>
          </div>

          {showProfileForm ? (
            <div className="flex flex-col gap-3 animate-in fade-in duration-300">
              <input
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="border p-2 rounded focus:ring-2 focus:ring-teal-300 outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  name="age"
                  type="number"
                  value={profileForm.age}
                  onChange={handleProfileChange}
                  placeholder="Age"
                  className="border p-2 rounded"
                />
                <input
                  name="height"
                  type="number"
                  value={profileForm.height}
                  onChange={handleProfileChange}
                  placeholder="Height (cm)"
                  className="border p-2 rounded"
                />
                <input
                  name="weight"
                  type="number"
                  value={profileForm.weight}
                  onChange={handleProfileChange}
                  placeholder="Weight (kg)"
                  className="border p-2 rounded"
                />
                <input
                  name="goalWeight"
                  type="number"
                  value={profileForm.goalWeight}
                  onChange={handleProfileChange}
                  placeholder="Goal Weight (kg)"
                  className="border p-2 rounded"
                />
              </div>
              <input
                name="activityLevel"
                value={profileForm.activityLevel}
                onChange={handleProfileChange}
                placeholder="Activity Level (e.g. Moderate)"
                className="border p-2 rounded"
              />
              <p className="text-sm font-semibold text-teal-600">
                BMI: {calculateBMI()}
              </p>
              <button
                onClick={saveProfile}
                className="bg-teal-500 text-white px-4 py-2 rounded font-bold hover:bg-teal-600 transition"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <div className="text-sm sm:text-base space-y-2 break-words">
              <p>
                <strong>Name:</strong> {currentUser.name || "N/A"}
              </p>
              <p>
                <strong>Current Weight:</strong> {currentUser.weight || 0} kg
              </p>
              <p>
                <strong>Target Goal:</strong> {currentUser.goalWeight || 0} kg
              </p>
              <p>
                <strong>BMI Status:</strong> {calculateBMI()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 min-w-0">
              <p className="text-xs text-zinc-500">Total Workouts</p>
              <p className="text-xl font-bold text-emerald-700">{totalWorkouts}</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 min-w-0">
              <p className="text-xs text-zinc-500">Completed</p>
              <p className="text-xl font-bold text-sky-700">{completedCount}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 min-w-0">
              <p className="text-xs text-zinc-500">Pending</p>
              <p className="text-xl font-bold text-amber-700">{pendingWorkouts}</p>
            </div>
          </div>

          {weightHistory.length > 0 && (
            <div className="mt-4 min-w-0">
              <h3 className="font-semibold text-teal-700 mb-3">Weight Insights</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs text-zinc-500">Current</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {latestWeight} kg
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                  <p className="text-xs text-zinc-500">Change</p>
                  <p
                    className={`text-xl font-bold ${
                      weightChange <= 0 ? "text-sky-700" : "text-orange-600"
                    }`}
                  >
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs text-zinc-500">To Goal</p>
                  <p className="text-xl font-bold text-amber-700">
                    {Math.abs(goalDifference).toFixed(1)} kg
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-4 max-h-56 overflow-y-auto min-w-0">
                <h4 className="text-sm font-semibold text-zinc-700 mb-3">
                  Recent Logs
                </h4>

                <div className="space-y-3">
                  {[...weightHistory].reverse().map((w, idx) => (
                    <div key={idx} className="flex items-start gap-3 min-w-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800 break-words">
                          {w.weight} kg
                        </p>
                        <p className="text-xs text-zinc-500 break-words">
                          {w.dateTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {totalWorkouts > 0 && (
            <div className="mt-6 min-w-0">
              <h3 className="font-semibold text-teal-700 mb-4">
                Weekly Workout Activity
              </h3>
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 h-64 sm:h-72">
                <Bar data={weeklyBarData} options={weeklyBarOptions} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <h2 className="text-teal-700 font-bold text-xl sm:text-2xl">
            Daily Workouts
          </h2>

          <form
            onSubmit={addOrUpdateWorkout}
            className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0"
          >
            <input
              name="name"
              placeholder="Workout Name (e.g. Morning Run)"
              value={workoutForm.name}
              onChange={handleWorkoutChange}
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-emerald-300 min-w-0"
            />
            <select
              name="type"
              value={workoutForm.type}
              onChange={handleWorkoutChange}
              className="border p-2 rounded bg-emerald-50 text-emerald-800 font-medium outline-none focus:ring-2 focus:ring-emerald-300 min-w-0"
            >
              <option value="">Select Type</option>
              <option value="Running">Running</option>
              <option value="Gym">Gym/Weight</option>
              <option value="Yoga">Yoga</option>
              <option value="Other">Other</option>
            </select>
            <input
              name="duration"
              type="number"
              placeholder="Duration (min)"
              value={workoutForm.duration}
              onChange={handleWorkoutChange}
              className="border p-2 rounded min-w-0"
            />
            <input
              name="dateTime"
              type="datetime-local"
              value={workoutForm.dateTime}
              onChange={handleWorkoutChange}
              className="border p-2 rounded bg-sky-50 text-sky-800 font-medium outline-none focus:ring-2 focus:ring-sky-300 min-w-0"
            />
            <textarea
              name="description"
              placeholder="Notes (optional)"
              value={workoutForm.description}
              onChange={handleWorkoutChange}
              className="border p-2 rounded sm:col-span-2 h-20 min-w-0"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-white rounded px-4 py-2 font-bold hover:bg-emerald-600 transition sm:col-span-2"
            >
              {isEditingWorkout ? "Update Workout" : "Add Workout"}
            </button>
          </form>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredWorkouts.map((w) => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-xl shadow-md border hover:border-emerald-300 transition min-w-0"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-lg font-bold flex items-center gap-2 min-w-0">
                    {w.type === "Running" ? (
                      <FaRunning className="text-orange-500 shrink-0" />
                    ) : (
                      <FaDumbbell className="text-blue-500 shrink-0" />
                    )}
                    <span className="break-words">{w.name}</span>
                  </h3>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full shrink-0">
                    {w.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-1 italic break-words">
                  {w.description || "No description provided."}
                </p>

                <div className="mt-3 flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    ⏱ {w.duration} mins
                  </p>
                  <p className="text-xs text-gray-400 break-words">
                    📅 {new Date(w.dateTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t gap-2 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => startWorkout(w)}
                      className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-600 hover:text-white transition text-sm font-bold"
                    >
                      Start Timer
                    </button>

                    <button
                      onClick={() => shareWorkoutToCommunity(w)}
                      className="bg-sky-50 text-sky-700 px-3 py-1 rounded hover:bg-sky-600 hover:text-white transition text-sm font-bold border border-sky-200"
                    >
                      Share
                    </button>
                  </div>

                  <div className="flex gap-4 shrink-0">
                    <FaEdit
                      onClick={() => editWorkout(w)}
                      className="cursor-pointer text-blue-500 hover:scale-110 transition"
                    />
                    <FaTrash
                      onClick={() => deleteWorkout(w)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeWorkout && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-20 bg-white p-5 rounded-2xl shadow-2xl border-2 border-emerald-500 text-center sm:w-72">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {activeWorkout.name}
          </h2>
          <div className="text-4xl font-mono my-3 text-emerald-600">
            {formatTime(secondsLeft)}
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold"
            >
              {isActive ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => {
                setActiveWorkout(null);
                setIsActive(false);
                setSecondsLeft(0);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
