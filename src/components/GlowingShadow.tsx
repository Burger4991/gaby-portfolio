'use client'

export default function GlowingShadow() {
  return (
    <>
      {/* Gold gradient rule — same as old ::after */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '1px',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent)',
          opacity: 0.45,
          zIndex: 1,
        }}
      />
      {/* Glow bloom — wider soft pulse behind the rule */}
      <div
        aria-hidden
        className="glowing-shadow-bloom"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-8px',
          width: '17px',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, hsla(38,55%,55%,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scaleY(1); }
          50%       { opacity: 1;    transform: scaleY(1.08); }
        }
        @media (max-width: 768px) {
          .glowing-shadow-bloom { display: none; }
        }
      `}</style>
    </>
  )
}
