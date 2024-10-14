import React, { useState, useEffect } from "react";

interface PuskesmasData {
  id: number;
  nama_puskesmas: string;
}

interface EditPetugasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (petugas: Partial<any>) => void;
  petugasData: any;
  puskesmasList: PuskesmasData[];
}

const EditPetugasModal: React.FC<EditPetugasModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  petugasData,
  puskesmasList,
}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [previousPassword, setPreviousPassword] = useState<string>("");
  const [selectedPuskesmas, setSelectedPuskesmas] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (isOpen && petugasData) {
      setName(petugasData.name || "");
      setEmail(petugasData.email || "");
      setPassword(""); // Reset password field
      setPreviousPassword(petugasData.password || "");
      setSelectedPuskesmas(petugasData.puskesmas?.[0]?.id || null);
    }
  }, [isOpen, petugasData]);

  const handleUpdate = () => {
    const updatedPetugas: Partial<any> = {
      id: petugasData.id,
      name,
      email,
      puskesmas_id: selectedPuskesmas,
      password: password ? password : previousPassword || null, 
    };
  
    

    onUpdate(updatedPetugas);
    resetForm();
  };
  

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword(""); 
    setSelectedPuskesmas(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Petugas</h2>
        <form>
          <div className="relative my-2.5">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Nama
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Email
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Password  
            </label>
          </div>

          <div className="relative my-2.5">
            <select
              value={selectedPuskesmas || ""}
              onChange={(e) => setSelectedPuskesmas(Number(e.target.value))}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="" disabled>
                Pilih Puskesmas
              </option>
              {puskesmasList.map((puskesmas) => (
                <option key={puskesmas.id} value={puskesmas.id}>
                  {puskesmas.nama_puskesmas}
                </option>
              ))}
            </select>
            <label
              htmlFor="puskesmas"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Puskesmas
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition duration-200"
            >
              Update Petugas
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetugasModal;
