import type { NextConfig } from "next";

// Deploy a GitHub Pages: export estático servido en el subpath /meridian.
// El basePath se aplica solo en producción para no romper el dev local.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/meridian" : "",
  images: {
    // GitHub Pages no tiene optimizador de imágenes: se sirven las URLs originales.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
