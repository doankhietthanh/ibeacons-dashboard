/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    // missingSuspenseWithCSRBailout: false
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
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  }
};

export default nextConfig;
