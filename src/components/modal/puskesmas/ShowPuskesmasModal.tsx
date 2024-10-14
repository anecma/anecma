import React from 'react';
import { FaTimes, FaHospital, FaMapMarkedAlt, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ShowPuskesmasModalProps {
  isOpen: boolean;
  onClose: () => void;
  puskesmasData: {
    id: number;
    nama_puskesmas: string;
    alamat: string;
    status: string;
  } | null;
}

const ShowPuskesmasModal: React.FC<ShowPuskesmasModalProps> = ({ isOpen, onClose, puskesmasData }) => {
  if (!isOpen || !puskesmasData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detail Puskesmas</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-red-500" size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <FaHospital className="mr-3 text-purple-500" />
            <span>
              <strong>Nama Puskesmas:</strong> {puskesmasData.nama_puskesmas}
            </span>
          </div>
          <div className="flex items-center">
            <FaMapMarkedAlt className="mr-3 text-purple-500" />
            <span>
              <strong>Alamat:</strong> {puskesmasData.alamat}
            </span>
          </div>
          
          <div className="flex items-center">
            {puskesmasData.status === "Aktif" ? (
              <FaCheckCircle className="mr-3 text-green-500" />
            ) : (
              <FaTimesCircle className="mr-3 text-red-500" />
            )}
            <span>
              <strong>Status:</strong> <span className={puskesmasData.status === "Aktif" ? "text-green-500" : "text-red-500"}>{puskesmasData.status}</span>
            </span>
          </div>
        </div>
        <button
          className="mt-6 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ShowPuskesmasModal;
