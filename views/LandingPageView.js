// Landing Page View Component for Samridhi
// Exposes LandingPageView globally

window.LandingPageView = ({ setPage, scrollToSection, calculatedScore }) => {
  const { useState } = React;
  const [demoScore, setDemoScore] = useState(72);

  return (
    <div className="flex-1 flex flex-col animate-fade-in" id="home">
      
      {/* HERO SECTION */}
      <section className="relative py-28 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[90vh] bg-black">
        {/* Grid Glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-samridhi-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-[20%] left-[30%] w-[450px] h-[450px] rounded-full bg-samridhi-primary/5 blur-[70px] glow-pulse-primary pointer-events-none"></div>

        {/* FLOATING 3D PERSPECTIVE COINS */}
        
        {/* Coin 1: Silver/Purple (Top-Left) */}
        <div className="absolute top-[12%] left-[8%] w-20 md:w-28 h-20 md:h-28 animate-coin-1 z-0 select-none pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(213,0,249,0.3)]">
            <defs>
              <radialGradient id="silverGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="75%" stopColor="#C0C0C8"/>
                <stop offset="100%" stopColor="#7B7B88"/>
              </radialGradient>
              <linearGradient id="purpleRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="50%" stopColor="#D500F9"/>
                <stop offset="100%" stopColor="#4A148C"/>
              </linearGradient>
            </defs>
            {/* Thickness rim */}
            <ellipse cx="50" cy="54" rx="44" ry="20" fill="url(#purpleRing)" />
            {/* Main face */}
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="url(#silverGrad)" />
            {/* Inner face ring */}
            <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
            {/* Center glow symbol */}
            <text x="50" y="55" fill="#D500F9" fontSize="15" fontWeight="bold" textAnchor="middle" style={{ filter: "drop-shadow(0 0 2px #D500F9)" }}>AI</text>
          </svg>
        </div>

        {/* Coin 2: Gold with $ (Bottom-Left) */}
        <div className="absolute bottom-[22%] left-[10%] w-24 md:w-32 h-24 md:h-32 animate-coin-2 z-0 select-none pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(255,214,0,0.25)]">
            <defs>
              <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D"/>
                <stop offset="60%" stopColor="#FBC02D"/>
                <stop offset="100%" stopColor="#F57F17"/>
              </radialGradient>
              <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9C4"/>
                <stop offset="50%" stopColor="#F57F17"/>
                <stop offset="100%" stopColor="#E65100"/>
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="54" rx="44" ry="20" fill="url(#goldRing)" />
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="url(#goldGrad)" />
            <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#FFF9C4" strokeWidth="1.2" strokeOpacity="0.5" />
            <text x="50" y="56" fill="#E65100" fontSize="18" fontWeight="bold" textAnchor="middle">$</text>
          </svg>
        </div>

        {/* Coin 3: Red with Bitcoin symbol (Bottom-Center) */}
        <div className="absolute bottom-[8%] left-[34%] w-20 md:w-26 h-20 md:h-26 animate-coin-3 z-0 select-none pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(255,23,68,0.3)]">
            <defs>
              <radialGradient id="redGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF8A80"/>
                <stop offset="65%" stopColor="#D50000"/>
                <stop offset="100%" stopColor="#9C0000"/>
              </radialGradient>
              <linearGradient id="redRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFCDD2"/>
                <stop offset="50%" stopColor="#9C0000"/>
                <stop offset="100%" stopColor="#5D0000"/>
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="54" rx="44" ry="20" fill="url(#redRing)" />
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="url(#redGrad)" />
            <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#FFCDD2" strokeWidth="1.2" strokeOpacity="0.5" />
            <text x="50" y="56" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle">B</text>
          </svg>
        </div>

        {/* Coin 4: Pink with Star (Bottom-Right) */}
        <div className="absolute bottom-[12%] right-[12%] w-24 md:w-32 h-24 md:h-32 animate-coin-4 z-0 select-none pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(255,23,128,0.3)]">
            <defs>
              <radialGradient id="pinkGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF80AB"/>
                <stop offset="70%" stopColor="#C51162"/>
                <stop offset="100%" stopColor="#880E4F"/>
              </radialGradient>
              <linearGradient id="pinkRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8BBD0"/>
                <stop offset="50%" stopColor="#880E4F"/>
                <stop offset="100%" stopColor="#4A148C"/>
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="54" rx="44" ry="20" fill="url(#pinkRing)" />
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="url(#pinkGrad)" />
            <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#F8BBD0" strokeWidth="1.2" strokeOpacity="0.5" />
            <path d="M50 38 L53 47 L62 47 L55 52 L58 61 L50 55 L42 61 L45 52 L38 47 L47 47 Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Coin 5: Purple with Rupee symbol (Mid-Right) */}
        <div className="absolute top-[22%] right-[8%] w-26 md:w-34 h-26 md:h-34 animate-coin-5 z-0 select-none pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_15px_30px_rgba(213,0,249,0.35)]">
            <defs>
              <radialGradient id="magentaGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EA80FC"/>
                <stop offset="65%" stopColor="#AA00FF"/>
                <stop offset="100%" stopColor="#4A148C"/>
              </radialGradient>
              <linearGradient id="magentaRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E1BEE7"/>
                <stop offset="50%" stopColor="#4A148C"/>
                <stop offset="100%" stopColor="#311B92"/>
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="54" rx="44" ry="20" fill="url(#magentaRing)" />
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="url(#magentaGrad)" />
            <ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="#E1BEE7" strokeWidth="1.2" strokeOpacity="0.5" />
            <text x="50" y="56" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle">₹</text>
          </svg>
        </div>

        {/* Winding Ribbon across the bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-44 pointer-events-none z-10" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.03" />
              <stop offset="50%" stopColor="#D500F9" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00E676" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {/* Filled ribbon */}
          <path 
            d="M-50,160 Q280,30 720,130 T1490,90 L1490,250 L-50,250 Z" 
            fill="url(#ribbonGrad)" 
          />
          {/* Dotted border line */}
          <path 
            d="M-50,160 Q280,30 720,130 T1490,90" 
            fill="none" 
            stroke="#D500F9" 
            strokeWidth="2.5" 
            strokeOpacity="0.4"
            strokeDasharray="8 8"
          />
          {/* Solid accent line */}
          <path 
            d="M-50,155 Q280,25 720,125 T1490,85" 
            fill="none" 
            stroke="#00E5FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.3"
          />
        </svg>

        {/* CENTERED HERO CONTENT */}
        <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center space-y-7 animate-slide-up">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-samridhi-primary/10 border border-samridhi-primary/30 rounded-full select-none">
            <span className="w-2 h-2 rounded-full bg-samridhi-secondary animate-ping"></span>
            <span className="text-xs font-extrabold text-samridhi-secondary uppercase tracking-widest">AI UNDERWRITING ENGINE v2.4</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] select-none">
            A new era of <br />
            <span className="bg-gradient-to-r from-samridhi-primary via-samridhi-secondary to-samridhi-success bg-clip-text text-transparent">
              personal finance
            </span>
          </h1>
          
          <p className="text-xs md:text-sm text-samridhi-textMuted max-w-lg leading-relaxed mx-auto font-semibold">
            India's first decentralized alternative credibility index mapping UPI cashflows, skill verifications, and statement diagnostics to unlock access to capital.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center">
            <button 
              onClick={() => setPage('signup')}
              className="px-8 py-3.5 bg-white hover:bg-white/95 text-black font-extrabold rounded-full shadow-lg shadow-samridhi-primary/15 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center space-x-2 w-48"
            >
              <span>Join waitlist</span>
              <Icons.ArrowRight className="w-4 h-4 text-black" />
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-8 py-3.5 bg-samridhi-surface hover:bg-samridhi-card text-samridhi-textPrimary border border-samridhi-border hover:border-samridhi-primary/50 font-bold rounded-full transition-all duration-300 transform hover:-translate-y-0.5 w-48"
            >
              Explore Features
            </button>
          </div>
        </div>

      </section>

      {/* STATS BAR */}
      <section className="bg-samridhi-surface border-y border-samridhi-border py-12 px-6 bg-grid-glow">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: "190M+", label: "Credit-Invisible Indians" },
            { val: "25+", label: "Alternative Features Scanned" },
            { val: "0 - 100", label: "Algorithmic Trust Rating" },
            { val: "3", label: "Targeted Risk Categories" }
          ].map((st, i) => (
            <div key={i} className="text-center flex flex-col space-y-2 border-r border-samridhi-border/40 last:border-none">
              <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-samridhi-primary to-samridhi-secondary bg-clip-text text-transparent font-mono">
                {st.val}
              </span>
              <span className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE PREVIEW SECTION */}
      <section className="py-20 px-6 bg-black flex flex-col items-center justify-center border-b border-samridhi-border">
        <div className="max-w-3xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-8 rounded-3xl bg-samridhi-card border border-samridhi-border shadow-2xl relative overflow-hidden hover-glow-green">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-secondary/5 to-transparent rounded-tr-3xl pointer-events-none"></div>
          
          <div className="space-y-4 text-left max-w-sm">
            <span className="text-[10px] font-extrabold text-samridhi-secondary uppercase tracking-widest block">Interactive Underwriting</span>
            <h3 className="text-2xl font-extrabold tracking-tight text-white leading-normal">Test the scoring algorithm live</h3>
            <p className="text-xs text-samridhi-textMuted leading-relaxed">
              Drag the preview slider to adjust the credibility index score. See how alternative categories and risk segments transition in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0 w-full sm:w-64">
            <CircularGauge score={demoScore} size={160} />
            <div className="w-full mt-6 space-y-2">
              <input 
                type="range" 
                min="10" 
                max="99" 
                value={demoScore} 
                onChange={(e) => setDemoScore(parseInt(e.target.value))}
                className="w-full h-1 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="grid grid-cols-3 gap-2 text-[8px] text-center font-black uppercase text-samridhi-textMuted mt-1">
                <span className="text-samridhi-danger bg-samridhi-danger/5 py-1 rounded">0-40 Red</span>
                <span className="text-samridhi-warning bg-samridhi-warning/5 py-1 rounded">41-70 Yellow</span>
                <span className="text-samridhi-success bg-samridhi-success/5 py-1 rounded">71-100 Green</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-6 relative bg-black" id="features">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          <div className="text-center flex flex-col space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-samridhi-primary uppercase tracking-widest">Our Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Alternative Underwriting Tools</h2>
            <p className="text-xs text-samridhi-textMuted leading-relaxed">
              We look beyond bureaucratic parameters. Our modular algorithm maps economic capacity through modern digital indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Skill Credibility Index",
                description: "Bypasses standard credit reports by verifying code repositories, freelancing credentials, and professional certificates.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "UPI Analysis",
                description: "Scans transactional recency, inflow-outflow consistency, and utility patterns to map digital solvency.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              {
                title: "Credibility Score 0-100",
                description: "Consolidates multidimensional behavior metrics into a single real-time trust rating.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-success" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "Risk Classification",
                description: "Tiers loan applicants instantly using advanced AI clusters to identify credit-invisible opportunities.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-warning" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )
              },
              {
                title: "Smart Loan Recommender",
                description: "AI-matching engine pairs your credibility metrics with ideal micro-loans, starting from low interest rates.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )
              },
              {
                title: "Explainable AI (XAI)",
                description: "Glass-box transparency detailing the exact parameters determining credit scores, ensuring fair evaluations.",
                icon: (
                  <svg className="w-6 h-6 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              }
            ].map((feat, i) => (
              <div 
                key={i} 
                className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl hover-glow-green group"
              >
                <div className="w-11 h-11 rounded-xl bg-samridhi-surface flex items-center justify-center border border-samridhi-border group-hover:border-samridhi-primary/30 transition-colors mb-5 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-base font-extrabold mb-2 text-white group-hover:text-samridhi-primary transition-colors">{feat.title}</h3>
                <p className="text-[11px] text-samridhi-textMuted leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-6 bg-samridhi-surface/30 border-y border-samridhi-border bg-grid-glow" id="how-it-works">
        <div className="max-w-7xl mx-auto flex flex-col space-y-16">
          <div className="text-center flex flex-col space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-samridhi-secondary uppercase tracking-widest">AI Pipeline</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">How It Works</h2>
            <p className="text-xs text-samridhi-textMuted leading-relaxed">
              The architecture behind Samridhi transforms alternate data points into real-time credit accessibility.
            </p>
          </div>

          {/* Stepper Grid */}
          <div className="relative">
            {/* Horizontal progress bar for desktop */}
            <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-[1.5px] bg-gradient-to-r from-samridhi-primary/45 to-samridhi-secondary/45 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {[
                { step: "01", title: "Data Collection", desc: "Integrate UPI transaction logs, GitHub/LinkedIn repos, and certification platforms securely." },
                { step: "02", title: "Preprocessing", desc: "Cleans data anomalies, structures timelines, and categorizes income patterns." },
                { step: "03", title: "Feature Engineering", desc: "Builds 25+ features covering cash stability, gig-ratings, and skill metrics." },
                { step: "04", title: "ML Scored Underwriting", desc: "Predicts credit trustworthiness through alternate machine learning scoring models." },
                { step: "05", title: "Credit Approval Decision", desc: "Pairs applicants with low-interest institutional capital partners instantly." }
              ].map((st, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="w-14 h-14 rounded-full bg-samridhi-card border border-samridhi-border group-hover:border-samridhi-primary flex items-center justify-center font-black text-sm text-samridhi-textMuted group-hover:text-samridhi-secondary transition-all duration-300 shadow-xl font-mono">
                    {st.step}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-extrabold text-sm text-samridhi-textPrimary">{st.title}</h4>
                    <p className="text-[10px] text-samridhi-textMuted max-w-[200px] leading-relaxed mx-auto">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-28 px-6 text-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-samridhi-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-normal">
            Unlock Capital Instantly <br />
            Without a Traditional Credit File
          </h2>
          <p className="text-xs md:text-sm text-samridhi-textMuted max-w-lg leading-relaxed mx-auto">
            Connect your accounts, score your skills, and check eligibility for micro-loans in under five minutes.
          </p>
          <button 
            onClick={() => setPage('signup')}
            className="px-8 py-3.5 bg-white hover:bg-white/95 text-black font-extrabold rounded-full shadow-lg shadow-samridhi-primary/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
          >
            Create Account Now
          </button>
        </div>
      </section>

    </div>
  );
};
