"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar'; 
import TopBar from '../components/topbar';
import { usePathname } from 'next/navigation'; 

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); 

  const userName = "User Name"; 
  const userImage = "/images/bidan.png"; 

  return (
    <div className="flex h-screen flex-col">
      {/* Sidebar with current path */}
      <Sidebar currentPath={pathname} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <div className='p-4 bg-gray-100'>
          <TopBar title={getTitle(pathname)} userName={userName} userImage={userImage} />
        </div>
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

// Function to get the title based on the current path
const getTitle = (pathname: string) => {
  switch (pathname) {
    case '/admin/dashboard':
      return 'Dashboard';
    case '/admin/puskesmas':
      return 'Data Puskesmas';
    case '/admin/petugas':
      return 'Data Petugas';
    case '/admin/edukasi':
      return 'Data Edukasi';
    case '/admin/kategori':
      return 'Data Kategori';
    case '/admin/settings':
      return 'Settings';
    case '/admin/data/rekap-hb':
      return 'Rekap HB';
    case '/admin/data/rekap-TTD':
      return 'Rekap TTD';
    case '/admin/data/rekap-TTD-90':
      return 'Rekap TTD > 90';
    case '/admin/data/rekap-gizi':
      return 'Rekap Gizi';
    default:
      return 'Admin Panel';
  }
};

export default Layout;
