"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

interface TopBarProps {
  title: string;
  userName: string;
  userImage?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, userName, userImage }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 flex justify-between  items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4  relative bg-white rounded-lg">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-1 rounded-sm"
        >
          <Image
            src={userImage || "/images/bidan.png"}
            alt={userName || "User Image"}
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <div className="text-lg font-semibold">{userName}</div>
          <FaChevronDown className="text-sm" />
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10"
            style={{ top: "100%" }}
          >
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setDropdownOpen(false)}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
