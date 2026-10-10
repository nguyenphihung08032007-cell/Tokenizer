import React, { useEffect, useRef } from 'react';

interface HeritageBackdropProps {
  isAiProcessing?: boolean;
  darkMode?: boolean;
}

export const HeritageBackdrop: React.FC<HeritageBackdropProps> = ({
  isAiProcessing = false,
  darkMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      type: 'peach' | 'apricot' | 'leaf';
      opacity: number;
    }

    const petals: Petal[] = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 7,
      speedX: 0.25 + Math.random() * 0.55,
      speedY: 0.35 + Math.random() * 0.65,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.018,
      type: i % 4 === 0 ? 'apricot' : i % 5 === 0 ? 'leaf' : 'peach',
      opacity: 0.22 + Math.random() * 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.x += p.speedX + Math.sin(p.y * 0.012) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        if (p.type === 'peach') {
          ctx.fillStyle = darkMode ? '#EDAAB8' : '#E7A1B0';
        } else if (p.type === 'apricot') {
          ctx.fillStyle = darkMode ? '#DFB85C' : '#C9A24B';
        } else {
          ctx.fillStyle = darkMode ? '#B87333' : '#9E5B24';
        }

        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.7, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hue-cloud-wave" width="160" height="90" patternUnits="userSpaceOnUse">
            <path d="M 0 60 Q 40 30 80 60 T 160 60" fill="none" stroke="#C9A24B" strokeWidth="1.2" />
            <path d="M 0 75 Q 40 45 80 75 T 160 75" fill="none" stroke="#5A3A22" strokeWidth="0.9" />
            <path d="M 30 28 C 22 28, 18 20, 26 16 C 30 10, 42 10, 46 16 C 54 16, 56 26, 46 28 Z" fill="none" stroke="#C9A24B" strokeWidth="1" />
            <circle cx="125" cy="25" r="7" fill="none" stroke="#B3261E" strokeWidth="0.8" />
            <circle cx="125" cy="25" r="2.5" fill="none" stroke="#C9A24B" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hue-cloud-wave)" />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] md:w-[820px] md:h-[820px] opacity-[0.075] dark:opacity-[0.09]">
        <DongSonDrumSVG className={isAiProcessing ? 'animate-drum-fast' : 'animate-drum-slow'} />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export const DongSonDrumSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="192" stroke="#C9A24B" strokeWidth="3" />
    <circle cx="200" cy="200" r="178" stroke="#5A3A22" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx="200" cy="200" r="152" stroke="#C9A24B" strokeWidth="2" />
    <circle cx="200" cy="200" r="118" stroke="#C9A24B" strokeWidth="1.8" />
    <circle cx="200" cy="200" r="82" stroke="#B3261E" strokeWidth="1.5" />
    <circle cx="200" cy="200" r="52" stroke="#C9A24B" strokeWidth="2.5" />

    {Array.from({ length: 14 }).map((_, i) => {
      const angle = (i * 360) / 14;
      return (
        <g key={i} transform={`rotate(${angle} 200 200)`}>
          <polygon points="200,150 207,188 193,188" fill="#C9A24B" />
          <polygon points="200,84 205,116 195,116" stroke="#C9A24B" strokeWidth="1" />
        </g>
      );
    })}

    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 360) / 8;
      return (
        <g key={`lac-${i}`} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M 180 65 Q 200 52 222 65 M 200 58 L 216 58 M 192 65 L 185 75"
            stroke="#B3261E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="200" cy="32" r="4" stroke="#C9A24B" strokeWidth="1.5" />
          <circle cx="200" cy="32" r="1.5" fill="#C9A24B" />
        </g>
      );
    })}
  </svg>
);

export const CornerOrnament: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position }) => {
  const normalized =
    position === 'top-left'
      ? 'tl'
      : position === 'top-right'
      ? 'tr'
      : position === 'bottom-left'
      ? 'bl'
      : position === 'bottom-right'
      ? 'br'
      : position;

  const posClasses = {
    tl: 'top-1.5 left-1.5 rotate-0',
    tr: 'top-1.5 right-1.5 rotate-90',
    br: 'bottom-1.5 right-1.5 rotate-180',
    bl: 'bottom-1.5 left-1.5 -rotate-90',
  }[normalized];

  return (
    <svg
      viewBox="0 0 28 28"
      className={`w-4 h-4 absolute pointer-events-none opacity-75 ${posClasses}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 26 V2 H26" stroke="#C9A24B" strokeWidth="2" />
      <path d="M6 18 V6 H18" stroke="#C9A24B" strokeWidth="1.2" />
      <rect x="6" y="6" width="4" height="4" stroke="#B3261E" strokeWidth="1.2" />
    </svg>
  );
};

export const LotusOrnament: React.FC<{ className?: string; blooming?: boolean }> = ({
  className = 'w-6 h-6',
  blooming = false,
}) => (
  <svg
    viewBox="0 0 64 64"
    className={`${className} transition-transform duration-500 ${blooming ? 'scale-110' : 'scale-100'}`}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M32 48 C16 48 6 36 10 22 C18 26 26 34 32 48 Z"
      fill="#E7A1B0"
      fillOpacity="0.35"
      stroke="#C9A24B"
      strokeWidth="1.5"
    />
    <path
      d="M32 48 C48 48 58 36 54 22 C46 26 38 34 32 48 Z"
      fill="#E7A1B0"
      fillOpacity="0.35"
      stroke="#C9A24B"
      strokeWidth="1.5"
    />
    <path
      d="M32 48 C20 42 16 26 22 14 C28 22 30 32 32 48 Z"
      fill="#E7A1B0"
      fillOpacity="0.6"
      stroke="#B3261E"
      strokeWidth="1.5"
    />
    <path
      d="M32 48 C44 42 48 26 42 14 C36 22 34 32 32 48 Z"
      fill="#E7A1B0"
      fillOpacity="0.6"
      stroke="#B3261E"
      strokeWidth="1.5"
    />
    <path
      d="M32 48 C24 34 24 18 32 8 C40 18 40 34 32 48 Z"
      fill="#B3261E"
      fillOpacity="0.85"
      stroke="#C9A24B"
      strokeWidth="1.6"
    />
    <ellipse cx="32" cy="50" rx="14" ry="3.5" fill="#C9A24B" />
  </svg>
);
