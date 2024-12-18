"use client";

import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";

export default function BottomNavigationSuami() {
  const path = usePathname();

  const linkActive = "w-5 h-5 mb-2 text-blue-600";
  const linkInactive = "w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600";

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-3">
          <NavLink
            href="/suami/dashboard"
            icon={
              <FaHome
                className={
                  path.startsWith("/suami/dashboard")
                    ? linkActive
                    : linkInactive
                }
              />
            }
          >
            Home
          </NavLink>
          <NavLink
            href="/suami/edukasi"
            icon={
              <FiBook
                className={
                  path.startsWith("/suami/edukasi") ? linkActive : linkInactive
                }
              />
            }
          >
            Edukasi
          </NavLink>
          <NavLink
            href="/suami/profile"
            icon={
              <LuUsers
                className={
                  path.startsWith("/suami/profil") ? linkActive : linkInactive
                }
              />
            }
          >
            Profil
          </NavLink>
        </div>
      </div>
    </>
  );
}
