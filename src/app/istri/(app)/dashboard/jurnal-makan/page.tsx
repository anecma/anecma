"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { Toaster, toast } from "sonner";
import ImageModal from "@/components/modal/imagemodal/ImageModal";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";
import TextModal from "@/components/modal/textmodal/textmodal";

// Opsi waktu makan
const mealOptions = [
  { name: "sarapan", label: "Sarapan", jam_makan: "sarapan" },
  { name: "makan_siang", label: "Makan Siang", jam_makan: "makan_siang" },
  { name: "makan_malam", label: "Makan Malam", jam_makan: "makan_malam" },
];

// Opsi porsi
const portionSizes = {
  default: [
    { value: "0", label: "tidak makan" },
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  karbohidrat: [
    { value: "0", label: "tidak makan" },
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  lauk_hewani: [
    { value: "0", label: "tidak makan" },
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
    { value: "0", label: "tidak makan" },
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  sayur: [
    { value: "0", label: "tidak makan" },
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  buah: [
    { value: "0", label: "tidak makan" },
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
};

// Gambar kategori makanan
const mealCategories = {
  karbohidrat: [
    {
      src: "/images/makanan-pokok/Makanan_Pokok_Nasi.png",
      alt: "Nasi 1 Piring",
      title: "Nasi",
      description: "1 Piring Kecil",
    },
    {
      src: "/images/makanan-pokok/Makanan_Pokok_Kentang_Rebus.png",
      alt: "Kentang 2 Buah",
      title: "Kentang Rebus",
      description: "2 1/2 Buah Ukuran Sedang",
    },
    {
      src: "/images/makanan-pokok/Makanan_Pokok_Mie.png",
      alt: "Mie 1 Piring",
      title: "Mie",
      description: "1 Piring Mie Ukuran Sedang",
    },
    {
      src: "/images/makanan-pokok/Makanan_Pokok_Ubi_Rebus.png",
      alt: "Ubi Jalar Rebus",
      title: "Ubi Jalar Rebus",
      description: "1 Buah Ukuran Sedang",
    },
    {
      src: "/images/makanan-pokok/Makanan_Pokok_Roti.png",
      alt: "Roti Gandum",
      title: "Roti Gandum",
      description: "3 Potong",
    },
  ],
  lauk_hewani: [
    {
      src: "/images/lauk-hewani/Lauk_Lele_Goreng.png",
      alt: "Ikan-Lele",
      title: "Ikan Lele",
      description: "1 sedang ikan Lele ",
    },
    {
      src: "/images/lauk-hewani/Lauk_Ikan_Bandeng_Goreng.png",
      alt: "Ikan-Bandeng",
      title: "Ikan Bandeng Goreng",
      description: "1 potong badan bagian badan",
    },
    {
      src: "/images/lauk-hewani/Lauk_Ikan_Patin_Goreng.png",
      alt: "Ikan-patin",
      title: "Ikan patin goreng",
      description: "1 potong bagian badan",
    },
    {
      src: "/images/lauk-hewani/Lauk_Teri_Padang.png",
      alt: "ikan-teri-padang",
      title: "Teri Padang",
      description: "3 sendok makan",
    },
    {
      src: "/images/lauk-hewani/Lauk_Teri_Nasi.png",
      alt: "ikan-teri-nasi",
      title: "Teri Nasi",
      description: "5 sendok makan",
    },
    {
      src: "/images/lauk-hewani/Lauk_Telur_Ayam_Goreng.png",
      alt: "telur",
      title: "Telur",
      description: "1 Butir Telur",
    },
    {
      src: "/images/lauk-hewani/Lauk_Telur_Puyuh.png",
      alt: "telur-puyuh",
      title: "Telur Puyuh",
      description: "5 Butir telur puyuh",
    },
    {
      src: "/images/lauk-hewani/Lauk_Ati_Ayam.png",
      alt: "Jeroan",
      title: "Rempela Ati",
      description: "1 buah sedang",
    },
    {
      src: "/images/lauk-hewani/Lauk_Udang.png",
      alt: "Seafood",
      title: "Seafood Udang",
      description: "5 Ekor Sedang Udang",
    },
    {
      src: "/images/lauk-hewani/Lauk_Nugget.png",
      alt: "Nugget",
      title: "Nugget",
      description: "Nugget 2 Potong",
    },
  ],
  lauk_nabati: [
    {
      src: "/images/lauk-nabati/Lauk_Tahu_Goreng.png",
      alt: "Tahu",
      title: "Tahu Goreng",
      description: "2 Potong Sedang",
    },
    {
      src: "/images/lauk-nabati/Lauk_Tempe_Goreng.png",
      alt: "Tempe",
      title: "Tempe Goreng",
      description: "2 Tempe Sedang",
    },
    {
      src: "/images/lauk-nabati/Lauk_Tempe_Orek.png",
      alt: "Tempe",
      title: "Tempe Orek",
      description: "3 Sendok Tempe Orek",
    },
    {
      src: "/images/lauk-nabati/Selingan_Kacang_Hijau.png",
      alt: "Kacang Ijo",
      title: "Bubur Kacang Ijo",
      description: "1 Porsi Sedang",
    },
    {
      src: "/images/lauk-nabati/Selingan_Kacang_Rebus.png",
      alt: "Kacang Tanah",
      title: "Kacang Tanah Rebus",
      description: "1 Porsi Sedang",
    },
  ],
  sayur: [
    {
      src: "/images/sayur/Sayur_Sawi.png",
      alt: "Sayur",
      title: "Tumis Sawi",
      description: "5 Sendok Makan",
    },
    {
      src: "/images/sayur/Sayur_Bayam.png",
      alt: "Sayur",
      title: "Sayur Bayam",
      description: "1 Mangkuk Kecil",
    },
    {
      src: "/images/sayur/Sayur_Sop.png",
      alt: "Sayur",
      title: "Sayur Sop",
      description: "2 Sendok Sayur",
    },
  ],
  buah: [
    {
      src: "/images/buah/Buah_Semangka.png",

      alt: "Semangka",
      title: "Semangka",
      description: "1 Potong Sedang",
    },
    {
      src: "/images/buah/Buah_Pepaya.png",
      alt: "Pepaya",
      title: "Pepaya",
      description: "1 Potong Besar",
    },
    {
      src: "/images/buah/Buah_Pisang.png",
      alt: "Pisang",
      title: "Pisang",
      description: "1 Buah Sedang",
    },
    {
      src: "/images/buah/Buah_Melon.png",
      alt: "Melon",
      title: "Melon",
      description: "1 Potong Sedang",
    },
    {
      src: "/images/buah/Buah_Mangga.png",
      alt: "Mangga",
      title: "Mangga",
      description: "1 Buah Besar Mangga",
    },
    {
      src: "/images/buah/Buah_Apel.png",
      alt: "Apel",
      title: "Apel",
      description: "1 Buah Sedang",
    },
  ],
};

const mapPortionValue = (value: number) => {
  if (value === 0) return "0";
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

  const [usiakehamilan, setUsiaKehamilan] = useState(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [savedImageSrc, setSavedImageSrc] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [textContent, setTextContent] = useState<string>("");
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

        const usiaKehamilan = fetchedData.usia_kehamilan;
        setUsiaKehamilan(usiaKehamilan);

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

        const formattedData = Object.keys(selectedPortions).reduce(
          (acc, category) => {
            acc[`${jamMakan}_${category}`] = selectedPortions[category] || "";
            return acc;
          },
          {} as Record<string, string>
        );

        formattedData.jam_makan = jamMakan || "";
        console.log("Formatted Data to Send:", formattedData);

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

        const response = await axiosInstance.post(endpoint, formattedData, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        // Customize the SweetAlert for "makan malam"
        if (selectedTab === "makan_malam") {
          // Array of predefined links
          const links = [
            "https://www.anecma.id/istri/edukasi/show/61",
            "https://www.anecma.id/istri/edukasi/show/62",
            "https://www.anecma.id/istri/edukasi/show/63",
            "https://www.anecma.id/istri/edukasi/show/64",
            "https://www.anecma.id/istri/edukasi/show/65",
            "https://www.anecma.id/istri/edukasi/show/66",
          ];

          // Select a random link from the array
          const randomLink = links[Math.floor(Math.random() * links.length)];

          Swal.fire({
            icon: "info",
            html: `
              ${
                response.data.data.pesan ||
                "Berhasil menyimpan data untuk makan malam."
              }
              <br><br> Rekomendasi Makanan Untuk Bunda:
              <a href="${randomLink}" target=>Klik Disini</a>
            `,
            showCloseButton: true,
            focusConfirm: false,
          });
        } else {
          toast.success("Berhasil Menyimpan.", { duration: 2000 });
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      alert("Anda harus masuk untuk menyimpan data.");
    }
  };

  const openModal = () => {
    const content = `
     <h3 class="text-xl text-center font-semibold mb-4 border-b-2 border-gray-200 pb-2">Petunjuk Pengisian Jurnal Makan</h3>
      <ol class="list-decimal pl-6">
        <li>Ibu harus mengisi untuk jurnal berdasarkan makanan yang dimakan pada sehari sebelumnya atau hari saat pengisian.</li>
        <li>Ibu harus mengisi jenis dan porsi yang dimakan dalam tiga kali waktu makan, yaitu sarapan, makan siang, dan makan malam untuk dapat mengetahui apakah ibu telah mengonsumsi sesuai pedoman gizi seimbang.</li>
        <li>Makanan yang dimaksud adalah yang dimakan dalam masing-masing waktu (sarapan/makan siang/makan malam), termasuk cemilan/snack atau selingan mendekati waktu makan tersebut.</li>
        <li>Ibu mengisi berapa porsi pada setiap jenis makanan.</li>
        <li>Acuan ukuran satu porsi tiap-tiap bahan makanan yaitu sesuai dengan contoh dalam foto.</li>
        <li>Contoh pengisian pada bagian karbohidrat:
          <ul class="list-inside list-disc pl-6">
            <li>Silahkan pilih 0,5 porsi jika ibu mengonsumsi setengah dari 100gr nasi atau 50gr Nasi/Kentang/Mie/Ubi/Roti seperti yang ada pada gambar.</li>
            <li>Silahkan pilih 1.5 porsi jika ibu mengonsumsi 150 gr nasi atau 4,5 lembar roti.</li>
          </ul>
        </li>
        <li>Jangan lupa untuk klik simpan jika ibu sudah mengisi semua jenis bahan makanan pada setiap waktu makan.</li>
        <li>Hasil konsumsi akan muncul jika ibu sudah mengisi lengkap 3 waktu makan.</li>
      </ol>
    `;

    setTextContent(content); // Setting the modal content dynamically
    setIsGuideModalOpen(true); // Opening the modal
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  const closeGuideModal = () => {
    setIsGuideModalOpen(false);
    setTextContent(""); // Clear content when closing the modal
  };

  const categories = Object.keys(mealCategories) as Array<
    keyof typeof mealCategories
  >;

  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <Toaster richColors position="top-center" />
      <div className="m-5 flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <BackButtonNavigation className="w-10 h-10" />
          <p className="text-2xl font-bold">Jurnal Makan</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition shadow-md"
        >
          <AiOutlineInfoCircle className="mr-1 w-4 h-4" />
          Petunjuk
        </button>

        <TextModal
          isOpen={isGuideModalOpen}
          onClose={closeGuideModal}
          textContent={textContent} // Pass the dynamic content here
        />
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
                Berapa porsi{" "}
                {category
                  .replace(/_/g, " ")
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}{" "}
                yang Anda konsumsi saat ini?
              </h2>
              <div className="flex overflow-x-auto gap-5 py-2.5">
                {mealCategories[category].map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white w-40 p-5 rounded-2xl flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      setImageSrc(image.src); // Set the image source to the clicked image
                      setIsGuideModalOpen(true); // Open the modal
                    }}
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
                          value={size.value ?? ""} // Jika size.value bisa null, pastikan tidak null
                          className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={
                            getCheckedValue(category) === size.value || false
                          } // Pastikan checked adalah boolean
                          onChange={() =>
                            handleRadioChange(category, size.value ?? "")
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
