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
        product: 'Produk A',
        quantity: '10',
        type: 'Pembayaran'
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
        product: 'Produk B',
        quantity: '5',
        type: 'Additional'
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
        product: 'Produk C',
        quantity: '3',
        type: 'Additional'
      },
      { 
        date: '23 /01 / 2025', 
        nominal: 'Rp. 1.370.000,-', 
        name: 'Reward', 
        category: 'Bonus',
        product: 'Produk D',
        quantity: '7',
        type: 'Additional'
      },
    ],
    februari: [
      { 
        date: '12 /01 / 2025', 
        nominal: 'Rp. 2.000.000,-', 
        name: 'Penjualan', 
        category: 'Penjualan',
        product: 'Produk A',
        quantity: '10',
        type: 'Pembayaran'
      },
      { 
        date: '14 /01 / 2025', 
        nominal: 'Rp. 1.500.000,-', 
        name: 'Pembayaran DP', 
        category: 'Pembayaran',
        product: 'Produk B',
        quantity: '5',
        type: 'Additional'
      },
      { 
        date: '17 /01 / 2025', 
        nominal: 'Rp. 450.000,-', 
        name: 'Penjualan Online', 
        category: 'Penjualan',
        product: 'Produk C',
        quantity: '3',
        type: 'Additional'
      },
    ]
  })

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
    console.log('Applying filters:', filters);
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
          if (!filters.category.includes(item.category)) return false
        }
        
        // Product filtering
        if (filters.product && item.product !== filters.product) return false
        
        // Type filtering
        if (filters.type !== 'Semua' && item.type !== filters.type) return false
        
        return true
      })
      
      if (filteredMonthData.length > 0) {
        filtered[month] = filteredMonthData
      }
    })
    
    console.log('Filtered data:', filtered);
    setFilteredData(filtered)
  }
  
  const handleResetFilter = () => {
    setFilteredData(null)
  }
  
  const displayData = filteredData || incomeData
  
  return (
    <div className="max-w-full">
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