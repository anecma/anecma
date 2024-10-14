"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io'; // Mengimpor ikon

// Mendeklarasikan tipe untuk hasil kalkulator
interface HasilKalkulator {
  resiko: string;
}

const Hasil: React.FC = () => {
  const [hasil, setHasil] = useState<HasilKalkulator | null>(null);

  useEffect(() => {
    // Mengambil hasil dari localStorage
    const storedResults = localStorage.getItem('Resiko anemia');
    if (storedResults) {
      setHasil(JSON.parse(storedResults) as HasilKalkulator);
    }
  }, []);

  const getBackgroundClass = (riskLevel: string) => {
    return riskLevel === 'tinggi' ? 'bg-red-600' : 'bg-green-600';
  };

  const handleHitungUlang = () => {
    window.location.href = "/istri/edukasi";
  };

  const getArrowIcon = (riskLevel: string) => {
    return riskLevel === "rendah" ? (
      <IoIosArrowDropdown className="w-12 h-12 font-semibold " />
    ) : (
      <IoIosArrowDropup className="w-12 h-12 font-semibold " />
    );
  };

  const SkeletonLoader = () => (
    <div className="mx-5 py-10 flex flex-col items-center gap-5 rounded-3xl bg-gray-200 shadow-lg my-5">
      <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
      <div className="h-6 w-40 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto p-5">
        <div className="flex flex-row">
          <p className="text-2xl font-bold text-gray-800">Kalkulator Anemia</p>
        </div>

        <hr className="my-5 h-0.5 border-t-0 bg-gray-300" />

        {hasil ? (
          <div className={`mx-5 py-10 flex flex-col items-center gap-5 rounded-3xl my-5 shadow-lg ${getBackgroundClass(hasil.resiko)}`}>
            <p className="text-base font-semibold ">Resiko Anemia</p>
            <div className="flex flex-row gap-2.5 items-center text-center">
              {getArrowIcon(hasil.resiko)} 
              <p className="text-4xl font-semibold ">{hasil.resiko}</p>
            </div>
          </div>
        ) : (
          <SkeletonLoader /> // Menggunakan tampilan skeleton loader saat tidak ada data
        )}

        <div className="flex justify-center my-5">
          <button
            type="button"
            className=" bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-500/35 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
            onClick={handleHitungUlang}
          >
            Lihat Rekomendasi
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hasil;
