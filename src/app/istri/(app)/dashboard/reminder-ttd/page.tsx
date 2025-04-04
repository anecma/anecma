"use client";
import { useState, useEffect, useCallback } from "react";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers, LuAlarmCheck } from "react-icons/lu";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { toast, Toaster } from "sonner";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";
import { FaClock } from "react-icons/fa6";
import axios from "axios";

export default function ReminderTtdPage() {
  const { data: session, status } = useSession();
  const [morningReminderTime, setMorningReminderTime] = useState("08:00");
  const [eveningReminderTime, setEveningReminderTime] = useState("18:00");
  const [tabletCount, setTabletCount] = useState("");
  const [isTurningOff, setIsTurningOff] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [morningReminderActive, setMorningReminderActive] = useState(false);
  const [eveningReminderActive, setEveningReminderActive] = useState(false);

  const handleTabletCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = e.target.value;
    setTabletCount(count);

    if (count === "2") {
      setMorningReminderActive(true);
      setEveningReminderActive(true);
    } else if (count === "1") {
      setMorningReminderActive(false);
      setEveningReminderActive(true);
    } else {
      setMorningReminderActive(false);
      setEveningReminderActive(false);
    }
  };

  const fetchReminderSettings = useCallback(async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const response = await axiosInstance.get(
          "/istri/dashboard/get-user-reminder-ttd",
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        const data = response.data.data;

        setMorningReminderTime(data.waktu_reminder_1 || "08:00");
        setEveningReminderTime(data.waktu_reminder_2 || "18:00");

        setMorningReminderActive(parseInt(data.is_active_reminder_1) === 1);
        setEveningReminderActive(parseInt(data.is_active_reminder_2) === 1);

        if (
          parseInt(data.is_active_reminder_1) === 1 &&
          parseInt(data.is_active_reminder_2) === 1
        ) {
          setTabletCount("2");
        } else if (parseInt(data.is_active_reminder_2) === 1) {
          setTabletCount("1");
        } else {
          setTabletCount("");
        }
      } catch (error) {
        setError("Gagal memuat pengaturan reminder.");
        console.error("Error fetching reminder settings:", error);
      }
    }
  }, [session, status]);

  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      setIsSaving(true);
      const toastId = "saving-reminder";

      try {
        toast.loading("Sedang menyimpan data...", {
          id: toastId,
          position: "top-center",
        });

        const formatTime = (time: string): string => {
          const [hours, minutes] = time.split(":");
          return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}`;
        };

        const dataToSend = {
          waktu_reminder_1: formatTime(morningReminderTime),
          is_active_reminder_1: morningReminderActive ? 1 : 0,
          waktu_reminder_2: formatTime(eveningReminderTime),
          is_active_reminder_2: eveningReminderActive ? 1 : 0,
        };

        await axiosInstance.post("/istri/dashboard/reminder-ttd", dataToSend, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        setSuccess("Data berhasil disimpan!");
        setError(null);

        toast.success("Reminder TTD berhasil ditambahkan!", {
          id: toastId,
          position: "top-center",
        });

        await fetchReminderSettings();
      } catch (error) {
        setError("Gagal menyimpan data.");
        setSuccess(null);
        console.error("Error saving data:", error);

        toast.error("Gagal menyimpan data.", {
          id: toastId,
          position: "top-center",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      setError("Anda perlu login terlebih dahulu.");
      setSuccess(null);
      toast.error("Anda perlu login terlebih dahulu.", {
        position: "top-center",
      });
    }
  };

  const handleTurnOffReminder = async () => {
    if (status !== "authenticated" || !session?.accessToken) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    try {
      setIsTurningOff(true);
      toast.loading("Sedang mematikan reminder...", {
        id: "turn-off-reminder",
      });

      await axiosInstance.post("/istri/dashboard/turn-off-reminder-ttd", null, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      setMorningReminderActive(false);
      setEveningReminderActive(false);
      setTabletCount("");
      setMorningReminderTime("08:00");
      setEveningReminderTime("18:00");

      toast.success("Reminder berhasil dimatikan!", {
        id: "turn-off-reminder",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Gagal mematikan reminder: ${
            error.response?.data?.message || error.message
          }`,
          { id: "turn-off-reminder" }
        );
      } else {
        toast.error("Terjadi kesalahan tidak diketahui", {
          id: "turn-off-reminder",
        });
      }
    } finally {
      setIsTurningOff(false);
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
    fetchReminderSettings();
  }, [fetchReminderSettings]);

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <main>
      <Toaster richColors position="top-center" />
      {/* Header */}
      <div className="m-5 flex flex-row items-center">
        <BackButtonNavigation className="w-10 h-10" />
        <p className="text-2xl font-bold">Reminder TTD</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-72">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-2.5">
          <LuAlarmCheck className="w-7 h-7 text-purple-700" />
          <p className="text-2xl font-semibold">Reminder TTD</p>
          <p className="text-gray-600 text-center">
            Berapa kali rekomendasi TTD dari tenaga kesehatan?
          </p>
          <p className="text-gray-600">Pilih waktu reminder tablet TTD</p>

          <select
            id="tabletCount"
            value={tabletCount}
            onChange={handleTabletCountChange}
            className="mt-2 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled hidden>
              Pilih
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>

          <div className="self-start mt-2.5 flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer me-3">
                <input
                  type="checkbox"
                  checked={morningReminderActive}
                  onChange={(e) => setMorningReminderActive(e.target.checked)}
                  className="sr-only peer"
                  disabled={tabletCount === ""}
                />
                <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Pagi
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="time"
                  value={morningReminderTime}
                  onChange={(e) => setMorningReminderTime(e.target.value)}
                  className="border border-gray-300 rounded-lg pr-2 py-1"
                  disabled={!morningReminderActive || tabletCount === ""}
                />
                <FaClock className="absolute right-2 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer me-3">
                <input
                  type="checkbox"
                  checked={eveningReminderActive}
                  onChange={(e) => setEveningReminderActive(e.target.checked)}
                  className="sr-only peer"
                  disabled={tabletCount === ""}
                />
                <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Malam
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="time"
                  value={eveningReminderTime}
                  onChange={(e) => setEveningReminderTime(e.target.value)}
                  className="border border-gray-300 rounded-lg pr-2 py-1"
                  disabled={!eveningReminderActive || tabletCount === ""}
                />
                <FaClock className="absolute right-2 text-gray-500" />
              </div>
            </div>
          </div>

          <hr className="w-full h-0.5 border-t-0 bg-gray-300 mt-5" />

          <div className="flex flex-row self-end mt-2.5">
            <button
              type="button"
              onClick={handleShowConfirmation}
              aria-label="Turn Off Reminders"
              className={`text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 ${
                isTurningOff ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={
                isTurningOff ||
                (!morningReminderActive && !eveningReminderActive)
              }
            >
              {isTurningOff ? "Memproses..." : "Matikan Reminder"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save Reminders"
              className={`text-white ${
                isSaving ? "bg-gray-400" : "bg-green-600"
              } hover:${
                isSaving ? "bg-gray-500" : "bg-green-700"
              } focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2`}
              disabled={isSaving || tabletCount === ""}
            >
              {isSaving ? "Saving..." : "Simpan"}
            </button>
          </div>
        </div>
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl text-center font-semibold mb-10">
                Apakah Anda yakin ingin mematikan reminder TTD?
              </h3>
              <div className="flex justify-center space-x-4 mt-10">
                <button
                  onClick={handleTurnOffReminder}
                  disabled={isTurningOff}
                  className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50`}
                >
                  Ya, matikan
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isTurningOff}
                  className={`px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50`}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Beranda
            </span>
          </button>
          <button
            type="button"
            aria-label="Jobs"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiBook className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pekerjaan
            </span>
          </button>
          <button
            type="button"
            aria-label="Messages"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <IoChatbubblesOutline className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pesan
            </span>
          </button>
          <button
            type="button"
            aria-label="Users"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <LuUsers className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pengguna
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
