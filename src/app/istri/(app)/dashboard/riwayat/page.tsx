"use client";

import { useEffect, useState, useCallback } from "react";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import axiosInstance from "@/libs/axios";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { Toaster, toast } from "sonner";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";

export default function RiwayatPage() {
  const [nilaiHb, setNilaiHb] = useState<string>("");
  const [tanggalHaid, setTanggalHaid] = useState<string>("");
  const { data: session, status } = useSession();
  const [totalPemeriksaan, setTotalPemeriksaan] = useState<number>(0);
  const [hbData, setHbData] = useState<any[]>([]); // State for storing Hb data

  const fetchTotalPemeriksaan = useCallback(async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const response = await axiosInstance.get(
          "/istri/dashboard/get-count-cek-hb",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        setTotalPemeriksaan(response.data.data.total_pemeriksaan);
      } catch (error) {
        console.error("Error fetching total pemeriksaan:", error);
        if (error instanceof AxiosError && error.response) {
          toast.error(
            error.response.data.message || "Gagal mengambil data pemeriksaan."
          );
        } else {
          toast.error("Gagal mengambil data pemeriksaan.");
        }
      }
    } else {
      toast.error("Silakan login untuk mengambil data.");
    }
  }, [session, status]);

  const fetchHbData = useCallback(async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const response = await axiosInstance.get(
          "/istri/dashboard/get-user-hb",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        setHbData(response.data.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching Hb data:", error);
        if (error instanceof AxiosError && error.response) {
          toast.error(
            error.response.data.message || "Gagal mengambil data Hb."
          );
        } else {
          toast.error("Gagal mengambil data Hb.");
        }
      }
    } else {
      toast.error("Silakan login untuk mengambil data.");
    }
  }, [session, status]);

  useEffect(() => {
    fetchTotalPemeriksaan();
    fetchHbData(); // Fetch Hb data on component mount
  }, [fetchTotalPemeriksaan, fetchHbData]);

  const handleSubmit = async () => {
    if (status === "authenticated" && session?.accessToken) {
      if (totalPemeriksaan >= 4) {
        toast.error("Anda sudah mencapai batas 4 penambahan data.", {
          duration: 2000,
        });
        return;
      }

      if (!nilaiHb || !tanggalHaid) {
        toast.error("Nilai HB dan tanggal haid tidak boleh kosong.", {
          duration: 2000,
        });
        return;
      }

      const numericNilaiHb = parseFloat(nilaiHb);
      if (isNaN(numericNilaiHb)) {
        toast.error("Nilai HB harus berupa angka.", { duration: 2000 });
        return;
      }

      try {
        const response = await axiosInstance.post(
          "/istri/dashboard/insert-riwayat-hb",
          {
            nilai_hb: numericNilaiHb,
            tanggal: tanggalHaid,
          },
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.data.data.data.hasil_pemeriksaan === "anemia") {
          toast.error(response.data.data.pesan, { duration: 15000 });
        } else {
          toast.success(response.data.data.pesan, { duration: 15000 });
        }

        setNilaiHb(""); // Reset input
        setTanggalHaid(""); // Reset date picker
        fetchTotalPemeriksaan(); // Refresh total pemeriksaan
        fetchHbData(); // Refresh Hb data
      } catch (error) {
        console.error("Error saving data:", error);
        if (error instanceof AxiosError && error.response) {
          toast.error(
            error.response.data.message || "Gagal menyimpan data HB terbaru."
          );
        } else {
          toast.error("Gagal menyimpan data HB terbaru.");
        }
      }
    } else {
      toast.error("Silakan login untuk menyimpan data.");
    }
  };

  return (
    <main>
      <div className="m-5 flex flex-row items-center">
        <Toaster richColors position="top-center" />
        <BackButtonNavigation className="w-10 h-10" />
        <p className="text-2xl font-bold">Data Pemeriksaan Hemoglobin (HB)</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-5">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-5">
          <p className="text-lg">Pemeriksaan Ke: {totalPemeriksaan}</p>
          <div className="w-full relative">
            <input
              type="text"
              id="nilai_hb"
              value={nilaiHb}
              onChange={(e) => setNilaiHb(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="nilai_hb"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-purple-light px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Nilai HB
            </label>
          </div>
          <div className="relative my-2.5 w-full">
            <input
              type="date"
              id="tanggal"
              value={tanggalHaid}
              onClick={(e) => e.currentTarget.showPicker()}
              onChange={(e) => setTanggalHaid(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="tanggal"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-purple-light px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tanggal
            </label>
          </div>
          <hr className="w-full h-0.5 border-t-0 bg-gray-300" />
          <div className="flex flex-row self-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white bg-green-pastel hover:bg-green-pastel/80 focus:outline-none focus:ring-4 focus:ring-green-pastel/30 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Table for displaying Hb data */}
      <div className="mx-5 my-5 bg-white rounded-lg shadow-md mb-40 ">
        <h2 className="text-lg font-bold p-4">Riwayat Pemeriksaan HB</h2>
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 text-center">Tanggal</th>
              <th className="py-2 text-center">Nilai HB</th>
              <th className="py-2 text-center">Hasil Pemeriksaan</th>
            </tr>
          </thead>
          <tbody>
            {hbData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 text-center">{item.tanggal}</td>
                <td className="py-2 text-center">{item.nilai_hb}</td>
                <td className="py-2 text-center">{item.hasil_pemeriksaan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FaHome className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Home
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FiBook className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Edukasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <IoChatbubblesOutline className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Konsultasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <LuUsers className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Profil
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
