"use client"
import React, { useEffect, useState, ReactNode } from 'react';
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode; // Type for the children prop
}

const BottomNavigation = () => {
  const [currentPath, setCurrentPath] = useState("");

  // Check the current path once the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around items-center py-3">
        {/* Home Button */}
        <Link href="/suami/dashboard" className={`flex flex-col items-center ${currentPath === '/suami/dashboard' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
          <FaHome className="w-6 h-6" />
          <span className="text-sm">Home</span>
        </Link>

        {/* Diary Button */}
        <Link href="#" className={`flex flex-col items-center ${currentPath === '/diary' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
          <FiBook className="w-6 h-6" />
          <span className="text-sm">Diary</span>
        </Link>

        {/* Users Button */}
        <Link href="#" className={`flex flex-col items-center ${currentPath === '/users' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
          <LuUsers className="w-6 h-6" />
          <span className="text-sm">Users</span>
        </Link>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
