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
      <h1 className="text-3xl font-bold text-center mb-5">Anecma</h1>
      <div className="mb-10">
        <Image
          src={"/images/red-blood-cells-3.png"}
          alt="Red Blood Cells"
          width="270"
          height="270"
        />
      </div>
      <div className="w-full px-10">
        <GoogleLoginButton />
      </div>
    </main>
  );
}