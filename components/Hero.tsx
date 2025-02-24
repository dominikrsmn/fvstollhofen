"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";

type NewsItem = {
  title: string;
  image: string;
};

// Mock data - replace with CMS data later
const news: NewsItem[] = [
  {
    title: "Dreitägiges Fußballcamp beim FV Stollhofen",
    image: "/mannschaft.JPG",
  },
  {
    title: "Erfolgreicher Saisonauftakt der ersten Mannschaft",
    image: "/mannschaft.JPG",
  },
];

function splitTitle(title: string): string[] {
  const words = title.toUpperCase().split(" ");
  const midpoint = Math.floor(words.length / 2);

  if (words.length <= 3) return [title];

  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-[80vh] group">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-primary !opacity-100",
          bulletClass:
            "swiper-pagination-bullet !bg-primary-foreground !w-3 !h-3 transition-all duration-300",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {news.map((item, index) => (
          <SwiperSlide
            key={index}
            className="relative cursor-pointer overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="relative w-full h-full"
              animate={{
                scale: isHovered ? 1.03 : 1,
              }}
              transition={{
                duration: 0.6,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
            <div className="absolute bottom-12 md:bottom-16 lg:bottom-24 left-8 md:left-16 lg:left-24 z-10">
              <motion.div
                className="relative transform -rotate-[5deg]"
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: isHovered ? 1.075 : 1,
                  skewX: isHovered ? -10 : 0,
                  y: isHovered ? -5 : 0,
                  rotate: isHovered ? -1 : -5,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.8, 0.12, 0.1, 0.8],
                }}
              >
                {splitTitle(item.title).map((line, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "bg-primary-foreground text-primary px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2 md:py-2 lg:py-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black w-fit relative overflow-hidden",
                      i > 0 ? "mt-1 sm:mt-1 md:mt-1.5 lg:mt-2" : ""
                    )}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      initial={{ x: "-100%" }}
                      animate={{ x: isHovered ? "100%" : "-100%" }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: i * 0.1,
                      }}
                    />
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Hero;
