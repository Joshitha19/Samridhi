// Banker Dashboard View Component for Samridhi
// Exposes BankerDashboardView globally

window.BankerDashboardView = ({ user, handleLogout }) => {
  const { useState, useEffect, useMemo, useRef } = React;
  
  const [activeTab, setActiveTab] = useState('loans'); // 'loans' | 'customers'
  const [profiles, setProfiles] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  // Profile modal inspection state
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfileSkills, setSelectedProfileSkills] = useState([]);
  const [selectedProfileTxs, setSelectedProfileTxs] = useState([]);
  const [modalTab, setModalTab] = useState('dossier'); // 'dossier' | 'vault'

  // Banker real-time audit logs & refs
  const [auditLogs, setAuditLogs] = useState([
    { id: 'init', time: new Date().toLocaleTimeString(), message: 'Underwriting Terminal Audit System initialized.' }
  ]);
  const prevProfilesRef = useRef([]);
  const prevLoansRef = useRef([]);
  const prevTxsRef = useRef([]);
  const isFirstLoadRef = useRef(true);

  // Web Audio alert chime
  const playAlertChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.04, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);

      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(698.46, ctx.currentTime); // F5
        gain2.gain.setValueAtTime(0.04, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 100);
    } catch (e) {
      console.warn("AudioContext not allowed or supported:", e);
    }
  };

  // Fetch real-time data from Supabase / localStorage
  const fetchData = async () => {
    let localProfiles = [];
    let localLoans = [];
    try {
      localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
      localLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]');
    } catch (e) {
      console.warn("Failed reading local storage db in banker portal:", e);
    }

    let allProfiles = [];
    let bankerLoans = [];

    if (!window.supabaseClient) {
      // Mock fallback data for Sandbox/Dev mode
      if (localProfiles.length === 0 && localLoans.length === 0) {
        const defaultProfiles = [
          { id: 'demo-uid-demo', name: 'DEMO MERCHANT', email: 'demo@samridhi.in', type: 'Entrepreneur', aadhaar_verified: true, pan_verified: true, upi_vpa: 'demo@okaxis', upi_verified: true },
          { id: 'demo-uid-student', name: 'DEMO STUDENT', email: 'demo.student@samridhi.in', type: 'Student', aadhaar_verified: true, pan_verified: false, upi_vpa: 'student@okaxis', upi_verified: false },
          { id: 'demo-uid-freelancer', name: 'DEMO FREELANCER', email: 'demo.freelancer@samridhi.in', type: 'Freelancer', aadhaar_verified: true, pan_verified: true, upi_vpa: 'freelancer@okaxis', upi_verified: true }
        ];
        const defaultLoans = [
          { id: 'l-1', user_id: 'demo-uid-demo', lender: 'State Bank of India', amount: 150000, rate: '11.5%', emi: '₹13,300', status: 'Pending', date: '2026-06-07' }
        ];
        localStorage.setItem('samridhi_profiles', JSON.stringify(defaultProfiles));
        localStorage.setItem('samridhi_loans', JSON.stringify(defaultLoans));
        
        allProfiles = defaultProfiles;
        bankerLoans = defaultLoans.filter(l => l.lender === user.bankName);
      } else {
        allProfiles = localProfiles;
        bankerLoans = localLoans.filter(l => l.lender === user.bankName);
      }
    } else {
      try {
        // Fetch all customer profiles from Supabase (exclude other bankers)
        const { data: dbProfiles, error: pErr } = await window.supabaseClient
          .from('profiles')
          .select('*')
          .neq('type', 'Banker');
        if (pErr) throw pErr;

        // Fetch all loans from Supabase
        const { data: dbLoans, error: lErr } = await window.supabaseClient
          .from('loans')
          .select('*')
          .order('date', { ascending: false });
        if (lErr) throw lErr;

        // Merge and deduplicate profiles
        const mergedProfilesMap = new Map();
        localProfiles.forEach(p => {
          mergedProfilesMap.set(p.id, p);
        });
        if (dbProfiles) {
          dbProfiles.forEach(p => {
            mergedProfilesMap.set(p.id, {
              id: p.id,
              name: p.name,
              email: p.email,
              type: p.type,
              upi_vpa: p.upi_vpa,
              upi_verified: p.upi_verified,
              aadhaar_verified: p.aadhaar_verified,
              pan_verified: p.pan_verified
            });
          });
        }

        // Merge and deduplicate loans
        const mergedLoansMap = new Map();
        localLoans.forEach(l => {
          mergedLoansMap.set(l.id, l);
        });
        if (dbLoans) {
          dbLoans.forEach(l => {
            mergedLoansMap.set(l.id, {
              id: l.id,
              user_id: l.user_id,
              lender: l.lender,
              amount: parseFloat(l.amount),
              rate: l.rate,
              emi: l.emi,
              status: l.status,
              date: l.date
            });
          });
        }

        allProfiles = Array.from(mergedProfilesMap.values());
        const allLoans = Array.from(mergedLoansMap.values());
        bankerLoans = allLoans.filter(l => l.lender === user.bankName);
      } catch (err) {
        console.error("Error fetching banker records from Supabase: ", err);
        allProfiles = localProfiles;
        bankerLoans = localLoans.filter(l => l.lender === user.bankName);
      }
    }

    setProfiles(allProfiles);
    setLoans(bankerLoans);

    // FETCH TRANSACTIONS FOR COMPARISONS
    let localTxs = [];
    try {
      localTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]');
    } catch (e) {
      console.warn("Failed reading local storage txs in banker portal:", e);
    }

    let dbTxs = [];
    if (window.supabaseClient) {
      try {
        const { data } = await window.supabaseClient
          .from('transactions')
          .select('*');
        if (data) dbTxs = data;
      } catch (e) {
        console.warn("Failed fetching Supabase transactions in banker portal:", e);
      }
    }

    const mergedTxsMap = new Map();
    localTxs.forEach(t => mergedTxsMap.set(t.id || (t.date + t.merchant + t.amount), t));
    dbTxs.forEach(t => mergedTxsMap.set(t.id || (t.date + t.merchant + t.amount), {
      id: t.id,
      user_id: t.user_id,
      date: t.date,
      merchant: t.merchant,
      amount: parseFloat(t.amount),
      category: t.category,
      type: t.type
    }));
    const allTxs = Array.from(mergedTxsMap.values());

    // COMPARISONS FOR AUDIT FEED
    if (!isFirstLoadRef.current) {
      // 1. Detect New Loan Requests
      bankerLoans.forEach(l => {
        const alreadyExisted = prevLoansRef.current.some(prevL => prevL.id === l.id);
        if (!alreadyExisted) {
          const clientName = allProfiles.find(p => p.id === l.user_id)?.name || 'New Applicant';
          const msg = `New Loan request of ₹${l.amount.toLocaleString()} received from ${clientName}!`;
          setAuditLogs(prev => [
            { id: Date.now() + '-' + Math.random(), time: new Date().toLocaleTimeString(), message: `📥 ${msg}` },
            ...prev
          ]);
          triggerToast(msg);
          playAlertChime();
        }
      });

      // 2. Detect Profile KYC Verification changes
      allProfiles.forEach(p => {
        const prevP = prevProfilesRef.current.find(prev => prev.id === p.id);
        if (prevP) {
          if (!prevP.aadhaar_verified && p.aadhaar_verified) {
            const msg = `${p.name} verified Aadhaar KYC successfully!`;
            setAuditLogs(prev => [
              { id: Date.now() + '-' + Math.random(), time: new Date().toLocaleTimeString(), message: `🆔 ${msg}` },
              ...prev
            ]);
            triggerToast(msg);
            playAlertChime();
          }
          if (!prevP.pan_verified && p.pan_verified) {
            const msg = `${p.name} verified PAN card successfully!`;
            setAuditLogs(prev => [
              { id: Date.now() + '-' + Math.random(), time: new Date().toLocaleTimeString(), message: `💳 ${msg}` },
              ...prev
            ]);
            triggerToast(msg);
            playAlertChime();
          }
          if (!prevP.upi_verified && p.upi_verified) {
            const msg = `${p.name} linked bank account via Account Aggregator!`;
            setAuditLogs(prev => [
              { id: Date.now() + '-' + Math.random(), time: new Date().toLocaleTimeString(), message: `🏦 ${msg}` },
              ...prev
            ]);
            triggerToast(msg);
            playAlertChime();
          }
        }
      });

      // 3. Detect New Simulated Transactions
      allTxs.forEach(t => {
        const txKey = t.id || (t.date + t.merchant + t.amount);
        const alreadyExisted = prevTxsRef.current.some(prevT => (prevT.id || (prevT.date + prevT.merchant + prevT.amount)) === txKey);
        if (!alreadyExisted) {
          const clientName = allProfiles.find(p => p.id === t.user_id)?.name || 'Someone';
          const direction = t.type?.toLowerCase() === 'credit' ? 'received' : 'spent';
          const msg = `${clientName} ${direction} ₹${Math.abs(t.amount).toLocaleString()} via UPI Sandbox.`;
          setAuditLogs(prev => [
            { id: Date.now() + '-' + Math.random(), time: new Date().toLocaleTimeString(), message: `💸 ${msg}` },
            ...prev
          ]);
          triggerToast(msg);
          playAlertChime();
        }
      });
    }

    // Update refs
    prevProfilesRef.current = allProfiles;
    prevLoansRef.current = bankerLoans;
    prevTxsRef.current = allTxs;
    if (isFirstLoadRef.current && allProfiles.length > 0) {
      isFirstLoadRef.current = false;
    }

    setLoading(false);
  };;

  // Set up polling interval to sync data in real-time every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Update loan status (Approve / Reject) in both localStorage and Supabase
  const handleUpdateStatus = async (loanId, newStatus) => {
    // 1. Optimistic update
    setLoans(prevLoans => prevLoans.map(l => l.id === loanId ? { ...l, status: newStatus } : l));
    triggerToast(`Loan application successfully ${newStatus}!`);

    // 2. Update localStorage
    try {
      const localLoans = JSON.parse(localStorage.getItem('samridhi_loans') || '[]');
      const updatedLoans = localLoans.map(l => l.id === loanId ? { ...l, status: newStatus } : l);
      localStorage.setItem('samridhi_loans', JSON.stringify(updatedLoans));
    } catch (e) {
      console.warn("Failed updating local storage loan status:", e);
    }

    // 3. Update Supabase
    if (window.supabaseClient) {
      try {
        const { error } = await window.supabaseClient
          .from('loans')
          .update({ status: newStatus })
          .eq('id', loanId);
        if (error) {
          console.warn("Supabase sync warning for loan status update: ", error.message);
          if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
            alert("Database RLS Error: Row-Level Security prevents updating loan status on Supabase.\n\nTip: Run the setup SQL script 'supabase_setup.sql' to disable RLS or set proper update policies.");
          }
        }
      } catch (err) {
        console.warn("Error updating loan status on Supabase: ", err);
      }
    }
  };

  // Open modal and fetch alternative telemetry data for the clicked profile (merged from local & DB)
  const handleInspectProfile = async (profile) => {
    setSelectedProfile(profile);
    setSelectedProfileSkills([]);
    setSelectedProfileTxs([]);
    setModalTab('dossier');

    let localSkills = [];
    let localTxs = [];
    try {
      localSkills = JSON.parse(localStorage.getItem('samridhi_skills') || '[]').filter(s => s.user_id === profile.id);
      localTxs = JSON.parse(localStorage.getItem('samridhi_transactions') || '[]').filter(t => t.user_id === profile.id);
    } catch (e) {
      console.warn("Failed to read local storage inspect details:", e);
    }

    if (!window.supabaseClient) {
      setSelectedProfileSkills(localSkills);
      setSelectedProfileTxs(localTxs);
      return;
    }

    try {
      const { data: dbSkills } = await window.supabaseClient
        .from('skills')
        .select('*')
        .eq('user_id', profile.id);
      
      const { data: dbTxs } = await window.supabaseClient
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .limit(10);

      // Merge and deduplicate skills
      const mergedSkillsMap = new Map();
      localSkills.forEach(s => mergedSkillsMap.set(s.id || s.name, s));
      if (dbSkills) {
        dbSkills.forEach(s => mergedSkillsMap.set(s.id || s.name, {
          id: s.id,
          name: s.name,
          issuer: s.issuer,
          verified: s.verified
        }));
      }

      // Merge and deduplicate transactions
      const mergedTxsMap = new Map();
      localTxs.forEach(t => mergedTxsMap.set(t.id || (t.date + t.merchant + t.amount), t));
      if (dbTxs) {
        dbTxs.forEach(t => mergedTxsMap.set(t.id || (t.date + t.merchant + t.amount), {
          id: t.id,
          date: t.date,
          merchant: t.merchant,
          amount: parseFloat(t.amount),
          category: t.category,
          type: t.type
        }));
      }

      setSelectedProfileSkills(Array.from(mergedSkillsMap.values()));
      setSelectedProfileTxs(Array.from(mergedTxsMap.values()));
    } catch (e) {
      console.warn("Failed fetching Supabase telemetry inspect logs: ", e);
      setSelectedProfileSkills(localSkills);
      setSelectedProfileTxs(localTxs);
    }
  };

  // Helper to resolve client name by user_id
  const getClientName = (userId) => {
    const p = profiles.find(profile => profile.id === userId);
    return p ? p.name : 'UNKNOWN APPLICANT';
  };

  // Calculate dynamic credibility score for any profile
  const getCalculatedScore = (profile, profileSkills = [], profileInventory = []) => {
    if (profile.score !== undefined) return profile.score; // If profile already holds score
    
    // Fallback calculation using ml_engine
    if (window.calculateCredibilityScore) {
      const metrics = {
        aadhaarVerified: profile.aadhaar_verified,
        panVerified: profile.pan_verified,
        upiLinked: profile.upi_vpa ? true : false,
        upiVerified: profile.upi_verified,
        skills: profileSkills,
        inventory: profileInventory,
        kycCameraVerified: profile.aadhaar_verified ? true : false, // Proxy if verified
        bankStatementUploaded: profile.upi_verified ? true : false
      };
      return window.calculateCredibilityScore({ type: profile.type }, metrics);
    }
    return 72;
  };

  // Stats derivations
  const stats = useMemo(() => {
    const totalCust = profiles.length;
    const totalLoans = loans.length;
    const pending = loans.filter(l => l.status === 'Pending').length;
    const approved = loans.filter(l => l.status === 'Approved').length;
    const rejected = loans.filter(l => l.status === 'Rejected').length;
    return { totalCust, totalLoans, pending, approved, rejected };
  }, [profiles, loans]);

  return (
    <div className="flex-1 flex flex-col bg-samridhi-bg p-6 max-w-7xl w-full mx-auto animate-fade-in relative min-h-screen">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-samridhi-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-samridhi-secondary/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-samridhi-success text-samridhi-bg text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl shadow-xl animate-bounce flex items-center space-x-2 border border-samridhi-success/30">
          <Icons.CheckCircle className="w-4 h-4 text-samridhi-bg" />
          <span>{toast}</span>
        </div>
      )}

      {/* BANKER NAVBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/[0.04] pb-6 mb-8 gap-4 bg-white/[0.01] border border-white/[0.05] p-6 rounded-2xl backdrop-blur-xl relative z-10">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 bg-samridhi-success/15 border border-samridhi-success/20 rounded text-[9px] font-black uppercase text-samridhi-success tracking-widest">
              Secured Console
            </span>
            <span className="text-[10px] text-samridhi-textMuted font-mono">
              Database Sync: Live (5s)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Bank Underwriting Terminal
          </h1>
          <p className="text-xs text-samridhi-textMuted mt-0.5 font-medium">
            🏦 Institutional Portal &bull; <strong className="text-samridhi-secondary">{user.bankName || 'Lead Underwriter'}</strong> ({user.email})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-samridhi-danger/10 border border-samridhi-danger/25 hover:bg-samridhi-danger hover:text-white text-samridhi-danger text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center space-x-2 shrink-0"
        >
          <Icons.Logout className="w-4 h-4" />
          <span>Exit Console</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        
        {/* Stat 1 */}
        <div className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none"></div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Total Customers</span>
            <span className="text-2xl font-black text-white font-mono leading-none">{stats.totalCust}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider leading-none px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
              Synced Registry
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-samridhi-warning/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Pending Review</span>
            <span className="text-2xl font-black text-samridhi-warning font-mono leading-none">{stats.pending}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-warning uppercase tracking-wider leading-none px-2.5 py-1 bg-samridhi-warning/10 border border-samridhi-warning/20 rounded-lg">
              Awaiting Action
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-samridhi-success/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Approved Credit Pools</span>
            <span className="text-2xl font-black text-samridhi-success font-mono leading-none">{stats.approved}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-success uppercase tracking-wider leading-none px-2.5 py-1 bg-samridhi-success/10 border border-samridhi-success/20 rounded-lg">
              Disbursed
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-samridhi-danger/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Rejected Credit Pools</span>
            <span className="text-2xl font-black text-samridhi-danger font-mono leading-none">{stats.rejected}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-danger uppercase tracking-wider leading-none px-2.5 py-1 bg-samridhi-danger/10 border border-samridhi-danger/20 rounded-lg">
              Unfit Risk
            </span>
          </div>
        </div>

      </div>

      {/* TAB SELECTOR BUTTONS */}
      <div className="flex space-x-2 border-b border-white/[0.04] mb-6 relative z-10">
        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-3.5 text-xs uppercase tracking-wider font-extrabold px-6 border-b-2 transition-all duration-300 ${
            activeTab === 'loans'
              ? 'border-samridhi-primary text-samridhi-primary'
              : 'border-transparent text-samridhi-textMuted hover:text-white'
          }`}
        >
          Credit Requests ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3.5 text-xs uppercase tracking-wider font-extrabold px-6 border-b-2 transition-all duration-300 ${
            activeTab === 'customers'
              ? 'border-samridhi-primary text-samridhi-primary'
              : 'border-transparent text-samridhi-textMuted hover:text-white'
          }`}
        >
          Customer Directory ({profiles.length})
        </button>
      </div>

      {/* MAIN LAYOUT GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-md relative z-10">
          <div className="w-8 h-8 rounded-full border-2 border-samridhi-primary border-t-transparent animate-spin"></div>
          <p className="text-xs text-samridhi-textMuted font-medium">Syncing database registries...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 items-start">
          
          {/* Left/Center columns for main lists */}
          <div className="lg:col-span-3 flex flex-col bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
            
            {/* TAB A: CREDIT REQUESTS */}
            {activeTab === 'loans' && (
              <div className="overflow-x-auto w-full">
                {loans.length === 0 ? (
                  <div className="text-center py-20 text-xs text-samridhi-textMuted">
                    No credit requests registered in the Supabase database.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.05] text-samridhi-textMuted uppercase font-bold text-[10px] tracking-wider select-none">
                        <th className="p-4">Applicant Profile</th>
                        <th className="p-4">Requested Amt</th>
                        <th className="p-4">Tenure / EMI</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {loans.map((loan) => {
                        const client = profiles.find(p => p.id === loan.user_id) || {};
                        const scoreVal = client ? getCalculatedScore(client) : 72;
                        return (
                          <tr key={loan.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-samridhi-primary/15 to-samridhi-secondary/15 border border-white/[0.06] flex items-center justify-center font-bold text-white text-xs">
                                  {client.name ? client.name[0] : 'U'}
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleInspectProfile(client)}
                                    className="text-samridhi-secondary hover:underline font-extrabold text-left block text-xs"
                                  >
                                    {client.name || 'UNKNOWN USER'}
                                  </button>
                                  <span className="text-[10px] text-samridhi-textMuted font-mono">
                                    {client.email} &bull; Score: {scoreVal}/100
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-extrabold text-white font-mono">₹{loan.amount.toLocaleString()}</span>
                              <span className="block text-[8px] text-samridhi-textMuted font-mono uppercase tracking-wider">{loan.lender}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-xs font-bold text-white font-mono">
                                {loan.emi ? `${loan.emi.toString().startsWith('₹') ? '' : '₹'}${loan.emi.toLocaleString()}/mo` : 'N/A'}
                              </span>
                              <span className="block text-[9px] uppercase font-bold tracking-wider text-samridhi-textMuted">
                                Tenure: 12 mos
                              </span>
                            </td>
                            <td className="p-4">
                               <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                 loan.status === 'Approved' ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/20 text-glow-success' :
                                 loan.status === 'Rejected' ? 'bg-samridhi-danger/15 text-samridhi-danger border border-samridhi-danger/20 text-glow-danger' :
                                 loan.status === 'On Hold' ? 'bg-samridhi-warning/15 text-samridhi-warning border border-samridhi-warning/20 text-glow-warning animate-pulse' :
                                 'bg-white/[0.04] text-white/80 border border-white/[0.08]'
                               }`}>
                                 {loan.status}
                               </span>
                             </td>
                             <td className="p-4">
                               <div className="flex items-center justify-center gap-2">
                                 {loan.status === 'Pending' || loan.status === 'On Hold' ? (
                                   <>
                                     <button
                                       onClick={() => handleUpdateStatus(loan.id, 'Approved')}
                                       className="px-3 py-1.5 bg-samridhi-success hover:bg-samridhi-success/90 text-samridhi-bg font-extrabold rounded-lg transition-all text-[10px] uppercase shadow-md active:translate-y-0.5"
                                     >
                                       Approve
                                     </button>
                                     {loan.status !== 'On Hold' && (
                                       <button
                                         onClick={() => handleUpdateStatus(loan.id, 'On Hold')}
                                         className="px-3 py-1.5 bg-samridhi-warning hover:bg-samridhi-warning/90 text-samridhi-bg font-extrabold rounded-lg transition-all text-[10px] uppercase shadow-md active:translate-y-0.5"
                                       >
                                         Hold
                                       </button>
                                     )}
                                     <button
                                       onClick={() => handleUpdateStatus(loan.id, 'Rejected')}
                                       className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-samridhi-danger/40 hover:text-samridhi-danger text-samridhi-textPrimary font-bold rounded-lg transition-all text-[10px] uppercase active:translate-y-0.5"
                                     >
                                       Reject
                                     </button>
                                   </>
                                 ) : (
                                   <span className="text-[10px] text-samridhi-textMuted font-bold uppercase select-none tracking-wider bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.04]">
                                     Resolved
                                   </span>
                                 )}
                               </div>
                             </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB B: REGISTERED CUSTOMERS DIRECTORY */}
            {activeTab === 'customers' && (
              <div className="overflow-x-auto w-full">
                {profiles.length === 0 ? (
                  <div className="text-center py-20 text-xs text-samridhi-textMuted">
                    No customers registered in the database.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.05] text-samridhi-textMuted uppercase font-bold text-[10px] tracking-wider select-none">
                        <th className="p-4">Customer Profile</th>
                        <th className="p-4">Earning Sector</th>
                        <th className="p-4">Verifications</th>
                        <th className="p-4">UPI Sync VPA</th>
                        <th className="p-4">Algorithmic Score</th>
                        <th className="p-4 text-center">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {profiles.map((profile) => {
                        const scoreVal = getCalculatedScore(profile);
                        return (
                          <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-samridhi-primary/10 to-samridhi-secondary/15 border border-white/[0.06] flex items-center justify-center font-bold text-white text-xs">
                                  {profile.name ? profile.name[0] : 'U'}
                                </div>
                                <div>
                                  <span className="font-extrabold text-white text-xs block">{profile.name}</span>
                                  <span className="text-[10px] text-samridhi-textMuted font-mono">{profile.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-samridhi-textPrimary font-semibold">{profile.type}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${profile.aadhaar_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted'}`}>
                                  Aadhaar
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${profile.pan_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted'}`}>
                                  PAN
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${profile.upi_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-white/[0.02] border border-white/[0.06] text-samridhi-textMuted'}`}>
                                  UPI Cashflow
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-samridhi-textMuted font-mono">
                              {profile.upi_vpa || 'Not Linked'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <span className={`font-black font-mono text-base ${
                                  scoreVal >= 71 ? 'text-samridhi-success' :
                                  scoreVal >= 41 ? 'text-samridhi-warning' :
                                  'text-samridhi-danger'
                                }`}>
                                  {scoreVal}
                                </span>
                                <span className="text-[9px] uppercase font-bold text-samridhi-textMuted">
                                  / 100
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleInspectProfile(profile)}
                                className="px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] hover:border-samridhi-secondary hover:text-samridhi-secondary text-samridhi-textPrimary text-[10px] font-extrabold uppercase rounded-xl transition-all active:scale-95 shadow-sm"
                              >
                                Inspect Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>

          {/* Right sidebar column for Live Underwriting Activity Logs */}
          <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl rounded-2xl p-5 flex flex-col h-[600px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4 select-none">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-samridhi-danger animate-pulse"></span>
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-white">Live Activity Logs</h3>
              </div>
              <button 
                onClick={() => setAuditLogs([{ id: 'init', time: new Date().toLocaleTimeString(), message: 'Logs cleared.' }])}
                className="text-[9px] uppercase tracking-wider text-samridhi-textMuted hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col space-y-1 hover:bg-white/[0.04] transition-all">
                  <div className="flex justify-between items-center text-[9px] font-mono text-samridhi-textMuted select-none">
                    <span>Audit Event</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-white leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/[0.04] pt-3 text-[9px] text-samridhi-textMuted font-mono flex items-center justify-between select-none">
              <span>Status: Listening...</span>
              <span>Ref: SEC-AUDIT-v1</span>
            </div>
          </div>

        </div>
      )}

      {/* PROFILE INSPECTION MODAL OVERLAY */}
      {selectedProfile && (() => {
        const associatedLoan = loans.find(l => l.user_id === selectedProfile.id);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-3xl bg-[#090a10] border border-white/[0.08] p-6 rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
              
              {/* Decorative background gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-primary/10 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-samridhi-secondary/5 to-transparent pointer-events-none"></div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-6 right-6 text-samridhi-textMuted hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="mb-4 border-b border-white/[0.04] pb-4">
                <span className="px-2 py-0.5 bg-samridhi-secondary/15 border border-samridhi-secondary/20 rounded text-[9px] font-black uppercase text-samridhi-secondary tracking-widest">
                  Alternate Underwriting Dossier
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {selectedProfile.name}
                </h2>
                <p className="text-xs text-samridhi-textMuted font-mono mt-0.5">
                  Registry ID: {selectedProfile.id} &bull; Email: {selectedProfile.email}
                </p>
              </div>

              {/* Modal Tab Buttons */}
              <div className="flex space-x-2 border-b border-white/[0.04] mb-6 select-none">
                <button
                  onClick={() => setModalTab('dossier')}
                  className={`pb-2.5 text-[10px] uppercase tracking-wider font-extrabold px-4 border-b-2 transition-all duration-300 ${
                    modalTab === 'dossier'
                      ? 'border-samridhi-primary text-samridhi-primary'
                      : 'border-transparent text-samridhi-textMuted hover:text-white'
                  }`}
                >
                  Telemetry Dossier
                </button>
                <button
                  onClick={() => setModalTab('vault')}
                  className={`pb-2.5 text-[10px] uppercase tracking-wider font-extrabold px-4 border-b-2 transition-all duration-300 ${
                    modalTab === 'vault'
                      ? 'border-samridhi-primary text-samridhi-primary'
                      : 'border-transparent text-samridhi-textMuted hover:text-white'
                  }`}
                >
                  Documents Verification Vault
                </button>
              </div>

              {/* Modal Content Split: DOSSIER */}
              {modalTab === 'dossier' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1">
                  
                  {/* Left Column: Credit Score & Profile Stats */}
                  <div className="space-y-6">
                    
                    {/* Score Circular Gauge & Sector info */}
                    <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl flex flex-col items-center justify-center relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white/[0.05] flex items-center justify-center font-black text-2xl text-samridhi-success">
                        {getCalculatedScore(selectedProfile, selectedProfileSkills)}
                      </div>
                      
                      <div className="w-full mt-4 border-t border-white/[0.04] pt-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-samridhi-textMuted">Earning Sector:</span>
                          <span className="font-extrabold text-white">{selectedProfile.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-samridhi-textMuted">Linked VPA ID:</span>
                          <span className="font-bold text-samridhi-secondary font-mono">{selectedProfile.upi_vpa || 'None'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-samridhi-textMuted">Credential Badging:</span>
                          <span className="font-bold text-samridhi-success">
                            {selectedProfile.upi_verified ? 'Verified Active Cashflow' : 'Consent Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Skills */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase text-samridhi-textMuted tracking-wider border-b border-white/[0.04] pb-1.5">
                        Verified Professional Skills ({selectedProfileSkills.length})
                      </h4>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedProfileSkills.length === 0 ? (
                          <div className="text-[10px] text-samridhi-textMuted italic py-2">No skill certifications connected yet.</div>
                        ) : (
                          selectedProfileSkills.map(skill => (
                            <div key={skill.id} className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-center justify-between">
                              <div>
                                <span className="text-[11px] font-bold text-white block">{skill.name}</span>
                                <span className="text-[9px] text-samridhi-textMuted block font-mono">Issuer: {skill.issuer}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-samridhi-success/15 border border-samridhi-success/20 rounded-full text-[8px] font-black uppercase text-samridhi-success tracking-wide">
                                Verified
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Transaction Logs */}
                  <div className="space-y-6">
                    
                    {/* Explainable Underwriting Rationale */}
                    <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl text-[10px] leading-relaxed text-samridhi-textPrimary">
                      <span className="font-black text-samridhi-secondary uppercase block tracking-wider mb-1">Explainable AI Underwriting Note:</span>
                      <p className="text-samridhi-textMuted font-semibold font-sans">
                        {window.UNDERWRITING_RATIONALES ? window.UNDERWRITING_RATIONALES[selectedProfile.type] : 'Alternate scoring evaluates digital footprint activity logs.'}
                      </p>
                    </div>

                    {/* Telemetry Ledger */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase text-samridhi-textMuted tracking-wider border-b border-white/[0.04] pb-1.5">
                        Real-time Transaction Auditing ({selectedProfileTxs.length})
                      </h4>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedProfileTxs.length === 0 ? (
                          <div className="text-[10px] text-samridhi-textMuted italic py-6 text-center border border-dashed border-white/[0.05] rounded-xl bg-white/[0.01]">
                            No verified bank transaction logs found via Account Aggregator pipeline.
                          </div>
                        ) : (
                          selectedProfileTxs.map(tx => (
                            <div key={tx.id} className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between">
                              <div>
                                <span className="text-[11px] font-extrabold text-white block truncate max-w-[170px]">{tx.merchant}</span>
                                <span className="text-[9px] text-samridhi-textMuted block font-mono">{tx.date} &bull; {tx.category}</span>
                              </div>
                              <span className={`text-xs font-black font-mono ${tx.type?.toLowerCase() === 'credit' ? 'text-samridhi-success' : 'text-white'}`}>
                                {tx.type?.toLowerCase() === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Content Split: VAULT */}
              {modalTab === 'vault' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1 animate-fade-in">
                  
                  {/* Aadhaar Card Preview */}
                  <div className="bg-white/[0.01] border border-white/[0.06] p-5 rounded-2xl flex flex-col space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-secondary/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <Icons.CheckCircle className="w-3.5 h-3.5 text-samridhi-success" />
                        <span>Aadhaar Identity Card</span>
                      </span>
                      <span className="text-[8px] bg-samridhi-success/15 border border-samridhi-success/20 text-samridhi-success px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        Stamp verified
                      </span>
                    </div>

                    {/* Realistic card body */}
                    <div className="bg-gradient-to-br from-[#0F2027]/70 via-[#203A43]/70 to-[#2c5364]/70 border border-white/[0.08] p-4 rounded-xl relative flex flex-col justify-between h-[155px] shadow-lg select-none">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-white/80">UNIQUE IDENTIFICATION AUTHORITY OF INDIA</span>
                          <span className="text-[6px] text-white/50 font-mono">GOVT. OF INDIA / भारत सरकार</span>
                        </div>
                        <span className="text-[10px] font-black text-samridhi-secondary">AADHAAR</span>
                      </div>

                      {/* Mid segment */}
                      <div className="flex items-center space-x-3 my-2">
                        {/* Photo silhouette */}
                        <div className="w-12 h-14 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white/30 shrink-0">
                          <Icons.User className="w-6 h-6 text-white/40" />
                        </div>
                        <div className="flex flex-col space-y-0.5 text-[9px]">
                          <span className="text-[7px] text-white/40 uppercase block">Name / नाम</span>
                          <span className="font-extrabold text-white">{selectedProfile.name}</span>
                          
                          <span className="text-[7px] text-white/40 uppercase block mt-1">DOB / जन्म तिथि</span>
                          <span className="font-bold text-white/90 font-mono">14/08/1998</span>
                          
                          <span className="text-[7px] text-white/40 uppercase block mt-1">Gender / लिंग</span>
                          <span className="font-bold text-white/90">Male</span>
                        </div>
                      </div>

                      {/* Aadhaar ID and Barcode */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-2">
                        <span className="font-mono text-xs font-black text-white tracking-widest">
                          XXXX XXXX {selectedProfile.id?.slice(-4) || '8942'}
                        </span>
                        {/* Barcode Mock */}
                        <div className="flex space-x-0.5 items-end h-3">
                          <span className="w-[1px] h-3 bg-white/60"></span>
                          <span className="w-[2px] h-3 bg-white/60"></span>
                          <span className="w-[1px] h-2 bg-white/60"></span>
                          <span className="w-[3px] h-3 bg-white/60"></span>
                          <span className="w-[1px] h-3 bg-white/60"></span>
                          <span className="w-[2px] h-2 bg-white/60"></span>
                          <span className="w-[1px] h-3 bg-white/60"></span>
                          <span className="w-[4px] h-3 bg-white/60"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAN Card Preview */}
                  <div className="bg-white/[0.01] border border-white/[0.06] p-5 rounded-2xl flex flex-col space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-primary/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <Icons.CheckCircle className="w-3.5 h-3.5 text-samridhi-success" />
                        <span>PAN Card</span>
                      </span>
                      <span className="text-[8px] bg-samridhi-success/15 border border-samridhi-success/20 text-samridhi-success px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        Tax Verified
                      </span>
                    </div>

                    {/* Realistic PAN Body */}
                    <div className="bg-gradient-to-br from-[#11998e]/70 to-[#38ef7d]/70 border border-white/[0.08] p-4 rounded-xl relative flex flex-col justify-between h-[155px] shadow-lg select-none">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-white">INCOME TAX DEPARTMENT</span>
                          <span className="text-[6px] text-white/80 font-mono">आयकर विभाग | GOVT. OF INDIA</span>
                        </div>
                        <span className="text-[8px] font-black bg-black/20 text-white/90 px-1 py-0.5 rounded font-mono">PAN</span>
                      </div>

                      {/* Mid Section */}
                      <div className="grid grid-cols-2 gap-2 my-2 text-[9px]">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[7px] text-white/70 block">Permanent Account Number</span>
                          <span className="font-extrabold text-white font-mono tracking-wider">BPXPP{selectedProfile.id?.slice(-4).toUpperCase() || '8912'}C</span>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[7px] text-white/70 block">Name / नाम</span>
                          <span className="font-extrabold text-white uppercase">{selectedProfile.name}</span>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[7px] text-white/70 block">{"Father's Name"}</span>
                          <span className="font-bold text-white/95">RAMESHWAR {selectedProfile.name?.split(' ')[1] || 'KUMAR'}</span>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[7px] text-white/70 block">Date of Birth</span>
                          <span className="font-bold text-white/90 font-mono">14/08/1998</span>
                        </div>
                      </div>

                      {/* Signature block and Stamp */}
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[8px] text-white/80">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 bg-white/10 rounded font-mono font-bold text-[7px] text-white/90 select-none">
                            Signature Block
                          </span>
                        </div>
                        <span className="font-mono text-[7px] font-black uppercase text-glow-success text-white">Income Tax Dept</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Aggregator Bank Statement */}
                  <div className="bg-white/[0.01] border border-white/[0.06] p-5 rounded-2xl flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <Icons.Simulator className="w-3.5 h-3.5 text-samridhi-secondary" />
                        <span>AA Account Extract</span>
                      </span>
                      <span className="text-[8px] bg-samridhi-secondary/15 border border-samridhi-secondary/20 text-samridhi-secondary px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        Sahamati Linked
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-center space-x-3">
                        <Icons.Apply className="w-6 h-6 text-samridhi-secondary" />
                        <div>
                          <span className="font-bold text-white block text-[11px]">sahamati_consent_flow.pdf</span>
                          <span className="text-[9px] text-samridhi-textMuted block font-mono">Size: 184 KB &bull; Linked: HDFC Bank</span>
                        </div>
                      </div>

                      {/* Financial Ratios Table */}
                      <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl space-y-2 text-[10px] font-medium font-sans">
                        <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                          <span className="text-samridhi-textMuted">Average Balance:</span>
                          <span className="text-white font-extrabold font-mono">₹45,320</span>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                          <span className="text-samridhi-textMuted">Inflows (6 Mos):</span>
                          <span className="text-samridhi-success font-extrabold font-mono">+₹2,55,000</span>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                          <span className="text-samridhi-textMuted">Outflows (6 Mos):</span>
                          <span className="text-white/80 font-mono">-₹1,95,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-samridhi-textMuted">Anomaly Check:</span>
                          <span className="text-samridhi-success font-extrabold uppercase">100% Passed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Designation Sector Specific Documents */}
                  <div className="bg-white/[0.01] border border-white/[0.06] p-5 rounded-2xl flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <Icons.Briefcase className="w-3.5 h-3.5 text-samridhi-primary" />
                        <span>Sector Specific Credentials</span>
                      </span>
                      <span className="text-[8px] bg-samridhi-primary/15 border border-samridhi-primary/20 text-samridhi-primary px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        {selectedProfile.type}
                      </span>
                    </div>

                    {/* Render based on user.type */}
                    {selectedProfile.type === 'Student' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-amber-500/30 rounded-xl flex flex-col space-y-2 relative">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-amber-400">AWS Certified Cloud Practitioner</span>
                              <span className="text-[8px] text-samridhi-textMuted font-mono">Issued: AWS Training & Certification</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-amber-500/20 rounded font-mono text-[7px] text-amber-300 font-bold uppercase">Credly</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[9px] font-mono text-samridhi-textMuted">
                            <span>ID: AWS-SEC-92841029</span>
                            <span className="text-samridhi-success font-bold uppercase">Verified Credential</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-samridhi-textMuted italic leading-relaxed">
                          On-chain certification linked via student portfolio sync. Verified course credentials boost student credit score algorithms.
                        </p>
                      </div>
                    )}

                    {selectedProfile.type === 'Freelancer' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-xl flex flex-col space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-emerald-400">Upwork Client Invoice #90284</span>
                              <span className="text-[8px] text-samridhi-textMuted font-mono">Client: Samridhi Sandbox Escrow</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 rounded font-mono text-[7px] text-emerald-300 font-bold uppercase">Paid</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[9px] font-mono text-samridhi-textMuted">
                            <span>Amount: ₹35,000</span>
                            <span className="text-samridhi-success font-bold uppercase">Escrow Confirmed</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-samridhi-textMuted italic leading-relaxed">
                          Gig platform contract receipts and invoice records scanned and verified by Account Aggregator invoice pipelines.
                        </p>
                      </div>
                    )}

                    {selectedProfile.type === 'Entrepreneur' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 border border-indigo-500/30 rounded-xl flex flex-col space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-indigo-400">MSME Udyam Registration</span>
                              <span className="text-[8px] text-samridhi-textMuted font-mono">Reg ID: UDYAM-MH-12-0048291</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-indigo-500/20 rounded font-mono text-[7px] text-indigo-300 font-bold uppercase">Active</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[9px] font-mono text-samridhi-textMuted">
                            <span>Inventory: 142 Linked Units</span>
                            <span className="text-samridhi-success font-bold uppercase">Government Registry</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-samridhi-textMuted italic leading-relaxed">
                          MSME registration verification and live inventory logs parsed. Enhances business credibility criteria.
                        </p>
                      </div>
                    )}

                    {selectedProfile.type !== 'Student' && selectedProfile.type !== 'Freelancer' && selectedProfile.type !== 'Entrepreneur' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/30 rounded-xl flex flex-col space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-violet-400">Corporate Employee Pay Slip</span>
                              <span className="text-[8px] text-samridhi-textMuted font-mono">Employer: Tata Consultancy Services</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-violet-500/20 rounded font-mono text-[7px] text-violet-300 font-bold uppercase">May 2026</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[9px] font-mono text-samridhi-textMuted">
                            <span>Net Earnings: ₹45,000</span>
                            <span className="text-samridhi-success font-bold uppercase">EPF Verified</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-samridhi-textMuted italic leading-relaxed">
                          Monthly salary slip records verified against employee Provident Fund records.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-6 border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row gap-3">
                {associatedLoan && (associatedLoan.status === 'Pending' || associatedLoan.status === 'On Hold') && (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => {
                        handleUpdateStatus(associatedLoan.id, 'Approved');
                        setSelectedProfile(null);
                      }}
                      className="flex-1 py-3 bg-samridhi-success text-samridhi-bg font-extrabold rounded-xl text-[10px] uppercase transition-all hover:bg-samridhi-success/90 active:scale-95 shadow-md"
                    >
                      Approve Request
                    </button>
                    {associatedLoan.status !== 'On Hold' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(associatedLoan.id, 'On Hold');
                          setSelectedProfile(null);
                        }}
                        className="flex-1 py-3 bg-samridhi-warning text-samridhi-bg font-extrabold rounded-xl text-[10px] uppercase transition-all hover:bg-samridhi-warning/90 active:scale-95 shadow-md"
                      >
                        Put On Hold
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleUpdateStatus(associatedLoan.id, 'Rejected');
                        setSelectedProfile(null);
                      }}
                      className="flex-1 py-3 bg-[#1e202e] border border-white/10 hover:border-samridhi-danger hover:text-samridhi-danger text-white font-extrabold rounded-xl text-[10px] uppercase transition-all active:scale-95 shadow-md"
                    >
                      Reject
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="py-3 px-6 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] font-black rounded-xl text-[10px] uppercase text-white transition-all active:scale-95 shadow-sm"
                >
                  Close Inspect
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
