// Dashboard Overview Tab Component for Samridhi
// Exposes DashboardOverviewTab globally

window.DashboardOverviewTab = ({
  user,
  calculatedScore,
  dashboardState,
  dispatch,
  setActiveTab,
  upiLinked,
  upiVerified,
  setUpiVerified
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Row 1: Grid Score & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Card (Col-4) */}
        <div className="lg:col-span-4 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase font-bold text-samridhi-textMuted tracking-wider">AI Score Gauge</span>
          </div>
          <CircularGauge score={calculatedScore} />
        </div>

        {/* Dashboard Welcome & Stats (Col-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* Greetings Header */}
          <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col justify-center h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-primary/5 to-transparent rounded-tr-2xl pointer-events-none"></div>
            <h2 className="text-xl md:text-2xl font-black text-samridhi-textPrimary">Welcome back, {user.name}!</h2>
            <p className="text-xs text-samridhi-textMuted mt-1 max-w-lg leading-relaxed">
              Your non-traditional AI credit file is calculated based on alternative cashflow parameters. Your profile is rated as <strong className="text-samridhi-secondary">{calculatedScore >= 71 ? 'LOW RISK' : 'STABLE'}</strong>. Let's maintain healthy digital transactions to qualify for lower rates.
            </p>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('apply')}
                className="bg-samridhi-primary hover:bg-samridhi-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-colors"
              >
                Apply for Loan
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="bg-samridhi-surface hover:bg-samridhi-card border border-samridhi-border text-samridhi-textPrimary text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
              >
                View Recommendations
              </button>
            </div>
          </div>

          {/* quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-samridhi-card border border-samridhi-border p-4 rounded-xl flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider">Monthly Income</span>
                <span className="text-base font-extrabold text-samridhi-textPrimary">₹45,000</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-samridhi-success/15 border border-samridhi-success/30 flex items-center justify-center text-samridhi-success font-black text-xs">
                <Icons.ArrowUp className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-samridhi-card border border-samridhi-border p-4 rounded-xl flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider">UPI Transactions</span>
                <span className="text-base font-extrabold text-samridhi-textPrimary">{dashboardState.transactions.length} this month</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-samridhi-secondary/15 border border-samridhi-secondary/30 flex items-center justify-center text-samridhi-secondary font-black text-xs">
                ⚡
              </div>
            </div>

            <div className="bg-samridhi-card border border-samridhi-border p-4 rounded-xl flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider">Skills Certified</span>
                <span className="text-base font-extrabold text-samridhi-textPrimary">{dashboardState.skills.filter(s => s.verified).length} verified</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-samridhi-primary/15 border border-samridhi-primary/30 flex items-center justify-center text-samridhi-primary font-black text-xs">
                🎓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI TRANSACTION SIMULATOR AND RECENT TRANSACTIONS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions list (Col-8) */}
        <div className="lg:col-span-8 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-samridhi-border/40 pb-3">
            <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Recent UPI Transaction Stream</h3>
            <span className="text-[10px] font-bold text-samridhi-textMuted uppercase">UPI Sync Engine</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-samridhi-textMuted">
              <thead>
                <tr className="border-b border-samridhi-border/60 text-samridhi-textPrimary font-extrabold uppercase">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Merchant</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-samridhi-border/30">
                {dashboardState.transactions.map((tx, idx) => (
                  <tr key={tx.id || idx} className="hover:bg-samridhi-surface/30 transition-colors">
                    <td className="py-3 font-semibold">{tx.date}</td>
                    <td className="py-3 text-samridhi-textPrimary font-semibold">{tx.merchant}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-samridhi-surface border border-samridhi-border rounded text-[10px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-black ${tx.amount > 0 ? 'text-samridhi-success' : 'text-samridhi-textPrimary'}`}>
                      {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live UPI Verification & Stream Injector Widget (Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UPI ID Verification card */}
          <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-primary/5 to-transparent pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between border-b border-samridhi-border/40 pb-3 mb-4">
                <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">UPI KYC Authenticator</h4>
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${upiLinked && upiVerified ? 'bg-samridhi-success/15 text-samridhi-success border border-samridhi-success/20' : 'bg-samridhi-warning/15 text-samridhi-warning border border-samridhi-warning/20'}`}>
                  {upiLinked && upiVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
              
              <p className="text-[11px] text-samridhi-textMuted leading-relaxed mb-4">
                Linked UPI ID (VPA): <strong className="text-samridhi-textPrimary font-semibold">{user.upiVpa || 'Not linked'}</strong>.
                Pay ₹1.00 dynamically generated verification transaction to confirm identity details.
              </p>

              {upiLinked ? (
                <div className="space-y-4">
                  {/* QR and Details */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-samridhi-surface/50 p-4 border border-samridhi-border rounded-xl">
                    {/* Dynamic QR Code from free API */}
                    <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A0A0F&data=${encodeURIComponent(`upi://pay?pa=samridhi@okaxis&pn=Samridhi%20AI&am=1.00&cu=INR&tn=Verification%20for%20${user.name}`)}`} 
                        alt="UPI QR Code"
                        className="w-20 h-20"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2 text-xs w-full">
                      <div>
                        <span className="block text-[9px] text-samridhi-textMuted font-bold uppercase">UPI Deep Link</span>
                        <code className="text-[9px] text-samridhi-secondary block break-all font-mono bg-samridhi-bg p-1.5 rounded border border-samridhi-border max-h-16 overflow-y-auto mt-0.5">
                          {`upi://pay?pa=samridhi@okaxis&pn=Samridhi%20AI&am=1.00&cu=INR`}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {/* Deep link button (for mobile testing) */}
                    <a 
                      href={`upi://pay?pa=samridhi@okaxis&pn=Samridhi%20AI&am=1.00&cu=INR&tn=Verification%20for%20${user.name}`}
                      className="flex-1 text-center bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2 px-3 rounded-lg text-[10px] transition-all inline-block shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Pay ₹1 on Mobile
                    </a>
                    
                    <button
                      onClick={() => {
                        setUpiVerified(true);
                        dispatch({
                          type: 'ADD_NOTIFICATION',
                          payload: {
                            id: `n-${Date.now()}`,
                            text: `UPI account ${user.upiVpa} verified successfully via token auth. Dynamic score raised (+15 points).`,
                            read: false,
                            date: "Just now"
                          }
                        });
                      }}
                      disabled={upiVerified}
                      className={`flex-1 font-bold py-2 px-3 rounded-lg text-[10px] transition-all border ${
                        upiVerified
                          ? 'bg-samridhi-success/5 border-samridhi-success/20 text-samridhi-success cursor-not-allowed'
                          : 'bg-samridhi-success/20 hover:bg-samridhi-success/30 text-samridhi-success border-samridhi-success/40 hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      {upiVerified ? 'Verified ✓' : 'Confirm Pay (Sim)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-samridhi-border rounded-xl">
                  <p className="text-[10px] text-samridhi-textMuted mb-2">Please link your UPI ID in Profile Settings to run identity verification.</p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 bg-samridhi-primary text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Go to Profile Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* UPI Stream Simulator card */}
          <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col justify-between shadow-lg">
            <div>
              <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-3 mb-4">UPI Stream Simulator</h4>
              <p className="text-[11px] text-samridhi-textMuted leading-relaxed mb-4">
                Add a mock UPI transaction to simulate transaction patterns. AI underwriting evaluates cash stability trends in real-time.
              </p>
              
              {/* Interactive Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Merchant / Source</label>
                  <input 
                    type="text" 
                    id="simMerchant"
                    placeholder="e.g. Starbucks Cafe" 
                    className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-secondary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      id="simAmount"
                      placeholder="500" 
                      className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Category</label>
                    <select 
                      id="simCategory"
                      className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-secondary focus:outline-none"
                    >
                      <option value="Food & Beverage">F&B Outflow</option>
                      <option value="Utility Bills">Utilities</option>
                      <option value="Business Expense">Business</option>
                      <option value="Freelance Income">Direct Inflow</option>
                      <option value="Travel Outflow">Transport</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const merchant = document.getElementById('simMerchant').value || 'UPI Transaction';
                const amountVal = parseFloat(document.getElementById('simAmount').value) || 250;
                const category = document.getElementById('simCategory').value;
                const isInflow = category === 'Freelance Income';

                const newTx = {
                  id: `sim-t-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  merchant,
                  amount: isInflow ? amountVal : -amountVal,
                  category,
                  type: isInflow ? 'Credit' : 'Debit'
                };

                dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
                dispatch({ 
                  type: 'ADD_NOTIFICATION', 
                  payload: { 
                    id: `n-${Date.now()}`, 
                    text: `Simulated transaction added: ${merchant} for ${isInflow ? '+' : '-'}₹${amountVal}. Score recalculated.`, 
                    read: false, 
                    date: "Just now" 
                  }
                });

                // Reset inputs
                document.getElementById('simMerchant').value = '';
                document.getElementById('simAmount').value = '';
              }}
              className="mt-6 w-full bg-samridhi-secondary hover:bg-samridhi-secondary/90 text-samridhi-bg font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Inject & Parse Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Loans Ledger */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-samridhi-border/40 pb-3">
          <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Active Credit Portfolio</h3>
          <span className="text-[10px] font-bold text-samridhi-textMuted uppercase">Collateral: Alternative Data</span>
        </div>

        <div className="overflow-x-auto">
          {!dashboardState.loans || dashboardState.loans.length === 0 ? (
            <div className="text-center py-6 text-xs text-samridhi-textMuted">
              No active loans found. Apply in the "Apply for Loan" tab.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-samridhi-textMuted">
              <thead>
                <tr className="border-b border-samridhi-border/60 text-samridhi-textPrimary font-extrabold uppercase">
                  <th className="py-2.5">Date Approved</th>
                  <th className="py-2.5">Lender</th>
                  <th className="py-2.5 text-right">Principal</th>
                  <th className="py-2.5 text-right">Interest Rate</th>
                  <th className="py-2.5 text-right">Monthly EMI</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-samridhi-border/30">
                {dashboardState.loans.map((loan, idx) => (
                  <tr key={loan.id || idx} className="hover:bg-samridhi-surface/30 transition-colors">
                    <td className="py-3 font-semibold">{loan.date}</td>
                    <td className="py-3 text-samridhi-textPrimary font-semibold">{loan.lender}</td>
                    <td className="py-3 text-right font-bold text-samridhi-textPrimary">₹{parseInt(loan.amount).toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-samridhi-success">{loan.rate}</td>
                    <td className="py-3 text-right font-black text-samridhi-secondary">{loan.emi}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${loan.status === 'Active' ? 'bg-samridhi-primary/15 border border-samridhi-primary/30 text-samridhi-primary' : 'bg-samridhi-success/15 border border-samridhi-success/30 text-samridhi-success'}`}>
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

    </div>
  );
};
