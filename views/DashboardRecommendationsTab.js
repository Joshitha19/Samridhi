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
      <div className="bg-samridhi-card border border-samridhi-border p-4.5 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-samridhi-textMuted font-bold uppercase tracking-wider text-[10px]">
          <div>
            Score: <span className="text-samridhi-secondary font-black">{calculatedScore || 72} / 100</span>
          </div>
          <div className="h-4 w-px bg-samridhi-border hidden sm:block"></div>
          <div>
            Risk: <span className="text-samridhi-success font-black">LOW</span>
          </div>
          <div className="h-4 w-px bg-samridhi-border hidden sm:block"></div>
          <div>
            Max Eligible: <span className="text-samridhi-textPrimary font-black">₹5,00,000</span>
          </div>
          <div className="h-4 w-px bg-samridhi-border hidden sm:block"></div>
          <div>
            Profile: <span className="text-samridhi-textPrimary font-black">{user.type}</span>
          </div>
          <div className="h-4 w-px bg-samridhi-border hidden sm:block"></div>
          <div>
            Income: <span className="text-samridhi-textPrimary font-black">₹45,000/mo</span>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-samridhi-primary/10 border border-samridhi-primary/20 text-samridhi-primary rounded-lg font-bold">
          <span>Capital Matcher Active</span>
        </div>
      </div>

      {/* 3 LOAN PRODUCT CARDS */}
      <div className="space-y-5">
        
        {/* Card 1: BEST MATCH Personal Loan */}
        <div className="bg-samridhi-card border-2 border-samridhi-primary/45 p-6 rounded-2xl relative shadow-xl shadow-samridhi-primary/5 space-y-4">
          <div className="absolute top-4 right-4 bg-samridhi-primary text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
            BEST MATCH
          </div>
          
          <div>
            <h3 className="text-base font-extrabold text-samridhi-textPrimary">Personal Loan</h3>
            <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-0.5">Samridhi Capital Fund</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-samridhi-border/40">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-samridhi-textPrimary">₹2,50,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-samridhi-secondary">₹5,847</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-samridhi-textPrimary">48 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-samridhi-success">11.5%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">AI Match Score</span>
              <span className="font-black text-samridhi-primary">95%</span>
            </div>
          </div>

          {/* Match Score bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-samridhi-textMuted uppercase">
              <span>Match Rating</span>
              <span className="text-samridhi-secondary">95% Match</span>
            </div>
            <div className="w-full bg-samridhi-surface h-2 rounded-full overflow-hidden border border-samridhi-border">
              <div className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full" style={{ width: '95%' }}></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Processing Fee 1%</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Disbursal 2 days</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">No collateral</span>
            </div>
            
            <button
              onClick={() => handleApply("Personal Loan", "Samridhi Capital Fund", 250000, 11.5, 5847)}
              className="w-full sm:w-auto px-5 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-extrabold rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 2: Education Loan */}
        <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4 shadow-lg">
          <div>
            <h3 className="text-base font-extrabold text-samridhi-textPrimary">Education Loan</h3>
            <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-0.5">Vidyarthi Capital</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-samridhi-border/40">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-samridhi-textPrimary">₹5,00,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-samridhi-secondary">₹10,623</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-samridhi-textPrimary">60 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-samridhi-success">9.8%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">AI Match Score</span>
              <span className="font-black text-samridhi-primary">88%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-samridhi-textMuted uppercase">
              <span>Match Rating</span>
              <span className="text-samridhi-secondary">88% Match</span>
            </div>
            <div className="w-full bg-samridhi-surface h-2 rounded-full overflow-hidden border border-samridhi-border">
              <div className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Tax benefit 80E</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Moratorium available</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Skill-backed</span>
            </div>
            
            <button
              onClick={() => handleApply("Education Loan", "Vidyarthi Capital", 500000, 9.8, 10623)}
              className="w-full sm:w-auto px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textPrimary font-extrabold rounded-xl transition-colors flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 3: Business Micro Loan */}
        <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4 shadow-lg">
          <div>
            <h3 className="text-base font-extrabold text-samridhi-textPrimary">Business Micro Loan</h3>
            <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-0.5">Udyog MicroFund</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-3 border-y border-samridhi-border/40">
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Amount</span>
              <span className="font-extrabold text-samridhi-textPrimary">₹1,00,000</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">EMI / Month</span>
              <span className="font-extrabold text-samridhi-secondary">₹2,424</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Tenure</span>
              <span className="font-extrabold text-samridhi-textPrimary">48 Months</span>
            </div>
            <div>
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">Rate p.a.</span>
              <span className="font-extrabold text-samridhi-success">13.2%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-samridhi-textMuted uppercase font-bold block">AI Match Score</span>
              <span className="font-black text-samridhi-primary">76%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-samridhi-textMuted uppercase">
              <span>Match Rating</span>
              <span className="text-samridhi-secondary">76% Match</span>
            </div>
            <div className="w-full bg-samridhi-surface h-2 rounded-full overflow-hidden border border-samridhi-border">
              <div className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full" style={{ width: '76%' }}></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">Instant approval</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">GST not required</span>
              <span className="px-2.5 py-1 bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted rounded-lg font-bold text-[9px]">UPI-verified</span>
            </div>
            
            <button
              onClick={() => handleApply("Business Micro Loan", "Udyog MicroFund", 100000, 13.2, 2424)}
              className="w-full sm:w-auto px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textPrimary font-extrabold rounded-xl transition-colors flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Apply Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* EMI CALCULATOR CARD */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-6">
        <div className="border-b border-samridhi-border/40 pb-3">
          <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Interactive EMI Underwriting Calculator</h3>
          <p className="text-[10px] text-samridhi-textMuted mt-0.5">Calculate custom repayments using the sliders below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders (Col-7) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase">
                <span>Loan Amount</span>
                <span className="text-samridhi-secondary font-black">₹{calcAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
                <span>₹10,000</span>
                <span>₹10,000,00</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase">
                <span>Interest Rate</span>
                <span className="text-samridhi-success font-black">{calcRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="0.5"
                value={calcRate}
                onChange={(e) => setCalcRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
                <span>8%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase">
                <span>Tenure</span>
                <span className="text-samridhi-primary font-black">{calcTenure} Months</span>
              </div>
              <input
                type="range"
                min="6"
                max="84"
                step="6"
                value={calcTenure}
                onChange={(e) => setCalcTenure(parseInt(e.target.value))}
                className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
                <span>6 Months</span>
                <span>84 Months</span>
              </div>
            </div>
          </div>

          {/* Donut and Outputs (Col-5) */}
          <div className="lg:col-span-5 bg-samridhi-surface/50 border border-samridhi-border p-4.5 rounded-xl flex items-center justify-between gap-4">
            
            {/* SVG Donut Chart */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Back Track */}
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#2A2A3E" strokeWidth="8" />
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
                <span className="text-[10px] font-black text-samridhi-textPrimary">Split</span>
                <span className="text-[8px] text-samridhi-textMuted uppercase font-bold">P vs I</span>
              </div>
            </div>

            {/* Calculations text */}
            <div className="flex-1 space-y-3 font-semibold text-[11px]">
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Monthly EMI</span>
                <span className="text-sm font-black text-samridhi-secondary">₹{calculatorResults.emi.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Principal (Blue)</span>
                <span className="text-samridhi-textPrimary">₹{calcAmount.toLocaleString()} ({calculatorResults.principalPct}%)</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Total Interest (Red)</span>
                <span className="text-samridhi-danger">₹{calculatorResults.totalInterest.toLocaleString()} ({calculatorResults.interestPct}%)</span>
              </div>
              <div className="border-t border-samridhi-border/40 pt-1.5">
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Total Payable</span>
                <span className="text-samridhi-success">₹{calculatorResults.totalPayable.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPARE ALL LOANS TABLE WIDGET */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-samridhi-border/40 pb-3">
          <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Underwriting Partner Comparisons</h3>
          
          <button
            onClick={() => setCompareOpen(!compareOpen)}
            className="px-3 py-1.5 bg-samridhi-surface border border-samridhi-border hover:border-samridhi-primary/40 text-samridhi-textPrimary font-bold rounded-lg hover:-translate-y-0.5 transition-all text-[10px] uppercase tracking-wider"
          >
            {compareOpen ? 'Hide Comparison' : 'Compare All Loans'}
          </button>
        </div>

        {compareOpen && (
          <div className="overflow-x-auto border border-samridhi-border rounded-xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-samridhi-surface border-b border-samridhi-border text-samridhi-textPrimary font-black uppercase text-[9px] tracking-wider">
                  <th className="py-3 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50">Parameters</th>
                  <th className="py-3 px-4">Personal</th>
                  <th className="py-3 px-4">Education</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Gold Loan</th>
                  <th className="py-3 px-4">NBFC Quick</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-samridhi-border/30 font-semibold">
                
                {/* Interest Rate */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Interest Rate</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">11.5%</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">9.8% (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">13.2%</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">10.5%</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">18.0% (Worst)</td>
                </tr>

                {/* Processing Fee */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Processing Fee</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">1.0%</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">1.5%</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">2.0%</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">0.5% (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">3.0% (Worst)</td>
                </tr>

                {/* Disbursal Time */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Disbursal Time</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">2 days</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">7 days (Worst)</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">3 days</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">1 day</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">2 hours (Best)</td>
                </tr>

                {/* Collateral */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Collateral</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">Yes (Worst)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">No (Best)</td>
                </tr>

                {/* Tax Benefit */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Tax Benefit</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">Yes (80E) (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                  <td className="py-2.5 px-4 text-samridhi-textMuted">No</td>
                </tr>

                {/* Min Score Required */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Min Score</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">65</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">60</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">70 (Worst)</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">50 (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">55</td>
                </tr>

                {/* AI Match */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">AI Match Score</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">95% (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">88%</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">76%</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">60%</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">50% (Worst)</td>
                </tr>

                {/* Max Amount */}
                <tr>
                  <td className="py-2.5 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-textPrimary">Max Amount</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">₹2.5L</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">₹5L</td>
                  <td className="py-2.5 px-4 text-samridhi-textPrimary">₹1L</td>
                  <td className="py-2.5 px-4 text-samridhi-success bg-samridhi-success/5">₹10L (Best)</td>
                  <td className="py-2.5 px-4 text-samridhi-danger bg-samridhi-danger/5">₹50K (Worst)</td>
                </tr>

                {/* Best for you selection row */}
                <tr className="bg-samridhi-primary/5">
                  <td className="py-3 px-4 sticky left-0 bg-samridhi-surface z-10 border-r border-samridhi-border/50 font-extrabold text-samridhi-primary uppercase tracking-wider">Best For You</td>
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
