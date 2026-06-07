// Loan Apply Wizard Stepper Component for Samridhi
// Exposes the LoanWizard React component globally

window.LoanWizard = ({ calculatedScore, dispatch, user, setActiveTab }) => {
  const { useState, useEffect, useMemo } = React;
  
  const [wizardStep, setWizardStep] = useState(1);
  
  // Form fields
  const [loanAmount, setLoanAmount] = useState(75000);
  const [loanTenure, setLoanTenure] = useState(12);
  const [loanPurpose, setLoanPurpose] = useState('Business Tools');

  // Processing simulated screens
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMsg, setProcessingMsg] = useState('');

  useEffect(() => {
    if (wizardStep === 2) {
      // Trigger parsing simulation
      setProcessingProgress(0);
      setProcessingMsg('Initializing UPI Stream Linker...');
      
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setWizardStep(3), 600);
            return 100;
          }
          const stepInc = Math.floor(Math.random() * 20) + 10;
          const nextVal = Math.min(100, prev + stepInc);

          if (nextVal < 40) setProcessingMsg('Parsing digital UPI transaction statements...');
          else if (nextVal < 70) setProcessingMsg('Analyzing Cashflow Stability & Inflow intervals...');
          else if (nextVal < 95) setProcessingMsg('Scanning government registry profiles (PAN/UIDAI)...');
          else setProcessingMsg('Synthesizing dynamic credit metrics...');

          return nextVal;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [wizardStep]);

  // Handle final decision terms
  const interestRate = useMemo(() => {
    if (calculatedScore >= 75) return 8.5; // Premium
    if (calculatedScore >= 60) return 10.2; // Regular
    if (calculatedScore >= 45) return 12.0; // Subprime
    return 14.5;
  }, [calculatedScore]);

  const monthlyEMI = useMemo(() => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const ratePerMonth = annualRate / 12;
    const months = loanTenure;
    // Simple EMI calculation formula
    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
    return Math.round(emi);
  }, [loanAmount, loanTenure, interestRate]);

  const isApproved = calculatedScore >= 41;

  return (
    <div className="space-y-6">
      {/* STEP INDICATORS */}
      <div className="flex items-center justify-between text-[11px] font-bold text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/30 pb-3 mb-6">
        <span className={wizardStep === 1 ? 'text-samridhi-primary font-black' : ''}>1. Customize Capital</span>
        <span>&gt;</span>
        <span className={wizardStep === 2 ? 'text-samridhi-secondary font-black animate-pulse' : ''}>2. Parse Telemetry</span>
        <span>&gt;</span>
        <span className={wizardStep === 3 ? 'text-samridhi-success font-black' : ''}>3. Underwriting Decision</span>
      </div>

      {/* STEP 1: PARAMETERIZE */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sliders */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-samridhi-textMuted uppercase">
                  <span>Loan capital Amount</span>
                  <span className="text-samridhi-secondary font-black">₹{loanAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="300000" 
                  step="5000"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
                  <span>₹10,000</span>
                  <span>₹3,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-samridhi-textMuted uppercase">
                  <span>Repayment tenure</span>
                  <span className="text-samridhi-secondary font-black">{loanTenure} Months</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="24" 
                  step="3"
                  value={loanTenure} 
                  onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-samridhi-textMuted font-bold">
                  <span>3 Months</span>
                  <span>24 Months</span>
                </div>
              </div>
            </div>

            {/* Dropdown & Details */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5 text-xs">
                <label className="font-bold text-samridhi-textMuted uppercase tracking-wider">Capital Purpose</label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-colors"
                >
                  <option value="Business Tools">Professional / Freelance tools (Laptop, Software licenses)</option>
                  <option value="Inventory Expansion">Inventory purchase / Stock replenishment</option>
                  <option value="Vocational Fees">Educational / Up-skilling vocational training fees</option>
                  <option value="Working Capital">Daily working capital (Gig-worker cash buffer)</option>
                </select>
              </div>

              {/* Quick terms estimate based on user type */}
              <div className="bg-samridhi-surface border border-samridhi-border/60 p-4 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-samridhi-textPrimary">Underwriting Estimate</h4>
                <p className="text-[11px] text-samridhi-textMuted">
                  Based on your current AI credit rating of <strong className="text-samridhi-secondary">{calculatedScore}</strong>, you qualify for an estimated interest rate of <strong className="text-samridhi-success">~{interestRate}% p.a.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-samridhi-border/40">
            <button
              onClick={() => setWizardStep(2)}
              className="px-6 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center space-x-1"
            >
              <span>Link Digital Telemetry</span>
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TELEMETRY PROCESSING */}
      {wizardStep === 2 && (
        <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-samridhi-secondary border-samridhi-border animate-spin flex items-center justify-center mb-2">
            <span className="text-xl">📊</span>
          </div>
          
          <div className="w-full max-w-xs space-y-2">
            <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">{processingProgress}% Complete</h4>
            <div className="w-full bg-samridhi-bg h-2 rounded-full overflow-hidden border border-samridhi-border">
              <div className="bg-samridhi-secondary h-full transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
            </div>
          </div>

          <p className="text-xs text-samridhi-textMuted font-bold italic animate-pulse">
            {processingMsg}
          </p>
        </div>
      )}

      {/* STEP 3: CONTRACT DECISION */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          {isApproved ? (
            /* APPROVED SCREEN */
            <div className="space-y-6">
              <div className="bg-samridhi-success/5 border border-samridhi-success/35 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-samridhi-success/20 flex items-center justify-center text-2xl text-samridhi-success shrink-0">
                  ✓
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-samridhi-success tracking-widest bg-samridhi-success/10 px-2.5 py-0.5 rounded">Decision: Approved</span>
                  <h3 className="font-extrabold text-base text-samridhi-textPrimary mt-1.5">Capital Offer Generated Successfully</h3>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed mt-1">
                    Our alternative risk assessment models evaluate you as a qualified credit-invisible prospect. Institutional capital matching has succeeded.
                  </p>
                </div>
              </div>

              {/* Contract terms card */}
              <div className="bg-samridhi-surface border border-samridhi-border p-6 rounded-2xl space-y-4">
                <h4 className="font-black text-xs text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-2.5">Credit Agreement Summary</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Principal Capital</span>
                    <span className="font-black text-sm text-samridhi-textPrimary">₹{loanAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Interest Rate</span>
                    <span className="font-black text-sm text-samridhi-success">{interestRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Repayment Term</span>
                    <span className="font-black text-sm text-samridhi-textPrimary">{loanTenure} Months</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Estimated EMI</span>
                    <span className="font-black text-sm text-samridhi-secondary">₹{monthlyEMI.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-samridhi-border/40">
                <button
                  onClick={() => setWizardStep(1)}
                  className="text-xs font-bold text-samridhi-textMuted hover:text-samridhi-textPrimary transition-colors"
                >
                  Change Amount
                </button>
                
                <button
                  onClick={() => {
                    dispatch({
                      type: 'APPLY_LOAN',
                      payload: {
                        id: `l-${Date.now()}`,
                        lender: "Samridhi Capital Fund",
                        amount: loanAmount,
                        rate: `${interestRate}%`,
                        emi: `₹${monthlyEMI.toLocaleString()}`,
                        status: "Active",
                        date: new Date().toISOString().split('T')[0]
                      }
                    });
                    dispatch({
                      type: 'ADD_NOTIFICATION',
                      payload: {
                        id: `n-${Date.now()}`,
                        text: `Contract Signed: Active micro-loan of ₹${loanAmount.toLocaleString()} generated.`,
                        read: false,
                        date: "Just now"
                      }
                    });
                    // Advance wizard to success screen (step 4)
                    setWizardStep(4);
                  }}
                  className="px-6 py-2.5 bg-samridhi-success hover:bg-samridhi-success/90 text-samridhi-bg font-extrabold rounded-xl text-xs shadow-lg transition-colors flex items-center space-x-1"
                >
                  <span>Sign Credit Contract</span>
                </button>
              </div>
            </div>
          ) : (
            /* REJECTED SCREEN */
            <div className="space-y-6">
              <div className="bg-samridhi-danger/5 border border-samridhi-danger/35 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-samridhi-danger/20 flex items-center justify-center text-2xl text-samridhi-danger shrink-0">
                  !
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-samridhi-danger tracking-widest bg-samridhi-danger/10 px-2.5 py-0.5 rounded">Decision: Under Review</span>
                  <h3 className="font-extrabold text-base text-samridhi-textPrimary mt-1.5">Insuffient Credibility Score</h3>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed mt-1">
                    Your credit rating of <strong className="text-samridhi-danger">{calculatedScore}</strong> is below the minimum partner threshold (41).
                  </p>
                </div>
              </div>

              <div className="bg-samridhi-surface border border-samridhi-border p-6 rounded-2xl text-xs space-y-3">
                <h4 className="font-bold text-samridhi-textPrimary">Recommendation to Qualify:</h4>
                <p className="text-xs text-samridhi-textMuted leading-normal">
                  We evaluate alternate indicators to represent trustworthiness. To raise your score to the approval range:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-samridhi-textMuted text-[11px]">
                  <li>Go to <strong>Profile Settings</strong> and connect your Aadhaar, PAN, and UPI accounts.</li>
                  <li>Add professional skills certificates (AWS, Meta, Coursera) to represent verified earning capacity.</li>
                  <li>Simulate steady UPI payments to increase transaction recency variables.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4 border-t border-samridhi-border/40">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-6 py-2.5 bg-samridhi-surface hover:bg-samridhi-card border border-samridhi-border text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors"
                >
                  Return to Parameters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: SUCCESS CONTRACT SIGNED */}
      {wizardStep === 4 && (
        <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-samridhi-success/20 border-2 border-samridhi-success flex items-center justify-center text-3xl text-samridhi-success mb-2 animate-bounce">
            ✓
          </div>
          
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-samridhi-textPrimary uppercase tracking-wider">Contract Signed Successfully!</h3>
            <p className="text-xs text-samridhi-textMuted max-w-sm leading-relaxed">
              Your smart credit agreement is verified and recorded. Capital is being disbursed to your linked VPA: <strong className="text-samridhi-textPrimary">{user.upiVpa || 'demo@okaxis'}</strong>.
            </p>
          </div>

          <div className="bg-samridhi-surface border border-samridhi-border p-5 rounded-2xl w-full max-w-sm text-xs space-y-2.5 text-left">
            <div className="flex justify-between">
              <span className="text-samridhi-textMuted">Disbursement VPA:</span>
              <span className="font-bold text-samridhi-textPrimary">{user.upiVpa || 'demo@okaxis'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-samridhi-textMuted">Loan Value:</span>
              <span className="font-extrabold text-samridhi-secondary">₹{loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-samridhi-textMuted">Interest Rate:</span>
              <span className="font-bold text-samridhi-success">{interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-samridhi-textMuted">Repayment Tenure:</span>
              <span className="font-bold text-samridhi-textPrimary">{loanTenure} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-samridhi-textMuted">Monthly EMI:</span>
              <span className="font-extrabold text-samridhi-secondary">₹{monthlyEMI.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center">
            <button
              onClick={() => setWizardStep(1)}
              className="px-5 py-2.5 bg-samridhi-surface hover:bg-samridhi-card border border-samridhi-border text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors"
            >
              Apply for Another Loan
            </button>
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('overview');
                setWizardStep(1);
              }}
              className="px-5 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold rounded-xl text-xs shadow-lg transition-colors"
            >
              Go to Dashboard Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
