// Quiz Interface — Anti-Cheat Layout
const { useState: useStateQ, useEffect: useEffectQ, useRef: useRefQ } = React;

function QuizScreen() {
  const TIME_LIMIT = 5; // seconds per question
  const [timeLeft, setTimeLeft] = useStateQ(TIME_LIMIT);
  const [selected, setSelected] = useStateQ(null);
  const [revealed, setRevealed] = useStateQ(false);
  const [qIdx, setQIdx] = useStateQ(2); // currently on Q3
  const totalQ = 10;
  const correct = 1; // index B
  const timerRef = useRefQ(null);

  // Countdown
  useEffectQ(() => {
    if (revealed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          setRevealed(true);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [revealed, qIdx]);

  const choose = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    clearInterval(timerRef.current);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TIME_LIMIT);
    setQIdx(i => (i + 1) % totalQ);
  };

  const answers = [
    'Sighnaghi',
    'Tsinandali',
    'Telavi',
    'Kvareli',
  ];

  const pct = (timeLeft / TIME_LIMIT) * 100;
  const urgent = timeLeft < 2;

  return (
    <Screen bg="var(--bg-paper)">
      <div className="mesh-bg"></div>

      {/* Top: depleting progress bar */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 16px', zIndex: 5 }}>
        <div style={{
          height: 12, borderRadius: 0, background: 'var(--bg-warm)',
          border: '2.5px solid var(--line-strong)', overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            width: `${pct}%`,
            background: urgent
              ? 'repeating-linear-gradient(45deg, var(--coral) 0 8px, var(--coral-2) 8px 16px)'
              : 'var(--forest)',
            transition: 'width .1s linear',
          }}/>
        </div>

        {/* Question meta */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="chip" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--line-strong)' }}>
              Q {qIdx + 1} / {totalQ}
            </span>
            <span className="chip" style={{ background: 'var(--surface)' }}>
              Travel
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Anti-cheat lock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
              color: 'var(--forest)', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <svg width="11" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 11V7a7 7 0 0114 0v4M4 11h16v10H4z" stroke="currentColor" strokeWidth="2.5"/>
              </svg>
              Secure
            </div>
            <div style={{
              width: 56, textAlign: 'right',
              fontFamily: 'Bebas Neue, system-ui', fontSize: 28, lineHeight: 1,
              color: urgent ? 'var(--coral)' : 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {timeLeft.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        position: 'absolute', top: 140, left: 0, right: 0, bottom: 0,
        padding: '0 16px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }} className="no-scrollbar">

        {/* Question */}
        <h2 className="f-display" style={{
          margin: '8px 0 12px', fontSize: 30, lineHeight: 0.96, color: 'var(--ink)',
        }}>
          Which village hosts<br/>
          this 19th-century<br/>
          wine estate?
        </h2>

        {/* Media box — center stage. Anti-AI: requires visual analysis */}
        <div style={{
          borderRadius: 24,
          border: '3px solid var(--line-strong)',
          overflow: 'hidden',
          height: 200,
          position: 'relative',
          boxShadow: '0 4px 0 0 var(--line-strong)',
          marginBottom: 14,
        }}>
          <EstateScene/>
          {/* anti-AI label */}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 8px',
            background: 'rgba(20,21,18,0.85)',
            color: '#fff',
            border: '1.5px solid #000',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Live image
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          }}/>
          <div style={{
            position: 'absolute', bottom: 8, right: 10,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
            color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          }}>
            ID #4821 · Verified ✓
          </div>
        </div>

        {/* Answer buttons — tactile */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {answers.map((a, i) => {
            const letter = ['A', 'B', 'C', 'D'][i];
            const isSel = selected === i;
            const isCorrect = revealed && i === correct;
            const isWrong = revealed && isSel && i !== correct;

            let bg = 'var(--surface)';
            let fg = 'var(--ink)';
            let badge = 'var(--bg-warm)';
            let badgeFg = 'var(--ink)';
            if (isCorrect) { bg = 'var(--forest)'; fg = '#fff'; badge = 'var(--gold)'; badgeFg = 'var(--ink)'; }
            else if (isWrong) { bg = 'var(--coral)'; fg = '#fff'; badge = 'var(--ink)'; badgeFg = '#fff'; }
            else if (revealed) { bg = 'var(--bg-cream)'; fg = 'var(--ink-3)'; }

            return (
              <AnswerBtn key={i}
                letter={letter}
                label={a}
                bg={bg} fg={fg} badge={badge} badgeFg={badgeFg}
                onClick={() => choose(i)}
                disabled={revealed}
                revealed={revealed}
                isCorrect={isCorrect}
                isWrong={isWrong}
              />
            );
          })}
        </div>

        {/* Reveal panel / hint row */}
        {!revealed ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            border: '2px dashed var(--line-strong)',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="coin"></span>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)',
              }}>50/50 power-up · 25 tokens</span>
            </div>
            <button style={{
              background: 'var(--ink)', color: '#fff',
              border: 'none', padding: '6px 12px',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Use</button>
          </div>
        ) : (
          <div style={{
            padding: '12px 14px',
            background: selected === correct ? 'var(--forest)' : 'var(--ink)',
            color: '#fff', borderRadius: 0,
            border: '3px solid var(--line-strong)',
            boxShadow: '0 4px 0 0 var(--line-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12,
          }}>
            <div>
              <div className="f-display" style={{ fontSize: 20, lineHeight: 1, color: selected === correct ? 'var(--gold)' : 'var(--coral)' }}>
                {selected === correct ? '+120 pts · Correct!' : selected === null ? 'Time out' : 'Wrong'}
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, opacity: 0.8, marginTop: 2,
              }}>Streak: {selected === correct ? '×4 🔥' : 'Reset to 0'}</div>
            </div>
            <button onClick={next} style={{
              background: 'var(--gold)', color: 'var(--ink)',
              border: '2px solid var(--line-strong)',
              padding: '8px 14px', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 0,
            }}>Next →</button>
          </div>
        )}

        <div style={{ flex: 1 }}/>

        {/* Bottom: player avatars (live opponents) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 22px',
        }}>
          <div style={{ display: 'flex' }}>
            {[
              { i: 'NK', c: '#FF4D2E' },
              { i: 'AS', c: '#144132' },
              { i: 'GL', c: '#F0B23E' },
              { i: 'TM', c: '#5A3540' },
            ].map((p, idx) => (
              <div key={idx} style={{ marginLeft: idx === 0 ? 0 : -10 }}>
                <Avatar initials={p.i} bg={p.c} size={28}/>
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-3)',
          }}>
            + 1,280 playing now
          </div>
          <div style={{ flex: 1 }}/>
          <span className="fire" style={{ fontSize: 16 }}>🔥</span>
          <span className="f-display" style={{ fontSize: 22, lineHeight: 1, color: 'var(--coral)' }}>×3</span>
        </div>
      </div>
    </Screen>
  );
}

function AnswerBtn({ letter, label, bg, fg, badge, badgeFg, onClick, disabled, revealed, isCorrect, isWrong }) {
  const [pressed, setPressed] = useStateQ(false);
  return (
    <button
      onClick={() => {
        if (disabled) return;
        setPressed(true); setTimeout(() => setPressed(false), 420);
        onClick && onClick();
      }}
      disabled={disabled}
      className={pressed ? 'btn-tactile spring' : 'btn-tactile'}
      style={{
        height: 86, padding: '12px',
        background: bg, color: fg,
        borderRadius: letter === 'A' || letter === 'D' ? 0 : 24,
        textAlign: 'left',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        opacity: revealed && !isCorrect && !isWrong ? 0.7 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <div style={{
        width: 26, height: 26,
        background: badge, color: badgeFg,
        border: '2px solid var(--line-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Bebas Neue, system-ui', fontSize: 18, lineHeight: 1,
      }}>{letter}</div>
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, lineHeight: 1.05,
      }}>{label}</div>
    </button>
  );
}

Object.assign(window, { QuizScreen });
