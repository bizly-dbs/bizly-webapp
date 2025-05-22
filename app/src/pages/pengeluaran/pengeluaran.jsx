import { useState, useEffect } from 'react';
import MonthExpenseCard from './ExpenseCard';
import AddButton from './AddButton';
import ExpenseFilter from './ExpenseFilter';

const Pengeluaran = () => {
  const [expenseData, setExpenseData] = useState({
    januari: [
      { 
        date: '05/01/2025', 
        nominal: 'Rp. 1.200.000,-', 
        name: 'Sewa Tempat', 
        category: 'Operasional',
        type: 'Tetap'
      },
      { 
        date: '08/01/2025', 
        nominal: 'Rp. 800.000,-', 
        name: 'Pembelian Bahan', 
        category: 'Bahan Baku',
        type: 'Variabel'
      },
      { 
        date: '15/01/2025', 
        nominal: 'Rp. 350.000,-', 
        name: 'Biaya Listrik', 
        category: 'Utilitas',
        type: 'Tetap'
      },
      { 
        date: '22/01/2025', 
        nominal: 'Rp. 500.000,-', 
        name: 'Gaji Karyawan', 
        category: 'Gaji',
        type: 'Tetap'
      },
    ],
    februari: [
      { 
        date: '04/02/2025', 
        nominal: 'Rp. 1.200.000,-', 
        name: 'Sewa Tempat', 
        category: 'Operasional',
        type: 'Tetap'
      },
      { 
        date: '10/02/2025', 
        nominal: 'Rp. 950.000,-', 
        name: 'Pembelian Bahan', 
        category: 'Bahan Baku',
        type: 'Variabel'
      },
      { 
        date: '16/02/2025', 
        nominal: 'Rp. 375.000,-', 
        name: 'Biaya Listrik', 
        category: 'Utilitas',
        type: 'Tetap'
      },
    ]
  });
  
  const [filteredData, setFilteredData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Extract unique categories from expense data
    const allCategories = new Set();
    
    Object.values(expenseData).forEach(monthData => {
      monthData.forEach(expense => {
        allCategories.add(expense.category);
      });
    });
    
    setCategories([...allCategories]);
  }, [expenseData]);

  // Store expense data in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
  }, [expenseData]);

  // Check for search results on component mount
  useEffect(() => {
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    if (searchResults) {
      setExpenseData(searchResults);
      // Clear search results after displaying them
      localStorage.removeItem('searchResults');
    }
  }, []);

  const handleUpdateExpense = (month, index, updatedItem) => {
    setExpenseData(prevData => ({
      ...prevData,
      [month.toLowerCase()]: prevData[month.toLowerCase()].map((item, i) => 
        i === index ? updatedItem : item
      )
    }));
  };

  const handleDeleteExpense = (month, index) => {
    setExpenseData(prevData => ({
      ...prevData,
      [month.toLowerCase()]: prevData[month.toLowerCase()].filter((_, i) => i !== index)
    }));
  };
  
  const handleApplyFilter = (filters) => {
    console.log('Applying filters:', filters);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    const filtered = {};
    
    Object.entries(expenseData).forEach(([month, monthData]) => {
      const filteredMonthData = monthData.filter(item => {
        const dateParts = item.date.split('/');
        const itemDate = new Date(
          parseInt(dateParts[2].trim()), 
          parseInt(dateParts[1].trim()) - 1, 
          parseInt(dateParts[0].trim())
        );
        
        // Date filtering - include start date
        if (startDate) {
          const startOfDay = new Date(startDate);
          startOfDay.setHours(0, 0, 0, 0);
          const itemStartOfDay = new Date(itemDate);
          itemStartOfDay.setHours(0, 0, 0, 0);
          if (itemStartOfDay < startOfDay) return false;
        }
        
        // End date filtering - include end date
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          const itemEndOfDay = new Date(itemDate);
          itemEndOfDay.setHours(23, 59, 59, 999);
          if (itemEndOfDay > endOfDay) return false;
        }
        
        // Category filtering - if no categories selected, show all
        if (filters.category && filters.category.length > 0) {
          if (!filters.category.includes(item.category)) return false;
        }
        
        // Type filtering
        if (filters.type !== 'Semua' && item.type !== filters.type) return false;
        
        return true;
      });
      
      if (filteredMonthData.length > 0) {
        filtered[month] = filteredMonthData;
      }
    });
    
    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };
  
  const handleResetFilter = () => {
    setFilteredData(null);
  };
  
  const displayData = filteredData || expenseData;
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pengeluaran</h1>
      
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Expense List - takes remaining space */}
        <div className="flex-grow order-2 md:order-1">
          {Object.entries(displayData).map(([month, data]) => (
            <MonthExpenseCard 
              key={month} 
              month={month.charAt(0).toUpperCase() + month.slice(1)} 
              expenseList={data}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          ))}
          
          {Object.keys(displayData).length === 0 && (
            <div className="bg-white p-8 rounded-md shadow-sm text-center">
              <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
            </div>
          )}
        </div>
        
        {/* Filter Panel - fixed width on desktop */}
        <div className="w-full md:w-64 lg:w-72 mb-6 md:mb-0 flex-shrink-0 order-1 md:order-2">
          <ExpenseFilter 
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
            categories={categories}
          />
        </div>
      </div>
      
      <AddButton />
    </div>
  );
};

export default Pengeluaran;