// app.js
// Root coordinator React app mounting wrapper and state router
// Exposes App component and mounts it to #root

const { useState, useEffect, useReducer, useMemo } = React;

// Supabase Client Config
const SUPABASE_URL = "https://lbagswiwwlkcgrfhkyqr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWdzd2l3d2xrY2dyZmhreXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDI2MzcsImV4cCI6MjA5NjExODYzN30.o1x0Zw1F56-XdtjSRhpjAcBvTGw46OC5_EKPwJm-uF0";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
window.supabaseClient = supabaseClient;

// Personalized transaction ledger generator helper
window.personalizeTransactions = (baseTransactions, upiVpa, userName) => {
  if (!upiVpa) return baseTransactions;
  
  const prefix = upiVpa.split('@')[0] || 'User';
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const cleanName = capitalize(prefix);
  
  const suffix = upiVpa.split('@')[1] || 'unionbank';
  let bankName = 'Union Bank';
  if (suffix.includes('sbi')) bankName = 'SBI';
  else if (suffix.includes('axis')) bankName = 'Axis Bank';
  else if (suffix.includes('hdfc')) bankName = 'HDFC Bank';
  else if (suffix.includes('icici')) bankName = 'ICICI Bank';
  else if (suffix.includes('ybl') || suffix.includes('paytm')) bankName = 'UPI Partner';
  
  return baseTransactions.map(t => {
    let merchant = t.merchant;
    if (t.type === 'Credit') {
      if (t.merchant.toLowerCase().includes('salary') || t.merchant.toLowerCase().includes('corp')) {
        merchant = `${bankName} Salary / ${cleanName} Payout`;
      } else if (t.merchant.toLowerCase().includes('upwork') || t.merchant.toLowerCase().includes('freelance')) {
        merchant = `${cleanName} Invoice / Upwork Escrow`;
      } else if (t.merchant.toLowerCase().includes('razorpay')) {
        merchant = `${cleanName} Freelance / Razorpay Gateway`;
      } else {
        merchant = `${cleanName} Payout / ${t.merchant}`;
      }
    } else {
      if (t.merchant.toLowerCase().includes('atm') || t.merchant.toLowerCase().includes('withdrawal')) {
        merchant = `${bankName} ATM Cash Withdrawal`;
      }
    }
    return { ...t, merchant };
  });
};

// UUID Generator Helper for RFC 4122 v4 compliance (compatible with postgres UUID type)
window.generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch(e) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Sector-Specific Initial Data Seeder Helper
window.getSectorInitialState = (userType, userId) => {
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  const uuid = () => window.generateUUID();
  const type = userType || 'Freelancer';
  
  if (type === 'Student') {
    return {
      loans: [
        { id: uuid(), lender: "Vidyarthi Capital", amount: 15000, rate: "9.8%", emi: "₹1,320", status: "Active", date: daysAgo(20) }
      ],
      skills: [
        { id: uuid(), name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", verified: true },
        { id: uuid(), name: "Python Programming Core", issuer: "Google (Coursera)", verified: true },
        { id: uuid(), name: "Data Structures & Algorithms", issuer: "Stanford Online", verified: false }
      ],
      inventory: [
        { id: uuid(), name: "Development Laptop", category: "Education Tools", quantity: 1, unit: "unit", price: 45000, lastUpdated: daysAgo(10) },
        { id: uuid(), name: "Technical Textbooks", category: "Study Material", quantity: 8, unit: "books", price: 800, lastUpdated: daysAgo(5) }
      ]
    };
  } else if (type === 'Entrepreneur' || type === 'Business Founder') {
    return {
      loans: [
        { id: uuid(), lender: "Udyog MicroFund", amount: 200000, rate: "13.2%", emi: "₹5,224", status: "Active", date: daysAgo(45) }
      ],
      skills: [
        { id: uuid(), name: "Micro-Business Management", issuer: "MSME India", verified: true },
        { id: uuid(), name: "Digital Marketing Basics", issuer: "Google", verified: true },
        { id: uuid(), name: "GST & Financial Compliance", issuer: "ICAI", verified: false }
      ],
      inventory: [
        { id: uuid(), name: "Arabica Coffee Beans", category: "Raw Materials", quantity: 150, unit: "kg", price: 350, lastUpdated: daysAgo(5) },
        { id: uuid(), name: "Paper Cups & Lids", category: "Packaging", quantity: 1200, unit: "pcs", price: 3, lastUpdated: daysAgo(5) },
        { id: uuid(), name: "Commercial Espresso Machine", category: "Equipment", quantity: 1, unit: "unit", price: 85000, lastUpdated: daysAgo(5) }
      ]
    };
  } else if (type === 'Salaried') {
    return {
      loans: [
        { id: uuid(), lender: "Salary Quick Advance", amount: 50000, rate: "10.0%", emi: "₹4,395", status: "Active", date: daysAgo(10) }
      ],
      skills: [
        { id: uuid(), name: "Project Management Professional", issuer: "PMI", verified: true },
        { id: uuid(), name: "Advanced Microsoft Excel", issuer: "Corporate Academy", verified: true },
        { id: uuid(), name: "Corporate Communications", issuer: "LinkedIn Learning", verified: false }
      ],
      inventory: [
        { id: uuid(), name: "Personal Commute Vehicle", category: "Assets", quantity: 1, unit: "unit", price: 95000, lastUpdated: daysAgo(12) }
      ]
    };
  } else {
    // Freelancer
    return {
      loans: [
        { id: uuid(), lender: "Samridhi Capital Fund", amount: 75000, rate: "11.5%", emi: "₹2,500", status: "Active", date: daysAgo(30) }
      ],
      skills: [
        { id: uuid(), name: "React Frontend Engineer", issuer: "Meta (Coursera)", verified: true },
        { id: uuid(), name: "Advanced Financial Analytics", issuer: "Wharton Online", verified: false },
        { id: uuid(), name: "Professional English Writing", issuer: "British Council", verified: true }
      ],
      inventory: [
        { id: uuid(), name: "High-End MacBook Pro", category: "Equipment", quantity: 1, unit: "unit", price: 150000, lastUpdated: daysAgo(8) },
        { id: uuid(), name: "Ergonomic Desk & Chair", category: "Equipment", quantity: 1, unit: "set", price: 25000, lastUpdated: daysAgo(8) }
      ]
    };
  }
};

// --- STARTUP SPLASH SCREEN ---
function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const systemLogs = [
    "Establishing secure quantum handshakes...",
    "Scanning decentralized invoice pools...",
    "Connecting UPI ledger pipeline...",
    "Extracting Underwriting tensors...",
    "Clustering Isolation Forest vectors...",
    "Decrypting PAN/Aadhaar nodes...",
    "Calculated baseline risk index: 0.14",
    "Samridhi Credit Engine initialized."
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + 5;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex(prev => {
        if (prev < systemLogs.length - 1) {
          return prev + 1;
        }
        clearInterval(logTimer);
        return prev;
      });
    }, 250);

    return () => clearInterval(logTimer);
  }, []);

  const cashNotes = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      size: 14 + Math.random() * 16,
      type: Math.random() > 0.4 ? 'note' : 'coin'
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-[#040806] z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none bg-grid-glow">
      {cashNotes.map(note => (
        <div 
          key={note.id}
          className="falling-cash-item flex items-center justify-center text-samridhi-primary/20"
          style={{
            left: `${note.left}%`,
            animationDelay: `${note.delay}s`,
            animationDuration: `${note.duration}s`
          }}
        >
          {note.type === 'note' ? (
            <svg style={{ width: note.size, height: note.size }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 10h16v4H4z" opacity="0.3"/>
              <path d="M2 4v16h20V4H2zm18 14H4V6h16v12zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          ) : (
            <svg style={{ width: note.size, height: note.size }} fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </div>
      ))}

      <div className="relative flex flex-col items-center space-y-6 animate-fade-in text-center max-w-sm px-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-[0_0_25px_rgba(0,230,118,0.4)] border border-samridhi-primary/40 animate-pulse">
          <span className="text-samridhi-bg font-extrabold text-3xl">₹</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black bg-gradient-to-r from-samridhi-primary to-samridhi-secondary bg-clip-text text-transparent tracking-widest">
            SAMRIDHI
          </h1>
          <p className="text-[8px] uppercase font-bold text-samridhi-textMuted tracking-widest">
            AI-Driven Credit Underwriter
          </p>
        </div>

        <div className="w-72 bg-black/60 border border-samridhi-border rounded-xl p-4 h-32 font-mono text-[9px] text-samridhi-primary/80 text-left space-y-1 shadow-inner overflow-hidden">
          {systemLogs.slice(0, logIndex + 1).map((log, idx) => (
            <div key={idx} className="flex items-start">
              <span className="text-samridhi-secondary mr-2 font-black">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          <div className="w-1.5 h-3 bg-samridhi-primary animate-pulse inline-block"></div>
        </div>

        <div className="w-full bg-samridhi-surface border border-samridhi-border h-2 rounded-full p-0.5 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="font-mono font-black text-samridhi-primary text-[9px] tracking-widest">{progress}% INITIALIZED</span>
      </div>
    </div>
  );
}

const REDUCER_INITIAL_STATE = {
  loans: [
    { id: 'l-1', lender: "Samridhi Capital Fund", amount: 50000, rate: "9.5%", emi: "₹4,380", status: "Active", date: "2026-04-15" },
    { id: 'l-2', lender: "Nutan Micro-Finance", amount: 15000, rate: "8.0%", emi: "₹2,560", status: "Completed", date: "2026-01-20" }
  ],
  transactions: [
    { id: 't-1', date: "2026-05-20", merchant: "Amazon Web Services", amount: -3499, category: "Business Hosting", type: "Debit" },
    { id: 't-2', date: "2026-05-18", merchant: "Chai Point Bangalore", amount: -180, category: "Food & Beverage", type: "Debit" },
    { id: 't-3', date: "2026-05-16", merchant: "Upwork Global Inc", amount: 38000, category: "Freelance Income", type: "Credit" },
    { id: 't-4', date: "2026-05-12", merchant: "Swiggy Delivery", amount: -650, category: "Food & Beverage", type: "Debit" },
    { id: 't-5', date: "2026-05-10", merchant: "Jio Infocomm Ltd", amount: -749, category: "Telecom Utility", type: "Debit" }
  ],
  skills: [
    { id: 's-1', name: "AWS Solutions Architect", issuer: "Amazon Web Services", verified: true },
    { id: 's-2', name: "React Frontend Engineer", issuer: "Meta (Coursera)", verified: true },
    { id: 's-3', name: "Advanced Financial Analytics", issuer: "Wharton Online", verified: false },
    { id: 's-4', name: "Professional English Writing", issuer: "British Council", verified: true }
  ],
  inventory: [
    { id: 'inv-1', name: "Arabica Coffee Beans", category: "Raw Materials", quantity: 150, unit: "kg", price: 350, lastUpdated: "2026-05-24" },
    { id: 'inv-2', name: "Paper Cups & Lids", category: "Packaging", quantity: 1200, unit: "pcs", price: 3, lastUpdated: "2026-05-25" },
    { id: 'inv-3', name: "Packaged Roasted Coffee", category: "Finished Goods", quantity: 45, unit: "pouches", price: 580, lastUpdated: "2026-05-25" }
  ],
  notifications: [
    { id: 'n-1', text: "Your UPI analysis shows standard caching: Stability Index is HIGH (+15 score points).", read: false, date: "2 hrs ago" },
    { id: 'n-2', text: "Skill Verification Successful: Meta React Certificate connected (+10 score points).", read: false, date: "1 day ago" },
    { id: 'n-3', text: "Welcome to Samridhi! Complete your Profile to scan your Credit Index.", read: true, date: "3 days ago" }
  ],
  hasUnreadNotifications: true
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].slice(0, 15) // cap at 15 items
      };
    case 'ADD_TRANSACTION_BULK':
      return {
        ...state,
        transactions: [...action.payload, ...state.transactions].slice(0, 30) // cap at 30 items for bulk sync
      };
    case 'APPLY_LOAN':
      return {
        ...state,
        loans: [action.payload, ...state.loans]
      };
    case 'TOGGLE_SKILL_VERIFICATION':
      return {
        ...state,
        skills: state.skills.map(s => s.id === action.payload ? { ...s, verified: !s.verified } : s)
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        hasUnreadNotifications: true
      };
    case 'READ_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        hasUnreadNotifications: false
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload]
      };
    case 'ADD_INVENTORY_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };
    case 'REMOVE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        loans: action.payload.loans || [],
        transactions: action.payload.transactions || [],
        skills: action.payload.skills || [],
        inventory: action.payload.inventory || []
      };
    case 'SET_LOANS':
      return {
        ...state,
        loans: action.payload || []
      };
    case 'RESET_STATE':
      return REDUCER_INITIAL_STATE;
    default:
      return state;
  }
}

function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Routing State: 'landing' | 'signin' | 'signup' | 'dashboard'
  const [page, setPage] = useState('landing');
  const [landingMobileMenuOpen, setLandingMobileMenuOpen] = useState(false);
  
  // Authentication State
  const [user, setUser] = useState(null);

  // Dashboard Routing State: 'overview' | 'apply' | 'score' | 'transactions' | 'recommendations' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // State for notification popover
  const [showNotifications, setShowNotifications] = useState(false);

  // Reducer for complex mock data interactions
  const [dashboardState, dispatch] = useReducer(dashboardReducer, REDUCER_INITIAL_STATE);

  // Skill validation states
  const [aadhaarVerified, setAadhaarVerified] = useState(true);
  const [panVerified, setPanVerified] = useState(true);
  const [upiLinked, setUpiLinked] = useState(true);
  const [upiVerified, setUpiVerified] = useState(false);

  // KYC Camera & Statement Upload states
  const [kycCameraVerified, setKycCameraVerified] = useState(false);
  const [bankStatementUploaded, setBankStatementUploaded] = useState(false);
  const [voiceNavigationActive, setVoiceNavigationActive] = useState(false);

  // What-If score parameters state (in My Score Tab)
  const [whatIfRepayActive, setWhatIfRepayActive] = useState(false);
  const [whatIfLinkGithub, setWhatIfLinkGithub] = useState(false);
  const [whatIfNewCert, setWhatIfNewCert] = useState(false);
  const [whatIfConsistentUpi, setWhatIfConsistentUpi] = useState(false);

  // Calculate score based on user profile and linked metrics from ml_engine
  const calculatedScore = useMemo(() => {
    return window.calculateCredibilityScore(user, {
      aadhaarVerified,
      panVerified,
      upiLinked,
      upiVerified,
      skills: dashboardState.skills,
      inventory: dashboardState.inventory,
      transactions: dashboardState.transactions,
      kycCameraVerified,
      bankStatementUploaded,
      whatIfRepayActive,
      whatIfLinkGithub,
      whatIfNewCert,
      whatIfConsistentUpi
    });
  }, [user, aadhaarVerified, panVerified, upiLinked, upiVerified, dashboardState.skills, dashboardState.inventory, dashboardState.transactions, kycCameraVerified, bankStatementUploaded, whatIfRepayActive, whatIfLinkGithub, whatIfNewCert, whatIfConsistentUpi]);

  // Voice Navigation Continuous Speech recognition listener
  useEffect(() => {
    if (!voiceNavigationActive) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      console.log("Voice command: ", command);

      if (command.includes('go to my score') || command.includes('go to score') || command.includes('show my score')) {
        setActiveTab('score');
      } else if (command.includes('show recommendations') || command.includes('loan recommendations') || command.includes('recommendations')) {
        setActiveTab('recommendations');
      } else if (command.includes('apply for loan') || command.includes('apply loan') || command.includes('apply for a loan')) {
        setActiveTab('apply');
      } else if (command.includes('what is my score') || command.includes('check my score') || command.includes('my score')) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = `Your current credibility index score is ${calculatedScore} points, indicating a low risk profile.`;
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1;
        window.speechSynthesis.speak(msg);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
    };

    recognition.onend = () => {
      if (voiceNavigationActive) {
        try { recognition.start(); } catch (e) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }

    return () => {
      recognition.onend = null;
      try { recognition.stop(); } catch (e) {}
    };
  }, [voiceNavigationActive, calculatedScore]);

  // Real-time synchronization polling for customers (every 5 seconds)
  useEffect(() => {
    if (!user || user.type === 'Banker') return;

    const interval = setInterval(async () => {
      try {
        if (user.isDemo) {
          // Poll from localStorage for demo users
          const localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
          const profile = localProfiles.find(p => p.id === user.id);
          if (profile) {
            setAadhaarVerified(profile.aadhaar_verified);
            setPanVerified(profile.pan_verified);
            setUpiVerified(profile.upi_verified);
          }
          const localLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]');
          const userLoans = localLoans.filter(l => l.user_id === user.id);

          // Check for status transitions to notify the user in real-time
          userLoans.forEach(l => {
            const prevLoan = dashboardState.loans.find(pl => pl.id === l.id);
            if (prevLoan && prevLoan.status !== l.status) {
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  id: `n-loan-${l.id}-${Date.now()}`,
                  text: `Loan Request Update: Your application for ₹${parseFloat(l.amount).toLocaleString()} with ${l.lender} is now marked as ${l.status.toUpperCase()}.`,
                  read: false,
                  date: "Just now"
                }
              });
            }
          });

          dispatch({
            type: 'SET_LOANS',
            payload: userLoans.map(l => ({ id: l.id, lender: l.lender, amount: parseFloat(l.amount), rate: l.rate, emi: l.emi, status: l.status, date: l.date }))
          });
        } else if (supabaseClient) {
          const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
          if (profile) {
            setAadhaarVerified(profile.aadhaar_verified);
            setPanVerified(profile.pan_verified);
            setUpiVerified(profile.upi_verified);
          }
          const { data: loans } = await supabaseClient.from('loans').select('*').eq('user_id', user.id).order('date', { ascending: false });
          if (loans) {
            // Check for status transitions to notify the user in real-time
            loans.forEach(l => {
              const prevLoan = dashboardState.loans.find(pl => pl.id === l.id);
              if (prevLoan && prevLoan.status !== l.status) {
                dispatch({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    id: `n-loan-${l.id}-${Date.now()}`,
                    text: `Loan Request Update: Your application for ₹${parseFloat(l.amount).toLocaleString()} with ${l.lender} is now marked as ${l.status.toUpperCase()}.`,
                    read: false,
                    date: "Just now"
                  }
                });
              }
            });

            dispatch({
              type: 'SET_LOANS',
              payload: loans.map(l => ({ id: l.id, lender: l.lender, amount: parseFloat(l.amount), rate: l.rate, emi: l.emi, status: l.status, date: l.date }))
            });
          }
        }
      } catch (e) {
        console.warn("Real-time customer polling sync error: ", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, dashboardState.loans]);

  // Custom dbDispatch interceptor to sync state transitions with Supabase / localStorage
  const dbDispatch = (action) => {
    dispatch(action);

    if (!user) return;
    const userId = user.id;

    if (user.isDemo) {
      switch (action.type) {
        case 'ADD_TRANSACTION': {
          const localTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]');
          localTxs.unshift({
            id: `t-demo-${userId}-${Date.now()}`,
            user_id: userId,
            date: action.payload.date,
            merchant: action.payload.merchant,
            amount: action.payload.amount,
            category: action.payload.category,
            type: action.payload.type
          });
          localStorage.setItem('samridhi_transactions', JSON.stringify(localTxs));
          break;
        }
        case 'ADD_TRANSACTION_BULK': {
          const localTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]');
          const formattedTxs = action.payload.map((tx, idx) => ({
            id: `t-demo-${userId}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
            user_id: userId,
            date: tx.date,
            merchant: tx.merchant,
            amount: tx.amount,
            category: tx.category,
            type: tx.type
          }));
          localTxs.unshift(...formattedTxs);
          localStorage.setItem('samridhi_transactions', JSON.stringify(localTxs));
          break;
        }
        case 'APPLY_LOAN': {
          const localLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]');
          localLoans.unshift({
            id: action.payload.id,
            user_id: userId,
            lender: action.payload.lender,
            amount: action.payload.amount,
            rate: action.payload.rate,
            emi: action.payload.emi,
            status: action.payload.status,
            date: action.payload.date,
            video_intent: action.payload.video_intent,
            intent_language: action.payload.intent_language
          });
          localStorage.setItem('samridhi_loans', JSON.stringify(localLoans));
          break;
        }
        case 'TOGGLE_SKILL_VERIFICATION': {
          let localSkills = JSON.parse(localStorage.getItem('samridhi_skills') || '[]');
          localSkills = localSkills.map(s => s.id === action.payload ? { ...s, verified: !s.verified } : s);
          localStorage.setItem('samridhi_skills', JSON.stringify(localSkills));
          break;
        }
        case 'ADD_SKILL': {
          const localSkills = JSON.parse(localStorage.getItem('samridhi_skills') || '[]');
          localSkills.push({
            id: `s-demo-${userId}-${Date.now()}`,
            user_id: userId,
            name: action.payload.name,
            issuer: action.payload.issuer,
            verified: action.payload.verified
          });
          localStorage.setItem('samridhi_skills', JSON.stringify(localSkills));
          break;
        }
        case 'ADD_INVENTORY_ITEM': {
          const localInventory = JSON.parse(localStorage.getItem('samridhi_inventory') || '[]');
          localInventory.push({
            id: `inv-demo-${userId}-${Date.now()}`,
            user_id: userId,
            name: action.payload.name,
            category: action.payload.category,
            quantity: action.payload.quantity,
            unit: action.payload.unit,
            price: action.payload.price,
            last_updated: action.payload.lastUpdated
          });
          localStorage.setItem('samridhi_inventory', JSON.stringify(localInventory));
          break;
        }
        case 'REMOVE_INVENTORY_ITEM': {
          let localInventory = JSON.parse(localStorage.getItem('samridhi_inventory') || '[]');
          localInventory = localInventory.filter(item => item.id !== action.payload);
          localStorage.setItem('samridhi_inventory', JSON.stringify(localInventory));
          break;
        }
        default:
          break;
      }
      return;
    }

    if (!supabaseClient) return;

    switch (action.type) {
      case 'ADD_TRANSACTION':
        supabaseClient
          .from('transactions')
          .insert({
            user_id: userId,
            date: action.payload.date,
            merchant: action.payload.merchant,
            amount: action.payload.amount,
            category: action.payload.category,
            type: action.payload.type
          })
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing transactions: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents syncing transactions. Run 'supabase_setup.sql' to configure policies.");
              }
            }
          });
        break;

      case 'ADD_TRANSACTION_BULK': {
        const insertBulk = action.payload.map(tx => ({
          user_id: userId,
          date: tx.date,
          merchant: tx.merchant,
          amount: tx.amount,
          category: tx.category,
          type: tx.type
        }));
        supabaseClient
          .from('transactions')
          .insert(insertBulk)
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing bulk transactions: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents syncing transactions. Run 'supabase_setup.sql' to configure policies.");
              }
            }
          });
        break;
      }

      case 'APPLY_LOAN':
        supabaseClient
          .from('loans')
          .insert({
            id: action.payload.id,
            user_id: userId,
            lender: action.payload.lender,
            amount: action.payload.amount,
            rate: action.payload.rate,
            emi: action.payload.emi,
            status: action.payload.status,
            date: action.payload.date,
            intent_language: action.payload.intent_language || 'English',
            // Note: video_intent may be a large base64 string; only sync if present
            ...(action.payload.video_intent ? { video_intent: action.payload.video_intent } : {})
          })
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing loans: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents saving this loan application to Supabase.\n\nTip: Open your Supabase SQL Editor and run the setup script 'supabase_setup.sql' located in your project folder.");
              }
            }
          });
        break;


      case 'TOGGLE_SKILL_VERIFICATION': {
        const targetSkill = dashboardState.skills.find(s => s.id === action.payload);
        if (targetSkill) {
          supabaseClient
            .from('skills')
            .update({ verified: !targetSkill.verified })
            .eq('id', action.payload)
            .then(({ error }) => {
              if (error) {
                console.error("Error syncing skills: ", error);
                if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                  alert("Database RLS Error: Row-Level Security prevents updating skill verification.");
                }
              }
            });
        }
        break;
      }

      case 'ADD_SKILL':
        supabaseClient
          .from('skills')
          .insert({
            id: action.payload.id,
            user_id: userId,
            name: action.payload.name,
            issuer: action.payload.issuer,
            verified: action.payload.verified
          })
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing skills: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents adding skills. Run 'supabase_setup.sql'.");
              }
            }
          });
        break;

      case 'ADD_INVENTORY_ITEM':
        supabaseClient
          .from('inventory')
          .insert({
            id: action.payload.id,
            user_id: userId,
            name: action.payload.name,
            category: action.payload.category,
            quantity: action.payload.quantity,
            unit: action.payload.unit,
            price: action.payload.price,
            last_updated: action.payload.lastUpdated
          })
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing inventory: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents adding inventory. Run 'supabase_setup.sql'.");
              }
            }
          });
        break;

      case 'REMOVE_INVENTORY_ITEM':
        supabaseClient
          .from('inventory')
          .delete()
          .eq('id', action.payload)
          .then(({ error }) => {
            if (error) {
              console.error("Error syncing inventory deletion: ", error);
              if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
                alert("Database RLS Error: Row-Level Security prevents deleting inventory. Run 'supabase_setup.sql'.");
              }
            }
          });
        break;

      default:
        break;
    }
  };

  // Fetch and seed Supabase user records
  const fetchAndPopulateState = async (userId, userEmail) => {
    if (!supabaseClient) return;

    try {
      // 1. Profile sync/load
      const { data: profile, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr && profileErr.code !== 'PGRST116') {
        throw profileErr;
      }

      let activeProfile = profile;
      if (!activeProfile) {
        const { data: { user: authUser } } = await supabaseClient.auth.getUser();
        const meta = authUser?.user_metadata || {};
        
        const emailPrefix = userEmail ? userEmail.split('@')[0] : 'user';
        const { data: newProfile, error: createErr } = await supabaseClient
          .from('profiles')
          .insert({
            id: userId,
            name: meta.name || emailPrefix.toUpperCase(),
            email: userEmail || 'user@samridhi.in',
            type: meta.type || 'Freelancer',
            upi_vpa: meta.upi_vpa || ''
          })
          .select()
          .single();
        if (createErr) {
          if (createErr.code === '42501' || (createErr.message && createErr.message.includes('row-level security'))) {
            alert("Database RLS Error: Row-Level Security prevents creating a profile for this user on Supabase.\n\nTip: Open your Supabase SQL Editor and run the setup script 'supabase_setup.sql' located in your project folder.");
          }
          throw createErr;
        }
        activeProfile = newProfile;
      }

      if (activeProfile) {
        if (activeProfile.type === 'Banker') {
          const { data: { user: authUser } } = await supabaseClient.auth.getUser();
          const meta = authUser?.user_metadata || {};
          setUser({
            id: userId,
            name: activeProfile.name,
            email: activeProfile.email,
            type: 'Banker',
            bankName: meta.bankName || 'State Bank of India',
            employeeId: meta.employeeId || 'EMP-SBI-999',
            ifscCode: meta.ifscCode || 'SBIN0000123',
            designation: meta.designation || 'Credit Risk Underwriter',
            licenseId: meta.licenseId || 'RBI-SBI-2026',
            upiVpa: ''
          });
          setPage('banker-dashboard');
          return;
        }

        const { data: { user: authUser } } = await supabaseClient.auth.getUser();
        const meta = authUser?.user_metadata || {};

        setUser({
          id: userId,
          name: activeProfile.name,
          email: activeProfile.email,
          type: activeProfile.type,
          upiVpa: activeProfile.upi_vpa || '',
          githubLinked: meta.githubLinked || false,
          githubUsername: meta.githubUsername || '',
          githubRepos: meta.githubRepos || '',
          githubCommits: meta.githubCommits || '',
          aadhaarVerified: meta.aadhaarVerified || false,
          aadhaarNumber: meta.aadhaarNumber || '',
          aadhaarName: meta.aadhaarName || '',
          projects: meta.projects || []
        });
        setAadhaarVerified(activeProfile.aadhaar_verified);
        setPanVerified(activeProfile.pan_verified);
        setUpiLinked(activeProfile.upi_vpa ? true : false);
        setUpiVerified(activeProfile.upi_verified);
      }

      // 2. Fetch database records
      const { data: txs } = await supabaseClient.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
      const { data: skills } = await supabaseClient.from('skills').select('*').eq('user_id', userId);
      const { data: loans } = await supabaseClient.from('loans').select('*').eq('user_id', userId).order('date', { ascending: false });
      const { data: inventory } = await supabaseClient.from('inventory').select('*').eq('user_id', userId);

      // If database already contains items, load them
      if (txs && txs.length > 0) {
        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            transactions: txs.map(t => ({ id: t.id, date: t.date, merchant: t.merchant, amount: parseFloat(t.amount), category: t.category, type: t.type })),
            skills: skills.map(s => ({ id: s.id, name: s.name, issuer: s.issuer, verified: s.verified })),
            loans: loans.map(l => ({ id: l.id, lender: l.lender, amount: parseFloat(l.amount), rate: l.rate, emi: l.emi, status: l.status, date: l.date })),
            inventory: inventory.map(i => ({ id: i.id, name: i.name, category: i.category, quantity: parseInt(i.quantity), unit: i.unit, price: parseFloat(i.price), lastUpdated: i.last_updated }))
          }
        });
      } else {
        // If empty user tables, seed them with beautiful default records
        console.log("Seeding mock ledger details to Supabase tables...");
        
        const sectorData = getSectorInitialState(activeProfile.type, userId);
        
        const baseTxs = personalizeTransactions(REDUCER_INITIAL_STATE.transactions, activeProfile.upi_vpa, activeProfile.name);
        const insertTxs = baseTxs.map(t => ({
          id: window.generateUUID ? window.generateUUID() : undefined,
          user_id: userId,
          date: t.date,
          merchant: t.merchant,
          amount: t.amount,
          category: t.category,
          type: t.type
        }));
        await supabaseClient.from('transactions').insert(insertTxs);

        const insertSkills = sectorData.skills.map(s => ({
          id: s.id,
          user_id: userId,
          name: s.name,
          issuer: s.issuer,
          verified: s.verified
        }));
        await supabaseClient.from('skills').insert(insertSkills);

        const insertLoans = sectorData.loans.map(l => ({
          id: l.id,
          user_id: userId,
          lender: l.lender,
          amount: l.amount,
          rate: l.rate,
          emi: l.emi,
          status: l.status,
          date: l.date
        }));
        await supabaseClient.from('loans').insert(insertLoans);

        const insertInventory = sectorData.inventory.map(i => ({
          id: i.id,
          user_id: userId,
          name: i.name,
          category: i.category,
          quantity: i.quantity,
          unit: i.unit,
          price: i.price,
          last_updated: i.lastUpdated
        }));
        await supabaseClient.from('inventory').insert(insertInventory);

        // Fetch back clean database records
        const { data: freshTxs } = await supabaseClient.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
        const { data: freshSkills } = await supabaseClient.from('skills').select('*').eq('user_id', userId);
        const { data: freshLoans } = await supabaseClient.from('loans').select('*').eq('user_id', userId).order('date', { ascending: false });
        const { data: freshInventory } = await supabaseClient.from('inventory').select('*').eq('user_id', userId);

        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            transactions: freshTxs.map(t => ({ id: t.id, date: t.date, merchant: t.merchant, amount: parseFloat(t.amount), category: t.category, type: t.type })),
            skills: freshSkills.map(s => ({ id: s.id, name: s.name, issuer: s.issuer, verified: s.verified })),
            loans: freshLoans.map(l => ({ id: l.id, lender: l.lender, amount: parseFloat(l.amount), rate: l.rate, emi: l.emi, status: l.status, date: l.date })),
            inventory: freshInventory.map(i => ({ id: i.id, name: i.name, category: i.category, quantity: parseInt(i.quantity), unit: i.unit, price: parseFloat(i.price), lastUpdated: i.last_updated }))
          }
        });
      }
    } catch (e) {
      console.warn("Failed syncing Supabase profile state: ", e);
    }
  };

  // Check auth session persistence
  useEffect(() => {
    // Check if there is an active demo session in localStorage
    const demoSessionStr = localStorage.getItem('samridhi_demo_session');
    if (demoSessionStr) {
      try {
        const demoUser = JSON.parse(demoSessionStr);
        setUser(demoUser);
        if (demoUser.type === 'Banker') {
          setPage('banker-dashboard');
        } else {
          setPage('dashboard');
          loadDemoUserState(demoUser);
        }
        return;
      } catch (e) {
        console.warn("Failed parsing demo session:", e);
      }
    }

    if (!supabaseClient) return;

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchAndPopulateState(session.user.id, session.user.email);
        setPage('dashboard');
      }
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchAndPopulateState(session.user.id, session.user.email);
        setPage('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setPage('landing');
        dispatch({ type: 'RESET_STATE' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadDemoUserState = (demoUser) => {
    const userId = demoUser.id;
    const userEmail = demoUser.email;
    
    // 1. Get or create profile in localStorage
    let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
    let profile = localProfiles.find(p => p.id === userId);
    
    if (!profile) {
      profile = {
        id: userId,
        name: demoUser.name,
        email: userEmail,
        type: demoUser.type,
        upi_vpa: demoUser.upiVpa || '',
        upi_verified: false,
        aadhaar_verified: true,
        pan_verified: true
      };
      localProfiles.push(profile);
      localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
    }
    
    setAadhaarVerified(profile.aadhaar_verified);
    setPanVerified(profile.pan_verified);
    setUpiLinked(profile.upi_vpa ? true : false);
    setUpiVerified(profile.upi_verified);
    
    // 2. Fetch or seed other data (loans, transactions, skills, inventory) in localStorage
    let localTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]');
    let localSkills = JSON.parse(localStorage.getItem('samridhi_skills') || '[]');
    let localLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]');
    let localInventory = JSON.parse(localStorage.getItem('samridhi_inventory') || '[]');
    
    const userTxs = localTxs.filter(t => t.user_id === userId);
    const userSkills = localSkills.filter(s => s.user_id === userId);
    const userLoans = localLoans.filter(l => l.user_id === userId);
    const userInventory = localInventory.filter(i => i.user_id === userId);
    
    // If no transactions found for this user, seed default values
    if (userTxs.length === 0) {
      const baseTxs = personalizeTransactions(REDUCER_INITIAL_STATE.transactions, profile.upi_vpa, profile.name);
      const seededTxs = baseTxs.map((t, idx) => ({
        id: `t-demo-${userId}-${idx}`,
        user_id: userId,
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        type: t.type
      }));
      localTxs = [...localTxs, ...seededTxs];
      localStorage.setItem('samridhi_transactions', JSON.stringify(localTxs));
    }
    
    const sectorData = getSectorInitialState(profile.type, userId);

    if (userSkills.length === 0) {
      const seededSkills = sectorData.skills.map(s => ({
        id: s.id,
        user_id: userId,
        name: s.name,
        issuer: s.issuer,
        verified: s.verified
      }));
      localSkills = [...localSkills, ...seededSkills];
      localStorage.setItem('samridhi_skills', JSON.stringify(localSkills));
    }
    
    if (userLoans.length === 0) {
      const seededLoans = sectorData.loans.map(l => ({
        id: l.id,
        user_id: userId,
        lender: l.lender,
        amount: l.amount,
        rate: l.rate,
        emi: l.emi,
        status: l.status,
        date: l.date
      }));
      localLoans = [...localLoans, ...seededLoans];
      localStorage.setItem('samridhi_loans', JSON.stringify(localLoans));
    }
    
    if (userInventory.length === 0) {
      const seededInventory = sectorData.inventory.map(i => ({
        id: i.id,
        user_id: userId,
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        unit: i.unit,
        price: i.price,
        last_updated: i.lastUpdated
      }));
      localInventory = [...localInventory, ...seededInventory];
      localStorage.setItem('samridhi_inventory', JSON.stringify(localInventory));
    }
    
    // Reload state for dispatch
    const freshTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]').filter(t => t.user_id === userId);
    const freshSkills = JSON.parse(localStorage.getItem('samridhi_skills') || '[]').filter(s => s.user_id === userId);
    const freshLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]').filter(l => l.user_id === userId);
    const freshInventory = JSON.parse(localStorage.getItem('samridhi_inventory') || '[]').filter(i => i.user_id === userId);
    
    dispatch({
      type: 'SET_INITIAL_STATE',
      payload: {
        transactions: freshTxs.map(t => ({ id: t.id, date: t.date, merchant: t.merchant, amount: parseFloat(t.amount), category: t.category, type: t.type })),
        skills: freshSkills.map(s => ({ id: s.id, name: s.name, issuer: s.issuer, verified: s.verified })),
        loans: freshLoans.map(l => ({ id: l.id, lender: l.lender, amount: parseFloat(l.amount), rate: l.rate, emi: l.emi, status: l.status, date: l.date })),
        inventory: freshInventory.map(i => ({ id: i.id, name: i.name, category: i.category, quantity: parseInt(i.quantity), unit: i.unit, price: parseFloat(i.price), lastUpdated: i.last_updated }))
      }
    });
  };

  const handleSetAadhaarVerified = async (val) => {
    setAadhaarVerified(val);
    if (user) {
      if (user.isDemo) {
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles = localProfiles.map(p => p.id === user.id ? { ...p, aadhaar_verified: val } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({ aadhaar_verified: val }).eq('id', user.id);
      }
    }
  };

  const handleSetPanVerified = async (val) => {
    setPanVerified(val);
    if (user) {
      if (user.isDemo) {
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles = localProfiles.map(p => p.id === user.id ? { ...p, pan_verified: val } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({ pan_verified: val }).eq('id', user.id);
      }
    }
  };

  const handleSetUpiLinked = async (val) => {
    setUpiLinked(val);
    if (user) {
      if (user.isDemo) {
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles = localProfiles.map(p => p.id === user.id ? { ...p, upi_vpa: val ? user.upiVpa : '' } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({ upi_vpa: val ? user.upiVpa : '' }).eq('id', user.id);
      }
    }
  };

  const handleSetUpiVerified = async (val) => {
    setUpiVerified(val);
    if (user) {
      if (user.isDemo) {
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles = localProfiles.map(p => p.id === user.id ? { ...p, upi_verified: val } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({ upi_verified: val }).eq('id', user.id);
      }
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser && updatedUser.id) {
      if (updatedUser.isDemo) {
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles = localProfiles.map(p => p.id === updatedUser.id ? { 
          ...p, 
          name: updatedUser.name, 
          type: updatedUser.type, 
          upi_vpa: updatedUser.upiVpa,
          github_linked: updatedUser.githubLinked,
          github_username: updatedUser.githubUsername,
          github_repos: updatedUser.githubRepos,
          github_commits: updatedUser.githubCommits,
          aadhaar_verified: updatedUser.aadhaarVerified,
          aadhaar_number: updatedUser.aadhaarNumber,
          aadhaar_name: updatedUser.aadhaarName,
          projects: updatedUser.projects
        } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
        localStorage.setItem('samridhi_demo_session', JSON.stringify(updatedUser));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({
          name: updatedUser.name,
          type: updatedUser.type,
          upi_vpa: updatedUser.upiVpa,
          aadhaar_verified: updatedUser.aadhaarVerified
        }).eq('id', updatedUser.id);
        
        await supabaseClient.auth.updateUser({
          data: {
            githubLinked: updatedUser.githubLinked,
            githubUsername: updatedUser.githubUsername,
            githubRepos: updatedUser.githubRepos,
            githubCommits: updatedUser.githubCommits,
            aadhaarVerified: updatedUser.aadhaarVerified,
            aadhaarNumber: updatedUser.aadhaarNumber,
            aadhaarName: updatedUser.aadhaarName,
            projects: updatedUser.projects
          }
        });
      }
    }
  };

  // If user logs out
  const handleLogout = async () => {
    localStorage.removeItem('samridhi_demo_session');
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
    setPage('landing');
    dispatch({ type: 'RESET_STATE' });
    setWhatIfRepayActive(false);
    setWhatIfLinkGithub(false);
    setWhatIfNewCert(false);
    setWhatIfConsistentUpi(false);
    setUpiVerified(false);
    setUpiLinked(false);
  };

  // Handle sending OTP for password reset/OTP login (only triggered by Forgot Password)
  const handleSendOtp = async (email) => {
    if (email.endsWith('@samridhi.in')) {
      // Demo sandbox OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`[Sandbox OTP] Generated 6-digit OTP for ${email}: ${randomOtp}`);
      return { success: true, isDemo: true, otp: randomOtp };
    }

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.signInWithOtp({
          email: email
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, isDemo: false };
      } catch (err) {
        return { success: false, error: err.message || 'Error sending OTP' };
      }
    } else {
      // Offline fallback
      const randomOtp = "123456";
      return { success: true, isDemo: true, otp: randomOtp };
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (email, token, isDemo, demoOtp) => {
    if (isDemo) {
      if (token === demoOtp || token === '123456') {
        const username = email.split('@')[0].replace('.', ' ').toUpperCase() || 'SAMRIDHI USER';
        let type = 'Freelancer';
        if (email.includes('student')) type = 'Student';
        if (email.includes('freelancer')) type = 'Freelancer';
        if (email.includes('entrepreneur')) type = 'Entrepreneur';
        if (email.includes('salaried')) type = 'Salaried';

        const demoUser = {
          id: `demo-uid-${email.split('@')[0].replace('.', '-')}`,
          name: username,
          email: email,
          type: type,
          upiVpa: `${email.split('@')[0].replace('.', '').toLowerCase()}@okaxis`,
          isDemo: true
        };
        setUser(demoUser);
        localStorage.setItem('samridhi_demo_session', JSON.stringify(demoUser));
        setPage('dashboard');
        setActiveTab('overview');
        loadDemoUserState(demoUser);
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect verification code. Please try again.' };
      }
    }

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
          email: email,
          token: token,
          type: 'email'
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data && data.user) {
          await fetchAndPopulateState(data.user.id, data.user.email);
          setPage('dashboard');
          setActiveTab('overview');
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message || 'Verification failed.' };
      }
    } else {
      // Offline fallback
      if (token === '123456') {
        const username = email.split('@')[0].replace('.', ' ').toUpperCase() || 'SAMRIDHI USER';
        setUser({
          id: 'mock-user-123',
          name: username,
          email: email,
          type: 'Freelancer',
          upiVpa: `${email.split('@')[0].replace('.', '').toLowerCase()}@okaxis`
        });
        setPage('dashboard');
        setActiveTab('overview');
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect verification code.' };
      }
    }
  };

  // Handle sign in submission (Normal Sign In)
  const handleSignIn = async (email, password, selectedType) => {
    if (email.endsWith('@samridhi.in')) {
      // Demo accounts bypass Supabase
      const username = email.split('@')[0].replace('.', ' ').toUpperCase() || 'SAMRIDHI USER';
      let type = selectedType || 'Freelancer';
      if (email.includes('student')) type = 'Student';
      if (email.includes('freelancer')) type = 'Freelancer';
      if (email.includes('entrepreneur')) type = 'Entrepreneur';
      if (email.includes('salaried')) type = 'Salaried';

      const demoUser = {
        id: `demo-uid-${email.split('@')[0].replace('.', '-')}`,
        name: username,
        email: email,
        type: type,
        upiVpa: `${email.split('@')[0].replace('.', '').toLowerCase()}@okaxis`,
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('samridhi_demo_session', JSON.stringify(demoUser));
      setPage('dashboard');
      setActiveTab('overview');
      loadDemoUserState(demoUser);
      return;
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // Bypass confirmation block as requested: Log in client-side immediately!
          const namePrefix = email.split('@')[0] || 'User';
          const username = namePrefix.toUpperCase();
          const localUser = {
            id: `user-fallback-${namePrefix.toLowerCase()}`,
            name: username,
            email: email,
            type: selectedType || 'Freelancer',
            upiVpa: `${namePrefix.toLowerCase()}@okaxis`,
            isDemo: true
          };
          setUser(localUser);
          localStorage.setItem('samridhi_demo_session', JSON.stringify(localUser));
          setPage('dashboard');
          setActiveTab('overview');
          loadDemoUserState(localUser);
        } else if (error.message.toLowerCase().includes("invalid login credentials")) {
          alert("Sign In Failed: Invalid login credentials.");
        } else {
          alert("Sign In Failed: " + error.message);
        }
        return;
      }
    } else {
      const username = email.split('@')[0].replace('.', ' ').toUpperCase() || 'SAMRIDHI USER';
      let type = selectedType || 'Freelancer';
      setUser({
        id: 'mock-user-123',
        name: username,
        email: email,
        type: type,
        upiVpa: `${email.split('@')[0].replace('.', '').toLowerCase()}@okaxis`,
      });
      setUpiLinked(true);
      setUpiVerified(false);
      setPage('dashboard');
      setActiveTab('overview');
    }
  };

  // Handle sign up submission (Normal Sign Up)
  const handleSignUp = async (name, email, type, upiVpa, password) => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            type: type,
            upi_vpa: upiVpa
          }
        }
      });
      if (error) {
        alert("Sign Up Failed: " + error.message);
        return;
      }
      
      // If a session is returned (email confirmation is off in Supabase), log in immediately
      if (data && data.session) {
        setUser({
          id: data.user.id,
          name: name,
          email: email,
          type: type,
          upiVpa: upiVpa
        });
        setPage('dashboard');
        setActiveTab('overview');
      } else {
        // Email confirmation is active on Supabase side, but the user requested:
        // "after creating an account when signed in dont send mail".
        // To satisfy this, we bypass the confirmation check and establish a local demo/sandbox session immediately.
        const localUid = `user-${Date.now()}`;
        const newUser = {
          id: localUid,
          name: name,
          email: email,
          type: type,
          upiVpa: upiVpa,
          isDemo: true
        };
        setUser(newUser);
        localStorage.setItem('samridhi_demo_session', JSON.stringify(newUser));
        setPage('dashboard');
        setActiveTab('overview');
        loadDemoUserState(newUser);
      }
    } else {
      const mockUser = {
        name: name.toUpperCase(),
        email: email,
        type: type,
        upiVpa: upiVpa || '',
      };
      setUser(mockUser);
      setUpiLinked(upiVpa ? true : false);
      setUpiVerified(false);
      setPage('dashboard');
      setActiveTab('overview');
    }
  };

  // Handle banker sign in
  const handleBankerSignIn = async (email, password) => {
    if (email === 'banker@samridhi.in' || email.endsWith('@samridhi.in')) {
      const namePrefix = email.split('@')[0];
      const name = namePrefix.replace('.', ' ').toUpperCase() + " BANKER";
      
      let bankName = 'State Bank of India';
      if (email.includes('hdfc')) bankName = 'HDFC Bank';
      else if (email.includes('icici')) bankName = 'ICICI Bank';
      else if (email.includes('axis')) bankName = 'Axis Bank';
      else if (email.includes('pnb')) bankName = 'Punjab National Bank';

      const demoBanker = {
        id: `demo-banker-${namePrefix.replace('.', '-')}`,
        name: name,
        email: email,
        type: 'Banker',
        bankName: bankName,
        employeeId: 'EMP-SBI-2026',
        ifscCode: 'SBIN0000123',
        designation: 'Senior Credit Underwriter',
        licenseId: 'RBI-SBI-2026',
        isDemo: true
      };
      setUser(demoBanker);
      localStorage.setItem('samridhi_demo_session', JSON.stringify(demoBanker));
      setPage('banker-dashboard');
      return;
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // Bypass confirmation block
          const namePrefix = email.split('@')[0] || 'Banker';
          const name = namePrefix.replace('.', ' ').toUpperCase() + " BANKER";
          const demoBanker = {
            id: `banker-fallback-${namePrefix.toLowerCase()}`,
            name: name,
            email: email,
            type: 'Banker',
            bankName: 'State Bank of India',
            employeeId: 'EMP-SBI-2026',
            ifscCode: 'SBIN0000123',
            designation: 'Senior Credit Underwriter',
            licenseId: 'RBI-SBI-2026',
            isDemo: true
          };
          setUser(demoBanker);
          localStorage.setItem('samridhi_demo_session', JSON.stringify(demoBanker));
          setPage('banker-dashboard');
        } else if (error.message.toLowerCase().includes("invalid login credentials")) {
          alert("Banker Sign In Failed: Invalid login credentials.");
        } else {
          alert("Banker Sign In Failed: " + error.message);
        }
        return;
      }
    } else {
      // Sandbox fallback
      if (email === 'banker@samridhi.in') {
        setUser({
          id: 'mock-banker-123',
          name: 'SBI BANKER',
          email: email,
          type: 'Banker',
          bankName: 'State Bank of India',
          employeeId: 'EMP-SBI-2026',
          ifscCode: 'SBIN0000123',
          designation: 'Senior Credit Underwriter',
          licenseId: 'RBI-SBI-2026'
        });
        setPage('banker-dashboard');
      } else {
        alert("Sandbox banker demo email is banker@samridhi.in / password123");
      }
    }
  };

  // Handle banker sign up
  const handleBankerSignUp = async (name, email, bankName, password, metadata = {}) => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            type: 'Banker',
            bankName: bankName,
            employeeId: metadata.employeeId,
            ifscCode: metadata.ifscCode,
            designation: metadata.designation,
            licenseId: metadata.licenseId
          }
        }
      });
      if (error) {
        alert("Banker Registration Failed: " + error.message);
        return;
      }
      
      if (data && data.session) {
        setUser({
          id: data.user.id,
          name: name,
          email: email,
          type: 'Banker',
          bankName: bankName,
          employeeId: metadata.employeeId,
          ifscCode: metadata.ifscCode,
          designation: metadata.designation,
          licenseId: metadata.licenseId
        });
        setPage('banker-dashboard');
      } else {
        // If email confirmation is enabled, log them in client-side directly
        const localUid = `banker-${Date.now()}`;
        const newBanker = {
          id: localUid,
          name: name,
          email: email,
          type: 'Banker',
          bankName: bankName,
          employeeId: metadata.employeeId,
          ifscCode: metadata.ifscCode,
          designation: metadata.designation,
          licenseId: metadata.licenseId,
          isDemo: true
        };
        setUser(newBanker);
        localStorage.setItem('samridhi_demo_session', JSON.stringify(newBanker));
        
        // Add to local storage profiles list
        let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
        localProfiles.push({
          id: localUid,
          name: name,
          email: email,
          type: 'Banker',
          bankName: bankName,
          employeeId: metadata.employeeId,
          ifscCode: metadata.ifscCode,
          designation: metadata.designation,
          licenseId: metadata.licenseId,
          upi_vpa: ''
        });
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));

        setPage('banker-dashboard');
      }
    } else {
      // Local sandbox registration fallback if Supabase is offline/not initialized
      const localUid = `banker-${Date.now()}`;
      const newBanker = {
        id: localUid,
        name: name,
        email: email,
        type: 'Banker',
        bankName: bankName,
        employeeId: metadata.employeeId,
        ifscCode: metadata.ifscCode,
        designation: metadata.designation,
        licenseId: metadata.licenseId,
        isDemo: true
      };
      setUser(newBanker);
      localStorage.setItem('samridhi_demo_session', JSON.stringify(newBanker));
      
      let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
      localProfiles.push({
        id: localUid,
        name: name,
        email: email,
        type: 'Banker',
        bankName: bankName,
        employeeId: metadata.employeeId,
        ifscCode: metadata.ifscCode,
        designation: metadata.designation,
        licenseId: metadata.licenseId,
        upi_vpa: ''
      });
      localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));

      setPage('banker-dashboard');
    }
  };

  // Smooth scroll triggers for landing page
  const scrollToSection = (id) => {
    if (page !== 'landing') {
      setPage('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-samridhi-primary/30 selection:text-samridhi-textPrimary bg-grid-glow">
      {/* STICKY NAVBAR */}
      {page !== 'dashboard' && page !== 'banker-dashboard' && (
        <header style={{
          position: 'sticky', top: 0, zIndex: 50, width: '100%',
          background: 'rgba(5,5,7,0.88)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => { setPage('landing'); setLandingMobileMenuOpen(false); }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0,229,255,0.3)'
              }}>
                <span style={{ color: '#050507', fontWeight: '900', fontSize: '16px', lineHeight: '1' }}>₹</span>
              </div>
              <span style={{
                fontSize: '20px', fontWeight: '900', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                Samridhi
              </span>
            </div>

            {/* Nav Links — Desktop */}
            <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
              {[
                { label: 'Home', target: 'home' },
                { label: 'Features', target: 'features' },
                { label: 'How It Works', target: 'how-it-works' },
              ].map(link => (
                <button
                  key={link.target}
                  onClick={() => scrollToSection(link.target)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600', letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s', padding: '0'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons — Desktop */}
            <div className="hidden md:flex items-center" style={{ gap: '12px' }}>
              <button
                onClick={() => setPage('signin')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.55)',
                  padding: '8px 16px', transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                Sign In
              </button>
              <button
                onClick={() => setPage('signup')}
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 100%)',
                  color: '#050507', fontWeight: '800', fontSize: '12px',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '9px 22px', borderRadius: '7px', border: 'none',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 0 20px rgba(0,229,255,0.2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(0,229,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.2)'; }}
              >
                Get Started
              </button>
            </div>

            {/* Hamburger — Mobile */}
            <div className="flex md:hidden">
              <button
                onClick={() => setLandingMobileMenuOpen(!landingMobileMenuOpen)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.6)', padding: '8px'
                }}
                aria-label="Toggle menu"
              >
                {landingMobileMenuOpen ? (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {landingMobileMenuOpen && (
            <div className="md:hidden animate-fade-in" style={{
              background: 'rgba(5,5,7,0.98)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Home', action: () => { scrollToSection('home'); setLandingMobileMenuOpen(false); } },
                  { label: 'Features', action: () => { scrollToSection('features'); setLandingMobileMenuOpen(false); } },
                  { label: 'How It Works', action: () => { scrollToSection('how-it-works'); setLandingMobileMenuOpen(false); } },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{
                    textAlign: 'left', padding: '12px 8px', background: 'transparent',
                    border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                    color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s',
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    {item.label}
                  </button>
                ))}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => { setPage('signin'); setLandingMobileMenuOpen(false); }}
                    style={{
                      padding: '12px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px', color: 'rgba(255,255,255,0.7)',
                      fontWeight: '700', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setPage('signup'); setLandingMobileMenuOpen(false); }}
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #00E5FF 0%, #6C63FF 100%)',
                      border: 'none', borderRadius: '8px',
                      color: '#050507', fontWeight: '800', fontSize: '13px',
                      letterSpacing: '0.05em', cursor: 'pointer'
                    }}
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

      )}

      {/* PAGE CONTENT ROUTER */}
      <main className="flex-1 flex flex-col">
        {page === 'landing' && (
          <LandingPageView 
            setPage={setPage} 
            scrollToSection={scrollToSection} 
            calculatedScore={calculatedScore} 
          />
        )}
        {page === 'signin' && (
          <SignInPageView 
            setPage={setPage} 
            onSignIn={handleSignIn} 
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
          />
        )}
        {page === 'signup' && (
          <SignUpPageView 
            setPage={setPage} 
            onSignUp={handleSignUp} 
          />
        )}
        {page === 'banker-login' && (
          <BankerPortalView 
            setPage={setPage} 
            onBankerSignIn={handleBankerSignIn} 
            onBankerSignUp={handleBankerSignUp} 
          />
        )}
        {page === 'banker-dashboard' && user && (
          <BankerDashboardView 
            user={user} 
            handleLogout={handleLogout} 
          />
        )}
        {page === 'dashboard' && user && (
          <DashboardView 
            user={user} 
            setUser={handleUpdateUser}
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            calculatedScore={calculatedScore}
            dashboardState={dashboardState}
            dispatch={dbDispatch}
            handleLogout={handleLogout}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            aadhaarVerified={aadhaarVerified}
            setAadhaarVerified={handleSetAadhaarVerified}
            panVerified={panVerified}
            setPanVerified={handleSetPanVerified}
            upiLinked={upiLinked}
            setUpiLinked={handleSetUpiLinked}
            upiVerified={upiVerified}
            setUpiVerified={handleSetUpiVerified}
            kycCameraVerified={kycCameraVerified}
            setKycCameraVerified={setKycCameraVerified}
            bankStatementUploaded={bankStatementUploaded}
            setBankStatementUploaded={setBankStatementUploaded}
            voiceNavigationActive={voiceNavigationActive}
            setVoiceNavigationActive={setVoiceNavigationActive}
            whatIfRepayActive={whatIfRepayActive}
            setWhatIfRepayActive={setWhatIfRepayActive}
            whatIfLinkGithub={whatIfLinkGithub}
            setWhatIfLinkGithub={setWhatIfLinkGithub}
            whatIfNewCert={whatIfNewCert}
            setWhatIfNewCert={setWhatIfNewCert}
            whatIfConsistentUpi={whatIfConsistentUpi}
            setWhatIfConsistentUpi={setWhatIfConsistentUpi}
          />
        )}
      </main>

      {/* FOOTER */}
      {page !== 'dashboard' && page !== 'banker-dashboard' && (
        <footer className="bg-[#020503] border-t border-samridhi-border py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center">
                  <span className="text-samridhi-bg font-extrabold text-sm">₹</span>
                </div>
                <span className="font-extrabold text-lg text-samridhi-textPrimary">Samridhi</span>
              </div>
              <p className="text-xs text-samridhi-textMuted mt-2 max-w-sm">
                Empowering the 190M+ credit-invisible populations of India through decentralized AI-driven credibility assessments and micro-loans.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 text-xs text-samridhi-textMuted font-medium">
              <a href="#" className="hover:text-samridhi-textPrimary">Privacy Policy</a>
              <a href="#" className="hover:text-samridhi-textPrimary">Terms of Underwriting</a>
              <a href="#" className="hover:text-samridhi-textPrimary">API Integrations</a>
              <a href="#" className="hover:text-samridhi-textPrimary">Institutional Lenders</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-samridhi-border/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-samridhi-textMuted">
            <span>&copy; 2026 Samridhi Inc. All rights reserved.</span>
            <span>Powered by Explainable AI Underwriting Models</span>
          </div>
        </footer>
      )}
    </div>
  );
}

// --- MOUNTING ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
