"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHospitalAlt, FaUserMd, FaCog, FaBook } from "react-icons/fa";
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

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
  }, []);

  const isActive = (path: string) => {
    return currentPath === path
      ? "bg-indigo-400 text-white"
      : "hover:bg-indigo-300";
  };

  return (
    <div className="fixed top-0 left-0 bg-white w-64 h-screen flex flex-col shadow-lg border-r">
      <div className="p-4 flex items-center border-b">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <Image
              src={user?.image || "/image/bidan.png"}
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
          <li className="mb-6">
            <Link href="/admin/puskesmas">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left ${isActive(
                  "/admin/puskesmas"
                )}`}
              >
                <FaHospitalAlt className="text-xl mr-3" />
                <span className="text-lg">Data Puskesmas</span>
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
                <span className="text-lg">Data Petugas</span>
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
                <FaBook className="text-xl mr-3" /> {/* Updated icon */}
                <span className="text-lg">Data Edukasi</span>
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
