import React from "react";
import { FaDumbbell, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Fitness Challenge Tracker
          </h1>
          <p className="text-lg md:text-xl text-emerald-50">
            Your companion to stay motivated, consistent, and achieve fitness goals — anytime, anywhere.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="bg-zinc-800 p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300">
            We aim to make fitness simple, engaging, and sustainable by encouraging consistency through challenges, progress tracking, and a supportive community.
          </p>
        </div>

        <div className="bg-zinc-800 p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-300">
            To build a fitness ecosystem where healthy habits are easy to follow, motivation never runs out, and progress is celebrated.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaDumbbell className="text-emerald-400 text-4xl mb-4 mx-auto" />,
                title: "Daily Challenges",
                desc: "Step goals, workouts, yoga, mindfulness, and weight-loss programs.",
              },
              {
                icon: <FaCalendarCheck className="text-emerald-400 text-4xl mb-4 mx-auto" />,
                title: "Progress Tracking",
                desc: "Monitor your daily activity, maintain streaks, and celebrate milestones.",
              },
              {
                icon: <MdOutlineLeaderboard className="text-emerald-400 text-4xl mb-4 mx-auto" />,
                title: "Leaderboards",
                desc: "Friendly competition to keep motivation high and rewards engaging.",
              },
              {
                icon: <FaUsers className="text-emerald-400 text-4xl mb-4 mx-auto" />,
                title: "Community Support",
                desc: "Connect with others, share achievements, and stay inspired.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl bg-zinc-800/80 backdrop-blur border border-zinc-700
                           hover:border-emerald-500 hover:-translate-y-2 transition shadow"
              >
                {f.icon}
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {f.title}
                </h3>
                <p className="text-gray-300 text-center">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join Us Today
        </h2>
        <p className="text-gray-300 mb-6">
          Whether you are just starting or already a fitness enthusiast, our platform helps you stay motivated and achieve your goals.
        </p>
        <button className="px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition">
          Get Started
        </button>
      </section>

    </div>
  );
};

export default AboutUs;
