'use client';

import {useEffect, useState} from 'react';

interface Snowflake {
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function SnowFall() {
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true);
  }, []);

  if(!mounted) return null;

  const snowflakes: Snowflake[] = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 17.3) % 100,
    size: (i % 3) + 5,
    duration: (i % 10) + 10,
    delay: i % 4,
  }));

  return (
    <>
      <div className="pointer-events-none absolute inset-0">
          {snowflakes.map((flake, i) => (
            <div
              key={i}
              className="animate-snowfall absolute rounded-full bg-blue-50"
              style={{
                left: `${flake.left}%`,
                top: '-10px',
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}
        </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </>
  )
} 