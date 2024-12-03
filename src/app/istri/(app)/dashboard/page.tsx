"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegBell, FaCircle } from "react-icons/fa6";
import { LuCalculator } from "react-icons/lu";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { TbDropletSearch } from "react-icons/tb";
import { BiSolidAlarmAdd } from "react-icons/bi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

interface UserData {
  name: string;
  usia: number;
  resiko_anemia: {
    hasil_hb: number;
    resiko: string;
  }[];
}

interface ApiResponse {
  data: {
    user: UserData;
    umur_kehamilan: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get<ApiResponse>(
            "/istri/get-user",
            {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          );
          setUserData(response.data.data.user);
          // console.log(response.data.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
      }
    }

    fetchUserData();
  }, [session, status]);

  // Ambil nilai HB dan risiko dari userData
  const hbValue = userData?.resiko_anemia[0]?.hasil_hb || null;
  const anemiaRisk = userData?.resiko_anemia[0]?.resiko || null;

  return (
    <main>
      {/* Header */}
      <div className="m-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-1">
            <p className="text-xl font-bold">Hi, Good morning</p>
            {userData && <p className="text-xl font-bold">{userData.name}!</p>}
          </div>
          <div>
            <FaRegBell className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Status */}
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
              src="/images/Anecma_0E.png"
              alt="Blood Pressure Image"
              width={90}
              height={90}
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="grid grid-cols-2 mx-5 mb-20 gap-5">
      <Link href="/istri/dashboard/riwayat">
        <div className="flex flex-col items-center max-w-sm min-h-28 p-4 bg-blue-sky border border-gray-200 rounded-lg shadow hover:bg-blue-sky/80 hover:shadow-lg transition duration-300 ease-in-out">
        <TbDropletSearch className="h-10 w-10 text-white mb-3 opacity-80" />
          <p className="text-white font-bold">Riwayat HB</p>
        </div>
      </Link>

      <Link href="/istri/dashboard/reminder-ttd">
        <div className="flex flex-col items-center max-w-sm min-h-28 p-4 bg-blue-white border border-blue-200 rounded-lg shadow hover:bg-blue-white/80 hover:shadow-lg transition duration-300 ease-in-out">
          <BiSolidAlarmAdd className="h-10 w-10 text-white mb-3 opacity-80" />
          <p className="text-white font-bold">Reminder TTD</p>
        </div>
      </Link>

      <Link href="/istri/dashboard/konsumsi-ttd">
        <div className="flex flex-col items-center max-w-sm min-h-28 p-4 bg-gray-white border border-gray-200 rounded-lg shadow hover:bg-gray-white/80 hover:shadow-lg transition duration-300 ease-in-out">
        <GiMedicines className="h-10 w-10 text-white mb-3 opacity-80" />
          <p className="text-white font-bold">Konsumsi TTD</p>
        </div>
      </Link>

      <Link href="/istri/dashboard/jurnal-makan">
        <div className="flex flex-col items-center max-w-sm min-h-28 p-4 bg-green-pastel border border-green-200 rounded-lg shadow hover:bg-green-pastel/80 hover:shadow-lg transition duration-300 ease-in-out">
        <MdOutlineRestaurantMenu className="h-10 w-10 text-white mb-3 opacity-80" />
          <p className="text-white font-bold">Jurnal Makan</p>
        </div>
      </Link>

      <Link href="/istri/dashboard/kalkulator-anemia">
        <div className="flex flex-col items-center max-w-sm min-h-28 p-4 bg-blue-light border border-gray-200 rounded-lg shadow hover:bg-blue-light/80 hover:shadow-lg transition duration-300 ease-in-out">
        <LuCalculator className="h-10 w-10 text-white mb-3 opacity-80" />
          <p className="text-white font-bold">Kalkulator Anemia</p>
        </div>
      </Link>
    </div>
    </main>
  );
}