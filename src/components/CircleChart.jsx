import { useState } from "react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const CircleChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = data.reduce((sum, d) => sum + d.points, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-8">
      {/* SVG CHART */}
      <svg width="220" height="220" viewBox="0 0 220 220">
        <g transform="translate(110,110)">
          {data.map((item, index) => {
            const startAngle = (cumulative / total) * 360;
            const angle = (item.points / total) * 360;
            cumulative += item.points;

            const radius = activeIndex === index ? 90 : 80;
            const largeArc = angle > 180 ? 1 : 0;

            const start = polarToCartesian(radius, startAngle);
            const end = polarToCartesian(radius, startAngle + angle);

            const pathData = `
              M ${start.x} ${start.y}
              A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
              L 0 0
            `;

            return (
              <path
                key={index}
                d={pathData}
                fill={COLORS[index % COLORS.length]}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* INFO PANEL */}
      <div>
        <h3 className="font-semibold mb-3">Points Distribution</h3>

        {activeIndex !== null ? (
          <div className="mb-3">
            <p className="font-bold">{data[activeIndex].user}</p>
            <p className="text-sm">{data[activeIndex].points} pts</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">
            Hover on chart
          </p>
        )}

        <ul className="text-sm space-y-1">
          {data.map((d, i) => (
            <li key={d.user} className="flex items-center gap-2">
              <span
                className="w-3 h-3 inline-block rounded"
                style={{
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
              {d.user} – {d.points}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ---------- Helper ---------- */
const polarToCartesian = (radius, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
  };
};

export default CircleChart;
