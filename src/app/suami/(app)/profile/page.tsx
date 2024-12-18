"use client";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import Link from "next/link";
import axiosInstance from "@/libs/axios";
import { Toaster, toast } from "sonner";

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

export default function ProfilSuamiPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUserData() {
      const authToken = localStorage.getItem("authToken"); // Ambil token dari localStorage

      if (authToken) {
        try {
          const response = await axiosInstance.get<ApiResponse>("/suami/get-user", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUserData(response.data.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("You need to be logged in.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    setError(null);

    const authToken = localStorage.getItem("authToken"); // Ambil token dari localStorage

    try {
      const response = await axiosInstance.post(
        "/suami/profil/update-data-diri",
        userData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
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

  return (
    <main className="flex flex-col min-h-screen mb-32">
      <Toaster richColors position="top-center" />
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Halaman Profil Suami</p>
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
              htmlFor="name"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Nama
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="usia"
              value={userData?.usia ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="usia"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Usia
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="no_hp"
              value={userData?.no_hp ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="tempat_tinggal_domisili"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Tempat Tinggal Sesuai Domisili
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="pendidikan_terakhir"
              value={userData?.pendidikan_terakhir ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="pendidikan_terakhir"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Pendidikan Terakhir
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="text"
              id="pekerjaan"
              value={userData?.pekerjaan ?? ""}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <label
              htmlFor="pekerjaan"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Pekerjaan
            </label>
          </div>
          <Link
            href="/suami/profile/update-data-password"
            className="flex flex-row items-center justify-between bg-white-background p-5 rounded-2xl my-2.5"
          >
            <p>Ganti Kata Sandi</p>
            <MdKeyboardArrowRight className="w-7 h-7" />
          </Link>

          
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
                  <FaRegEdit /> Simpan
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
      </div>
    </main>
  );
}
