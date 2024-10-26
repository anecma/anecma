"use client";
import { FaCircle, FaUser, FaCalendar, FaRegBell } from "react-icons/fa";
import { MdOutlinePregnantWoman } from "react-icons/md";
import Image from "next/image";
import Layout from "../layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import axiosInstance from "@/libs/axios";

// Define types for suami and istri data
interface Suami {
  user: { name: string; usia: number };
  data_wife: {
    name: string;
    usia: number;
    resiko_anemia: { resiko: string; hasil_hb: number }[];
  };
  usia_kehamilan_istri: number;
}

interface Istri {
  name: string;
  age: number;
  pregnancyAge: number;
  anemiaStatus: string;
  hbLevel: number;
}

const DashboardSuami = () => {
  const [userDataSuami, setUserDataSuami] = useState<Suami | null>();
  const [userDataIstri, setUserDataIstri] = useState<Istri | null>(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && token) {
        try {
          // Fetch data for suami
          const suamiResponse = await axiosInstance.get("/suami/get-user", {
            headers: { Authorization: `Bearer ${token}` },
          });
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

  console.log(userDataSuami);

  const hbValue = userDataSuami?.data_wife.resiko_anemia[0]?.hasil_hb || null;
  const anemiaRisk = userDataSuami?.data_wife.resiko_anemia[0]?.resiko || null;

  return (
    <Layout>
      <main className="bg-gray-50 min-h-screen">
        {/* Header Suami */}
        <div className="m-5">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-bold">Hi, Good morning</p>
              <p className="text-xl font-bold">{userDataSuami?.user.name}</p>
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
                <p className="text-white">{userDataSuami?.data_wife.name}</p>
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <FaCalendar className="w-4 h-4 text-white" />
                <p className="text-white">
                  {userDataSuami?.data_wife.usia} tahun
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <MdOutlinePregnantWoman className="w-6 h-6 text-white" />
                <p className="text-white">
                  {userDataSuami?.usia_kehamilan_istri} minggu
                </p>
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
                {anemiaRisk && (
                  <>
                    <p
                      className={`text-${
                        anemiaRisk === "rendah" ? "green-500" : "red-500"
                      }`}
                    >
                      {anemiaRisk.charAt(0).toUpperCase() + anemiaRisk.slice(1)}
                    </p>
                    <FaCircle className="w-1 h-1" />
                    <p>
                      HB: {hbValue !== null ? hbValue : "Data tidak tersedia"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div>
              <Image
                src="/images/blood-pressure.png"
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
