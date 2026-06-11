// Landing Page — Samridhi
// Font: Playfair Display (elegant serif headlines) + DM Sans (clean body)
// Coins spread across entire hero viewport

window.LandingPageView = ({ setPage, scrollToSection }) => {
  const { useState, useEffect, useRef } = React;

  const [demoScore, setDemoScore] = useState(72);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [typedText, setTypedText] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [countersOn, setCountersOn] = useState(false);
  const [counts, setCounts] = useState({ a: 0, b: 0, c: 0 });
  const [revealed, setRevealed] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const canvasRef = useRef(null);
  const statsRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const HEADLINE = 'The apex of\nalternative credit\nintelligence.';

  /* ── TYPEWRITER ── */
  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
    let i = 0;
    const t = setInterval(() => {
      setTypedText(HEADLINE.slice(0, i));
      i++;
      if (i > HEADLINE.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, []);

  /* ── MOUSE ── */
  useEffect(() => {
    const fn = (e) => {
      const v = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      mouseRef.current = v;
      setMousePos(v);
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  /* ── PARTICLES CANVAS ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.3 + 0.08),
        r: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.4 + 0.08,
        phase: Math.random() * Math.PI * 2
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x * canvas.width;
      const my = mouseRef.current.y * canvas.height;
      particles.forEach(p => {
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
        if (d < 150) { p.vx += dx / d * 0.006; p.vy += dy / d * 0.006; }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width;
        if (p.x > canvas.width + 5) p.x = 0;
        const pulse = Math.sin(frame * 0.02 + p.phase) * 0.35 + 0.65;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(180,210,255,${p.o * pulse})`);
        g.addColorStop(1, 'rgba(180,210,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,230,255,${p.o * pulse * 1.8})`; ctx.fill();
      });
      // Lines between nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 80) { ctx.strokeStyle = `rgba(147,197,253,${(1 - d / 80) * 0.07})`; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  /* ── SCROLL REVEAL ── */
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setRevealed(p => ({ ...p, [e.target.dataset.reveal]: true }));
    }), { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── COUNTERS ── */
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !countersOn) {
        setCountersOn(true);
        const run = (key, target, dur = 2000) => {
          const s = performance.now();
          const step = now => {
            const p = Math.min((now - s) / dur, 1);
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
            setCounts(c => ({ ...c, [key]: v }));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        };
        run('a', 190); run('b', 25); run('c', 947, 2600);
      }
    }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [countersOn]);

  const rv = (key, delay = 0) => ({
    opacity: revealed[key] ? 1 : 0,
    transform: revealed[key] ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.9s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${delay}s cubic-bezier(0.22,1,0.36,1)`
  });

  const sc = demoScore >= 71 ? '#4ade80' : demoScore >= 41 ? '#facc15' : '#f87171';
  const sl = demoScore >= 71 ? 'Low Risk' : demoScore >= 41 ? 'Moderate' : 'High Risk';

  // Individual coin definitions — spread across ENTIRE screen
  const COINS = [
    // TOP ROW
    { id:'c1', top:'4%',  left:'3%',   size:90,  rot:-25, dur:8,  delay:0,   label:'₹',  sub:'INDIA', color:'#bfdbfe' },
    { id:'c2', top:'2%',  left:'22%',  size:70,  rot:15,  dur:10, delay:1.2, label:'AI', sub:'',      color:'#93c5fd' },
    { id:'c3', top:'6%',  left:'48%',  size:110, rot:-10, dur:9,  delay:0.5, label:'₹',  sub:'2024',  color:'#dbeafe' },
    { id:'c4', top:'3%',  left:'70%',  size:75,  rot:20,  dur:11, delay:2,   label:'UPI',sub:'',      color:'#bfdbfe' },
    { id:'c5', top:'1%',  left:'88%',  size:95,  rot:-30, dur:7.5,delay:0.8, label:'₹',  sub:'INDIA', color:'#93c5fd' },
    // MIDDLE ROW
    { id:'c6', top:'35%', left:'0%',   size:80,  rot:10,  dur:9.5,delay:1.5, label:'KYC',sub:'',      color:'#bfdbfe' },
    { id:'c7', top:'30%', left:'18%',  size:60,  rot:-18, dur:12, delay:0.3, label:'₹',  sub:'',      color:'#dbeafe' },
    { id:'c8', top:'42%', left:'38%',  size:130, rot:5,   dur:8.5,delay:0,   label:'₹',  sub:'INDIA', color:'#eff6ff' },
    { id:'c9', top:'28%', left:'60%',  size:85,  rot:-22, dur:10, delay:1.8, label:'ML', sub:'',      color:'#93c5fd' },
    { id:'c10',top:'38%', left:'80%',  size:68,  rot:28,  dur:9,  delay:0.6, label:'₹',  sub:'2024',  color:'#bfdbfe' },
    { id:'c11',top:'25%', left:'93%',  size:78,  rot:-12, dur:11, delay:2.2, label:'AA', sub:'',      color:'#dbeafe' },
    // BOTTOM ROW
    { id:'c12',top:'65%', left:'5%',   size:72,  rot:18,  dur:10, delay:1.1, label:'₹',  sub:'INDIA', color:'#93c5fd' },
    { id:'c13',top:'70%', left:'25%',  size:88,  rot:-8,  dur:8,  delay:2.5, label:'UPI',sub:'',      color:'#bfdbfe' },
    { id:'c14',top:'72%', left:'52%',  size:64,  rot:22,  dur:12, delay:0.4, label:'₹',  sub:'2024',  color:'#dbeafe' },
    { id:'c15',top:'68%', left:'72%',  size:100, rot:-35, dur:9.5,delay:1.6, label:'AI', sub:'',      color:'#bfdbfe' },
    { id:'c16',top:'75%', left:'90%',  size:76,  rot:14,  dur:11, delay:0.9, label:'₹',  sub:'INDIA', color:'#93c5fd' },
  ];

  return (
    <div id="home" style={{ fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(59,130,246,0.35); color: #fff; }

        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(3.6rem, 7.5vw, 7.8rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: #fff;
          white-space: pre-line;
        }

        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .label-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(147,197,253,0.75);
          display: block;
        }

        .body-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 400;
          line-height: 1.8;
          color: rgba(255,255,255,0.42);
        }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 13px;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #fff; padding: 15px 38px;
          border-radius: 8px; border: none; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 0 rgba(59,130,246,0);
          position: relative; overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 36px rgba(59,130,246,0.55), 0 8px 24px rgba(0,0,0,0.35);
        }

        .btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 13px;
          letter-spacing: 0.05em;
          background: transparent;
          color: rgba(255,255,255,0.65);
          padding: 14px 36px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(147,197,253,0.45);
          color: #fff; transform: translateY(-2px);
        }

        .fcard {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 36px;
          transition: all 0.45s cubic-bezier(0.22,1,0.36,1);
          cursor: default; position: relative; overflow: hidden;
        }
        .fcard:hover {
          background: rgba(59,130,246,0.06);
          border-color: rgba(59,130,246,0.3);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 40px rgba(59,130,246,0.08);
        }

        .step-btn {
          width: 58px; height: 58px; border-radius: 50%;
          background: #06101e;
          border: 1px solid rgba(59,130,246,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 13px; color: #60a5fa;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          cursor: default; position: relative; z-index: 1;
        }
        .step-btn.on {
          background: rgba(59,130,246,0.14);
          border-color: #3b82f6;
          box-shadow: 0 0 0 8px rgba(59,130,246,0.08), 0 0 28px rgba(59,130,246,0.35);
          color: #93c5fd;
        }

        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(var(--rot))} 50%{transform:translateY(-22px) rotate(calc(var(--rot) + 3deg))} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(var(--rot))} 40%{transform:translateY(-28px) rotate(calc(var(--rot) - 2deg))} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(var(--rot))} 60%{transform:translateY(-18px) rotate(calc(var(--rot) + 4deg))} }
        @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes marquee { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
        @keyframes glowPulse { 0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.12)} }
        @keyframes scanLine { 0%{top:0;opacity:0.5}100%{top:100%;opacity:0} }
        @keyframes borderGlow { 0%,100%{box-shadow:0 0 0 rgba(59,130,246,0)}50%{box-shadow:0 0 30px rgba(59,130,246,0.12)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }

        .glow-text {
          background: linear-gradient(135deg, #93c5fd, #60a5fa, #3b82f6, #93c5fd);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .scan-line {
          position:absolute; left:0; right:0; height:1.5px;
          background: linear-gradient(90deg,transparent,rgba(147,197,253,0.5),transparent);
          animation: scanLine 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .divider { width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); }
      `}</style>

      {/* ══════════════════════════════════════
          HERO — Coins scattered full-screen
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #0c2254 0%, #071333 35%, #040b1e 65%, #020710 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(24px,5vw,80px)', paddingTop: '100px'
      }}>

        {/* Particle canvas */}
        <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }} />

        {/* Animated spotlight */}
        <div style={{
          position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)',
          width:'120%', height:'75%', pointerEvents:'none', zIndex:0,
          background:`radial-gradient(ellipse 60% 60% at ${50+(mousePos.x-0.5)*10}% ${35+(mousePos.y-0.5)*8}%, rgba(37,99,235,0.22) 0%, transparent 65%)`,
          transition:'background 1s ease'
        }} />

        {/* Grid */}
        <div style={{
          position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
          backgroundImage:'linear-gradient(rgba(59,130,246,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.02) 1px,transparent 1px)',
          backgroundSize:'100px 100px'
        }} />

        {/* ── COINS SPREAD ACROSS FULL SCREEN ── */}
        {COINS.map((coin, idx) => {
          const anim = ['float0','float1','float2'][idx % 3];
          const mx = (mousePos.x - 0.5) * -14;
          const my = (mousePos.y - 0.5) * -10;
          // size-based depth: bigger coins move more
          const depth = coin.size / 130;
          return (
            <div key={coin.id} style={{
              position: 'absolute',
              top: coin.top, left: coin.left,
              width: `${coin.size}px`, height: `${coin.size * 0.38}px`,
              '--rot': `${coin.rot}deg`,
              zIndex: 1,
              transform: `translateX(${mx * depth}px) translateY(${my * depth}px)`,
              transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1)',
              animation: `${anim} ${coin.dur}s ${coin.delay}s ease-in-out infinite`,
              pointerEvents: 'none'
            }}>
              <svg viewBox="0 0 120 46" width="100%" height="100%"
                style={{ overflow:'visible', filter:`drop-shadow(0 8px 22px rgba(59,130,246,0.35)) drop-shadow(0 0 8px rgba(147,197,253,0.18))` }}>
                <defs>
                  <radialGradient id={`cg-${coin.id}`} cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
                    <stop offset="30%" stopColor={coin.color}/>
                    <stop offset="70%" stopColor="#4a7db5"/>
                    <stop offset="100%" stopColor="#1a3a6e"/>
                  </radialGradient>
                  <radialGradient id={`rim-${coin.id}`} cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor={coin.color} stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#0d2448"/>
                  </radialGradient>
                  <filter id={`f-${coin.id}`}>
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
                    <feOffset dy="1" result="offsetBlur"/>
                    <feMerge><feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Rim shadow */}
                <ellipse cx="60" cy="41" rx="56" ry="11" fill="rgba(0,0,30,0.45)"/>
                {/* Coin rim */}
                <ellipse cx="60" cy="38" rx="56" ry="13" fill={`url(#rim-${coin.id})`} opacity="0.85"/>
                {/* Coin face */}
                <ellipse cx="60" cy="22" rx="56" ry="21" fill={`url(#cg-${coin.id})`} filter={`url(#f-${coin.id})`}/>
                {/* Shine arc */}
                <ellipse cx="50" cy="15" rx="28" ry="10" fill="rgba(255,255,255,0.18)" style={{ mixBlendMode:'screen' }}/>
                {/* Inner ring */}
                <ellipse cx="60" cy="22" rx="44" ry="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Label */}
                <text x="60" y="28" fill="#fff" fontSize={coin.label.length > 2 ? '12' : '17'} fontWeight="800"
                  textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                  style={{ filter:'drop-shadow(0 0 3px rgba(147,197,253,0.8))', letterSpacing:'-0.5px' }}>
                  {coin.label}
                </text>
                {coin.sub && (
                  <text x="60" y="38" fill="rgba(255,255,255,0.55)" fontSize="6.5" textAnchor="middle" fontFamily="'DM Sans',sans-serif" letterSpacing="1.5">
                    {coin.sub}
                  </text>
                )}
              </svg>
            </div>
          );
        })}

        {/* Gradient overlay — bottom-left focus for text readability */}
        <div style={{
          position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          background:'linear-gradient(120deg, rgba(4,11,30,0.88) 0%, rgba(4,11,30,0.72) 30%, rgba(4,11,30,0.25) 60%, transparent 85%)'
        }} />

        {/* ── HERO TEXT ── */}
        <div style={{ position:'relative', zIndex:3, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'32px', paddingBottom:'16px' }}>

          {/* Left — big title */}
          <div style={{ flex:'1 1 520px', opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(32px)', transition:'opacity 1.1s 0.15s ease, transform 1.1s 0.15s cubic-bezier(0.22,1,0.36,1)' }}>
            <h1 className="hero-title">
              {typedText}
              {typedText.length < HEADLINE.length && (
                <span style={{ animation:'blink 0.9s step-end infinite', color:'#60a5fa' }}>|</span>
              )}
            </h1>
            <div style={{ display:'flex', gap:'14px', marginTop:'36px', flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={() => setPage('signup')}>Get Your Score Free</button>
              <button className="btn-ghost" onClick={() => setPage('banker-login')}>Bank Portal Access</button>
            </div>
          </div>

          {/* Right — descriptor */}
          <div style={{ maxWidth:'310px', paddingBottom:'8px', opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)', transition:'opacity 1.1s 0.5s ease, transform 1.1s 0.5s cubic-bezier(0.22,1,0.36,1)' }}>
            <p className="body-text" style={{ fontSize:'14px', marginBottom:'24px' }}>
              Harnessing AI precision and deep alternative data analysis — unlocking capital for India's 190 million credit-invisible citizens.
            </p>
            <div style={{ display:'flex', gap:'26px' }}>
              {[{ v:'190M+', l:'Unbanked' }, { v:'94.7%', l:'Accuracy' }, { v:'3 min', l:'Score Time' }].map((s,i) => (
                <div key={i}>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:'700', fontSize:'20px', color:'#93c5fd', margin:'0 0 3px', lineHeight:'1' }}>{s.v}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:'rgba(255,255,255,0.35)', fontWeight:'600', letterSpacing:'0.14em', textTransform:'uppercase', margin:0 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', zIndex:3, textAlign:'center', opacity: heroLoaded ? 0.45 : 0, transition:'opacity 1s 2s ease', animation:'fadeUp 0.5s 2s ease both' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:'rgba(255,255,255,0.45)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'6px' }}>Scroll</p>
          <div style={{ width:'1px', height:'28px', background:'linear-gradient(to bottom,rgba(147,197,253,0.6),transparent)', margin:'0 auto' }} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
      ══════════════════════════════════════ */}
      <div style={{ background:'#030810', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'15px 0', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'100px', background:'linear-gradient(to right,#030810,transparent)', zIndex:2 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'100px', background:'linear-gradient(to left,#030810,transparent)', zIndex:2 }} />
        <div style={{ display:'flex', animation:'marquee 26s linear infinite', width:'max-content' }}>
          {[...Array(3)].map((_,rep) =>
            [
              { v:'190M+', l:'Credit-Invisible Indians' }, { v:'0–100', l:'Score Range' },
              { v:'< 3 Min', l:'Generation Time' }, { v:'25+', l:'AI Features' },
              { v:'12+', l:'Partner Lenders' }, { v:'94.7%', l:'ML Accuracy' },
              { v:'3 Tiers', l:'Risk Classification' }, { v:'₹42L Cr', l:'Credit Gap Addressed' }
            ].map((item,i) => (
              <div key={`${rep}-${i}`} style={{ display:'flex', alignItems:'center', gap:'22px', padding:'0 44px', borderRight:'1px solid rgba(255,255,255,0.05)', whiteSpace:'nowrap' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:'700', fontSize:'15px', color:'#60a5fa' }}>{item.v}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(255,255,255,0.28)', fontWeight:'600', letterSpacing:'0.12em', textTransform:'uppercase' }}>{item.l}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATS — Animated Counters
      ══════════════════════════════════════ */}
      <section ref={statsRef} style={{ background:'#04080f', padding:'clamp(72px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div data-reveal="sh" style={{ ...rv('sh'), marginBottom:'64px' }}>
            <span className="label-tag" style={{ marginBottom:'16px' }}>The Problem We Solve</span>
            <h2 className="section-title">Traditional credit is broken<br /><span className="glow-text">for most Indians.</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'2px', background:'rgba(255,255,255,0.04)', borderRadius:'20px', overflow:'hidden' }}>
            {[
              { k:'a', val:`${counts.a}M+`, lbl:'Credit-Invisible Indians', desc:'Have no traditional credit history, yet earn consistently and repay responsibly.', col:'#f87171', delay:0 },
              { k:'b', val:`${counts.b}+`, lbl:'AI Features Analyzed', desc:'Per applicant — from UPI flows to GitHub commits, gig invoices to certifications.', col:'#facc15', delay:0.1 },
              { k:'c', val:`${counts.c / 10}%`, lbl:'ML Model Accuracy', desc:'Our ensemble model correctly predicts repayment probability across all risk tiers.', col:'#4ade80', delay:0.2 }
            ].map((s,i) => (
              <div key={i} data-reveal={`s${i}`} style={{ ...rv(`s${i}`, s.delay), background:'#060d1c', padding:'48px 40px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:s.col, boxShadow:`0 0 14px ${s.col}`, opacity:0.7 }} />
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'90px', background:`linear-gradient(to bottom,${s.col}07,transparent)` }} />
                <span className="label-tag" style={{ color:`${s.col}cc`, marginBottom:'14px' }}>{s.lbl}</span>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:'900', fontSize:'clamp(3.2rem,5vw,5rem)', color:s.col, lineHeight:'1', textShadow:`0 0 40px ${s.col}45`, marginBottom:'14px' }}>{s.val}</div>
                <p className="body-text" style={{ fontSize:'13px', maxWidth:'260px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════════════════════════════
          FEATURES BENTO
      ══════════════════════════════════════ */}
      <section id="features" style={{ background:'#060d1c', padding:'clamp(72px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div data-reveal="fh" style={{ ...rv('fh'), display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'24px', marginBottom:'52px' }}>
            <div>
              <span className="label-tag" style={{ marginBottom:'16px' }}>Platform Capabilities</span>
              <h2 className="section-title">Built for the<br /><span className="glow-text">new credit era.</span></h2>
            </div>
            <p className="body-text" style={{ maxWidth:'340px', fontSize:'14px' }}>Our modular algorithm maps economic capacity through signals no traditional bureau can see.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:'14px' }}>
            {/* Hero wide card */}
            <div data-reveal="f0" className="fcard" style={{ ...rv('f0'), gridColumn:'span 7', background:'linear-gradient(135deg,rgba(37,99,235,0.09) 0%,rgba(29,78,216,0.04) 100%)', borderColor:'rgba(59,130,246,0.18)' }}>
              <div style={{ width:'50px', height:'50px', borderRadius:'14px', background:'rgba(59,130,246,0.13)', border:'1px solid rgba(59,130,246,0.28)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
                <svg width="22" height="22" fill="none" stroke="#60a5fa" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:'700', fontSize:'22px', color:'#fff', marginBottom:'12px', letterSpacing:'-0.01em' }}>UPI Transaction Intelligence</h3>
              <p className="body-text" style={{ fontSize:'14px', maxWidth:'400px', marginBottom:'24px' }}>Scans 6 months of UPI history — inflow-outflow consistency, merchant diversity, recency — building a digital solvency fingerprint no traditional bureau can replicate.</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {['Inflow Mapping','Outflow Patterns','Merchant Diversity','Consistency Score'].map((tag,i) => (
                  <span key={i} style={{ padding:'5px 14px', borderRadius:'999px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:'600', color:'#93c5fd', letterSpacing:'0.05em' }}>{tag}</span>
                ))}
              </div>
            </div>
            {/* Small cards */}
            {[
              { key:'f1', col:5, stroke:'#a78bfa', bg:'rgba(167,139,250,0.1)', bd:'rgba(167,139,250,0.2)', title:'Skill Credibility Index', body:'Verifies GitHub repos, freelancing credentials, and certificates — quantifying earning capacity beyond payslips.', icon:<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/> },
              { key:'f2', col:4, stroke:'#4ade80', bg:'rgba(74,222,128,0.08)', bd:'rgba(74,222,128,0.2)', title:'Real-Time 0–100 Score', body:'25+ behavioral metrics consolidated into a single living credibility score, updated as your profile evolves.', icon:<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/> },
              { key:'f3', col:4, stroke:'#fbbf24', bg:'rgba(251,191,36,0.08)', bd:'rgba(251,191,36,0.2)', title:'AI Risk Classification', body:'ML ensemble tiers applicants into Low / Moderate / High risk, matching each to optimal micro-credit products.', icon:<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/> },
              { key:'f4', col:4, stroke:'#818cf8', bg:'rgba(99,102,241,0.1)', bd:'rgba(99,102,241,0.2)', title:'Explainable AI (XAI)', body:'Glass-box transparency with multilingual AI avatar — explains your score in Hindi, Telugu & English.', icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></> }
            ].map(c => (
              <div key={c.key} data-reveal={c.key} className="fcard" style={{ ...rv(c.key), gridColumn:`span ${c.col}` }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:c.bg, border:`1px solid ${c.bd}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'18px' }}>
                  <svg width="20" height="20" fill="none" stroke={c.stroke} strokeWidth="1.8" viewBox="0 0 24 24">{c.icon}</svg>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:'700', fontSize:'17px', color:'#fff', marginBottom:'10px', letterSpacing:'-0.01em' }}>{c.title}</h3>
                <p className="body-text" style={{ fontSize:'13px' }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════════════════════════════
          LIVE SCORE DEMO
      ══════════════════════════════════════ */}
      <section style={{ background:'#04080f', padding:'clamp(72px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'64px', alignItems:'center' }}>
          <div data-reveal="dl" style={rv('dl')}>
            <span className="label-tag" style={{ marginBottom:'20px' }}>The Advantage</span>
            <h2 className="section-title" style={{ marginBottom:'20px' }}>Test the algorithm.<br /><span className="glow-text">Live.</span></h2>
            <p className="body-text" style={{ marginBottom:'36px' }}>Drag the slider. Watch risk tier, sub-metrics, and glow transition in real-time — exactly as Samridhi's engine works for live applicants.</p>
            <button className="btn-primary" onClick={() => setPage('signup')}>Build Your Real Profile</button>
          </div>
          <div data-reveal="dr" style={{ ...rv('dr', 0.18), background:'rgba(255,255,255,0.025)', border:`1px solid ${sc}30`, borderRadius:'22px', padding:'40px', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden', boxShadow:`0 0 60px ${sc}0a`, transition:'border-color 0.5s, box-shadow 0.5s, opacity 0.9s, transform 0.9s' }}>
            <div className="scan-line" />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
              <div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:'700', color:'rgba(255,255,255,0.28)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'4px' }}>Live Score Simulator</p>
                <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:'600', fontSize:'16px', color:'#fff', fontStyle:'italic' }}>Drag to simulate</p>
              </div>
              <span style={{ padding:'5px 14px', borderRadius:'7px', background:`${sc}18`, border:`1px solid ${sc}35`, fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:'700', color:sc, letterSpacing:'0.12em', textTransform:'uppercase', transition:'all 0.5s' }}>{sl}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'28px' }}>
              <CircularGauge score={demoScore} size={168} />
            </div>
            <input type="range" min="10" max="99" value={demoScore} onChange={e => setDemoScore(+e.target.value)} style={{ width:'100%', accentColor:sc, cursor:'pointer', marginBottom:'10px' }} />
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'26px' }}>
              {[['#f87171','High'],['#facc15','Mid'],['#4ade80','Low']].map(([c,l]) => (
                <span key={l} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'9px', fontWeight:'700', color:c, letterSpacing:'0.1em' }}>{l}</span>
              ))}
            </div>
            {[
              { l:'UPI Consistency', v: Math.round(demoScore * 0.9), c:'#60a5fa' },
              { l:'Skill Verification', v: Math.round(demoScore * 0.76), c:'#a78bfa' },
              { l:'Statement Score', v: Math.round(demoScore * 0.85), c:'#4ade80' },
            ].map((m,i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '14px' : 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(255,255,255,0.4)', fontWeight:'500' }}>{m.l}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:m.c, fontWeight:'700' }}>{m.v}/100</span>
                </div>
                <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'3px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${m.v}%`, background:`linear-gradient(90deg,${m.c}70,${m.c})`, borderRadius:'3px', transition:'width 0.6s cubic-bezier(0.22,1,0.36,1)', boxShadow:`0 0 10px ${m.c}50` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ background:'#060d1c', padding:'clamp(72px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div data-reveal="steph" style={{ ...rv('steph'), marginBottom:'72px' }}>
            <span className="label-tag" style={{ marginBottom:'16px' }}>AI Pipeline</span>
            <h2 className="section-title">From data to capital<br /><span className="glow-text">in under 3 minutes.</span></h2>
          </div>
          <div style={{ position:'relative' }}>
            <div className="hidden lg:block" style={{ position:'absolute', top:'29px', left:'9%', right:'9%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.3) 20%,rgba(147,197,253,0.3) 80%,transparent)' }}>
              <div style={{ position:'absolute', top:'-1px', left:0, width: activeStep !== null ? `${(activeStep + 1) * 22}%` : '0%', height:'3px', background:'linear-gradient(90deg,#3b82f6,#93c5fd)', boxShadow:'0 0 12px rgba(59,130,246,0.7)', transition:'width 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'24px', position:'relative', zIndex:1 }}>
              {[
                { n:'01', t:'Data Collection', d:'Connect UPI logs, GitHub repos, and certifications via RBI-certified Account Aggregator.', delay:0 },
                { n:'02', t:'Preprocessing', d:'Cleans anomalies, structures timelines, categorizes income patterns with data hygiene AI.', delay:0.1 },
                { n:'03', t:'Feature Engineering', d:'Builds 25+ features — cash stability, gig ratings, skill metrics, inventory collateral.', delay:0.2 },
                { n:'04', t:'ML Underwriting', d:'Ensemble scoring models predict trustworthiness from alternate data signals.', delay:0.3 },
                { n:'05', t:'Credit Decision', d:'Matched with micro-loan partners at competitive rates — no branch visit required.', delay:0.4 }
              ].map((st,i) => (
                <div key={i} data-reveal={`step${i}`} style={{ ...rv(`step${i}`, st.delay), display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'20px', cursor:'pointer' }}
                  onMouseEnter={() => setActiveStep(i)} onMouseLeave={() => setActiveStep(null)}>
                  <div className={`step-btn${activeStep === i ? ' on' : ''}`}>{st.n}</div>
                  <div>
                    <h4 style={{ fontFamily:"'Playfair Display',serif", fontWeight:'700', fontSize:'14px', color: activeStep === i ? '#93c5fd' : '#fff', marginBottom:'8px', transition:'color 0.3s' }}>{st.t}</h4>
                    <p className="body-text" style={{ fontSize:'12px' }}>{st.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section style={{ background:'radial-gradient(ellipse 100% 80% at 50% 50%, #0c2254 0%, #04080f 65%)', padding:'clamp(96px,14vw,180px) clamp(24px,5vw,80px)', position:'relative', overflow:'hidden', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'700px', height:'350px', background:'radial-gradient(ellipse,rgba(37,99,235,0.2) 0%,transparent 70%)', pointerEvents:'none', animation:'glowPulse 6s ease-in-out infinite' }} />
        <div data-reveal="cta" style={{ ...rv('cta'), maxWidth:'880px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <span className="label-tag" style={{ marginBottom:'28px' }}>Start Today</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:'900', fontSize:'clamp(3rem,7vw,6.5rem)', lineHeight:'1', letterSpacing:'-0.025em', color:'#fff', marginBottom:'24px' }}>
            Unlock capital<br /><span className="glow-text">without a credit file.</span>
          </h2>
          <p className="body-text" style={{ fontSize:'16px', maxWidth:'480px', margin:'0 auto 48px' }}>
            Connect your accounts, score your skills, and check loan eligibility in under five minutes. No CIBIL score needed.
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={() => setPage('signup')}>Create Free Account</button>
            <button className="btn-ghost" onClick={() => setPage('signin')}>Sign In</button>
          </div>
        </div>
      </section>

    </div>
  );
};
