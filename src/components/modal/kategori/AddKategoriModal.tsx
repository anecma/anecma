import React, { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";

// Pastikan CategoryItem didefinisikan atau diimpor
interface CategoryItem {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  gender: string;
  parent_id: number | null;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CategoryItem) => void;
}

const AddKategoriModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("istri");
  const [parentCategory, setParentCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]); // State untuk menyimpan kategori yang diambil
  const [loading, setLoading] = useState(false); // State untuk indikator loading
  const [error, setError] = useState<string | null>(null); // State untuk penanganan error

  // Mengambil kategori dari API ketika modal dibuka
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("authTokenAdmin"); // Mengambil token dari localStorage

      if (!token) {
        setError("Token tidak ditemukan untuk otentikasi");
        return;
      }

      setLoading(true); // Menandakan bahwa data sedang dimuat

      try {
        const response = await axiosInstance.get("/admin/data-kategori", {
          headers: {
            Authorization: `Bearer ${token}`, // Menambahkan token pada header Authorization
          },
        });

        if (response.data.success && response.data.data) {
          setCategories(response.data.data); // Memperbarui state categories dengan data yang diambil
        } else {
          setError("Gagal mengambil kategori");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil kategori");
      } finally {
        setLoading(false); // Menandakan bahwa proses pengambilan data selesai
      }
    };

    if (isOpen) {
      fetchCategories(); // Ambil data hanya ketika modal dibuka
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (categoryName && description) {
      const newCategory: CategoryItem = {
        id: Date.now(), // Sebagai contoh, menghasilkan ID unik
        nama_kategori: categoryName,
        deskripsi: description,
        gender: gender,
        parent_id: parentCategory,
      };

      // Menambahkan log untuk melihat data kategori yang akan dikirim
      console.log("Data yang akan dikirim:", newCategory);

      onAdd(newCategory);
    } else {
      console.log("Form belum lengkap");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">Tambah Kategori Baru</h2>

        {/* Pesan error */}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="relative my-2.5">
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <label
            htmlFor="categoryName"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            Nama Kategori
          </label>
        </div>

        <div className="relative my-2.5">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            Deskripsi
          </label>
        </div>

        <div className="relative my-2.5">
          <select
            id="gender"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="istri">Istri</option>
            <option value="suami">Suami</option>
          </select>
          <label
            htmlFor="gender"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            Gender
          </label>
        </div>

        <div className="relative my-2.5">
          <select
            id="parentCategory"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={parentCategory || ""}
            onChange={(e) => setParentCategory(e.target.value ? parseInt(e.target.value) : null)}
            disabled={loading} // Menonaktifkan dropdown saat data sedang dimuat
          >
            <option value="">Pilih Kategori Induk</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nama_kategori} - ({category.gender})
              </option>
            ))}
          </select>
          <label
            htmlFor="parentCategory"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            Kategori Induk
          </label>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 transform hover:scale-105"
          >
            Tambahkan
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddKategoriModal;
