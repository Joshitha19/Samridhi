// app.js
// Root coordinator React app mounting wrapper and state router
// Exposes App component and mounts it to #root

const { useState, useEffect, useReducer, useMemo } = React;

// Supabase Client Config
const SUPABASE_URL = "https://lbagswiwwlkcgrfhkyqr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWdzd2l3d2xrY2dyZmhreXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDI2MzcsImV4cCI6MjA5NjExODYzN30.o1x0Zw1F56-XdtjSRhpjAcBvTGw46OC5_EKPwJm-uF0";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

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
          <span className="text-samridhi-bg font-extrabold text-3xl">S</span>
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
      kycCameraVerified,
      bankStatementUploaded,
      whatIfRepayActive,
      whatIfLinkGithub,
      whatIfNewCert,
      whatIfConsistentUpi
    });
  }, [user, aadhaarVerified, panVerified, upiLinked, upiVerified, dashboardState.skills, dashboardState.inventory, kycCameraVerified, bankStatementUploaded, whatIfRepayActive, whatIfLinkGithub, whatIfNewCert, whatIfConsistentUpi]);

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
  }, [user]);

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
            date: action.payload.date
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
            if (error) console.error("Error syncing transactions: ", error);
          });
        break;

      case 'APPLY_LOAN':
        supabaseClient
          .from('loans')
          .insert({
            user_id: userId,
            lender: action.payload.lender,
            amount: action.payload.amount,
            rate: action.payload.rate,
            emi: action.payload.emi,
            status: action.payload.status,
            date: action.payload.date
          })
          .then(({ error }) => {
            if (error) console.error("Error syncing loans: ", error);
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
              if (error) console.error("Error syncing skills: ", error);
            });
        }
        break;
      }

      case 'ADD_SKILL':
        supabaseClient
          .from('skills')
          .insert({
            user_id: userId,
            name: action.payload.name,
            issuer: action.payload.issuer,
            verified: action.payload.verified
          })
          .then(({ error }) => {
            if (error) console.error("Error syncing skills: ", error);
          });
        break;

      case 'ADD_INVENTORY_ITEM':
        supabaseClient
          .from('inventory')
          .insert({
            user_id: userId,
            name: action.payload.name,
            category: action.payload.category,
            quantity: action.payload.quantity,
            unit: action.payload.unit,
            price: action.payload.price,
            last_updated: action.payload.lastUpdated
          })
          .then(({ error }) => {
            if (error) console.error("Error syncing inventory: ", error);
          });
        break;

      case 'REMOVE_INVENTORY_ITEM':
        supabaseClient
          .from('inventory')
          .delete()
          .eq('id', action.payload)
          .then(({ error }) => {
            if (error) console.error("Error syncing inventory deletion: ", error);
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
        if (createErr) throw createErr;
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
            upiVpa: ''
          });
          setPage('banker-dashboard');
          return;
        }

        setUser({
          id: userId,
          name: activeProfile.name,
          email: activeProfile.email,
          type: activeProfile.type,
          upiVpa: activeProfile.upi_vpa || ''
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
        
        const insertTxs = REDUCER_INITIAL_STATE.transactions.map(t => ({
          user_id: userId,
          date: t.date,
          merchant: t.merchant,
          amount: t.amount,
          category: t.category,
          type: t.type
        }));
        await supabaseClient.from('transactions').insert(insertTxs);

        const insertSkills = REDUCER_INITIAL_STATE.skills.map(s => ({
          user_id: userId,
          name: s.name,
          issuer: s.issuer,
          verified: s.verified
        }));
        await supabaseClient.from('skills').insert(insertSkills);

        const insertLoans = REDUCER_INITIAL_STATE.loans.map(l => ({
          user_id: userId,
          lender: l.lender,
          amount: l.amount,
          rate: l.rate,
          emi: l.emi,
          status: l.status,
          date: l.date
        }));
        await supabaseClient.from('loans').insert(insertLoans);

        const insertInventory = REDUCER_INITIAL_STATE.inventory.map(i => ({
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
      const seededTxs = REDUCER_INITIAL_STATE.transactions.map((t, idx) => ({
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
    
    if (userSkills.length === 0) {
      const seededSkills = REDUCER_INITIAL_STATE.skills.map((s, idx) => ({
        id: `s-demo-${userId}-${idx}`,
        user_id: userId,
        name: s.name,
        issuer: s.issuer,
        verified: s.verified
      }));
      localSkills = [...localSkills, ...seededSkills];
      localStorage.setItem('samridhi_skills', JSON.stringify(localSkills));
    }
    
    if (userLoans.length === 0) {
      const seededLoans = REDUCER_INITIAL_STATE.loans.map((l, idx) => ({
        id: `l-demo-${userId}-${idx}`,
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
      const seededInventory = REDUCER_INITIAL_STATE.inventory.map((i, idx) => ({
        id: `inv-demo-${userId}-${idx}`,
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
        localProfiles = localProfiles.map(p => p.id === updatedUser.id ? { ...p, name: updatedUser.name, type: updatedUser.type, upi_vpa: updatedUser.upiVpa } : p);
        localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
        localStorage.setItem('samridhi_demo_session', JSON.stringify(updatedUser));
      } else if (supabaseClient) {
        await supabaseClient.from('profiles').update({
          name: updatedUser.name,
          type: updatedUser.type,
          upi_vpa: updatedUser.upiVpa
        }).eq('id', updatedUser.id);
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

  // Handle sign in submission
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
          alert("Sign In Failed: Email not confirmed.\n\nTip: Please confirm your email address via the link sent to your inbox, or disable 'Confirm email' under Auth -> Providers -> Email in your Supabase Dashboard settings.");
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

  // Handle sign up submission
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
      alert("Sign Up Successful! Please check your email inbox (and spam folder) for the verification link to confirm your account, or disable email confirmations in your Supabase Auth dashboard.");
      setPage('signin');
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
          alert("Banker Sign In Failed: Email not confirmed.\n\nTip: Please confirm your email address via the link sent to your inbox, or disable 'Confirm email' under Auth -> Providers -> Email in your Supabase Dashboard settings.");
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
          bankName: 'State Bank of India'
        });
        setPage('banker-dashboard');
      } else {
        alert("Sandbox banker demo email is banker@samridhi.in / password123");
      }
    }
  };

  // Handle banker sign up
  const handleBankerSignUp = async (name, email, bankName, password) => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            type: 'Banker',
            bankName: bankName
          }
        }
      });
      if (error) {
        alert("Banker Registration Failed: " + error.message);
        return;
      }
      alert("Banker Registration Successful! Please check your email inbox (and spam folder) for the verification link to confirm your account, or disable email confirmations in your Supabase Auth dashboard.");
      setPage('banker-login');
    } else {
      alert("Supabase is required to register new Bankers. Try One-Click Banker Demo Login.");
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
        <header className="sticky top-0 z-50 w-full bg-samridhi-bg/85 border-b border-samridhi-border blur-nav">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setPage('landing')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20">
                <span className="text-samridhi-bg font-extrabold text-lg">S</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-samridhi-primary to-samridhi-secondary bg-clip-text text-transparent tracking-wide">
                Samridhi
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-samridhi-textPrimary hover:text-samridhi-secondary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-samridhi-textMuted hover:text-samridhi-textPrimary transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-samridhi-textMuted hover:text-samridhi-textPrimary transition-colors"
              >
                How It Works
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setPage('signin')}
                className="text-sm font-bold text-samridhi-textPrimary hover:text-samridhi-primary transition-colors px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => setPage('signup')}
                className="text-sm font-bold bg-samridhi-primary hover:bg-samridhi-primary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-samridhi-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
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
                  <span className="text-samridhi-bg font-extrabold text-sm">S</span>
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
