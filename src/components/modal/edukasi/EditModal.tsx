"use client";
import CustomCKEditor from "@/components/ckeditor/CostumCKEditor";
import Image from "next/image";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface EditModalProps {
  onClose: () => void;
  onEdit: (data: {
    id: number; // Sertakan id dalam objek data
    judul: string;
    konten: string;
    thumbnail: File | string | null;
    jenis: string;
    kategori: string;
  }) => void;
  item: {
    id: number;
    judul: string;
    konten: string;
    thumbnail: File | string | null; // URL thumbnail saat ini
    jenis: string;
    kategori: string;
  };
  defaultThumbnail: File | string | null; // Properti baru untuk URL thumbnail default
}

const EditModal: React.FC<EditModalProps> = ({
  onClose,
  onEdit,
  item,
  defaultThumbnail,
}) => {
  const [judul, setJudul] = useState(item.judul);
  const [konten, setKonten] = useState(item.konten);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [jenis, setJenis] = useState(item.jenis);
  const [kategori, setKategori] = useState(item.kategori);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Buat URL pratinjau untuk gambar yang dipilih
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Reset pratinjau jika tidak ada file yang dipilih
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Gunakan thumbnail default jika tidak ada thumbnail baru yang dipilih
    const finalThumbnail = !thumbnail ? defaultThumbnail : thumbnail;

    if (!judul || !konten || !jenis || !kategori) {
      Swal.fire("Gagal!", "ISI SEMUA INPUTAN!!!", "error");
      return;
    }

    const data = {
      id: item.id,
      judul,
      konten,
      thumbnail: finalThumbnail,
      jenis,
      kategori,
    };

    onEdit(data); // Panggil onEdit dengan objek data
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[75vw] max-h-[75vh] w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Edukasi</h2>
        <form onSubmit={handleSubmit}>
          {/* Input Judul */}
          <div className="relative my-2.5">
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Judul
            </label>
          </div>

          {/* CKEditor untuk Konten */}
          <div className="my-3">
            <CustomCKEditor
              data={konten}
              onChange={setKonten}
              setImages={() => {}} // Tangani gambar sesuai kebutuhan
            />
          </div>

          {/* Input Thumbnail */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full border border-gray-300 rounded"
            />
            {imagePreview && (
              <div className="mt-2 h-32 w-32">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded"
                />
              </div>
            )}
          </div>

          {/* Pilih Jenis */}
          <div className="relative my-2.5">
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>
                Pilih Jenis
              </option>
              <option value="materi">Materi</option>
              <option value="video">Video</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Jenis
            </label>
          </div>

          {/* Pilih Kategori */}
          <div className="relative my-2.5">
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              <option value="pencegahan">Pencegahan</option>
              <option value="edukasi">Edukasi</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Kategori
            </label>
          </div>

          {/* Tombol */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
