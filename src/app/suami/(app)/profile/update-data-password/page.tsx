"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import axiosInstance from "@/libs/axios";
import { FaRegEdit } from "react-icons/fa";  // Import ikon untuk tombol edit

export default function ChangePasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);  // Untuk toggle edit/simpan
  const [saving, setSaving] = useState<boolean>(false);  // Untuk memantau proses penyimpanan

  // Menggunakan toast dari Sonner untuk menangani error dan success
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "password") {
      setPassword(value);
    } else if (id === "password_confirmation") {
      setPasswordConfirmation(value);
    }
  };

  // Toggle antara mode edit dan simpan
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Menangani penyimpanan perubahan password
  const handleSave = async () => {
    setSaving(true);

    // Validasi input
    if (password.length < 8) {
      toast.error("Password harus memiliki minimal 8 karakter.");
      setSaving(false);
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Password dan konfirmasi password tidak cocok.");
      setSaving(false);
      return;
    }

    const authToken = localStorage.getItem("authToken"); // Ambil token dari localStorage

    if (authToken) {
      try {
        // Kirim permintaan untuk memperbarui password ke endpoint yang sesuai
        await axiosInstance.post(
          "/suami/profil/update-data-password",
          { password, password_confirmation: passwordConfirmation },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success("Password berhasil diperbarui.");
        setPassword("");
        setPasswordConfirmation("");
        setIsEditing(false);  // Matikan mode edit setelah berhasil simpan
      } catch (err) {
        console.error("Error updating password:", err);
        toast.error("Gagal memperbarui password.");
      } finally {
        setSaving(false);
      }
    } else {
      toast.error("Anda harus login terlebih dahulu.");
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validasi input password
    if (password.length < 8) {
      toast.error("Password harus memiliki minimal 8 karakter.");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      try {
        await axiosInstance.post(
          "/suami/profil/update-data-password",
          { password, password_confirmation: passwordConfirmation },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success("Password berhasil diperbarui.");
        setPassword("");
        setPasswordConfirmation("");
      } catch (err) {
        console.error("Error updating password:", err);
        toast.error("Gagal memperbarui password.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Anda harus login terlebih dahulu.");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen mb-32">
      {/* ToastContainer untuk menampilkan toast notifications */}
      <Toaster richColors position="top-center" />

      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Ubah Password</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="relative my-2.5">
            <input
              type="password"
              id="password"
              value={password}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handlePasswordChange}
              disabled={!isEditing}  // Disable input jika tidak dalam mode edit
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Password Baru
            </label>
          </div>

          <div className="relative my-2.5">
            <input
              type="password"
              id="password_confirmation"
              value={passwordConfirmation}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={handlePasswordChange}
              disabled={!isEditing}  // Disable input jika tidak dalam mode edit
            />
            <label
              htmlFor="password_confirmation"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Konfirmasi Password Baru
            </label>
          </div>

          {/* Tombol Simpan hanya muncul saat dalam mode edit */}
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="max-w-fit self-center text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <span>Sedang Menyimpan...</span>
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
