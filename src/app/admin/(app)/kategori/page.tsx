"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import axiosInstance from "@/libs/axios";
import AddCategoryModal from "@/components/modal/kategori/AddKategoriModal";
import EditCategoryModal from "@/components/modal/kategori/EditKategoriModal";
import Swal from "sweetalert2";

interface CategoryItem {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  gender: string;
  parent_id: number | null;
}

const KategoriPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<CategoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authTokenAdmin");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axiosInstance.get("/admin/data-kategori", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log( response.data.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Gagal memuat kategori. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (data: CategoryItem) => {
    try {
      const token = localStorage.getItem("authTokenAdmin");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        "/admin/data-kategori/insert",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setCategories((prev) => [...prev, response.data.data]);
        setIsAddModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kategori berhasil ditambahkan!",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Gagal menambahkan kategori. Coba lagi.");
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    Swal.fire({
      title: `Apakah anda yakin ingin menghapus kategori ${name}?`,
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await confirmDelete(id);
      }
    });
  };

  const confirmDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("authTokenAdmin");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        `/admin/data-kategori/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setCategories((prev) => prev.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kategori berhasil dihapus!",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Gagal menghapus kategori. Coba lagi.");
    }
  };

  const handleEditCategory = async (data: CategoryItem) => {
    try {
      const token = localStorage.getItem("authTokenAdmin");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        `/admin/data-kategori/update/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          )
        );
        setIsEditModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kategori berhasil diperbarui!",
        });
      }
    } catch (error) {
      console.error("Error editing category:", error);
      setError("Gagal memperbarui kategori. Coba lagi.");
    }
  };

  const openEditModal = (item: CategoryItem) => {
    setEditCategoryData(item);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Kategori</h1>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Tambahkan Kategori
          </button>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-300 mb-2"></div>
            <div className="h-6 bg-gray-300 mb-2"></div>
            <div className="h-6 bg-gray-300 mb-2"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Nama Kategori</th>
                  <th className="px-4 py-2 text-left text-gray-600">Parent Kategori</th>
                  <th className="px-4 py-2 text-left text-gray-600">Gender</th>
                  <th className="px-6 py-3 text-left text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((item, index
                    
                  ) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-purple-100" : "bg-white"}>
                      <td className="px-6 py-4">{item.nama_kategori}</td>
                      <td className="px-6 py-4">{item.parent_id}</td>
                      <td className="px-6 py-4">{item.gender}</td>
                      
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="text-purple-500 hover:text-purple-700"
                          onClick={() => openEditModal(item)}
                        >
                          <FaRegEdit className="text-lg" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCategory(item.id, item.nama_kategori)}
                        >
                          <CiTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center" colSpan={3}>
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditCategory}
        categoryData={editCategoryData}
      />
    </div>
  );
};

export default KategoriPage;