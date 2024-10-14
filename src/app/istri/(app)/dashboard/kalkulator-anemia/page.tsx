"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { FaPlus } from "react-icons/fa";

interface UserData {
  usia_kehamilan: string;
  jumlah_anak: string;
  konsumsi_ttd_7hari: string;
  hasil_hb_terakhir: string;
  hasil_gizi: string;
  riwayat_anemia: number; // 0 for Rendah, 1 for Tinggi
  lingkar_lengan_atas: string;
}

export default function KalkulatorAnemiaPage() {
  const [userData, setUserData] = useState<UserData>({
    usia_kehamilan: "",
    jumlah_anak: "",
    konsumsi_ttd_7hari: "",
    hasil_hb_terakhir: "",
    hasil_gizi: "",
    riwayat_anemia: 0, // 0 for Rendah, 1 for Tinggi
    lingkar_lengan_atas: "",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          // Fetch user data first
          const userResponse = await axiosInstance.get("/istri/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
  
          if (userResponse.data.success) {
            const { riwayat_hb } = userResponse.data.data.user;
  
            setUserData((prevState) => ({
              ...prevState,
              usia_kehamilan: riwayat_hb?.usia_kehamilan || "",
              hasil_hb_terakhir: riwayat_hb?.nilai_hb || "",
            }));
  
            const giziResponse = await axiosInstance.get("/istri/dashboard/get-latest-jurnal-makan", {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            });
  
            if (giziResponse.data.success) {
              const { hasil_gizi } = giziResponse.data.data;

              
              setUserData((prevState) => ({
                ...prevState,
                hasil_gizi: hasil_gizi || "",
              }));
            } else {
              console.warn("Failed to fetch hasil_gizi:", giziResponse.data.message);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
  
    fetchUserData();
  }, [session, status]);
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCalculateRisk = async () => {
    try {
      const response = await axiosInstance.post("/istri/dashboard/kalkulator-anemia", userData, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
  
      if (response.data.success) {
        
        // Simpan hasil respon ke localStorage
        localStorage.setItem('Resiko anemia', JSON.stringify(response.data.data));
        
        // Redirect to the results page
        window.location.href = `/istri/dashboard/kalkulator-anemia/hasil`;
      } else {
        console.error("Error calculating risk:", response.data.message);
        // Handle error feedback
      }
    } catch (error) {
      console.error("Error sending data:", error);
      // Handle network or other errors
    }
  };
  
  

  const handleAnemiaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setUserData((prevData) => ({
      ...prevData,
      riwayat_anemia: value === "tinggi" ? 1 : 0, // Set to 1 for Tinggi, 0 for Rendah
    }));
  };

  return (
    <main>
      {/* Header */}
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Kalkulator Anemia</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5">
        <form className="flex flex-col gap-2.5">
          <div className="relative my-2.5">
            <input
              type="text"
              id="usia_kehamilan"
              value={userData.usia_kehamilan}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              readOnly // Keep as read-only if the value is fetched
            />
            <label
              htmlFor="usia_kehamilan"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Usia Kehamilan
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="jumlah_anak"
              value={userData.jumlah_anak}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="jumlah_anak"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Jumlah Anak
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="konsumsi_ttd_7hari"
              value={userData.konsumsi_ttd_7hari}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="konsumsi_ttd_7hari"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Jumlah Konsumsi TTD 7 Hari Terakhir
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="hasil_hb_terakhir"
              value={userData.hasil_hb_terakhir}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              readOnly // Keep as read-only if the value is fetched
            />
            <label
              htmlFor="hasil_hb_terakhir"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Hasil Pemeriksaan HB Terakhir
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="hasil_gizi"
              value={userData.hasil_gizi}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              readOnly // Keep as read-only if the value is fetched
            />
            <label
              htmlFor="hasil_gizi"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Hasil Gizi
            </label>
          </div>

          <div className="relative my-2.5">
            <select
              id="riwayat_anemia"
              value={userData.riwayat_anemia === 1 ? "tinggi" : "rendah"}
              onChange={handleAnemiaChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="rendah">Rendah</option>
              <option value="tinggi">Tinggi</option>
            </select>
            <label
              htmlFor="riwayat_anemia"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Riwayat Anemia
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="lingkar_lengan_atas"
              value={userData.lingkar_lengan_atas}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="lingkar_lengan_atas"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Lingkar Lengan Atas
            </label>
          </div>

          <div className="flex justify-center mt-4  mb-32">
            <button
              type="button"
              onClick={handleCalculateRisk}
              className="text-white bg-green-pastel hover:bg-green-pastel/90 focus:ring-4 focus:outline-none focus:ring-green-pastel/35 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
            >
              <FaPlus />
              Hitung Resiko
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
