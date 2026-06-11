// Dashboard Overview Tab Component for Samridhi
// Exposes DashboardOverviewTab globally

window.DashboardOverviewTab = ({
  user,
  setUser,
  calculatedScore,
  dashboardState,
  dispatch,
  setActiveTab,
  upiLinked,
  upiVerified,
  setUpiVerified
}) => {
  const { useState, useEffect } = React;

  // Account Aggregator States
  const [isAaModalOpen, setIsAaModalOpen] = useState(false);
  const [aaStep, setAaStep] = useState('select-bank'); // 'select-bank' | 'enter-phone-vpa' | 'consent-request' | 'verify-otp' | 'syncing' | 'success'
  const [selectedBank, setSelectedBank] = useState('Union Bank of India');
  const [vpaInput, setVpaInput] = useState(user.upiVpa || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStageText, setSyncStageText] = useState('Initializing handshake...');

  // QR verification states
  const [verificationMethod, setVerificationMethod] = useState('form'); // 'form' | 'qr'
  const [qrScanStatus, setQrScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'success'
  const [scannedUpiDetails, setScannedUpiDetails] = useState(null);

  // UPI Sandbox Simulator States
  const [simType, setSimType] = useState('Credit');
  const [simMerchant, setSimMerchant] = useState('Client Escrow / Upwork');
  const [simVpa, setSimVpa] = useState('upwork@hdfc');
  const [simCategory, setSimCategory] = useState('Freelance Income');
  const [simAmount, setSimAmount] = useState('12000');

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  // Web Audio success chime
  const playUpiBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.1);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.12);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.5, ctx.currentTime);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.28);
      }, 100);
    } catch (e) {
      console.warn("AudioContext not allowed or supported:", e);
    }
  };

  const handleExecuteSimulatorTransfer = () => {
    const amt = parseFloat(simAmount);
    if (!simMerchant.trim()) {
      alert("Please enter a merchant or sender name.");
      return;
    }
    if (!simVpa.trim() || !simVpa.includes('@')) {
      alert("Please enter a valid VPA ID (e.g. name@upi).");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid transfer amount greater than 0.");
      return;
    }

    const refId = "REF" + Math.floor(1000000000 + Math.random() * 9000000000);
    const dateStr = new Date().toISOString().split('T')[0];
    
    const newTx = {
      id: `t-sim-${Date.now()}`,
      date: dateStr,
      merchant: simMerchant,
      amount: simType === 'Credit' ? amt : -amt,
      category: simCategory,
      type: simType
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTx });

    setSuccessDetails({
      merchant: simMerchant,
      vpa: simVpa,
      amount: amt,
      type: simType,
      category: simCategory,
      refId,
      timestamp: new Date().toLocaleString()
    });

    playUpiBeep();
    setIsSuccessModalOpen(true);
  };

  useEffect(() => {
    if (user && user.upiVpa) {
      setVpaInput(user.upiVpa);
    }
  }, [user.upiVpa]);

  // Derived metrics from transactions
  const cashflowStats = React.useMemo(() => {
    const txs = dashboardState.transactions;
    const totalCredit = txs.filter(t => t.type === 'Credit' || t.amount > 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDebit = txs.filter(t => t.type === 'Debit' || t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const savingsRate = totalCredit > 0 ? Math.max(0, Math.min(100, ((totalCredit - totalDebit) / totalCredit) * 100)) : 0;
    
    return {
      inflow: totalCredit,
      outflow: totalDebit,
      savingsRate: savingsRate.toFixed(1),
      stabilityIndex: upiVerified ? 94 : 45
    };
  }, [dashboardState.transactions, upiVerified]);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Row 1: Grid Score & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Card (Col-4) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col items-center justify-center border border-white/[0.04] border-glow-secondary relative overflow-hidden bg-gradient-to-b from-[#0A121E] to-[#07070C]">
          <div className="absolute top-4 left-4">
            <span className="text-[9px] uppercase font-black text-samridhi-textMuted tracking-wider font-mono">Telemetry // Risk Gauge</span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-secondary/5 to-transparent rounded-tr-3xl pointer-events-none filter blur-2xl"></div>
          <CircularGauge score={calculatedScore} />
        </div>

        {/* Dashboard Welcome & Stats (Col-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* Greetings Header */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-center h-full relative overflow-hidden border border-white/[0.04] border-glow-primary bg-gradient-to-r from-[#170822] via-[#0D0E15] to-[#0A0B10]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-samridhi-primary/10 to-transparent rounded-tr-2xl pointer-events-none filter blur-3xl"></div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">Welcome back, {user.name}!</h2>
            <p className="text-xs text-samridhi-textMuted mt-1.5 max-w-xl leading-relaxed font-semibold">
              Your non-traditional AI credit file is calculated based on alternative cashflow parameters. Your profile is rated as <strong className="text-samridhi-secondary text-glow-secondary">{calculatedScore >= 71 ? 'LOW RISK' : 'STABLE'}</strong>. Let's maintain healthy digital transactions to qualify for lower rates.
            </p>
            
            <div className="mt-5 flex flex-wrap gap-3 relative z-10">
              <button
                onClick={() => setActiveTab('apply')}
                className="bg-gradient-to-r from-samridhi-primary to-samridhi-primary/80 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-samridhi-primary/25 transition-all duration-300 transform active:scale-95"
              >
                Apply for Loan
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-samridhi-secondary/40 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all transform active:scale-95"
              >
                View Recommendations
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Stat 1 */}
            <div className="glass-card p-4.5 rounded-2xl flex items-center justify-between border border-white/[0.04] hover:border-samridhi-success/20">
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-wider">Monthly Income</span>
                <span className="text-lg font-black text-white font-mono tracking-tight">₹45,000</span>
                <span className="text-[9px] font-bold text-samridhi-success flex items-center gap-0.5 font-semibold">
                  <span>▲</span> <span>+12.4% trend</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-samridhi-success/10 border border-samridhi-success/20 flex items-center justify-center text-samridhi-success shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-card p-4.5 rounded-2xl flex items-center justify-between border border-white/[0.04] hover:border-samridhi-secondary/20">
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-wider">UPI Transactions</span>
                <span className="text-lg font-black text-white font-mono tracking-tight">{dashboardState.transactions.length} records</span>
                <span className="text-[9px] font-bold text-samridhi-secondary flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-samridhi-secondary animate-ping"></span>
                  <span>Active Sync</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-samridhi-secondary/10 border border-samridhi-secondary/20 flex items-center justify-center text-samridhi-secondary shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-card p-4.5 rounded-2xl flex items-center justify-between border border-white/[0.04] hover:border-samridhi-primary/20">
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-wider">Skills Certified</span>
                <span className="text-lg font-black text-white font-mono tracking-tight">{dashboardState.skills.filter(s => s.verified).length} items</span>
                <span className="text-[9px] font-bold text-samridhi-primary uppercase tracking-wider font-mono">Verified On-Chain</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-samridhi-primary/10 border border-samridhi-primary/20 flex items-center justify-center text-samridhi-primary shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI TRANSACTION SIMULATOR AND RECENT TRANSACTIONS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions list (Col-8) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-6 border border-white/[0.04] border-glow-primary">
          
          {/* UPI Sandbox simulator widget */}
          <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-glow-secondary text-samridhi-secondary font-black animate-pulse">●</span>
                <span className="font-extrabold text-[11px] text-white uppercase tracking-wider">UPI Transaction Sandbox Simulator</span>
              </div>
              <span className="text-[8px] font-black bg-samridhi-primary/10 border border-samridhi-primary/20 text-samridhi-primary px-2 py-0.5 rounded uppercase tracking-widest font-mono">Real-time Injector</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              {/* Type */}
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-black text-samridhi-textMuted tracking-wider">Tx Type</label>
                <select 
                  value={simType} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setSimType(val);
                    if (val === 'Credit') {
                      setSimMerchant('Client Escrow / Upwork');
                      setSimVpa('upwork@hdfc');
                      setSimCategory('Freelance Income');
                    } else {
                      setSimMerchant('Swiggy Delivery');
                      setSimVpa('swiggy@paytm');
                      setSimCategory('Food & Beverage');
                    }
                  }}
                  className="w-full bg-[#0A0E17] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-samridhi-secondary font-sans font-bold"
                >
                  <option value="Credit">Credit (Receive)</option>
                  <option value="Debit">Debit (Pay)</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-black text-samridhi-textMuted tracking-wider">Sender / Recipient</label>
                <input 
                  type="text" 
                  value={simMerchant} 
                  onChange={(e) => setSimMerchant(e.target.value)} 
                  placeholder="e.g. Upwork"
                  className="w-full bg-[#0A0E17] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-samridhi-secondary font-sans font-bold"
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-black text-samridhi-textMuted tracking-wider">VPA Address</label>
                <input 
                  type="text" 
                  value={simVpa} 
                  onChange={(e) => setSimVpa(e.target.value)} 
                  placeholder="name@upi"
                  className="w-full bg-[#0A0E17] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-samridhi-secondary font-mono font-bold"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-black text-samridhi-textMuted tracking-wider">Category</label>
                <select 
                  value={simCategory} 
                  onChange={(e) => setSimCategory(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-samridhi-secondary font-sans font-bold"
                >
                  <option value="Freelance Income">Freelance Income</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Utility Bills">Utility Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Business Expense">Business Expense</option>
                  <option value="Travel Outflow">Travel Outflow</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-black text-samridhi-textMuted tracking-wider">Amount (₹)</label>
                <input 
                  type="number" 
                  value={simAmount} 
                  onChange={(e) => setSimAmount(e.target.value)} 
                  placeholder="e.g. 12000"
                  className="w-full bg-[#0A0E17] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-samridhi-secondary font-mono font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteSimulatorTransfer}
              className="w-full py-2.5 bg-gradient-to-r from-samridhi-secondary to-samridhi-primary hover:brightness-110 text-samridhi-bg font-extrabold rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Execute Sandbox Transfer</span>
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-primary">Recent UPI Transaction Stream</h3>
            <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-widest font-mono">UPI.Sync.Active</span>
          </div>

          <div className="overflow-x-auto font-mono">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Merchant</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-samridhi-textMuted font-medium">
                {dashboardState.transactions.map((tx, idx) => {
                  let badgeStyle = "bg-white/[0.04] text-white/70 border-white/[0.08]";
                  if (tx.category === "Freelance Income" || tx.category === "Income") {
                    badgeStyle = "bg-samridhi-success/10 text-samridhi-success border-samridhi-success/20";
                  } else if (tx.category === "Business Expense" || tx.category === "Business") {
                    badgeStyle = "bg-samridhi-primary/10 text-samridhi-primary border-samridhi-primary/20";
                  } else if (tx.category === "Utility Bills" || tx.category === "Utilities") {
                    badgeStyle = "bg-samridhi-secondary/10 text-samridhi-secondary border-samridhi-secondary/20";
                  } else if (tx.category === "Food & Beverage" || tx.category === "Travel Outflow") {
                    badgeStyle = "bg-samridhi-warning/10 text-samridhi-warning border-samridhi-warning/20";
                  }
                  
                  return (
                    <tr key={tx.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-2 text-[11px]">{tx.date}</td>
                      <td className="py-3.5 px-2 text-white font-bold font-sans">{tx.merchant}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${badgeStyle} font-sans`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`py-3.5 px-2 text-right font-black text-[12px] ${tx.amount > 0 ? 'text-samridhi-success text-glow-success' : 'text-white'}`}>
                        {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secure Bank Link (Account Aggregator) Panel (Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account Aggregator Consent panel */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/[0.04] border-glow-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-secondary/10 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3.5 mb-4">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Account Aggregator</h4>
                <span className={`text-[8px] font-black px-2.5 py-1 rounded-full ${upiVerified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/20 text-glow-success' : 'bg-samridhi-warning/15 text-samridhi-warning border border-samridhi-warning/20 animate-pulse'}`}>
                  {upiVerified ? 'LINKED & VERIFIED' : 'NOT LINKED'}
                </span>
              </div>
              
              <p className="text-[11px] text-samridhi-textMuted leading-relaxed mb-4 font-semibold">
                {upiVerified ? (
                  <>
                    Linked bank UPI VPA: <strong className="text-white font-mono">{vpaInput || user.upiVpa || 'Union Bank verified'}</strong>.<br/>
                    Verified transaction telemetry fetched securely via RBI-compliant Sahamati gateway API.
                  </>
                ) : (
                  <>
                    Link your Union Bank of India (or other bank) transaction ledger securely via Sahamati Consent gateway to parse cashflow velocity and raise credit limits.
                  </>
                )}
              </p>

              {upiVerified ? (
                <div className="space-y-3">
                  <div className="bg-white/[0.02] p-4 border border-white/[0.06] rounded-xl space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-samridhi-textMuted font-semibold">Institution:</span>
                      <span className="font-bold text-white flex items-center gap-1">🏦 Union Bank of India</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-samridhi-textMuted font-semibold">Data Sync Pipeline:</span>
                      <span className="font-bold text-samridhi-success flex items-center gap-1.5 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-samridhi-success animate-ping"></span>
                        ACTIVE NODE
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-samridhi-textMuted font-semibold">Consent Period:</span>
                      <span className="font-bold text-samridhi-secondary">One-Time (180d)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setAaStep('select-bank');
                        setIsAaModalOpen(true);
                      }}
                      className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white font-bold py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider transition-all transform active:scale-95"
                    >
                      Update Consent
                    </button>
                    <button
                      disabled
                      className="flex-1 bg-samridhi-success/5 border border-samridhi-success/20 text-samridhi-success font-black py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider cursor-not-allowed"
                    >
                      Verified Node ✔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01] space-y-2.5">
                    <span className="text-3xl animate-bounce">🏦</span>
                    <p className="text-[10px] text-samridhi-textMuted text-center leading-relaxed font-semibold">Secure data pipe fetches digital solvency parameters directly from Union Bank.</p>
                  </div>
                  <button
                    onClick={() => {
                      setAaStep('select-bank');
                      setIsAaModalOpen(true);
                    }}
                    className="w-full bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-samridhi-primary/20 flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <span>Link Bank via AA Consent</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cashflow Analysis & Insights Card */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/[0.04] border-glow-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-primary/10 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>
            <div>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider border-b border-white/[0.04] pb-3.5 mb-4">Alternative Cashflow Analyzer</h4>
              
              {!upiVerified ? (
                <div className="text-center py-6 space-y-2">
                  <span className="text-2xl opacity-60">📊</span>
                  <p className="text-[10px] text-samridhi-textMuted leading-relaxed font-semibold">
                    Connect bank account via Account Aggregator to render live cashflow index, savings velocity, and stability metrics.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                      <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">Total Inflows</span>
                      <span className="text-sm font-black text-samridhi-success font-mono mt-1 block">₹{cashflowStats.inflow.toLocaleString()}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                      <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold tracking-wider">Total Outflows</span>
                      <span className="text-sm font-black text-white font-mono mt-1 block">₹{cashflowStats.outflow.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-samridhi-textMuted font-bold uppercase tracking-wider">Ledger Savings Ratio</span>
                        <span className="font-bold text-samridhi-secondary font-mono">{cashflowStats.savingsRate}%</span>
                      </div>
                      <div className="w-full bg-white/[0.02] h-2 rounded-full overflow-hidden border border-white/[0.06]">
                        <div 
                          className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.max(0, cashflowStats.savingsRate))}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-samridhi-textMuted font-bold uppercase tracking-wider">Cashflow Stability Rating</span>
                        <span className="font-bold text-samridhi-success font-mono">{cashflowStats.stabilityIndex}/100</span>
                      </div>
                      <div className="w-full bg-white/[0.02] h-2 rounded-full overflow-hidden border border-white/[0.06]">
                        <div 
                          className="bg-samridhi-success h-full rounded-full transition-all duration-1000"
                          style={{ width: `${cashflowStats.stabilityIndex}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-samridhi-textMuted bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl leading-relaxed font-semibold">
                    💡 <strong className="text-white">Underwriting Insight:</strong> Your digital cash ledger has high savings density, adding <strong className="text-samridhi-secondary font-black">+15 credibility points</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Journey Timeline */}
      <div className="glass-card p-6 rounded-3xl space-y-6 shadow-lg border border-white/[0.04] border-glow-secondary animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-secondary">Credit Journey Timeline</h3>
          <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-widest font-mono">Historical.Milestones</span>
        </div>

        <div className="relative py-4 overflow-x-auto scrollbar-none">
          {/* Horizontal connecting track for desktop */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[2.5px] bg-white/[0.04] z-0">
            <div 
              className="h-full bg-gradient-to-r from-samridhi-secondary via-samridhi-primary to-samridhi-success transition-all duration-1000"
              style={{ width: '100%' }}
            ></div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10 min-w-max md:min-w-0">
            
            {/* Milestone 1 */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 min-w-[200px] md:min-w-0">
              <span className="text-[10px] font-black text-samridhi-secondary uppercase tracking-wider bg-samridhi-secondary/10 px-3 py-1 rounded-full border border-samridhi-secondary/20 font-mono">Jan 2026</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0e15] border-[3px] border-samridhi-secondary flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)] z-10 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-samridhi-secondary"></span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] hover:border-samridhi-secondary/35 hover:bg-white/[0.04] transition-all duration-300 p-4.5 rounded-2xl w-full flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="font-black text-[11px] text-white uppercase tracking-wide">Account Created</h4>
                  <p className="text-[10px] text-samridhi-textMuted mt-1 leading-normal font-semibold">Platform onboarding complete. Initial baseline rating established.</p>
                </div>
                <div className="text-[10px] font-black text-samridhi-secondary font-mono mt-2 bg-samridhi-secondary/5 py-1 rounded border border-samridhi-secondary/10">Base Score: 45</div>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 min-w-[200px] md:min-w-0">
              <span className="text-[10px] font-black text-samridhi-primary uppercase tracking-wider bg-samridhi-primary/10 px-3 py-1 rounded-full border border-samridhi-primary/20 font-mono">Feb 2026</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0e15] border-[3px] border-samridhi-primary flex items-center justify-center shadow-[0_0_12px_rgba(213,0,249,0.4)] z-10 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-samridhi-primary"></span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] hover:border-samridhi-primary/35 hover:bg-white/[0.04] transition-all duration-300 p-4.5 rounded-2xl w-full flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="font-black text-[11px] text-white uppercase tracking-wide">UPI Connected</h4>
                  <p className="text-[10px] text-samridhi-textMuted mt-1 leading-normal font-semibold">Transactional stream linked. Verified active telemetry behavior.</p>
                </div>
                <div className="text-[10px] font-black text-samridhi-primary font-mono mt-2 bg-samridhi-primary/5 py-1 rounded border border-samridhi-primary/10">Score: +8 &rarr; 53</div>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 min-w-[200px] md:min-w-0">
              <span className="text-[10px] font-black text-samridhi-warning uppercase tracking-wider bg-samridhi-warning/10 px-3 py-1 rounded-full border border-samridhi-warning/20 font-mono">Mar 2026</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0e15] border-[3px] border-samridhi-warning flex items-center justify-center shadow-[0_0_12px_rgba(255,214,0,0.4)] z-10 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-samridhi-warning"></span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] hover:border-samridhi-warning/35 hover:bg-white/[0.04] transition-all duration-300 p-4.5 rounded-2xl w-full flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="font-black text-[11px] text-white uppercase tracking-wide">Skills Verified</h4>
                  <p className="text-[10px] text-samridhi-textMuted mt-1 leading-normal font-semibold">Professional credentials validated via Wharton & Coursera API.</p>
                </div>
                <div className="text-[10px] font-black text-samridhi-warning font-mono mt-2 bg-samridhi-warning/5 py-1 rounded border border-samridhi-warning/10">Score: +7 &rarr; 60</div>
              </div>
            </div>

            {/* Milestone 4 */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 min-w-[200px] md:min-w-0">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-wider bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/20 font-mono">Apr 2026</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0e15] border-[3px] border-teal-400 flex items-center justify-center shadow-[0_0_12px_rgba(45,212,191,0.4)] z-10 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] hover:border-teal-400/35 hover:bg-white/[0.04] transition-all duration-300 p-4.5 rounded-2xl w-full flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="font-black text-[11px] text-white uppercase tracking-wide">Income Verified</h4>
                  <p className="text-[10px] text-samridhi-textMuted mt-1 leading-normal font-semibold">Steady cash inflows identified from contracting and gig platforms.</p>
                </div>
                <div className="text-[10px] font-black text-teal-400 font-mono mt-2 bg-teal-400/5 py-1 rounded border border-teal-400/10">Score: +6 &rarr; 66</div>
              </div>
            </div>

            {/* Milestone 5 */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 min-w-[200px] md:min-w-0">
              <span className="text-[10px] font-black text-samridhi-success uppercase tracking-wider bg-samridhi-success/10 px-3 py-1 rounded-full border border-samridhi-success/20 font-mono">May 2026</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0e15] border-[3px] border-samridhi-success flex items-center justify-center shadow-[0_0_12px_rgba(0,230,118,0.4)] z-10 my-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-samridhi-success"></span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] hover:border-samridhi-success/35 hover:bg-white/[0.04] transition-all duration-300 p-4.5 rounded-2xl w-full flex-1 flex flex-col justify-between space-y-2.5 border-glow-success">
                <div>
                  <h4 className="font-black text-[11px] text-white uppercase tracking-wide">Current Rating</h4>
                  <p className="text-[10px] text-samridhi-textMuted mt-1 leading-normal font-semibold">Latest alternative credit standing representing low underwriting risk.</p>
                </div>
                <div className="text-[10px] font-black text-samridhi-success font-mono mt-2 bg-samridhi-success/5 py-1 rounded border border-samridhi-success/10 text-glow-success">Live Score: {calculatedScore}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Active Loans Ledger */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/[0.04] border-glow-secondary">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-secondary">Active Credit Portfolio</h3>
          <span className="text-[9px] font-black text-samridhi-textMuted uppercase tracking-widest font-mono">Collateral: Alternative Data</span>
        </div>

        <div className="overflow-x-auto">
          {!dashboardState.loans || dashboardState.loans.length === 0 ? (
            <div className="text-center py-6 text-xs text-samridhi-textMuted font-semibold">
              No active loans found. Apply in the "Apply for Loan" tab.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06] text-white font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Date Approved</th>
                  <th className="py-3 px-2">Lender</th>
                  <th className="py-3 px-2 text-right">Principal</th>
                  <th className="py-3 px-2 text-right">Interest Rate</th>
                  <th className="py-3 px-2 text-right">Monthly EMI</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-samridhi-textMuted font-medium">
                {dashboardState.loans.map((loan, idx) => (
                  <tr key={loan.id || idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-2 text-[11px]">{loan.date}</td>
                    <td className="py-3.5 px-2 text-white font-bold font-sans">{loan.lender}</td>
                    <td className="py-3.5 px-2 text-right font-black text-[12px] text-white">₹{parseInt(loan.amount).toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right font-black text-samridhi-success">{loan.rate}</td>
                    <td className="py-3.5 px-2 text-right font-black text-samridhi-secondary">{loan.emi}</td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider font-sans ${loan.status === 'Active' ? 'bg-samridhi-primary/10 border-samridhi-primary/20 text-samridhi-primary text-glow-primary' : 'bg-samridhi-success/10 border-samridhi-success/20 text-samridhi-success text-glow-success'}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Account Aggregator Consent Gateway Modal */}
      {isAaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-[#090b10]/95 backdrop-blur-3xl border border-white/[0.08] p-6 rounded-3xl w-full max-w-lg shadow-[0_24px_80px_rgba(0,0,0,0.85)] relative overflow-hidden animate-slide-up border-glow-secondary">
            {/* Decorative neon gradient overlays */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-primary/10 to-transparent pointer-events-none filter blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-samridhi-secondary/5 to-transparent pointer-events-none filter blur-xl"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3.5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center text-samridhi-bg font-extrabold text-xs">
                  AA
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Consent Manager</h4>
                  <p className="text-[9px] text-samridhi-textMuted font-medium uppercase tracking-widest mt-0.5">RBI-Compliant Account Aggregator Gateway</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAaModalOpen(false);
                  setAaStep('select-bank');
                  setOtpInput('');
                  setOtpError('');
                  setSyncProgress(0);
                }}
                className="text-samridhi-textMuted hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step 1: Select Bank */}
            {aaStep === 'select-bank' && (
              <div className="space-y-4">
                <p className="text-[11px] text-samridhi-textMuted leading-relaxed">
                  Select your primary banking institution. The Account Aggregator will securely scan transaction history nodes to verify digital credibility.
                </p>
                <div className="grid grid-cols-2 gap-3 py-2">
                  {[
                    { name: 'Union Bank of India', tag: 'Featured', icon: '🏦' },
                    { name: 'State Bank of India', tag: 'SBI', icon: '🏛️' },
                    { name: 'HDFC Bank', tag: 'HDFC', icon: '💳' },
                    { name: 'ICICI Bank', tag: 'ICICI', icon: '📈' },
                    { name: 'Axis Bank', tag: 'Axis', icon: '💸' },
                    { name: 'Punjab National Bank', tag: 'PNB', icon: '🪙' },
                  ].map(bank => (
                    <button
                      key={bank.name}
                      onClick={() => {
                        setSelectedBank(bank.name);
                        setAaStep('enter-phone-vpa');
                      }}
                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                        selectedBank === bank.name 
                          ? 'bg-samridhi-primary/10 border-samridhi-primary' 
                          : 'bg-samridhi-surface border-samridhi-border hover:border-samridhi-textMuted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">{bank.icon}</span>
                        {bank.name === 'Union Bank of India' && (
                          <span className="bg-samridhi-primary/20 text-samridhi-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            User Bank
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-samridhi-textPrimary mt-3">{bank.name}</span>
                      <span className="text-[9px] text-samridhi-textMuted mt-0.5">{bank.name === 'Union Bank of India' ? 'Union Bank consent node active' : 'Secure API pipeline active'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Enter Phone / VPA */}
            {aaStep === 'enter-phone-vpa' && (
              <div className="space-y-4">
                {/* Custom scanning laser CSS rules */}
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes scanLaser {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                  }
                  .animate-scan-laser {
                    animation: scanLaser 2s infinite linear;
                  }
                `}} />

                <div className="flex items-center space-x-2 text-xs text-samridhi-textMuted">
                  <span className="cursor-pointer hover:underline text-samridhi-secondary" onClick={() => setAaStep('select-bank')}>Bank Selection</span>
                  <span>&rarr;</span>
                  <span className="text-samridhi-textPrimary font-bold font-sans">Identity Connection</span>
                </div>
                
                <div className="bg-samridhi-surface/40 border border-samridhi-border p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🏦</span>
                    <span className="text-xs font-bold text-samridhi-textPrimary">{selectedBank}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setAaStep('select-bank');
                      setVerificationMethod('form');
                      setQrScanStatus('idle');
                      setScannedUpiDetails(null);
                    }}
                    className="text-[10px] text-samridhi-primary font-bold hover:underline"
                  >
                    Change Bank
                  </button>
                </div>

                {/* Verification Method Tabs */}
                <div className="flex border-b border-white/[0.04] mb-4">
                  <button
                    onClick={() => setVerificationMethod('form')}
                    className={`flex-1 pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${verificationMethod === 'form' ? 'text-samridhi-secondary border-samridhi-secondary text-glow-secondary' : 'text-samridhi-textMuted border-transparent hover:text-white'}`}
                  >
                    VPA/Mobile Sync
                  </button>
                  <button
                    onClick={() => setVerificationMethod('qr')}
                    className={`flex-1 pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${verificationMethod === 'qr' ? 'text-samridhi-secondary border-samridhi-secondary text-glow-secondary' : 'text-samridhi-textMuted border-transparent hover:text-white'}`}
                  >
                    UPI QR Code Scanner
                  </button>
                </div>

                {/* Tab content */}
                {verificationMethod === 'form' ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1.5">Registered Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-samridhi-textMuted font-bold font-mono">+91</span>
                          <input 
                            type="tel"
                            placeholder="9876543210"
                            maxLength="10"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg py-2.5 pl-12 pr-4 text-xs focus:border-samridhi-secondary focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1.5">UPI VPA ID (Optional)</label>
                        <input 
                          type="text"
                          placeholder={selectedBank === 'Union Bank of India' ? 'name@unionbank' : 'name@okaxis'}
                          value={vpaInput}
                          onChange={(e) => setVpaInput(e.target.value)}
                          className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 text-xs focus:border-samridhi-secondary focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (phoneInput.length !== 10) {
                          alert("Please enter a valid 10-digit mobile number registered with your bank.");
                          return;
                        }
                        setAaStep('consent-request');
                      }}
                      className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 transform active:scale-95"
                    >
                      <span>Proceed to Consent Checklist</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {qrScanStatus === 'idle' && (
                      <div 
                        onClick={() => {
                          setQrScanStatus('scanning');
                          setTimeout(() => {
                            setQrScanStatus('success');
                            setScannedUpiDetails({
                              name: "YALAGA JOSHITHA",
                              vpa: "yalagajoshitha@ybl",
                              bank: "PhonePe UPI (Federal Bank)"
                            });
                            setVpaInput("yalagajoshitha@ybl");
                            setPhoneInput("9988776655");
                          }, 2500);
                        }}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.08] hover:border-samridhi-secondary/40 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer space-y-3 transition-all"
                      >
                        <span className="text-3xl">📷</span>
                        <p className="text-xs font-bold text-white text-center">Click to Scan / Upload PhonePe QR Code</p>
                        <p className="text-[10px] text-samridhi-textMuted text-center font-medium">Scans the PhonePe QR uploaded by Yalaga Joshitha to map VPA credentials.</p>
                      </div>
                    )}

                    {qrScanStatus === 'scanning' && (
                      <div className="relative flex flex-col items-center justify-center p-4 border border-white/[0.08] rounded-xl bg-[#090b10] overflow-hidden h-64 shadow-inner">
                        {/* Scanning QR code image frame */}
                        <img 
                          src="phonepe_qr.png" 
                          className="h-full object-contain opacity-70 filter blur-[0.3px]" 
                          alt="Scanning PhonePe QR Code"
                        />
                        {/* Glowing scan laser */}
                        <div className="absolute left-0 right-0 h-0.5 bg-samridhi-success shadow-[0_0_15px_rgba(0,230,118,1)] animate-scan-laser top-[20%]"></div>
                        
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-2">
                          <div className="w-8 h-8 rounded-full border-2 border-samridhi-secondary border-t-transparent animate-spin"></div>
                          <span className="text-[9px] font-black text-white uppercase tracking-widest font-mono bg-black/60 px-2.5 py-1 rounded">Decoding QR matrix...</span>
                        </div>
                      </div>
                    )}

                    {qrScanStatus === 'success' && scannedUpiDetails && (
                      <div className="space-y-4">
                        <div className="bg-samridhi-success/5 border border-samridhi-success/20 p-4 rounded-xl space-y-2.5 text-xs">
                          <div className="flex items-center justify-between border-b border-samridhi-success/20 pb-2">
                            <span className="font-black text-[9px] text-samridhi-success uppercase tracking-widest font-mono">QR Decrypted successfully</span>
                            <span className="text-samridhi-success text-xs">✔</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-samridhi-textMuted font-semibold">Beneficiary Name:</span>
                            <span className="font-bold text-white uppercase tracking-wide">{scannedUpiDetails.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-samridhi-textMuted font-semibold">UPI VPA Address:</span>
                            <span className="font-bold text-samridhi-secondary font-mono">{scannedUpiDetails.vpa}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-samridhi-textMuted font-semibold">Payment Provider:</span>
                            <span className="font-bold text-white">{scannedUpiDetails.bank}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setAaStep('consent-request')}
                          className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 transform active:scale-95"
                        >
                          <span>Proceed to Consent Checklist</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Consent Request */}
            {aaStep === 'consent-request' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs text-samridhi-textMuted">
                  <span className="cursor-pointer hover:underline text-samridhi-secondary" onClick={() => setAaStep('enter-phone-vpa')}>Identity</span>
                  <span>&rarr;</span>
                  <span className="text-samridhi-textPrimary font-bold">Sahamati Consent Checklist</span>
                </div>

                <div className="border border-samridhi-border rounded-xl bg-samridhi-surface/30 p-4 space-y-3.5 text-xs max-h-60 overflow-y-auto">
                  <div className="flex items-start space-x-2">
                    <span className="text-samridhi-success">✔</span>
                    <div>
                      <span className="block font-bold text-samridhi-textPrimary">Data User:</span>
                      <span className="text-[10px] text-samridhi-textMuted">Samridhi Credit AI underwriting modules.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-samridhi-success">✔</span>
                    <div>
                      <span className="block font-bold text-samridhi-textPrimary">Data FIP (Financial Information Provider):</span>
                      <span className="text-[10px] text-samridhi-textMuted">{selectedBank}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-samridhi-success">✔</span>
                    <div>
                      <span className="block font-bold text-samridhi-textPrimary">Financial Information Types:</span>
                      <span className="text-[10px] text-samridhi-textMuted">UPI Transaction Ledger Streams, Balance Summaries, Inward Deposits.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-samridhi-success">✔</span>
                    <div>
                      <span className="block font-bold text-samridhi-textPrimary">Consent Duration:</span>
                      <span className="text-[10px] text-samridhi-textMuted">One-time fetch of historical (180 days) ledger logs. No recurring background monitoring.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-samridhi-success">✔</span>
                    <div>
                      <span className="block font-bold text-samridhi-textPrimary">Purpose of Consent:</span>
                      <span className="text-[10px] text-samridhi-textMuted">Cashflow stability score calculation for loan eligibility matching.</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-samridhi-textMuted leading-relaxed">
                  By clicking "Accept & Request OTP", you authorize the RBI-licensed Sahamati Account Aggregator gateway to fetch encrypted logs from {selectedBank}.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setAaStep('enter-phone-vpa')}
                    className="flex-1 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textPrimary font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setAaStep('verify-otp');
                    }}
                    className="flex-1 bg-samridhi-success hover:bg-samridhi-success/90 text-samridhi-bg font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Accept & Request OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Verify OTP */}
            {aaStep === 'verify-otp' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs text-samridhi-textMuted">
                  <span className="text-samridhi-textMuted">Sahamati Consent</span>
                  <span>&rarr;</span>
                  <span className="text-samridhi-textPrimary font-bold">2FA Verification</span>
                </div>

                <div className="text-center py-2 space-y-1">
                  <p className="text-xs text-samridhi-textPrimary">
                    Enter the 6-digit OTP sent to <strong className="font-mono text-samridhi-secondary">+91 {phoneInput}</strong> and bank gateway.
                  </p>
                  <p className="text-[10px] text-samridhi-textMuted">
                    Use test verification OTP: <strong className="font-mono text-samridhi-success">123456</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpError('');
                      setOtpInput(e.target.value.replace(/\D/g, ''));
                    }}
                    className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary text-center rounded-xl p-3 text-sm focus:border-samridhi-secondary focus:outline-none font-mono tracking-widest"
                  />
                  {otpError && (
                    <p className="text-[10px] text-samridhi-danger text-center font-bold">{otpError}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setAaStep('consent-request')}
                    className="flex-1 bg-samridhi-surface border border-samridhi-border hover:bg-samridhi-card text-samridhi-textPrimary font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (otpInput !== '123456') {
                        setOtpError('Invalid OTP code. Please enter 123456 for simulator verification.');
                        return;
                      }
                      setAaStep('syncing');
                      // Trigger simulated pipeline loader
                      let progress = 0;
                      const progressTexts = [
                        'Establishing handshake with bank gateway node...',
                        'Negotiating digital public key exchange...',
                        'Decrypting Sahamati consent package payloads...',
                        'Retrieving transactional cashflow ledger entries...',
                        'Analyzing credit-risk ratios and cash safety ratios...',
                        'Finalizing synchronization of 12 new cashflow records...'
                      ];
                      
                      const interval = setInterval(() => {
                        progress += 20;
                            setSyncProgress(progress);
                        const txtIdx = Math.min(Math.floor(progress / 20), progressTexts.length - 1);
                        setSyncStageText(progressTexts[txtIdx]);

                        if (progress >= 100) {
                          clearInterval(interval);
                          
                          // Trigger Transaction Injection & State Update
                          const userVpaValue = vpaInput || `${phoneInput}@unionbank`;
                          
                          // 12 realistic Union Bank transactions
                          const daysAgo = (n) => {
                            const d = new Date();
                            d.setDate(d.getDate() - n);
                            return d.toISOString().split('T')[0];
                          };

                          const baseInjectedTransactions = [
                            { date: daysAgo(1), merchant: "Union Bank Salary Credit / Corp Payout", amount: 45000, category: "Freelance Income", type: "Credit" },
                            { date: daysAgo(2), merchant: "Amazon Web Services", amount: -4200, category: "Business Expense", type: "Debit" },
                            { date: daysAgo(3), merchant: "Zomato Food Delivery", amount: -450, category: "Food & Beverage", type: "Debit" },
                            { date: daysAgo(4), merchant: "Freelance Payout / Upwork Escrow", amount: 18500, category: "Freelance Income", type: "Credit" },
                            { date: daysAgo(6), merchant: "Airtel Fiber Broadband", amount: -1199, category: "Utility Bills", type: "Debit" },
                            { date: daysAgo(7), merchant: "Union Bank ATM Cash Withdrawal", amount: -5000, category: "Utility Bills", type: "Debit" },
                            { date: daysAgo(8), merchant: "Razorpay Payment Gateway", amount: 12000, category: "Freelance Income", type: "Credit" },
                            { date: daysAgo(10), merchant: "Bescom Electricity Utility", amount: -2300, category: "Utility Bills", type: "Debit" },
                            { date: daysAgo(11), merchant: "Uber India Ride Share", amount: -380, category: "Travel Outflow", type: "Debit" },
                            { date: daysAgo(13), merchant: "Apollo Pharmacy Medical", amount: -850, category: "Food & Beverage", type: "Debit" },
                            { date: daysAgo(14), merchant: "Swiggy Instamart Grocery", amount: -1200, category: "Food & Beverage", type: "Debit" },
                            { date: daysAgo(16), merchant: "Rent Payout / PG Accommodation", amount: -10000, category: "Utility Bills", type: "Debit" }
                          ];

                          const prefix = userVpaValue.split('@')[0] || 'User';
                          const cleanName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                          const suffix = userVpaValue.split('@')[1] || 'unionbank';
                          
                          let bankShort = 'Union Bank';
                          if (suffix.includes('sbi')) bankShort = 'SBI';
                          else if (suffix.includes('axis')) bankShort = 'Axis Bank';
                          else if (suffix.includes('hdfc')) bankShort = 'HDFC Bank';
                          else if (suffix.includes('icici')) bankShort = 'ICICI Bank';
                          else if (suffix.includes('ybl') || suffix.includes('paytm')) bankShort = 'UPI Partner';

                          const injectedTransactions = baseInjectedTransactions.map(t => {
                            let merchant = t.merchant;
                            if (t.type === 'Credit') {
                              if (t.merchant.toLowerCase().includes('salary') || t.merchant.toLowerCase().includes('corp')) {
                                merchant = `${bankShort} Salary / ${cleanName} Payout`;
                              } else if (t.merchant.toLowerCase().includes('upwork') || t.merchant.toLowerCase().includes('freelance')) {
                                merchant = `${cleanName} Invoice / Upwork Escrow`;
                              } else if (t.merchant.toLowerCase().includes('razorpay')) {
                                merchant = `${cleanName} Freelance / Razorpay Gateway`;
                              }
                            } else {
                              if (t.merchant.toLowerCase().includes('atm') || t.merchant.toLowerCase().includes('withdrawal')) {
                                merchant = `${bankShort} ATM Cash Withdrawal`;
                              }
                            }
                            return { ...t, merchant };
                          });

                          // Send to database
                          dispatch({ type: 'ADD_TRANSACTION_BULK', payload: injectedTransactions });

                          // Set UPI verified
                          setUpiVerified(true);
                          
                          const isQrMode = (verificationMethod === 'qr');
                          const newName = isQrMode ? 'YALAGA JOSHITHA' : (user.name || 'DEMO');
                          
                          // Dispatch notification
                          dispatch({
                            type: 'ADD_NOTIFICATION',
                            payload: {
                              id: `n-${Date.now()}`,
                              text: isQrMode
                                ? `PhonePe UPI account (${userVpaValue}) verified via QR Code scanning. 12 transactions synced successfully.`
                                : `Union Bank of India UPI account (${userVpaValue}) verified via Account Aggregator. 12 transactions synced successfully.`,
                              read: false,
                              date: "Just now"
                            }
                          });

                          // Update user profile VPA and name in DB
                          if (user && user.isDemo) {
                            let localProfiles = JSON.parse(localStorage.getItem('samridhi_profiles') || '[]');
                            localProfiles = localProfiles.map(p => p.id === user.id ? { ...p, name: newName, upi_vpa: userVpaValue, upi_verified: true } : p);
                            localStorage.setItem('samridhi_profiles', JSON.stringify(localProfiles));
                          } else if (window.supabaseClient && user) {
                            window.supabaseClient.from('profiles').update({ name: newName, upi_vpa: userVpaValue, upi_verified: true }).eq('id', user.id).then();
                          }

                          // Update state in app.js
                          user.upiVpa = userVpaValue;
                          if (isQrMode) {
                            user.name = newName;
                          }
                          if (typeof setUser === 'function') {
                            setUser({ ...user, name: newName, upiVpa: userVpaValue, upiVerified: true });
                          }

                          setAaStep('success');
                        }
                      }, 800);
                    }}
                    className="flex-1 bg-samridhi-secondary hover:bg-samridhi-secondary/90 text-samridhi-bg font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Verify OTP Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Syncing Pipeline */}
            {aaStep === 'syncing' && (
              <div className="space-y-6 py-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Spinning network nodes loader */}
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-samridhi-border"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-samridhi-secondary border-t-transparent animate-spin"></div>
                    <div className="absolute inset-3 rounded-full border-2 border-samridhi-primary border-b-transparent animate-pulse"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">🏦</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-xs text-samridhi-textPrimary">Syncing Financial Telemetry</h5>
                    <p className="text-[10px] text-samridhi-textMuted font-mono h-8">{syncStageText}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs bg-samridhi-bg rounded-full h-1.5 overflow-hidden border border-samridhi-border">
                    <div 
                      className="bg-gradient-to-r from-samridhi-primary to-samridhi-secondary h-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-samridhi-secondary font-mono">{syncProgress}% COMPLETE</span>
                </div>
              </div>
            )}

            {/* Step 6: Success */}
            {aaStep === 'success' && (
              <div className="space-y-5 py-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-samridhi-success/15 border border-samridhi-success/40 flex items-center justify-center text-samridhi-success text-2xl animate-bounce">
                    ✓
                  </div>
                  <h5 className="font-black text-sm text-samridhi-textPrimary uppercase tracking-wide">Sync Successful!</h5>
                  <p className="text-xs text-samridhi-textMuted leading-relaxed max-w-sm">
                    Your <strong>{selectedBank}</strong> profile has been securely linked via the Account Aggregator pipeline. 12 transactions have been analyzed.
                  </p>
                </div>

                <div className="bg-samridhi-surface/50 border border-samridhi-border p-4 rounded-xl flex items-center justify-between text-xs max-w-sm mx-auto">
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[9px] text-samridhi-textMuted uppercase font-bold">Alternative Credit Rating</span>
                    <span className="text-sm font-black text-samridhi-success">Verified low risk profile (+15 pts)</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-samridhi-success/15 flex items-center justify-center text-samridhi-success font-extrabold font-mono text-xs">
                    +15
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsAaModalOpen(false);
                    setAaStep('select-bank');
                    setOtpInput('');
                    setOtpError('');
                    setSyncProgress(0);
                  }}
                  className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Return to Dashboard Overview
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI Sandbox Success Modal */}
      {isSuccessModalOpen && successDetails && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
          <div className="bg-[#090b10]/95 backdrop-blur-3xl border border-white/[0.08] p-6 rounded-3xl w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.85)] relative overflow-hidden animate-slide-up border-glow-success text-center">
            
            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-success/15 to-transparent pointer-events-none filter blur-xl"></div>
            
            {/* Green Checkmark Circle with pulsing layers */}
            <div className="flex flex-col items-center justify-center my-6 space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-samridhi-success/10 border border-samridhi-success/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-samridhi-success/20 border border-samridhi-success/30 animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-full bg-samridhi-success border border-samridhi-success/40 flex items-center justify-center text-samridhi-bg text-xl font-bold shadow-[0_0_15px_rgba(0,230,118,0.5)]">
                  ✓
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black text-samridhi-success uppercase tracking-widest font-mono text-glow-success">UPI Transfer Successful</span>
                <h4 className="text-2xl font-black text-white font-mono mt-1">₹{successDetails.amount.toLocaleString()}</h4>
              </div>
            </div>

            {/* Receipt details */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-samridhi-textMuted font-bold uppercase text-[9px] tracking-wide">Type:</span>
                <span className={`font-black uppercase text-[9px] px-2 py-0.5 rounded border ${
                  successDetails.type === 'Credit' 
                    ? 'bg-samridhi-success/10 border-samridhi-success/20 text-samridhi-success'
                    : 'bg-samridhi-primary/10 border-samridhi-primary/20 text-samridhi-primary'
                }`}>
                  {successDetails.type === 'Credit' ? 'Inflow (Receive)' : 'Outflow (Pay)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-samridhi-textMuted font-semibold">Party Name:</span>
                <span className="font-bold text-white uppercase tracking-wide truncate max-w-[170px]">{successDetails.merchant}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-samridhi-textMuted font-semibold">VPA ID:</span>
                <span className="font-mono text-samridhi-secondary">{successDetails.vpa}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-samridhi-textMuted font-semibold">Category:</span>
                <span className="font-bold text-white">{successDetails.category}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/[0.04] pt-2">
                <span className="text-samridhi-textMuted font-semibold">UPI Ref No:</span>
                <span className="font-mono text-samridhi-textMuted text-[10px]">{successDetails.refId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-samridhi-textMuted font-semibold">Timestamp:</span>
                <span className="font-mono text-samridhi-textMuted text-[9px]">{successDetails.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setSuccessDetails(null);
              }}
              className="mt-6 w-full py-3 bg-samridhi-success hover:bg-samridhi-success/90 text-samridhi-bg font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-samridhi-success/20"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
