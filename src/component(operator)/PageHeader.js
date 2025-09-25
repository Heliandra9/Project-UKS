import React from "react";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-white rounded-xl p-4 shadow">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
}
