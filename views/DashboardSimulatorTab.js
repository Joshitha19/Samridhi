// Dashboard Score Simulator Tab Component for Samridhi
// Exposes DashboardSimulatorTab globally

window.DashboardSimulatorTab = ({
  calculatedScore,
  setActiveTab
}) => {
  const { useState, useMemo, useEffect } = React;

  const [mounted, setMounted] = useState(false);

  // Sliders state
  const [simIncome, setSimIncome] = useState(45000);       // ₹10k - ₹2L
  const [simUpi, setSimUpi] = useState(38);                 // 0 - 100
  const [simCerts, setSimCerts] = useState(4);              // 0 - 10
  const [simHistory, setSimHistory] = useState(4);          // 1 - 24 months
  const [simRepay, setSimRepay] = useState(100);            // 0 - 100%

  useEffect(() => {
    setMounted(true);
  }, []);

  // Maths for predicted score calculations
  const simulationResults = useMemo(() => {
    const baseline = 72;
    
    // Income calculation
    let deltaIncome = 0;
    if (simIncome > 45000) {
      deltaIncome = Math.min(12, Math.round((simIncome - 45000) / 12900));
    } else if (simIncome < 45000) {
      deltaIncome = Math.max(-15, Math.round((simIncome - 45000) / 2300));
    }

    // UPI frequency calculation
    let deltaUpi = 0;
    if (simUpi > 38) {
      deltaUpi = Math.min(8, Math.round((simUpi - 38) / 7.7));
    } else if (simUpi < 38) {
      deltaUpi = Math.max(-10, Math.round((simUpi - 38) / 3.8));
    }

    // Certifications calculation
    let deltaCerts = 0;
    if (simCerts > 4) {
      deltaCerts = Math.min(12, (simCerts - 4) * 2);
    } else if (simCerts < 4) {
      deltaCerts = Math.max(-8, (simCerts - 4) * 2);
    }

    // Account history length calculation
    let deltaHistory = 0;
    if (simHistory > 4) {
      deltaHistory = Math.min(10, Math.round((simHistory - 4) * 0.5));
    } else if (simHistory < 4) {
      deltaHistory = Math.max(-3, Math.round((simHistory - 4) * 1));
    }

    // Repayment rate calculation (strong weight)
    let deltaRepay = 0;
    if (simRepay < 100) {
      deltaRepay = Math.max(-35, Math.round((simRepay - 100) * 0.35));
    }

    const predicted = Math.max(10, Math.min(100, baseline + deltaIncome + deltaUpi + deltaCerts + deltaHistory + deltaRepay));
    const deltaTotal = predicted - baseline;

    // Build explanations list
    const explanations = [];
    if (deltaIncome > 0) {
      explanations.push({ text: "Higher earnings verified: Multiplies available debt capacity", value: `+${deltaIncome}`, positive: true });
    } else if (deltaIncome < 0) {
      explanations.push({ text: "Low income signal: Increases structural debt-to-income risk", value: `${deltaIncome}`, positive: false });
    }

    if (deltaUpi > 0) {
      explanations.push({ text: "High transaction density: Denotes strong active cash velocity", value: `+${deltaUpi}`, positive: true });
    } else if (deltaUpi < 0) {
      explanations.push({ text: "Low transaction frequency: Reduces alternate activity scores", value: `${deltaUpi}`, positive: false });
    }

    if (deltaCerts > 0) {
      explanations.push({ text: "Additional skills credentials: Boosts estimated earning potential", value: `+${deltaCerts}`, positive: true });
    } else if (deltaCerts < 0) {
      explanations.push({ text: "Fewer verified skills: Lowers professional credibility weight", value: `${deltaCerts}`, positive: false });
    }

    if (deltaHistory > 0) {
      explanations.push({ text: "Prolonged timeline age: Increases historical underwriting confidence", value: `+${deltaHistory}`, positive: true });
    } else if (deltaHistory < 0) {
      explanations.push({ text: "Shorter statement history: Restricts reliable trend averages", value: `${deltaHistory}`, positive: false });
    }

    if (deltaRepay < 0) {
      explanations.push({ text: "Repayment rate drop: Violates micro-credit covenants", value: `${deltaRepay}`, positive: false });
    }

    return {
      predicted,
      deltaTotal,
      explanations
    };
  }, [simIncome, simUpi, simCerts, simHistory, simRepay]);

  // SVG Gauge constants
  const gaugeRadius = 75;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius; // 471.2
  const offsetValue = gaugeCircumference - (gaugeCircumference * simulationResults.predicted) / 100;

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Overview intro */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Interactive AI Score Simulator</h2>
          <p className="text-xs text-samridhi-textMuted">Adjust hypothetical telemetry variables and watch predicted score variations in real time.</p>
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-samridhi-secondary/15 border border-samridhi-secondary/35 text-samridhi-secondary rounded-lg font-bold">
          <span>Sandbox Mode Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Panel (Col-7) */}
        <div className="lg:col-span-7 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-6">
          <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-3">
            Predictive Score Inputs
          </h3>

          {/* Income Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-samridhi-textMuted uppercase text-[10px]">
              <span>Monthly Income</span>
              <span className="text-samridhi-secondary font-black">₹{simIncome.toLocaleString()}</span>
            </div>
            <input 
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={simIncome}
              onChange={(e) => setSimIncome(parseInt(e.target.value))}
              className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
              <span>₹10,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* UPI frequency Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-samridhi-textMuted uppercase text-[10px]">
              <span>UPI Transactions / Month</span>
              <span className="text-samridhi-secondary font-black">{simUpi} Transactions</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              value={simUpi}
              onChange={(e) => setSimUpi(parseInt(e.target.value))}
              className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
              <span>0 Tx/mo</span>
              <span>100 Tx/mo</span>
            </div>
          </div>

          {/* Certifications Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-samridhi-textMuted uppercase text-[10px]">
              <span>Number of Certifications</span>
              <span className="text-samridhi-secondary font-black">{simCerts} Certificates</span>
            </div>
            <input 
              type="range"
              min="0"
              max="10"
              step="1"
              value={simCerts}
              onChange={(e) => setSimCerts(parseInt(e.target.value))}
              className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
              <span>0 Certs</span>
              <span>10 Certs</span>
            </div>
          </div>

          {/* History Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-samridhi-textMuted uppercase text-[10px]">
              <span>Months of Account History</span>
              <span className="text-samridhi-secondary font-black">{simHistory} Months</span>
            </div>
            <input 
              type="range"
              min="1"
              max="24"
              step="1"
              value={simHistory}
              onChange={(e) => setSimHistory(parseInt(e.target.value))}
              className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
              <span>1 Month</span>
              <span>24 Months</span>
            </div>
          </div>

          {/* Repayment Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-samridhi-textMuted uppercase text-[10px]">
              <span>Repayment Rate</span>
              <span className="text-samridhi-secondary font-black">{simRepay}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              value={simRepay}
              onChange={(e) => setSimRepay(parseInt(e.target.value))}
              className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
              <span>0% Repay</span>
              <span>100% Repay</span>
            </div>
          </div>

        </div>

        {/* Gauge & Predicted Outputs (Col-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Gauge card */}
          <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-4">
              <span className="text-[9px] uppercase font-bold text-samridhi-textMuted tracking-wider">Simulated Score</span>
            </div>
            
            {/* SVG Arc Gauge */}
            <div className="relative w-44 h-44 mt-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
                <circle
                  className="text-samridhi-border"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r={gaugeRadius}
                  cx="90"
                  cy="90"
                />
                <circle
                  stroke="#6C63FF"
                  strokeWidth="10"
                  fill="transparent"
                  r={gaugeRadius}
                  cx="90"
                  cy="90"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={offsetValue}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(108, 99, 255, 0.4))'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-samridhi-textPrimary leading-none">
                  {simulationResults.predicted}
                </span>
                <span className="text-[9px] tracking-wider text-samridhi-textMuted font-bold uppercase mt-2">Predicted</span>
              </div>
            </div>

            {/* Delta badge */}
            <div className="mt-4">
              {simulationResults.deltaTotal > 0 ? (
                <span className="px-3.5 py-1 rounded-full bg-samridhi-success/15 border border-samridhi-success/30 text-samridhi-success font-black text-[10px] tracking-wider">
                  +{simulationResults.deltaTotal} points vs current
                </span>
              ) : simulationResults.deltaTotal < 0 ? (
                <span className="px-3.5 py-1 rounded-full bg-samridhi-danger/15 border border-samridhi-danger/30 text-samridhi-danger font-black text-[10px] tracking-wider">
                  {simulationResults.deltaTotal} points vs current
                </span>
              ) : (
                <span className="px-3.5 py-1 rounded-full bg-samridhi-surface border border-samridhi-border text-samridhi-textMuted font-black text-[10px] tracking-wider">
                  Unchanged
                </span>
              )}
            </div>
          </div>

          {/* Explanations card */}
          <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl shadow-lg flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-extrabold text-[10px] text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/40 pb-2">
                What changed?
              </h4>
              
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {simulationResults.explanations.length === 0 ? (
                  <p className="text-[10px] text-samridhi-textMuted leading-normal text-center py-4">No deviations from baseline profile settings detected.</p>
                ) : (
                  simulationResults.explanations.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between space-x-2 border-b border-samridhi-border/20 pb-2">
                      <span className="text-[10px] text-samridhi-textPrimary leading-normal font-semibold">
                        {item.text}
                      </span>
                      <span className={`font-black font-mono shrink-0 text-[10px] ${
                        item.positive ? 'text-samridhi-success' : 'text-samridhi-danger'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('profile');
              }}
              className="mt-6 w-full py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-extrabold rounded-xl text-xs shadow-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>Apply these changes in real life</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
