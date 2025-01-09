"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import Link from "next/link";
import Image from "next/image";

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
  created_at: string;
  updated_at: string;
  edukasi: Edukasi[]; // List of edukasi directly under kategori
}

export default function SuamiEdukasiPage() {
  const [kategoriData, setKategoriData] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken"); // Get token from localStorage

      if (authToken) {
        try {
          const response = await axiosInstance.get(
            "/suami/edukasi/get-edukasi",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          console.log(response.data.data);
          if (Array.isArray(response.data.data)) {
            setKategoriData(response.data.data);
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("No auth token found");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="m-5 mb-20">
      <h1 className="text-2xl font-bold mb-5">Edukasi Suami</h1>
      <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="space-y-5">
        {loading ? (
          // Skeleton loader for categories
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col space-y-4 bg-white p-5 border border-gray-200 rounded-lg shadow animate-pulse"
            >
              <div className="flex items-center space-x-3">
                {/* Skeleton for category title */}
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>{" "}
                {/* Arrow */}
              </div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>{" "}
              {/* Skeleton for category description */}
              {/* Skeleton for edukasi items */}
              <div className="space-y-3 mt-4">
                {Array.from({ length: 2 }).map((_, subIndex) => (
                  <div key={subIndex} className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>{" "}
                    {/* Skeleton for edukasi title */}
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>{" "}
                    {/* Skeleton for edukasi content */}
                    {/* Skeleton for thumbnail */}
                    <div className="h-24 w-24 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : kategoriData.length > 0 ? (
          kategoriData.map((kategori) => (
            <div key={kategori.id}>
              <div className="accordion">
                <h2 id={`accordion-collapse-heading-${kategori.id}`}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    data-accordion-target={`#accordion-collapse-body-${kategori.id}`}
                    aria-expanded="false"
                    aria-controls={`accordion-collapse-body-${kategori.id}`}
                    onClick={() => {
                      const body = document.getElementById(
                        `accordion-collapse-body-${kategori.id}`
                      );
                      if (body) {
                        body.classList.toggle("hidden");
                        body.style.height = body.classList.contains("hidden")
                          ? "0"
                          : `${body.scrollHeight}px`;
                      }
                    }}
                  >
                    <span className="text-lg text-black font-semibold">
                      {kategori.nama_kategori}
                    </span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>

                <div
                  id={`accordion-collapse-body-${kategori.id}`}
                  className="overflow-hidden transition-all duration-300 ease-in-out hidden"
                  aria-labelledby={`accordion-collapse-heading-${kategori.id}`}
                  style={{ height: 0 }}
                >
                  <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {kategori.deskripsi}
                    </p>

                    {/* Loop through edukasi items under this category */}
                    <div className="space-y-3 mt-4">
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
                              <Link
                                href={`/suami/edukasi/show/${edukasi.id}`}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 mt-2"
                              >
                                Lihat Detail
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-700">
                          Tidak ada edukasi tersedia di kategori ini.
                        </div>
                      )}
                    </div>
                  </div>
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
    </main>
  );
}
