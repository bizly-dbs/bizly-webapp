import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const CashFlowCard = ({ lineData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm font-medium">Track Arus Kas</h3>
          <span className="text-green-500 text-xs font-medium">+2.45%</span>
        </div>
        <h2 className="text-2xl font-bold">Rp.-</h2>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-green-500">On track</span>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0080FF" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowCard; 