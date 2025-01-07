"use client";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { Toaster, toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditSaveButton from "@/components/edit-save-button.tsx/edit-save-button";

interface UserData {
  name: string;
  usia?: string | null;
  no_hp?: string | null;
  tempat_tinggal_ktp?: string | null;
  tempat_tinggal_domisili?: string | null;
  pendidikan_terakhir?: string | null;
  pekerjaan?: string | null;
}
interface ApiResponse {
  data: {
    user: UserData;
  };
}

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    userData?.usia ? new Date(userData.usia) : null
  );

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
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, [session, status]);

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/istri/profil/update-data-diri",
        userData,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      toast.success("Berhasil Menyimpan.", { duration: 2000 });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setUserData((prevState) => ({
      ...prevState,
      usia: selectedDate, 
    }));
  };
  

  return (
    <main className="flex flex-col min-h-screen mb-32">
      <Toaster richColors position="top-center" />
      <div className="m-5 flex flex-row justify-between items-center">
        <p className="text-2xl font-bold">Halaman Profil</p>
        {/* Edit/Save Button */}
        <EditSaveButton
          isEditing={isEditing}
          saving={saving}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5">
        <form className="flex flex-col gap-2.5">
          <div className="relative my-2.5">
            <input
              type="text"
              id="name"
              value={userData?.name || ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="nama"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Nama
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="date"
              value={userData?.usia || ""}
              onChange={handleDateChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" Tanggal Lahir "
              onClick={(e) => {
                e.currentTarget.showPicker();
              }}
              disabled={!isEditing}
            />
            <label
              htmlFor="Tanggal Lahir"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tanggal Lahir
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="no_hp"
              value={userData?.no_hp ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="no_hp"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              No HP
            </label>
          </div>
          <div className="relative my-2.5">
            <input
              type="text"
              id="tempat_tinggal_ktp"
              value={userData?.tempat_tinggal_ktp ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="tempat_tinggal_ktp"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tempat Tinggal Sesuai KTP
            </label>
          </div>
          <div className="relative my-2.5">
            <input
              type="text"
              id="tempat_tinggal_domisili"
              value={userData?.tempat_tinggal_domisili ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="tempat_tinggal_domisili"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tempat Tinggal Domisili
            </label>
          </div>
          <div className="relative my-2.5">
            <select
              id="pendidikan_terakhir"
              value={userData?.pendidikan_terakhir ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="" disabled>
                Pilih Pendidikan Terakhir
              </option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
            <label
              htmlFor="pendidikan_terakhir"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Pendidikan Terakhir
            </label>
          </div>
          <div className="relative my-2.5">
            <select
              id="pekerjaan"
              value={userData?.pekerjaan ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="" disabled>
                Pilih Pekerjaan
              </option>
              <option value="Tidak Bekerja">Tidak Bekerja</option>
              <option value="Karyawan Swasta">Karyawan Swasta</option>
              <option value="Wirausaha">Wirausaha</option>
              <option value="PNS">PNS</option>
              <option value="TNI">TNI</option>
              <option value="POLRI">POLRI</option>
              <option value="Buruh">Buruh</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <label
              htmlFor="pekerjaan"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Pekerjaan
            </label>
          </div>

          <Link
            href="/istri/profil/data-kehamilan"
            className="flex flex-row items-center justify-between bg-white-background p-5 rounded-2xl my-2.5"
          >
            <p>Input Data Kehamilan</p>
            <MdKeyboardArrowRight className="w-7 h-7" />
          </Link>
          <Link
            href="/istri/profil/data-suami"
            className="flex flex-row items-center justify-between bg-white-background p-5 rounded-2xl my-2.5"
          >
            <p>Input Data Suami</p>
            <MdKeyboardArrowRight className="w-7 h-7" />
          </Link>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-sm grid-cols-3 mx-auto text-center">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <FaHome className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Beranda
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <FiBook className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Book
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <IoChatbubblesOutline className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Chat
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <LuUsers className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Profil
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
