/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/pilih-gender", permanent: false }];
  },
  images: {
    domains: ["res.cloudinary.com ","images.remotePatterns"],
  },
};

export default nextConfig;
