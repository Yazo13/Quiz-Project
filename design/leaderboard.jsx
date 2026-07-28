// Leaderboard — real-time ranks
const { useState: useStateL } = React;

function LeaderboardScreen() {
  const [tab, setTab] = useStateL('leaderboard');
  const [filter, setFilter] = useStateL('today');

  const top3 = [
    { rank: 2, name: 'Nino K.',  pts: 8420, streak: 7, you: false, color: '#FF4D2E', initials: 'NK' },
    { rank: 1, name: 'Lasha M.', pts: 9180, streak: 12, you: false, color: 'var(--gold)', initials: 'LM' },
    { rank: 3, name: 'Tako J.',  pts: 7964, streak: 4, you: false, color: 'var(--forest)', initials: 'TJ' },
  ];

  const ranks = [
    { rank: 4, name: 'Giorgi P.',  pts: 7210, streak: 3, color: 'var(--sky-2)', initials: 'GP' },
    { rank: 5, name: 'Mariam V.',  pts: 6890, streak: 0, color: '#5A3540',      initials: 'MV' },
    { rank: 6, name: 'Davit G.',   pts: 6422, streak: 5, color: 'var(--coral)', initials: 'DG', you: true },
    { rank: 7, name: 'Salome B.',  pts: 6201, streak: 2, color: 'var(--forest)',initials: 'SB' },
    { rank: 8, name: 'Irakli D.',  pts: 5984, streak: 0, color: '#8E5A1B',      initials: 'ID' },
    { rank: 9, name: 'Anna L.',    pts: 5712, streak: 8, color: '#3F5F4A',      initials: 'AL' },
    { rank:10, name: 'Beka R.',    pts: 5503, streak: 1, color: '#7E2D26',      initials: 'BR' },
  ];

  return (
    <Screen>
      <div className="mesh-bg"></div>

      <div style={{ position: 'relative', height: '100%', overflowY: 'auto', paddingTop: 56 }} className="no-scrollbar">

        {/* Header */}
        <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
              color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>Live Standings</div>
            <h1 className="f-display" style={{ margin: '2px 0 0', fontSize: 34, lineHeight: 1, color: 'var(--ink)' }}>
              Leaderboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
            border: '2px solid var(--line-strong)', borderRadius: 24, background: 'var(--surface)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--coral)',
              boxShadow: '0 0 0 3px rgba(255,77,46,0.2)' }}></span>
            <span className="f-ui" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Live
            </span>
          </div>
        </div>

        {/* Your rank banner */}
        <div style={{ padding: '12px 18px 0' }}>
          <div style={{
            background: 'var(--ink)', color: '#fff',
            border: '3px solid var(--line-strong)',
            boxShadow: '0 4px 0 0 var(--line-strong)',
            borderRadius: 24,
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div className="f-display" style={{ fontSize: 56, lineHeight: 0.85, color: 'var(--gold)' }}>#6</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
                opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Your rank</div>
              <div className="f-display" style={{ fontSize: 22, lineHeight: 1 }}>
                +2 from last hour
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
                color: 'rgba(255,255,255,0.7)', marginTop: 2,
              }}>
                468 pts to overtake Mariam V.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="f-display tick" style={{ fontSize: 24, lineHeight: 1, color: '#fff' }}>6,422</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700,
                color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>Points</div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ padding: '14px 18px 0', display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
          {['today', 'weekly', 'grand', 'friends'].map(f => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="chip"
                style={{
                  background: active ? 'var(--coral)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--ink)',
                  borderColor: 'var(--line-strong)',
                  cursor: 'pointer', flexShrink: 0,
                }}>
                {f}
              </button>
            );
          })}
        </div>

        {/* Podium */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 8, alignItems: 'end' }}>
            {top3.map((p, i) => {
              const pheight = p.rank === 1 ? 168 : p.rank === 2 ? 138 : 120;
              const medal = p.rank === 1 ? 'var(--gold)' : p.rank === 2 ? '#C8C8D0' : '#D89923';
              return (
                <div key={p.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', marginBottom: 8 }}>
                    <Avatar initials={p.initials} bg={p.color} size={p.rank === 1 ? 64 : 50}/>
                    {p.streak >= 5 && (
                      <div style={{
                        position: 'absolute', top: -4, right: -8, fontSize: 18,
                      }} className="fire">🔥</div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                    color: 'var(--ink)', marginBottom: 2,
                  }}>{p.name}</div>
                  <div className="f-display tick" style={{ fontSize: 18, lineHeight: 1, color: 'var(--ink)' }}>
                    {p.pts.toLocaleString()}
                  </div>
                  <div style={{
                    width: '100%', height: pheight, marginTop: 8,
                    background: p.rank === 1 ? 'var(--gold)' : p.rank === 2 ? 'var(--surface)' : 'var(--coral-soft)',
                    border: '3px solid var(--line-strong)',
                    borderRadius: p.rank === 1 ? 24 : 0,
                    borderBottom: 'none',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: 10,
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: medal,
                      border: '2.5px solid var(--line-strong)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Bebas Neue, system-ui', fontSize: 22, color: 'var(--ink)',
                    }}>{p.rank}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rank list */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{
            background: 'var(--surface)',
            border: '3px solid var(--line-strong)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 4px 0 0 var(--line-strong)',
          }}>
            {ranks.map((p, i) => (
              <div key={p.rank} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
                background: p.you ? 'var(--gold-soft)' : 'transparent',
                borderTop: i === 0 ? 'none' : '1.5px solid var(--line)',
                position: 'relative',
              }}>
                <div className="f-display tick" style={{
                  width: 28, textAlign: 'center', fontSize: 22, lineHeight: 1,
                  color: p.you ? 'var(--coral)' : 'var(--ink-3)',
                }}>{p.rank}</div>
                <Avatar initials={p.initials} bg={p.color} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)',
                    }}>{p.name}</span>
                    {p.you && <span className="chip" style={{
                      fontSize: 9, padding: '1px 6px', background: 'var(--coral)', color: '#fff', borderColor: 'var(--line-strong)',
                    }}>You</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    {p.streak > 0 && (
                      <>
                        <span className="fire" style={{ fontSize: 11 }}>🔥</span>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
                          color: p.streak >= 5 ? 'var(--coral)' : 'var(--ink-3)',
                        }}>×{p.streak}</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-4)' }}/>
                      </>
                    )}
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 500, color: 'var(--ink-3)',
                    }}>
                      {Math.round(Math.random() * 30 + 60)}% accuracy
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="f-display tick" style={{
                    fontSize: 20, lineHeight: 1, color: 'var(--ink)',
                  }}>{p.pts.toLocaleString()}</div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 600,
                    color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 110 }}/>
      </div>

      <TabBar active={tab} onChange={setTab}/>
    </Screen>
  );
}

Object.assign(window, { LeaderboardScreen });
