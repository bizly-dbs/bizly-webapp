import { useState, useEffect } from 'react';
import MonthExpenseCard from './ExpenseCard';
import AddButton from './AddButton';
import ExpenseFilter from './ExpenseFilter';
import { transactionAPI, categoryAPI } from '../../services/api';

const Pengeluaran = () => {
  const [expenseData, setExpenseData] = useState({});
  const [filteredData, setFilteredData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format date consistently
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return dateString; // Return original if invalid
    }
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to parse display date back to ISO
  const parseDisplayDateToISO = (displayDate) => {
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      console.log('Fetching expenses...')
      try {
        const response = await transactionAPI.getTransactions('Pengeluaran')
        console.log('Expenses fetched successfully:', response)
        
        // Group expenses by month
        const groupedByMonth = response.reduce((acc, transaction) => {
          const date = new Date(transaction.transaction_date);
          if (isNaN(date.getTime())) {
            console.warn('Invalid transaction date:', transaction.transaction_date);
            return acc;
          }
          const month = date.toLocaleString('id-ID', { month: 'long' }).toLowerCase();
          
          if (!acc[month]) {
            acc[month] = [];
          }
          
          acc[month].push({
            id: transaction.id,
            date: formatDateForDisplay(transaction.transaction_date),
            nominal: `Rp. ${parseFloat(transaction.amount).toLocaleString('id-ID')},-`,
            name: transaction.transaction_name,
            category: transaction['category.name'] || 'Uncategorized',
            categoryId: transaction['category_id'] || null,
            type: transaction.type
          });
          
          return acc;
        }, {});
        
        console.log('Expenses grouped by month:', groupedByMonth)
        setExpenseData(groupedByMonth)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch expenses:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        setError('Gagal memuat data pengeluaran')
        setLoading(false)
      }
    }
    
    fetchExpenses()
  }, [])

  // Add a new useEffect to fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories...')
      try {
        const response = await categoryAPI.getCategories()
        console.log('Categories fetched successfully:', response)
        setCategories(response)  // Store full category objects
      } catch (error) {
        console.error('Failed to fetch categories:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        setError('Gagal memuat kategori')
      }
    }
    
    fetchCategories()
  }, [])

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

  const handleUpdateExpense = async (month, index, updatedItem) => {
    console.log('Updating expense:', { month, index, updatedItem })
    try {
      // Add safety checks for month and index
      const monthKey = month.toLowerCase()
      if (!expenseData || !expenseData[monthKey]) {
        console.error('Invalid month:', { month, monthKey, availableMonths: Object.keys(expenseData) })
        throw new Error('Bulan tidak valid')
      }

      if (!Array.isArray(expenseData[monthKey]) || !expenseData[monthKey][index]) {
        console.error('Invalid index:', { month, monthKey, index, monthData: expenseData[monthKey] })
        throw new Error('Index tidak valid')
      }

      const originalItem = expenseData[monthKey][index]
      console.log('Original item:', originalItem)

      if (!originalItem.id) {
        console.error('Missing expense ID:', originalItem)
        throw new Error('ID pengeluaran tidak valid')
      }

      // Validate updated item data
      if (!updatedItem || typeof updatedItem !== 'object') {
        console.error('Invalid updated item:', updatedItem)
        throw new Error('Data update tidak valid')
      }

      // Ensure we have all required fields with proper types
      const requiredFields = {
        transaction_name: 'string',
        amount: 'number',
        transaction_date: 'string',
        category_id: ['string', 'number'],
        type: 'string'
      }

      for (const [field, type] of Object.entries(requiredFields)) {
        if (!updatedItem[field] && updatedItem[field] !== 0) {
          console.error(`Missing required field: ${field}`)
          throw new Error(`Field ${field} harus diisi`)
        }
        if (
          (Array.isArray(type) && !type.includes(typeof updatedItem[field])) ||
          (!Array.isArray(type) && typeof updatedItem[field] !== type)
        ) {
          console.error(`Invalid type for ${field}:`, { 
            expected: type, 
            received: typeof updatedItem[field],
            value: updatedItem[field]
          })
          throw new Error(`Tipe data ${field} tidak valid`)
        }
      }
      

      console.log('Sending update request with data:', {
        id: originalItem.id,
        ...updatedItem
      })

      const response = await transactionAPI.updateTransaction(originalItem.id, updatedItem)

      // Check if response has the expected format
      if (!response || !response.data || !response.message) {
        console.error('Invalid API response format:', response)
        throw new Error('Format respons API tidak valid')
      }

      console.log('Update response:', response)

      // Refresh expenses after successful update
      const updatedResponse = await transactionAPI.getTransactions('Pengeluaran')
      if (!updatedResponse) {
        throw new Error('Gagal memuat data terbaru')
      }

      const updatedGroupedData = updatedResponse.reduce((acc, transaction) => {
        if (!transaction.transaction_date) {
          console.warn('Transaction missing date:', transaction)
          return acc
        }

        const date = new Date(transaction.transaction_date)
        if (isNaN(date.getTime())) {
          console.warn('Invalid transaction date:', transaction.transaction_date)
          return acc
        }

        const month = date.toLocaleString('id-ID', { month: 'long' }).toLowerCase()
        
        if (!acc[month]) {
          acc[month] = []
        }
        
        acc[month].push({
          id: transaction.id,
          date: date.toLocaleDateString('id-ID'),
          nominal: `Rp. ${parseFloat(transaction.amount).toLocaleString('id-ID')},-`,
          name: transaction.transaction_name,
          category: transaction['category.name'] || 'Uncategorized',
          categoryId: transaction['category_id'] || null,
          type: transaction.type
        })
        
        return acc
      }, {})
      
      console.log('Updated grouped data:', updatedGroupedData)
      setExpenseData(updatedGroupedData)
    } catch (error) {
      console.error('Failed to update expense:', {
        message: error.message,
        status: error.status,
        month,
        index,
        updatedItem
      })
      setError(error.message || 'Gagal mengupdate pengeluaran')
    }
  }

  const handleDeleteExpense = async (month, index) => {
    console.log('=== DELETE EXPENSE START ===')
    console.log('Delete request params:', { month, index })
    console.log('Current expense data:', expenseData)
    console.log('Available months:', Object.keys(expenseData))
    
    try {
      const monthKey = month.toLowerCase()
      console.log('Normalized month key:', monthKey)
      console.log('Data for month:', expenseData[monthKey])
      
      if (!expenseData || !expenseData[monthKey] || !expenseData[monthKey][index]) {
        console.error('=== DELETE VALIDATION FAILED ===')
        console.error('Invalid expense data:', { 
          originalMonth: month,
          monthKey,
          index, 
          availableMonths: Object.keys(expenseData),
          monthData: expenseData[monthKey],
          expenseData 
        })
        throw new Error('Data pengeluaran tidak valid')
      }

      const itemToDelete = expenseData[monthKey][index]
      console.log('=== ITEM TO DELETE ===')
      console.log('Item details:', itemToDelete)
      console.log('Item ID:', itemToDelete.id)

      if (!itemToDelete.id) {
        console.error('=== DELETE ID VALIDATION FAILED ===')
        console.error('Missing expense ID:', itemToDelete)
        throw new Error('ID pengeluaran tidak valid')
      }

      console.log('=== SENDING DELETE REQUEST ===')
      console.log('Delete URL:', `/api/transactions/${itemToDelete.id}`)
      const response = await fetch(`/api/transactions/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('=== DELETE RESPONSE ===')
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('=== DELETE REQUEST FAILED ===')
        console.error('Delete failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          headers: Object.fromEntries(response.headers.entries())
        })
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('=== DELETE SUCCESS ===')
      console.log('Delete response data:', data)
      
      console.log('=== FETCHING UPDATED DATA ===')
      const updatedResponse = await fetch('/api/transactions?type=Pengeluaran')
      console.log('Update fetch status:', updatedResponse.status)
      console.log('Update fetch ok:', updatedResponse.ok)

      if (!updatedResponse.ok) {
        console.error('=== UPDATE FETCH FAILED ===')
        console.error('Update fetch failed:', {
          status: updatedResponse.status,
          statusText: updatedResponse.statusText
        })
        throw new Error(`HTTP error! status: ${updatedResponse.status}`)
      }
      
      const updatedData = await updatedResponse.json()
      console.log('=== UPDATED DATA ===')
      console.log('Raw updated data:', updatedData)
      console.log('Data length:', updatedData.length)

      if (!Array.isArray(updatedData)) {
        console.error('=== INVALID DATA FORMAT ===')
        console.error('Invalid response format:', updatedData)
        throw new Error('Format data tidak valid')
      }

      console.log('=== PROCESSING UPDATED DATA ===')
      const updatedGroupedData = updatedData.reduce((acc, transaction) => {
        if (!transaction.transaction_date) {
          console.warn('Transaction missing date:', transaction)
          return acc
        }

        const date = new Date(transaction.transaction_date)
        if (isNaN(date.getTime())) {
          console.warn('Invalid transaction date:', transaction.transaction_date)
          return acc
        }

        const month = date.toLocaleString('id-ID', { month: 'long' }).toLowerCase()
        
        if (!acc[month]) {
          acc[month] = []
        }
        
        acc[month].push({
          id: transaction.id,
          date: date.toLocaleDateString('id-ID'),
          nominal: `Rp. ${parseFloat(transaction.amount).toLocaleString('id-ID')},-`,
          name: transaction.transaction_name,
          category: transaction['category.name'] || 'Uncategorized',
          categoryId: transaction['category_id'] || null,
          type: transaction.type
        })
        
        return acc
      }, {})
      
      console.log('=== FINAL GROUPED DATA ===')
      console.log('Updated grouped data:', updatedGroupedData)
      console.log('Available months after update:', Object.keys(updatedGroupedData))
      console.log('=== DELETE EXPENSE COMPLETE ===')
      
      setExpenseData(updatedGroupedData)
    } catch (error) {
      console.error('=== DELETE EXPENSE ERROR ===')
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        month,
        index,
        availableMonths: Object.keys(expenseData),
        stack: error.stack
      })
      setError('Gagal menghapus pengeluaran')
    }
  }
  
  const handleApplyFilter = (filters) => {
    console.log('Applying filters:', filters);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    const filtered = {};
    
    Object.entries(expenseData).forEach(([month, monthData]) => {
      const filteredMonthData = monthData.filter(item => {
        const itemDate = new Date(parseDisplayDateToISO(item.date));
        if (isNaN(itemDate.getTime())) {
          console.warn('Invalid item date:', item.date);
          return false;
        }
        
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-['Poppins'] flex items-center justify-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-['Poppins'] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }
  
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
              categories={categories}
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