import React from "react";

const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold">{activity.title}</h3>
      <p className="text-gray-600">⏱ {activity.duration}</p>
      <p className="text-gray-600">🔥 {activity.calories} cal</p>
    </div>
  );
};

export default ActivityCard;
