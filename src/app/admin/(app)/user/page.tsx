"use client";
import axiosInstance from "@/libs/axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
} from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

// Define the User interface
interface User {
  id: number;
  name: string;
  email: string;
  usia: string;
  no_hp: string;
  tempat_tinggal_domisili: string;
  pendidikan_terakhir: string;
  hari_pertama_haid: string;
  wilayah_binaan: string;
  kelurahan: string;
  tempat_periksa_kehamilan: string;
  nama_suami: string;
  no_hp_suami: string;
  email_suami: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

type Puskesmas = "Sangkrah" | "Kratonan" | "Gilingan" | "Bukit Kemuning";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>("");
  const [selectedPuskesmas, setSelectedPuskesmas] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAscending, setIsAscending] = useState(true);
  const [sortedBy, setSortedBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [kelurahanOptions, setKelurahanOptions] = useState<string[]>([]);
  const puskesmasOptions = [
    "Sangkrah",
    "Kratonan",
    "Gilingan",
    "Bukit Kemuning",
  ];
  const puskesmasToKelurahanMap = {
    Sangkrah: ["Sangkrah", "Semanggi", "Kedunglumbu", "Mojo"],
    Kratonan: ["Kratonan", "Danukusuman", "Joyotakan"],
    Gilingan: ["Gilingan", "Kestalan", "Punggawan"],
    "Bukit Kemuning": ["Sukamenanti"],
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem("authTokenAdmin");

        if (!authToken) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/admin/data-user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          setError("Data tidak valid.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePuskesmasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPuskesmas = e.target.value as Puskesmas;
    setSelectedPuskesmas(selectedPuskesmas);

    if (selectedPuskesmas) {
      setKelurahanOptions(puskesmasToKelurahanMap[selectedPuskesmas]);
    } else {
      setKelurahanOptions([]);
    }
    setSelectedKelurahan("");
  };

  const handleKelurahanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKelurahan(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSort = (column: keyof User) => {
    if (sortedBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedBy(column);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const kelurahanMatch =
        !selectedKelurahan || user.kelurahan === selectedKelurahan;
      const puskesmasMatch =
        !selectedPuskesmas || user.wilayah_binaan === selectedPuskesmas;
      const searchMatch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase());

      return kelurahanMatch && puskesmasMatch && searchMatch;
    })
    .sort((a, b) => {
      const column = sortedBy as keyof User;
      const compareA = a[column];
      const compareB = b[column];

      if (typeof compareA === "string" && typeof compareB === "string") {
        if (sortOrder === "asc") {
          return compareA.localeCompare(compareB);
        } else {
          return compareB.localeCompare(compareA);
        }
      }
      return 0;
    });

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentData = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pageRange = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const authToken = localStorage.getItem("authTokenPetugas");
        if (!authToken) {
          setError("No token found");
          return;
        }

        const response = await axiosInstance.post(
          `/admin/data-user/delete/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            icon: "success",
          });

          setUsers(users.filter((user) => user.id !== id));
        } else {
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus data.",
            icon: "error",
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error deleting user");
        }

        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus data.",
          icon: "error",
        });
      }
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <main className="bg-white min-h-screen py-8 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 p-2">
          <div className="flex space-x-4">
            <div className="relative w-full max-w-xs">
              <select
                className="bg-gray-200 p-2 pl-4 pr-10 rounded-lg appearance-none w-full"
                value={selectedPuskesmas}
                onChange={handlePuskesmasChange}
              >
                <option value="">Pilih Puskesmas</option>
                {puskesmasOptions.map((puskesmas, index) => (
                  <option key={index} value={puskesmas}>
                    {puskesmas}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 bg-indigo-500 rounded-md p-2 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/icon/Vector.png"
                  alt="Sort by Puskesmas"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="relative w-full">
              <select
                className="bg-gray-200 p-2 pl-4 pr-10 rounded-lg appearance-none w-full"
                value={selectedKelurahan}
                onChange={handleKelurahanChange}
              >
                <option value="">Pilih Kelurahan</option>
                {kelurahanOptions.map((kelurahan, index) => (
                  <option key={index} value={kelurahan}>
                    {kelurahan}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 bg-indigo-500 rounded-md p-2 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/icon/Vector.png"
                  alt="Sort by Kelurahan"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="relative ml-auto w-1/3">
            <input
              type="text"
              placeholder="Search by Name..."
              onChange={handleSearch}
              className="border p-3 bg-gray-200 rounded-lg w-full pr-12 focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-500 p-2 rounded-full h-8 w-8 text-white" />
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4 border-b text-left cursor-pointer">ID</th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Nama
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Email
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    No HP
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Alamat
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Wilayah Binaan
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Kelurahaan
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-16 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-24 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-32 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-24 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-24 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-32 animate-pulse"></div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="bg-gray-300 h-6 w-32 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : currentData.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center text-lg text-gray-500">
              Data Tidak Ditemukan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4 border-b text-left cursor-pointer">ID</th>
                  <th
                    className="p-4 border-b text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Nama
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDownAlt className="inline ml-2" />
                    ) : (
                      <FaSortAlphaDown className="inline ml-2" />
                    )}
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Email
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    No HP
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Alamat
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Wilayah Binaan
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Kelurahaan
                  </th>
                  <th className="p-4 border-b text-left cursor-pointer">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="p-4 border-b">{user.id}</td>
                    <td className="p-4 border-b">{highlightText(user.name)}</td>
                    <td className="p-4 border-b">{user.email}</td>
                    <td className="p-4 border-b">{user.no_hp}</td>
                    <td className="p-4 border-b">
                      {user.tempat_tinggal_domisili}
                    </td>
                    <td className="p-4 border-b">{user.wilayah_binaan}</td>
                    <td className="p-4 border-b">{user.kelurahan}</td>
                    <td className="p-4 border-b">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="btn btn-secondary p-2 border bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              {totalPages > 1 &&
                pageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn ${
                      page === currentPage
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100"
                    } px-4 p-2 rounded-md transition-colors hover:bg-indigo-500`}
                  >
                    {page}
                  </button>
                ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="btn btn-secondary p-2 border bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UsersPage;
