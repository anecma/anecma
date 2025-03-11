"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import axiosInstance from "@/libs/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";

const Skeleton = () => (
  <div className="p-4 bg-white rounded shadow text-center animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
  </div>
);

interface DashboardData {
  ibu_hamil: number;
  ibu_hamil_anemia_rendah: number;
  ibu_hamil_anemia_tinggi: number;
  rata_rata_konsumsi_ttd: string;
}

interface ResikoAnemia {
  resiko: string;
  konsumsi_ttd_7hari: string;
  hasil_hb: string;
}

interface UserData {
  id: number;
  name: string;
  usia: number;
  resiko_anemia: ResikoAnemia[];
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    ibu_hamil: 0,
    ibu_hamil_anemia_rendah: 0,
    ibu_hamil_anemia_tinggi: 0,
    rata_rata_konsumsi_ttd: "0.000",
  });
  const [tableData, setTableData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAscending, setIsAscending] = useState<boolean>(true); // Track sorting state

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authTokenPetugas");
      setLoading(true);
      try {
        const dashboardResponse = await axiosInstance.get(
          "/petugas/dashboard-card-hitung-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (dashboardResponse.data.success) {
          setDashboardData(dashboardResponse.data.data);
        } else {
          setError("Failed to load dashboard data.");
        }
        const tableResponse = await axiosInstance.get(
          "/petugas/dashboard-data-terbaru",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (tableResponse.data.success) {
          const sortedData = tableResponse.data.data.sort(
            (a: UserData, b: UserData) => a.name.localeCompare(b.name)
          );
          setTableData(sortedData);
        } else {
          setError("Failed to load table data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
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
        "/petugas/dashboard/export-data",
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
      const filename = `Dashboard-Admin-${month}-${year}.xlsx`;
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Gagal Melakukan Export:", err);
      setError("Gagal Export, Coba Ulangi Kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  const hitungUmur = (dob: number): number => {
    const tanggalLahir = new Date(dob);
    const hariIni = new Date();

    let umur = hariIni.getFullYear() - tanggalLahir.getFullYear();
    const selisihBulan = hariIni.getMonth() - tanggalLahir.getMonth();

    if (
      selisihBulan < 0 ||
      (selisihBulan === 0 && hariIni.getDate() < tanggalLahir.getDate())
    ) {
      umur--;
    }

    return umur;
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTableData = tableData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentData = filteredTableData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);

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
  const handleSort = () => {
    setIsAscending(!isAscending);
    const sortedData = [...tableData].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return isAscending ? -1 : 1;
      if (nameA > nameB) return isAscending ? 1 : -1;
      return 0;
    });

    setTableData(sortedData);
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
    <div className="p-6 bg-gray-100 flex flex-col">
      {/* Dashboard Card */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Total Ibu Hamil
                </h2>
                <p className="text-4xl">{dashboardData.ibu_hamil}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Ibu Hamil Tidak Anemia
                </h2>
                <p className="text-4xl">
                  {dashboardData.ibu_hamil_anemia_rendah}
                </p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Ibu Hamil Anemia
                </h2>
                <p className="text-4xl">
                  {dashboardData.ibu_hamil_anemia_tinggi}
                </p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Rata-rata TTD
                </h2>
                <p className="text-4xl">
                  {parseFloat(dashboardData.rata_rata_konsumsi_ttd).toFixed(3)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="flex justify-end mb-4">
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
                    className=" object-contain mr-2"
                  />
                  <span className="text-sm">Export Excel</span>
                </>
              )}
            </button>
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-4 py-2 text-center border-r">No</th>
                <th
                  className="px-4 py-2 text-center border-r cursor-pointer"
                  onClick={handleSort}
                >
                  Nama
                  {isAscending ? (
                    <FaSortAlphaDownAlt className="inline ml-2" />
                  ) : (
                    <FaSortAlphaDown className="inline ml-2" />
                  )}
                </th>
                <th className="px-4 py-2 text-center border-r">Usia</th>
                <th className="px-4 py-2 text-center border-r">Rasio Anemia</th>
                <th className="px-4 py-2 text-center border-r">Konsumsi TTD</th>
                <th className="px-4 py-2 text-center border-r">HB Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <Skeleton />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Data Tidak Ditemukan
                  </td>
                </tr>
              ) : (
                currentData.map((user, index) => {
                  const { resiko_anemia } = user;
                  const resiko =
                    resiko_anemia.length > 0 ? resiko_anemia[0] : null;
                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {highlightText(user.name)}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {user.usia ? hitungUmur(user.usia) : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resiko ? resiko.resiko : "Tidak ada"}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resiko ? resiko.konsumsi_ttd_7hari : "0"}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resiko ? resiko.hasil_hb : "0"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
