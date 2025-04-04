"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { FaRegEdit } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";
import EditSaveButton from "@/components/edit-save-button.tsx/edit-save-button";

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
  Kratonan: ["Kratonan", "Danukusuman", "Joyotakan"],
  Gilingan: ["Gilingan", "Kestalan", "Punggawan"],
  "Bukit Kemuning": ["Sukamenanti"],
};

const desaData: { [key: string]: string[] } = {
  Sangkrah: [
    "Demangan",
    "Sangkrah",
    "Dadapsari",
    "Sampangan",
    "Dadapan",
    "Sawahan",
    "Ngepung",
    "Mbelingan",
  ],
  Kedunglumbu: [
    "Palugunan",
    "Yosodipuran",
    "Prawiropuran",
    "Nogobandan",
    "Kranggan",
    "Jiwoleksanan",
    "Tegalkonas",
    "Kedunglumbu",
    "Lojiwetan",
  ],
  Mojo: ["Kenteng", "Kenteng Baru", "Semanggi Kidul", "Silir"],
  Semanggi: [
    "Dalangan",
    "Dewutan",
    "Dukuh",
    "Losari",
    "Mipitan",
    "Sampangan",
    "Sanggungan",
    "Semanggi",
  ],
  Gilingan: [
    "Bibis Kulon",
    "Bibis Wetan",
    "Cinderejo",
    "Cinderejo Kidul",
    "Cinderejo Lor",
    "Gilingan",
    "Gumunggung",
    "Margorejo",
    "Ngemplak Rejosari",
    "Rejosari",
  ],
  Kestalan: ["Kandangdoro", "Kauman Pasar Legi", "Kesatalan", "Ngebrusan"],
  Punggawan: ["Punggawan", "Madyotaman", "Bromantakan", "Pethetan"],
  Joyotakan: [
    "Joyotakan",
    "Joyotakan Wetan",
    "Mijipinilihan",
    "Mijipinilihan Kidul",
  ],
  Danukusuman: [
    "Danukusuman",
    "Dawung Wetan",
    "Grobagan",
    "Jogoprajan",
    "Jogosuran",
    "Kajen",
    "Mijipinilihan Lor",
  ],
  Sukamenanti: ["Sukamenanti"],
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
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

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
    if (!editableData) return;
  
    // Validasi form
    const errors: Record<string, boolean> = {};
    const errorMessages: string[] = []; // Array untuk menyimpan pesan error
  
    if (!editableData.hari_pertama_haid) {
      errors.hari_pertama_haid = true;
      errorMessages.push("Hari Pertama Haid Terakhir");
    }
    if (!editableData.wilayah_binaan) {
      errors.wilayah_binaan = true;
      errorMessages.push("Wilayah Binaan");
    }
    if (!editableData.kelurahan) {
      errors.kelurahan = true;
      errorMessages.push("Kelurahan");
    }
    if (!editableData.tempat_periksa_kehamilan) {
      errors.tempat_periksa_kehamilan = true;
      errorMessages.push("Tempat Pemeriksaan Kehamilan");
    }
  
    setFormErrors(errors);
  
    // Jika ada error, tampilkan satu pesan error yang mencakup semua field
    if (errorMessages.length > 0) {
      toast.error(`Harap isi field berikut: ${errorMessages.join(", ")}`, {
        duration: 2000,
      });
      return;
    }
  
    setSaving(true);
    setError(null);
  
    try {
      // Tampilkan notifikasi loading
      toast.loading("Menyimpan data...");
  
      // Kirim data ke server
      const response = await axiosInstance.post(
        "/istri/profil/update-data-kehamilan",
        editableData,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
  
      // Jika berhasil, tampilkan notifikasi sukses
      toast.success("Berhasil Menyimpan.", { duration: 2000 });
  
      // Update state
      setUserData(editableData);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      // Jika gagal, tampilkan notifikasi error
      console.error("Error saving data:", error);
      setError("Failed to update user data.");
      toast.error("Gagal menyimpan data.", { duration: 2000 });
    } finally {
    
      toast.dismiss();
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value } = e.target;

    setEditableData((prev) => (prev ? { ...prev, [id]: value } : null));

    if (id === "wilayah_binaan") {
      setKelurahanOptions(kelurahanData[value] || []);
      setEditableData((prev) =>
        prev ? { ...prev, kelurahan: "", desa: "" } : null
      );
      setDesaOptions([]);
    }

    if (id === "kelurahan") {
      setDesaOptions(desaData[value] || []);
      setEditableData((prev) => (prev ? { ...prev, desa: "" } : null));
    }

    // Hapus error saat user mulai mengisi
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: false,
    }));
  };

  return (
    <main>
      <Toaster richColors position="top-center" />
      <div className="m-5 flex justify-between items-center">
        <div className="flex items-center">
          <BackButtonNavigation className="w-10 h-10" />
          <p className="text-2xl font-bold">Halaman Profil</p>
        </div>
        <div className="flex items-center">
          <EditSaveButton
            isEditing={isEditing}
            saving={saving}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
          />
        </div>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 mb-32">
        <p className="text-xl font-semibold">Data Kehamilan</p>

        <form className="flex flex-col gap-2.5">
          {/* Field Hari Pertama Haid */}
          <div className="relative my-2.5">
            <input
              type="date"
              id="hari_pertama_haid"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 ${
                formErrors.hari_pertama_haid ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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
              Hari Pertama Haid Terakhir
            </label>
          </div>

          {/* Field Wilayah Binaan */}
          <div className="relative my-2.5">
            <select
              id="wilayah_binaan"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 ${
                formErrors.wilayah_binaan ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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
              <option value="Bukit Kemuning">Bukit Kemuning</option>
            </select>
            <label
              htmlFor="wilayah_binaan"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Wilayah Binaan
            </label>
          </div>

          {/* Field Kelurahan */}
          <div className="relative my-2.5">
            <select
              id="kelurahan"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 ${
                formErrors.kelurahan ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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

          {/* Field Tempat Pemeriksaan Kehamilan */}
          <div className="relative my-2.5">
            <select
              id="tempat_periksa_kehamilan"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 ${
                formErrors.tempat_periksa_kehamilan ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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
              <option value="Bidan Praktik Mandiri">Bidan Praktik Mandiri</option>
              <option value="Klinik SPOG">Klinik SPOG</option>
            </select>
            <label
              htmlFor="tempat_periksa_kehamilan"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tempat Pemeriksaan Kehamilan
            </label>
          </div>
        </form>
      </div>
    </main>
  );
}