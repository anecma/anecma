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
  edukasi: Edukasi[];
}

interface UserData {
  user: {
    id: number;
    resiko_anemia: {
      id: number;
      user_id: number;
      resiko: string;
    }[];
  };
}

export default function EdukasiPage() {
  const [kategoriData, setKategoriData] = useState<Kategori[]>([]);
  const [userResiko, setUserResiko] = useState<string>(""); // To store the user's resiko value
  const [loading, setLoading] = useState(true);
  const [openedCategory, setOpenedCategory] = useState<number | null>(null);
  const [openedSubcategory, setOpenedSubcategory] = useState<number | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false); // Add a flag to check if the component is mounted
  const [showModal, setShowModal] = useState(false); // Modal state to show confirmation dialog
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
              response.data.data.user.resiko_anemia[0]?.resiko || "";
            setUserResiko(resiko);

            // Check if resiko_anemia is empty or null
            if (!resiko) {
              setShowModal(true); // Show modal if resiko is empty or null
            }
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
          }
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

  const toggleCategory = (id: number) => {
    setOpenedCategory(openedCategory === id ? null : id);
    setOpenedSubcategory(null); // Reset subcategory when toggling main category
  };

  const toggleSubcategory = (id: number) => {
    setOpenedSubcategory(openedSubcategory === id ? null : id);
  };

  // Prevent rendering until after the component is mounted
  if (!isMounted) {
    return null;
  }

  const handleModalClose = () => {
    setShowModal(false);
  };

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
                              {subkategori.edukasi.length > 0 ? (
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
                                      <p className="text-sm text-gray-600">
                                        {edukasi.konten}
                                      </p>
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
    } else if (userResiko === "rendah") {
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
                  <div className="space-y-3 p-5 border-t-0 border-l-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {kategori.deskripsi}
                    </p>
                    {kategori.edukasi.length > 0 ? (
                      kategori.edukasi.map((edukasi) => (
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
                            <p className="text-sm text-gray-600">
                              {edukasi.konten}
                            </p>
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
                        Tidak ada edukasi untuk kategori ini.
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
    }
  };

  return (
    <main className="m-5 mb-20">
      <h1 className="text-2xl font-bold mb-5">Edukasi</h1>
      <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />

      {renderContent()}

      {/* Modal for empty or null resiko */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 ">
              Peringatan!!!
            </h2>
            <hr className=" h-0.5 border-t-0 bg-gray-300 mb-10" />
            <p className="text-sm text-gray-700 text-center mb-10">
              Silakan mengisi kalkulator anemia untuk dapat mengakses materi
              edukasi yang tersedia.
            </p>
            <div className="flex justify-around gap-4">
              <Link href="/istri/dashboard/kalkulator-anemia">
                <span
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleModalClose} // Close modal when navigating
                >
                  Ke Kalkulator
                </span>
              </Link>
              <Link href="/istri/dashboard">
                <span
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-center w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleModalClose} // Close modal when navigating
                >
                  Kembali ke Dashboard
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
