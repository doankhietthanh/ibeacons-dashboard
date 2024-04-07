/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "picsum.photos",
      port: ""
    },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: ""
      }]
  }
};

export default nextConfig;
