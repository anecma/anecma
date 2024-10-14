"use client";
import CustomCKEditor from "@/components/ckeditor/CostumCKEditor";
import Image from "next/image";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface AddModalProps {
  onClose: () => void;
  onAdd: (data: {
    judul: string;
    konten: string;
    thumbnail: File;
    jenis: string;
    kategori: string;
  }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ onClose, onAdd }) => {
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [jenis, setJenis] = useState("");
  const [kategori, setKategori] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
    } else {
      setImagePreview(null); // Reset the preview if no file is selected
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul || !konten || !thumbnail || !jenis || !kategori) {
      Swal.fire("Gagal!", "ISI SEMUA INPUTAN!!!", "error");
      return;
    }

    const data = { judul, konten, thumbnail, jenis, kategori };
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[75vw] max-h-[75vh] w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Tambah Edukasi</h2>
        <form onSubmit={handleSubmit}>
          {/* Judul Input */}
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

          {/* CKEditor for Konten */}
          <div className="my-3">
            <CustomCKEditor
              data={konten}
              onChange={setKonten}
              setImages={setImages}
            />
          </div>

          {/* Thumbnail Input */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full border border-gray-300 rounded"
              required
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

          {/* Jenis Select */}
          <div className="relative my-2.5">
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>Pilih Jenis</option>
              <option value="materi">Materi</option>
              <option value="video">Video</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Jenis
            </label>
          </div>

          {/* Kategori Select */}
          <div className="relative my-2.5">
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              <option value="pencegahan">Pencegahan</option>
              <option value="edukasi">Edukasi</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Kategori
            </label>
          </div>

          {/* Buttons */}
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
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
