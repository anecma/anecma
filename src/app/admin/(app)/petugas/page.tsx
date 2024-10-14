"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaRegUser } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import axiosInstance from "@/libs/axios";
import Swal from "sweetalert2";
import AddPetugasModal from "@/components/modal/petugas/AddPetugasModal";
import EditPetugasModal from "@/components/modal/petugas/EditPetugasModal";
import ShowPetugasModal from "@/components/modal/petugas/ShowPetugas";

interface PuskesmasData {
  id: number;
  nama_puskesmas: string;
  alamat: string;
}

interface PetugasData {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  created_at: string;
  updated_at: string;
  puskesmas_id: number;
  puskesmas: PuskesmasData[];
}

const Petugas: React.FC = () => {
  const [data, setData] = useState<PetugasData[]>([]);
  const [puskesmasList, setPuskesmasList] = useState<PuskesmasData[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showShowModal, setShowShowModal] = useState<boolean>(false);
  const [currentPetugas, setCurrentPetugas] = useState<PetugasData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const [petugasResponse, puskesmasResponse] = await Promise.all([
          axiosInstance.get("/admin/data-petugas-puskesmas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/admin/data-puskesmas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (Array.isArray(petugasResponse.data.data)) {
          setData(petugasResponse.data.data);
        }

        if (Array.isArray(puskesmasResponse.data.data)) {
          setPuskesmasList(puskesmasResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (newPetugas: Partial<PetugasData>) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axiosInstance.post(
        "/admin/data-petugas-puskesmas/insert",
        newPetugas,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const addedPetugas = {
          ...newPetugas,
          id: response.data.data.user.id,
          puskesmas: puskesmasList.filter(
            (p) => p.id === newPetugas.puskesmas_id
          ),
        } as PetugasData;

        setData((prev) => [...prev, addedPetugas]);
        setShowAddModal(false);

        Swal.fire({
          title: "Berhasil!",
          text: "Petugas berhasil ditambahkan.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to add petugas");
      }
    } catch (error) {
      console.error("Error adding petugas:", error);
    }
  };

  const handleEdit = (petugas: PetugasData) => {
    setCurrentPetugas(petugas);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedPetugas: Partial<PetugasData>) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axiosInstance.post(
        `/admin/data-petugas-puskesmas/update/${updatedPetugas.id}`,
        updatedPetugas,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === updatedPetugas.id
              ? { ...item, ...updatedPetugas }
              : item
          )
        );
        setShowEditModal(false);

        Swal.fire({
          title: "Berhasil!",
          text: "Petugas berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to update petugas");
      }
    } catch (error) {
      console.error("Error updating petugas:", error);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat membatalkan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
          const response = await axiosInstance.post(
            `/admin/data-petugas-puskesmas/delete/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Terhapus!", "Petugas telah dihapus.", "success");
          } else {
            Swal.fire("Error!", "Gagal menghapus petugas.", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "Terjadi kesalahan saat menghapus petugas.",
            "error"
          );
        }
      }
    });
  };

  const handleShow = (petugas: PetugasData) => {
    setCurrentPetugas(petugas);
    setShowShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Petugas</h1>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="mr-2" />
            Tambah Petugas
          </button>
        </div>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 mb-2"></div>
            <div className="h-6 bg-gray-300 mb-2"></div>
            <div className="h-6 bg-gray-300 mb-2"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Puskesmas
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">Nama</th>
                  <th className="px-4 py-2 text-left text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">
                      {item.puskesmas.length > 0 ? (
                        item.puskesmas.map((p) => (
                          <div key={p.id}>{p.nama_puskesmas}</div>
                        ))
                      ) : (
                        <div>Tidak ada puskesmas</div>
                      )}
                    </td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.email}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-purple-500 mr-2"
                        aria-label="Edit Petugas"
                        onClick={() => handleEdit(item)}
                      >
                        <BiSolidEdit className="text-lg" />
                      </button>
                      <button
                        className="text-blue-500 mr-2"
                        aria-label="View User"
                        onClick={() => handleShow(item)}
                      >
                        <FaRegUser className="text-lg" />
                      </button>
                      <button
                        className="text-red-500"
                        aria-label="Delete Petugas"
                        onClick={() => handleDelete(item.id)}
                      >
                        <CiTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPetugasModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
        puskesmasList={puskesmasList}
      />
      <EditPetugasModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdate}
        petugasData={currentPetugas!}
        puskesmasList={puskesmasList}
      />
      <ShowPetugasModal
        isOpen={showShowModal}
        onClose={() => setShowShowModal(false)}
        petugasData={currentPetugas}
      />
    </div>
  );
};

export default Petugas;
