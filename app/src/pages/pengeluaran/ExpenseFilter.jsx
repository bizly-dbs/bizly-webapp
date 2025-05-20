import { useState } from 'react';
import { Filter } from 'lucide-react';

const ExpenseFilter = ({ onApplyFilter, onResetFilter, categories }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilter = () => {
    onApplyFilter({
      startDate,
      endDate,
      category,
      type: 'Semua'
    });
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setCategory('');
    onResetFilter();
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Filter Toggle Button - Moved outside and above the filter container */}
      <div className="md:hidden w-full mb-4">
        <button 
          className="flex items-center gap-2 text-gray-700 font-medium px-3 py-2 rounded-md border border-gray-200"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className={`${!isFilterOpen && 'hidden md:block'} bg-white p-4 rounded-md shadow-sm border border-gray-100`}>
        <h2 className="text-lg font-semibold mb-4">Filter</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories && categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleApplyFilter}
            >
              Terapkan Filter
            </button>
            
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleResetFilter}
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseFilter;