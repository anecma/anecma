"use client";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers, LuAlarmCheck } from "react-icons/lu";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { toast, Toaster } from "sonner"

export default function ReminderTtdPage() {
  const { data: session, status } = useSession();
  const [morningReminderTime, setMorningReminderTime] = useState("08:00"); // Default time in H:i format
  const [eveningReminderTime, setEveningReminderTime] = useState("18:00"); // Default time in H:i format
  const [morningReminderActive, setMorningReminderActive] = useState(false);
  const [eveningReminderActive, setEveningReminderActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Function to fetch the current reminder settings
  const fetchReminderSettings = async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const response = await axiosInstance.get("/istri/dashboard/get-user-reminder-ttd", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = response.data.data; // Assuming this contains the reminder settings
        setMorningReminderTime(data.waktu_reminder_1);
        setEveningReminderTime(data.waktu_reminder_2);
        setMorningReminderActive(parseInt(data.is_active_reminder_1) === 1);
        setEveningReminderActive(parseInt(data.is_active_reminder_2) === 1)
      } catch (error) {
        setError("Gagal memuat pengaturan reminder.");
        console.error("Error fetching reminder settings:", error);
      }
    }
  };

  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      setIsSaving(true); // Start saving
      try {
        // Validate and format time
        const formatTime = (time: string): string => {
          const [hours, minutes] = time.split(':');
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        const dataToSend = {
          waktu_reminder_1: formatTime(morningReminderTime), // Ensures HH:mm format
          is_active_reminder_1: morningReminderActive,
          waktu_reminder_2: formatTime(eveningReminderTime), // Ensures HH:mm format
          is_active_reminder_2: eveningReminderActive,
        };

        const response = await axiosInstance.post(
          "/istri/dashboard/reminder-ttd",
          dataToSend,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );

        setSuccess("Data berhasil disimpan!");
        setError(null);

        // Show success toast notification
        toast.success("Reminder TTD berhasil di tambahkan!", {
          position: "top-center", // Set position to top center
        });

      } catch (error) {
        setError("Gagal menyimpan data.");
        setSuccess(null);
        console.error("Error saving data:", error);
        // Show error toast notification
        toast.error("Gagal menyimpan data.", {
          position: "top-center", // Set position to top center
        });
      } finally {
        setIsSaving(false); // End saving
      }
    } else {
      setError("Anda perlu login terlebih dahulu.");
      setSuccess(null);
      // Show error toast notification for not logged in
      toast.error("Anda perlu login terlebih dahulu.", {
        position: "top-center", // Set position to top center
      });
    }
  };

  // Fetch reminder settings when the component mounts
  useEffect(() => {
    fetchReminderSettings();
  }, [status]); // Re-fetch if authentication status changes

  return (
    <main>
      <Toaster richColors position="top-center" />
      {/* Header */}
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Reminder TTD</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-72">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-2.5">
          <LuAlarmCheck className="w-7 h-7 text-purple-700" />
          <p className="text-2xl font-semibold">Reminder TTD</p>
          <p className="text-gray-600">Pilih waktu reminder tablet TTD</p>

          {/* Reminder Checkboxes */}
          <div className="self-start mt-2.5">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={morningReminderActive}
                onChange={() => setMorningReminderActive(!morningReminderActive)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Pagi</span>
            </label>
          </div>
          <hr className="w-full h-0.5 border-t-0 bg-gray-300" />
          <div className="self-start mt-2.5">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={eveningReminderActive}
                onChange={() => setEveningReminderActive(!eveningReminderActive)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Malam</span>
            </label>
          </div>

          <hr className="w-full h-0.5 border-t-0 bg-gray-300 mt-5" />

          <div className="flex flex-row self-end mt-2.5">
            <button
              type="button"
              aria-label="View History"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2"
            >
              Riwayat
            </button>
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save Reminders"
              className={`text-white ${isSaving ? 'bg-gray-400' : 'bg-green-600'} hover:${isSaving ? 'bg-gray-500' : 'bg-green-700'} focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Simpan'}
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            aria-label="Home"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FaHome className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Beranda</span>
          </button>
          <button
            type="button"
            aria-label="Jobs"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiBook className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Pekerjaan</span>
          </button>
          <button
            type="button"
            aria-label="Messages"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <IoChatbubblesOutline className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Pesan</span>
          </button>
          <button
            type="button"
            aria-label="Users"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <LuUsers className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Pengguna</span>
          </button>
        </div>
      </div>
    </main>
  );
}
