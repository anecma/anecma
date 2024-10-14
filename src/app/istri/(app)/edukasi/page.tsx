"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import useSession
import axiosInstance from "@/libs/axios"; // Ensure this is your configured axios instance

interface Edukasi {
  id: number;
  created_by: number;
  judul: string;
  konten: string;
  thumbnail: string;
  jenis: string;
  kategori: string;
  created_at: string;
  updated_at: string;
}

export default function EdukasiPage() {
  const [edukasiData, setEdukasiData] = useState<Edukasi[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

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
            setEdukasiData(response.data.data);
          } else {
            console.error("Unexpected response format:", response.data);
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

  return (
    <main className="m-5">
      <h1 className="text-2xl font-bold mb-5">Edukasi</h1>
      <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 space-y-5">
        {loading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-row mb-5 items-center bg-white border border-gray-200 rounded-lg shadow animate-pulse"
            >
              <div className="p-5 w-3/5">
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
                <div className="h-4 bg-blue-300 rounded w-1/4"></div>
              </div>
              <div className="p-5 w-2/5 flex flex-row items-center justify-center">
                <div className="w-24 h-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))
        ) : edukasiData.length > 0 ? (
          edukasiData.map((item) => {
            // Conditional class based on kategori
            const kategoriClass =
              item.kategori === "pencegahan" ? "bg-green-500" : "bg-red-500";

            return (
              <div
                key={item.id}
                className="flex flex-row mb-5 items-center bg-white border border-gray-200 rounded-lg shadow p-5"
              >
                <div className="flex-grow">
                  <p className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full mb-2 ${kategoriClass}`}>
                    {item.kategori}
                  </p>
                  <h5 className="text-ellipsis overflow-hidden mb-2 text-lg font-bold tracking-tight text-gray-900">
                    {item.judul}
                  </h5>
                  <p className="text-ellipsis overflow-hidden text-nowrap mb-3 font-normal text-gray-700">
                    {item.jenis}
                  </p>
                  <Link href={`/istri/edukasi/show/${item.id}`}>
                    <span className="inline-flex items-center px-8 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition duration-200">
                      Lihat
                    </span>
                  </Link>
                </div>

                <Link href={`/istri/edukasi/show/${item.id}`} className="flex-shrink-0 ml-5">
                  <Image
                    className="w-24 h-24 rounded-lg"
                    src={item.thumbnail}
                    alt={item.judul}
                    width={100}
                    height={100}
                    priority
                  />
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-700">Tidak ada data edukasi ditemukan.</div>
        )}
      </div>
    </main>
  );
}
