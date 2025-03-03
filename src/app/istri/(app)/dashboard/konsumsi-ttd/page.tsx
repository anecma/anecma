"use client";
import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from "sonner";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";

interface KonsumsiData {
  tanggal_waktu: string;
  total_tablet_diminum: number;
  minum_vit_c: boolean;
}

export default function KonsumsiTtdPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [vitCChecked, setVitCChecked] = useState(false);
  const [tabletCount, setTabletCount] = useState("");
  const [dataTable, setDataTable] = useState<KonsumsiData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: session } = useSession();

  interface ApiResponseItem {
    tanggal_waktu: string;
    total_tablet_diminum: number;
    minum_vit_c: number; 
  }

  const fetchTabletData = useCallback(async () => {
    if (!session || !session.accessToken) return;

    try {
      const response = await axiosInstance.get(
        "/istri/dashboard/get-konsumsi-ttd",
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(
          (item: ApiResponseItem) => ({
            tanggal_waktu: item.tanggal_waktu,
            total_tablet_diminum: item.total_tablet_diminum,
            minum_vit_c: Boolean(item.minum_vit_c),
          })
        );
        setDataTable(formattedData);
      } else {
        setErrorMessage("Data tidak valid.");
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      setErrorMessage("Gagal mengambil data konsumsi.");
    }
  }, [session]);

  useEffect(() => {
    fetchTabletData(); 
  }, [fetchTabletData]);

  const handleSave = async () => {
    if (!session || !session.accessToken) {
      setErrorMessage("User is not authenticated.");
      return;
    }
  
    setIsSaving(true);
  
    try {
      if (!selectedDate) {
        setErrorMessage("Tanggal tidak boleh kosong.");
        setIsSaving(false);
        return;
      }
  
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
  
      await axiosInstance.post(
        "/istri/dashboard/konsumsi-ttd",
        {
          tanggal_waktu: formattedDate,
          minum_vit_c: vitCChecked ? 1 : 0,
          total_tablet_diminum: tabletCount,
        },
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
  
      toast.success("TTD Berhasil Ditambahkan!", { position: "top-center" });
      fetchTabletData(); 
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data.";
      setErrorMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleClear = () => {
    setSelectedDate(null);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Toaster richColors position="top-center" />

      <div className="m-5 flex flex-row items-center">
        <BackButtonNavigation className="w-10 h-10" />
        <p className="text-2xl font-bold">Konsumsi TTD</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-5">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-5">
          <p className="text-xl">Minum TTD</p>
          <div className="relative w-full">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Pilih tanggal"
              className="form-input w-full border-gray-300 rounded-md shadow-sm"
              renderCustomHeader={({ date }) => (
                <div className="flex justify-between p-2">
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Hari ini
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-red-600 hover:text-red-800"
                  >
                    Bersihkan
                  </button>
                </div>
              )}
            />
          </div>
          <div className="relative w-full mb-4">
            <label
              htmlFor="total_tablet_diminum"
              className="text-sm mb-1 block"
            >
              Berapa Tablet:
            </label>
            <input
              id="total_tablet_diminum"
              type="number"
              value={tabletCount}
              onChange={(e) => setTabletCount(e.target.value)}
              className="form-input border-gray-300 rounded-md shadow-sm"
              placeholder="Masukkan jumlah tablet"
            />
          </div>

          <div>
            <p className="text-sm">Apakah bersamaan dengan minum vit C?</p>
          </div>
          <div className="w-full flex flex-row gap-2.5 justify-around items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="text-xl">Minum Vit C</p>
            </div>
            <input
              id="vit-c-checkbox"
              type="checkbox"
              checked={vitCChecked}
              onChange={() => setVitCChecked(!vitCChecked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <hr className="w-full h-0.5 border-t-0 bg-gray-300" />
          <div className="flex flex-row self-end">
            <button
              type="button"
              onClick={handleSave}
              className={`text-white ${
                isSaving ? "bg-gray-400" : "bg-green-pastel"
              } ${
                isSaving ? "hover:bg-gray-400" : "hover:bg-green-pastel/80"
              } focus:outline-none focus:ring-4 ${
                isSaving ? "focus:ring-gray-400" : "focus:ring-green-pastel/30"
              } font-medium rounded-full text-sm px-5 py-2.5 text-center me-2`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow mx-5 mb-40">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Data Konsumsi TTD</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tablet Diminum
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Minum Vit C
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataTable.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 w-1/3">
                    {" "}
                    {item.tanggal_waktu.split(" ")[0]}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 w-1/4">
                    {" "}
                    {item.total_tablet_diminum}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 w-1/4">
                    {" "}
                    {item.minum_vit_c ? "Ya" : "Tidak"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <p className="text-sm text-blue-600">Home</p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <p className="text-sm text-gray-500 group-hover:text-blue-600">
              Edukasi
            </p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <p className="text-sm text-gray-500 group-hover:text-blue-600">
              Konsultasi
            </p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <p className="text-sm text-gray-500 group-hover:text-blue-600">
              Users
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
