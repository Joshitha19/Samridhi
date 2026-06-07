// Loan Apply Wizard Stepper Component for Samridhi
// Exposes the LoanWizard React component globally

window.LoanWizard = ({ calculatedScore, dispatch, user, setActiveTab }) => {
  const { useState, useEffect, useMemo } = React;
  
  const [step, setStep] = useState(1); // 1, 2, 3
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState('');

  // Step 1 Form fields
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanPurpose, setLoanPurpose] = useState('Business');
  const [tenure, setTenure] = useState(12);

  // Step 2 Form fields
  const [phone, setPhone] = useState('9876543210');
  const [income, setIncome] = useState(45000);
  const [employmentType, setEmploymentType] = useState('Freelancer');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarLast4, setAadhaarLast4] = useState('1234');
  const [bankAccount, setBankAccount] = useState('987654321098');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');

  // EMI Calculator
  const emiCalculations = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const annualRate = 11.5; // 11.5% annual interest as per prompt
    const monthlyRate = annualRate / 12 / 100;
    const n = tenure;
    
    if (amount <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }
    
    // EMI = (amount × monthly_rate × (1+rate)^n) / ((1+rate)^n - 1)
    const power = Math.pow(1 + monthlyRate, n);
    const emi = (amount * monthlyRate * power) / (power - 1);
    
    const totalPayable = emi * n;
    const totalInterest = totalPayable - amount;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable)
    };
  }, [loanAmount, tenure]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate 1.5s loading spinner animation
    setTimeout(() => {
      const generatedId = `SMR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setAppId(generatedId);
      setSubmitting(false);
      setSuccess(true);
      
      // Dispatch Apply Loan action
      dispatch({
        type: 'APPLY_LOAN',
        payload: {
          id: generatedId,
          lender: "Samridhi AI Match",
          amount: loanAmount,
          rate: "11.5%",
          emi: `₹${emiCalculations.emi.toLocaleString()}`,
          status: "Under Review",
          date: new Date().toISOString().split('T')[0]
        }
      });

      // Dispatch Notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `n-${Date.now()}`,
          text: `Loan Application ${generatedId} submitted for review.`,
          read: false,
          date: "Just now"
        }
      });
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(false);
    setLoanAmount(100000);
    setLoanPurpose('Business');
    setTenure(12);
  };

  if (submitting) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-samridhi-primary/20 border-t-samridhi-primary animate-spin"></div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Processing Application</h4>
          <p className="text-xs text-samridhi-textMuted">AI Underwriting models are evaluating parameters...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
        {/* Checkmark SVG */}
        <div className="w-16 h-16 rounded-full bg-samridhi-success/10 border-2 border-samridhi-success flex items-center justify-center text-samridhi-success">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-extrabold text-lg text-samridhi-textPrimary">Application Submitted!</h3>
          <p className="text-xs text-samridhi-textMuted max-w-sm">
            Your application is being evaluated using alternative scoring indicators. Follow your status below.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="bg-samridhi-surface border border-samridhi-border p-4.5 rounded-2xl w-full max-w-sm flex justify-between items-center text-xs">
          <span className="text-samridhi-textMuted font-bold uppercase tracking-wider">Application ID:</span>
          <span className="font-black text-samridhi-secondary tracking-widest text-sm">{appId}</span>
        </div>

        {/* Status Tracker: Submitted -> Under Review -> AI Scoring -> Decision */}
        <div className="w-full max-w-md bg-samridhi-surface border border-samridhi-border/50 p-6 rounded-2xl space-y-4">
          <h4 className="font-bold text-[10px] text-samridhi-textMuted uppercase tracking-wider text-left">Application Status</h4>
          
          <div className="relative flex items-center justify-between">
            {/* Connection Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-samridhi-border z-0"></div>
            <div className="absolute left-0 w-1/3 top-1/2 -translate-y-1/2 h-0.5 bg-samridhi-primary z-0"></div>
            
            {[
              { label: 'Submitted', active: true },
              { label: 'Under Review', active: false },
              { label: 'AI Scoring', active: false },
              { label: 'Decision', active: false }
            ].map((node, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  node.active 
                    ? 'bg-samridhi-primary text-white border-2 border-samridhi-primary' 
                    : 'bg-samridhi-card text-samridhi-textMuted border border-samridhi-border'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-[9px] font-bold mt-2 uppercase tracking-wide ${
                  node.active ? 'text-samridhi-textPrimary' : 'text-samridhi-textMuted'
                }`}>{node.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={resetForm}
          className="px-6 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
        >
          Apply Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 3-Step Progress Indicator */}
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-samridhi-border z-0"></div>
        {/* Completed Line Fill */}
        <div 
          className="absolute top-4 left-4 h-0.5 bg-samridhi-primary transition-all duration-300 z-0" 
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {[
            { id: 1, name: 'Loan Details' },
            { id: 2, name: 'Financial Info' },
            { id: 3, name: 'Review & Submit' }
          ].map((item) => {
            const isCompleted = step > item.id;
            const isActive = step === item.id;
            return (
              <div key={item.id} className="flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-samridhi-primary text-white shadow-lg shadow-samridhi-primary/25' 
                      : isActive 
                        ? 'bg-samridhi-surface text-samridhi-primary border-2 border-samridhi-primary animate-pulse shadow-md shadow-samridhi-primary/10' 
                        : 'bg-samridhi-surface text-samridhi-textMuted border border-samridhi-border'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    item.id
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${
                  isActive ? 'text-samridhi-textPrimary' : 'text-samridhi-textMuted'
                }`}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Steps */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Loan Amount input */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Loan Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-samridhi-textMuted font-bold">₹</span>
                  <input
                    type="number"
                    min="10000"
                    max="1000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-3 pl-8 pr-4 text-samridhi-textPrimary focus:outline-none transition-all text-sm font-bold"
                    required
                  />
                </div>
              </div>

              {/* Loan Purpose dropdown */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Loan Purpose</label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-all text-sm font-bold"
                >
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                  <option value="Medical">Medical</option>
                  <option value="Home Renovation">Home Renovation</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Tenure slider */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase">
                  <span>Tenure</span>
                  <span className="text-samridhi-secondary font-black">{tenure} Months</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="84"
                  step="6"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-samridhi-border rounded-lg appearance-none cursor-pointer accent-samridhi-primary focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-samridhi-textMuted font-bold">
                  <span>6 Months</span>
                  <span>84 Months</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live EMI Preview Card */}
          <div className="bg-samridhi-surface border border-samridhi-border/70 p-5 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-[10px] text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/40 pb-2">Estimated EMI Preview (11.5% p.a.)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-samridhi-card border border-samridhi-border p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase block">EMI / Month</span>
                <span className="text-base font-black text-samridhi-secondary">₹{emiCalculations.emi.toLocaleString()}</span>
              </div>
              <div className="bg-samridhi-card border border-samridhi-border p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase block">Total Interest</span>
                <span className="text-base font-black text-samridhi-danger">₹{emiCalculations.totalInterest.toLocaleString()}</span>
              </div>
              <div className="bg-samridhi-card border border-samridhi-border p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase block">Total Payable</span>
                <span className="text-base font-black text-samridhi-success">₹{emiCalculations.totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-samridhi-border/40">
            <button
              type="submit"
              className="px-6 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-[10px] text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/30 pb-1.5">Personal Information</h4>
              
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Full Name</label>
                <input
                  type="text"
                  value={user.name || 'Mock User'}
                  disabled
                  className="w-full bg-samridhi-surface border border-samridhi-border rounded-xl py-2.5 px-4 text-samridhi-textMuted focus:outline-none text-xs font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Email Address</label>
                <input
                  type="email"
                  value={user.email || 'mock@samridhi.in'}
                  disabled
                  className="w-full bg-samridhi-surface border border-samridhi-border rounded-xl py-2.5 px-4 text-samridhi-textMuted focus:outline-none text-xs font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-3 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Student">Student</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-[10px] text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/30 pb-1.5">Verification & Bank details</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">PAN Number</label>
                  <input
                    type="text"
                    maxLength="10"
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Aadhaar (Last 4)</label>
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="1234"
                    value={aadhaarLast4}
                    onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-samridhi-textMuted uppercase">IFSC Code</label>
                <input
                  type="text"
                  placeholder="HDFC0000123"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-2.5 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-samridhi-border/40">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center space-x-1"
            >
              <span>Review Application</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          {/* Review Summary Cards */}
          <div className="bg-samridhi-surface border border-samridhi-border p-6 rounded-2xl space-y-5">
            <h4 className="font-extrabold text-[10px] text-samridhi-textMuted uppercase tracking-wider border-b border-samridhi-border/30 pb-2">Application Summary</h4>
            
            {/* Section 1: Loan Details */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-black text-samridhi-primary uppercase tracking-widest">Loan Details</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-xs">
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Loan Amount</span>
                  <span className="font-bold text-samridhi-textPrimary">₹{loanAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Purpose</span>
                  <span className="font-bold text-samridhi-textPrimary">{loanPurpose}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Tenure</span>
                  <span className="font-bold text-samridhi-textPrimary">{tenure} Months</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Estimated EMI</span>
                  <span className="font-bold text-samridhi-secondary">₹{emiCalculations.emi.toLocaleString()} / mo</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Total Payable</span>
                  <span className="font-bold text-samridhi-success">₹{emiCalculations.totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-samridhi-border/40"></div>

            {/* Section 2: Personal Info */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-black text-samridhi-secondary uppercase tracking-widest">Personal & Financial Info</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-xs">
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Full Name</span>
                  <span className="font-bold text-samridhi-textPrimary">{user.name || 'Mock User'}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Email Address</span>
                  <span className="font-bold text-samridhi-textPrimary">{user.email || 'mock@samridhi.in'}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Phone Number</span>
                  <span className="font-bold text-samridhi-textPrimary">{phone}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Monthly Income</span>
                  <span className="font-bold text-samridhi-textPrimary">₹{income.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Employment Type</span>
                  <span className="font-bold text-samridhi-textPrimary">{employmentType}</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">PAN / Aadhaar</span>
                  <span className="font-bold text-samridhi-textPrimary">{panNumber} / *******{aadhaarLast4}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Bank Account Details</span>
                  <span className="font-bold text-samridhi-textPrimary">{bankAccount} ({ifscCode})</span>
                </div>
              </div>
            </div>

            <div className="border-t border-samridhi-border/40"></div>

            {/* Section 3: Score Info */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-black text-samridhi-success uppercase tracking-widest">Score Info</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-xs">
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Credibility Score</span>
                  <span className="font-black text-samridhi-secondary">{calculatedScore || 72} / 100</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Risk Level</span>
                  <span className="font-black text-samridhi-success uppercase tracking-wider">Low Risk</span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">AI Recommendation</span>
                  <span className="font-black text-samridhi-success flex items-center space-x-1">
                    <span>Approved</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <div>
                  <span className="text-samridhi-textMuted block text-[9px] uppercase font-bold">Max Eligible</span>
                  <span className="font-bold text-samridhi-textPrimary">₹2,50,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer text */}
          <p className="text-[10px] text-samridhi-textMuted leading-normal bg-samridhi-surface/40 p-3.5 rounded-xl border border-samridhi-border/40">
            Disclaimer: By clicking submit, you authorize Samridhi AI models to verify alternative data points, credit history logs, and linked telemetry endpoints to perform underwriting.
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-samridhi-border/40 gap-4">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors flex items-center space-x-1 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-extrabold rounded-xl text-xs shadow-lg transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Submit Application</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
