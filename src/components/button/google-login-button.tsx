"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="flex flex-row gap-4 items-center justify-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 min-w-full"
      onClick={() => {
        signIn("google", {
          callbackUrl: "https://anecma.vercel.app/istri/dashboard",
        });
      }}
    >
      <FcGoogle className="w-5 h-5" />
      Sign in with Google
    </button>
  );
}
