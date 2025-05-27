import { useState, useEffect } from 'react'
import MonthIncomeCard from './IncomeCard'
import AddButton from './AddButoon'
import IncomeFilter from './IncomeFilter'
import { transactionAPI, categoryAPI } from '../../services/api'

const Pemasukan = () => {
  const [incomeData, setIncomeData] = useState({})
  const [filteredData, setFilteredData] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchIncomeData()
    fetchCategories()
  }, [])

  const fetchIncomeData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const transactions = await transactionAPI.getTransactions('Pemasukan')
      
      // Group transactions by month
      const groupedData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.transaction_date)
        const month = date.toLocaleString('id-ID', { month: 'long' }).toLowerCase()
        
        const formattedTransaction = {
          id: transaction.id,
          date: `${date.getDate().toString().padStart(2, '0')} /${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`,
          nominal: `Rp. ${transaction.amount.toLocaleString('id-ID')},-`,
          name: transaction.transaction_name,
          category: transaction.category_name,
          product: transaction.product_name,
          quantity: transaction.quantity?.toString(),
          type: transaction.type
        }

        if (!acc[month]) {
          acc[month] = []
        }
        acc[month].push(formattedTransaction)
        return acc
      }, {})

      setIncomeData(groupedData)
      
      // Extract unique products
      const uniqueProducts = [...new Set(transactions
        .filter(t => t.product_name)
        .map(t => t.product_name))]
      setProducts(uniqueProducts)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching income data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const categories = await categoryAPI.getCategories('Pemasukan')
      setCategories(categories.map(cat => cat.name))
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleUpdateIncome = async (month, index, updatedItem) => {
    try {
      const originalItem = incomeData[month][index]
      const transactionData = {
        transaction_name: updatedItem.name,
        amount: parseInt(updatedItem.nominal.replace(/[^0-9]/g, '')),
        category_name: updatedItem.category,
        product_name: updatedItem.product || null,
        quantity: updatedItem.quantity ? parseInt(updatedItem.quantity) : null,
        type: 'Pemasukan'
      }

      await transactionAPI.updateTransaction(originalItem.id, transactionData)
      await fetchIncomeData() // Refresh data after update
    } catch (err) {
      setError(err.message)
      console.error('Error updating income:', err)
    }
  }

  const handleDeleteIncome = async (month, index) => {
    try {
      const itemToDelete = incomeData[month][index]
      await transactionAPI.deleteTransaction(itemToDelete.id)
      await fetchIncomeData() // Refresh data after delete
    } catch (err) {
      setError(err.message)
      console.error('Error deleting income:', err)
    }
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

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