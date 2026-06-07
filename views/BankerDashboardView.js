// Banker Dashboard View Component for Samridhi
// Exposes BankerDashboardView globally

window.BankerDashboardView = ({ user, handleLogout }) => {
  const { useState, useEffect, useMemo } = React;
  
  const [activeTab, setActiveTab] = useState('loans'); // 'loans' | 'customers'
  const [profiles, setProfiles] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  // Profile modal inspection state
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfileSkills, setSelectedProfileSkills] = useState([]);
  const [selectedProfileTxs, setSelectedProfileTxs] = useState([]);

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
        
        const bankerLoans = defaultLoans.filter(l => l.lender === user.bankName);
        setProfiles(defaultProfiles);
        setLoans(bankerLoans);
      } else {
        const bankerLoans = localLoans.filter(l => l.lender === user.bankName);
        setProfiles(localProfiles);
        setLoans(bankerLoans);
      }
      setLoading(false);
      return;
    }

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

      const allProfiles = Array.from(mergedProfilesMap.values());
      const allLoans = Array.from(mergedLoansMap.values());

      // Filter loans based on banker associated bank (matching exact bankName)
      const bankerLoans = allLoans.filter(l => l.lender === user.bankName);

      setProfiles(allProfiles);
      setLoans(bankerLoans);
    } catch (err) {
      console.error("Error fetching banker records from Supabase: ", err);
      // Fallback merging
      const bankerLoans = localLoans.filter(l => l.lender === user.bankName);
      setProfiles(localProfiles);
      setLoans(bankerLoans);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex-1 flex flex-col bg-samridhi-bg p-6 max-w-7xl w-full mx-auto animate-fade-in">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-samridhi-success text-samridhi-bg text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl shadow-xl animate-bounce flex items-center space-x-2">
          <Icons.CheckCircle className="w-4 h-4 text-samridhi-bg" />
          <span>{toast}</span>
        </div>
      )}

      {/* BANKER NAVBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-samridhi-border pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 bg-samridhi-success/10 border border-samridhi-success/30 rounded text-[9px] font-black uppercase text-samridhi-success tracking-widest">
              Secured Console
            </span>
            <span className="text-[10px] text-samridhi-textMuted font-mono">
              Database Sync: Live (5s)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Bank Underwriting Terminal
          </h1>
          <p className="text-xs text-samridhi-textMuted mt-0.5">
            Institutional Portal &bull; {user.bankName || 'Lead Underwriter'} ({user.email})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-samridhi-surface border border-samridhi-border hover:border-samridhi-danger hover:text-samridhi-danger text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center space-x-2 shrink-0"
        >
          <Icons.Logout className="w-4 h-4" />
          <span>Exit Console</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Stat 1 */}
        <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl flex flex-col justify-between shadow-lg hover-glow-green min-h-[115px]">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Total Customers</span>
            <span className="text-2xl font-black text-white font-mono leading-none">{stats.totalCust}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-textMuted uppercase tracking-wider leading-none px-2 py-1 bg-samridhi-surface border border-samridhi-border rounded-md">
              Synced Registry
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl flex flex-col justify-between shadow-lg hover-glow-green min-h-[115px]">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Pending Review</span>
            <span className="text-2xl font-black text-samridhi-warning font-mono leading-none">{stats.pending}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-warning uppercase tracking-wider leading-none px-2 py-1 bg-samridhi-warning/10 border border-samridhi-warning/20 rounded-md">
              Awaiting Action
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl flex flex-col justify-between shadow-lg hover-glow-green min-h-[115px]">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Approved Credit Pools</span>
            <span className="text-2xl font-black text-samridhi-success font-mono leading-none">{stats.approved}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-success uppercase tracking-wider leading-none px-2 py-1 bg-samridhi-success/10 border border-samridhi-success/20 rounded-md">
              Disbursed
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl flex flex-col justify-between shadow-lg hover-glow-green min-h-[115px]">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-extrabold text-samridhi-textMuted uppercase tracking-wider block">Rejected Credit Pools</span>
            <span className="text-2xl font-black text-samridhi-danger font-mono leading-none">{stats.rejected}</span>
          </div>
          <div className="mt-3.5 flex">
            <span className="text-[9px] font-extrabold text-samridhi-danger uppercase tracking-wider leading-none px-2 py-1 bg-samridhi-danger/10 border border-samridhi-danger/20 rounded-md">
              Unfit Risk
            </span>
          </div>
        </div>

      </div>

      {/* TAB SELECTOR BUTTONS */}
      <div className="flex space-x-2 border-b border-samridhi-border mb-6">
        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold px-4 border-b-2 transition-all ${
            activeTab === 'loans'
              ? 'border-samridhi-success text-samridhi-success'
              : 'border-transparent text-samridhi-textMuted hover:text-samridhi-textPrimary'
          }`}
        >
          Credit Requests ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold px-4 border-b-2 transition-all ${
            activeTab === 'customers'
              ? 'border-samridhi-success text-samridhi-success'
              : 'border-transparent text-samridhi-textMuted hover:text-samridhi-textPrimary'
          }`}
        >
          Customer Directory ({profiles.length})
        </button>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-samridhi-success border-t-transparent animate-spin"></div>
          <p className="text-xs text-samridhi-textMuted">Syncing data from Supabase...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-samridhi-card border border-samridhi-border rounded-2xl overflow-hidden shadow-2xl">
          
          {/* TAB A: LOAN APPLICATIONS LIST */}
          {activeTab === 'loans' && (
            <div className="overflow-x-auto w-full">
              {loans.length === 0 ? (
                <div className="text-center py-16 text-xs text-samridhi-textMuted">
                  No credit requests registered in the Supabase database.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-samridhi-surface border-b border-samridhi-border text-samridhi-textMuted uppercase font-bold text-[10px] tracking-wider select-none">
                      <th className="p-4">Applicant Name</th>
                      <th className="p-4">Pool / Lender</th>
                      <th className="p-4">Requested Amt</th>
                      <th className="p-4">Tenure / EMI</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-samridhi-border/40">
                    {loans.map((loan) => {
                      // Find applicant profile
                      const client = profiles.find(p => p.id === loan.user_id) || {};
                      const scoreVal = client ? getCalculatedScore(client) : 72;

                      return (
                        <tr key={loan.id} className="hover:bg-samridhi-surface/30 transition-colors">
                          <td className="p-4 font-extrabold text-white">
                            <button
                              onClick={() => handleInspectProfile(client)}
                              className="text-samridhi-secondary hover:underline font-extrabold text-left"
                            >
                              {client.name || 'UNKNOWN USER'}
                            </button>
                            <span className="block text-[10px] text-samridhi-textMuted font-mono font-normal">
                              Score: {scoreVal}/100
                            </span>
                          </td>
                          <td className="p-4 text-samridhi-textPrimary font-semibold">{loan.lender}</td>
                          <td className="p-4 font-bold text-white font-mono">₹{loan.amount.toLocaleString()}</td>
                          <td className="p-4 text-samridhi-textMuted font-mono">
                            {loan.emi ? `${loan.emi.toString().startsWith('₹') ? '' : '₹'}${loan.emi.toLocaleString()}/mo` : 'N/A'}
                            <span className="block text-[9px] uppercase font-bold tracking-wider">
                              Tenure: 12 mos
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              loan.status === 'Approved' ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/20' :
                              loan.status === 'Rejected' ? 'bg-samridhi-danger/15 text-samridhi-danger border border-samridhi-danger/20' :
                              'bg-samridhi-warning/15 text-samridhi-warning border border-samridhi-warning/20'
                            }`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="p-4 flex items-center justify-center space-x-2">
                            {loan.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(loan.id, 'Approved')}
                                  className="px-3 py-1.5 bg-samridhi-success hover:bg-samridhi-success/90 text-samridhi-bg font-black rounded-lg transition-all text-[10px] uppercase active:scale-95"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(loan.id, 'Rejected')}
                                  className="px-3 py-1.5 bg-samridhi-surface border border-samridhi-border hover:border-samridhi-danger hover:text-samridhi-danger font-bold rounded-lg transition-all text-[10px] uppercase active:scale-95"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-samridhi-textMuted font-medium select-none">
                                Resolved
                              </span>
                            )}
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
                <div className="text-center py-16 text-xs text-samridhi-textMuted">
                  No customers registered in the Supabase database.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-samridhi-surface border-b border-samridhi-border text-samridhi-textMuted uppercase font-bold text-[10px] tracking-wider select-none">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Earning Sector</th>
                      <th className="p-4">Verifications</th>
                      <th className="p-4">UPI Sync VPA</th>
                      <th className="p-4">Algorithmic Score</th>
                      <th className="p-4 text-center">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-samridhi-border/40">
                    {profiles.map((profile) => {
                      const scoreVal = getCalculatedScore(profile);
                      return (
                        <tr key={profile.id} className="hover:bg-samridhi-surface/30 transition-colors">
                          <td className="p-4">
                            <span className="font-extrabold text-white text-sm block">{profile.name}</span>
                            <span className="text-[10px] text-samridhi-textMuted font-mono">{profile.email}</span>
                          </td>
                          <td className="p-4 text-samridhi-textPrimary font-semibold">{profile.type}</td>
                          <td className="p-4 flex flex-wrap gap-1.5 pt-6">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${profile.aadhaar_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                              Aadhaar
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${profile.pan_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                              PAN
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${profile.upi_verified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/10' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                              UPI Cashflow
                            </span>
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
                              className="px-3.5 py-2 bg-samridhi-surface border border-samridhi-border hover:border-samridhi-secondary hover:text-samridhi-secondary text-samridhi-textPrimary text-[10px] font-extrabold uppercase rounded-lg transition-all active:scale-95"
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
      )}

      {/* PROFILE INSPECTION MODAL OVERLAY */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-samridhi-card border border-samridhi-border p-6 rounded-3xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-samridhi-textMuted hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="px-2 py-0.5 bg-samridhi-secondary/15 border border-samridhi-secondary/30 rounded text-[9px] font-black uppercase text-samridhi-secondary tracking-widest">
                Alternate Underwriting File
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {selectedProfile.name}
              </h2>
              <p className="text-xs text-samridhi-textMuted font-mono">
                Registry ID: {selectedProfile.id} &bull; Email: {selectedProfile.email}
              </p>
            </div>

            {/* Modal Content Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Left Pane: Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-samridhi-textMuted tracking-wider border-b border-samridhi-border pb-1">
                  Alternate Parameters
                </h3>
                <div className="bg-samridhi-surface p-4 rounded-xl border border-samridhi-border space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-samridhi-textMuted">Earning Sector:</span>
                    <span className="font-extrabold text-white">{selectedProfile.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-samridhi-textMuted">UPI Linked VPA:</span>
                    <span className="font-bold text-white font-mono">{selectedProfile.upi_vpa || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-samridhi-textMuted">Calculated Score:</span>
                    <span className="font-black text-samridhi-success font-mono text-sm">
                      {getCalculatedScore(selectedProfile, selectedProfileSkills)} / 100
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase text-samridhi-textMuted tracking-wider border-b border-samridhi-border pb-1">
                  Verified Certificates ({selectedProfileSkills.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedProfileSkills.length === 0 ? (
                    <div className="text-[10px] text-samridhi-textMuted italic">No professional certificates linked.</div>
                  ) : (
                    selectedProfileSkills.map(skill => (
                      <div key={skill.id} className="p-2 bg-samridhi-surface border border-samridhi-border rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-white block">{skill.name}</span>
                          <span className="text-[9px] text-samridhi-textMuted block">Issuer: {skill.issuer}</span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-samridhi-success/15 border border-samridhi-success/20 rounded text-[8px] font-black uppercase text-samridhi-success">
                          Verified
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Pane: Transaction Audit */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-samridhi-textMuted tracking-wider border-b border-samridhi-border pb-1">
                  Telemetry Ledger Sync
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedProfileTxs.length === 0 ? (
                    <div className="text-[10px] text-samridhi-textMuted italic">No synced transaction logs found.</div>
                  ) : (
                    selectedProfileTxs.map(tx => (
                      <div key={tx.id} className="p-2 bg-samridhi-surface border border-samridhi-border rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-white block truncate max-w-[150px]">{tx.merchant}</span>
                          <span className="text-[9px] text-samridhi-textMuted block font-mono">{tx.date} &bull; {tx.category}</span>
                        </div>
                        <span className={`text-[11px] font-black font-mono ${tx.type === 'credit' ? 'text-samridhi-success' : 'text-samridhi-danger'}`}>
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedProfile(null)}
              className="mt-4 w-full py-3 bg-samridhi-surface hover:bg-samridhi-card border border-samridhi-border font-bold rounded-xl text-xs uppercase text-samridhi-textPrimary transition-all active:scale-95"
            >
              Close Underwriting File
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
