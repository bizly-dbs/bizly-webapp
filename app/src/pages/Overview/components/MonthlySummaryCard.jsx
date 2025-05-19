import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

const MonthlySummaryCard = ({ monthlyData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium mb-4">Ringkasan</h3>
      <div className="flex justify-center items-center mb-2">
        <div className="bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-600">
          Rp 1.350.000
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <Bar dataKey="value" fill="#0080FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySummaryCard; 