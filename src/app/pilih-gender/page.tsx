"use client"; // Menandakan ini adalah komponen klien
import React from 'react';
import { FaMale, FaFemale } from 'react-icons/fa'; // Ikon untuk laki-laki dan perempuan

const GenderPicker = () => {
  
  const handleGenderSelect = (gender: string) => {
    if (gender === 'Suami') {
      window.location.href = '/suami/login'; // Arahkan ke halaman login suami
    } else {
      window.location.href = '/istri/login'; // Arahkan ke halaman login istri
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Pilih Gender</h2>

        <div className="flex flex-col gap-4">
          {/* Tombol untuk memilih Perempuan */}
          <button
            onClick={() => handleGenderSelect('Istri')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-pink-400 text-white transition-transform transform hover:bg-pink-600 hover:scale-105 hover:shadow-lg w-full"
          >
            <FaFemale size={24} /> {/* Ikon untuk Perempuan */}
            <span className="text-lg">Istri</span>
          </button>

          {/* Tombol untuk memilih Laki-laki */}
          <button
            onClick={() => handleGenderSelect('Suami')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-blue-400 text-white transition-transform transform hover:bg-blue-600 hover:scale-105 hover:shadow-lg w-full"
          >
            <FaMale size={24} /> {/* Ikon untuk Laki-laki */}
            <span className="text-lg">Suami</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderPicker;
