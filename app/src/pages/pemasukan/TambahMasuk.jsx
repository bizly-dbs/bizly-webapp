import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const styles = {
  btn: "px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
  btnPrimary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
  btnSecondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  inputField: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
}

const TambahMasuk = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    nominal: '',
    transactionName: '',
    category: '',
  })
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Penjualan', selected: true },
    { id: 2, name: 'Pembayaran', selected: false },
    { id: 3, name: 'Penjualan Online', selected: false },
  ])
  
  const [newCategory, setNewCategory] = useState('')
  
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
  }
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1
      setCategories([
        ...categories.map(c => ({ ...c, selected: false })),
        { id: newId, name: newCategory, selected: true }
      ])
      setNewCategory('')
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const selectedCategory = categories.find(c => c.selected)?.name || ''
    
    // Format the date as dd/mm/yyyy
    const formattedDate = selectedDate ? 
      `${selectedDate.getDate().toString().padStart(2, '0')}/${
        (selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${
        selectedDate.getFullYear()}` : ''
    
    const newEntry = {
      date: formattedDate,
      nominal: `Rp. ${formData.nominal},-`,
      name: formData.transactionName,
      category: selectedCategory,
      type: 'Pembayaran'
    }
    
    console.log('New income entry:', newEntry)
    navigate('/pemasukan')
  }
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-center text-blue-500 mb-8">Tambah Pemasukan</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" 
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Nominal</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Transaksi</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <button
                  key={category.id}
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
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-blue-500 font-medium flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Tambah Kategori
              </button>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nama kategori baru"
                className="border border-gray-300 rounded-md px-3 py-1 text-sm flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/pemasukan')}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Batal
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  )
}

export default TambahMasuk

