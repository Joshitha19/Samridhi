// Dashboard Score Factors Tab Component for Samridhi
// Exposes DashboardScoreTab globally

window.DashboardScoreTab = ({
  calculatedScore,
  dashboardState
}) => {
  const { useState, useEffect } = React;
  
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

  // SHAP Factors data
  const shapFactors = [
    { label: "UPI consistency", impact: 9.2, positive: true },
    { label: "Monthly income", impact: 7.8, positive: true },
    { label: "Skill certifications", impact: 6.1, positive: true },
    { label: "Merchant diversity", impact: 2.9, positive: true },
    { label: "Short credit history", impact: -5.4, positive: false },
    { label: "Low transaction age", impact: -3.2, positive: false }
  ];

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
      
      {/* SECTION 1 - Score Header (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Gauge & History */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 justify-between border border-white/[0.04] border-glow-success">
          
          <div className="flex flex-col items-center shrink-0">
            {/* 200px Gauge */}
            <div className="relative w-48 h-48">
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
                <span className="text-5xl font-black text-white leading-none font-mono text-glow-success">{targetScore}</span>
                <span className="text-[9px] tracking-widest text-samridhi-textMuted font-black uppercase mt-2">AI Rating</span>
              </div>
            </div>
            
            <span className="text-[9px] text-samridhi-textMuted font-bold mt-3 uppercase tracking-wider">Last updated: 22 May 2026</span>
            <div className="mt-2.5 px-3.5 py-1 rounded-full bg-samridhi-success/10 border border-samridhi-success/35 text-samridhi-success font-black tracking-widest text-[9px] text-glow-success animate-pulse">
              LOW RISK
            </div>
          </div>

          {/* History Chart */}
          <div className="flex-1 w-full space-y-3">
            <h4 className="font-extrabold text-[9px] text-samridhi-textMuted uppercase tracking-wider">Score Progression</h4>
            
            {/* SVG History Chart */}
            <div className="bg-white/[0.01] border border-white/[0.05] p-3.5 rounded-xl">
              <svg className="w-full h-24" viewBox="0 0 240 100">
                {/* Grid Lines */}
                <line x1="25" y1="20" x2="230" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="25" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="25" y1="80" x2="230" y2="80" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                
                {/* Month Labels */}
                <text x="25" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Jan</text>
                <text x="75" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Feb</text>
                <text x="125" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Mar</text>
                <text x="175" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">Apr</text>
                <text x="225" y="95" fill="#8888AA" fontSize="9" fontWeight="bold" textAnchor="middle">May</text>
                
                {/* Score Labels */}
                <text x="18" y="23" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">80</text>
                <text x="18" y="53" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">60</text>
                <text x="18" y="83" fill="#8888AA" fontSize="8" fontWeight="bold" textAnchor="end">40</text>

                {/* Polyline */}
                <polyline
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2.5"
                  points="25,52 75,49 125,43 175,37 225,32"
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Dots at points */}
                <circle cx="25" cy="52" r="3.5" fill="#00D4FF" />
                <circle cx="75" cy="49" r="3.5" fill="#00D4FF" />
                <circle cx="125" cy="43" r="3.5" fill="#00D4FF" />
                <circle cx="175" cy="37" r="3.5" fill="#00D4FF" />
                <circle cx="225" cy="32" r="3.5" fill="#00D4FF" />
                
                {/* Point values */}
                <text x="25" y="44" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">58</text>
                <text x="75" y="41" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">61</text>
                <text x="125" y="35" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">65</text>
                <text x="175" y="29" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">69</text>
                <text x="225" y="24" fill="#F0F0FF" fontSize="8" fontWeight="black" textAnchor="middle">72</text>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SHAP Bar Chart */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Why this score?</h4>
            <p className="text-[11px] text-samridhi-textMuted mt-1 font-semibold">SHAP values indicating features driving score shifts vs baseline.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {shapFactors.map((item, idx) => {
              const impactPct = Math.min(100, Math.abs(item.impact) * 8); // Scale for visuals
              return (
                <div key={idx} className="flex items-center space-x-3 text-[11px]">
                  {/* Factor Label */}
                  <span className="w-28 text-samridhi-textMuted truncate font-extrabold uppercase tracking-wide text-[9px]">{item.label}</span>
                  
                  {/* Horizontal Bar container */}
                  <div className="flex-1 h-3 bg-white/[0.02] border border-white/[0.06] rounded overflow-hidden relative">
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
                  <span className={`w-12 text-right font-black font-mono ${
                    item.positive ? 'text-samridhi-success' : 'text-samridhi-danger'
                  }`}>
                    {item.positive ? '+' : ''}{item.impact}
                  </span>
                </div>
              );
            })}
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

      {/* SECTION 3 - Improvement Roadmap */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/[0.04]">
        <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-white/[0.04] pb-3">
          How to reach 85+ score
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1 */}
          <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* Book icon */}
                <div className="w-8 h-8 rounded-lg bg-samridhi-primary/10 flex items-center justify-center text-samridhi-primary">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Add 2 certifications</h4>
              </div>
              <p className="text-[10px] text-samridhi-textMuted leading-normal font-semibold">
                Verifying advanced skill credentials adds verified repayment earning parameters.
              </p>
              <div className="text-[10px] font-black text-samridhi-success font-mono">+6 points</div>
            </div>
            
            <button className="w-full text-center border border-white/[0.08] hover:border-samridhi-primary/50 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all">
              Start Now
            </button>
          </div>

          {/* Action 2 */}
          <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* Credit card icon */}
                <div className="w-8 h-8 rounded-lg bg-samridhi-secondary/10 flex items-center justify-center text-samridhi-secondary">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Pay utilities via UPI</h4>
              </div>
              <p className="text-[10px] text-samridhi-textMuted leading-normal font-semibold">
                Establish household spending utility indices. Standard utility streams denote structural stability.
              </p>
              <div className="text-[10px] font-black text-samridhi-success font-mono">+4 points</div>
            </div>
            
            <button className="w-full text-center border border-white/[0.08] hover:border-samridhi-primary/50 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all">
              Start Now
            </button>
          </div>

          {/* Action 3 */}
          <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* Calendar icon */}
                <div className="w-8 h-8 rounded-lg bg-samridhi-success/10 flex items-center justify-center text-samridhi-success">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">6 months history</h4>
              </div>
              <p className="text-[10px] text-samridhi-textMuted leading-normal font-semibold">
                Accumulate transaction history length indicators to bolster score security weight.
              </p>
              <div className="text-[10px] font-black text-samridhi-success font-mono">+3 points</div>
            </div>
            
            <button className="w-full text-center border border-white/[0.08] hover:border-samridhi-primary/50 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all">
              Start Now
            </button>
          </div>

        </div>
      </div>
    </div>

    </div>
  );
};
