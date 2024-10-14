"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { FaRegEdit } from "react-icons/fa";
import { Toaster, toast } from "sonner";

interface UserData {
  hari_pertama_haid: string;
  wilayah_binaan: string;
  kelurahan: string;
  desa: string; 
  tempat_periksa_kehamilan: string;
}

interface ApiResponse {
  data: {
    user: UserData;
    umur_kehamilan: number;
  };
}

const kelurahanData: { [key: string]: string[] } = {
  Sangkrah: ["Sangkrah", "Kedunglumbu", "Mojo", "Semanggi"],
  Kratonan: ["Gilingan", "Kestalan", "Punggawan"],
  Gilingan: ["Joyotakan", "Danusuman", "Tipes", "Serengan"],
};

const desaData: { [key: string]: string[] } = {
  Sangkrah: ["Desa Sangkrah 1", "Desa Sangkrah 2"],
  Kedunglumbu: ["Desa Kedunglumbu 1", "Desa Kedunglumbu 2"],
  Mojo: ["Desa Mojo 1", "Desa Mojo 2"],
  Semanggi: ["Desa Semanggi 1", "Desa Semanggi 2"],
  Gilingan: ["Desa Gilingan 1", "Desa Gilingan 2"],
  Kestalan: ["Desa Kestalan 1", "Desa Kestalan 2"],
  Punggawan: ["Desa Punggawan 1", "Desa Punggawan 2"],
  Joyotakan: ["Desa Joyotakan 1", "Desa Joyotakan 2"],
  Danusuman: ["Desa Danusuman 1", "Desa Danusuman 2"],
  Tipes: ["Desa Tipes 1", "Desa Tipes 2"],
  Serengan: ["Desa Serengan 1", "Desa Serengan 2"],
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editableData, setEditableData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [kelurahanOptions, setKelurahanOptions] = useState<string[]>([]);
  const [desaOptions, setDesaOptions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get<ApiResponse>(
            "/istri/get-user",
            {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          );
          setUserData(response.data.data.user);
          setEditableData(response.data.data.user);
          setKelurahanOptions(
            kelurahanData[response.data.data.user.wilayah_binaan] || []
          );
          // Set desa options based on user's kelurahan
          setDesaOptions(desaData[response.data.data.user.kelurahan] || []);
        } catch (error) {
          setError("Failed to load user data.");
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
      }
    }

    fetchUserData();
  }, [session, status]);
  

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      setSaving(true);
      try {
        await axiosInstance.post(
          "/istri/profil/update-data-kehamilan",
          editableData,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        setUserData(editableData);
        setIsEditing(false);
        setError(null);
        toast.success("Berhasil Menyimpan.", { duration: 2000 });
      } catch (error) {
        setError("Failed to update user data.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value } = e.target;
  
    // Memperbarui data yang dapat diedit
    setEditableData((prev) => (prev ? { ...prev, [id]: value } : null));
  
    // Reset kelurahan dan desa jika wilayah_binaan berubah
    if (id === "wilayah_binaan") {
      setKelurahanOptions(kelurahanData[value] || []);
      setEditableData((prev) =>
        prev ? { ...prev, kelurahan: "", desa: "" } : null
      );
      setDesaOptions([]); // Reset opsi desa
    }
  
    // Set opsi desa berdasarkan kelurahan yang dipilih
    if (id === "kelurahan") {
      setDesaOptions(desaData[value] || []);
      setEditableData((prev) => (prev ? { ...prev, desa: "" } : null)); // Reset desa saat kelurahan berubah
    }
  
    // Logika untuk tempat pemeriksaan kehamilan
    if (id === "tempat_periksa_kehamilan") {
      if (value === "Puskesmas") {
        setEditableData((prev) => (prev ? { ...prev, someOtherField: "" } : null));
      } else if (value === "Puskesmas") {
        setEditableData((prev) => (prev ? { ...prev, someOtherField: "" } : null));
      } else if (value === "Bidan Praktik Mandiri") {
        setEditableData((prev) => (prev ? { ...prev, someOtherField: "" } : null));
      }else if (value === "Klinik SPOG") {
        setEditableData((prev) => (prev ? { ...prev, someOtherField: "" } : null));
      }
      //
      if (!value) {
        // Misalnya, jika tidak ada yang dipilih, kita bisa memberikan peringatan
        setError("Silakan pilih tempat pemeriksaan kehamilan.");
      }
    }
  };
  
  

  return (
    <main>
       <Toaster richColors position="top-center" />
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Halaman Profil</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 mb-32">
        <p className="text-xl font-semibold">Data Kehamilan</p>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form className="flex flex-col gap-2.5">
            <div className="relative my-2.5">
              <input
                type="date"
                id="hari_pertama_haid"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.hari_pertama_haid || ""
                    : userData?.hari_pertama_haid || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                onClick={(e) => {
                  e.currentTarget.showPicker();
                }}
              />
              <label
                htmlFor="hari_pertama_haid"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Hari Pertama Haid
              </label>
            </div>

            <div className="relative my-2.5">
              <select
                id="wilayah_binaan"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={
                  isEditing
                    ? editableData?.wilayah_binaan || ""
                    : userData?.wilayah_binaan || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Pilih Wilayah Binaan
                </option>
                <option value="Sangkrah">Sangkrah</option>
                <option value="Kratonan">Kratonan</option>
                <option value="Gilingan">Gilingan</option>
              </select>
              <label
                htmlFor="wilayah_binaan"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Wilayah Binaan
              </label>
            </div>

            <div className="relative my-2.5">
              <select
                id="kelurahan"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={
                  isEditing
                    ? editableData?.kelurahan || ""
                    : userData?.kelurahan || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Pilih Kelurahan
                </option>
                {kelurahanOptions.map((kelurahan) => (
                  <option key={kelurahan} value={kelurahan}>
                    {kelurahan}
                  </option>
                ))}
              </select>
              <label
                htmlFor="kelurahan"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Kelurahan
              </label>
            </div>

            <div className="relative my-2.5">
              <select
                id="desa"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={
                  isEditing ? editableData?.desa || "" : userData?.desa || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Pilih Desa
                </option>
                {desaOptions.map((desa) => (
                  <option key={desa} value={desa}>
                    {desa}
                  </option>
                ))}
              </select>
              <label
                htmlFor="desa"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Desa
              </label>
            </div>

            <div className="relative my-2.5">
              <select
                id="tempat_periksa_kehamilan"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={
                  isEditing
                    ? editableData?.tempat_periksa_kehamilan || ""
                    : userData?.tempat_periksa_kehamilan || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Tempat Pemeriksaan Kehamilan
                </option> 
                <option value="Puskesmas">Puskesmas</option>
                <option value="Bidan Praktik Mandir">Bidan Praktik Mandiri</option>
                <option value="Klinik SPOG">Klinik SPOG</option>
              </select>
              <label
                htmlFor="tempat_periksa_kehamilan"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Tempat Pemeriksaan Kehamilan
              </label>
            </div>

            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="max-w-fit self-center text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <FaRegEdit />
                    Simpan
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="max-w-fit self-center text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
              >
                <FaRegEdit />
                Edit
              </button>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
