import { useState, useEffect } from 'react'
import MonthExpenseCard from './ExpenseCard'
import AddButton from './AddButton'

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
  })

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
    }))
  }

  const handleDeleteExpense = (month, index) => {
    setExpenseData(prevData => ({
      ...prevData,
      [month.toLowerCase()]: prevData[month.toLowerCase()].filter((_, i) => i !== index)
    }))
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pengeluaran</h1>
      
      <div>
        {Object.entries(expenseData).map(([month, data]) => (
          <MonthExpenseCard 
            key={month} 
            month={month.charAt(0).toUpperCase() + month.slice(1)} 
            expenseList={data}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        ))}
      </div>
      
      <AddButton />
    </div>
  )
}

export default Pengeluaran

