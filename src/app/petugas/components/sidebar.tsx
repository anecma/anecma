"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHospitalAlt,
  FaUserMd,
  FaCog,
  FaList,
  FaTh,
  FaChalkboardTeacher,
  FaDatabase,
  FaChevronRight,
  FaChevronDown,
  FaUser,
} from "react-icons/fa"; // Import icons
import { LuLayoutDashboard } from "react-icons/lu";
import Image from "next/image";
import axiosInstance from "@/libs/axios";

interface ApiResponse {
  data: {
    user: User;
  };
}

interface User {
  name: string;
  image: string | null;
  role: string;
  kelurahan: string | null;
  wilayah_binaan: string | null;
}

interface SidebarProps {
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState<boolean>(false);

  // Check if any path within the "Data" submenu is active
  const isDataSubmenuActive = [
    "/petugas/data/rekap-hb",
    "/petugas/data/rekap-TTD",
    "/petugas/data/rekap-TTD-90",
    "/petugas/data/rekap-gizi",
  ].some((path) => currentPath.includes(path));

  
  // Ambil status submenu "Data" dari localStorage saat komponen pertama kali di-render
  useEffect(() => {
    const savedMenuStatus = localStorage.getItem("isDataMenuOpenPetugas");
    if (savedMenuStatus !== null) {
      setIsDataMenuOpen(JSON.parse(savedMenuStatus));
    }
  }, []);

  // Buka submenu "Data" jika path saat ini termasuk "/petugas/data"
  useEffect(() => {
    const savedMenuStatus = localStorage.getItem("isDataMenuOpenAdmin");
    if (savedMenuStatus !== null) {
      setIsDataMenuOpen(JSON.parse(savedMenuStatus));
    }

    if (currentPath.includes("/petugas/data") && !isDataMenuOpen) {
      setIsDataMenuOpen(true);
    }

    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authTokenPetugas");

        if (!authToken) {
          setError("No token found");
          return;
        }

        const response = await axiosInstance.get<User>("/user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [currentPath, isDataMenuOpen]);
  // Fungsi untuk menentukan apakah path aktif
  const isActive = (path: string) => {
    return currentPath === path
      ? "bg-indigo-400 text-white"
      : "hover:bg-indigo-300";
  };
  const handleDataMenuClick = () => {
    if (!isDataSubmenuActive) {
      const newStatus = !isDataMenuOpen;
      setIsDataMenuOpen(newStatus);
      localStorage.setItem("isDataMenuOpenPetugas", JSON.stringify(newStatus));
    }
  };

  return (
    <div className="fixed top-0 left-0 bg-white w-64 h-screen flex flex-col shadow-lg border-r overflow-x-auto">
      {/* Header Sidebar */}
      <div className="p-4 flex items-center border-b">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <Image
              src={user?.image || "/images/bidan.png"}
              alt="User"
              width={56}
              height={56}
              className="rounded-full border border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {user?.name || "Default User"}
              </h2>
              <h2 className="text-sm text-gray-600">
                {user?.role || "Default Role"}
              </h2>
            </div>
          </>
        )}
      </div>

      {/* Navigasi Sidebar */}
      <nav className="flex-1 p-6">
        <ul>
          {/* Menu Dashboard */}
          <li className="mb-6">
            <Link href="/petugas/dashboard">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/petugas/dashboard"
                )}`}
              >
                <LuLayoutDashboard className="text-xl mr-3" />
                <span className="text-lg">Dashboard</span>
              </span>
            </Link>
          </li>

          {/* Menu Data */}
          <li className="mb-6">
            <button
              onClick={handleDataMenuClick}
              className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                "/petugas/data"
              )}`}
            >
              <FaDatabase className="text-xl mr-3" />
              <span className="text-lg">Data</span>
              {isDataMenuOpen || isDataSubmenuActive ? (
                <FaChevronDown className="ml-auto text-lg" />
              ) : (
                <FaChevronRight className="ml-auto text-lg" />
              )}
            </button>

            {/* Submenu Data */}
            {(isDataMenuOpen || isDataSubmenuActive) && (
              <ul className="pl-6 mt-4">
                <li className="mb-4">
                  <Link href="/petugas/data/rekap-hb">
                    <span
                      className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                        "/petugas/data/rekap-hb"
                      )}`}
                    >
                      <FaList className="text-xl mr-3" />
                      <span className="text-lg">Rekap HB</span>
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/petugas/data/rekap-TTD">
                    <span
                      className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                        "/petugas/data/rekap-TTD"
                      )}`}
                    >
                      <FaList className="text-xl mr-3" />
                      <span className="text-lg">Rekap TTD</span>
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/petugas/data/rekap-TTD-90">
                    <span
                      className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                        "/petugas/data/rekap-TTD-90"
                      )}`}
                    >
                      <FaList className="text-xl mr-3" />
                      <span className="text-md">Rekap TTD {">"}90</span>
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/petugas/data/rekap-gizi">
                    <span
                      className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                        "/petugas/data/rekap-gizi"
                      )}`}
                    >
                      <FaList className="text-xl mr-3" />
                      <span className="text-lg">Rekap Gizi</span>
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/petugas/data/faktor-resiko-anemia">
                    <span
                      className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                        "/petugas/data/faktor-resiko-anemia"
                      )}`}
                    >
                      <FaList className="text-xl mr-3" />
                      <span className="text-lg">Faktor Resiko</span>
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Menu User */}
          <li className="mb-6">
            <Link href="/petugas/user">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/petugas/user"
                )}`}
              >
                <FaUser className="text-xl mr-3" />
                <span className="text-lg">User</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
