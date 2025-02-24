"use client";

import * as React from "react";
import { Swiper as SwiperReact } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperProps {
  children: React.ReactNode;
  className?: string;
}

export function Swiper({ children, className }: SwiperProps) {
  return (
    <SwiperReact
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop
      className={className}
    >
      {children}
    </SwiperReact>
  );
}
