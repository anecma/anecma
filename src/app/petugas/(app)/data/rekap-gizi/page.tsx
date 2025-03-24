"use client";
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaHamburger,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSun,
} from "react-icons/fa";
import axiosInstance from "@/libs/axios";
import { FaChevronLeft, FaChevronRight, FaEye, FaUser } from "react-icons/fa6";
import { GiHealthNormal } from "react-icons/gi";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  usia: string;
  no_hp: string;
  tempat_tinggal_ktp: string;
  tempat_tinggal_domisili: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
  hari_pertama_haid: string;
  wilayah_binaan: string;
  kelurahan: string;
  tempat_periksa_kehamilan: string;
  nama_suami: string;
  no_hp_suami: string;
  email_suami: string;
  role: string;
  email_verified_at: string | null;
}

interface RekapData {
  id: number;
  user_id: number;
  usia_kehamilan: number;
  tanggal: string;
  sarapan_karbohidrat: number;
  sarapan_lauk_hewani: number;
  sarapan_lauk_nabati: number;
  sarapan_sayur: number;
  sarapan_buah: number;
  makan_siang_karbohidrat: number | null;
  makan_siang_lauk_hewani: number | null;
  makan_siang_lauk_nabati: number | null;
  makan_siang_sayur: number | null;
  makan_siang_buah: number | null;
  makan_malam_karbohidrat: number;
  makan_malam_lauk_hewani: number;
  makan_malam_lauk_nabati: number;
  makan_malam_sayur: number;
  makan_malam_buah: number;
  total_kalori_karbohidrat: number;
  total_kalori_lauk_hewani: number;
  total_kalori_lauk_nabati: number;
  total_kalori_sayur: number;
  total_kalori_buah: number;
  total_kalori: number;
  hasil_gizi: string;
  created_at: string;
  updated_at: string;
  user: User;
}

const kelurahanData: { [key: string]: string[] } = {
  "Puskesmas Sangkrah": ["Sangkrah", "Semanggi", "Kedunglumbu", "Mojo"],
  "Puskesmas Kratonan": ["Kratonan", "Danukusuman", "Joyotakan"],
  "Puskesmas Gilingan": ["Gilingan", "Kestalan", "Punggawan"],
  "Puskesmas Bukit Kemuning": ["Sukamenanti"],
};

const RekapHb = () => {
  const [data, setData] = useState<RekapData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [isAscending, setIsAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<RekapData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [kelurahanOptions, setKelurahanOptions] = useState<string[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authTokenPetugas");
  
        if (!authToken) {
          setError("No authorization token found.");
          return;
        }
  
        // Ambil data petugas
        const userResponse = await axiosInstance.get("/petugas/get-user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (userResponse.data.success) {
          const userData = userResponse.data.data.user;
  
          // Ambil nama_puskesmas dari response
          const namaPuskesmas = userData.puskesmas[0]?.nama_puskesmas || "";
  
          // Set wilayahBinaanPetugas berdasarkan nama_puskesmas
          const wilayahBinaanPetugas = namaPuskesmas;
  
          // Ambil data rekap HB
          const rekapResponse = await axiosInstance.get("/petugas/data/rekap-konsumsi-gizi", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
  
          if (rekapResponse.data.success) {
            const sortedData = rekapResponse.data.data.sort(
              (a: RekapData, b: RekapData) =>
                a.user.name.localeCompare(b.user.name)
            );
  
            // Filter kelurahan berdasarkan wilayah binaan petugas
            if (wilayahBinaanPetugas && kelurahanData[wilayahBinaanPetugas]) {
              setKelurahanOptions(kelurahanData[wilayahBinaanPetugas]);
            } else {
              setKelurahanOptions([]);
            }
            console.log("wilayah binaan :", wilayahBinaanPetugas)
  
            setData(sortedData);
          } else {
            setError("Failed to fetch rekap data.");
          }
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching data:", err.message);
          setError(`Error fetching data: ${err.message}`);
        } else {
          console.error("Unknown error fetching data:", err);
          setError("Unknown error fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleExportToExcel = async () => {
    setIsLoading(true);

    const authToken = localStorage.getItem("authTokenPetugas");

    if (!authToken) {
      setError("No authorization token found.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(
        "/petugas/rekap-gizi/export-data",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        }
      );

      if (
        response.headers["content-type"].includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        const currentDate = new Date();
        const month = currentDate.toLocaleString("default", { month: "long" });
        const year = currentDate.getFullYear();
        const filename = `rekap-gizi-${month}-${year}.xlsx`;

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      } else {
        setError("Failed to download file. Server returned an invalid file.");
      }
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Error exporting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const nameMatch = item.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const kelurahanMatch =
      selectedKelurahan === "" || item.user.kelurahan === selectedKelurahan;

    return nameMatch && kelurahanMatch;
  });

  const handleSort = () => {
    setIsAscending(!isAscending);
    const sortedData = [...data].sort((a, b) => {
      const nameA = a.user.name.toLowerCase();
      const nameB = b.user.name.toLowerCase();

      if (nameA < nameB) return isAscending ? -1 : 1;
      if (nameA > nameB) return isAscending ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

  const handleDetailClick = (item: RekapData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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

  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("modal-background")) {
      handleCloseModal();
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4 p-2 space-x-4">
        {/* Kelurahan Dropdown */}
        <div className="relative w-full max-w-xs">
          <select
            value={selectedKelurahan}
            onChange={(e) => setSelectedKelurahan(e.target.value)}
            className="bg-gray-200 p-2 pl-4 pr-10 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              alt="Sort by Puskesmas"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Name..."
            onChange={handleSearch}
            className="border p-3 bg-gray-200 rounded-lg w-full pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-500 p-2 rounded-full h-8 w-8 text-white" />
        </div>
      </div>

      <div className="p-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-black p-2">No</th>
              <th
                className="border border-black p-2 cursor-pointer text-center w-3/12"
                onClick={handleSort}
              >
                Nama Ibu Hamil
                {isAscending ? (
                  <FaSortAlphaDownAlt className="inline ml-2" />
                ) : (
                  <FaSortAlphaDown className="inline ml-2" />
                )}
              </th>
              <th className="border border-black p-2">Tanggal Input</th>
              <th className="border border-black p-2">Usia Kehamilan</th>
              <th className="border border-black p-2">Hasil Gizi</th>
              <th className="border border-black p-2">Detail</th>
            </tr>
          </thead>

          {/* Skeleton Loader */}
          {loading ? (
            <tbody>
              {[...Array(rowsPerPage)].map((_, idx) => (
                <tr
                  key={idx}
                  className="animate-pulse border-b border-gray-200"
                >
                  <td className="border border-black p-2">
                    <div className="w-10 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-24 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2 text-center">
                    <div className="w-20 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border border-black p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-black p-2">
                    {highlightText(item.user.name)}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.usia_kehamilan}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.hasil_gizi}
                  </td>
                  <td className="border border-black p-2 text-center">
                    <button
                      onClick={() => handleDetailClick(item)}
                      className="bg-indigo-500 items-center justify-center space-x-2 text-white py-2 px-4 rounded-lg"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Pagination  */}
        <div className="flex justify-end mt-4 space-x-4">
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

        <div className="flex justify-end mt-4">
          <button
            onClick={handleExportToExcel}
            className="flex items-center bg-green-500 text-white p-2 rounded-md hover:bg-green-600 cursor-pointer relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 mr-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                  </div>
                </div>

                <span className="text-sm">Downloading...</span>
              </>
            ) : (
              <>
                <Image
                  src="/icon/excel.svg"
                  alt="Excel Icon"
                  width={20}
                  height={20}
                  className="object-contain mr-2"
                />
                <span className="text-sm">Export Excel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div
          onClick={handleModalBackgroundClick}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  modal-background"
        >
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full h-3/4  overflow-auto shadow-xl ">
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-bold text-center justify-center text-indigo-600">
                Kartu Informasi Kesehatan
              </h2>
            </div>

            {/* Nama Ibu Hamil */}
            <div className="mb-4 mx-4">
              <div className="flex items-center space-x-2">
                <FaUser className="w-6 h-6 text-indigo-600" />
                <p className="text-lg">
                  <strong>Nama Ibu Hamil:</strong> {selectedItem.user.name}
                </p>
              </div>
            </div>

            {/* Usia Kehamilan */}
            <div className="mb-4 mx-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="w-6 h-6 text-yellow-500" />
                <p className="text-lg">
                  <strong>Usia Kehamilan:</strong> {selectedItem.usia_kehamilan}{" "}
                  bulan
                </p>
              </div>
            </div>

            {/* Tanggal Konsultasi */}
            <div className="mb-4 mx-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="w-6 h-6 text-green-500" />
                <p className="text-lg">
                  <strong>Tanggal Konsultasi:</strong> {selectedItem.tanggal}
                </p>
              </div>
            </div>

            <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

            {/* Sarapan */}
            <h3 className="mt-6 font-semibold text-xl text-gray-700 flex items-center mx-4 mb-4">
              <span className="mr-2">
                <FaSun className="w-6 h-6 text-yellow-400" />
              </span>
              Sarapan
            </h3>
            <ul className="list-disc pl-5 space-y-2 mx-4">
              <li>
                <strong>Karbohidrat:</strong>{" "}
                {selectedItem.sarapan_karbohidrat ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Hewani:</strong>{" "}
                {selectedItem.sarapan_lauk_hewani ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Nabati:</strong>{" "}
                {selectedItem.sarapan_lauk_nabati ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Sayur:</strong>{" "}
                {selectedItem.sarapan_sayur ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Buah:</strong>{" "}
                {selectedItem.sarapan_buah ?? "Tidak Makan"}
              </li>
            </ul>

            <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
            {/* Makan Siang */}
            <h3 className="mt-6 font-semibold text-xl text-gray-700 flex items-center mx-4 mb-4">
              <span className="mr-2">
                <FaHamburger className="w-6 h-6 text-green-400" />
              </span>
              Makan Siang
            </h3>
            <ul className="list-disc pl-5 space-y-2 mx-4">
              <li>
                <strong>Karbohidrat:</strong>{" "}
                {selectedItem.makan_siang_karbohidrat ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Hewani:</strong>{" "}
                {selectedItem.makan_siang_lauk_hewani ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Nabati:</strong>{" "}
                {selectedItem.makan_siang_lauk_nabati ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Sayur:</strong>{" "}
                {selectedItem.makan_siang_sayur ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Buah:</strong>{" "}
                {selectedItem.makan_siang_buah ?? "Tidak Makan"}
              </li>
            </ul>

            <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
            {/* Makan Malam */}
            <h3 className="mt-6 font-semibold text-xl text-gray-700 flex items-center mx-4 mb-4">
              <span className="mr-2">
                <FaHamburger className="w-6 h-6 text-purple-400" />
              </span>
              Makan Malam
            </h3>
            <ul className="list-disc pl-5 space-y-2 mx-4">
              <li>
                <strong>Karbohidrat:</strong>{" "}
                {selectedItem.makan_malam_karbohidrat ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Hewani:</strong>{" "}
                {selectedItem.makan_malam_lauk_hewani ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Lauk Nabati:</strong>{" "}
                {selectedItem.makan_malam_lauk_nabati ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Sayur:</strong>{" "}
                {selectedItem.makan_malam_sayur ?? "Tidak Makan"}
              </li>
              <li>
                <strong>Buah:</strong>{" "}
                {selectedItem.makan_malam_buah ?? "Tidak Makan"}
              </li>
            </ul>

            <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
            {/* Total Kalori */}
            <h3 className="mt-6 font-semibold text-xl text-gray-700 flex items-center mx-4 mb-4">
              <span className="mr-2">
                <GiHealthNormal className="w-6 h-6 text-teal-400" />
              </span>
              Total Porsi
            </h3>
            <ul className="list-disc pl-5 space-y-2 mx-4">
              <li>
                <strong>Karbohidrat:</strong>
                {""}
                {selectedItem.total_kalori_karbohidrat ?? "Tidak Tersedia"}
              </li>
              <li>
                <strong>Lauk Hewani:</strong>
                {}
                {selectedItem.total_kalori_lauk_hewani ?? "Tidak Tersedia"}
              </li>
              <li>
                <strong>Lauk Nabati:</strong>
                {""}
                {selectedItem.total_kalori_lauk_nabati ?? "Tidak Tersedia"}
              </li>
              <li>
                <strong>Sayur:</strong>{" "}
                {selectedItem.total_kalori_sayur ?? "Tidak Tersedia"}
              </li>
              <li>
                <strong>Buah:</strong>{" "}
                {selectedItem.total_kalori_buah ?? "Tidak Tersedia"}
              </li>
              <li>
                <strong>Total Porsi:</strong>{" "}
                {selectedItem.total_kalori ?? "Tidak Tersedia"}
              </li>
            </ul>

            <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
            <p className="mt-4 text-lg mx-4 ">
              <strong>Hasil Gizi:</strong> {selectedItem.hasil_gizi}
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RekapHb;
