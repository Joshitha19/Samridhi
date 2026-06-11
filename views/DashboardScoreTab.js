// Dashboard Score Factors Tab Component for Samridhi
// Exposes DashboardScoreTab globally

window.DashboardScoreTab = ({
  calculatedScore,
  dashboardState,
  aadhaarVerified,
  panVerified,
  upiLinked,
  upiVerified,
  setUpiVerified,
  dispatch,
  setAadhaarVerified,
  setPanVerified,
  setUpiLinked,
  setActiveTab,
  whatIfRepayActive,
  setWhatIfRepayActive,
  whatIfLinkGithub,
  setWhatIfLinkGithub,
  whatIfNewCert,
  setWhatIfNewCert,
  whatIfConsistentUpi,
  setWhatIfConsistentUpi,
  kycCameraVerified,
  bankStatementUploaded
}) => {
  const { useState, useEffect, useMemo } = React;
  
  const [mounted, setMounted] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    // Trigger animations after mounting
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  // Calculate dynamic SHAP factors and LIME surrogates
  const xaiExplanations = useMemo(() => {
    if (window.calculateXAIExplanations) {
      const metrics = {
        aadhaarVerified,
        panVerified,
        upiLinked,
        upiVerified,
        skills: dashboardState.skills || [],
        inventory: dashboardState.inventory || [],
        transactions: dashboardState.transactions || [],
        kycCameraVerified,
        bankStatementUploaded,
        whatIfRepayActive,
        whatIfLinkGithub,
        whatIfNewCert,
        whatIfConsistentUpi
      };
      return window.calculateXAIExplanations(dashboardState.user || {}, metrics);
    }
    return {
      shapFactors: [
        { label: "UPI consistency", impact: 9.2, positive: true },
        { label: "Monthly income", impact: 7.8, positive: true },
        { label: "Skill certifications", impact: 6.1, positive: true }
      ],
      limeSurrogate: { formula: "y ≈ 50 + 10 * X_UPI", activeValues: {}, coefficients: {} },
      baseline: 50
    };
  }, [
    aadhaarVerified,
    panVerified,
    upiLinked,
    upiVerified,
    dashboardState.skills,
    dashboardState.inventory,
    dashboardState.transactions,
    kycCameraVerified,
    bankStatementUploaded,
    whatIfRepayActive,
    whatIfLinkGithub,
    whatIfNewCert,
    whatIfConsistentUpi,
    dashboardState.user
  ]);

  const shapFactors = xaiExplanations.shapFactors;

  // Accordion details data
  const accordionFactors = [
    {
      name: "UPI Payment Behavior",
      score: "18/20",
      level: "High",
      levelColor: "text-samridhi-success bg-samridhi-success/10 border-samridhi-success/20",
      pct: 90,
      explanation: "38 transactions analyzed. Consistent daily usage. Merchant diversity score: 8.2/10. Payment regularity: 94%.",
      tips: ["Keep paying bills via UPI", "Diversify merchant categories"]
    },
    {
      name: "Income Stability",
      score: "16/20",
      level: "High",
      levelColor: "text-samridhi-success bg-samridhi-success/10 border-samridhi-success/20",
      pct: 80,
      explanation: "Regular ₹45,000 salary detected. Income-to-expense ratio 68%.",
      tips: ["Show consistent salary credits", "Avoid large irregular withdrawals"]
    },
    {
      name: "Skill Credibility Index",
      score: "14/20",
      level: "Medium",
      levelColor: "text-samridhi-warning bg-samridhi-warning/10 border-samridhi-warning/20",
      pct: 70,
      explanation: "4 certs verified: Python, Data Analysis, AWS, Freelancing. Estimated earning potential mapped to loan repayment capacity.",
      tips: ["Add 2 more industry-recognized certs (e.g. Google, Coursera)"]
    },
    {
      name: "Transaction Diversity",
      score: "13/20",
      level: "Medium",
      levelColor: "text-samridhi-warning bg-samridhi-warning/10 border-samridhi-warning/20",
      pct: 65,
      explanation: "6 merchant categories. Missing utility/insurance payments on UPI.",
      tips: ["Pay electricity, internet bills via UPI to boost this score"]
    },
    {
      name: "Repayment History",
      score: "11/20",
      level: "Low",
      levelColor: "text-samridhi-danger bg-samridhi-danger/10 border-samridhi-danger/20",
      pct: 55,
      explanation: "No defaults. But limited 4-month history.",
      tips: ["Take small credit builder loan", "Use credit card responsibly"]
    }
  ];

  // SVG Gauge Calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const targetScore = calculatedScore || 72;
  const strokeDashoffset = circumference - (circumference * (mounted ? targetScore : 0)) / 100;

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* SECTION 1 - Score Header (3 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Gauge & History */}
        <div className="lg:col-span-4 glass-card p-5 rounded-3xl flex flex-col items-center gap-4 justify-between border border-white/[0.04] border-glow-success">
          
          <div className="flex flex-col items-center shrink-0 w-full text-center">
            {/* Gauge */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  className="text-white/[0.03]"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="100"
                />
                <circle
                  stroke="#00E676"
                  strokeWidth="12"
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="100"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 230, 118, 0.45))'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white leading-none font-mono text-glow-success">{targetScore}</span>
                <span className="text-[8px] tracking-widest text-samridhi-textMuted font-black uppercase mt-1">AI Rating</span>
              </div>
            </div>
            
            <span className="text-[8px] text-samridhi-textMuted font-bold mt-2 uppercase tracking-wider">Last updated: 11 Jun 2026</span>
            <div className={`mt-2 px-3 py-0.5 rounded-full font-black tracking-widest text-[8px] text-glow-success animate-pulse ${
              targetScore >= 71 
                ? 'bg-samridhi-success/10 border border-samridhi-success/35 text-samridhi-success' 
                : targetScore >= 60 
                  ? 'bg-samridhi-secondary/10 border border-samridhi-secondary/35 text-samridhi-secondary' 
                  : 'bg-samridhi-warning/10 border border-samridhi-warning/35 text-samridhi-warning'
            }`}>
              {targetScore >= 71 ? 'LOW RISK' : targetScore >= 60 ? 'MEDIUM RISK' : 'HIGH RISK'}
            </div>
          </div>

          {/* History Chart */}
          <div className="w-full space-y-2">
            <h4 className="font-extrabold text-[8px] text-samridhi-textMuted uppercase tracking-wider">Score Progression</h4>
            <div className="bg-white/[0.01] border border-white/[0.05] p-2.5 rounded-xl">
              <svg className="w-full h-20" viewBox="0 0 240 100">
                <line x1="25" y1="20" x2="230" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="25" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="25" y1="80" x2="230" y2="80" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                
                <text x="25" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Jan</text>
                <text x="75" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Feb</text>
                <text x="125" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Mar</text>
                <text x="175" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Apr</text>
                <text x="225" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">May</text>
                
                <text x="18" y="23" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">80</text>
                <text x="18" y="53" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">60</text>
                <text x="18" y="83" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">40</text>

                <polyline
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2.5"
                  points="25,52 75,49 125,43 175,37 225,32"
                  className="transition-all duration-1000 ease-out"
                />
                
                <circle cx="25" cy="52" r="3" fill="#00D4FF" />
                <circle cx="75" cy="49" r="3" fill="#00D4FF" />
                <circle cx="125" cy="43" r="3" fill="#00D4FF" />
                <circle cx="175" cy="37" r="3" fill="#00D4FF" />
                <circle cx="225" cy="32" r="3" fill="#00D4FF" />
                
                <text x="25" y="44" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">58</text>
                <text x="75" y="41" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">61</text>
                <text x="125" y="35" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">65</text>
                <text x="175" y="29" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">69</text>
                <text x="225" y="24" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">72</text>
              </svg>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: SHAP Bar Chart */}
        <div className="lg:col-span-4 glass-card p-5 rounded-3xl border border-white/[0.04] border-glow-primary flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Dynamic SHAP Values</h4>
            <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold leading-relaxed">
              Local feature attributions summing to score delta from baseline (Expected Value: 50).
            </p>
          </div>

          <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1.5 scrollbar-thin">
            {shapFactors.map((item, idx) => {
              const impactPct = Math.min(100, Math.abs(item.impact) * 5); // Scale for visual representation
              return (
                <div key={idx} className="flex items-center space-x-2.5 text-[10px]">
                  {/* Factor Label */}
                  <span className="w-24 text-samridhi-textMuted truncate font-extrabold uppercase tracking-wide text-[8px]">{item.label}</span>
                  
                  {/* Horizontal Bar */}
                  <div className="flex-1 h-2 bg-white/[0.02] border border-white/[0.06] rounded overflow-hidden relative">
                    <div
                      className={`h-full rounded transition-all duration-1000 ease-out ${
                        item.positive ? 'bg-samridhi-success' : 'bg-samridhi-danger'
                      }`}
                      style={{
                        width: mounted ? `${impactPct}%` : '0%'
                      }}
                    ></div>
                  </div>

                  {/* Impact Value */}
                  <span className={`w-8 text-right font-black font-mono text-[9px] ${
                    item.positive ? 'text-samridhi-success' : 'text-samridhi-danger'
                  }`}>
                    {item.positive ? '+' : ''}{item.impact}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: LIME Local Surrogate Model */}
        <div className="lg:col-span-4 glass-card p-5 rounded-3xl border border-white/[0.04] border-glow-secondary flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">LIME Local Surrogate</h4>
              <span className="text-[8px] font-black text-samridhi-secondary bg-samridhi-secondary/10 px-1.5 py-0.5 rounded border border-samridhi-secondary/20 uppercase tracking-widest font-mono">Surrogate.Linear</span>
            </div>
            <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold leading-relaxed">
              Local interpretable linear approximation in the neighborhood of your profile.
            </p>
          </div>

          {/* LIME Equation Display */}
          <div className="bg-[#090b10]/60 border border-white/[0.06] p-3 rounded-xl font-mono text-[9px] text-samridhi-secondary space-y-1.5 overflow-x-auto whitespace-pre-wrap select-all">
            <div className="text-[8px] font-bold text-samridhi-textMuted uppercase tracking-wider">Local Decision boundary:</div>
            <div className="font-extrabold text-[9px] text-glow-secondary leading-normal">{xaiExplanations.limeSurrogate.formula}</div>
          </div>

          {/* Active Features Table */}
          <div className="space-y-1.5 text-[10px]">
            <span className="text-[8px] font-black text-samridhi-textMuted uppercase tracking-wider block">Local Feature Coefficients</span>
            <div className="max-h-24 overflow-y-auto space-y-1 divide-y divide-white/[0.02] pr-1.5 scrollbar-thin">
              {Object.keys(xaiExplanations.limeSurrogate.activeValues).map(key => {
                const coef = xaiExplanations.limeSurrogate.coefficients[key];
                return (
                  <div key={key} className="flex items-center justify-between py-1 text-[10px]">
                    <span className="font-bold text-samridhi-textMuted font-mono text-[8.5px]">{key}</span>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-samridhi-textMuted font-semibold font-mono text-[8.5px]">val: {xaiExplanations.limeSurrogate.activeValues[key]}</span>
                      <span className={`font-black font-mono text-[8.5px] ${coef >= 0 ? 'text-samridhi-success' : 'text-samridhi-danger'}`}>
                        coef: {coef >= 0 ? '+' : ''}{coef}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 - Detailed Breakdown (full width card) */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/[0.04]">
        <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-white/[0.04] pb-3">
          Detailed Factor Underwriting Breakdown
        </h3>
               <div className="divide-y divide-white/[0.04]">
          {accordionFactors.map((factor, idx) => {
            const isExpanded = expandedRow === idx;
            return (
              <div key={idx} className="py-3.5">
                {/* Header (Trigger) */}
                <div 
                  onClick={() => toggleAccordion(idx)}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/[0.02] p-2 rounded-xl transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Name */}
                    <span className="md:col-span-4 font-extrabold text-xs text-white uppercase tracking-wide">{factor.name}</span>
                    
                    {/* Score */}
                    <span className="md:col-span-2 font-bold text-samridhi-textMuted font-mono">{factor.score}</span>
                    
                    {/* Pill */}
                    <div className="md:col-span-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${factor.levelColor}`}>
                        {factor.level}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="md:col-span-4 pr-4">
                      <div className="w-full bg-white/[0.02] h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                        <div 
                          className={`h-full ${
                            factor.level === 'High' 
                              ? 'bg-samridhi-success' 
                              : factor.level === 'Medium' 
                                ? 'bg-samridhi-warning' 
                                : 'bg-samridhi-danger'
                          }`}
                          style={{ width: `${factor.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="shrink-0 text-samridhi-textMuted">
                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-3.5 px-4 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3.5 animate-fade-in">
                    <div>
                      <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block mb-1">Telemetry Analysis</span>
                      <p className="text-xs text-samridhi-textPrimary leading-relaxed font-semibold">{factor.explanation}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">How to Improve</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {factor.tips.map((tip, tipIdx) => (
                          <div key={tipIdx} className="flex items-center space-x-2 text-[11px] text-samridhi-textPrimary font-semibold">
                            {/* Info/Bulb SVG */}
                            <svg className="w-4 h-4 text-samridhi-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 - Interactive Credit Builder Checklist */}
      <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/[0.04] border-glow-secondary">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-secondary">
              Interactive Credit Builder Roadmap
            </h3>
            <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-widest font-mono">Sim.Gamified.Path</span>
          </div>
          <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">
            Complete the following credit milestones to build alternative digital trust rating points.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Item 1: Link Bank via Sahamati AA */}
          <div className="bg-white/[0.01] border border-white/[0.05] hover:border-samridhi-secondary/30 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                upiVerified 
                  ? 'bg-samridhi-success/10 border-samridhi-success/20 text-samridhi-success'
                  : 'bg-white/[0.02] border-white/[0.08] text-samridhi-textMuted'
              }`}>
                {upiVerified ? '✓' : '🏦'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Link Bank Account via Account Aggregator</h4>
                  <span className="text-[8px] font-black text-samridhi-success font-mono uppercase bg-samridhi-success/10 px-1.5 py-0.5 rounded border border-samridhi-success/15">+25 pts Impact</span>
                </div>
                <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">Verify cashflow stability and inflow-outflow velocity using secure Sahamati consent framework.</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (upiVerified) {
                  alert("Your Union Bank node is already synced and verified!");
                } else {
                  if (setActiveTab) setActiveTab('overview');
                  // Let the user know they can click the Link Bank button
                  setTimeout(() => {
                    alert("Please click the 'Link Bank via AA Consent' button on the right column to proceed!");
                  }, 100);
                }
              }}
              className={`px-4.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer ${
                upiVerified 
                  ? 'bg-samridhi-success/10 border border-samridhi-success/20 text-samridhi-success hover:bg-samridhi-success/20'
                  : 'bg-samridhi-secondary hover:brightness-110 text-samridhi-bg font-extrabold'
              }`}
            >
              {upiVerified ? 'Synced ✔' : 'Link Bank Node'}
            </button>
          </div>

          {/* Item 2: Link GitHub Developer Portfolio */}
          <div className="bg-white/[0.01] border border-white/[0.05] hover:border-samridhi-primary/30 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                whatIfLinkGithub 
                  ? 'bg-samridhi-primary/10 border-samridhi-primary/20 text-samridhi-primary'
                  : 'bg-white/[0.02] border-white/[0.08] text-samridhi-textMuted'
              }`}>
                {whatIfLinkGithub ? '✓' : '💻'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Link GitHub Portfolio</h4>
                  <span className="text-[8px] font-black text-samridhi-success font-mono uppercase bg-samridhi-success/10 px-1.5 py-0.5 rounded border border-samridhi-success/15">+8 pts Impact</span>
                </div>
                <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">Verify repository commits and open-source contributions to evaluate vocational consistency.</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (setWhatIfLinkGithub) setWhatIfLinkGithub(!whatIfLinkGithub);
              }}
              className={`px-4.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer border ${
                whatIfLinkGithub 
                  ? 'bg-samridhi-primary/10 border-samridhi-primary/25 text-samridhi-primary hover:bg-samridhi-primary/20'
                  : 'bg-white/[0.02] border-white/[0.08] text-white hover:border-samridhi-primary/50'
              }`}
            >
              {whatIfLinkGithub ? 'Linked ✔' : 'Link GitHub'}
            </button>
          </div>

          {/* Item 3: Simulate Freelance Invoice Credit */}
          <div className="bg-white/[0.01] border border-white/[0.05] hover:border-samridhi-success/30 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/[0.08] text-samridhi-textMuted flex items-center justify-center shrink-0">
                💰
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Simulate Freelance Invoice Receipt</h4>
                  <span className="text-[8px] font-black text-samridhi-success font-mono uppercase bg-samridhi-success/10 px-1.5 py-0.5 rounded border border-samridhi-success/15">Dynamic Impact</span>
                </div>
                <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">Inject a mock UPI freelance escrow payout transaction of ₹35,000 to instantly trigger cashflow score metrics.</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                // Play double beep sound
                try {
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  const ctx = new AudioContext();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain); gain.connect(ctx.destination);
                  osc.frequency.setValueAtTime(950, ctx.currentTime);
                  gain.gain.setValueAtTime(0.08, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);
                  osc.start(); osc.stop(ctx.currentTime + 0.18);
                } catch(e) {}

                const dateStr = new Date().toISOString().split('T')[0];
                const newCreditTx = {
                  id: window.generateUUID ? window.generateUUID() : `t-builder-${Date.now()}`,
                  date: dateStr,
                  merchant: "Fiverr Escrow Payout",
                  amount: 35000,
                  category: "Freelance Income",
                  type: "Credit"
                };
                
                if (dispatch) {
                  dispatch({ type: 'ADD_TRANSACTION', payload: newCreditTx });
                  alert("Simulated transaction injected: Received ₹35,000 from Fiverr Escrow! Telemetry score recalculated.");
                }
              }}
              className="bg-samridhi-success hover:brightness-110 text-samridhi-bg px-4.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer"
            >
              Inject ₹35,000 Credit
            </button>
          </div>

          {/* Item 4: Verify Skills On-Chain */}
          <div className="bg-white/[0.01] border border-white/[0.05] hover:border-samridhi-warning/30 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5">
              {(() => {
                const unverifiedSkillsCount = dashboardState.skills.filter(s => !s.verified).length;
                const hasSkills = dashboardState.skills.length > 0;
                const allSkillsVerified = hasSkills && unverifiedSkillsCount === 0;
                return (
                  <>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      allSkillsVerified 
                        ? 'bg-samridhi-warning/10 border-samridhi-warning/20 text-samridhi-warning'
                        : 'bg-white/[0.02] border-white/[0.08] text-samridhi-textMuted'
                    }`}>
                      {allSkillsVerified ? '✓' : '🎓'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">On-Chain Skill Certification verification</h4>
                        <span className="text-[8px] font-black text-samridhi-success font-mono uppercase bg-samridhi-success/10 px-1.5 py-0.5 rounded border border-samridhi-success/15">+4 pts per Skill</span>
                      </div>
                      <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">
                        Verify pending certificates. Verified certifications act as proxies for borrowing repayment capacity. ({dashboardState.skills.filter(s => s.verified).length}/{dashboardState.skills.length} verified)
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {dashboardState.skills.filter(s => !s.verified).length > 0 ? (
              <button 
                onClick={() => {
                  dashboardState.skills.forEach(s => {
                    if (!s.verified && dispatch) {
                      dispatch({ type: 'TOGGLE_SKILL_VERIFICATION', payload: s.id });
                    }
                  });
                  alert("Pending certifications signed and verified on-chain successfully!");
                }}
                className="bg-samridhi-warning hover:brightness-110 text-samridhi-bg px-4.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer"
              >
                Verify {dashboardState.skills.filter(s => !s.verified).length} Skills
              </button>
            ) : (
              <span className="px-4.5 py-2 bg-samridhi-warning/10 border border-samridhi-warning/20 rounded-xl text-[9.5px] font-black uppercase text-samridhi-warning tracking-wider shrink-0 select-none">
                All Verified ✔
              </span>
            )}
          </div>

          {/* Item 5: Toggle Aadhaar Identity KYC */}
          <div className="bg-white/[0.01] border border-white/[0.05] hover:border-samridhi-secondary/30 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                aadhaarVerified 
                  ? 'bg-samridhi-success/10 border-samridhi-success/20 text-samridhi-success'
                  : 'bg-white/[0.02] border-white/[0.08] text-samridhi-textMuted'
              }`}>
                {aadhaarVerified ? '✓' : '🆔'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Aadhaar Identity KYC Verification</h4>
                  <span className="text-[8px] font-black text-samridhi-success font-mono uppercase bg-samridhi-success/10 px-1.5 py-0.5 rounded border border-samridhi-success/15">+4 pts Impact</span>
                </div>
                <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">Link official UIDAI identity registry matches. Required for fraud deterrence assessment.</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (setAadhaarVerified) {
                  setAadhaarVerified(!aadhaarVerified);
                  alert(aadhaarVerified ? "Aadhaar disconnected. Telemetry score updated." : "Aadhaar identity registry matched successfully!");
                }
              }}
              className={`px-4.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer border ${
                aadhaarVerified 
                  ? 'bg-samridhi-success/10 border-samridhi-success/25 text-samridhi-success hover:bg-samridhi-success/20'
                  : 'bg-white/[0.02] border-white/[0.08] text-white hover:border-samridhi-success/50'
              }`}
            >
              {aadhaarVerified ? 'KYC Done ✔' : 'Link Aadhaar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
