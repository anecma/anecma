"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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

interface EdukasiShowPageProps {
  params: { id: string }; // Props for the page
}

export default function EdukasiShowPage({ params }: EdukasiShowPageProps) {
  const [edukasi, setEdukasi] = useState<Edukasi | null>(null); // State for single item
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession(); // Get session data
  const { id } = params; // Get ID from props

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.accessToken && id) {
        try {
          const response = await axiosInstance.get(
            `/istri/edukasi/show-edukasi/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`, // Set token in headers
              },
            }
          );
          setEdukasi(response.data.data); // Assuming API returns the item
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Set loading to false once fetching is done
        }
      } else {
        setLoading(false); // If not authenticated or no ID, just stop loading
      }
    };

    fetchData();
  }, [session, status, id]); // Include id in dependencies

  if (loading) {
    return (
      <div className="m-5">
        <p className="text-2xl font-bold">Edukasi</p>
        <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />
        <div className="mb-5 p-4 bg-white border border-gray-200 rounded-2xl shadow animate-pulse">
          <div className="flex justify-between">
            <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-300 rounded-lg mt-4"></div>
            <div className="mt-4 h-6 w-2/3 bg-gray-300 rounded"></div>
          </div>
          <div className="mt-4 h-24 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    ); // Show skeleton loader
  }

  if (!edukasi) {
    return <div>Tidak ada data edukasi ditemukan.</div>; // Show message if no data
  }

  return (
    <main className="m-5 mb-20">
      <p className="text-2xl font-bold">Edukasi</p>
      <hr className="mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mb-5 items-center p-4 bg-white border border-gray-200 rounded-2xl shadow">
        <div className="flex justify-between text-xl font-bold">
          <p className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
            {edukasi.jenis}
          </p>
          <p className="inline-block px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
            {edukasi.kategori}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center">{edukasi.judul}</h1>
          <Image
            className="w-48 h-48 rounded-lg mt-4" 
            src={edukasi.thumbnail} 
            alt={edukasi.judul} 
            width={192} 
            height={192} 
            priority
          />
        </div>
        <div>
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: edukasi.konten }} />
        </div>
      </div>
    </main>
  );
}
