import React from "react";
import { FaUser, FaEnvelope, FaUserTag, FaHospital } from "react-icons/fa";

interface PuskesmasData {
  id: number;
  nama_puskesmas: string;
  alamat: string;
}

interface PetugasData {
  id: number;
  name: string;
  email: string;
  role: string;
  puskesmas: PuskesmasData[];
}

interface ShowPetugasModalProps {
  isOpen: boolean;
  onClose: () => void;
  petugasData: PetugasData | null;
}

const ShowPetugasModal: React.FC<ShowPetugasModalProps> = ({
  isOpen,
  onClose,
  petugasData,
}) => {
  if (!isOpen || !petugasData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Detail Petugas</h2>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FaUser className="mr-2 text-gray-600" />
            <span className="font-semibold">Nama:</span> {petugasData.name}
          </div>
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2 text-gray-600" />
            <span className="font-semibold">Email:</span> {petugasData.email}
          </div>
          <div className="flex items-center mb-2">
            <FaUserTag className="mr-2 text-gray-600" />
            <span className="font-semibold">Role:</span> {petugasData.role}
          </div>
        </div>

        <div>
          <strong className="font-semibold">Puskesmas:</strong>
          <div className="mt-2">
            {petugasData.puskesmas.length > 0 ? (
              petugasData.puskesmas.map((p) => (
                <div key={p.id} className="flex items-center mb-1">
                  <FaHospital className="mr-2 text-gray-600" />
                  <span>{p.nama_puskesmas}</span>
                </div>
              ))
            ) : (
              <div>Tidak ada puskesmas</div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowPetugasModal;
