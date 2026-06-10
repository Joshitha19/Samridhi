// Dashboard Profile Tab Component for Samridhi
// Exposes DashboardProfileTab globally

window.DashboardProfileTab = ({
  user,
  setUser,
  dashboardState,
  dispatch,
  aadhaarVerified,
  setAadhaarVerified,
  panVerified,
  setPanVerified,
  upiLinked,
  setUpiLinked,
  kycCameraVerified,
  setKycCameraVerified
}) => {
  const { useState, useEffect, useRef } = React;
  
  // Local state for inline certification form
  const [showAddForm, setShowAddForm] = useState(false);
  const [certName, setCertName] = useState('');
  const [issuingBody, setIssuingBody] = useState('');
  const [certYear, setCertYear] = useState('2026');

  // Toggle Preferences state
  const [scoreAlerts, setScoreAlerts] = useState(true);
  const [offerAlerts, setOfferAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);

  // Linked accounts state
  const [linkedUpi, setLinkedUpi] = useState(true);
  const [linkedBank, setLinkedBank] = useState(true);
  const [linkedLinkedIn, setLinkedLinkedIn] = useState(false);
  const [linkedCoursera, setLinkedCoursera] = useState(true);

  // Profile fields editing
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editIncome, setEditIncome] = useState(45000);
  const [editLocation, setEditLocation] = useState('Bangalore, India');

  // KYC webcam flow states
  const [kycStep, setKycStep] = useState('idle'); // 'idle' | 'camera' | 'ocr' | 'completed'
  const [instruction, setInstruction] = useState('');
  const [ocrText, setOcrText] = useState({ number: '', name: '', dob: '', address: '' });
  const [capturedImage, setCapturedImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startKycFlow = async () => {
    setKycStep('camera');
    setInstruction('Position your face in the frame');
    setOcrText({ number: '', name: '', dob: '', address: '' });
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 200 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed: ", err);
      setInstruction('Camera access denied. Please allow webcam permissions.');
    }
  };

  // Handle liveness 3s sequencing
  useEffect(() => {
    if (kycStep !== 'camera') return;

    // Timer 1: Transition instruction to "Hold still..." at 1s
    const t1 = setTimeout(() => {
      setInstruction('Hold still...');
    }, 1200);

    // Timer 2: Transition instruction to "Face Detected" at 2.4s
    const t2 = setTimeout(() => {
      setInstruction('Face Detected');
    }, 2400);

    // Timer 3: Capture and freeze at 3.2s
    const t3 = setTimeout(() => {
      captureSnapshot();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [kycStep]);

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/png'));
      
      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setKycStep('ocr');
      startOcrTypewriter();
    }
  };

  const startOcrTypewriter = () => {
    const data = {
      number: "XXXX XXXX 8742",
      name: "Arjun Sharma",
      dob: "15/08/1998",
      address: "Hyderabad, Telangana"
    };

    let curField = 'number';
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (curField === 'number') {
        if (charIndex < data.number.length) {
          setOcrText(prev => ({ ...prev, number: prev.number + data.number[charIndex] }));
          charIndex++;
        } else {
          curField = 'name';
          charIndex = 0;
        }
      } else if (curField === 'name') {
        if (charIndex < data.name.length) {
          setOcrText(prev => ({ ...prev, name: prev.name + data.name[charIndex] }));
          charIndex++;
        } else {
          curField = 'dob';
          charIndex = 0;
        }
      } else if (curField === 'dob') {
        if (charIndex < data.dob.length) {
          setOcrText(prev => ({ ...prev, dob: prev.dob + data.dob[charIndex] }));
          charIndex++;
        } else {
          curField = 'address';
          charIndex = 0;
        }
      } else if (curField === 'address') {
        if (charIndex < data.address.length) {
          setOcrText(prev => ({ ...prev, address: prev.address + data.address[charIndex] }));
          charIndex++;
        } else {
          clearInterval(interval);
          completeKyc();
        }
      }
    }, 45); // Typewriter speed
  };

  const completeKyc = () => {
    setKycStep('completed');
    setKycCameraVerified(true);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-kyc-${Date.now()}`,
        text: "Identity verified successfully via Liveness Face ID. Credibility score raised (+8 points).",
        read: false,
        date: "Just now"
      }
    });
  };

  const handleAddCertSubmit = (e) => {
    e.preventDefault();
    if (!certName || !issuingBody) return;

    dispatch({
      type: 'ADD_SKILL',
      payload: {
        id: `s-added-${Date.now()}`,
        name: certName,
        issuer: `${issuingBody} (${certYear})`,
        verified: true
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        text: `New credential added: ${certName} from ${issuingBody}. Credit capacity recalculated.`,
        read: false,
        date: "Just now"
      }
    });

    setCertName('');
    setIssuingBody('');
    setShowAddForm(false);
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editName
    });
    setIsEditing(false);
  };

  // Clean up media stream if user closes or switches tab
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-xs">
      
      {/* CSS Scanner Animations */}
      <style>{`
        @keyframes scanline {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scanline 2s linear infinite;
        }
      `}</style>

      {/* PROFILE HEADER CARD */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary relative shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-samridhi-primary/10 to-transparent rounded-tr-3xl pointer-events-none filter blur-2xl"></div>
        {/* Edit Profile / Save button */}
        <div className="absolute top-6 right-6">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-3 py-1.5 bg-samridhi-success text-samridhi-bg font-black rounded-lg text-[10px] uppercase hover:opacity-90 transition-opacity"
            >
              Save Details
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] text-white hover:border-samridhi-primary/40 font-black rounded-lg text-[10px] uppercase transition-all flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar (80px Gradient) with verification indicator */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-black text-2xl text-samridhi-bg shadow-lg">
              {user.name ? user.name[0] : 'U'}
            </div>
            {kycCameraVerified && (
              <div className="absolute -bottom-1 -right-1 bg-samridhi-success border-2 border-[#090b10] p-1 rounded-full text-white" title="Liveness KYC Verified">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1 w-full">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value.toUpperCase())}
                    className="bg-white/[0.02] border border-white/[0.08] text-white font-extrabold text-lg px-2.5 py-1 rounded focus:border-samridhi-primary focus:outline-none transition-all"
                  />
                ) : (
                  <h2 className="text-lg font-black text-white uppercase tracking-wider text-glow-primary">{user.name}</h2>
                )}
                {kycCameraVerified && (
                  <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 bg-samridhi-success/15 border border-samridhi-success/35 text-samridhi-success rounded text-[9px] font-black uppercase">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identity Verified</span>
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-[10px] text-samridhi-textMuted font-bold">{user.email}</span>
                <span className="px-2 py-0.5 bg-samridhi-secondary/15 border border-samridhi-secondary/35 text-samridhi-secondary rounded text-[9px] font-black uppercase">
                  {user.type}
                </span>
              </div>
            </div>

            {/* 2x2 Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.04] text-left text-xs font-semibold">
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">Monthly Income</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editIncome}
                    onChange={(e) => setEditIncome(parseInt(e.target.value) || 0)}
                    className="bg-white/[0.02] border border-white/[0.08] text-white w-28 px-2 py-0.5 rounded text-xs focus:outline-none focus:border-samridhi-primary transition-all"
                  />
                ) : (
                  <span className="text-white font-bold font-mono">₹{editIncome.toLocaleString()}</span>
                )}
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="bg-white/[0.02] border border-white/[0.08] text-white w-36 px-2 py-0.5 rounded text-xs focus:outline-none focus:border-samridhi-primary transition-all"
                  />
                ) : (
                  <span className="text-white font-bold">{editLocation}</span>
                )}
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">Account Since</span>
                <span className="text-white font-bold font-mono">Jan 2026</span>
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">PAN Status</span>
                <span className="text-samridhi-success font-bold flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[10px] font-black uppercase">Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC DEVICE CAMERA VERIFICATION CARD */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-secondary space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-secondary/5 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>
        <div className="border-b border-white/[0.04] pb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider text-glow-secondary">
            Liveness KYC Camera Authentication
          </h3>
          <p className="text-[10px] text-samridhi-textMuted mt-0.5 font-semibold">
            Use your device camera to pass liveness checks and unlock +8 credibility points.
          </p>
        </div>

        {kycStep === 'idle' && (
          <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl text-center space-y-4">
            {kycCameraVerified ? (
              <div className="space-y-2 py-4">
                <div className="w-12 h-12 rounded-full bg-samridhi-success/15 border border-samridhi-success/35 text-samridhi-success flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wide">Liveness Check: PASSED</h4>
                <p className="text-[10px] text-samridhi-textMuted max-w-sm font-semibold">Identity authenticated via facial features. Mock Aadhaar data linked and verified.</p>
                <div className="pt-2">
                  <span className="px-3.5 py-1 rounded-md bg-samridhi-success/10 border border-samridhi-success/30 text-samridhi-success font-black tracking-widest text-[9px]">
                    +8 CREDIBILITY POINTS ACTIVE
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-samridhi-primary/10 flex items-center justify-center mx-auto text-samridhi-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-white uppercase tracking-wider">Begin Identity Verification</h4>
                  <p className="text-[10px] text-samridhi-textMuted max-w-xs leading-normal mt-0.5 font-semibold">Please ensure you are in a well-lit area before starting video parsing.</p>
                </div>
                <button
                  onClick={startKycFlow}
                  className="px-5 py-2.5 bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-samridhi-primary/15 transition-all"
                >
                  Verify Identity
                </button>
              </div>
            )}
          </div>
        )}

        {kycStep === 'camera' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Webcam card container */}
            <div className="relative w-80 h-52 bg-black rounded-2xl border-2 border-white/[0.08] overflow-hidden">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover animate-fade-in"
              />
              
              {/* Corner brackets overlay */}
              <div className="absolute inset-6 border-2 border-transparent pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-samridhi-secondary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-samridhi-secondary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-samridhi-secondary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-samridhi-secondary"></div>
              </div>

              {/* Cyan scanning line */}
              <div className="absolute left-6 right-6 h-0.5 bg-[#00D4FF] opacity-80 animate-scan pointer-events-none"></div>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <span className="text-xs font-black text-white uppercase tracking-wider">{instruction}</span>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-samridhi-secondary animate-ping"></div>
                <span className="text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wide">Scanning facial geometry...</span>
              </div>
            </div>
            
            <canvas ref={canvasRef} width="300" height="200" className="hidden" />
          </div>
        )}

        {kycStep === 'ocr' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Frozen frame snapshot */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-72 h-48 rounded-2xl overflow-hidden border border-samridhi-success/50">
                <img src={capturedImage} alt="Snapshot" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-samridhi-success/5 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-samridhi-success border-2 border-white flex items-center justify-center text-white shadow-xl animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-samridhi-success tracking-widest bg-samridhi-success/15 px-2.5 py-0.5 rounded">
                Liveness Check: PASSED
              </span>
            </div>

            {/* Typewritten mock Aadhaar values */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-4.5 rounded-xl space-y-3 text-[10px] font-mono leading-relaxed">
              <h4 className="font-extrabold text-[9px] text-samridhi-textMuted uppercase font-sans tracking-wider border-b border-white/[0.04] pb-1.5 mb-2.5">
                OCR Document Extraction
              </h4>
              <div>
                <span className="text-samridhi-textMuted block font-sans uppercase tracking-wide text-[8px]">Aadhaar Card:</span>
                <span className="text-samridhi-secondary font-bold font-mono">{ocrText.number || ' '}</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block font-sans uppercase tracking-wide text-[8px]">Full Name:</span>
                <span className="text-white font-bold">{ocrText.name || ' '}</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block font-sans uppercase tracking-wide text-[8px]">Date of Birth:</span>
                <span className="text-white font-bold">{ocrText.dob || ' '}</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block font-sans uppercase tracking-wide text-[8px]">Address:</span>
                <span className="text-white font-bold">{ocrText.address || ' '}</span>
              </div>
            </div>
          </div>
        )}

        {kycStep === 'completed' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-samridhi-success/15 border border-samridhi-success/45 text-samridhi-success flex items-center justify-center shadow-lg shadow-samridhi-success/10 animate-bounce">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">KYC Verification complete</h4>
              <p className="text-[10px] text-samridhi-textMuted max-w-sm font-semibold">Facial liveness score and Aadhaar card successfully linked. Rating updated permanently.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] p-4.5 rounded-xl w-full max-w-sm text-left grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-sans tracking-wide">Document ID</span>
                <span className="font-bold text-white">XXXX XXXX 8742</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-sans tracking-wide">Cardholder</span>
                <span className="font-bold text-white font-sans">Arjun Sharma</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-sans tracking-wide">DOB</span>
                <span className="font-bold text-white">15/08/1998</span>
              </div>
              <div>
                <span className="text-samridhi-textMuted block text-[9px] uppercase font-sans tracking-wide">State</span>
                <span className="font-bold text-white font-sans">Telangana</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <span className="block px-3.5 py-1.5 rounded-lg bg-samridhi-success/10 border border-samridhi-success/35 text-samridhi-success font-black text-[10px]">
                KYC Score: +8 credibility points added!
              </span>
              <button 
                onClick={() => setKycStep('idle')}
                className="text-[10px] font-black text-samridhi-textMuted hover:text-white underline uppercase block pt-1.5"
              >
                Reset Verification
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gov ID Integrations Checklist */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary shadow-lg space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/[0.04] pb-3 text-glow-primary">
          Profile Credentials & KYC Registry
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal info form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1 tracking-wider">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value.toUpperCase() })}
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1 tracking-wider">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-white/[0.02] border border-white/[0.08] text-samridhi-textMuted rounded-lg p-2.5 cursor-not-allowed opacity-60 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1 tracking-wider">Earning Profile Sector</label>
              <select
                value={user.type}
                onChange={(e) => setUser({ ...user, type: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all font-bold"
              >
                <option value="Salaried" className="bg-samridhi-bg text-white">Salaried Employee</option>
                <option value="Freelancer" className="bg-samridhi-bg text-white">Freelancer / Gig Contractor</option>
                <option value="Student" className="bg-samridhi-bg text-white">Student (Vocational/Tech)</option>
                <option value="Entrepreneur" className="bg-samridhi-bg text-white">Micro-Entrepreneur / Merchant</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1 tracking-wider">Linked UPI ID (VPA)</label>
              <input
                type="text"
                value={user.upiVpa || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setUser({ ...user, upiVpa: val });
                  setUpiLinked(val.trim() !== '');
                }}
                placeholder="e.g. yourname@okaxis"
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all font-bold"
              />
            </div>
          </div>

          {/* KYC Checklist */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider border-b border-white/[0.04] pb-2.5">
              Gov ID Integrations
            </h4>
            
            <div className="space-y-3.5 pt-1">
              {/* Aadhaar checkbox */}
              <label className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl cursor-pointer hover:border-samridhi-primary/25 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={aadhaarVerified}
                    onChange={(e) => setAadhaarVerified(e.target.checked)}
                    className="rounded text-samridhi-primary border-white/[0.08] focus:ring-samridhi-primary bg-transparent"
                  />
                  <span className="text-xs font-bold text-white">Aadhaar Registry Sync</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${aadhaarVerified ? 'bg-samridhi-success/10 text-samridhi-success border border-samridhi-success/20' : 'bg-white/[0.06] text-samridhi-textMuted'}`}>
                  {aadhaarVerified ? 'Verified (+4)' : 'Unlinked'}
                </span>
              </label>

              {/* PAN */}
              <label className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl cursor-pointer hover:border-samridhi-primary/25 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={panVerified}
                    onChange={(e) => setPanVerified(e.target.checked)}
                    className="rounded text-samridhi-primary border-white/[0.08] focus:ring-samridhi-primary bg-transparent"
                  />
                  <span className="text-xs font-bold text-white">PAN Registry Match</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${panVerified ? 'bg-samridhi-success/10 text-samridhi-success border border-samridhi-success/20' : 'bg-white/[0.06] text-samridhi-textMuted'}`}>
                  {panVerified ? 'Verified (+3)' : 'Unlinked'}
                </span>
              </label>

              {/* UPI */}
              <label className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl cursor-pointer hover:border-samridhi-primary/25 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={upiLinked}
                    onChange={(e) => setUpiLinked(e.target.checked)}
                    className="rounded text-samridhi-primary border-white/[0.08] focus:ring-samridhi-primary bg-transparent"
                  />
                  <span className="text-xs font-bold text-white">UPI Aggregator Sync</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${upiLinked ? 'bg-samridhi-success/10 text-samridhi-success border border-samridhi-success/20' : 'bg-white/[0.06] text-samridhi-textMuted'}`}>
                  {upiLinked ? 'Synced (+10)' : 'Disconnected'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS & CERTIFICATIONS CARD */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-success space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-glow-success">
              Verified Skills & Certifications
            </h3>
            <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-0.5">
              Skill Credibility Index: 14/20
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dashboardState.skills.map((skill) => (
            <div key={skill.id} className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-samridhi-primary/10 flex items-center justify-center text-samridhi-primary">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">{skill.name}</h4>
                  <p className="text-[9px] text-samridhi-textMuted mt-0.5 truncate max-w-[150px] font-semibold">{skill.issuer}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-samridhi-success uppercase flex items-center space-x-0.5 shrink-0 bg-samridhi-success/5 border border-samridhi-success/20 px-2 py-0.5 rounded-md">
                <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified</span>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <form onSubmit={handleAddCertSubmit} className="bg-white/[0.02] border-2 border-dashed border-samridhi-primary/40 p-4 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Cert Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google UX Certificate"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/35 rounded p-1.5 focus:border-samridhi-primary focus:outline-none font-bold text-[10px] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Issuing Body</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coursera"
                    value={issuingBody}
                    onChange={(e) => setIssuingBody(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/35 rounded p-1.5 focus:border-samridhi-primary focus:outline-none font-bold text-[10px] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Year</label>
                  <select
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/35 rounded p-1.5 text-white focus:outline-none text-[10px] font-bold"
                  >
                    {['2026', '2025', '2024', '2023', '2022', '2021'].map(y => (
                      <option key={y} value={y} className="bg-samridhi-bg text-white">{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Upload File</label>
                  <input
                    type="file"
                    className="w-full text-[9px] text-samridhi-textMuted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-bold file:bg-white/[0.06] file:text-white cursor-pointer focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.08] text-samridhi-textMuted rounded text-[10px] font-black uppercase hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-samridhi-primary text-white rounded text-[10px] font-black uppercase shadow shadow-samridhi-primary/25"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <div 
              onClick={() => setShowAddForm(true)}
              className="bg-white/[0.02] border-2 border-dashed border-white/[0.08] hover:border-samridhi-primary/45 transition-colors p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer text-center group"
            >
              <div className="w-7 h-7 rounded-full bg-white/[0.06] group-hover:bg-samridhi-primary/10 transition-colors flex items-center justify-center mb-2 text-samridhi-textMuted group-hover:text-samridhi-primary font-black text-xs">
                +
              </div>
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">Add Certification</span>
              <p className="text-[10px] text-samridhi-textMuted mt-1 font-semibold">Upload verified files to boost your trust index</p>
            </div>
          )}
        </div>
      </div>

      {/* LINKED ACCOUNTS CARD */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-secondary space-y-4 shadow-lg">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider text-glow-secondary">
            Linked Telemetry Accounts
          </h3>
          <p className="text-[10px] text-samridhi-textMuted mt-0.5 font-semibold">Toggle live sync endpoints to adjust underwriting signals.</p>
        </div>

        <div className="space-y-3.5">
          {/* UPI */}
          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-secondary/10 flex items-center justify-center text-samridhi-secondary">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">UPI / PhonePe Aggregator</h4>
                <span className="text-[9px] font-black uppercase text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedUpi(!linkedUpi)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedUpi ? 'bg-samridhi-success' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedUpi ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Bank */}
          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-success/10 flex items-center justify-center text-samridhi-success">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Bank Statement Parser</h4>
                <span className="text-[9px] font-black uppercase text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedBank(!linkedBank)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedBank ? 'bg-samridhi-success' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedBank ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-primary/10 flex items-center justify-center text-samridhi-primary">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">LinkedIn Professional profile</h4>
                <span className="text-[9px] font-black uppercase text-samridhi-textMuted">Not Connected</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setLinkedLinkedIn(!linkedLinkedIn)}
                className="text-[9px] font-black uppercase border border-white/[0.08] hover:border-samridhi-primary hover:text-samridhi-primary px-2.5 py-1 rounded-lg transition-colors"
              >
                Connect
              </button>
              <button
                onClick={() => setLinkedLinkedIn(!linkedLinkedIn)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                  linkedLinkedIn ? 'bg-samridhi-success' : 'bg-white/[0.08]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedLinkedIn ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {/* Coursera */}
          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-warning/10 flex items-center justify-center text-samridhi-warning">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Coursera / Udemy certifications</h4>
                <span className="text-[9px] font-black uppercase text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedCoursera(!linkedCoursera)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedCoursera ? 'bg-samridhi-success' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedCoursera ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary space-y-4 shadow-lg">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/[0.04] pb-2 text-glow-primary">
          Notification Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <span className="font-bold text-xs text-white">Score change alerts</span>
            <button
              onClick={() => setScoreAlerts(!scoreAlerts)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                scoreAlerts ? 'bg-samridhi-primary' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${scoreAlerts ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <span className="font-bold text-xs text-white">Loan offer alerts</span>
            <button
              onClick={() => setOfferAlerts(!offerAlerts)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                offerAlerts ? 'bg-samridhi-primary' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${offerAlerts ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <span className="font-bold text-xs text-white">Payment reminders</span>
            <button
              onClick={() => setPaymentReminders(!paymentReminders)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                paymentReminders ? 'bg-samridhi-primary' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${paymentReminders ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <span className="font-bold text-xs text-white">Monthly report digest</span>
            <button
              onClick={() => setMonthlyReport(!monthlyReport)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                monthlyReport ? 'bg-samridhi-primary' : 'bg-white/[0.08]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${monthlyReport ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="glass-card border-2 border-samridhi-danger/25 p-6 rounded-3xl shadow-lg space-y-4">
        <h3 className="text-sm font-black text-samridhi-danger uppercase tracking-wider">
          Danger Zone
        </h3>
        <p className="text-[10px] text-samridhi-textMuted leading-relaxed font-semibold">
          Critical operations. Once executed, details relating to alternative indexes, linked accounts, and transactions will be deleted permanently.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button 
            onClick={() => alert("Clear all data requested. Confirm details via support channels.")}
            className="px-4 py-2 border border-samridhi-danger text-samridhi-danger hover:bg-samridhi-danger/10 transition-colors font-black rounded-xl text-[10px] uppercase tracking-wider"
          >
            Clear All Data
          </button>
          <button
            onClick={() => alert("Delete account process initiated. Authentication will be disabled.")}
            className="px-4 py-2 border border-samridhi-danger text-samridhi-danger hover:bg-samridhi-danger/10 transition-colors font-black rounded-xl text-[10px] uppercase tracking-wider"
          >
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
};
