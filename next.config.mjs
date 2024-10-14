/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirect() {
    return [{ source: "/", destination: "/pilih-gender", permanent: true }];
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
