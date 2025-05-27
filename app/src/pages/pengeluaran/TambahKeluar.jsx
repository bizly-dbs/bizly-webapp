import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus, X } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { transactionAPI, categoryAPI } from '../../services/api'

const styles = {
  btn: "px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
  btnPrimary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
  btnSecondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  inputField: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
}

const TambahKeluar = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    nominal: '',
    transactionName: '',
    categoryId: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories('Pengeluaran')
      setCategories(response.map(cat => ({
        ...cat,
        selected: false
      })))
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setError('Gagal memuat kategori')
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCategorySelect = (id) => {
    setCategories(
      categories.map(cat => ({
        ...cat,
        selected: cat.id === id
      }))
    )
    setFormData(prev => ({
      ...prev,
      categoryId: id
    }))
  }
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Nama kategori tidak boleh kosong')
      return
    }

    setIsAddingCategory(true)
    setError(null)

    try {
      await categoryAPI.createCategory({
        name: newCategoryName.trim(),
        type: 'Pengeluaran'
      })

      // Fetch updated categories list after adding new category
      await fetchCategories()
      
      setNewCategoryName('')
    } catch (error) {
      console.error('Failed to add category:', error)
      setError(error.message || 'Gagal menambahkan kategori')
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId) return

    try {
      await categoryAPI.deleteCategory(categoryId)
      
      // Update categories list and clear selection if deleted category was selected
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      if (formData.categoryId === categoryId) {
        setFormData(prev => ({ ...prev, categoryId: '' }))
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      setError(error.message || 'Gagal menghapus kategori')
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const selectedCategory = categories.find(c => c.selected)
      if (!selectedCategory) {
        throw new Error('Pilih kategori terlebih dahulu')
      }

      const formattedDate = selectedDate ? 
        `${selectedDate.getFullYear()}-${
          (selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${
          selectedDate.getDate().toString().padStart(2, '0')}` : ''
      
      const transactionData = {
        transaction_name: formData.transactionName,
        amount: parseInt(formData.nominal.replace(/[^0-9]/g, '')),
        category_id: selectedCategory.id,
        transaction_date: formattedDate,
        type: 'Pengeluaran'
      }
      
      await transactionAPI.createTransaction(transactionData)
      navigate('/pengeluaran')
    } catch (error) {
      console.error('Failed to create expense:', error)
      setError(error.message || 'Gagal menambahkan pengeluaran')
    } finally {
      setLoading(false)
    }
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center text-blue-500 mb-8">Tambah Pengeluaran</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-600 mb-2">Tanggal</label>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yy"
                className={styles.inputField + " pl-10"}
                required
              />
              <Calendar 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-600 mb-2">Jumlah Nominal</label>
            <input
              type="text"
              name="nominal"
              value={formData.nominal}
              onChange={handleChange}
              placeholder="Nominal Rupiah"
              className={styles.inputField}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-600 mb-2">Nama Transaksi</label>
            <input
              type="text"
              name="transactionName"
              value={formData.transactionName}
              onChange={handleChange}
              placeholder="Ketik disini.."
              className={styles.inputField}
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-blue-600 mb-2">Kategori</label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <div key={category.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`px-3 py-1 text-sm rounded-md flex items-center ${
                        category.selected 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        category.selected ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
                      }`}>
                        {category.selected && '✓'}
                      </span>
                      {category.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus kategori"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nama kategori baru"
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm flex-1"
                  disabled={isAddingCategory}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className={`${styles.btn} ${styles.btnPrimary} text-sm`}
                  disabled={isAddingCategory}
                >
                  {isAddingCategory ? 'Menambahkan...' : 'Tambah Kategori'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/pengeluaran')}
              className={`${styles.btn} ${styles.btnSecondary}`}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TambahKeluar
