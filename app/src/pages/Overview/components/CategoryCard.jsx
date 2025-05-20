import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CategoryCard = ({ pieData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">Kategori</h3>
        <div className="flex items-center">
          <button className="text-blue-500 text-xs">Januari</button>
          <span className="ml-1">▼</span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-8 mt-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs text-gray-600">Prioritas Utama</span>
          <span className="text-xs text-gray-800 font-medium ml-1">63%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
          <span className="text-xs text-gray-600">Pengeluaran</span>
          <span className="text-xs text-gray-800 font-medium ml-1">25%</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 