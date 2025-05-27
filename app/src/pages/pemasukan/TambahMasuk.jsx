import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus, ChevronDown } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { transactionAPI, categoryAPI } from '../../services/api'

const styles = {
  btn: "px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
  btnPrimary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
  btnSecondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  inputField: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  dropdown: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 appearance-none cursor-pointer"
}

const TambahMasuk = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    nominal: '',
    transactionName: '',
    category: '',
    productName: '',
    quantity: ''
  })
  
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newProduct, setNewProduct] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryAPI.getCategories('Pemasukan')
      setCategories(categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        selected: false
      })))
    } catch (err) {
      setError(err.message)
      console.error('Error fetching categories:', err)
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
  }
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('Nama kategori tidak boleh kosong')
      return
    }

    try {
      const newCategoryData = await categoryAPI.createCategory({
        name: newCategory.trim(),
        type: 'Pemasukan'
      })

      setCategories([
        ...categories.map(c => ({ ...c, selected: false })),
        { id: newCategoryData.id, name: newCategoryData.name, selected: true }
      ])
      setNewCategory('')
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error adding category:', err)
    }
  }
  
  const handleAddProduct = () => {
    if (newProduct.trim()) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1
      setProducts([
        ...products,
        { id: newId, name: newProduct }
      ])
      setFormData({
        ...formData,
        productName: newProduct
      })
      setNewProduct('')
      setIsAddingProduct(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
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
        category_name: selectedCategory.name,
        product_name: formData.productName || null,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        transaction_date: formattedDate,
        type: 'Pemasukan'
      }
      
      await transactionAPI.createTransaction(transactionData)
      navigate('/pemasukan')
    } catch (err) {
      setError(err.message)
      console.error('Error creating income:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center text-blue-500 mb-8">Tambah Pemasukan</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

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

          {/* Product selection dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Produk</label>
            {!isAddingProduct ? (
              <div className="relative">
                <select
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={styles.dropdown}
                  required
                >
                  <option value="">Pilih Produk</option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={20} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" 
                />
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(true)}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="Nama produk baru"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Terjual</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Masukkan jumlah produk terjual"
              min="1"
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
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TambahMasuk