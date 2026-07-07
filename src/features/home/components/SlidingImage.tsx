import { useEffect, useMemo, useRef, useState } from 'react';

import work1 from '../assets/work.jpg';

interface SlidingImageProps {
  images?: string[];
  interval?: number;
  className?: string;
}

const defaultImages = [
  work1,
  'https://images.pexels.com/photos/7794081/pexels-photo-7794081.jpeg',
  'https://images.pexels.com/photos/7285965/pexels-photo-7285965.jpeg',
  'https://images.pexels.com/photos/5802827/pexels-photo-5802827.jpeg',
];

function SlidingImage({
  images = defaultImages,
  interval = 5000,
  className = '',
}: SlidingImageProps) {
  const validImages = images.length ? images : defaultImages;

  // clone first image for smooth loop
  const slides = useMemo(() => [...validImages, validImages[0]], [validImages]);

  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // autoplay
  useEffect(() => {
    if (validImages.length <= 1) return;

    const start = () => {
      if (timerRef.current) return;

      timerRef.current = setInterval(() => {
        setCurrent((prev) => prev + 1);
      }, interval);
    };

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [interval, validImages.length]);

  // seamless loop fix
  const handleTransitionEnd = () => {
    if (current === validImages.length) {
      setTransitionEnabled(false);
      setCurrent(0);

      // re-enable transition after jump
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="100%25" height="100%25" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20" fill="%2394a3b8"%3EImage unavailable%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="flex h-full"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${current * (100 / slides.length)}%)`,
          transition: transitionEnabled
            ? 'transform 700ms cubic-bezier(0.25,0.1,0.25,1)'
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}>
        {slides.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-full w-full shrink-0"
            style={{ width: `${100 / slides.length}%` }}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover opacity-90"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
    </div>
  );
}

export default SlidingImage;
