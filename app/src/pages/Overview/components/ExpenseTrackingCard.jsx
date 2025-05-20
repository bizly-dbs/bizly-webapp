import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ExpenseTrackingCard = ({ expenseLineData, expenses }) => {
  return (
    <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
        <h3 className="text-white text-sm font-medium">Uang keluar ini</h3>
=======
        <h3 className="text-white text-sm font-medium">Uang keluar bulan ini</h3>
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
        <div className="w-6 h-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Rp. 2.100.000,-</h2>
      <div className="h-12 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={expenseLineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#FFFFFF" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4">
        <h4 className="text-white text-sm font-medium">Riwayat</h4>
        {expenses.map((expense, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-400 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg">{expense.icon}</span>
              </div>
              <div>
                <div className="text-sm font-medium">{expense.title}</div>
                <div className="text-xs opacity-80">{expense.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">-Rp. {expense.amount},-</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTrackingCard; 