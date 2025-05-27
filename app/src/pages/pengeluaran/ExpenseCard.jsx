import { useState, useEffect } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { transactionAPI, categoryAPI } from '../../services/api'

const DropdownMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-36 z-10 overflow-hidden">
      <button 
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        <Pencil size={16} />
        <span>Edit</span>
      </button>
      <button 
        onClick={onDelete}
        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-red-500 text-sm"
      >
        <Trash2 size={16} />
        <span>Hapus</span>
      </button>
    </div>
  )
}

const EditForm = ({ item, onClose, onSave, categories }) => {
  const [editData, setEditData] = useState({
    name: item.name,
    nominal: item.nominal.replace(/[^0-9]/g, ''),
    date: new Date(item.date.split('/').reverse().join('-')).toISOString().split('T')[0],
    categoryId: item.category_id || ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    // Set the initial category ID based on available data
    let initialCategoryId = item.category_id

    // If we have category.name but no category_id, try to find the matching category
    if (item['category.name'] && !initialCategoryId && categories) {
      const matchingCategory = categories.find(cat => cat.name === item['category.name'])
      if (matchingCategory) {
        initialCategoryId = matchingCategory.id
      }
    }

    // If we still don't have a category ID but have a category name, try to find it
    if (!initialCategoryId && item.category && categories) {
      const matchingCategory = categories.find(cat => cat.name === item.category)
      if (matchingCategory) {
        initialCategoryId = matchingCategory.id
      }
    }

    if (initialCategoryId) {
      setEditData(prev => ({
        ...prev,
        categoryId: initialCategoryId
      }))
    }
  }, [item, categories])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate category
    if (!editData.categoryId) {
      setError('Kategori harus dipilih')
      return
    }

    // Validate amount
    const amount = parseInt(editData.nominal)
    if (isNaN(amount) || amount <= 0) {
      setError('Nominal harus lebih dari 0')
      return
    }

    try {
      const dataToSave = {
        transaction_name: editData.name,
        amount: amount,
        transaction_date: editData.date,
        category_id: editData.categoryId,
        type: 'Pengeluaran'
      }

      await onSave(item.id, dataToSave)
      onClose()
    } catch (err) {
      console.error('Error saving expense:', err)
      setError('Gagal menyimpan perubahan')
    }
  }

  if (error) {
    return (
      <tr className="border-b border-gray-200 bg-red-50">
        <td colSpan="5" className="px-4 py-4">
          <p className="text-red-500 text-center">{error}</p>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-gray-200 bg-blue-50">
      <td colSpan="5" className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
              <input
                type="text"
                value={editData.nominal}
                onChange={(e) => setEditData({ ...editData, nominal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Transaksi</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={editData.categoryId}
                onChange={(e) => setEditData({ ...editData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih Kategori</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await onConfirm()
    } catch (error) {
      console.error('Failed to delete expense:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      setError('Gagal menghapus pengeluaran')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <tr className="border-b border-gray-200 bg-red-50">
        <td colSpan="5" className="px-4 py-4">
          <p className="text-red-500 text-center">{error}</p>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-gray-200 bg-red-50">
      <td colSpan="5" className="px-4 py-4">
        <div className="text-center">
          <p className="text-gray-800 mb-4">Apakah Anda yakin ingin menghapus data ini?</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

const ExpenseRow = ({ item, onSave, onDelete, categories }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getCategoryName = (item) => {
    if (item['category.name']) return item['category.name']
    if (item.category_id && categories) {
      const category = categories.find(cat => String(cat.id) === String(item.category_id))
      return category ? category.name : 'Tanpa Kategori'
    }
    if (item.category) return item.category
    return 'Tanpa Kategori'
  }
  

  const handleEdit = () => {
    setIsEditing(true)
    setShowDropdown(false)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setShowDropdown(false)
  }

  const handleSave = async (id, updatedItem) => {
    // Ensure we're sending category_id in the update
    const dataToUpdate = {
      ...updatedItem,
      category_id: updatedItem.categoryId // Map categoryId to category_id for API
    }
    await onSave(id, dataToUpdate)
    setIsEditing(false)
  }

  const handleConfirmDelete = () => {
    onDelete(item)
    setIsDeleting(false)
  }

  if (isEditing) {
    return <EditForm item={item} onSave={handleSave} onClose={() => setIsEditing(false)} categories={categories} />
  }

  if (isDeleting) {
    return <DeleteConfirmation onConfirm={handleConfirmDelete} onCancel={() => setIsDeleting(false)} />
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-4 text-sm text-gray-700">{item.date}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.nominal}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{item.name}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{getCategoryName(item)}</td>
      <td className="px-4 py-4 text-right relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>
        {showDropdown && <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />}
      </td>
    </tr>
  )
}


const MonthExpenseCard = ({ month, expenseList, onUpdateExpense, onDeleteExpense, categories }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 font-['Poppins'] mb-6 overflow-hidden">
      <h2 className="text-xl font-semibold p-5 text-gray-800">{month}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nominal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama Transaksi</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map((item, index) => (
              <ExpenseRow 
                key={index} 
                item={item} 
                onSave={(id, updatedItem) => onUpdateExpense(month, index, updatedItem)}
                onDelete={() => onDeleteExpense(month, index)}
                categories={categories}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MonthExpenseCard
