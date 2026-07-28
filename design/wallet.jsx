// Wallet & Store
const { useState: useStateW } = React;

function WalletScreen() {
  const [tab, setTab] = useStateW('wallet');
  const [mode, setMode] = useStateW('store'); // store | activity

  const packs = [
    { tokens: 100,  price: '$0.99',  bonus: null,   variant: 'paper' },
    { tokens: 550,  price: '$4.99',  bonus: '+10%', variant: 'paper' },
    { tokens: 1200, price: '$9.99',  bonus: '+20%', variant: 'gold',  popular: true },
    { tokens: 2800, price: '$19.99', bonus: '+40%', variant: 'forest' },
    { tokens: 6500, price: '$39.99', bonus: '+60%', variant: 'paper' },
    { tokens: 15000,price: '$79.99', bonus: '+100%',variant: 'coral', best: true },
  ];

  const activity = [
    { t: 'Tournament entry · Tsinandali', amt: -50,   when: '2m ago',  pos: false },
    { t: 'Streak bonus ×3',                amt: +120,  when: '5m ago',  pos: true },
    { t: 'Pack · 1,200',                   amt: +1200, when: '1h ago',  pos: true },
    { t: 'Speed run reward',               amt: +35,   when: '3h ago',  pos: true },
    { t: 'Power-up · 50/50',               amt: -25,   when: '3h ago',  pos: false },
    { t: 'Daily check-in',                 amt: +10,   when: 'yesterday',pos: true },
  ];

  return (
    <Screen>
      <div className="mesh-bg"></div>

      <div style={{ position: 'relative', height: '100%', overflowY: 'auto', paddingTop: 56 }} className="no-scrollbar">

        {/* Header */}
        <div style={{ padding: '10px 18px 0' }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
            color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>Your Treasury</div>
          <h1 className="f-display" style={{ margin: '2px 0 0', fontSize: 34, lineHeight: 1, color: 'var(--ink)' }}>
            Wallet
          </h1>
        </div>

        {/* Hero balance card */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            position: 'relative',
            background: 'var(--ink)',
            border: '3px solid var(--line-strong)',
            boxShadow: '0 4px 0 0 var(--line-strong)',
            borderRadius: 24,
            padding: '18px 18px 16px',
            color: '#fff', overflow: 'hidden',
          }}>
            {/* decorative coins */}
            <div style={{ position: 'absolute', right: -22, top: -22, width: 110, height: 110, borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 30%, #FFE38A 0%, #F0B23E 55%, #B47A14 100%)',
              opacity: 0.85, border: '3px solid var(--line-strong)',
            }}/>
            <div style={{ position: 'absolute', right: 50, top: 80, width: 56, height: 56, borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 30%, #FFE38A 0%, #F0B23E 55%, #B47A14 100%)',
              opacity: 0.7, border: '2.5px solid var(--line-strong)',
            }}/>

            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
              opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>Token Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <div className="f-display tick" style={{ fontSize: 64, lineHeight: 0.9, color: 'var(--gold)' }}>
                1,248
              </div>
              <span className="coin" style={{ width: 22, height: 22 }}></span>
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.7)', marginTop: 6,
            }}>
              ≈ $9.99 · Earned 240 this week
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button style={{
                flex: 1, height: 44, borderRadius: 0,
                background: 'var(--gold)', color: 'var(--ink)',
                border: '2.5px solid var(--line-strong)',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}>＋ Top up</button>
              <button style={{
                flex: 1, height: 44, borderRadius: 24,
                background: 'transparent', color: '#fff',
                border: '2.5px solid rgba(255,255,255,0.5)',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Cash out</button>
            </div>
          </div>
        </div>

        {/* Segmented control */}
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: '2.5px solid var(--line-strong)',
            background: 'var(--surface)',
            borderRadius: 0, overflow: 'hidden',
          }}>
            {['store', 'activity'].map(m => {
              const active = mode === m;
              return (
                <button key={m} onClick={() => setMode(m)}
                  style={{
                    height: 42,
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? '#fff' : 'var(--ink)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{m}</button>
              );
            })}
          </div>
        </div>

        {mode === 'store' ? (
          <>
            {/* Section title */}
            <div style={{ padding: '20px 18px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <h2 className="f-display" style={{ margin: 0, fontSize: 22, color: 'var(--ink)' }}>
                Token Packs
              </h2>
              <span className="f-ui" style={{
                fontSize: 11, fontWeight: 700, color: 'var(--forest)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>One-tap buy ✓</span>
            </div>

            {/* Pack grid */}
            <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {packs.map((p, i) => {
                const variants = {
                  paper:  { bg: 'var(--surface)',   fg: 'var(--ink)',  radius: 0  },
                  gold:   { bg: 'var(--gold)',      fg: 'var(--ink)',  radius: 24 },
                  forest: { bg: 'var(--forest)',    fg: '#fff',        radius: 0  },
                  coral:  { bg: 'var(--coral)',     fg: '#fff',        radius: 24 },
                };
                const v = variants[p.variant];
                return (
                  <div key={i} style={{
                    border: '3px solid var(--line-strong)',
                    background: v.bg, color: v.fg,
                    borderRadius: v.radius,
                    boxShadow: '0 4px 0 0 var(--line-strong)',
                    padding: '14px 14px 12px',
                    position: 'relative',
                    minHeight: 156,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}>
                    {p.popular && (
                      <div style={{
                        position: 'absolute', top: -10, left: 12,
                        background: 'var(--coral)', color: '#fff',
                        border: '2px solid var(--line-strong)',
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 9,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px',
                      }}>★ Popular</div>
                    )}
                    {p.best && (
                      <div style={{
                        position: 'absolute', top: -10, right: 12,
                        background: 'var(--ink)', color: 'var(--gold)',
                        border: '2px solid var(--line-strong)',
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 9,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px',
                      }}>Best value</div>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span className="coin" style={{ width: 22, height: 22 }}></span>
                        {p.bonus && (
                          <span style={{
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 800,
                            color: v.fg === '#fff' ? 'var(--gold)' : 'var(--forest)',
                            letterSpacing: '0.08em',
                          }}>{p.bonus} BONUS</span>
                        )}
                      </div>
                      <div className="f-display tick" style={{ fontSize: 36, lineHeight: 0.95 }}>
                        {p.tokens.toLocaleString()}
                      </div>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                        opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2,
                      }}>Tokens</div>
                    </div>

                    <button style={{
                      width: '100%', height: 36, marginTop: 10,
                      borderRadius: v.radius === 24 ? 18 : 0,
                      background: v.fg === '#fff' ? 'rgba(255,255,255,0.18)' : 'var(--ink)',
                      color: v.fg === '#fff' ? '#fff' : '#fff',
                      border: v.fg === '#fff' ? '2px solid rgba(255,255,255,0.4)' : '2px solid var(--line-strong)',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13,
                      cursor: 'pointer', letterSpacing: '0.02em',
                    }}>{p.price}</button>
                  </div>
                );
              })}
            </div>

            {/* Payment row */}
            <div style={{ padding: '20px 18px 0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                background: 'var(--surface)',
                border: '2px dashed var(--line-strong)',
                borderRadius: 0,
              }}>
                <div style={{
                  width: 38, height: 26, borderRadius: 4,
                  background: 'linear-gradient(135deg, #1B1714, #3A332B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: 'Bebas Neue, system-ui', fontSize: 11, letterSpacing: 0.5,
                }}>Pay</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--ink)',
                  }}>Apple Pay · •••• 4821</div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'var(--ink-3)',
                  }}>Default · One-tap enabled</div>
                </div>
                <button style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
                  color: 'var(--forest)', letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Change</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Activity */}
            <div style={{ padding: '20px 18px 0' }}>
              <h2 className="f-display" style={{ margin: '0 0 10px', fontSize: 22, color: 'var(--ink)' }}>
                Recent activity
              </h2>
              <div style={{
                background: 'var(--surface)',
                border: '3px solid var(--line-strong)',
                borderRadius: 0,
                overflow: 'hidden',
                boxShadow: '0 4px 0 0 var(--line-strong)',
              }}>
                {activity.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderTop: i === 0 ? 'none' : '1.5px solid var(--line)',
                  }}>
                    <div style={{
                      width: 32, height: 32,
                      border: '2px solid var(--line-strong)',
                      background: a.pos ? 'var(--gold-soft)' : 'var(--coral-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Bebas Neue, system-ui', fontSize: 20, color: 'var(--ink)',
                    }}>{a.pos ? '+' : '−'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                        color: 'var(--ink)',
                      }}>{a.t}</div>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'var(--ink-3)',
                      }}>{a.when}</div>
                    </div>
                    <div className="f-display tick" style={{
                      fontSize: 20, lineHeight: 1,
                      color: a.pos ? 'var(--forest)' : 'var(--coral)',
                    }}>{a.pos ? '+' : ''}{a.amt.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ height: 110 }}/>
      </div>

      <TabBar active={tab} onChange={setTab}/>
    </Screen>
  );
}

Object.assign(window, { WalletScreen });
