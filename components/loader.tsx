"use client";

import { useTheme } from "next-themes";
import { PuffLoader } from "react-spinners";

const Loader = () => {
  const theme = useTheme();

  return (
    <PuffLoader
      size={50}
      color={theme.theme === "dark" ? "#000000" : "#ffffff"}
    />
  );
};

export default Loader;
