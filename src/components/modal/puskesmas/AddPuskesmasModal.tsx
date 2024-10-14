// AddPuskesmasModal.tsx
import React from 'react';

interface AddPuskesmasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void; // Ganti any dengan tipe data yang sesuai
}

const AddPuskesmasModal: React.FC<AddPuskesmasModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState({
    nama_puskesmas: '',
    alamat: '',
    status: 'Aktif',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose(); // Tutup modal setelah submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-md">
        <h2 className="text-xl font-bold mb-4">Tambah Puskesmas</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
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
          <div className="relative mb-4">
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
         
          <div className="relative mb-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
           
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
              Simpan
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 rounded px-4 py-2">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPuskesmasModal;
