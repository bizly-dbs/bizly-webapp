import { useState, useEffect } from 'react'
import MonthIncomeCard from './IncomeCard'
import AddButton from './AddButoon'
import IncomeFilter from './IncomeFilter'

const Pemasukan = () => {
  const [incomeData, setIncomeData] = useState({
    januari: [
      { 
        date: '12 /01 / 2025', 
        nominal: 'Rp. 2.000.000,-', 
        name: 'Penjualan', 
        category: 'Penjualan',
<<<<<<< HEAD
        product: 'Produk A',
        quantity: '10',
        type: 'Pembayaran'
=======
        type: 'Pembayaran',
        productName: 'iPhone 14 Pro',
        quantity: '2',
        totalAmount: 'Rp. 2.000.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
<<<<<<< HEAD
        product: 'Produk B',
        quantity: '5',
        type: 'Additional'
=======
        type: 'Additional',
        productName: 'MacBook Air M2',
        quantity: '1',
        totalAmount: 'Rp. 1.500.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
<<<<<<< HEAD
        product: 'Produk C',
        quantity: '3',
        type: 'Additional'
=======
        type: 'Additional',
        productName: 'AirPods Pro',
        quantity: '3',
        totalAmount: 'Rp. 450.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
      { 
        date: '23 /01 / 2025', 
        nominal: 'Rp. 1.370.000,-', 
        name: 'Reward', 
        category: 'Bonus',
<<<<<<< HEAD
        product: 'Produk D',
        quantity: '7',
        type: 'Additional'
=======
        type: 'Additional',
        productName: 'Bonus Penjualan',
        quantity: '1',
        totalAmount: 'Rp. 1.370.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
    ],
    februari: [
      { 
        date: '12 /01 / 2025', 
        nominal: 'Rp. 2.000.000,-', 
        name: 'Penjualan', 
        category: 'Penjualan',
<<<<<<< HEAD
        product: 'Produk A',
        quantity: '10',
        type: 'Pembayaran'
=======
        type: 'Pembayaran',
        productName: 'iPhone 14 Pro',
        quantity: '2',
        totalAmount: 'Rp. 2.000.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
<<<<<<< HEAD
        product: 'Produk B',
        quantity: '5',
        type: 'Additional'
=======
        type: 'Additional',
        productName: 'MacBook Air M2',
        quantity: '1',
        totalAmount: 'Rp. 1.500.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
<<<<<<< HEAD
        product: 'Produk C',
        quantity: '3',
        type: 'Additional'
=======
        type: 'Additional',
        productName: 'AirPods Pro',
        quantity: '3',
        totalAmount: 'Rp. 450.000,-'
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022
      },
    ]
  })

<<<<<<< HEAD
  const [filteredData, setFilteredData] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    const allCategories = new Set()
    const allProducts = new Set()
    
    Object.values(incomeData).forEach(monthData => {
      monthData.forEach(item => {
        if (item.category) allCategories.add(item.category)
        if (item.product) allProducts.add(item.product)
      })
    })
    
    setCategories([...allCategories])
    setProducts([...allProducts])
  }, [incomeData])
=======
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
>>>>>>> a2492aef632f6cb1cfbd9e009f946d3d9b805022

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
  
  const handleApplyFilter = (filters) => {
    const startDate = filters.startDate ? new Date(filters.startDate) : null
    const endDate = filters.endDate ? new Date(filters.endDate) : null
    
    const filtered = {}
    
    Object.entries(incomeData).forEach(([month, monthData]) => {
      const filteredMonthData = monthData.filter(item => {
        const dateParts = item.date.split('/')
        const itemDate = new Date(
          parseInt(dateParts[2].trim()), 
          parseInt(dateParts[1].trim()) - 1, 
          parseInt(dateParts[0].trim())
        )
        
        if (startDate && itemDate < startDate) return false
        if (endDate && itemDate > endDate) return false
        if (filters.category && item.category !== filters.category) return false
        if (filters.product && item.product !== filters.product) return false
        if (filters.type !== 'Semua' && item.type !== filters.type) return false
        
        return true
      })
      
      if (filteredMonthData.length > 0) {
        filtered[month] = filteredMonthData
      }
    })
    
    setFilteredData(filtered)
  }
  
  const handleResetFilter = () => {
    setFilteredData(null)
  }
  
  const displayData = filteredData || incomeData
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pemasukan</h1>
      
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Income List - takes remaining space */}
        <div className="flex-grow order-2 md:order-1">
          {Object.entries(displayData).map(([month, data]) => (
            <MonthIncomeCard 
              key={month} 
              month={month.charAt(0).toUpperCase() + month.slice(1)} 
              incomeList={data}
              onUpdateIncome={handleUpdateIncome}
              onDeleteIncome={handleDeleteIncome}
            />
          ))}
          
          {Object.keys(displayData).length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
            </div>
          )}
          
          <AddButton />
        </div>
        
        {/* Filter Panel - fixed width on desktop */}
        <div className="w-full md:w-64 lg:w-72 mb-6 md:mb-0 flex-shrink-0 order-1 md:order-2">
          <IncomeFilter 
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
            categories={categories}
            products={products}
          />
        </div>
      </div>
    </div>
  )
}

export default Pemasukan