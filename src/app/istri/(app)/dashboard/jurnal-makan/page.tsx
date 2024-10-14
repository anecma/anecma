"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
 
// Opsi waktu makan
const mealOptions = [
  { name: "sarapan", label: "Sarapan", jam_makan: "sarapan" },
  { name: "makan_siang", label: "Makan Siang", jam_makan: "makan_siang" },
  { name: "makan_malam", label: "Makan Malam", jam_makan: "makan_malam" },
];
 
// Opsi porsi
const portionSizes = {
  default: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  karbohidrat: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  lauk_hewani: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
    { value: "2.5", label: "2.5 Porsi" },
    { value: "3", label: "3 Porsi" },
    { value: "3.5", label: "3.5 Porsi" },
    { value: "4", label: "4 Porsi" },
  ],
  lauk_nabati: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  sayur: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  buah: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
};
 
// Gambar kategori makanan
const mealCategories = {
  karbohidrat: [
    { src: "/images/nasi-1-piring.jpg", alt: "Nasi 1 Piring", title: "Nasi", description: "1 Piring Kecil" },
    { src: "/images/kentang-2-buah.jpg", alt: "Kentang 2 Buah", title: "Kentang", description: "2 Buah Ukuran Sedang" },
    { src: "/images/mie-2-buah.jpg", alt: "Mie 2 Buah", title: "Mie", description: "2 Buah Ukuran Sedang" },
    { src: "/images/ubi-1-biji-sedang.jpg", alt: "Ubi 1 Biji Sedang", title: "Ubi", description: "1 Biji Sedang" },
    { src: "/images/roti-3-lembar.jpg", alt: "Roti 3 Lembar", title: "Roti", description: "3 Lembar" },
    { src: "/images/singkong-1-setengah-buah.jpg", alt: "Singkong 1 Setengah Buah", title: "Singkong", description: "1.5 Buah" },
  ], 
  lauk_hewani: [
    { src: "/images/ikan-lele.jpg", alt: "Ikan-Lele", title: "Ikan Lele", description: "1/3 sedang ikan Lele " },
    { src: "/images/ikan-mujair.jpg", alt: "Ikan-Mujair", title: "Ikan Mujair", description: "1/3 ekor sedang ikan Mujair" },
    { src: "/images/ikan-bandeng.jpg", alt: "Ikan-Bandeng", title: "Ikan Bandeng", description: "1 potong badan Ikan Bandeng" },
    { src: "/images/ikan-gurame.jpg", alt: "Ikan-gurame", title: "Ikan gurame", description: "1 potong badan Ikan gurame" },
    { src: "/images/ikan-tengiri.jpg", alt: "Ikan-tengiri", title: "Ikan tengiri", description: "1 potong badan Ikan tengiri" },
    { src: "/images/ikan-patin.jpg", alt: "Ikan-patin", title: "Ikan patin", description: "1 potong badan Ikan patin" },
    { src: "/images/ikan-teri-padang.jpg", alt: "ikan-teri-padang", title: "Ikan Teri Padang", description: "3 sendok makan teri padang" },
    { src: "/images/ikan-teri-nasi.jpg", alt: "ikan-teri-nasi", title: "Ikan Teri Nasi", description: "1/3 gelas teri nasi" },
    { src: "/images/telur.jpg", alt: "telur", title: "Telur", description: "1 Butir Telur" },
    { src: "/images/telur-puyuh.jpg", alt: "telur-puyuh", title: "Telur Puyuh", description: "5 Butir elur puyuh" },
    { src: "/images/sayap-ayam.jpg", alt: "sayap-ayam", title: "Daging Ayam ", description: "1 Potong sedang" },
    { src: "/images/paha-ayam.jpg", alt: "paha-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/dada-ayam.jpg", alt: "dada-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/leher-ayam.jpg", alt: "leher-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/daging-potong-sedang.jpg", alt: "daging", title: "Daging ", description: "1 Potong Daging Sedang" },
    { src: "/images/jeroan-ati.jpg", alt: "Jeroan", title: "Jeroan Ati", description: "1 Buah Sedanh Ati" },
    { src: "/images/jeroan-rempelo.jpg", alt: "Jeroan", title: "Jeroan Rempela", description: "Jeroan Rempela" },
    { src: "/images/seafood-udang.jpg", alt: "Seafood", title: "Seafood Udang", description: "5 Ekor Sedang Udang" },
    { src: "/images/seafood-cumi.jpg", alt: "Seafood", title: "Seafood Cumo", description: "2 Ekor Cumi" },
    { src: "/images/nugget.jpg", alt: "Nugget", title: "Nugget", description: "Nugget 2 Potong" },
  ],
  lauk_nabati: [
    { src: "/images/tahu.jpg", alt: "Tahu", title: "Tahu", description: "2 Potong Sedang" },
    { src: "/images/tempe.jpg", alt: "Tempe", title: "Tempe", description: "2 Tempe Sedang" },
    { src: "/images/tempe-orek.jpg", alt: "Tempe Orek", title: "Tempe Orek", description: "3 Sendok Makan Tempe Orek" },
    { src: "/images/kacang-ijo.jpg", alt: "Kacang Ijo", title: "Kacang Ijo", description: ": 2 ½ Sendok Makan, Kacang Ijo" },
    { src: "/images/kacang-merah.jpg", alt: "Kacang Merah", title: "Kacang Merah", description: "2 ½ Sendok Makan, Kacang Merah" },
    { src: "/images/kacang-tanah.jpg", alt: "Kacang Tanah", title: "Kacang Tanah", description: "2 Sendok Makan Kacang Tanah Rebus " },
  ],
  sayur: [
    { src: "/images/5-sendok-makan.jpg", alt: "Sayur", title: "Sayur", description: "5 Sendok Makan" },
    { src: "/images/1-mangkuk-kecil.jpg", alt: "Sayur", title: "Sayur", description: "1 Mangkuk Kecil" },
    { src: "/images/2-sendok-sayur.jpg", alt: "Sayur", title: "Sayur", description: "2 Sendok Sayur" },
  ],
  buah: [
    { src: "/images/semangka.jpg", alt: "Semangka", title: "Semangka", description: "2 Potong Sedang Semangka" },
    { src: "/images/pepaya.jpg", alt: "Pepaya", title: "Pepaya", description: "1 Potong Besar Pepaya" },
    { src: "/images/pisang.jpg", alt: "Pisang", title: "Pisang", description: "1 Buah Sedang Pisang" },
    { src: "/images/melon.jpg", alt: "Melon", title: "Melon", description: "1 Potong Buah Melon" },
    { src: "/images/mangga.jpg", alt: "Mangga", title: "Mangga", description: "¾ Buah Besar Mangga" },
    { src: "/images/apel.jpg", alt: "Apel", title: "Apel", description: "1 Buah Kecil Apel" },
  ],
};
 
// Konversi data porsi API ke dalam format yang sesuai dengan opsi porsi
const mapPortionValue = (value: number) => {
  if (value === 0.5) return "0.5";
  if (value === 1) return "1";
  if (value === 1.5) return "1.5";
  if (value === 2) return "2";
  if (value === 2.5) return "2.5";
  if (value === 3) return "3";
  if (value === 3.5) return "3.5";
  if (value === 4) return "4";
  return "";
};
 
const FoodLogForm = () => {
  const [selectedTab, setSelectedTab] = useState<string>("sarapan");
  const [jurnalMakanData, setJurnalMakanData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortions, setSelectedPortions] = useState<
    Record<string, string>
  >({});
  const { data: session, status } = useSession();
 
  useEffect(() => {
    async function fetchJurnalMakanData() {
      // Pastikan user sudah terotentikasi dan accessToken tersedia
      if (status !== "authenticated" || !session?.accessToken) {
        if (status === "unauthenticated") {
          setError("Anda perlu login terlebih dahulu.");
        }
        setLoading(false);
        return; // Hentikan eksekusi jika user tidak terotentikasi
      }
 
      try {
        setLoading(true); // Set loading state saat mulai fetch data
 
        const response = await axiosInstance.get(
          "/istri/dashboard/get-jurnal-makan",
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
 
        const fetchedData = response.data.data; // Mengambil data yang diperlukan
 
        // Cek jika data kosong
        if (!fetchedData || Object.keys(fetchedData).length === 0) {
          return;
        }
 
        // Set data ke state
        setJurnalMakanData(fetchedData);
 
        // Set initial selected portions based on fetched data
        if (mealCategories && typeof mealCategories === "object") {
          const initialPortions = Object.keys(mealCategories).reduce(
            (acc, category) => {
              const apiKey = `${selectedTab}_${category}`.replace(/-/g, "_");
 
              acc[category] = mapPortionValue(
                parseFloat(fetchedData[apiKey]) || 0
              );
              return acc;
            },
            {} as Record<string, string>
          );
 
 
          setSelectedPortions(initialPortions);
        } else {
          console.error("mealCategories tidak valid.");
        }
      } catch (error) {
        console.error("Error fetching Jurnal Makan data:", error);
        // setError("Terjadi kesalahan saat mengambil data jurnal makan.");
      } finally {
        setLoading(false);
      }
    }
 
    fetchJurnalMakanData();
  }, [session, status, selectedTab]);
 
 
  const getCheckedValue = (category: string) => {
 
    return selectedPortions[category] || "";
  };
 
  const handleRadioChange = (category: string, value: string) => {
    setSelectedPortions((prev) => ({
      ...prev,
      [category]: value, 
    }));
  };
 
  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const currentMealOption = mealOptions.find(
          (option) => option.name === selectedTab
        );
        const jamMakan = currentMealOption?.jam_makan;
 
        // Format data yang akan dikirim berdasarkan porsi yang dipilih oleh user
        const formattedData = Object.keys(selectedPortions).reduce(
          (acc, category) => {
            acc[`${jamMakan}_${category}`] = selectedPortions[category] || ""; 
            return acc;
          },
          {} as Record<string, string>
        ); // Ensure this is a Record<string, number>
 
        // Tambahkan jam_makan ke dalam data yang akan dikirim
        formattedData.jam_makan = jamMakan || ""; // If jam_makan should be a string
 
        // Tentukan endpoint berdasarkan tab yang aktif
        let endpoint = "";
        switch (selectedTab) {
          case "makan_malam":
            endpoint = "/istri/dashboard/insert-makan-malam";
            break;
          case "makan_siang":
            endpoint = "/istri/dashboard/insert-makan-siang";
            break;
          case "sarapan":
            endpoint = "/istri/dashboard/insert-sarapan";
            break;
          default:
            throw new Error("Tab tidak dikenali");
        }
 
        // Kirim data ke API
        await axiosInstance.post(endpoint, formattedData, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      alert("Anda harus masuk untuk menyimpan data.");
    }
  };
 
  const categories = Object.keys(mealCategories) as Array<
    keyof typeof mealCategories
  >;
 
  if (error) return <div>{error}</div>;
 
  return (
    <div className="">
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Jurnal Makan</p>
      </div>
 
      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
      <div className="tabs flex mx-5 justify-between">
        {mealOptions.map((tab) => (
          <button
            key={tab.name}
            className={`tab tab-lg tab-bordered tab-lifted w-full ${
              selectedTab === tab.name
                ? "text-blue-500 border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => setSelectedTab(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 mx-5">
        <div className="flex flex-col gap-5 pb-20">
          {categories.map((category) => (
            <div key={category} className="mb-5">
              <h2 className="text-center text-xl mb-2">
                Berapa porsi {category.replace(/([A-Z])/g, " $1").toLowerCase()}{" "}
                yang Anda konsumsi saat {selectedTab}?
              </h2>
              <div className="flex overflow-x-auto gap-5 py-2.5">
                {mealCategories[category].map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white w-40 p-5 rounded-2xl flex-shrink-0"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={100}
                      height={100}
                      className="w-32 h-32 rounded-3xl"
                    />
                    <p className="mt-2 text-center">{image.title}</p>
                    <p className="text-center text-sm text-gray-500">
                      {image.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="my-2.5">
                <form action="" className="flex flex-col gap-2.5">
                  {portionSizes[category]?.map((size, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <label
                        htmlFor={`porsi-${size.value}`}
                        className="w-full flex flex-row justify-between ms-2 text-xl font-medium text-black"
                      >
                        <p>
                          <span className="mr-2.5">
                            ({String.fromCharCode(65 + index)})
                          </span>{" "}
                          {size.label}
                        </p>
                        <input
                          type="radio"
                          id={`porsi-${size.value}`}
                          name={`${selectedTab}-radio-${category}`}
                          value={size.value}
                          className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={getCheckedValue(category) === size.value}
                          onChange={() =>
                            handleRadioChange(category, size.value)
                          }
                        />
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-5">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default FoodLogForm;