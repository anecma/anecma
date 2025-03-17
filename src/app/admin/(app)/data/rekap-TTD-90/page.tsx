"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import axiosInstance from "@/libs/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  tanggal: number;
  hari_pertama_haid: string;
  wilayah_binaan: string;
  kelurahan: string;
  tempat_periksa_kehamilan: string;
  riwayat_hb: RiwayatHb;
}
interface RiwayatHb {
  id: number;
  user_id: number;
  tanggal: string;
  nilai_hb: number;
  usia_kehamilan: number;
  hasil_pemeriksaan: string;
  urutan_periksa: number;
}

interface RekapData {
  id: number;
  user_id: number;
  tahun: number;
  bulan: number;
  nilai_hb: number;
  count_vit_c_0: number;
  count_vit_c_1: number;
  total_jumlah_ttd_dikonsumsi: number;
  user: User;
}
type Puskesmas = "Sangkrah" | "Kratonan" | "Gilingan" | "Bukit Kemuning";

const RekapTTD90 = () => {
  const [data, setData] = useState<RekapData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>("");
  const [selectedPuskesmas, setSelectedPuskesmas] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAscending, setIsAscending] = useState(true);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const authToken = localStorage.getItem("authTokenAdmin");

  //       if (!authToken) {
  //         setError("No authorization token found.");
  //         return;
  //       }

  //       const response = await axiosInstance.get("/admin/data/rekap-ttd-90", {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       });

  //       if (response.data.success) {
  //         const fetchedData: RekapData[] = response.data.data;
  //         const groupedData: Record<number, RekapData> = {};

  //         fetchedData.forEach((item) => {
  //           if (groupedData[item.user_id]) {
  //             groupedData[item.user_id].total_jumlah_ttd_dikonsumsi +=
  //               item.total_jumlah_ttd_dikonsumsi;
  //           } else {
  //             groupedData[item.user_id] = { ...item };
  //           }
  //         });

  //         const sortedData = Object.values(groupedData).sort((a, b) =>
  //           a.user.name.localeCompare(b.user.name)
  //         );

  //         setData(sortedData);
  //       } else {
  //         setError("Failed to fetch data.");
  //       }
  //     } catch (err: any) {
  //       console.error("Error fetching data:", err);
  //       setError("Error fetching data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Contoh dengan JSON

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/data.json"); // Sesuaikan path jika perlu
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: RekapData[] = await response.json();

        const groupedData: Record<number, RekapData> = {};

        data.forEach((item) => {
          if (groupedData[item.user_id]) {
            groupedData[item.user_id].total_jumlah_ttd_dikonsumsi +=
              item.total_jumlah_ttd_dikonsumsi;
          } else {
            groupedData[item.user_id] = { ...item };
          }
        });

        const sortedData = Object.values(groupedData).sort((a, b) =>
          a.user.name.localeCompare(b.user.name)
        );

        setData(sortedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

  const filteredData = data.filter((item) => {
    const nameMatch = item.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const kelurahanMatch =
      selectedKelurahan === "" || item.user.kelurahan === selectedKelurahan;
    const puskesmasMatch =
      selectedPuskesmas === "" ||
      item.user.wilayah_binaan === selectedPuskesmas;

    return nameMatch && kelurahanMatch && puskesmasMatch;
  });

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  const pageRange = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handleExportToExcel = async () => {
    setIsLoading(true);
    const authToken = localStorage.getItem("authTokenAdmin");

    if (!authToken) {
      setError("No authorization token found.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(
        "/admin/rekap-ttd-90/export-data",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        }
      );

      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear();
      const filename = `rekap-ttd-90-${month}-${year}.xlsx`;

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Error exporting data. Please try again.");
    } finally {
      setIsLoading(false);
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
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center mb-4 p-2">
        <div className="flex space-x-4">
          {/* Kelurahan Dropdown */}
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
          {/* Dropdown for Kelurahan */}
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

        {/* Search Input with Icon */}
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

      {/* Table */}
      <div className="p-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-black p-2 w-20">No</th>
              <th
                className="border border-black p-2 cursor-pointer text-center w-48"
                onClick={handleSort}
              >
                Nama Ibu Hamil
                {isAscending ? (
                  <FaSortAlphaDownAlt className="inline ml-2" />
                ) : (
                  <FaSortAlphaDown className="inline ml-2" />
                )}
              </th>
              <th className="border border-black p-2 w-32">Jumlah Total TTD</th>
              <th className="border border-black p-2 w-32">
                HB Terakhir (g/dL)
              </th>
              <th className="border border-black p-2 w-32">Puskesmas</th>
              <th className="border border-black p-2 w-32">Kelurahan</th>
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
                    <div className="w-24 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {currentData.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="border border-black text-end p-2">
                      {index + 1 + indexOfFirstRecord}
                    </td>
                    <td className="border border-black text-end p-2">
                      {highlightText(item.user.name)}
                    </td>
                    <td className="border border-black text-end p-2">
                      {item.total_jumlah_ttd_dikonsumsi}
                    </td>
                    <td className="border border-black text-end p-2">
                      {item.user.riwayat_hb ? item.nilai_hb : "Data Belum ada"}
                    </td>
                    <td className="border border-black text-center p-2">
                      {item.user.wilayah_binaan}
                    </td>
                    <td className="border border-black text-center p-2">
                      {item.user.kelurahan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

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
                className="mr-2 object-contain"
              />
              <span className="text-sm">Export Excel</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RekapTTD90;
