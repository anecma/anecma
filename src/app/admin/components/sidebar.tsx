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
  FaCalculator 
} from "react-icons/fa"; // Import icons
import { LuLayoutDashboard } from "react-icons/lu";
import Image from "next/image";
import axiosInstance from "@/libs/axios";

interface User {
  name: string;
  image: string;
  role: string;
}

interface SidebarProps {
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState<boolean>(false);

  // Check if any "Data" submenu item is active
  const isDataSubmenuActive = [
    "/admin/data/rekap-hb",
    "/admin/data/rekap-TTD",
    "/admin/data/rekap-TTD-90",
    "/admin/data/rekap-gizi"
  ].some(path => currentPath.includes(path));

  // If the current path includes any submenu item, keep the menu open
  useEffect(() => {
    const savedMenuStatus = localStorage.getItem("isDataMenuOpenAdmin");
    if (savedMenuStatus !== null) {
      setIsDataMenuOpen(JSON.parse(savedMenuStatus));
    }

    if (currentPath.includes("/admin/data") && !isDataMenuOpen) {
      setIsDataMenuOpen(true);
    }

    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authTokenAdmin");

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

  const isActive = (path: string) => {
    return currentPath === path
      ? "bg-indigo-400 text-white"
      : "hover:bg-indigo-300";
  };

  const handleDataMenuClick = () => {
    if (!isDataSubmenuActive) {
      const newStatus = !isDataMenuOpen;
      setIsDataMenuOpen(newStatus);
      localStorage.setItem("isDataMenuOpenAdmin", JSON.stringify(newStatus));
    }
  };

  return (
    <div className="fixed top-0 left-0 bg-white w-64 h-screen flex flex-col shadow-lg border-r overflow-x-auto">
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
              <h2 className="text-lg font-semibold">
                {user?.role || "Default Role"}
              </h2>
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 p-6">
        <ul>
          {/* Dashboard */}
          <li className="mb-6">
            <Link href="/admin/dashboard">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/dashboard"
                )}`}
              >
                <LuLayoutDashboard className="text-xl mr-3" />
                <span className="text-lg">Dashboard</span>
              </span>
            </Link>
          </li>

          {/* Data Menu */}
          <li className="mb-6">
            <button
              onClick={handleDataMenuClick}
              className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                "/admin/data"
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
          </li>

          {isDataMenuOpen || isDataSubmenuActive ? (
            <ul className="pl-6 mt-4">
              <li className="mb-4">
                <Link href="/admin/data/rekap-hb">
                  <span
                    className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                      "/admin/data/rekap-hb"
                    )}`}
                  >
                    <FaList className="text-xl mr-3" />
                    <span className="text-lg">Rekap HB</span>
                  </span>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/admin/data/rekap-TTD">
                  <span
                    className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                      "/admin/data/rekap-TTD"
                    )}`}
                  >
                    <FaList className="text-xl mr-3" />
                    <span className="text-lg">Rekap TTD</span>
                  </span>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/admin/data/rekap-TTD-90">
                  <span
                    className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                      "/admin/data/rekap-TTD-90"
                    )}`}
                  >
                    <FaList className="text-xl mr-3" />
                    <span className="text-md">Rekap TTD {">"}90</span>
                  </span>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/admin/data/rekap-gizi">
                  <span
                    className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                      "/admin/data/rekap-gizi"
                    )}`}
                  >
                    <FaList className="text-xl mr-3" />
                    <span className="text-lg">Rekap Gizi</span>
                  </span>
                </Link>
              </li>
              <li className="mb-6">
            <Link href="/admin/kakulator">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/data/kakulator"
                )}`}
              >
                <FaList className="text-xl mr-3" />
                <span className="text-lg">kakulator</span>
              </span>
            </Link>
          </li>
            </ul>
          ) : null}

          {/* Other Menu Items */}
          <li className="mb-6">
            <Link href="/admin/puskesmas">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/puskesmas"
                )}`}
              >
                <FaHospitalAlt className="text-xl mr-3" />
                <span className="text-lg">Puskesmas</span>
              </span>
            </Link>
          </li>

          <li className="mb-6">
            <Link href="/admin/petugas">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/petugas"
                )}`}
              >
                <FaUserMd className="text-xl mr-3" />
                <span className="text-lg">Petugas</span>
              </span>
            </Link>
          </li>

          <li className="mb-6">
            <Link href="/admin/edukasi">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/edukasi"
                )}`}
              >
                <FaChalkboardTeacher className="text-xl mr-3" />
                <span className="text-lg">Edukasi</span>
              </span>
            </Link>
          </li>

          <li className="mb-6">
            <Link href="/admin/kategori">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/kategori"
                )}`}
              >
                <FaTh className="text-xl mr-3" />
                <span className="text-lg">Kategori</span>
              </span>
            </Link>
          </li>

          <li className="mb-6">
            <Link href="/admin/user">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/user"
                )}`}
              >
                <FaUser className="text-xl mr-3" />
                <span className="text-lg">User</span>
              </span>
            </Link>
          </li>

          <li>
            <Link href="/admin/settings">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/settings"
                )}`}
              >
                <FaCog className="text-xl mr-3" />
                <span className="text-lg">Settings</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
