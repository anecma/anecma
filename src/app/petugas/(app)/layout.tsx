"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import TopBar from "../components/topbar";
import { usePathname } from "next/navigation";
import axiosInstance from "@/libs/axios";

interface User {
  name: string;
  image: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authTokenPetugas");

        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const response = await axiosInstance.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, image } = response.data;
        setUserName(name);
        setUserImage(image);
      } catch (error) {
        console.error("Gagal mengambil data pengguna", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Sidebar currentPath={pathname} />

      <div className="flex-1 flex flex-col ml-64">
        <div className="p-4 bg-gray-100">
          <TopBar
            title={getTitle(pathname)}
            userName={userName}
            userImage={userImage}
          />
        </div>
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

const getTitle = (pathname: string) => {
  switch (pathname) {
    case "/petugas/dashboard":
      return "Dashboard";
    case "/petugas/puskesmas":
      return "Data Puskesmas";
    case "/petugas/petugas":
      return "Data Petugas";
    case "/petugas/edukasi":
      return "Data Edukasi";
    case "/petugas/kategori":
      return "Data Kategori";
    case "/petugas/settings":
      return "Settings";
    case "/petugas/data/rekap-hb":
      return "Rekap HB";
    case "/petugas/data/rekap-TTD":
      return "Rekap TTD Per Bulan";
    case "/petugas/data/rekap-TTD-90":
      return "Rekap TTD > 90";
    case "/petugas/data/rekap-gizi":
      return "Rekap Gizi";
    case "/petugas/data/faktor-resiko-anemia":
      return "Rekap Faktor Resiko Anemia";
    default:
      return "Admin Panel";
  }
};

export default Layout;
