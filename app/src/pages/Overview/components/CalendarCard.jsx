import React from 'react';

const CalendarCard = ({ 
  activeMonth, 
  activeYear, 
  monthNames, 
  calendarDays, 
  currentDay, 
  currentDate, 
  randomHighlightDay,
  prevMonth,
  nextMonth 
}) => {
  return (
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
  );
};

export default CalendarCard; 