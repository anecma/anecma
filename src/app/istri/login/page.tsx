import Image from "next/image";
import { getServerSession } from "next-auth";
import GoogleLoginButton from "@/components/button/google-login-button";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/istri/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-10">
        <Image
          src={"/images/anecma-login-logo.png"}
          alt="Anecma Logo"
          width="270"
          height="270"
          priority
        />
      </div>
      <div className="w-full px-10">
        <GoogleLoginButton />
      </div>
    </main>
  );
}
