import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fitness Challenge Tracker
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Join challenges. Track progress. Stay motivated.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">🏃 Daily Challenges</h3>
            <p className="text-gray-600">
              Participate in step goals, workouts, yoga & more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">📊 Progress Tracking</h3>
            <p className="text-gray-600">
              Track your daily performance with visual progress.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">🏆 Leaderboards</h3>
            <p className="text-gray-600">
              Compete with friends and stay motivated.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Preview */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Challenges
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold text-lg">10K Steps Challenge</h3>
              <p className="text-gray-600 mt-2">
                Walk 10,000 steps every day.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-semibold text-lg">
                30-Day Workout Streak
              </h3>
              <p className="text-gray-600 mt-2">
                Stay consistent for 30 days.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-semibold text-lg">
                Yoga & Mindfulness
              </h3>
              <p className="text-gray-600 mt-2">
                Improve flexibility and calmness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© 2026 Fitness Challenge Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;