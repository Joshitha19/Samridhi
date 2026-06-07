// Loan Apply Wizard Stepper Component for Samridhi
// Exposes the LoanWizard React component globally

window.LoanWizard = ({ calculatedScore, dispatch, user, setActiveTab, voiceNavigationActive, setVoiceNavigationActive }) => {
  const { useState, useEffect, useMemo, useRef } = React;
  
  const [step, setStep] = useState(1); // 1, 2, 3
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState('');
  const tempDisableVoiceNavRef = useRef(false);

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

  // Web Speech state
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState(null); // 'amount' | 'purpose' | 'tenure'
  const [speechError, setSpeechError] = useState('');
  const [toastText, setToastText] = useState('');
  const recognitionRef = useRef(null);

  // EMI Calculator
  const emiCalculations = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const annualRate = 11.5; // 11.5% annual interest as per prompt
    const monthlyRate = annualRate / 12 / 100;
    const n = tenure;
    
    if (amount <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }
    
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
    setTimeout(() => {
      const generatedId = `SMR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setAppId(generatedId);
      setSubmitting(false);
      setSuccess(true);
      
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

  // Helper to restore voice navigation
  const restoreVoiceNavigation = () => {
    if (tempDisableVoiceNavRef.current) {
      tempDisableVoiceNavRef.current = false;
      if (typeof setVoiceNavigationActive === 'function') {
        setVoiceNavigationActive(true);
      }
    }
  };

  // Web Speech API trigger
  const triggerVoiceInput = (fieldName) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    setIsListening(true);
    setListeningField(fieldName);
    setSpeechError('');

    const startRecognition = () => {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log(`Speech captured [${fieldName}]: `, transcript);
        
        // Intent mapping
        let parsedValue = null;
        let matchedText = '';

        if (fieldName === 'amount') {
          // Amount mapping
          if (transcript.includes('two lakh') || transcript.includes('2 lakh') || transcript.includes('two hundred thousand') || transcript.includes('200000')) {
            parsedValue = 200000;
            matchedText = '₹2,00,000';
          } else if (transcript.includes('one lakh') || transcript.includes('1 lakh') || transcript.includes('100000')) {
            parsedValue = 100000;
            matchedText = '₹1,00,000';
          } else if (transcript.includes('three lakh') || transcript.includes('3 lakh') || transcript.includes('300000')) {
            parsedValue = 300000;
            matchedText = '₹3,00,000';
          } else if (transcript.includes('five lakh') || transcript.includes('5 lakh') || transcript.includes('500000')) {
            parsedValue = 500000;
            matchedText = '₹5,00,000';
          } else {
            // Extract digits
            const digits = transcript.replace(/\D/g, '');
            if (digits) {
              parsedValue = parseInt(digits);
              matchedText = `₹${parsedValue.toLocaleString()}`;
            }
          }

          if (parsedValue) {
            typewriterInput(parsedValue, setLoanAmount);
            triggerToast(`Voice Understood: Set Amount to ${matchedText}`);
          } else {
            setSpeechError(`Could not extract amount from: "${transcript}"`);
          }

        } else if (fieldName === 'purpose') {
          // Purpose mapping
          let targetPurpose = '';
          if (transcript.includes('education') || transcript.includes('study') || transcript.includes('college')) {
            targetPurpose = 'Education';
          } else if (transcript.includes('business') || transcript.includes('freelance') || transcript.includes('startup') || transcript.includes('shop')) {
            targetPurpose = 'Business';
          } else if (transcript.includes('personal') || transcript.includes('myself')) {
            targetPurpose = 'Personal';
          } else if (transcript.includes('medical') || transcript.includes('hospital') || transcript.includes('health') || transcript.includes('treatment')) {
            targetPurpose = 'Medical';
          } else if (transcript.includes('home') || transcript.includes('renovation') || transcript.includes('house')) {
            targetPurpose = 'Home Renovation';
          } else if (transcript.includes('vehicle') || transcript.includes('car') || transcript.includes('bike') || transcript.includes('scooter')) {
            targetPurpose = 'Vehicle';
          }

          if (targetPurpose) {
            setLoanPurpose(targetPurpose);
            triggerToast(`Voice Understood: Selected Purpose ${targetPurpose}`);
          } else {
            setSpeechError(`Could not match purpose from: "${transcript}"`);
          }

        } else if (fieldName === 'tenure') {
          // Tenure mapping
          let targetTenure = 0;
          if (transcript.includes('forty eight') || transcript.includes('48')) {
            targetTenure = 48;
          } else if (transcript.includes('twelve') || transcript.includes('12') || transcript.includes('one year')) {
            targetTenure = 12;
          } else if (transcript.includes('twenty four') || transcript.includes('24') || transcript.includes('two years')) {
            targetTenure = 24;
          } else if (transcript.includes('thirty six') || transcript.includes('36') || transcript.includes('three years')) {
            targetTenure = 36;
          } else if (transcript.includes('sixty') || transcript.includes('60') || transcript.includes('five years')) {
            targetTenure = 60;
          } else if (transcript.includes('eighty four') || transcript.includes('84') || transcript.includes('seven years')) {
            targetTenure = 84;
          } else {
            const digits = transcript.replace(/\D/g, '');
            if (digits) {
              targetTenure = Math.max(6, Math.min(84, Math.round(parseInt(digits) / 6) * 6)); // Clamp to steps of 6
            }
          }

          if (targetTenure) {
            setTenure(targetTenure);
            triggerToast(`Voice Understood: Set Tenure to ${targetTenure} Months`);
          } else {
            setSpeechError(`Could not match tenure from: "${transcript}"`);
          }
        }
      };

      recognition.onerror = (e) => {
        console.error(e);
        setSpeechError(`Speech error: ${e.error}`);
        setIsListening(false);
        restoreVoiceNavigation();
      };

      recognition.onend = () => {
        setIsListening(false);
        restoreVoiceNavigation();
      };

      recognition.start();
    };

    if (voiceNavigationActive) {
      tempDisableVoiceNavRef.current = true;
      if (typeof setVoiceNavigationActive === 'function') {
        setVoiceNavigationActive(false);
      }
      setTimeout(() => {
        startRecognition();
      }, 300);
    } else {
      startRecognition();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    restoreVoiceNavigation();
  };

  // Helper typing effect
  const typewriterInput = (finalVal, setter) => {
    setter(0);
    const valStr = finalVal.toString();
    let index = 0;
    const interval = setInterval(() => {
      if (index <= valStr.length) {
        setter(parseInt(valStr.substring(0, index)) || 0);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);
  };

  const triggerToast = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(''), 3000);
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

        {/* Status Tracker */}
        <div className="w-full max-w-md bg-samridhi-surface border border-samridhi-border/50 p-6 rounded-2xl space-y-4">
          <h4 className="font-bold text-[10px] text-samridhi-textMuted uppercase tracking-wider text-left">Application Status</h4>
          
          <div className="relative flex items-center justify-between">
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
    <div className="space-y-8 relative text-xs">
      
      {/* CSS Audio Waveform animations */}
      <style>{`
        @keyframes pulseBar {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .w-bar-1 { animation: pulseBar 0.8s ease-in-out infinite; }
        .w-bar-2 { animation: pulseBar 0.5s ease-in-out infinite; }
        .w-bar-3 { animation: pulseBar 0.9s ease-in-out infinite; }
        .w-bar-4 { animation: pulseBar 0.6s ease-in-out infinite; }
        .w-bar-5 { animation: pulseBar 0.7s ease-in-out infinite; }
      `}</style>

      {/* Dynamic Voice Understood Toast */}
      {toastText && (
        <div className="fixed top-20 right-6 z-50 bg-samridhi-card border border-samridhi-success/45 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs text-samridhi-success animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-samridhi-success/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-extrabold">{toastText}</span>
        </div>
      )}

      {/* 3-Step Progress Indicator */}
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-samridhi-border z-0"></div>
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

      {/* Speech Error Banner */}
      {speechError && (
        <div className="p-3 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{speechError}</span>
        </div>
      )}

      {/* Voice Waveform Overlay popup when listening */}
      {isListening && (
        <div className="bg-samridhi-surface/90 border border-samridhi-primary/45 p-4 rounded-xl flex items-center justify-between gap-4 animate-fade-in shadow-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-samridhi-danger animate-ping"></span>
            <span className="font-extrabold text-[10px] text-samridhi-textPrimary uppercase tracking-wider">
              Listening to {listeningField}...
            </span>
          </div>
          
          {/* Animated SVG Audio Waveform */}
          <div className="flex items-end space-x-0.5 h-6 shrink-0">
            <div className="w-1 bg-samridhi-primary w-bar-1 rounded-full"></div>
            <div className="w-1 bg-samridhi-secondary w-bar-2 rounded-full"></div>
            <div className="w-1 bg-samridhi-success w-bar-3 rounded-full"></div>
            <div className="w-1 bg-samridhi-secondary w-bar-4 rounded-full"></div>
            <div className="w-1 bg-samridhi-primary w-bar-5 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Form Steps */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Loan Amount input */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                  <span>Loan Amount (₹)</span>
                  <button
                    type="button"
                    onClick={() => triggerVoiceInput('amount')}
                    className={`p-1 rounded bg-samridhi-surface border border-samridhi-border hover:border-samridhi-primary text-samridhi-textMuted hover:text-samridhi-primary transition-all flex items-center space-x-1 ${
                      isListening && listeningField === 'amount' ? 'animate-pulse text-samridhi-danger border-samridhi-danger bg-samridhi-danger/10' : ''
                    }`}
                    title="Speak Amount (e.g. 'two lakh rupees')"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-[8px] font-black">{isListening && listeningField === 'amount' ? 'Listening...' : 'Speak'}</span>
                  </button>
                </div>
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
                <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                  <span>Loan Purpose</span>
                  <button
                    type="button"
                    onClick={() => triggerVoiceInput('purpose')}
                    className={`p-1 rounded bg-samridhi-surface border border-samridhi-border hover:border-samridhi-primary text-samridhi-textMuted hover:text-samridhi-primary transition-all flex items-center space-x-1 ${
                      isListening && listeningField === 'purpose' ? 'animate-pulse text-samridhi-danger border-samridhi-danger bg-samridhi-danger/10' : ''
                    }`}
                    title="Speak Purpose (e.g. 'for my education')"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-[8px] font-black">{isListening && listeningField === 'purpose' ? 'Listening...' : 'Speak'}</span>
                  </button>
                </div>
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
                  <span className="flex items-center space-x-2">
                    <span>Tenure</span>
                    <button
                      type="button"
                      onClick={() => triggerVoiceInput('tenure')}
                      className={`p-1 rounded bg-samridhi-surface border border-samridhi-border hover:border-samridhi-primary text-samridhi-textMuted hover:text-samridhi-primary transition-all flex items-center space-x-1 ${
                        isListening && listeningField === 'tenure' ? 'animate-pulse text-samridhi-danger border-samridhi-danger bg-samridhi-danger/10' : ''
                      }`}
                      title="Speak Tenure (e.g. 'for forty eight months')"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="text-[8px] font-black">{isListening && listeningField === 'tenure' ? 'Listening...' : 'Speak'}</span>
                    </button>
                  </span>
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
