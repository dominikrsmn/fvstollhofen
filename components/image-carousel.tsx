"use client";

import Image from "next/image";
import { Swiper } from "@/components/ui/swiper";
import { SwiperSlide } from "swiper/react";

interface ImageType {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: ImageType[];
  className?: string;
  priority?: boolean;
}

export function ImageCarousel({
  images,
  className,
  priority = false,
}: ImageCarouselProps) {
  return (
    <Swiper className={className}>
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority && index === 0}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
