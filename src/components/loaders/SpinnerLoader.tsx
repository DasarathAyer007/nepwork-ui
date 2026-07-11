import React, { useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

interface LoaderProps {
  show?: boolean;
  size?: number;
  color?: string;
  message?: string;
  className?: string;
  style?: CSSProperties;
}

let idCounter = 0;

export const SpinnerLoader: React.FC<LoaderProps> = ({
  show = true,
  size = 48,
  color = 'var(--color-primary, #25b09b)',
  message,
  className,
  style,
}) => {
  if (!show) return null;

  const id = useRef(`loader-${++idCounter}`).current;
  const animationName = `spin-${id}`;

  const r = (size - 4) / 2;
  const scale = size / 48;

  const boxShadow = useMemo(() => {
    const shadows: string[] = [];
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI) / 4;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const spread = i * scale;
      shadows.push(
        `${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${spread.toFixed(2)}px`
      );
    }
    return shadows.join(', ');
  }, [r, scale]);

  return (
    <>
      <style>{`
        @keyframes ${animationName} {
          100% { transform: rotate(1turn); }
        }
      `}</style>

      <div
        role="alert"
        aria-busy="true"
        aria-label={message || 'Loading'}
        className={` fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs${className}`}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          background: 'rgba(219, 228, 232, 0.5)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          ...style,
        }}>
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            color,
            boxShadow,
            animation: `${animationName} 1s infinite steps(8)`,
          }}
        />

        {message && (
          <p
            style={{
              marginTop: 16,
              fontSize: '0.875rem',
              lineHeight: 1.4,
              color: 'var(--color-on-surface-variant, #40484b)',
              textAlign: 'center',
              maxWidth: '80%',
            }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};
