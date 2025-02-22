"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "@/libs/axios";

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authTokenPetugas");
      setLoading(true);
      try {
        const dashboardResponse = await axiosInstance.get("/petugas/dashboard-card-hitung-data", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (dashboardResponse.data.success) {
          setDashboardData(dashboardResponse.data.data);
        } else {
          setError("Failed to load dashboard data.");
        }
        const tableResponse = await axiosInstance.get("/petugas/dashboard-data-terbaru", {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        console.log(tableData)

        if (tableResponse.data.success) {
          setTableData(tableResponse.data.data);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  const filteredTableData = tableData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  Jumlah Ibu Hamil
                </h2>
                <p className="text-4xl">{dashboardData.ibu_hamil}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Anemia Rendah
                </h2>
                <p className="text-4xl">{dashboardData.ibu_hamil_anemia_rendah}</p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Anemia Tinggi
                </h2>
                <p className="text-4xl">{dashboardData.ibu_hamil_anemia_tinggi}</p>
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
                <th className="px-4 py-2 text-center border-r">Nama</th>
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
              ) : filteredTableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Data Tidak Ditemukan
                  </td>
                </tr>
              ) : (
                filteredTableData.map((user, index) => {
                  const { resiko_anemia } = user;
                  const resiko = resiko_anemia.length > 0 ? resiko_anemia[0] : null;
                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-2 text-center border-b border-r">{index + 1}</td>
                      <td className="px-4 py-2 text-center border-b border-r">{highlightText(user.name)}</td>
                      <td className="px-4 py-2 text-center border-b border-r">{user.usia}</td>
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
