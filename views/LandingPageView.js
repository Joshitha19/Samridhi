// Landing Page — Samridhi
// Full interactive: scroll reveals, mouse parallax, canvas particles,
// animated counters, 3D tilt cards, typewriter, glowing ticker

window.LandingPageView = ({ setPage, scrollToSection }) => {
  const { useState, useEffect, useRef, useCallback } = React;

  /* ── STATE ── */
  const [demoScore, setDemoScore] = useState(72);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroVisible, setHeroVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [countersTriggered, setCountersTriggered] = useState(false);
  const [counters, setCounters] = useState({ a: 0, b: 0, c: 0 });
  const [revealedSections, setRevealedSections] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const coinsRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const FULL_HEADLINE = 'The apex of\nalternative credit\nintelligence.';

  /* ── TYPEWRITER ── */
  useEffect(() => {
    let i = 0;
    setHeroVisible(true);
    const interval = setInterval(() => {
      setTypedText(FULL_HEADLINE.slice(0, i));
      i++;
      if (i > FULL_HEADLINE.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, []);

  /* ── MOUSE TRACKING ── */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── CANVAS PARTICLES ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.4 - 0.1,
        r: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.55 + 0.08,
        hue: 200 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach(p => {
        // Mouse attraction (subtle)
        const dx = mx * canvas.width - p.x;
        const dy = my * canvas.height - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += dx / dist * 0.008;
          p.vy += dy / dist * 0.008;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const pulse = (Math.sin(frame * 0.018 + p.phase) + 1) * 0.4 + 0.2;

        // Draw glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `hsla(${p.hue},90%,80%,${p.opacity * pulse})`);
        grad.addColorStop(1, `hsla(${p.hue},90%,80%,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,90%,${p.opacity * pulse * 1.5})`;
        ctx.fill();
      });

      // Connection lines between near particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i], b = particlesRef.current[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147,197,253,${(1 - d / 90) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── INTERSECTION OBSERVER ── */
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.reveal;
          setRevealedSections(prev => ({ ...prev, [key]: true }));
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── ANIMATED COUNTERS ── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !countersTriggered) {
        setCountersTriggered(true);
        const animate = (key, target, duration = 2200) => {
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            setCounters(prev => ({ ...prev, [key]: Math.round(ease * target) }));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        };
        animate('a', 190);
        animate('b', 25);
        animate('c', 947, 2800);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [countersTriggered]);

  /* ── HELPERS ── */
  const revealStyle = (key, delay = 0) => ({
    opacity: revealedSections[key] ? 1 : 0,
    transform: revealedSections[key] ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1)`
  });

  const scoreColor = demoScore >= 71 ? '#4ade80' : demoScore >= 41 ? '#facc15' : '#f87171';
  const scoreLabel = demoScore >= 71 ? 'Low Risk' : demoScore >= 41 ? 'Moderate' : 'High Risk';

  // 3D tilt on card hover
  const tiltStyle = (cardId) => {
    if (hoveredCard !== cardId) return {};
    const dx = (mousePos.x - 0.5) * 12;
    const dy = (mousePos.y - 0.5) * 12;
    return {
      transform: `perspective(600px) rotateX(${-dy}deg) rotateY(${dx}deg) scale(1.025)`,
      boxShadow: `${-dx}px ${-dy}px 40px rgba(59,130,246,0.15)`
    };
  };

  return (
    <div id="home" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", overflowX: 'hidden' }}>

      {/* ══ FONTS + GLOBAL STYLES ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        ::selection { background: rgba(59,130,246,0.35); color: #fff; }

        @keyframes coinSpin {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); }
          25%  { transform: translateY(-22px) rotate(1.8deg) scale(1.02); }
          75%  { transform: translateY(-10px) rotate(-1.2deg) scale(0.99); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }
        @keyframes coinSpin2 {
          0%   { transform: translateY(0px) rotate(0deg); }
          40%  { transform: translateY(-28px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes coinOrbit {
          0%   { transform: rotate(0deg) translateX(18px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(59,130,246,0.15); }
          50% { border-color: rgba(59,130,246,0.45); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .samr-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(3.6rem, 7.5vw, 7.5rem);
          line-height: 0.94;
          letter-spacing: -0.035em;
          color: #fff;
          white-space: pre-line;
        }

        .samr-section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 4vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
        }

        .samr-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(147,197,253,0.75);
        }

        .samr-body {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.42);
          line-height: 1.8;
        }

        .samr-btn-primary {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          background-size: 200% 200%;
          color: #fff; padding: 15px 38px;
          border-radius: 7px; border: none; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 0 0 rgba(59,130,246,0.4);
          position: relative; overflow: hidden;
        }
        .samr-btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .samr-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(59,130,246,0.55), 0 8px 24px rgba(0,0,0,0.3);
        }
        .samr-btn-primary:hover::after { opacity: 1; }
        .samr-btn-primary:active { transform: translateY(0); }

        .samr-btn-ghost {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: transparent; color: rgba(255,255,255,0.6);
          padding: 14px 36px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.18);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .samr-btn-ghost:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(147,197,253,0.45);
          color: #fff;
          transform: translateY(-2px);
        }

        .feature-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 36px;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          cursor: default; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 18px;
          background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.5s;
        }
        .feature-card:hover {
          background: rgba(59,130,246,0.06);
          border-color: rgba(59,130,246,0.28);
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 24px 60px rgba(0,0,0,0.3), 0 0 40px rgba(59,130,246,0.1);
        }
        .feature-card:hover::before { opacity: 1; }

        .step-circle {
          width: 58px; height: 58px; border-radius: 50%;
          background: #080f20;
          border: 1px solid rgba(59,130,246,0.22);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
          color: #60a5fa; transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
          cursor: default; position: relative; z-index: 1;
        }
        .step-circle.active {
          background: rgba(59,130,246,0.15);
          border-color: #3b82f6;
          box-shadow: 0 0 0 8px rgba(59,130,246,0.08), 0 0 30px rgba(59,130,246,0.35);
          color: #93c5fd;
        }

        .score-ring {
          transition: stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1),
                      stroke 0.6s ease;
        }

        .ticker-item { white-space: nowrap; }

        .glow-text {
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .scan-overlay {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(147,197,253,0.6), transparent);
          animation: scanLine 3.5s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: 'linear-gradient(170deg, #04080f 0%, #071428 30%, #0d2348 55%, #071428 75%, #04080f 100%)',
        display: 'flex', flexDirection: 'column'
      }}>

        {/* Animated Canvas */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0
        }} />

        {/* Animated background gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(ellipse 70% 55% at ${50 + (mousePos.x - 0.5) * 8}% ${30 + (mousePos.y - 0.5) * 6}%, rgba(37,99,235,0.18) 0%, transparent 65%)`,
          transition: 'background 0.8s ease'
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)`,
          backgroundSize: '90px 90px'
        }} />

        {/* COINS — center, parallax on mouse */}
        <div ref={coinsRef} style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 1,
          transform: `translate(calc(-50% + ${(mousePos.x - 0.5) * -28}px), calc(-58% + ${(mousePos.y - 0.5) * -18}px))`,
          transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: 'none',
          width: 'clamp(300px, 52vw, 640px)'
        }}>
          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '140%', height: '140%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)',
            animation: 'glowPulse 5s ease-in-out infinite'
          }} />

          {/* Main coin image */}
          <img
            src="assets/hero_coins.png"
            alt="3D Rupee Coins"
            style={{
              width: '100%', height: 'auto',
              animation: 'coinSpin 9s ease-in-out infinite',
              filter: 'drop-shadow(0 24px 80px rgba(37,99,235,0.45)) drop-shadow(0 0 40px rgba(147,197,253,0.2)) brightness(1.08)',
              objectFit: 'contain'
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />

          {/* Fallback SVG coins if image fails */}
          <svg viewBox="0 0 420 380" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none'
          }}>
            <defs>
              <radialGradient id="cg1" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#dbeafe"/>
                <stop offset="50%" stopColor="#93c5fd"/>
                <stop offset="100%" stopColor="#1d4ed8"/>
              </radialGradient>
              <radialGradient id="cg2" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#e2e8f0"/>
                <stop offset="50%" stopColor="#94a3b8"/>
                <stop offset="100%" stopColor="#334155"/>
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Big center coin */}
            <g style={{ animation: 'coinSpin2 8s ease-in-out infinite' }}>
              <ellipse cx="210" cy="230" rx="88" ry="34" fill="#1e3a5f" opacity="0.6"/>
              <ellipse cx="210" cy="210" rx="88" ry="34" fill="url(#cg1)" filter="url(#glow)"/>
              <ellipse cx="210" cy="210" rx="72" ry="27" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <text x="210" y="218" fill="#fff" fontSize="26" fontWeight="900" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 4px #60a5fa)' }}>₹</text>
            </g>
            {/* Top-left coin */}
            <g style={{ animation: 'coinSpin 12s ease-in-out infinite', transformOrigin: '120px 130px' }}>
              <ellipse cx="120" cy="148" rx="52" ry="20" fill="#0f2040" opacity="0.7"/>
              <ellipse cx="120" cy="130" rx="52" ry="20" fill="url(#cg2)" filter="url(#glow)"/>
              <text x="120" y="137" fill="#93c5fd" fontSize="15" fontWeight="800" textAnchor="middle">AI</text>
            </g>
            {/* Top-right coin */}
            <g style={{ animation: 'coinSpin 10s 1.5s ease-in-out infinite', transformOrigin: '310px 115px' }}>
              <ellipse cx="310" cy="133" rx="58" ry="22" fill="#0f2040" opacity="0.6"/>
              <ellipse cx="310" cy="115" rx="58" ry="22" fill="url(#cg1)" filter="url(#glow)"/>
              <text x="310" y="122" fill="#fff" fontSize="17" fontWeight="800" textAnchor="middle">UPI</text>
            </g>
            {/* Bottom-left coin */}
            <g style={{ animation: 'coinSpin2 11s 0.8s ease-in-out infinite', transformOrigin: '100px 320px' }}>
              <ellipse cx="100" cy="338" rx="44" ry="17" fill="#0f2040" opacity="0.6"/>
              <ellipse cx="100" cy="320" rx="44" ry="17" fill="url(#cg2)" filter="url(#glow)"/>
              <text x="100" y="327" fill="#e2e8f0" fontSize="13" fontWeight="800" textAnchor="middle">KYC</text>
            </g>
            {/* Bottom-right coin */}
            <g style={{ animation: 'coinSpin 13s 2s ease-in-out infinite', transformOrigin: '330px 300px' }}>
              <ellipse cx="330" cy="318" rx="50" ry="19" fill="#0f2040" opacity="0.6"/>
              <ellipse cx="330" cy="300" rx="50" ry="19" fill="url(#cg1)" filter="url(#glow)"/>
              <text x="330" y="307" fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle">ML</text>
            </g>
          </svg>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '62%', zIndex: 2,
          background: 'linear-gradient(to bottom, transparent, rgba(4,8,15,0.65) 45%, #04080f 82%)',
          pointerEvents: 'none'
        }} />

        {/* Hero text — bottom layout like reference */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          padding: 'clamp(28px, 5vw, 72px)',
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px'
        }}>
          {/* Left — big type */}
          <div style={{
            flex: '1 1 500px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s 0.2s ease, transform 1s 0.2s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <h1 className="samr-title">
              {typedText}
              <span style={{ animation: 'blink 0.9s step-end infinite', color: '#60a5fa' }}>
                {typedText.length < FULL_HEADLINE.length ? '|' : ''}
              </span>
            </h1>
            <div style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap' }}>
              <button className="samr-btn-primary" onClick={() => setPage('signup')}>
                Get Your Score Free
              </button>
              <button className="samr-btn-ghost" onClick={() => setPage('banker-login')}>
                Bank Portal
              </button>
            </div>
          </div>

          {/* Right — descriptor */}
          <div style={{
            maxWidth: '320px', paddingBottom: '8px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s 0.55s ease, transform 1s 0.55s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <p className="samr-body" style={{ fontSize: '14px', marginBottom: '24px' }}>
              Harnessing AI precision and deep alternative data analysis — unlocking capital for India's 190 million credit-invisible citizens.
            </p>
            <div style={{ display: 'flex', gap: '28px' }}>
              {[
                { val: '190M+', lbl: 'Unbanked' },
                { val: '94.7%', lbl: 'Accuracy' },
                { val: '3 min', lbl: 'Score Time' }
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '19px', color: '#93c5fd', margin: '0 0 3px', lineHeight: '1' }}>{s.val}</p>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          opacity: heroVisible ? 0.5 : 0, transition: 'opacity 1s 1.5s ease',
          animation: 'float 2.5s ease-in-out infinite'
        }}>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</p>
          <svg width="16" height="24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" viewBox="0 0 16 24">
            <rect x="1" y="1" width="14" height="22" rx="7" />
            <circle cx="8" cy="7" r="2" fill="rgba(255,255,255,0.4)" style={{ animation: 'float 2s ease-in-out infinite' }} />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ANIMATED TICKER
      ══════════════════════════════════════════ */}
      <div style={{
        background: '#030810',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '15px 0', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, #030810, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to left, #030810, transparent)', zIndex: 2 }} />
        <div style={{ display: 'flex', animation: 'marquee 26s linear infinite', width: 'max-content' }}>
          {[...Array(3)].map((_, rep) =>
            [
              { v: '190M+', l: 'Credit-Invisible Indians' }, { v: '0–100', l: 'Score Range' },
              { v: '< 3 Min', l: 'Generation Time' }, { v: '25+', l: 'AI Features' },
              { v: '12+', l: 'Partner Lenders' }, { v: '94.7%', l: 'ML Accuracy' },
              { v: '3 Tiers', l: 'Risk Classification' }, { v: '₹42L Cr', l: 'Credit Gap Addressed' }
            ].map((item, i) => (
              <div key={`${rep}-${i}`} className="ticker-item" style={{
                display: 'flex', alignItems: 'center', gap: '24px',
                padding: '0 44px', borderRight: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '14px', color: '#60a5fa' }}>{item.v}</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '10px', color: 'rgba(255,255,255,0.28)', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.l}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ANIMATED STATS SECTION
      ══════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#04080f', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <div data-reveal="stats-head" style={{ ...revealStyle('stats-head'), marginBottom: '64px' }}>
            <p className="samr-label" style={{ marginBottom: '16px' }}>The Problem We Solve</p>
            <h2 className="samr-section-title">
              Traditional credit is broken<br />
              <span className="glow-text">for most Indians.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { key: 'a', display: `${counters.a}M+`, label: 'Credit-Invisible Indians', desc: 'Have no traditional credit history, yet earn consistently and repay responsibly.', color: '#f87171', delay: 0 },
              { key: 'b', display: `${counters.b}+`, label: 'Alternative AI Features', desc: 'Analyzed per applicant — from UPI flows to GitHub commits, gig invoices to certifications.', color: '#facc15', delay: 0.1 },
              { key: 'c', display: `${counters.c / 10}%`, label: 'ML Model Accuracy', desc: 'Our ensemble model correctly predicts repayment probability across all risk segments.', color: '#4ade80', delay: 0.2 }
            ].map((stat, i) => (
              <div key={i} data-reveal={`stat-${i}`}
                style={{
                  ...revealStyle(`stat-${i}`, stat.delay),
                  background: '#060d1c', padding: '48px 40px',
                  position: 'relative', overflow: 'hidden', cursor: 'default'
                }}>
                {/* Animated border top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.color, boxShadow: `0 0 16px ${stat.color}`, opacity: 0.7 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to bottom, ${stat.color}06, transparent)` }} />
                <span className="samr-label" style={{ color: `${stat.color}cc`, marginBottom: '16px', display: 'block' }}>{stat.label}</span>
                <span style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: '900',
                  fontSize: 'clamp(3.5rem,5vw,5rem)', color: stat.color,
                  fontVariantNumeric: 'tabular-nums', display: 'block', lineHeight: '1',
                  textShadow: `0 0 40px ${stat.color}50`, marginBottom: '16px'
                }}>{stat.display}</span>
                <p className="samr-body" style={{ fontSize: '13px', maxWidth: '260px' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES BENTO GRID
      ══════════════════════════════════════════ */}
      <section id="features" style={{ background: '#060d1c', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <div data-reveal="feat-head" style={{ ...revealStyle('feat-head'), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
            <div>
              <p className="samr-label" style={{ marginBottom: '16px' }}>Platform Capabilities</p>
              <h2 className="samr-section-title">Built for the<br /><span className="glow-text">new credit era.</span></h2>
            </div>
            <p className="samr-body" style={{ maxWidth: '340px', fontSize: '14px' }}>
              Our modular algorithm maps economic capacity through signals no traditional bureau can see.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px' }}>

            {/* Hero card — wide */}
            <div data-reveal="feat-0" className="feature-card" style={{
              ...revealStyle('feat-0'),
              gridColumn: 'span 7',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(29,78,216,0.05) 100%)',
              borderColor: 'rgba(59,130,246,0.18)',
              animation: 'borderGlow 4s ease-in-out infinite'
            }}
              onMouseEnter={() => setHoveredCard('f0')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ ...revealStyle('feat-0'), gridColumn: 'span 7', ...tiltStyle('f0') }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(59,130,246,0.14)', border: '1px solid rgba(59,130,246,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', transition: 'all 0.3s' }}>
                <svg width="22" height="22" fill="none" stroke="#60a5fa" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '22px', color: '#fff', marginBottom: '12px', letterSpacing: '-0.01em' }}>UPI Transaction Intelligence</h3>
              <p className="samr-body" style={{ fontSize: '14px', maxWidth: '400px', marginBottom: '24px' }}>
                Scans 6 months of UPI history — inflow-outflow consistency, merchant diversity, recency — building a digital solvency fingerprint no traditional bureau can replicate.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Inflow Mapping', 'Outflow Patterns', 'Merchant Diversity', 'Consistency Score'].map((tag, i) => (
                  <span key={i} style={{ padding: '5px 14px', borderRadius: '999px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', fontFamily: "'Space Grotesk',sans-serif", fontSize: '11px', fontWeight: '600', color: '#93c5fd', letterSpacing: '0.05em', transition: 'all 0.3s' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            {[
              { id: 'f1', col: 5, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, stroke: '#a78bfa', bg: 'rgba(167,139,250,0.1)', bdr: 'rgba(167,139,250,0.2)', title: 'Skill Credibility Index', body: 'Verifies GitHub repos, freelancing credentials, and certificates — quantifying earning capacity no payslip can show.', key: 'feat-1' },
              { id: 'f2', col: 4, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, stroke: '#4ade80', bg: 'rgba(74,222,128,0.08)', bdr: 'rgba(74,222,128,0.2)', title: 'Real-Time 0–100 Score', body: '25+ behavioral metrics consolidated into a single living credibility score — updated as your profile evolves.', key: 'feat-2' },
              { id: 'f3', col: 4, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />, stroke: '#fbbf24', bg: 'rgba(251,191,36,0.08)', bdr: 'rgba(251,191,36,0.2)', title: 'AI Risk Classification', body: 'ML ensemble tiers applicants — Low / Moderate / High — matching each to optimal micro-credit products instantly.', key: 'feat-3' },
              { id: 'f4', col: 4, icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>, stroke: '#818cf8', bg: 'rgba(99,102,241,0.1)', bdr: 'rgba(99,102,241,0.2)', title: 'Explainable AI (XAI)', body: 'Glass-box transparency with multilingual AI avatar guidance — explains your score in Hindi, Telugu & English.', key: 'feat-4' }
            ].map(card => (
              <div key={card.id} data-reveal={card.key} className="feature-card"
                style={{ ...revealStyle(card.key), gridColumn: `span ${card.col}` }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, border: `1px solid ${card.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', transition: 'all 0.4s' }}>
                  <svg width="20" height="20" fill="none" stroke={card.stroke} strokeWidth="1.8" viewBox="0 0 24 24">{card.icon}</svg>
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '17px', color: '#fff', marginBottom: '10px', letterSpacing: '-0.01em' }}>{card.title}</h3>
                <p className="samr-body" style={{ fontSize: '13px' }}>{card.body}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LIVE SCORE DEMO
      ══════════════════════════════════════════ */}
      <section style={{ background: '#04080f', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>

          <div data-reveal="demo-left" style={revealStyle('demo-left')}>
            <p className="samr-label" style={{ marginBottom: '20px' }}>The Advantage</p>
            <h2 className="samr-section-title" style={{ marginBottom: '20px' }}>
              Test the algorithm.<br />
              <span className="glow-text">Live.</span>
            </h2>
            <p className="samr-body" style={{ marginBottom: '36px' }}>Drag the slider. Watch how the risk tier, sub-metrics, and color change in real-time — exactly how Samridhi's engine works for real applicants.</p>
            <button className="samr-btn-primary" onClick={() => setPage('signup')}>Build Your Real Profile</button>
          </div>

          <div data-reveal="demo-right" style={{
            ...revealStyle('demo-right', 0.2),
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '22px', padding: '40px',
            backdropFilter: 'blur(16px)',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.5s, box-shadow 0.5s, opacity 0.85s, transform 0.85s',
            borderColor: `${scoreColor}30`,
            boxShadow: `0 0 60px ${scoreColor}12`
          }}>
            <div className="scan-overlay" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Live Score Simulator</p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '15px', color: '#fff' }}>Drag to simulate</p>
              </div>
              <span style={{ padding: '5px 14px', borderRadius: '7px', background: `${scoreColor}18`, border: `1px solid ${scoreColor}35`, fontFamily: "'Space Grotesk',sans-serif", fontSize: '10px', fontWeight: '700', color: scoreColor, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.5s' }}>{scoreLabel}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <CircularGauge score={demoScore} size={170} />
            </div>

            <input type="range" min="10" max="99" value={demoScore}
              onChange={e => setDemoScore(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: scoreColor, cursor: 'pointer', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
              {[['#f87171','HIGH'], ['#facc15','MED'], ['#4ade80','LOW']].map(([c,l]) => (
                <span key={l} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '9px', fontWeight: '700', color: c, letterSpacing: '0.1em' }}>{l}</span>
              ))}
            </div>

            {[
              { l: 'UPI Consistency', v: Math.round(demoScore * 0.9), c: '#60a5fa' },
              { l: 'Skill Verification', v: Math.round(demoScore * 0.76), c: '#a78bfa' },
              { l: 'Statement Score', v: Math.round(demoScore * 0.85), c: '#4ade80' },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '14px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{m.l}</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '11px', color: m.c, fontWeight: '700' }}>{m.v}/100</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.v}%`, background: `linear-gradient(90deg, ${m.c}80, ${m.c})`, borderRadius: '3px', transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 10px ${m.c}50` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Interactive Steps
      ══════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#060d1c', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div data-reveal="steps-head" style={{ ...revealStyle('steps-head'), marginBottom: '72px' }}>
            <p className="samr-label" style={{ marginBottom: '16px' }}>AI Pipeline</p>
            <h2 className="samr-section-title">
              From data to capital<br />
              <span className="glow-text">in under 3 minutes.</span>
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Animated connector */}
            <div className="hidden lg:block" style={{
              position: 'absolute', top: '29px', left: '9%', right: '9%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.35) 20%, rgba(147,197,253,0.35) 80%, transparent)',
              zIndex: 0
            }}>
              <div style={{
                position: 'absolute', top: '-1px', left: 0, width: `${activeStep !== null ? (activeStep + 1) * 22 : 0}%`,
                height: '3px', background: 'linear-gradient(90deg, #3b82f6, #93c5fd)',
                boxShadow: '0 0 12px rgba(59,130,246,0.7)',
                transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)'
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
              {[
                { n: '01', t: 'Data Collection', d: 'Connect UPI logs, GitHub repos, and certifications via RBI-certified Account Aggregator.', delay: 0 },
                { n: '02', t: 'Preprocessing', d: 'Cleans anomalies, structures timelines, categorizes income patterns with data hygiene AI.', delay: 0.1 },
                { n: '03', t: 'Feature Engineering', d: 'Builds 25+ features — cash stability, gig ratings, skill metrics, inventory collateral.', delay: 0.2 },
                { n: '04', t: 'ML Underwriting', d: 'Ensemble scoring models predict trustworthiness from alternate data signals.', delay: 0.3 },
                { n: '05', t: 'Credit Decision', d: 'Matched with micro-loan partners at competitive rates — no branch visit required.', delay: 0.4 }
              ].map((st, i) => (
                <div key={i} data-reveal={`step-${i}`}
                  style={{ ...revealStyle(`step-${i}`, st.delay), display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', cursor: 'pointer' }}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={`step-circle${activeStep === i ? ' active' : ''}`}>
                    {st.n}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '14px', color: activeStep === i ? '#93c5fd' : '#fff', marginBottom: '8px', letterSpacing: '-0.01em', transition: 'color 0.3s' }}>{st.t}</h4>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.65' }}>{st.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST / SECURITY SECTION
      ══════════════════════════════════════════ */}
      <section style={{ background: '#04080f', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '64px', alignItems: 'center' }}>

          <div data-reveal="trust-l" style={revealStyle('trust-l')}>
            <p className="samr-label" style={{ marginBottom: '20px' }}>Trust Infrastructure</p>
            <h2 className="samr-section-title" style={{ marginBottom: '24px' }}>
              Bank-grade security.<br />
              <span className="glow-text">Fintech speed.</span>
            </h2>
            <p className="samr-body" style={{ marginBottom: '36px' }}>
              Samridhi uses Video KYC liveness detection, Aadhaar-grade identity checks, and encrypted Account Aggregator pipelines — the same infrastructure trusted by Zerodha, DigiLocker, and RBI-regulated NBFCs.
            </p>
            {[
              { icon: '🎥', t: 'Video KYC', d: '5-second face scan with anti-spoofing — Zerodha-grade liveness check.' },
              { icon: '🏦', t: 'Account Aggregator', d: 'RBI-certified AA framework for bank statement fetch with your consent.' },
              { icon: '🔐', t: 'AES-256 Encryption', d: 'End-to-end encrypted data vaults. Your data, your control.' }
            ].map((item, i) => (
              <div key={i} data-reveal={`trust-item-${i}`} style={{
                ...revealStyle(`trust-item-${i}`, i * 0.12),
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                marginBottom: i < 2 ? '20px' : 0
              }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{item.t}</p>
                  <p className="samr-body" style={{ fontSize: '12px' }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verification checklist card */}
          <div data-reveal="trust-r" style={{
            ...revealStyle('trust-r', 0.2),
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(74,222,128,0.14)',
            borderRadius: '22px', padding: '40px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 0 60px rgba(74,222,128,0.04)'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div className="scan-overlay" style={{ animationDuration: '4s' }} />

            {[
              'Aadhaar Verified', 'PAN Card Linked', 'UPI Connected',
              'Video KYC Passed', 'Bank Statement Uploaded', 'Credibility Score Generated'
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '13px 0',
                borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: revealedSections['trust-r'] ? 1 : 0,
                transform: revealedSections['trust-r'] ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.6s ${i * 0.1 + 0.3}s ease, transform 0.6s ${i * 0.1 + 0.3}s ease`
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" fill="none" stroke="#4ade80" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.78)', fontWeight: '600' }}>{item}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'Space Grotesk',sans-serif", fontSize: '9px', fontWeight: '800', color: '#4ade80', letterSpacing: '0.12em' }}>DONE</span>
              </div>
            ))}

            <div style={{ marginTop: '24px', padding: '18px', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.16)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>Credibility Score</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: '900', fontSize: '30px', color: '#4ade80', textShadow: '0 0 24px rgba(74,222,128,0.55)' }}>82/100</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA — Cinematic banner
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(170deg, #04080f 0%, #071428 35%, #0d2348 58%, #071428 78%, #04080f 100%)',
        padding: 'clamp(96px,14vw,180px) clamp(24px,5vw,80px)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none', animation: 'glowPulse 6s ease-in-out infinite' }} />

        <div data-reveal="cta" style={{ ...revealStyle('cta'), maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p className="samr-label" style={{ marginBottom: '28px', display: 'block' }}>Start Today</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: 'clamp(3rem,7vw,6.5rem)', lineHeight: '0.94', letterSpacing: '-0.04em', color: '#fff', marginBottom: '28px' }}>
            Unlock capital<br />
            <span className="glow-text">without a credit file.</span>
          </h2>
          <p className="samr-body" style={{ fontSize: '16px', maxWidth: '500px', margin: '0 auto 52px' }}>
            Connect your accounts, score your skills, and check eligibility for micro-loans in under five minutes. No CIBIL score needed.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="samr-btn-primary" onClick={() => setPage('signup')}>
              Create Free Account
            </button>
            <button className="samr-btn-ghost" onClick={() => setPage('signin')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
