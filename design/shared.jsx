// Shared components for Gargari Quiz screens
const { useState, useEffect, useRef } = React;

// Phone screen wrapper — fills the iOS device, has mesh bg
function Screen({ children, bg, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: bg || 'transparent',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Tactile button — thick border + offset shadow + spring on press
function Tactile({ children, onClick, style, variant = 'cream', radius = 0, full = true, height = 56 }) {
  const [pressed, setPressed] = useState(false);
  const variants = {
    cream:  { bg: 'var(--surface)', fg: 'var(--ink)' },
    forest: { bg: 'var(--forest)',  fg: '#fff' },
    coral:  { bg: 'var(--coral)',   fg: '#fff' },
    gold:   { bg: 'var(--gold)',    fg: 'var(--ink)' },
    paper:  { bg: 'var(--bg-cream)', fg: 'var(--ink)' },
  };
  const v = variants[variant] || variants.cream;
  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 420); onClick && onClick(); }}
      className={pressed ? 'btn-tactile spring' : 'btn-tactile'}
      style={{
        width: full ? '100%' : 'auto',
        height,
        borderRadius: radius,
        background: v.bg,
        color: v.fg,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: '0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Token balance pill — gold glow
function TokenBalance({ amount = 1248 }) {
  return (
    <div
      className="gold-glow"
      style={{
        height: 36,
        padding: '0 12px 0 8px',
        borderRadius: 24,
        background: 'var(--surface)',
        border: '2px solid var(--line-strong)',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700, fontSize: 14, color: 'var(--ink)',
      }}
    >
      <span className="coin"></span>
      <span className="tick">{amount.toLocaleString()}</span>
    </div>
  );
}

// Countdown timer hook
function useCountdown(initialSeconds) {
  const [s, setS] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setS(x => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

function formatHMS(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = n => String(n).padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
}

// Avatar (initials)
function Avatar({ initials, bg = 'var(--forest)', fg = '#fff', size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700, fontSize: size * 0.38,
      border: '2px solid var(--line-strong)',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// Tab bar (bottom)
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'home', label: 'Arena', icon: 'M3 11l9-8 9 8v10H3z' },
    { id: 'leaderboard', label: 'Ranks', icon: 'M4 21V9h4v12zm6 0V3h4v18zm6 0v-8h4v8z' },
    { id: 'wallet', label: 'Wallet', icon: 'M3 7h18v12H3zM3 7l3-3h12l3 3' },
    { id: 'profile', label: 'You',    icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 30,
      height: 64, borderRadius: 24,
      background: 'var(--ink)', color: '#fff',
      border: '3px solid var(--line-strong)',
      boxShadow: '0 4px 0 0 var(--line-strong)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      alignItems: 'center', zIndex: 30,
    }}>
      {tabs.map(t => {
        const is = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: is ? 'var(--gold)' : 'rgba(255,255,255,0.55)',
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d={t.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Decorative compass star
function CompassMark({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 1L14 10L23 12L14 14L12 23L10 14L1 12L10 10Z" fill={color}/>
    </svg>
  );
}

// Prize illustration — Tsinandali Estate placeholder (SVG landscape)
function EstateScene() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F8E1B2"/>
          <stop offset="0.6" stopColor="#F5C691"/>
          <stop offset="1" stopColor="#E8A07C"/>
        </linearGradient>
        <linearGradient id="mtn" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3A6B5A"/>
          <stop offset="1" stopColor="#1F4A3A"/>
        </linearGradient>
        <linearGradient id="mtn2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6B8A6F"/>
          <stop offset="1" stopColor="#3F5F4A"/>
        </linearGradient>
        <linearGradient id="vine" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#B5C58A"/>
          <stop offset="1" stopColor="#7F9B5E"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky)"/>
      {/* sun */}
      <circle cx="310" cy="70" r="34" fill="#FFD58A" opacity="0.9"/>
      <circle cx="310" cy="70" r="22" fill="#FFE4A8"/>
      {/* distant mountains */}
      <path d="M0 130 L60 90 L100 110 L160 70 L220 100 L280 80 L340 105 L400 90 L400 200 L0 200 Z" fill="url(#mtn2)" opacity="0.7"/>
      <path d="M0 160 L70 120 L120 140 L180 110 L240 130 L310 115 L400 135 L400 240 L0 240 Z" fill="url(#mtn)"/>
      {/* estate building */}
      <rect x="160" y="155" width="90" height="45" fill="#F4E3C4"/>
      <polygon points="155,155 205,135 255,155" fill="#7E2D26"/>
      <rect x="175" y="170" width="10" height="18" fill="#2A2620"/>
      <rect x="200" y="170" width="10" height="18" fill="#2A2620"/>
      <rect x="225" y="170" width="10" height="18" fill="#2A2620"/>
      {/* vineyards rows */}
      {[0,1,2,3,4,5].map(i => (
        <path key={i} d={`M0 ${200 + i*7} Q200 ${195 + i*7} 400 ${200 + i*7}`} stroke="url(#vine)" strokeWidth="2.5" fill="none"/>
      ))}
      {/* foreground vines */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <circle key={i} cx={20 + i*42} cy={230} r="6" fill="#5A3540"/>
      ))}
    </svg>
  );
}

Object.assign(window, {
  Screen, Tactile, TokenBalance, useCountdown, formatHMS, Avatar, TabBar, CompassMark, EstateScene,
});
