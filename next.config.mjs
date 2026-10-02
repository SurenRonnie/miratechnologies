/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let other devices on the LAN (and a Cloudflare quick tunnel) load dev-mode scripts.
  allowedDevOrigins: ["192.168.0.25", "*.trycloudflare.com"],
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
