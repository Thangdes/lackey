'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export default function ChristmasSnow() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20, 
      opacity: 0.3 + Math.random() * 0.5, 
      size: 2 + Math.random() * 4, 
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute top-0"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
          }}
        />
      ))}
      <style jsx>{`
        .snowflake {
          background: #87CEEB;
          border-radius: 50%;
          animation: fall linear infinite;
          will-change: transform;
          box-shadow: 0 0 3px rgba(135, 206, 235, 0.8), 0 0 6px rgba(255, 255, 255, 0.6);
        }

        @keyframes fall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          100% {
            transform: translateY(100vh) translateX(50px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflake {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
