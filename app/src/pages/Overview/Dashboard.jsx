import React, { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';

const Dashboard = () => {
  // Get current date information
  const currentDate = new Date();
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
  
  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Monthly bar chart data
  const monthlyData = [
    { name: 'Jan', value: 50 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 45 },
    { name: 'Apr', value: 90 },
    { name: 'May', value: 60 },
    { name: 'Jun', value: 75 },
    { name: 'Jul', value: 55 },
    { name: 'Aug', value: 65 },
    { name: 'Sep', value: 42 },
    { name: 'Oct', value: 55 },
    { name: 'Nov', value: 68 },
    { name: 'Dec', value: 50 },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Prioritas Utama', value: 63, color: '#0080FF' },
    { name: 'Pengeluaran', value: 25, color: '#B3DBFF' },
  ];

  // Line chart data
  const lineData = [
    { name: '1', value: 10 },
    { name: '2', value: 15 },
    { name: '3', value: 13 },
    { name: '4', value: 17 },
    { name: '5', value: 20 },
    { name: '6', value: 22 },
    { name: '7', value: 25 },
    { name: '8', value: 28 },
    { name: '9', value: 30 },
    { name: '10', value: 35 },
  ];

  // Expense line chart data
  const expenseLineData = [
    { name: '1', value: 30 },
    { name: '2', value: 35 },
    { name: '3', value: 32 },
    { name: '4', value: 37 },
    { name: '5', value: 40 },
    { name: '6', value: 42 },
    { name: '7', value: 38 },
    { name: '8', value: 45 },
    { name: '9', value: 43 },
    { name: '10', value: 48 },
  ];

  // Generate calendar data for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(activeYear, activeMonth, 1);
    const lastDay = new Date(activeYear, activeMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Adjust for the first day of month (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday as first day of week (European/ISO calendar)
    let firstDayIndex = firstDay.getDay() - 1;
    if (firstDayIndex < 0) firstDayIndex = 6; // Sunday becomes last day (index 6)
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push({ day: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][i], dayNum: null });
    }
    
    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(activeYear, activeMonth, i).getDay();
      let dayName = '';
      
      // Convert day index to name (0 = Sunday, 1 = Monday, etc.)
      switch(dayOfWeek) {
        case 0: dayName = 'Su'; break;
        case 1: dayName = 'Mo'; break;
        case 2: dayName = 'Tu'; break;
        case 3: dayName = 'We'; break;
        case 4: dayName = 'Th'; break;
        case 5: dayName = 'Fr'; break;
        case 6: dayName = 'Sa'; break;
        default: dayName = '';
      }
      
      calendarDays.push({ day: dayName, dayNum: i });
    }
    
    // Add empty cells for days after the last day of month
    const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days = 42 cells total
    for (let i = 0; i < remainingCells; i++) {
      calendarDays.push({ day: '', dayNum: null });
    }
    
    return calendarDays;
  };

  // Generate calendar days
  const calendarDays = generateCalendarDays();

  // Functions to change month/year
  const prevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };

  const nextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };

  // Highlighted dates (example: current date and a random date for transactions)
  const currentDay = currentDate.getDate();
  const randomHighlightDay = Math.floor(Math.random() * 28) + 1; // Random day between 1-28
  const expenses = [
    {
      title: 'Bill & Taxes',
      icon: '🏢',
      amount: '200.000',
      date: '14.03.2025'
    },
    {
      title: 'Transportasi',
      icon: '🚗',
      amount: '130.000',
      date: '21.03.2025'
    },
    {
      title: 'Pelatihan',
      icon: '📚',
      amount: '230.000',
      date: '28.03.2025'
    },
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Pengeluaran Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Pengeluaran</h3>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rp. 2.513.000,-</h2>
              <div className="flex-shrink-0">
                <div className="h-16">
                  <ResponsiveContainer width={80} height="100%">
                    <BarChart data={monthlyData.slice(0, 4)}>
                      <Bar dataKey="value" fill="#0080FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Total Pemasukan Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Pemasukan</h3>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rp. 5.791.000,-</h2>
              <div className="flex-shrink-0">
                <div className="h-16">
                  <ResponsiveContainer width={80} height="100%">
                    <BarChart data={monthlyData.slice(0, 4)}>
                      <Bar dataKey="value" fill="#0080FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Net Profit/Loss Card */}
        <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-white text-sm font-medium opacity-90">Net Profit/Loss</h3>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rp. 5.791.000,-</h2>
              <div className="flex-shrink-0">
                <div className="h-16">
                  <ResponsiveContainer width={80} height="100%">
                    <LineChart data={lineData}>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Track Arus Kas */}
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

          {/* Ringkasan Monthly Bar Chart */}
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
        </div>

        {/* Middle Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Kategori Pie Chart */}
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
        </div>

        {/* Right Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevMonth}
                  className="text-gray-500 hover:text-blue-500"
                >
                  ◀
                </button>
                <div className="text-blue-500 font-medium">{monthNames[activeMonth]}</div>
                <button 
                  onClick={nextMonth}
                  className="text-gray-500 hover:text-blue-500"
                >
                  ▶
                </button>
              </div>
              <div className="text-gray-500">
                <span className="mr-2">{activeYear}</span>
                <span>▼</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              <div className="text-xs text-gray-500">Mo</div>
              <div className="text-xs text-gray-500">Tu</div>
              <div className="text-xs text-gray-500">We</div>
              <div className="text-xs text-gray-500">Th</div>
              <div className="text-xs text-gray-500">Fr</div>
              <div className="text-xs text-gray-500">Sa</div>
              <div className="text-xs text-gray-500">Su</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {calendarDays.map((day, index) => (
                <div key={index} className={`
                  ${day.dayNum === currentDay && activeMonth === currentDate.getMonth() && activeYear === currentDate.getFullYear() 
                    ? 'bg-blue-500 text-white rounded-full w-8 h-8 mx-auto flex items-center justify-center' : 
                    day.dayNum === randomHighlightDay 
                    ? 'bg-blue-500 text-white rounded-full w-8 h-8 mx-auto flex items-center justify-center' : 
                    day.dayNum ? 'w-8 h-8 mx-auto flex items-center justify-center' : ''}
                  ${day.dayNum === null ? 'text-gray-300' : 'text-gray-700'}
                  text-sm
                `}>
                  {day.dayNum}
                </div>
              ))}
            </div>
          </div>

          {/* Expense Tracking */}
          <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-medium">Uang keluar ini</h3>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;