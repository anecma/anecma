"use client"; 
import React, { useEffect, useState } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa'; 
import Loading from '@/components/loading-page/loading-page'; 

const GenderPicker = () => {
  const [loading, setLoading] = useState(true);

  const handleGenderSelect = (gender: string) => {
    if (gender === 'Suami') {
      window.location.href = '/suami/login';
    } else {
      window.location.href = '/istri/login'; 
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 5000);

    return () => clearTimeout(timer); 
  }, []);

  if (loading) {
    return <Loading />; 
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Pilih Gender</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleGenderSelect('Istri')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-pink-400 text-white transition-transform transform hover:bg-pink-600 hover:scale-105 hover:shadow-lg w-full"
          >
            <FaFemale size={24} /> 
            <span className="text-lg">Istri</span>
          </button>
      
          <button
            onClick={() => handleGenderSelect('Suami')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-blue-400 text-white transition-transform transform hover:bg-blue-600 hover:scale-105 hover:shadow-lg w-full"
          >
            <FaMale size={24} /> =
            <span className="text-lg">Suami</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderPicker;
