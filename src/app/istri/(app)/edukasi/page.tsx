"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// SkeletonLoader component for loading state
const SkeletonLoader = ({ height = "20px", width = "100%" }) => (
  <div className="skeleton-loader" style={{ height, width }} />
);

interface Edukasi {
  id: number;
  created_by: number;
  judul: string;
  konten: string;
  thumbnail: string;
  thumbnail_public_id: string;
  jenis: string;
  kategori: string;
  kategori_id: number;
  created_at: string;
  updated_at: string;
}

interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  parent_id: number | null;
  gender: string;
  created_at: string;
  updated_at: string;
  kategori_child: Kategori[];
  edukasi: Edukasi[] | null; // Ensure edukasi can be null or an array
}

interface UserData {
  user: {
    id: number;
    resiko_anemia: { id: number; user_id: number; resiko: string }[]; 
  };
}

export default function EdukasiPage() {
  const [kategoriData, setKategoriData] = useState<Kategori[]>([]);
  const [edukasiData, setEdukasiData] = useState<Edukasi[]>([]);
  const [userResiko, setUserResiko] = useState<string | null>(""); // User's resiko or null
  const [loading, setLoading] = useState(true);
  const [openedCategory, setOpenedCategory] = useState<number | null>(null);
  const [openedSubcategory, setOpenedSubcategory] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false); // To check if component is mounted
  const { data: session, status } = useSession();

  useEffect(() => {
    // Set isMounted to true after the component is mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get("/istri/get-user", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          if (response.data.success && response.data.data.user) {
            const resiko =
              response.data.data.user.resiko_anemia[0]?.resiko || null;
            setUserResiko(resiko);
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get(
            "/istri/edukasi/get-edukasi",
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          if (Array.isArray(response.data.data)) {
            setKategoriData(response.data.data);
            setEdukasiData(response.data.data);
          }
          console.log(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  useEffect(() => {
    // Get saved state from localStorage
    const savedCategory = JSON.parse(localStorage.getItem("openedCategory") || "null");
    const savedSubcategory = JSON.parse(localStorage.getItem("openedSubcategory") || "null");

    setOpenedCategory(savedCategory);
    setOpenedSubcategory(savedSubcategory);
  }, []);

  const toggleCategory = (id: number) => {
    const newCategoryId = openedCategory === id ? null : id;
    setOpenedCategory(newCategoryId);
    setOpenedSubcategory(null); // Reset subcategory when toggling main category

    // Save to localStorage
    localStorage.setItem("openedCategory", JSON.stringify(newCategoryId));
    localStorage.removeItem("openedSubcategory"); // Reset subcategory when main category is toggled
  };

  const toggleSubcategory = (id: number) => {
    const newSubcategoryId = openedSubcategory === id ? null : id;
    setOpenedSubcategory(newSubcategoryId);

    // Save to localStorage
    localStorage.setItem("openedSubcategory", JSON.stringify(newSubcategoryId));
  };

  // Prevent rendering until after the component is mounted
  if (!isMounted) {
    return null;
  }

  // Conditional rendering based on user's resiko
  const renderContent = () => {
    if (userResiko === "tinggi") {
      return (
        <div className="space-y-5">
          {loading ? (
            <>
              <SkeletonLoader height="50px" />
              <SkeletonLoader height="50px" />
              <SkeletonLoader height="50px" />
            </>
          ) : kategoriData.length > 0 ? (
            kategoriData.map((kategori) => (
              <div key={kategori.id} className="accordion">
                <h2>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    onClick={() => toggleCategory(kategori.id)}
                  >
                    <span className="text-lg text-black font-semibold">
                      {kategori.nama_kategori}
                    </span>
                    <FaChevronDown
                      className={`${
                        openedCategory === kategori.id ? "rotate-180" : ""
                      } w-3 h-3`}
                    />
                  </button>
                </h2>

                {openedCategory === kategori.id && (
                  <div className="space-y-4">
                    {kategori.kategori_child.length > 0 ? (
                      kategori.kategori_child.map((subkategori) => (
                        <div key={subkategori.id}>
                          <h3>
                            <button
                              type="button"
                              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                              onClick={() => toggleSubcategory(subkategori.id)}
                            >
                              <span className="text-lg text-black font-semibold">
                                {subkategori.nama_kategori}
                              </span>
                              <FaChevronRight
                                className={`${
                                  openedSubcategory === subkategori.id
                                    ? "rotate-90"
                                    : ""
                                } w-4 h-4`}
                              />
                            </button>
                          </h3>

                          {openedSubcategory === subkategori.id && (
                            <div className="space-y-3 p-5 border-t-0 border-l-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                              <p className="mb-2 text-gray-500 dark:text-gray-400">
                                {subkategori.deskripsi}
                              </p>
                              {subkategori.edukasi && Array.isArray(subkategori.edukasi) ? (
                                subkategori.edukasi.map((edukasi) => (
                                  <div
                                    key={edukasi.id}
                                    className="flex items-center bg-white p-4 border rounded-lg shadow-sm hover:shadow-md"
                                  >
                                    <Image
                                      src={edukasi.thumbnail}
                                      alt={edukasi.judul}
                                      width={100}
                                      height={100}
                                      className="rounded-lg"
                                    />
                                    <div className="ml-4 flex-1">
                                      <h4 className="font-semibold text-lg">
                                        {edukasi.judul}
                                      </h4>
                                      <Link
                                        href={`/istri/edukasi/show/${edukasi.id}`}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 mt-2"
                                      >
                                        Lihat Detail
                                      </Link>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500">
                                  Tidak ada edukasi untuk subtopik ini.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">
                        Tidak ada subtopik dalam kategori ini.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700">
              Tidak ada data edukasi ditemukan.
            </div>
          )}
        </div>
      );
    } else {
      // Case where resiko is null, render the education content as specified
      return (
        <div className="space-y-5">
          {loading ? (
            <>
              <SkeletonLoader height="50px" />
              <SkeletonLoader height="50px" />
              <SkeletonLoader height="50px" />
            </>
          ) : edukasiData.length > 0 ? (
            edukasiData.map((edukasi) => (
              <div key={edukasi.id} className="space-y-3">
                <div className="flex items-center bg-white p-4 border rounded-lg shadow-sm hover:shadow-md">
                  <Image
                    src={edukasi.thumbnail}
                    alt={edukasi.judul}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                <h3 className="text-xl font-semibold">{edukasi.judul}</h3>
                    <p className="text-gray-500">{edukasi.konten}</p>
                    <Link
                      href={`/istri/edukasi/show/${edukasi.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 mt-2"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))
            
          ) : (
            <div className="text-center text-gray-700">
              Tidak ada data edukasi ditemukan.
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <main className="m-5 mb-20">
      <h1 className="text-2xl font-bold mb-5">Edukasi</h1>
      <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />
      {renderContent()}
    </main>
  );
}
