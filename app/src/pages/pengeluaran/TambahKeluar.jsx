import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Upload, Camera } from 'lucide-react'
import DatePicker from 'react-datepicker'
import Webcam from 'react-webcam'
import "react-datepicker/dist/react-datepicker.css"

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
    category: '',
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef(null)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleCameraCapture = () => {
    setShowCamera(true)
  }

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          setSelectedFile(file)
          setShowCamera(false)
        })
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const formattedDate = selectedDate ? 
      `${selectedDate.getDate().toString().padStart(2, '0')}/${
        (selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${
        selectedDate.getFullYear()}` : ''
    
    const newEntry = {
      date: formattedDate,
      nominal: `Rp. ${formData.nominal},-`,
      name: formData.transactionName,
      category: formData.category,
      type: 'Pengeluaran',
      file: selectedFile ? selectedFile.name : null
    }
    
    console.log('New expense entry:', newEntry)
    navigate('/pengeluaran')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center text-blue-500 mb-8">Tambah Pengeluaran</h1>
        
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
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-600 mb-2">Kategori</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.inputField + " appearance-none pr-10"}
                required
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Operasional">Operasional</option>
                <option value="Belanja">Belanja</option>
                <option value="Pembayaran">Pembayaran</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-blue-600 mb-2">Upload Struk</label>
            <div className="border border-gray-300 rounded-lg p-2">
              <div className="flex mb-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('fileInput').click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm ml-2 flex items-center gap-2"
                >
                  <Camera size={16} />
                  Ambil Gambar
                </button>
                <input 
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                />
              </div>
              
              <div className="h-64 border border-gray-200 rounded-lg">
                {showCamera ? (
                  <div className="relative h-full">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={captureImage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full"
                      >
                        Ambil Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCamera(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-full"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : selectedFile ? (
                  <div className="h-full flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-h-full rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <Upload size={40} className="mb-2 text-gray-300" />
                    <p className="text-center text-xs text-gray-300 mt-2">
                      Klik disini atau seret file ke sini PNG/JPG/JPEG.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/pengeluaran')}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TambahKeluar