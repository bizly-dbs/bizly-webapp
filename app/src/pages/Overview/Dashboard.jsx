import React, { useState } from 'react';
import TotalExpenseCard from './components/TotalExpenseCard';
import TotalIncomeCard from './components/TotalIncomeCard';
import NetProfitCard from './components/NetProfitCard';
import CashFlowCard from './components/CashFlowCard';
import MonthlySummaryCard from './components/MonthlySummaryCard';
import CategoryCard from './components/CategoryCard';
import CalendarCard from './components/CalendarCard';
import ExpenseTrackingCard from './components/ExpenseTrackingCard';

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
    <div className="bg-gray-50 p-6 min-h-screen font-['Poppins']">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TotalExpenseCard monthlyData={monthlyData} />
        <TotalIncomeCard monthlyData={monthlyData} />
        <NetProfitCard lineData={lineData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <CashFlowCard lineData={lineData} />
          <MonthlySummaryCard monthlyData={monthlyData} />
        </div>

        {/* Middle Column */}
        <div className="md:col-span-1 space-y-6">
          <CategoryCard pieData={pieData} />
        </div>

        {/* Right Column */}
        <div className="md:col-span-1 space-y-6">
          <CalendarCard 
            activeMonth={activeMonth}
            activeYear={activeYear}
            monthNames={monthNames}
            calendarDays={calendarDays}
            currentDay={currentDay}
            currentDate={currentDate}
            randomHighlightDay={randomHighlightDay}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
          />
          <ExpenseTrackingCard 
            expenseLineData={expenseLineData}
            expenses={expenses}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;