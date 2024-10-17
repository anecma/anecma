import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

// Contoh data bidan dengan nomor WA dan Puskesmas
const bidans = [
  {
    id: 1,
    name: "Bidan Puskesmas Sangkrahan",
    puskesmas: "Sangkrahan",
    imageUrl: "/images/bidan.png",
    whatsappNumber: "6285155040934", 
  },
  {
    id: 2,
    name: "Bidan Puskesmas Kratonan",
    puskesmas: "Kratonan",
    imageUrl: "/images/bidan.png",
    whatsappNumber: "628112759081", 
  },
  {
    id: 3,
    name: "Bidan Puskesmas Gilingan",
    puskesmas: "Gilingan",
    imageUrl: "/images/bidan.png",
    whatsappNumber: "6281909178154", 
  },
];

export default function KonsultasiPage() {
  return (
    <main className="mb-20">
      {/* Header */}
      <div className="m-5">
        <p className="text-2xl font-bold">Konsultasi</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      {/* Daftar Bidans */}
      <div className="">
        {bidans.map((bidan) => (
          <div
            key={bidan.id}
            className="flex flex-row mx-5 mb-5 items-center bg-white border border-gray-200 rounded-lg shadow"
          >
            <div className="p-5 w-3/5">
              <a href="#">
                <h5 className="text-ellipsis overflow-hidden mb-3 text-base font-bold tracking-tight text-gray-900 dark:text-white">
                  {bidan.name}
                </h5>
              </a>
              <p className="text-ellipsis overflow-hidden text-nowrap mb-3 font-normal text-gray-700 dark:text-gray-400">
                {bidan.puskesmas}
              </p>
              <a
                href={`https://wa.me/${bidan.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex gap-2 items-center px-5 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-2xl hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <IoChatbubbleEllipsesOutline />
                Chat
              </a>
            </div>
            <a
              href="#"
              className="p-5 w-2/5 flex flex-row items-center justify-center"
            >
              <Image
                className="w-24 h-24 rounded-full"
                src={bidan.imageUrl}
                alt={bidan.name}
                width={100}
                height={100}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FaHome className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Home
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FiBook className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Edukasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <IoChatbubblesOutline className="w-5 h-5 mb-2 text-blue-600 dark:text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-500">
              Konsultasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <LuUsers className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Profil
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
