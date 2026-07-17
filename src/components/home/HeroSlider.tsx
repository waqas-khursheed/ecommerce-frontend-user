"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadUrl } from "@/lib/http";
import type { Slide } from "@/types/home";

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted sm:aspect-[21/9]">
      {slides.map((slide, i) => {
        const image = uploadUrl("slides", slide.image);
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {image && <Image src={image} alt={slide.Heading ?? ""} fill priority={i === 0} sizes="100vw" className="object-cover" />}
            {(slide.Heading || slide.bullet_1) && (
              <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 bg-black/20 px-6 sm:px-16">
                {slide.Heading && (
                  <h1 className="max-w-md text-2xl font-bold text-white sm:text-4xl">{slide.Heading}</h1>
                )}
                <ul className="space-y-1 text-sm text-white/90 sm:text-base">
                  {[slide.bullet_1, slide.bullet_2, slide.bullet_3].filter(Boolean).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {slide.link && (
                  <Button render={<Link href={slide.link} />} className="mt-2 h-11">
                    Shop Now
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 size-9 -translate-y-1/2"
            onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 size-9 -translate-y-1/2"
            onClick={() => setActive((i) => (i + 1) % slides.length)}
            aria-label="Next slide"
          >
            <ChevronRight />
          </Button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn("size-2 rounded-full transition-colors", i === active ? "bg-white" : "bg-white/50")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
