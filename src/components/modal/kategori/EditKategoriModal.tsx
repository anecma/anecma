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

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: CategoryItem) => void;
  categoryData: CategoryItem | null;
}

const EditKategoriModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onEdit, categoryData }) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [gender, setGender] = useState<string>("istri");
  const [parentCategory, setParentCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]); // State untuk kategori yang diambil
  const [loading, setLoading] = useState(false); // State indikator loading
  const [error, setError] = useState<string | null>(null); // State error

  // Mengambil kategori dari API ketika modal dibuka
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const token = localStorage.getItem("authTokenAdmin"); // Mengambil token untuk otentikasi
      if (!token) {
        setError("Token tidak ditemukan untuk otentikasi");
        return;
      }

      try {
        const response = await axiosInstance.get("/admin/data-kategori", {
          headers: {
            Authorization: `Bearer ${token}`, // Menambahkan token pada header Authorization
          },
        });

        if (response.data.success && response.data.data) {
          setCategories(response.data.data); // Menyimpan kategori yang diambil
        } else {
          setError("Gagal mengambil kategori");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil kategori");
      } finally {
        setLoading(false); // Menyelesaikan loading
      }
    };

    if (isOpen) {
      fetchCategories(); // Ambil kategori hanya ketika modal terbuka
    }
  }, [isOpen]);

  // Menyesuaikan state dengan data kategori yang dipilih
  useEffect(() => {
    if (categoryData) {
      setCategoryName(categoryData.nama_kategori);
      setDescription(categoryData.deskripsi);
      setGender(categoryData.gender);
      setParentCategory(categoryData.parent_id);
    }
  }, [categoryData]);

  const handleSubmit = () => {
    if (categoryData && categoryName && description) {
      const updatedCategory: CategoryItem = {
        id: categoryData.id,  // Menggunakan ID kategori yang sedang diedit
        nama_kategori: categoryName,
        deskripsi: description,
        gender: gender,
        parent_id: parentCategory,
      };
      onEdit(updatedCategory);  // Kirim data kategori yang diperbarui
    } else {
      console.log("Form belum lengkap");
    }
  };

  return isOpen && categoryData ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Edit Kategori</h2>

        {/* Pesan error */}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Nama Kategori Input */}
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

        {/* Deskripsi Input */}
        <div className="relative my-2.5">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            Deskripsi
          </label>
        </div>

        {/* Gender Input */}
        <div className="relative my-2.5">
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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

        {/* Parent Category Input */}
        <div className="relative my-2.5">
          <select
            id="parentCategory"
            value={parentCategory || ""}
            onChange={(e) => setParentCategory(e.target.value ? parseInt(e.target.value) : null)}
            disabled={loading}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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

        <div className="flex justify-end space-x-3 mt-12">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Perbarui Kategori
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg flex items-center hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditKategoriModal;
