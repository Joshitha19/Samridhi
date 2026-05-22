// Landing Page View Component for Samridhi
// Exposes LandingPageView globally

window.LandingPageView = ({ setPage, scrollToSection, calculatedScore }) => {
  const { useState } = React;
  const [demoScore, setDemoScore] = useState(72);

  return (
    <div className="flex-1 flex flex-col animate-fade-in" id="home">
      
      {/* HERO SECTION */}
      <section className="relative py-20 px-6 overflow-hidden flex items-center justify-center min-h-[85vh]">
        {/* Grid Glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-samridhi-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-samridhi-primary/5 blur-[50px] glow-pulse-primary"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-samridhi-secondary/5 blur-[60px] glow-pulse-primary"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-samridhi-primary/10 border border-samridhi-primary/30 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-samridhi-secondary animate-ping"></span>
              <span className="text-xs font-extrabold text-samridhi-secondary uppercase tracking-widest">AI Scoring System Live</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-samridhi-textPrimary leading-[1.1]">
              Smart Loan Approval <br />
              <span className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-base md:text-lg text-samridhi-textMuted max-w-xl leading-relaxed">
              More than <strong className="text-samridhi-textPrimary">190 million Indians</strong> have no credit bureau history. Samridhi analyzes digital UPI logs, verified credentials, and gig performance metrics to unlock financial mobility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setPage('signup')}
                className="px-8 py-3.5 bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold rounded-xl shadow-xl shadow-samridhi-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <span>Check Credit Index</span>
                <Icons.ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="px-8 py-3.5 bg-samridhi-surface hover:bg-samridhi-card text-samridhi-textPrimary border border-samridhi-border font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Hero Right Interactive Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-samridhi-card border border-samridhi-border p-8 rounded-3xl w-full max-w-[380px] shadow-2xl relative">
              {/* Decorative glowing light */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-secondary/10 to-transparent rounded-tr-3xl pointer-events-none"></div>
              
              <h3 className="text-center font-bold text-sm text-samridhi-textMuted tracking-wider uppercase mb-6">Interactive Credibility Preview</h3>
              
              <CircularGauge score={demoScore} size={180} />

              <div className="mt-8 space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-samridhi-textMuted">
                    <span>Simulated Alternative Metrics</span>
                    <span className="text-samridhi-secondary">{demoScore} Score</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="99" 
                    value={demoScore} 
                    onChange={(e) => setDemoScore(parseInt(e.target.value))}
                    className="w-full h-1 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold text-samridhi-textMuted mt-1">
                    <span className="text-samridhi-danger bg-samridhi-danger/5 py-1 rounded">0-40 Red</span>
                    <span className="text-samridhi-warning bg-samridhi-warning/5 py-1 rounded">41-70 Yellow</span>
                    <span className="text-samridhi-success bg-samridhi-success/5 py-1 rounded">71-100 Green</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-samridhi-surface border-y border-samridhi-border py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((st, i) => (
            <div key={i} className="text-center flex flex-col space-y-2 border-r border-samridhi-border/40 last:border-none">
              <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-samridhi-primary to-samridhi-secondary bg-clip-text text-transparent">
                {st.val}
              </span>
              <span className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6 relative" id="features">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          <div className="text-center flex flex-col space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-samridhi-primary uppercase tracking-widest">Our Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Alternative Underwriting Tools</h2>
            <p className="text-sm text-samridhi-textMuted leading-relaxed">
              We look beyond bureaucratic parameters. Our modular algorithm maps economic capacity through modern digital indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_DATA.map((feat, i) => (
              <div 
                key={i} 
                className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl hover:border-samridhi-secondary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-samridhi-surface flex items-center justify-center border border-samridhi-border group-hover:border-samridhi-secondary/30 transition-colors mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-samridhi-secondary transition-colors">{feat.title}</h3>
                <p className="text-xs text-samridhi-textMuted leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-6 bg-samridhi-surface/40 border-y border-samridhi-border" id="how-it-works">
        <div className="max-w-7xl mx-auto flex flex-col space-y-16">
          <div className="text-center flex flex-col space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-samridhi-secondary uppercase tracking-widest">AI Pipeline</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How It Works</h2>
            <p className="text-sm text-samridhi-textMuted leading-relaxed">
              The architecture behind Samridhi transforms alternate data points into real-time credit accessibility.
            </p>
          </div>

          {/* Stepper Grid */}
          <div className="relative">
            {/* Horizontal progress bar for desktop */}
            <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-samridhi-primary/50 to-samridhi-secondary/50 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {HOW_IT_WORKS_STEPS.map((st, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="w-14 h-14 rounded-full bg-samridhi-card border-2 border-samridhi-border group-hover:border-samridhi-primary flex items-center justify-center font-black text-sm text-samridhi-textMuted group-hover:text-samridhi-secondary transition-all duration-300 shadow-xl">
                    {st.step}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-extrabold text-sm text-samridhi-textPrimary">{st.title}</h4>
                    <p className="text-[11px] text-samridhi-textMuted max-w-[200px] leading-relaxed mx-auto">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-samridhi-primary/5 to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Unlock Capital Instantly <br />
            Without a Traditional Credit File
          </h2>
          <p className="text-sm md:text-base text-samridhi-textMuted max-w-xl leading-relaxed">
            Connect your accounts, score your skills, and check eligibility for micro-loans in under five minutes.
          </p>
          <button 
            onClick={() => setPage('signup')}
            className="px-8 py-3.5 bg-gradient-to-r from-samridhi-primary to-samridhi-primary/80 hover:opacity-95 text-white font-bold rounded-xl shadow-xl shadow-samridhi-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Create Account Now
          </button>
        </div>
      </section>

    </div>
  );
};
