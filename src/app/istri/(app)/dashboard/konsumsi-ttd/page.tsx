"use client";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useSession } from 'next-auth/react';
import axiosInstance from '@/libs/axios';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'sonner'; // Import toast from Sonner

export default function KonsumsiTtdPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [vitCChecked, setVitCChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); 

  const { data: session } = useSession(); 

  const handleSave = async () => {
    if (!session || !session.accessToken) {
      setErrorMessage('User is not authenticated.');
      return;
    }

    setIsSaving(true); 

    try {
      const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

      if (!formattedDate) {
        setErrorMessage('Tanggal tidak boleh kosong.');
        setIsSaving(false); 
        return;
      }

      await axiosInstance.post(
        '/istri/dashboard/konsumsi-ttd',
        {
          tanggal_waktu: formattedDate,
          minum_vit_c: vitCChecked ? 1 : 0,
        },
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      setSuccessMessage('Data berhasil disimpan!');
      setErrorMessage(null);
      
      // Display toast notification
      toast.success('TTD Berhasil Ditambahkan!',{
        position: "top-center",
      }
      ); // Show success toast

    } catch (error: any) {
      const errorCode = error.response?.status || 'No code';
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
      const errorDetails = error.response?.data || error.message;

      console.error(`Error Code: ${errorCode}`);
      console.error(`Error Message: ${errorMessage}`);
      console.error("Error Details:", errorDetails);

      setErrorMessage(errorMessage);
      setSuccessMessage(null);
    } finally {
      setIsSaving(false); 
    }
  };

  const handleClear = () => {
    setSelectedDate(null); 
  };

  return (
    <main>
        <Toaster richColors position="top-center" />
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Konsumsi TTD</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-72">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-5">
          <p className="text-xl">Minum TTD</p>
          <div className="relative w-full">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Pilih tanggal"
              className="form-input w-full border-gray-300 rounded-md shadow-sm"
              renderCustomHeader={({ date, changeYear, changeMonth }) => (
                <div className="flex justify-between p-2">
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Hari ini
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-red-600 hover:text-red-800"
                  >
                    Bersihkan
                  </button>
                </div>
              )}
            />
          </div>
          <div className="w-full flex flex-row gap-2.5 justify-around items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="text-xl">Minum Vit C</p>
            </div>
            <input
              id="vit-c-checkbox"
              type="checkbox"
              checked={vitCChecked}
              onChange={() => setVitCChecked(!vitCChecked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <hr className="w-full h-0.5 border-t-0 bg-gray-300" />
          <div className="flex flex-row self-end">
            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2"
            >
              Riwayat
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`text-white ${isSaving ? 'bg-gray-400' : 'bg-green-pastel'} ${isSaving ? 'hover:bg-gray-400' : 'hover:bg-green-pastel/80'} focus:outline-none focus:ring-4 ${isSaving ? 'focus:ring-gray-400' : 'focus:ring-green-pastel/30'} font-medium rounded-full text-sm px-5 py-2.5 text-center me-2`}
              disabled={isSaving} 
            >
              {isSaving ? 'Saving...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Home
            </p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Edukasi
            </p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Konsultasi
            </p>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Users
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
