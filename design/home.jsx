// Home — "The Arena"
const { useState: useStateH, useEffect: useEffectH } = React;

function HomeScreen() {
  const total = useCountdown(3 * 3600 + 47 * 60 + 22);
  const { h, m, s } = formatHMS(total);
  const [tab, setTab] = useStateH('home');
  const [category, setCategory] = useStateH('travel');

  const cats = [
    { id: 'travel', label: 'Travel', icon: '✈', color: '#FFD9CE' },
    { id: 'tech',   label: 'Tech',   icon: '◉', color: '#D9E7FF' },
    { id: 'cash',   label: 'Cash',   icon: '$', color: 'var(--gold-soft)' },
    { id: 'experience', label: 'Experience', icon: '★', color: 'var(--sky)' },
  ];

  const battles = [
    { title: 'Speed Run · Geography', players: 1284, prize: '50K', live: true, hot: true },
    { title: 'Tech Quickfire',         players: 642,  prize: '20K', live: true, hot: false },
    { title: 'Culture Clash',          players: 2103, prize: '100K', live: false, hot: true },
  ];

  return (
    <Screen>
      <div className="mesh-bg"></div>

      <div style={{ position: 'relative', height: '100%', overflowY: 'auto', paddingTop: 56 }} className="no-scrollbar">

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 18px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials="DG" bg="var(--coral)" size={40}/>
            <div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
                color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
              }}>Adventurer</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--ink)',
              }}>Davit G.</div>
            </div>
          </div>
          <TokenBalance amount={1248} />
        </div>

        {/* Section: Arena hero */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <h1 className="f-display" style={{
              margin: 0, fontSize: 48, lineHeight: 0.92, color: 'var(--ink)',
            }}>The<br/>Arena</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--coral)' }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)',
                boxShadow: '0 0 0 4px rgba(255,77,46,0.2)',
                animation: 'flicker 1.2s ease-in-out infinite',
              }}></span>
              <span className="f-ui" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                12,408 live
              </span>
            </div>
          </div>
        </div>

        {/* Grand Tournament featured card */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            borderRadius: 24,
            border: '3px solid var(--line-strong)',
            background: 'var(--surface)',
            boxShadow: '0 4px 0 0 var(--line-strong)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Image */}
            <div style={{ height: 180, position: 'relative', borderBottom: '3px solid var(--line-strong)' }}>
              <EstateScene/>
              {/* Frosted glass label */}
              <div className="chip" style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--coral)', color: '#fff', borderColor: 'var(--line-strong)',
              }}>
                Grand Tournament
              </div>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 10px', borderRadius: 0,
                border: '2px solid var(--line-strong)',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
              }}>
                <CompassMark size={11}/>
                <span className="f-ui" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Kakheti · GE
                </span>
              </div>

              {/* Frosted prize callout */}
              <div className="glass" style={{
                position: 'absolute', left: 12, bottom: 12, right: 12,
                borderRadius: 16,
                padding: '10px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                    color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>Prize</div>
                  <div className="f-display" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>
                    Tsinandali Estate · 2 nights
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                    color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>Worth</div>
                  <div className="f-display" style={{ fontSize: 22, lineHeight: 1, color: 'var(--forest)' }}>
                    ₾4,800
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div style={{ padding: '14px 14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="f-ui" style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>Tournament starts in</span>
                <span className="f-ui" style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--coral)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>● Hot · 3,402 in</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                {[{ v: h, l: 'Hours' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map((u, i) => (
                  <div key={i} style={{
                    border: '2px solid var(--line-strong)', borderRadius: 0,
                    background: 'var(--bg-cream)',
                    padding: '8px 6px', textAlign: 'center',
                  }}>
                    <div className="f-display tick" style={{ fontSize: 36, lineHeight: 1, color: 'var(--ink)' }}>
                      {u.v}
                    </div>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700,
                      color: 'var(--ink-3)', letterSpacing: '0.16em', textTransform: 'uppercase',
                    }}>{u.l}</div>
                  </div>
                ))}
              </div>

              <Tactile variant="forest" radius={0} height={52}>
                Reserve Seat · 50
                <span className="coin"></span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4 }}>
                  <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Tactile>
            </div>
          </div>
        </div>

        {/* Categories horizontal scroll */}
        <div style={{ padding: '22px 0 0' }}>
          <div style={{
            padding: '0 18px',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <h2 className="f-display" style={{ margin: 0, fontSize: 22, color: 'var(--ink)' }}>
              Choose your prize
            </h2>
            <span className="f-ui" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' }}>See all →</span>
          </div>

          <div style={{
            display: 'flex', gap: 10, padding: '0 18px',
            overflowX: 'auto',
          }} className="no-scrollbar">
            {cats.map(c => {
              const active = category === c.id;
              return (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  style={{
                    flexShrink: 0,
                    width: 128, height: 140,
                    border: '3px solid var(--line-strong)',
                    borderRadius: c.id === 'travel' || c.id === 'cash' ? 0 : 24,
                    background: active ? 'var(--ink)' : c.color,
                    color: active ? '#fff' : 'var(--ink)',
                    boxShadow: '0 4px 0 0 var(--line-strong)',
                    padding: 12,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform .12s',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'translateY(3px)'}
                  onMouseUp={e => e.currentTarget.style.transform = ''}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  <div className="f-display" style={{ fontSize: 32, lineHeight: 1 }}>{c.icon}</div>
                  <div>
                    <div className="f-display" style={{ fontSize: 20, lineHeight: 1 }}>{c.label}</div>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 600,
                      opacity: 0.7, marginTop: 2,
                    }}>
                      {c.id === 'travel' ? '12 prizes' : c.id === 'tech' ? '8 prizes' : c.id === 'cash' ? '∞ pool' : '5 prizes'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live battles */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 className="f-display" style={{ margin: 0, fontSize: 22, color: 'var(--ink)' }}>
              Battles · Today
            </h2>
            <span className="chip" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--line-strong)' }}>
              5s rounds
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {battles.map((b, i) => (
              <div key={i} style={{
                border: '2.5px solid var(--line-strong)',
                background: i === 0 ? 'var(--gold-soft)' : 'var(--surface)',
                borderRadius: i % 2 === 0 ? 0 : 24,
                padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 0,
                  border: '2px solid var(--line-strong)',
                  background: i === 0 ? 'var(--coral)' : i === 1 ? 'var(--forest)' : 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>
                  <CompassMark size={20} color="#fff"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{b.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'var(--ink-3)', fontWeight: 600,
                    }}>{b.players.toLocaleString()} playing</span>
                    {b.hot && <span style={{ fontSize: 12 }} className="fire">🔥</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="f-display" style={{ fontSize: 22, lineHeight: 1, color: 'var(--forest)' }}>{b.prize}</div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700,
                    color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>Pool</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* spacer for tab bar */}
        <div style={{ height: 110 }}/>
      </div>

      <TabBar active={tab} onChange={setTab}/>
    </Screen>
  );
}

Object.assign(window, { HomeScreen });
