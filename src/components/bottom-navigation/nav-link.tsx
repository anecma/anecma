"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function NavLink({ href, icon, children }: NavLinkProps) {
  const path = usePathname();

  const linkActive = "text-sm text-blue-600";
  const linkInactive =
    "text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500";

  return (
    <>
      <Link
        href={href}
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
      >
        {icon}
        <span className={path.startsWith(href) ? linkActive : linkInactive}>
          {children}
        </span>
      </Link>
    </>
  );
}
