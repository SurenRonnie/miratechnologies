"use client";

import dynamic from "next/dynamic";

const StarDust = dynamic(() => import("./StarDust"), { ssr: false });

export default function StarDustLoader() {
  return <StarDust />;
}
