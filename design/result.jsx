// Victory / Defeat result screens
const { useState: useStateR, useEffect: useEffectR } = React;

function VictoryScreen() {
  const [confetti, setConfetti] = useStateR([]);
  useEffectR(() => {
    const items = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: ['var(--gold)', 'var(--coral)', 'var(--forest)', 'var(--sky-2)', '#fff'][i % 5],
        size: 6 + Math.random() * 8,
        shape: i % 3,
      });
    }
    setConfetti(items);
  }, []);

  return (
    <Screen>
      <div className="mesh-bg"></div>

      {/* confetti */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {confetti.map(c => (
          <div key={c.id} style={{
            position: 'absolute',
            left: `${c.x}%`, top: -20,
            width: c.size, height: c.shape === 2 ? c.size * 0.4 : c.size,
            background: c.color,
            borderRadius: c.shape === 0 ? '50%' : 0,
            transform: `rotate(${c.rotation}deg)`,
            animation: `confettiFall ${c.duration}s ${c.delay}s linear infinite`,
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(960px) rotate(720deg); opacity: 0.8; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shine {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0, padding: '80px 22px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 2,
      }}>
        {/* "Lottie-style" trophy */}
        <div style={{
          width: 168, height: 168, marginTop: 20, marginBottom: 18,
          animation: 'scaleIn .8s cubic-bezier(.34,1.56,.64,1) both',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, animation: 'shine 2.4s ease-in-out infinite' }}>
            <svg viewBox="0 0 200 200" width="168" height="168">
              {/* base */}
              <rect x="56" y="160" width="88" height="20" fill="#181512" stroke="#181512" strokeWidth="4"/>
              <rect x="72" y="140" width="56" height="22" fill="#181512" stroke="#181512" strokeWidth="4"/>
              {/* trophy cup */}
              <path d="M50 30 L150 30 L142 100 Q142 130 100 130 Q58 130 58 100 Z"
                    fill="#F0B23E" stroke="#181512" strokeWidth="5" strokeLinejoin="round"/>
              {/* handles */}
              <path d="M50 40 Q25 45 25 70 Q25 95 50 95" fill="none" stroke="#181512" strokeWidth="5" strokeLinecap="round"/>
              <path d="M150 40 Q175 45 175 70 Q175 95 150 95" fill="none" stroke="#181512" strokeWidth="5" strokeLinecap="round"/>
              {/* star */}
              <path d="M100 56 L108 78 L130 78 L113 92 L120 114 L100 102 L80 114 L87 92 L70 78 L92 78 Z"
                    fill="#FFFFFF" stroke="#181512" strokeWidth="3" strokeLinejoin="round"/>
              {/* shine */}
              <circle cx="72" cy="55" r="4" fill="#fff"/>
              <circle cx="64" cy="68" r="2.5" fill="#fff"/>
            </svg>
          </div>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700,
          color: 'var(--coral)', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 6,
        }}>You won the round</div>
        <h1 className="f-display" style={{
          margin: 0, fontSize: 68, lineHeight: 0.85, color: 'var(--ink)', textAlign: 'center',
        }}>Glory!</h1>

        {/* Stats card */}
        <div style={{
          marginTop: 22, width: '100%',
          background: 'var(--ink)', color: '#fff',
          border: '3px solid var(--line-strong)',
          boxShadow: '0 4px 0 0 var(--line-strong)',
          borderRadius: 24,
          padding: '16px 18px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { v: '9 / 10', l: 'Correct' },
              { v: '×7', l: 'Streak', c: 'var(--coral)' },
              { v: '4.2s', l: 'Avg time' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="f-display tick" style={{ fontSize: 26, lineHeight: 1, color: s.c || 'var(--gold)' }}>
                  {s.v}
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700,
                  color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 1.5, background: 'rgba(255,255,255,0.12)', margin: '14px 0 12px' }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
              opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>Reward</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="coin" style={{ width: 20, height: 20 }}></span>
              <span className="f-display tick" style={{ fontSize: 30, lineHeight: 1, color: 'var(--gold)' }}>
                +480
              </span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <Tactile variant="coral" radius={0} height={56} style={{ marginBottom: 10 }}>
          Claim & continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Tactile>
        <Tactile variant="paper" radius={24} height={48} style={{ marginBottom: 22 }}>
          Share result
        </Tactile>
      </div>
    </Screen>
  );
}

function DefeatScreen() {
  return (
    <Screen bg="var(--bg-paper)">
      <div className="mesh-bg" style={{ filter: 'saturate(70%) brightness(0.96)' }}></div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0, padding: '80px 22px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 2,
      }}>
        {/* "Lottie-style" cracked compass */}
        <div style={{
          width: 168, height: 168, marginTop: 20, marginBottom: 18,
          animation: 'wobble 3.2s ease-in-out infinite',
        }}>
          <svg viewBox="0 0 200 200" width="168" height="168">
            {/* compass body */}
            <circle cx="100" cy="100" r="78" fill="#FFFAEC" stroke="#181512" strokeWidth="5"/>
            <circle cx="100" cy="100" r="62" fill="none" stroke="#181512" strokeWidth="3" strokeDasharray="4 6"/>
            {/* N/S/E/W */}
            <text x="100" y="44" fontFamily="Bebas Neue, system-ui" fontSize="16" fill="#181512" textAnchor="middle">N</text>
            <text x="100" y="170" fontFamily="Bebas Neue, system-ui" fontSize="16" fill="#181512" textAnchor="middle">S</text>
            <text x="38" y="106" fontFamily="Bebas Neue, system-ui" fontSize="16" fill="#181512" textAnchor="middle">W</text>
            <text x="162" y="106" fontFamily="Bebas Neue, system-ui" fontSize="16" fill="#181512" textAnchor="middle">E</text>
            {/* needle (broken) */}
            <path d="M100 100 L90 50 L100 80 Z" fill="#FF4D2E" stroke="#181512" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M100 100 L115 145 L100 120 Z" fill="#181512" stroke="#181512" strokeWidth="3" strokeLinejoin="round"/>
            {/* center pin */}
            <circle cx="100" cy="100" r="6" fill="#181512"/>
            {/* crack */}
            <path d="M60 50 L92 86 L86 96 L120 134" fill="none" stroke="#181512" strokeWidth="3" strokeLinecap="round"/>
            <path d="M92 86 L100 80" fill="none" stroke="#181512" strokeWidth="2"/>
          </svg>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700,
          color: 'var(--ink-3)', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 6,
        }}>Round Over</div>
        <h1 className="f-display" style={{
          margin: 0, fontSize: 68, lineHeight: 0.85, color: 'var(--ink)', textAlign: 'center',
        }}>Lost the<br/>trail</h1>

        {/* Stats card */}
        <div style={{
          marginTop: 22, width: '100%',
          background: 'var(--surface)',
          border: '3px solid var(--line-strong)',
          boxShadow: '0 4px 0 0 var(--line-strong)',
          borderRadius: 0,
          padding: '16px 18px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { v: '4 / 10', l: 'Correct' },
              { v: '×0', l: 'Streak', c: 'var(--coral)' },
              { v: '4.8s', l: 'Avg time' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="f-display tick" style={{ fontSize: 26, lineHeight: 1, color: s.c || 'var(--ink)' }}>
                  {s.v}
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700,
                  color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="dotted-rule" style={{ margin: '14px 0 12px' }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
              color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>Consolation</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="coin" style={{ width: 20, height: 20 }}></span>
              <span className="f-display tick" style={{ fontSize: 30, lineHeight: 1, color: 'var(--forest)' }}>
                +15
              </span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <Tactile variant="forest" radius={0} height={56} style={{ marginBottom: 10 }}>
          Try again · 50
          <span className="coin"></span>
        </Tactile>
        <Tactile variant="paper" radius={24} height={48} style={{ marginBottom: 22 }}>
          Back to Arena
        </Tactile>
      </div>
    </Screen>
  );
}

Object.assign(window, { VictoryScreen, DefeatScreen });
