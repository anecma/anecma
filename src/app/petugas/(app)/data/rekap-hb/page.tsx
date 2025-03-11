"use client";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortNumericDown,
  FaSortNumericDownAlt,
} from "react-icons/fa";
import axiosInstance from "@/libs/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  hari_pertama_haid: string;
  wilayah_binaan: string;
  kelurahan: string;
  tempat_periksa_kehamilan: string;
}

interface RekapData {
  id: number;
  user_id: number;
  tanggal: string;
  nilai_hb: number;
  usia_kehamilan: number;
  hasil_pemeriksaan: string;
  created_at: string;
  updated_at: string;
  urutan_periksa: number;
  user: User;
}

const RekapHb = () => {
  const [data, setData] = useState<RekapData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [isAscending, setIsAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUrutanAscending, setIsUrutanAscending] = useState<boolean>(true);
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

        const response = await axiosInstance.get("/petugas/data/rekap-hb", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          const sortedData = response.data.data.sort(
            (a: RekapData, b: RekapData) =>
              a.user.name.localeCompare(b.user.name)
          );

          const kelurahanSet: Set<string> = new Set(
            response.data.data.map((item: RekapData) => item.user.kelurahan)
          );
          setKelurahanOptions(Array.from(kelurahanSet));
          setData(sortedData);
        } else {
          setError("Failed to fetch data.");
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const nameMatch = item.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const kelurahanMatch = selectedKelurahan
      ? item.user.kelurahan === selectedKelurahan
      : true;
    return nameMatch && kelurahanMatch;
  });

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
        "/petugas/rekap-hb/export-data",
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
        const filename = `rekap-hb-${month}-${year}.xlsx`;

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

  const handlesort = () => {
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
  const handleSortUrutan = (key: string) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "urutan_periksa") {
        return isUrutanAscending ? a[key] - b[key] : b[key] - a[key];
      }
      return 0;
    });
    setData(sortedData);
    setIsUrutanAscending(!isUrutanAscending);
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

      {/* Table Section */}
      <div className="p-4">
        <table className="table-fixed w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2 w-60" onClick={handlesort}>
                Nama Ibu Hamil
                {isAscending ? (
                  <FaSortAlphaDownAlt className="inline ml-2" />
                ) : (
                  <FaSortAlphaDown className="inline ml-2" />
                )}
              </th>
              <th
                className="border border-black p-2 w-48 "
                onClick={() => handleSortUrutan("urutan_periksa")}
              >
                Urutan Periksa
                {isUrutanAscending ? (
                  <FaSortNumericDownAlt className="inline ml-2" />
                ) : (
                  <FaSortNumericDown className="inline ml-2" />
                )}
              </th>
              <th className="border border-black p-2 w-48">Tanggal Input HB</th>
              <th className="border border-black p-2 w-40">Hasil HB (g/dL)</th>
              <th className="border border-black p-2 w-44">Status Anemia</th>
              <th className="border border-black p-2 w-40">Kelurahan</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              {[...Array(rowsPerPage)].map((_, idx) => (
                <tr
                  key={idx}
                  className="animate-pulse border-b border-gray-200"
                >
                  <td className="border border-black p-2">
                    <div className="w-7 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg"></div>
                  </td>
                  <td className="border border-black p-2">
                    <div className="w-20 h-6 bg-gray-300 rounded-lg"></div>
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
                const statusAnemia = item.nilai_hb < 11.0 ? "Anemia" : "Normal";
                return (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-black text-end p-2">
                      {index + 1 + indexOfFirstRecord}
                    </td>
                    <td className="border border-black text-start p-2">
                      {highlightText(item.user.name)}
                    </td>
                    <td className="border border-black text-center p-2">
                      {item.urutan_periksa}
                    </td>
                    <td className="border border-black text-center p-2">
                      {new Date(item.tanggal).toLocaleDateString()}
                    </td>
                    <td className="border border-black text-center p-2">
                      {item.nilai_hb}
                    </td>
                    <td className="border border-black text-center p-2">
                      {statusAnemia}
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
  );
};

export default RekapHb;
