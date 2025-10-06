"use client";
import { FaCircle, FaUser, FaCalendar, FaRegBell } from "react-icons/fa";
import { MdOutlinePregnantWoman } from "react-icons/md";
import Image from "next/image";
import Layout from "../layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";

// Define types for the updated API response
interface ResikoAnemia {
  resiko: string;
  hasil_hb: number;
}

interface DataWife {
  name: string;
  usia: number;
  resiko_anemia: ResikoAnemia[];
  nama_suami: string;
  usia_kehamilan: number;
}

interface Suami {
  name: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    user: Suami;
    dataWife: DataWife;
    usia_kehamilan_istri: number;
  };
  message: string;
}

const DashboardSuami = () => {
  const [userDataSuami, setUserDataSuami] = useState<
    ApiResponse["data"] | null
  >(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    async function fetchUserData() {
      if (token) {
        try {
          // Fetch data for suami
          const suamiResponse = await axiosInstance.get<ApiResponse>(
            "/suami/get-user",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserDataSuami(suamiResponse.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, [status, token]);

  if (loading) {
    return (
      <Layout>
        <main className="bg-gray-50 min-h-screen">
          {/* Skeleton Header */}
          <div className="m-5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col space-y-1">
                <div className="h-6 bg-gray-200 w-36 rounded"></div>
                <div className="h-6 bg-gray-200 w-48 rounded"></div>
              </div>
              <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Skeleton Info Istri */}
          <div className="m-5 bg-gray-200 border border-gray-200 shadow-sm rounded-2xl animate-pulse">
            <div className="flex flex-row m-5 justify-between items-center">
              <div className="flex flex-col gap-3 items-start">
                <div className="h-4 bg-gray-300 w-24 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 w-24 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 w-24 rounded mb-2"></div>
              </div>
              <div className="w-30 h-30 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Skeleton Status Anemia */}
          <div className="m-5 bg-gray-200 border border-gray-200 shadow-sm rounded-2xl animate-pulse">
            <div className="flex flex-row m-5 justify-between items-center">
              <div className="flex flex-col space-y-2">
                <div className="h-6 bg-gray-300 w-32 rounded mb-2"></div>
                <div className="flex flex-row space-x-2 items-center">
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="w-24 h-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  // If data is not available, show an error message
  if (error || !userDataSuami) {
    return <div>Error: {error || "Data not available"}</div>;
  }

  const { user, dataWife, usia_kehamilan_istri } = userDataSuami;

  // Safely access resiko_anemia and its values
  const hbValue =
    dataWife.resiko_anemia?.[0]?.hasil_hb || "Data tidak tersedia";
  const anemiaRisk =
    dataWife.resiko_anemia?.[0]?.resiko || "Data tidak tersedia";

  return (
    <Layout>
      <main className="bg-gray-50 min-h-screen">
        {/* Header Suami */}
        <div className="m-5">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-bold">Hi, Good morning</p>
              <p className="text-xl font-bold">{user?.name}</p>
            </div>
            <div>
              <FaRegBell className="w-7 h-7 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Info Istri */}
        <div className="m-5 bg-green-pastel border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-row m-5 justify-between items-center">
            <div className="flex flex-col gap-3 items-start">
              <div className="flex flex-row space-x-4 items-center">
                <FaUser className="w-4 h-4 text-white" />
                <p className="text-white">{dataWife.name}</p>
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <FaCalendar className="w-4 h-4 text-white" />
                <p className="text-white">{dataWife.usia} tahun</p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <MdOutlinePregnantWoman className="w-6 h-6 text-white" />
                <p className="text-white">{usia_kehamilan_istri} minggu</p>
              </div>
            </div>
            <div>
              <Image
                src="/images/bidan.png"
                alt="Bidan Image"
                width={122}
                height={122}
              />
            </div>
          </div>
        </div>

        {/* Status Anemia */}
        <div className="m-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-row m-5 justify-between items-center">
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-bold">Status Anemia</p>
              <div className="flex flex-row space-x-2 items-center">
                <p
                  className={`text-${
                    anemiaRisk === "tinggi" ? "red-500" : "green-500"
                  }`}
                >
                  {anemiaRisk.charAt(0).toUpperCase() + anemiaRisk.slice(1)}
                </p>
                <FaCircle className="w-1 h-1" />
                <p>HB: {hbValue}</p>
              </div>
            </div>
            <div>
              <Image
                src="/images/Anecma_4C.png"
                alt="Blood Pressure Image"
                width={90}
                height={90}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DashboardSuami;
