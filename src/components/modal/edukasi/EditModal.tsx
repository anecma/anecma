"use client";
import CustomCKEditor from "@/components/ckeditor/CostumCKEditor";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/libs/axios";

interface EditModalProps {
  onClose: () => void;
  onEdit: (data: {
    id: number;
    judul: string;
    konten: string;
    thumbnail: File | string | null;
    jenis: string;
    kategori: string;
    kategori_id: string;
  }) => void;
  item: {
    id: number;
    judul: string;
    konten: string;
    thumbnail: File | string | null;
    jenis: string;
    kategori: string;
    kategori_id: string;
  };
  defaultThumbnail: File | string | null;
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
  const [kategori_id, setKategoriId] = useState(item.kategori_id);
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch kategori data when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const authToken = localStorage.getItem("authTokenAdmin");
      if (!authToken) {
        Swal.fire("Error", "Token not found", "error");
        return;
      }

      try {
        const response = await axiosInstance.get(
          "/admin/data-kategori-edukasi/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const generatedOptions: { id: string; label: string }[] = [];

        response.data.data.forEach((category: any) => {
          generatedOptions.push({
            id: category.id,
            label: `Topik Utama - ${category.nama_kategori} - (${category.gender})`,
          });

          category.kategori_child.forEach((child: any) => {
            generatedOptions.push({
              id: child.id,
              label: `Sub Topik - ${child.nama_kategori} - (${child.gender})`,
            });
          });
        });

        setOptions(generatedOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire("Error", "Failed to fetch categories", "error");
      }
    };

    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use default thumbnail if no new thumbnail is selected
    const finalThumbnail = !thumbnail ? defaultThumbnail : thumbnail;

    if (!judul || !konten || !jenis || !kategori || !kategori_id) {
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
      kategori_id,
    };

    onEdit(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[75vw] max-h-[75vh] w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Edukasi</h2>
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
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
           >   Judul
            </label>
          </div>

          {/* CKEditor for Konten */}
          <div className="my-3">
            <CustomCKEditor
              data={konten}
              onChange={setKonten}
              setImages={() => {}}
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
            {!imagePreview && defaultThumbnail && (
              <div className="mt-2 h-32 w-32">
                <Image
                  src={
                    typeof defaultThumbnail === "string"
                      ? defaultThumbnail
                      : URL.createObjectURL(defaultThumbnail)
                  }
                  alt="Current Thumbnail"
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

          {/* Kategori Select */}
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
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
           >   Kategori
            </label>
          </div>

          {/* Kategori ID Select */}
          <div className="relative my-2.5">
            <select
              value={kategori_id}
              onChange={(e) => setKategoriId(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>Pilih Kategori ID</option>
              {options.map((option, index) => (
                <option key={`${option.id}-${index}`} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
           >   Kategori ID
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-12">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Perbarui Edukasi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg flex items-center hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Tutup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;