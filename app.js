// app.js
// Root coordinator React app mounting wrapper and state router
// Exposes App component and mounts it to #root

const { useState, useEffect, useReducer, useMemo } = React;

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
    case 'RESET_STATE':
      return REDUCER_INITIAL_STATE;
    default:
      return state;
  }
}

function App() {
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
      whatIfRepayActive,
      whatIfLinkGithub,
      whatIfNewCert,
      whatIfConsistentUpi
    });
  }, [user, aadhaarVerified, panVerified, upiLinked, upiVerified, dashboardState.skills, whatIfRepayActive, whatIfLinkGithub, whatIfNewCert, whatIfConsistentUpi]);

  // If user logs out
  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    dispatch({ type: 'RESET_STATE' });
    // Reset what-if options
    setWhatIfRepayActive(false);
    setWhatIfLinkGithub(false);
    setWhatIfNewCert(false);
    setWhatIfConsistentUpi(false);
    // Reset UPI verifications
    setUpiVerified(false);
    setUpiLinked(false);
  };

  // Handle sign in submission
  const handleSignIn = (email, password) => {
    const username = email.split('@')[0].replace('.', ' ').toUpperCase() || 'SAMRIDHI USER';
    let type = 'Freelancer';
    if (email.toLowerCase().includes('student')) type = 'Student';
    else if (email.toLowerCase().includes('entrepreneur')) type = 'Entrepreneur';
    else if (email.toLowerCase().includes('salaried')) type = 'Salaried';

    const mockUser = {
      name: username,
      email: email,
      type: type,
      upiVpa: `${email.split('@')[0].replace('.', '').toLowerCase()}@okaxis`, // default VPA
    };
    setUser(mockUser);
    setUpiLinked(true);
    setUpiVerified(false);
    setPage('dashboard');
    setActiveTab('overview');
  };

  // Handle sign up submission
  const handleSignUp = (name, email, type, upiVpa) => {
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

  return (
    <div className="min-h-screen flex flex-col selection:bg-samridhi-primary/30 selection:text-samridhi-textPrimary">
      {/* STICKY NAVBAR */}
      {page !== 'dashboard' && (
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
        {page === 'dashboard' && user && (
          <DashboardView 
            user={user} 
            setUser={setUser}
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            calculatedScore={calculatedScore}
            dashboardState={dashboardState}
            dispatch={dispatch}
            handleLogout={handleLogout}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            aadhaarVerified={aadhaarVerified}
            setAadhaarVerified={setAadhaarVerified}
            panVerified={panVerified}
            setPanVerified={setPanVerified}
            upiLinked={upiLinked}
            setUpiLinked={setUpiLinked}
            upiVerified={upiVerified}
            setUpiVerified={setUpiVerified}
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
      {page !== 'dashboard' && (
        <footer className="bg-[#07070B] border-t border-samridhi-border py-12 px-6">
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
