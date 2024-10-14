/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async redirect() {
    return [{ source: "/", destination: "/pilih-gender", permanent: false }];
  },
};

export default nextConfig;
