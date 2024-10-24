/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/pilih-gender", permanent: false }];
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
