// Dashboard Recommendations Tab Component for Samridhi
// Exposes DashboardRecommendationsTab globally

window.DashboardRecommendationsTab = ({
  user,
  calculatedScore,
  dispatch,
  setActiveTab
}) => {
  const { useState, useMemo } = React;
  
  const [compareOpen, setCompareOpen] = useState(false);
  
  // EMI Calculator state
  const [calcAmount, setCalcAmount] = useState(250000); // default ₹2,50,000
  const [calcRate, setCalcRate] = useState(11.5); // default 11.5%
  const [calcTenure, setCalcTenure] = useState(48); // default 48 months

  // Calculator maths
  const calculatorResults = useMemo(() => {
    const P = calcAmount;
    const r = calcRate / 12 / 100;
    const n = calcTenure;
    
    if (P <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0, principalPct: 0, interestPct: 0 };
    }
    
    const power = Math.pow(1 + r, n);
    const emi = (P * r * power) / (power - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    
    const principalPct = Math.round((P / totalPayable) * 100);
    const interestPct = 100 - principalPct;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      principalPct,
      interestPct
    };
  }, [calcAmount, calcRate, calcTenure]);

  // Donut SVG constants
  const donutRadius = 35;
  const donutCircumference = 2 * Math.PI * donutRadius; // 219.9
  const principalStroke = (calculatorResults.principalPct / 100) * donutCircumference;
  const interestStroke = (calculatorResults.interestPct / 100) * donutCircumference;

  const handleApply = (productName, lenderName, amount, rate, emi) => {
    dispatch({
      type: 'APPLY_LOAN',
      payload: {
        id: `l-${Date.now()}`,
        lender: lenderName,
        amount: amount,
        rate: `${rate}%`,
        emi: `₹${emi.toLocaleString()}`,
        status: "Active",
        date: new Date().toISOString().split('T')[0]
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        text: `Applied successfully for ${productName} with ${lenderName}. Dynamic contract registered.`,
        read: false,
        date: "Just now"
      }
    });

    if (setActiveTab) setActiveTab('overview');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* PROFILE SUMMARY BAR */}
      <div className="glass-card p-4.5 rounded-2xl shadow-lg border border-white/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-glow-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-8 bg-gradient-to-l from-samridhi-secondary/10 to-transparent pointer-events-none filter blur-xl"></div>
        <div className="flex flex-wrap items-center gap-4 text-samridhi-textMuted font-bold uppercase tracking-wider text-[10px]">
          <div>
            Score: <span className="text-samridhi-secondary font-black font-mono text-glow-secondary">{calculatedScore || 72} / 100</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden sm:block"></div>
          <div>
            Risk: <span className="text-samridhi-success font-black text-glow-success">LOW RISK</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden sm:block"></div>
          <div>
            Max Eligible: <span className="text-white font-black font-mono">₹5,00,000</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden sm:block"></div>
          <div>
            Profile: <span className="text-white font-black">{user.type}</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden sm:block"></div>
          <div>
            Income: <span className="text-white font-black font-mono">₹45,000/mo</span>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-samridhi-primary/10 border border-samridhi-primary/20 text-samridhi-primary rounded-lg font-bold text-[9px] uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-samridhi-primary animate-pulse"></div>
          <span>Capital Matcher Active</span>
        </div>
      </div>

      {/* 3 LOAN PRODUCT CARDS */}
      <div className="space-y-5">
        
        {/* Card 1: BEST MATCH Personal Loan (Metallic Gold Credit Card Design) */}
        <div className="relative p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ffd700]/5 bg-gradient-to-br from-[#ffd700]/10 via-[#b8860b]/5 to-[#0d0e15]/40 border-[#ffd700]/30 hover:border-[#ffd700]/60 space-y-4">
          <div className="absolute top-4 right-4 bg-[#ffd700] text-black font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-[#ffd700]/25">
            BEST MATCH
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-6 rounded bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] font-bold text-[10px]">GOLD</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider text-glow-primary">Gold Premium Loan</h3>
              </div>
              <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-1">Samridhi Capital Fund</span>
            </div>

            {/* Circular Fit Score */}
            <div className="flex items-center space-x-2 mr-24 sm:mr-0">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#ffd700" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset="5" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[9px] font-black text-[#ffd700] font-mono">95%</span>
              </div>
              <span className="text-[8px] text-samridhi-textMuted font-bold uppercase hidden sm:block">AI Fit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-white/[0.04]">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-white font-mono">₹2,50,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-[#ffd700] font-mono">₹5,847</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-white font-mono">48 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-[#ffd700] font-mono">11.5%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Collateral</span>
              <span className="font-extrabold text-samridhi-success">None Required</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Fee 1%</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Disbursal 2 days</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Dynamic Contract</span>
            </div>
            
            <button
              onClick={() => handleApply("Personal Loan", "Samridhi Capital Fund", 250000, 11.5, 5847)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-black uppercase tracking-wider rounded-xl shadow-lg shadow-[#ffd700]/10 transition-colors flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 2: Education Loan (Metallic Platinum Credit Card Design) */}
        <div className="relative p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5 bg-gradient-to-br from-[#e5e4e2]/15 via-[#708090]/5 to-[#0d0e15]/40 border-[#e5e4e2]/25 hover:border-[#e5e4e2]/55 space-y-4">
          <div className="absolute top-4 right-4 bg-white/10 border border-white/20 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-widest">
            POPULAR
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center text-[#e5e4e2] font-bold text-[9px]">PLATINUM</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider text-glow-secondary">Platinum Education Loan</h3>
              </div>
              <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-1">Vidyarthi Capital</span>
            </div>

            {/* Circular Fit Score */}
            <div className="flex items-center space-x-2 mr-24 sm:mr-0">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#00D4FF" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset="12" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[9px] font-black text-[#00D4FF] font-mono">88%</span>
              </div>
              <span className="text-[8px] text-samridhi-textMuted font-bold uppercase hidden sm:block">AI Fit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-white/[0.04]">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-white font-mono">₹5,00,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-[#00D4FF] font-mono">₹10,623</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-white font-mono">60 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-samridhi-success font-mono">9.8%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Moratorium</span>
              <span className="font-extrabold text-[#e5e4e2]">Available</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Tax benefit 80E</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Course Backed</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Flexible Tenure</span>
            </div>
            
            <button
              onClick={() => handleApply("Education Loan", "Vidyarthi Capital", 500000, 9.8, 10623)}
              className="w-full sm:w-auto px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#e5e4e2]/30 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 3: Business Micro Loan (Metallic Titanium/Bronze Credit Card Design) */}
        <div className="relative p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-samridhi-primary/5 bg-gradient-to-br from-[#8a9597]/10 via-[#3a4445]/5 to-[#0d0e15]/40 border-[#8a9597]/25 hover:border-[#8a9597]/55 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[#8a9597] font-bold text-[9px]">TITANIUM</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider text-glow-primary">Titanium Micro Loan</h3>
              </div>
              <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-1">Udyog MicroFund</span>
            </div>

            {/* Circular Fit Score */}
            <div className="flex items-center space-x-2 mr-24 sm:mr-0">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#D500F9" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset="24" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[9px] font-black text-[#D500F9] font-mono">76%</span>
              </div>
              <span className="text-[8px] text-samridhi-textMuted font-bold uppercase hidden sm:block">AI Fit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-white/[0.04]">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-white font-mono">₹1,00,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-samridhi-secondary font-mono">₹2,424</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-white font-mono">48 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-[#D500F9] font-mono">13.2%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Requirements</span>
              <span className="font-extrabold text-samridhi-warning">No GST Needed</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">Instant Approval</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">UPI-Verified Inflow</span>
              <span className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted rounded-lg font-bold text-[9px] uppercase tracking-wide">SME Eligible</span>
            </div>
            
            <button
              onClick={() => handleApply("Business Micro Loan", "Udyog MicroFund", 100000, 13.2, 2424)}
              className="w-full sm:w-auto px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#8a9597]/30 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* EMI CALCULATOR CARD */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary shadow-lg space-y-6">
        <div className="border-b border-white/[0.04] pb-3">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-primary">Interactive EMI Underwriting Calculator</h3>
          <p className="text-[10px] text-samridhi-textMuted mt-0.5 font-semibold">Calculate custom repayments using the sliders below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders (Col-7) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                <span>Loan Amount</span>
                <span className="text-samridhi-secondary font-black font-mono">₹{calcAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold font-mono">
                <span>₹10,000</span>
                <span>₹1,000,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                <span>Interest Rate</span>
                <span className="text-samridhi-success font-black font-mono">{calcRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="0.5"
                value={calcRate}
                onChange={(e) => setCalcRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold font-mono">
                <span>8%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                <span>Tenure</span>
                <span className="text-samridhi-primary font-black font-mono">{calcTenure} Months</span>
              </div>
              <input
                type="range"
                min="6"
                max="84"
                step="6"
                value={calcTenure}
                onChange={(e) => setCalcTenure(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold font-mono">
                <span>6 M</span>
                <span>84 M</span>
              </div>
            </div>
          </div>

          {/* Donut and Outputs (Col-5) */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/[0.06] p-4.5 rounded-2xl flex items-center justify-between gap-4">
            
            {/* SVG Donut Chart */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Back Track */}
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                {/* Principal Track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r={donutRadius} 
                  fill="transparent" 
                  stroke="#6C63FF" 
                  strokeWidth="8" 
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={donutCircumference - principalStroke}
                  strokeLinecap="round"
                />
                {/* Interest Track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r={donutRadius} 
                  fill="transparent" 
                  stroke="#FF5252" 
                  strokeWidth="8" 
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={-principalStroke}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-white">Split</span>
                <span className="text-[8px] text-samridhi-textMuted uppercase font-bold font-mono">P vs I</span>
              </div>
            </div>

            {/* Calculations text */}
            <div className="flex-1 space-y-3 font-semibold text-[11px]">
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold tracking-wider">Monthly EMI</span>
                <span className="text-sm font-black text-samridhi-secondary font-mono">₹{calculatorResults.emi.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold tracking-wider">Principal (Blue)</span>
                <span className="text-white font-mono">₹{calcAmount.toLocaleString()} ({calculatorResults.principalPct}%)</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold tracking-wider">Interest (Red)</span>
                <span className="text-samridhi-danger font-mono">₹{calculatorResults.totalInterest.toLocaleString()} ({calculatorResults.interestPct}%)</span>
              </div>
              <div className="border-t border-white/[0.04] pt-1.5">
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold tracking-wider">Total Payable</span>
                <span className="text-samridhi-success font-mono font-bold">₹{calculatorResults.totalPayable.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPARE ALL LOANS TABLE WIDGET */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-success space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-success">Underwriting Partner Comparisons</h3>
          
          <button
            onClick={() => setCompareOpen(!compareOpen)}
            className="px-3.5 py-1.5 bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/40 text-white font-black rounded-lg transition-all text-[10px] uppercase tracking-wider"
          >
            {compareOpen ? 'Hide Comparison' : 'Compare All Loans'}
          </button>
        </div>

        {compareOpen && (
          <div className="overflow-x-auto border border-white/[0.06] rounded-2xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06] text-white font-black uppercase text-[9px] tracking-wider">
                  <th className="py-3 px-4 sticky left-0 bg-[#0d0e15]/90 z-10 border-r border-white/[0.04]">Parameters</th>
                  <th className="py-3 px-4">Personal</th>
                  <th className="py-3 px-4">Education</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Gold Loan</th>
                  <th className="py-3 px-4">NBFC Quick</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] font-semibold">
                
                {/* Interest Rate */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Interest Rate</td>
                  <td className="py-2.5 px-4 text-white font-mono">11.5%</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-mono">9.8% (Best)</td>
                  <td className="py-2.5 px-4 text-white font-mono">13.2%</td>
                  <td className="py-2.5 px-4 text-white font-mono">10.5%</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5 font-mono">18.0% (Worst)</td>
                </tr>

                {/* Processing Fee */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Processing Fee</td>
                  <td className="py-2.5 px-4 text-white font-mono">1.0%</td>
                  <td className="py-2.5 px-4 text-white font-mono">1.5%</td>
                  <td className="py-2.5 px-4 text-white font-mono">2.0%</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-mono">0.5% (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5 font-mono">3.0% (Worst)</td>
                </tr>

                {/* Disbursal Time */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Disbursal Time</td>
                  <td className="py-2.5 px-4 text-white">2 days</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">7 days (Worst)</td>
                  <td className="py-2.5 px-4 text-white">3 days</td>
                  <td className="py-2.5 px-4 text-white">1 day</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-bold">2 hours (Best)</td>
                </tr>

                {/* Collateral */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Collateral</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">Yes (Worst)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                </tr>

                {/* Tax Benefit */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Tax Benefit</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">Yes (80E) (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                </tr>

                {/* Min Score Required */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Min Score</td>
                  <td className="py-2.5 px-4 text-white font-mono">65</td>
                  <td className="py-2.5 px-4 text-white font-mono">60</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5 font-mono">70 (Worst)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-mono">50 (Best)</td>
                  <td className="py-2.5 px-4 text-white font-mono">55</td>
                </tr>

                {/* AI Match */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">AI Match Score</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-mono font-bold">95% (Best)</td>
                  <td className="py-2.5 px-4 text-white font-mono">88%</td>
                  <td className="py-2.5 px-4 text-white font-mono">76%</td>
                  <td className="py-2.5 px-4 text-white font-mono">60%</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5 font-mono">50% (Worst)</td>
                </tr>

                {/* Max Amount */}
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-white">Max Amount</td>
                  <td className="py-2.5 px-4 text-white font-mono">₹2.5L</td>
                  <td className="py-2.5 px-4 text-white font-mono">₹5L</td>
                  <td className="py-2.5 px-4 text-white font-mono">₹1L</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5 font-mono font-bold">₹10L (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5 font-mono">₹50K (Worst)</td>
                </tr>

                {/* Best for you selection row */}
                <tr className="bg-samridhi-primary/5">
                  <td className="py-3 px-4 sticky left-0 bg-[#0d0e15]/95 z-10 border-r border-white/[0.04] font-extrabold text-samridhi-primary uppercase tracking-wider">Best For You</td>
                  <td className="py-3 px-4 font-black text-samridhi-primary" colSpan="5">
                    Personal Loan matched automatically (95% match index based on Freelancer profile stability)
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
