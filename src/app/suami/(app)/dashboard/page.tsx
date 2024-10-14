"use client";
import { FaCircle, FaUser, FaCalendar, FaRegBell } from 'react-icons/fa';
import { MdPregnantWoman } from 'react-icons/md';
import Image from 'next/image';
import Layout from '../layout';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import axiosInstance from '@/libs/axios';

// Define types for suami and istri data
interface Suami {
  name: string;
  age: number;
}

interface Istri {
  name: string;
  age: number;
  pregnancyAge: number;
  anemiaStatus: string;
  hbLevel: number;
}

const DashboardSuami = () => {
  const [userDataSuami, setUserDataSuami] = useState<Suami | null>(null);
  const [userDataIstri, setUserDataIstri] = useState<Istri | null>(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

console.log(session)
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          // Fetch data for suami
          const suamiResponse = await axiosInstance.get("/suami/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUserDataSuami(suamiResponse.data.data);
          console.log("userDataSuami", userDataSuami);


          // Fetch data for istri
          const istriResponse = await axiosInstance.get("/istri/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUserDataIstri(istriResponse.data.data);
          console.log("userDataIstri", userDataIstri);

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
  }, [userDataIstri,userDataSuami,session, status]);

  return (
    <Layout>
      <main className="bg-gray-50 min-h-screen">
        {/* Header Suami */}
        <div className="m-5">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-bold">Hi, Good morning</p>
              <p className="text-xl font-bold">{userDataSuami?.name}!</p>
            </div>
            <div>
              <FaRegBell className="w-7 h-7 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Info Istri */}
        <div className="m-5 bg-green-pastel border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-row m-5 justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2 items-center">
                <FaUser className="w-4 h-4 text-white" />
                <p className="text-white">{userDataIstri?.name}</p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <FaCalendar className="w-4 h-4 text-white" />
                <p className="text-white">{userDataIstri?.age} tahun</p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <MdPregnantWoman className="w-6 h-6 text-white" />
                <p className="text-white">{userDataIstri?.pregnancyAge} minggu</p>
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
                <p className="text-green-pastel">{userDataIstri?.anemiaStatus}</p>
                <FaCircle className="w-2 h-2 text-gray-500" />
                <p>HB: {userDataIstri?.hbLevel}</p>
              </div>
              <button
                type="button"
                className="text-white bg-blue-light hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
                onClick={() => alert("Reminder to drink TTD!")}
              >
                Ingatkan Minum TTD
              </button>
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
