"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: string;
  delay: string;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate posisi bintang hanya di sisi client (browser)
    // agar tidak menyebabkan error prerendering di Server Component Next.js
    const generated: Star[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.8 ? 3 : 2,
      opacity: Math.random() * 0.6 + 0.3,
      duration: `${(Math.random() * 3 + 2).toFixed(1)}s`,
      delay: `${(Math.random() * 3).toFixed(1)}s`,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            ["--duration" as string]: star.duration,
            ["--delay" as string]: star.delay,
          }}
        />
      ))}
    </div>
  );
}

