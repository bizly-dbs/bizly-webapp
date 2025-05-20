<<<<<<< HEAD
import { useState, useEffect } from 'react';
import MonthExpenseCard from './ExpenseCard';
import AddButton from './AddButton';
import ExpenseFilter from './ExpenseFilter';
=======
import { useState, useEffect } from 'react'
import MonthExpenseCard from './ExpenseCard'
import AddButton from './AddButton'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022

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
  
  const [filteredData, setFilteredData] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
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
    
    // Initialize filtered data with original data
    if (!activeFilter) {
      setFilteredData(expenseData);
    }
  }, [expenseData, activeFilter]);

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
  
  const handleApplyFilter = (filterParams) => {
    setActiveFilter(filterParams);
    
    const filtered = {};
    
    Object.entries(expenseData).forEach(([month, expenses]) => {
      const filteredExpenses = expenses.filter(expense => {
        // Filter by date range
        let passesDateFilter = true;
        if (filterParams.startDate || filterParams.endDate) {
          const expenseDate = convertDateFormat(expense.date);
          
          if (filterParams.startDate && new Date(expenseDate) < new Date(filterParams.startDate)) {
            passesDateFilter = false;
          }
          
          if (filterParams.endDate && new Date(expenseDate) > new Date(filterParams.endDate)) {
            passesDateFilter = false;
          }
        }
        
        // Filter by category
        let passesCategoryFilter = true;
        if (filterParams.category && expense.category !== filterParams.category) {
          passesCategoryFilter = false;
        }
        
        return passesDateFilter && passesCategoryFilter;
      });
      
      if (filteredExpenses.length > 0) {
        filtered[month] = filteredExpenses;
      }
    });
    
    setFilteredData(filtered);
  };
  
  const handleResetFilter = () => {
    setActiveFilter(null);
    setFilteredData(expenseData);
  };
  
  // Helper function to convert date format from DD/MM/YYYY to YYYY-MM-DD for comparison
  const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pengeluaran</h1>
      
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Expense List - takes remaining space */}
        <div className="flex-grow order-2 md:order-1">
          {Object.keys(filteredData).length === 0 ? (
            <div className="bg-white p-8 rounded-md shadow-sm text-center">
              <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
            </div>
          ) : (
            Object.entries(filteredData).map(([month, data]) => (
              <MonthExpenseCard 
                key={month} 
                month={month.charAt(0).toUpperCase() + month.slice(1)} 
                expenseList={data}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            ))
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