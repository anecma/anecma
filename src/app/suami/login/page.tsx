"use client";
import React, { useState } from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import axiosInstance from "@/libs/axios";
import { AxiosError } from "axios";
import Image from "next/image";

interface ErrorMessage {
  email?: string;
  password?: string;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [loginError, setLoginError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage({ email: "", password: "" });
    setLoginError("");

    const errors: ErrorMessage = {};
    if (!email) {
      errors.email = "Masukkan email";
    }
    if (!password) {
      errors.password = "Masukkan kata sandi";
    }
    setErrorMessage(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosInstance.post("/suami/login-token", {
          email,
          password,
        });

        const token = response.data.data?.token;

        if (token) {
          localStorage.setItem("authToken", token);
          setEmail("");
          setPassword("");
          window.location.href = "/suami/dashboard";
        } else {
          setLoginError("Token tidak ditemukan.");
        }
      } catch (error) {
        console.error("Login gagal:", error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            setLoginError("Kata sandi salah.");
          } else if (error.response?.status === 404) {
            setErrorMessage({ ...errors, email: "Email tidak dikenal." });
          } else {
            setLoginError("Terjadi kesalahan. Silakan coba lagi.");
          }
        } else {
          setLoginError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Bagian gambar */}
      <div className="flex items-center justify-center bg-white md:bg-gray-100 relative sm:flex-1 sm:h-auto h-60">
        {/* Logos at the top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center w-full px-6 mt-6 space-x-8 sm:space-x-10">
          <Image
            src="/images/Logo_Dikti.png"
            alt="Logo Dikti"
            width={60}
            height={60}
            className="object-contain"
          />
          <Image
            src="/images/Resmi_Logo_UMS.png"
            alt="Logo UMS"
            width={60}
            height={60}
            className="object-contain"
          />
          <Image
            src="/images/Logo_Kesmas.png"
            alt="Logo Kesmas"
            width={60}
            height={60}
            className="object-contain"
          />
          <Image
            src="/images/logo-pti-compact.png"
            alt="Logo PTI"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Main Logo */}
        <div className="absolute inset-0 flex items-center justify-center sm:relative sm:w-auto sm:h-auto">
          <Image
            src="/images/anecma-login-logo.png"
            alt="Anecma Logo"
            className="object-contain w-40 h-40 sm:w-auto sm:h-auto"
            width={270}
            height={270}
          />
        </div>
      </div>

      {/* Bagian form login */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email atau nomor HP
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 bg-white border ${
                    errorMessage.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errorMessage.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errorMessage.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 bg-white border ${
                    errorMessage.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>
            </div>
            {errorMessage.password && (
              <p className="mt-2 text-sm text-red-600">
                {errorMessage.password}
              </p>
            )}
            {loginError && (
              <p className="mt-2 text-sm text-red-600">{loginError}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ingat saya
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
