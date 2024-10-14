"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import dynamic from "next/dynamic";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import parse from "html-react-parser";
import Swal, { SweetAlertResult } from "sweetalert2";
import { Edukasi } from "@/components/datatable/DataTable";

// Skeleton Loader
const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="h-6 bg-gray-200 rounded mb-2"></div>
    ))}
  </div>
);

// Dynamic Imports for Modals
const AddModal = dynamic(() => import("@/components/modal/edukasi/AddModal"), {
  ssr: false,
});
const EditModal = dynamic(
  () => import("@/components/modal/edukasi/EditModal"),
  { ssr: false }
);
const ShowModal = dynamic(
  () => import("@/components/modal/edukasi/ShowModal"),
  { ssr: false }
);

const DataTable: React.FC = () => {
  const [data, setData] = useState<Edukasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "add" | "edit" | "show" | null;
  }>({ isOpen: false, type: null });
  const [selectedItem, setSelectedItem] = useState<Edukasi | null>(null);

  const showAlert = (
    title: string,
    text: string,
    icon: "success" | "error"
  ): Promise<SweetAlertResult<any>> => {
    return Swal.fire(title, text, icon);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axiosInstance.get("/admin/data-edukasi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = async (id: number) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axiosInstance.get(
        `/admin/data-edukasi/show/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setSelectedItem(response.data.data);
        setModalState({ isOpen: true, type: "show" });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching item details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (
    newData: Omit<Edukasi, "id"> & { thumbnail: File }
  ) => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    formData.append("judul", newData.judul);
    formData.append("konten", newData.konten);
    formData.append("thumbnail", newData.thumbnail);
    formData.append("jenis", newData.jenis);
    formData.append("kategori", newData.kategori);

    try {
      const response = await axiosInstance.post(
        "/admin/data-edukasi/insert",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Berhasil!", "Data berhasil ditambahkan.", "success");
        fetchData();
      } else {
        Swal.fire("Error!", response.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan data", "error");
    } finally {
      setModalState({ isOpen: false, type: null });
    }
  };

  const handleEdit = async (editData: {
    id: number;
    judul: string;
    konten: string;
    thumbnail: File | string | null;
    jenis: string;
    kategori: string;
  }) => {
    const { id, ...rest } = editData;
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    formData.append("judul", rest.judul);
    formData.append("konten", rest.konten);
    if (rest.thumbnail) {
      formData.append("thumbnail", rest.thumbnail);
    }
    formData.append("jenis", rest.jenis);
    formData.append("kategori", rest.kategori);

    try {
      const response = await axiosInstance.post(
        `/admin/data-edukasi/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
        fetchData();
      } else {
        Swal.fire("Error!", response.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Terjadi kesalahan saat memperbarui data", "error");
    } finally {
      setModalState({ isOpen: false, type: null });
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post(
          `/admin/data-edukasi/delete/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          Swal.fire("Dihapus!", "Data telah dihapus.", "success");
          fetchData();
        } else {
          Swal.fire("Error!", response.data.message, "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Terjadi kesalahan saat menghapus data", "error");
      }
    }
  };

  const renderKonten = (konten: string) => {
    const firstParagraph = konten.split(/<\/?p>/)[1] || "";
    return parse(`<p>${firstParagraph}</p>`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Daftar Edukasi</h2>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setModalState({ isOpen: true, type: "add" })}
          >
            Tambah Data
          </button>
        </div>
        {modalState.isOpen && modalState.type === "add" && (
          <AddModal
            onClose={() => setModalState({ isOpen: false, type: null })}
            onAdd={handleAdd}
          />
        )}
        {modalState.isOpen && modalState.type === "edit" && selectedItem && (
          <EditModal
            onClose={() => setModalState({ isOpen: false, type: null })}
            onEdit={handleEdit}
            item={selectedItem}
            defaultThumbnail={selectedItem.thumbnail}
          />
        )}

        {modalState.isOpen && modalState.type === "show" && selectedItem && (
          <ShowModal
            onClose={() => setModalState({ isOpen: false, type: null })}
            item={selectedItem}
          />
        )}
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Judul</th>
                  <th className="px-4 py-2 text-left text-gray-600">Konten</th>
                  <th className="px-4 py-2 text-left text-gray-600">Jenis</th>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Kategori
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-purple-100" : "bg-white"}
                  >
                    <td className="px-4 py-2">{item.judul}</td>
                    <td className="px-4 py-2">{renderKonten(item.konten)}</td>
                    <td className="px-4 py-2">{item.jenis}</td>
                    <td className="px-4 py-2">{item.kategori}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-purple-500 mr-2"
                        onClick={() => handleShow(item.id)}
                      >
                        <AiOutlineEye />
                      </button>
                      <button
                        className="text-purple-500 mr-2"
                        onClick={() => {
                          setSelectedItem(item);
                          setModalState({ isOpen: true, type: "edit" });
                        }}
                      >
                        <AiOutlineEdit />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
