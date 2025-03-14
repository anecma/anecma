"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar'; 
import TopBar from '../components/topbar';
import { usePathname } from 'next/navigation'; 
import axios from 'axios';
import axiosInstance from '@/libs/axios';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); 

  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ambil token authTokenAdmin dari localStorage
        const token = localStorage.getItem('authTokenAdmin');
        
        if (!token) {
          console.error('Token tidak ditemukan');
          return;
        }

        const response = await axiosInstance.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, image } = response.data;
        setUserName(name);
        setUserImage(image);
      } catch (error) {
        console.error('Gagal mengambil data pengguna', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Sidebar currentPath={pathname} />
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
      return 'Rekap TTD Per Bulan';
    case '/admin/data/rekap-TTD-90':
      return 'Rekap TTD > 90';
    case '/admin/data/rekap-gizi':
      return 'Rekap Gizi';
    default:
      return 'Admin Panel';
  }
};

export default Layout;
