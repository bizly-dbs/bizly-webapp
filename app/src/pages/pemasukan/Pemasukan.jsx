import { useState, useEffect } from 'react'
import MonthIncomeCard from './IncomeCard'
import AddButton from './AddButoon'

const Pemasukan = () => {
  const [incomeData, setIncomeData] = useState({
    januari: [
      { 
        date: '12 /01 / 2025', 
        nominal: 'Rp. 2.000.000,-', 
        name: 'Penjualan', 
        category: 'Penjualan',
        type: 'Pembayaran',
        productName: 'iPhone 14 Pro',
        quantity: '2',
        totalAmount: 'Rp. 2.000.000,-'
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
        type: 'Additional',
        productName: 'MacBook Air M2',
        quantity: '1',
        totalAmount: 'Rp. 1.500.000,-'
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
        type: 'Additional',
        productName: 'AirPods Pro',
        quantity: '3',
        totalAmount: 'Rp. 450.000,-'
      },
      { 
        date: '23 /01 / 2025', 
        nominal: 'Rp. 1.370.000,-', 
        name: 'Reward', 
        category: 'Bonus',
        type: 'Additional',
        productName: 'Bonus Penjualan',
        quantity: '1',
        totalAmount: 'Rp. 1.370.000,-'
      },
    ],
    februari: [
      { 
        date: '12 /01 / 2025', 
        nominal: 'Rp. 2.000.000,-', 
        name: 'Penjualan', 
        category: 'Penjualan',
        type: 'Pembayaran',
        productName: 'iPhone 14 Pro',
        quantity: '2',
        totalAmount: 'Rp. 2.000.000,-'
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
        type: 'Additional',
        productName: 'MacBook Air M2',
        quantity: '1',
        totalAmount: 'Rp. 1.500.000,-'
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
        type: 'Additional',
        productName: 'AirPods Pro',
        quantity: '3',
        totalAmount: 'Rp. 450.000,-'
      },
    ]
  })

  // Store income data in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
  }, [incomeData]);

  // Check for search results on component mount
  useEffect(() => {
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    if (searchResults) {
      setIncomeData(searchResults);
      // Clear search results after displaying them
      localStorage.removeItem('searchResults');
    }
  }, []);

  const handleUpdateIncome = (month, index, updatedItem) => {
    setIncomeData(prevData => ({
      ...prevData,
      [month.toLowerCase()]: prevData[month.toLowerCase()].map((item, i) => 
        i === index ? updatedItem : item
      )
    }))
  }

  const handleDeleteIncome = (month, index) => {
    setIncomeData(prevData => ({
      ...prevData,
      [month.toLowerCase()]: prevData[month.toLowerCase()].filter((_, i) => i !== index)
    }))
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pemasukan</h1>
      
      <div>
        {Object.entries(incomeData).map(([month, data]) => (
          <MonthIncomeCard 
            key={month} 
            month={month.charAt(0).toUpperCase() + month.slice(1)} 
            incomeList={data}
            onUpdateIncome={handleUpdateIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        ))}
      </div>
      
      <AddButton />
    </div>
  )
}

export default Pemasukan