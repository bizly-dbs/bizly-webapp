import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { categoryAPI } from '../../services/api';

const ExpenseFilter = ({ onApplyFilter, onResetFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories for filter...')
      try {
        const response = await categoryAPI.getCategories()
        console.log('Categories fetched successfully:', response)
        setCategories(response.map(cat => cat.name))
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch categories:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        setError('Gagal memuat kategori')
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        console.log('Category dropdown closed by clicking outside')
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyFilter = () => {
    const filterData = {
      startDate,
      endDate,
      category: selectedCategories,
      type: 'Semua'
    };
    console.log('Applying filter with data:', filterData)
    
    onApplyFilter(filterData);
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleResetFilter = () => {
    console.log('Resetting filter')
    setStartDate('');
    setEndDate('');
    setSelectedCategories([]);
    onResetFilter();
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleCategoryChange = (category) => {
    console.log('Category selection changed:', {
      category,
      currentSelection: selectedCategories,
      willBeSelected: !selectedCategories.includes(category)
    })
    
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm font-['Poppins'] border border-gray-100">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden w-full mb-4">
        <button 
          className="flex items-center gap-2 text-gray-700 font-medium px-3 py-2 rounded-md border border-gray-200"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className={`${!isFilterOpen && 'hidden md:block'} bg-white p-4 rounded-lg shadow-sm font-['Poppins'] border border-gray-100`}>
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
          
          <div className="relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <button
              type="button"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              disabled={loading}
            >
              {loading ? 'Memuat kategori...' : 
                selectedCategories.length > 0 
                  ? `${selectedCategories.length} kategori dipilih`
                  : 'Pilih Kategori'
              }
            </button>
            
            {isCategoryDropdownOpen && !loading && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <div 
                    key={cat} 
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`category-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="h-5 w-5 text-blue-500 border-gray-300 rounded cursor-pointer focus:ring-0"
                      />
                    </div>
                    <label 
                      htmlFor={`category-${cat}`} 
                      className="ml-3 text-sm text-gray-700 cursor-pointer select-none flex-grow font-medium"
                    >
                      {cat}
                    </label>
                    {selectedCategories.includes(cat) && (
                      <span className="text-blue-500 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                    No categories available
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleApplyFilter}
              disabled={loading}
            >
              Terapkan Filter
            </button>
            
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleResetFilter}
              disabled={loading}
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