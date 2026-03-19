"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        
        {/* LEFT SIDE - IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/image.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border h-[400px] w-auto object-contain transition-all duration-500"
              priority
            />
          </div>
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl gradient-title animate-gradient">
            Ready to Ace Your Next Interview?
          </h1>

          <p className="text-muted-foreground md:text-lg max-w-[500px] mx-auto md:mx-0">
            Join thousands of professionals using PrepX to land their dream job.
          </p>

          <div className="flex justify-center md:justify-start">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;