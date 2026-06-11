// Landing Page View Component for Samridhi
// Exposes LandingPageView globally
// Redesigned: Bitcoin Trader Dark Wix template inspired layout

window.LandingPageView = ({ setPage, scrollToSection, calculatedScore }) => {
  const { useState, useEffect, useRef } = React;
  const [demoScore, setDemoScore] = useState(72);
  const [tickerPaused, setTickerPaused] = useState(false);

  // Marquee ticker items
  const tickerItems = [
    { label: 'Credit-Invisible Indians', value: '190M+' },
    { label: 'AI Features Scanned', value: '25+' },
    { label: 'Credibility Score Range', value: '0 – 100' },
    { label: 'Risk Categories', value: '3 Tiers' },
    { label: 'Loan Match Accuracy', value: '94.7%' },
    { label: 'Avg Score Boost', value: '+18 pts' },
    { label: 'Processing Time', value: '< 3 Min' },
    { label: 'Partner Lenders', value: '12+' },
  ];

  const scoreColor = demoScore >= 71 ? '#00E676' : demoScore >= 41 ? '#FFD600' : '#FF1744';
  const scoreLabel = demoScore >= 71 ? 'LOW RISK' : demoScore >= 41 ? 'MODERATE' : 'HIGH RISK';
  const scoreBg = demoScore >= 71 ? 'rgba(0,230,118,0.08)' : demoScore >= 41 ? 'rgba(255,214,0,0.08)' : 'rgba(255,23,68,0.08)';

  return (
    <div className="flex-1 flex flex-col animate-fade-in" id="home" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════════════════════════════
          HERO — SPLIT LAYOUT (Left copy | Right widget)
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050507]">

        {/* Background grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)', transform: 'translate(-30%, -20%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', transform: 'translate(20%, 20%)' }} />

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

          {/* LEFT — Copy */}
          <div className="flex flex-col space-y-8">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center space-x-2 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span style={{
                background: 'linear-gradient(90deg, rgba(0,229,255,0.12) 0%, rgba(108,99,255,0.12) 100%)',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: '999px',
                padding: '4px 14px',
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.12em',
                color: '#00E5FF',
                textTransform: 'uppercase'
              }}>
                India's First Alternative Credit OS
              </span>
            </div>

            {/* Main headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: '900',
              lineHeight: '1.06',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              Your skills are<br />
              your <span style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 50%, #00E676 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>credit score.</span>
            </h1>

            {/* Subheading */}
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', maxWidth: '460px', fontWeight: '400' }}>
              Samridhi maps UPI cashflows, skill verifications, and statement diagnostics into an AI-powered credibility index — unlocking capital for India's 190 million credit-invisible citizens.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setPage('signup')}
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 100%)',
                  color: '#050507',
                  fontWeight: '800',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 32px rgba(0,229,255,0.25)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Get Your Score Free
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setPage('banker-login')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: '700',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                Bank Portal Access
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-2">
              {[
                { icon: '🔒', text: 'Aadhaar-grade KYC' },
                { icon: '⚡', text: 'Real-time Score' },
                { icon: '🏦', text: '12+ Lender Network' }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-1.5">
                  <span style={{ fontSize: '13px' }}>{item.icon}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live Score Widget */}
          <div className="flex flex-col items-center justify-center lg:items-end">
            <div style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '380px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(108,99,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              {/* Widget header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Live Score Preview
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Drag to test</p>
                </div>
                <span style={{
                  padding: '4px 10px',
                  background: scoreBg,
                  border: `1px solid ${scoreColor}30`,
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '900',
                  color: scoreColor,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s'
                }}>{scoreLabel}</span>
              </div>

              {/* Gauge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <CircularGauge score={demoScore} size={160} />
              </div>

              {/* Slider */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="range"
                  min="10"
                  max="99"
                  value={demoScore}
                  onChange={e => setDemoScore(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: scoreColor, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '9px', color: '#FF1744', fontWeight: '800' }}>HIGH RISK</span>
                  <span style={{ fontSize: '9px', color: '#FFD600', fontWeight: '800' }}>MODERATE</span>
                  <span style={{ fontSize: '9px', color: '#00E676', fontWeight: '800' }}>LOW RISK</span>
                </div>
              </div>

              {/* Mini metric rows */}
              {[
                { label: 'UPI Consistency', val: Math.round(demoScore * 0.9), color: '#00E5FF' },
                { label: 'Skill Verification', val: Math.round(demoScore * 0.75), color: '#6C63FF' },
                { label: 'Statement Score', val: Math.round(demoScore * 0.85), color: '#00E676' },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '10px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>{m.label}</span>
                    <span style={{ fontSize: '10px', color: m.color, fontWeight: '800', fontFamily: 'monospace' }}>{m.val}/100</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${m.val}%`,
                      background: m.color,
                      borderRadius: '2px',
                      transition: 'width 0.4s ease',
                      boxShadow: `0 0 8px ${m.color}60`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom gradient fade into ticker */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #050507)' }} />
      </section>

      {/* ═══════════════════════════════════════════
          TICKER BAR — Animated marquee stats
      ═══════════════════════════════════════════ */}
      <div style={{
        background: '#0a0a12',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #0a0a12, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #0a0a12, transparent)', zIndex: 2 }} />

        <div style={{
          display: 'flex',
          gap: '0',
          animation: 'marquee 30s linear infinite',
          width: 'max-content'
        }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              padding: '0 40px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#00E5FF', fontFamily: 'monospace' }}>{item.value}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </div>

      {/* ═══════════════════════════════════════════
          WHY SAMRIDHI — Large number callouts
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#050507', padding: '100px 24px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '1px', height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(108,99,255,0.4), transparent)'
        }} />

        <div className="max-w-7xl mx-auto">
          <div style={{ marginBottom: '64px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', color: '#6C63FF', textTransform: 'uppercase' }}>The Problem We Solve</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '900', color: '#fff', marginTop: '12px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              Traditional credit is broken<br />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>for most Indians.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { num: '190M+', desc: 'Indians have no traditional credit history — they are invisible to banks.', color: '#FF1744', label: 'Credit-Invisible' },
              { num: '67%', desc: 'Of micro-loan applicants are rejected despite strong earning capacity and repayment intent.', color: '#FFD600', label: 'Rejection Rate' },
              { num: '₹42L Cr', desc: 'Annual credit gap in the MSME and informal economy sector — unfunded potential.', color: '#00E676', label: 'Funding Gap' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: '#080810',
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: stat.color, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>{stat.label}</span>
                <span style={{
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                  fontWeight: '900',
                  color: stat.color,
                  fontFamily: 'monospace',
                  lineHeight: '1',
                  textShadow: `0 0 40px ${stat.color}40`
                }}>{stat.num}</span>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', maxWidth: '280px' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BENTO FEATURES GRID
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#080810', padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }} id="features">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', color: '#00E5FF', textTransform: 'uppercase' }}>Platform Capabilities</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '900', color: '#fff', marginTop: '12px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
                Built for the<br />new credit economy.
              </h2>
            </div>
            <button
              onClick={() => setPage('signup')}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              View All Features
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Card 1 — Large hero card (spans 2 cols on lg) */}
            <div className="lg:col-span-2" style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(108,99,255,0.06) 100%)',
              border: '1px solid rgba(0,229,255,0.15)',
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)'}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(0,229,255,0.1)',
                border: '1px solid rgba(0,229,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <svg width="22" height="22" fill="none" stroke="#00E5FF" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '12px', letterSpacing: '-0.01em' }}>UPI Transaction Analysis</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.75', maxWidth: '440px' }}>
                Scans transactional recency, inflow-outflow consistency, merchant diversity, and utility patterns across 6 months of UPI history to build your digital solvency fingerprint.
              </p>
              <div style={{ marginTop: '28px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Inflow Mapping', 'Outflow Patterns', 'Merchant Diversity', 'Consistency Score'].map((tag, i) => (
                  <span key={i} style={{
                    padding: '4px 12px',
                    background: 'rgba(0,229,255,0.08)',
                    border: '1px solid rgba(0,229,255,0.15)',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#00E5FF',
                    letterSpacing: '0.06em'
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '32px',
              transition: 'all 0.3s',
              cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)'; e.currentTarget.style.background = 'rgba(108,99,255,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(108,99,255,0.12)',
                border: '1px solid rgba(108,99,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="20" height="20" fill="none" stroke="#6C63FF" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Skill Credibility Index</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
                Verifies GitHub repos, freelancing credentials, and professional certificates to quantify earning capacity beyond payslips.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '32px',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,118,0.35)'; e.currentTarget.style.background = 'rgba(0,230,118,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(0,230,118,0.1)',
                border: '1px solid rgba(0,230,118,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="20" height="20" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Real-Time 0–100 Score</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
                Consolidates 25+ multidimensional behavior metrics into a single living credibility score updated as your profile changes.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '32px',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,214,0,0.35)'; e.currentTarget.style.background = 'rgba(255,214,0,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,214,0,0.1)',
                border: '1px solid rgba(255,214,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="20" height="20" fill="none" stroke="#FFD600" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>AI Risk Classification</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
                Tiers loan applicants instantly using advanced ML clusters — Low / Moderate / High — matching them to appropriate credit products.
              </p>
            </div>

            {/* Card 5 — Explainable AI — full width bottom */}
            <div className="md:col-span-2 lg:col-span-1" style={{
              background: 'linear-gradient(135deg, rgba(213,0,249,0.06) 0%, rgba(108,99,255,0.06) 100%)',
              border: '1px solid rgba(213,0,249,0.15)',
              borderRadius: '20px',
              padding: '32px',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(213,0,249,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(213,0,249,0.15)'}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(213,0,249,0.1)',
                border: '1px solid rgba(213,0,249,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="20" height="20" fill="none" stroke="#D500F9" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Explainable AI (XAI)</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
                Glass-box transparency explaining exactly which parameters affect your score, with multilingual AI avatar guidance in Hindi, Telugu, and English.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Numbered pipeline steps
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#050507', padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }} id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div style={{ marginBottom: '64px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', color: '#6C63FF', textTransform: 'uppercase' }}>AI Pipeline</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '900', color: '#fff', marginTop: '12px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              From data to capital<br />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>in under 3 minutes.</span>
            </h2>
          </div>

          {/* Steps — horizontal with connecting line */}
          <div className="relative">
            {/* Connector line for desktop */}
            <div className="hidden lg:block absolute" style={{
              top: '28px', left: '9%', right: '9%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4) 20%, rgba(0,229,255,0.4) 80%, transparent)'
            }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              {[
                { step: '01', title: 'Data Collection', desc: 'Securely connect UPI logs, GitHub repos, and certification platforms via Account Aggregator.' },
                { step: '02', title: 'Preprocessing', desc: 'Cleans anomalies, structures timelines, and categorizes income patterns with data hygiene AI.' },
                { step: '03', title: 'Feature Engineering', desc: 'Builds 25+ features covering cash stability, gig ratings, skill metrics, and inventory.' },
                { step: '04', title: 'ML Underwriting', desc: 'Predicts credit trustworthiness using ensemble scoring models trained on alternate data.' },
                { step: '05', title: 'Credit Decision', desc: 'Pairs applicants with matched micro-loan partners at competitive rates instantly.' },
              ].map((st, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}
                  className="group">
                  {/* Step circle */}
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#0a0a14',
                    border: '1px solid rgba(108,99,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', fontWeight: '900', fontSize: '14px',
                    color: '#6C63FF',
                    transition: 'all 0.3s',
                    position: 'relative', zIndex: 1,
                    flexShrink: 0
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(108,99,255,0.3)'; e.currentTarget.style.color = '#00E5FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.25)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.color = '#6C63FF'; }}
                  >
                    {st.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{st.title}</h4>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.65', maxWidth: '160px', margin: '0 auto' }}>{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VIDEO KYC / TRUST SECTION
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#080810', padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', color: '#00E676', textTransform: 'uppercase' }}>Trust Infrastructure</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: '900', color: '#fff', marginTop: '12px', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Bank-grade security.<br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Fintech-speed verification.</span>
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', marginBottom: '36px', maxWidth: '440px' }}>
                Samridhi uses Video KYC liveness detection, Aadhaar-grade identity checks, and encrypted Account Aggregator pipelines — the same infrastructure trusted by Zerodha, DigiLocker, and RBI-regulated NBFCs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '🎥', title: 'Video KYC Liveness Check', desc: '5-second face scan with anti-spoofing protection prevents deepfake fraud.' },
                  { icon: '🏦', title: 'Account Aggregator (AA)', desc: 'RBI-certified AA framework for bank statement fetch with your consent.' },
                  { icon: '🔐', title: 'End-to-End Encryption', desc: 'AES-256 encrypted data vaults. Your data, your control.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual trust card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(0,230,118,0.15)',
              borderRadius: '24px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(0,230,118,0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              {/* Checklist */}
              {[
                { label: 'Aadhaar Verified', done: true },
                { label: 'PAN Card Linked', done: true },
                { label: 'UPI Connected', done: true },
                { label: 'Video KYC Passed', done: true },
                { label: 'Bank Statement Uploaded', done: true },
                { label: 'Credibility Score Generated', done: true },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0',
                  borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(0,230,118,0.15)',
                    border: '1px solid rgba(0,230,118,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="10" height="10" fill="none" stroke="#00E676" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{item.label}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '9px', fontWeight: '800',
                    color: '#00E676', letterSpacing: '0.1em'
                  }}>DONE</span>
                </div>
              ))}

              {/* Score readout */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(0,230,118,0.06)',
                border: '1px solid rgba(0,230,118,0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '700' }}>Credibility Score</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#00E676', fontFamily: 'monospace', textShadow: '0 0 20px rgba(0,230,118,0.5)' }}>82/100</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA — Full-width gradient banner
      ═══════════════════════════════════════════ */}
      <section style={{
        background: '#050507',
        padding: '120px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="max-w-3xl mx-auto relative" style={{ zIndex: 1 }}>
          <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', color: '#6C63FF', textTransform: 'uppercase', display: 'block', marginBottom: '24px' }}>
            Start Today
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: '900',
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            Unlock capital without<br />
            a traditional credit file.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.75', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
            Connect your accounts, score your skills, and check eligibility for micro-loans in under five minutes. No CIBIL score needed.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage('signup')}
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 100%)',
                color: '#050507',
                fontWeight: '800',
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '16px 40px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 40px rgba(0,229,255,0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create Free Account
            </button>
            <button
              onClick={() => setPage('signin')}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '16px 40px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
