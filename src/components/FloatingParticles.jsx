import React, { useMemo } from 'react';

export default function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.3 + Math.random() * 2) % 100}%`,
      size: 10 + (i % 5) * 4,
      duration: 12 + (i % 7) * 3,
      delay: -(i % 10) * 1.5,
      type: i % 4 === 0 ? '♥' : i % 4 === 1 ? '✦' : i % 4 === 2 ? '♡' : '•',
      color: i % 3 === 0 ? '#ff7da7' : i % 3 === 1 ? '#f5c563' : '#ffb6c1',
      opacity: 0.15 + (i % 4) * 0.08,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type}
        </span>
      ))}
    </div>
  );
}
