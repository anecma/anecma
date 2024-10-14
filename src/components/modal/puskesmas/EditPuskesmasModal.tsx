import React, { useState, useEffect } from 'react';

interface PuskesmasItem {
  id: number;
  nama_puskesmas: string;
  alamat: string;
  status: string;
}

interface EditPuskesmasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: PuskesmasItem) => void;
  puskesmasData: PuskesmasItem | null; // Data yang diedit
}

const EditPuskesmasModal: React.FC<EditPuskesmasModalProps> = ({ isOpen, onClose, onEdit, puskesmasData }) => {
  const [formData, setFormData] = useState<PuskesmasItem>({
    id: 0,
    nama_puskesmas: '',
    alamat: '',
    status: ''
  });

  useEffect(() => {
    if (puskesmasData) {
      setFormData(puskesmasData);
    }
  }, [puskesmasData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">Edit Puskesmas</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              id="nama_puskesmas"
              value={formData.nama_puskesmas}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => setFormData({ ...formData, nama_puskesmas: e.target.value })}
              required
            />
            <label
              htmlFor="nama_puskesmas"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
              Nama Puskesmas
            </label>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              id="alamat"
              value={formData.alamat}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              required
            />
            <label
              htmlFor="alamat"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
              Alamat
            </label>
          </div>

         
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPuskesmasModal;
