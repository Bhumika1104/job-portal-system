import React from "react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Applied",
      value: stats.total || 0,
      color: "bg-blue-100 text-blue-700",
      icon: "📄",
    },
    {
      title: "Accepted",
      value: stats.accepted || 0,
      color: "bg-green-100 text-green-700",
      icon: "✅",
    },
    {
      title: "Rejected",
      value: stats.rejected || 0,
      color: "bg-red-100 text-red-700",
      icon: "❌",
    },
    {
      title: "Pending",
      value: stats.pending || 0,
      color: "bg-yellow-100 text-yellow-700",
      icon: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-xl p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-lg text-xl ${card.color}`}>
            {card.icon}
          </div>

          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
