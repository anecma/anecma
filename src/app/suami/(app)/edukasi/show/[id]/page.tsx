"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import Image from "next/image";
import "ckeditor5/ckeditor5-content.css";
import BackButtonNavigation from "@/components/back-button-navigation/back-button-navigation";

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
  const [authToken, setAuthToken] = useState<string | null>(null); // State to store authToken
  const { id } = params; // Get ID from props

  // Get the token from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token); // Set token to state if available
    } else {
      setLoading(false); // If no token found, stop loading
    }
  }, []); // Only run once on mount

  useEffect(() => {
    const fetchData = async () => {
      if (authToken && id) {
        try {
          const response = await axiosInstance.get(
            `/suami/edukasi/show-edukasi/${id}`, // API call for fetching the single edukasi
            {
              headers: {
                Authorization: `Bearer ${authToken}`, // Use the authToken from state
              },
            }
          );
          setEdukasi(response.data.data); // Assuming the API response has data in the format `{ data: { ... } }`
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Set loading to false once fetching is done
        }
      } else {
        setLoading(false); // If no token or ID, just stop loading
      }
    };

    fetchData();
  }, [authToken, id]); // Include authToken and id in dependencies

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
      <div className="flex flex-row items-center mb-5">
        <BackButtonNavigation className="w-8 h-8" />
        <p className="text-2xl font-bold">Edukasi</p>
      </div>
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
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-2xl font-bold text-center">{edukasi.judul}</h1>
        </div>
        <div className="flex justify-center mt-4">
          <Image
            src={edukasi.thumbnail}
            alt={edukasi.judul}
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
        <article
          className="ck-content prose prose-base mt-4"
          dangerouslySetInnerHTML={{ __html: edukasi.konten }} // Render HTML content
        />
      </div>
    </main>
  );
}
