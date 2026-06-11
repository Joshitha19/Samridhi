// Loan Apply Wizard Stepper Component for Samridhi
// Exposes the LoanWizard React component globally

window.LoanWizard = ({ calculatedScore, dispatch, user, setActiveTab, voiceNavigationActive, setVoiceNavigationActive }) => {
  const { useState, useEffect, useMemo, useRef } = React;
  
  const [step, setStep] = useState(1); // 1, 2, 3, 4
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState('');
  const tempDisableVoiceNavRef = useRef(false);

  // Step 1 Form fields
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanPurpose, setLoanPurpose] = useState('Business');
  const [tenure, setTenure] = useState(12);
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Step 2 Form fields
  const [phone, setPhone] = useState('9876543210');
  const [income, setIncome] = useState(45000);
  const [employmentType, setEmploymentType] = useState('Freelancer');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarLast4, setAadhaarLast4] = useState('1234');
  const [bankAccount, setBankAccount] = useState('987654321098');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');

  // Video Loan Intent Form fields
  const [intentLanguage, setIntentLanguage] = useState('English');
  const [intentVideo, setIntentVideo] = useState('');
  const [recordingIntent, setRecordingIntent] = useState(false);
  const [intentCountdown, setIntentCountdown] = useState(30);
  const [micLevel, setMicLevel] = useState(0);

  const intentVideoRef = useRef(null);
  const intentStreamRef = useRef(null);
  const intentRecorderRef = useRef(null);
  const intentChunksRef = useRef([]);
  const animFrameIdRef = useRef(null);

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
    if (e) e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Video Intent Recorder logic
  const startIntentRecording = async () => {
    setRecordingIntent(true);
    setIntentCountdown(30);
    intentChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 },
        audio: true 
      });
      intentStreamRef.current = stream;
      if (intentVideoRef.current) {
        intentVideoRef.current.srcObject = stream;
      }
      
      simulateMicLevel();

      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/mp4' };
          }
        }
      }

      const recorder = new MediaRecorder(stream, options);
      intentRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          intentChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(intentChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setIntentVideo(reader.result);
        };
        
        if (intentStreamRef.current) {
          intentStreamRef.current.getTracks().forEach(t => t.stop());
        }
        cancelAnimationFrame(animFrameIdRef.current);
        setRecordingIntent(false);
      };

      recorder.start();
    } catch (err) {
      console.warn("Liveness intent camera failed, using high-fidelity canvas recorder simulator:", err);
      runIntentCanvasSimulation();
    }
  };

  const simulateMicLevel = () => {
    const updateMic = () => {
      setMicLevel(Math.floor(15 + Math.random() * 65));
      animFrameIdRef.current = requestAnimationFrame(updateMic);
    };
    animFrameIdRef.current = requestAnimationFrame(updateMic);
  };

  const stopIntentRecording = () => {
    if (intentRecorderRef.current && intentRecorderRef.current.state !== 'inactive') {
      intentRecorderRef.current.stop();
    }
  };

  const runIntentCanvasSimulation = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    const canvasStream = canvas.captureStream(10); // 10 fps
    intentChunksRef.current = [];
    
    let options = { mimeType: 'video/webm' };
    const recorder = new MediaRecorder(canvasStream, options);
    intentRecorderRef.current = recorder;
    
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) intentChunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(intentChunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setIntentVideo(reader.result);
        setRecordingIntent(false);
      };
    };
    
    recorder.start();
    simulateMicLevel();

    let frame = 0;
    const interval = setInterval(() => {
      if (frame >= 300 || recorder.state === 'inactive') { 
        clearInterval(interval);
        cancelAnimationFrame(animFrameIdRef.current);
        return;
      }
      
      // Clear
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }
      
      // Draw User Avatar shape speaking
      ctx.fillStyle = '#11131E';
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 80, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 165, 55, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      const mouthHeight = 2 + (Math.random() * 7);
      ctx.fillStyle = '#FF1744';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 90, 7, mouthHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Waveform visualizer
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 20; x <= 60; x += 8) {
        ctx.moveTo(x, 205);
        ctx.lineTo(x, 205 - Math.random() * 25);
      }
      ctx.stroke();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`RECORDING INTENT (${intentLanguage.toUpperCase()}): ${Math.round(frame / 10)}s`, 20, 25);
      ctx.fillStyle = '#8E91A8';
      ctx.fillText(`"Explaining micro-loan statement..."`, 20, 37);
      
      frame++;
    }, 100);
  };

  useEffect(() => {
    if (!recordingIntent) return;
    
    if (intentCountdown > 0) {
      const timer = setTimeout(() => {
        setIntentCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      stopIntentRecording();
    }
  }, [recordingIntent, intentCountdown]);

  useEffect(() => {
    return () => {
      if (intentStreamRef.current) {
        intentStreamRef.current.getTracks().forEach(t => t.stop());
      }
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

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
          lender: selectedBank,
          amount: loanAmount,
          rate: "11.5%",
          emi: `₹${Math.round(emiCalculations.emi).toLocaleString()}`,
          status: "Pending",
          date: new Date().toISOString().split('T')[0],
          video_intent: intentVideo || null,
          intent_language: intentLanguage
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
    setIntentVideo('');
    setIntentLanguage('English');
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

      {/* 4-Step Progress Indicator */}
      <div className="relative font-sans">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-samridhi-border z-0"></div>
        <div 
          className="absolute top-4 left-4 h-0.5 bg-samridhi-primary transition-all duration-300 z-0" 
          style={{ width: step === 1 ? '0%' : step === 2 ? '33.3%' : step === 3 ? '66.6%' : '100%' }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {[
            { id: 1, name: 'Loan Details' },
            { id: 2, name: 'Financial Info' },
            { id: 3, name: 'Video Intent' },
            { id: 4, name: 'Review & Submit' }
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

              {/* Target Bank Selection */}
              <div className="flex flex-col space-y-1.5 mt-4">
                <div className="flex justify-between items-center text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">
                  <span>Target Bank / Lender</span>
                </div>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-all text-sm font-bold"
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
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
              <span>Next: Video Statement</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="bg-samridhi-surface border border-samridhi-border p-5 rounded-2xl space-y-5">
            <div>
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Video Loan Intent Statement</h4>
              <p className="text-[10px] text-samridhi-textMuted mt-1 leading-relaxed">
                Record a 30-second statement explaining why you need the loan in your preferred language. This video is attached to your credit file and sent to bankers to humanize your request.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left column: Controls */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-bold text-samridhi-textMuted uppercase tracking-wider">Preferred Language</label>
                  <select
                    value={intentLanguage}
                    onChange={(e) => setIntentLanguage(e.target.value)}
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none text-xs font-bold"
                    disabled={recordingIntent}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Kannada">Kannada (કನ್ನಡ)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  {!recordingIntent && !intentVideo && (
                    <button
                      type="button"
                      onClick={startIntentRecording}
                      className="w-full py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-samridhi-primary/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" fill="currentColor"/>
                      </svg>
                      <span>Record Video Intent (30s)</span>
                    </button>
                  )}

                  {recordingIntent && (
                    <button
                      type="button"
                      onClick={stopIntentRecording}
                      className="w-full py-3 bg-samridhi-danger hover:bg-samridhi-danger/95 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-samridhi-danger/10 transition-all flex items-center justify-center space-x-2 animate-pulse cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
                      </svg>
                      <span>Stop Recording ({intentCountdown}s)</span>
                    </button>
                  )}

                  {intentVideo && !recordingIntent && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={startIntentRecording}
                        className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Re-Record
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="flex-1 py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        Confirm Video
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: HUD video frame */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm h-52 bg-black rounded-2xl border border-white/[0.08] overflow-hidden flex items-center justify-center">
                  {recordingIntent && (
                    <>
                      <video
                        ref={intentVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-4 border border-transparent pointer-events-none">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-samridhi-primary"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-samridhi-primary"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-samridhi-primary"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-samridhi-primary"></div>
                      </div>
                      
                      {/* Audio Level waveform */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-white/[0.05]">
                        <span className="text-[8px] font-bold text-samridhi-textMuted uppercase font-mono tracking-wider">Audio level</span>
                        <div className="flex-1 bg-white/[0.08] h-1.5 rounded overflow-hidden">
                          <div className="bg-samridhi-success h-full transition-all duration-75" style={{ width: `${micLevel}%` }}></div>
                        </div>
                      </div>
                    </>
                  )}

                  {!recordingIntent && intentVideo && (
                    <video
                      src={intentVideo}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  {!recordingIntent && !intentVideo && (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto text-samridhi-textMuted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-[9px] font-black uppercase text-samridhi-textMuted tracking-wider block">Camera Preview Idle</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-samridhi-border/40">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>Skip Video (Default Draft)</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 animate-fade-in text-xs">
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

            {/* Section 3: Video Intent Statement Review */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-black text-samridhi-primary uppercase tracking-widest font-bold">Video Intent Statement</h5>
              {intentVideo ? (
                <div className="flex items-center space-x-4 bg-samridhi-card/50 border border-samridhi-border p-3.5 rounded-xl">
                  <div className="relative w-24 h-16 bg-black rounded-lg overflow-hidden shrink-0 border border-white/[0.04]">
                    <video src={intentVideo} muted className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Statement Recorded ({intentLanguage})</span>
                    <span className="text-[9px] text-samridhi-textMuted font-medium font-mono leading-none">Lender Transmission: READY</span>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-samridhi-warning font-bold bg-samridhi-warning/5 border border-samridhi-warning/10 p-3.5 rounded-xl">
                  No statement recorded. (Lenders prefer video intentions to evaluate applications).
                </div>
              )}
            </div>

            <div className="border-t border-samridhi-border/40"></div>

            {/* Section 4: Score Info */}
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
              className="px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textMuted hover:text-samridhi-textPrimary font-bold rounded-xl text-xs transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-extrabold rounded-xl text-xs shadow-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
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
