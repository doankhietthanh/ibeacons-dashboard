import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Đạo Cụ Việt",
    short_name: "Đạo Cụ Việt",
    description:
      "Chuyên cung cấp đạo cụ sân khấu, thiết bị sự kiện và dụng cụ cỗ vũ",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
