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

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<any>({
    ibu_hamil: 0,
    ibu_hamil_anemia_rendah: 0,
    ibu_hamil_anemia_tinggi: 0,
    rata_rata_konsumsi_ttd: "0.000",
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(
          "/admin/dashboard-card-hitung-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    const fetchTableData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axiosInstance.get(
          "/admin/dashboard-data-terbaru",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setTableData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch table data", error);
      }
    };

    fetchData();
    fetchTableData();
  }, []);

  const filteredData = tableData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
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
                <p className="text-4xl">
                  {dashboardData.ibu_hamil_anemia_rendah}
                </p>
              </div>
              <div className="p-4 bg-white rounded shadow text-center">
                <h2 className="text-lg font-semibold border-b border-gray-200 mb-4">
                  Anemia Tinggi
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

      {/* Tabel Data */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="flex justify-end mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pr-10 w-full rounded-lg border border-gray-300 bg-white outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
              ) : (
                filteredData.map((user, index) => {
                  const resikoAnemia =
                    user.resiko_anemia.length > 0
                      ? user.resiko_anemia[0]
                      : null;
                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {user.usia}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resikoAnemia ? resikoAnemia.resiko : "Tidak ada"}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resikoAnemia ? resikoAnemia.konsumsi_ttd_7hari : "0"}
                      </td>
                      <td className="px-4 py-2 text-center border-b border-r">
                        {resikoAnemia ? resikoAnemia.hasil_hb : "0"}
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
