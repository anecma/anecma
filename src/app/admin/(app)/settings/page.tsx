"use client";
import axiosInstance from "@/libs/axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";

interface User {
  id: number;
  name: string;
}

const Setting = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authTokenAdmin");

        if (!authToken) {
          setError("No token found");
          setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    if (user) {
      setNewUserName(user.name);
      setIsModalOpen(true);
    }
  };

  const handleUpdateUser = async () => {
    if (newUserName && user) {
      try {
        const authToken = localStorage.getItem("authTokenAdmin");
        if (!authToken) {
          setError("No token found");
          return;
        }

        const response = await axiosInstance.post(
          `/admin/update-admin-profil/${user.id}`,
          { name: newUserName },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          setUser((prevUser) => ({
            ...prevUser!,
            name: newUserName,
          }));
          setIsModalOpen(false); 
        } else {
          setError("Failed to update user name.");
        }
      } catch (err) {
        setError("Error updating user name.");
      }
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen py-8 px-6">
      <div className="container mx-auto">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-300 animate-pulse"></div>
            </div>
            <div className="flex justify-end w-full">
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            <div className="h-6 w-full bg-gray-300 animate-pulse mt-4"></div>
          </div>
        ) : user ? (
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
           
              <Image
                src="/images/bidan.png"
                alt="User"
                width={56}
                height={56}
                className="rounded-full border border-gray-300"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Name: {user.name}
              </h3>
            </div>

            <div className="flex justify-end w-full">
              <button
                onClick={handleEditClick}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">Tidak ada pengguna yang ditemukan.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label htmlFor="newUserName" className="block text-gray-700 mb-2">
                New Name:
              </label>
              <input
                type="text"
                id="newUserName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Setting;
