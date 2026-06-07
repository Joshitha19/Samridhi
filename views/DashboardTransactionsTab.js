// Dashboard Transaction Analysis Tab Component for Samridhi
// Exposes DashboardTransactionsTab globally

window.DashboardTransactionsTab = ({
  dashboardState
}) => {
  const { useState, useMemo } = React;
  
  const [simulateFraud, setSimulateFraud] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Hardcoded stats based on prompt
  const stats = useMemo(() => {
    if (simulateFraud) {
      return {
        count: 40,
        credited: 65500,
        debited: 16198 + 40000 // add the simulated anomalies (25000 + 15000)
      };
    }
    return {
      count: 38,
      credited: 65500,
      debited: 16198
    };
  }, [simulateFraud]);

  // Categories list
  const categories = ['All', 'Income', 'Food', 'Shopping', 'Housing', 'Utility', 'Education', 'Entertainment'];

  // Base mock transaction data
  const baseTransactions = [
    { id: 'tx-1', date: "2026-05-24", merchant: "Swiggy", category: "Food", amount: 350, type: "Debit" },
    { id: 'tx-2', date: "2026-05-20", merchant: "PhonePe Rent", category: "Housing", amount: 12000, type: "Debit" },
    { id: 'tx-3', date: "2026-05-18", merchant: "Salary TechCorp", category: "Income", amount: 45000, type: "Credit" },
    { id: 'tx-4', date: "2026-05-16", merchant: "Amazon Pay", category: "Shopping", amount: 1800, type: "Debit" },
    { id: 'tx-5', date: "2026-05-15", merchant: "Zepto", category: "Food", amount: 450, type: "Debit" },
    { id: 'tx-6', date: "2026-05-14", merchant: "Udemy Course", category: "Education", amount: 1200, type: "Debit" },
    { id: 'tx-7', date: "2026-05-12", merchant: "Client Payment - Upwork", category: "Income", amount: 20500, type: "Credit" },
    { id: 'tx-8', date: "2026-05-10", merchant: "Electricity APSEB", category: "Utility", amount: 2100, type: "Debit" },
    { id: 'tx-9', date: "2026-05-08", merchant: "Netflix", category: "Entertainment", amount: 298, type: "Debit" },
    { id: 'tx-10', date: "2026-05-05", merchant: "Freelance Project - Fiverr", category: "Income", amount: 8000, type: "Credit" }
  ];

  // Anomalies to inject when fraud is enabled
  const anomalyTransactions = [
    { id: 'tx-a1', date: "2026-05-14", merchant: "Unusual Cash Spike", category: "Entertainment", amount: 25000, type: "Debit", anomaly: true },
    { id: 'tx-a2', date: "2026-05-14", merchant: "Suspicious High Velocity Pay", category: "Shopping", amount: 15000, type: "Debit", anomaly: true }
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let list = [...baseTransactions];
    if (simulateFraud) {
      list = [...anomalyTransactions, ...list];
    }
    if (activeCategory !== 'All') {
      list = list.filter(tx => tx.category.toLowerCase() === activeCategory.toLowerCase());
    }
    return list;
  }, [simulateFraud, activeCategory]);

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* TOP STATS ROW (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Stat 1 */}
        <div className="bg-samridhi-card border border-samridhi-border p-4.5 rounded-2xl flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider block">Total Transactions</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-samridhi-textPrimary">{stats.count}</span>
            <span className="text-[9px] font-bold text-samridhi-textMuted uppercase">This Month</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-samridhi-card border border-samridhi-border p-4.5 rounded-2xl flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider block">Total Credited</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-samridhi-success">₹{stats.credited.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-samridhi-success uppercase">Active Inflow</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-samridhi-card border border-samridhi-border p-4.5 rounded-2xl flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-samridhi-textMuted uppercase tracking-wider block">Total Debited</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-samridhi-danger">₹{stats.debited.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-samridhi-danger uppercase">Outflow</span>
          </div>
        </div>

      </div>

      {/* ANOMALY DETECTION BANNER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 bg-opacity-10 shadow-md bg-samridhi-card border-samridhi-border">
        
        <div className="flex items-center space-x-3">
          {simulateFraud ? (
            <div className="flex-1 flex items-start space-x-3 text-samridhi-danger">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-extrabold text-xs">2 anomalies flagged — Unusual transaction spike on 14 May.</h4>
                <p className="text-[10px] text-samridhi-textMuted mt-0.5">Underwriting reviews required before scoring adjustments.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-start space-x-3 text-samridhi-success">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-extrabold text-xs">No anomalies detected — Isolation Forest: Clean.</h4>
                <p className="text-[10px] text-samridhi-textMuted mt-0.5">All {stats.count} transactions verified as legitimate footprint patterns.</p>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Simulation */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] font-bold text-samridhi-textMuted uppercase">Simulate Fraud Detection</span>
          <button
            onClick={() => setSimulateFraud(!simulateFraud)}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
              simulateFraud ? 'bg-samridhi-danger' : 'bg-samridhi-border'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white transition-transform transform ${
                simulateFraud ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

      </div>

      {/* FILTER ROW */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                isActive 
                  ? 'bg-samridhi-primary border-samridhi-primary text-white shadow-md' 
                  : 'bg-samridhi-surface border-samridhi-border text-samridhi-textMuted hover:text-samridhi-textPrimary'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* TRANSACTION TABLE & BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table (Col-8) */}
        <div className="lg:col-span-8 bg-samridhi-card border border-samridhi-border p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b border-samridhi-border/40 pb-2">
            <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Transaction Ledger</h3>
            <span className="text-[9px] font-bold text-samridhi-textMuted uppercase">Verified Nodes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-samridhi-textMuted">
              <thead>
                <tr className="border-b border-samridhi-border/60 text-samridhi-textPrimary font-extrabold uppercase text-[10px]">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Merchant</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-samridhi-border/30">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-samridhi-textMuted">No transactions matching filter</td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isAnomaly = tx.anomaly;
                    const isCredit = tx.type === 'Credit';
                    return (
                      <tr 
                        key={tx.id} 
                        className={`transition-colors ${
                          isAnomaly 
                            ? 'bg-samridhi-danger/5 hover:bg-samridhi-danger/10 border-l-2 border-samridhi-danger' 
                            : 'hover:bg-samridhi-surface/30'
                        }`}
                      >
                        <td className="py-3 font-semibold whitespace-nowrap pl-2">{tx.date}</td>
                        <td className="py-3 text-samridhi-textPrimary font-extrabold flex items-center space-x-1.5">
                          {isAnomaly && (
                            <svg className="w-3.5 h-3.5 text-samridhi-danger shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                          <span>{tx.merchant}</span>
                        </td>
                        <td className="py-3 uppercase text-[9px] font-black">{tx.category}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            isCredit 
                              ? 'bg-samridhi-success/10 text-samridhi-success border border-samridhi-success/20' 
                              : 'bg-samridhi-primary/10 text-samridhi-primary border border-samridhi-primary/20'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3">
                          {isAnomaly ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-samridhi-danger/20 text-samridhi-danger border border-samridhi-danger/30">
                              Flagged
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-samridhi-success">Verified</span>
                          )}
                        </td>
                        <td className={`py-3 text-right font-black font-mono ${
                          isCredit ? 'text-samridhi-success' : isAnomaly ? 'text-samridhi-danger' : 'text-samridhi-textPrimary'
                        }`}>
                          {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts & Health (Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Spending Category Chart */}
          <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl space-y-4 shadow-lg">
            <h3 className="font-extrabold text-xs text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-2">
              Spending by Category
            </h3>
            
            {/* Custom SVG Bar Chart */}
            {/* Housing is highest -> Cyan, rest purple */}
            <div className="relative pt-4 flex flex-col items-center">
              <svg className="w-full h-44" viewBox="0 0 240 140">
                {/* 6 Categories: Food, Shopping, Housing, Utility, Education, Entertainment */}
                {/* Max amount is Housing (12000) -> scale to max height 100 */}
                {/* Bars:
                    Housing (12000) -> h=100, x=15
                    Utility (2100)  -> h=18, x=53
                    Education (1200)-> h=10, x=91
                    Food (800)      -> h=7, x=129
                    Shopping (1800) -> h=15, x=167
                    Entertain (298) -> h=3, x=205
                */}
                
                {/* Base Line */}
                <line x1="10" y1="110" x2="230" y2="110" stroke="#2A2A3E" strokeWidth="1.5" />
                
                {/* Bar 1: Housing (Cyan) */}
                <rect x="18" y="10" width="16" height="100" fill="#00D4FF" rx="2" />
                <text x="26" y="8" fill="#00D4FF" fontSize="7" fontWeight="bold" textAnchor="middle">₹12K</text>
                
                {/* Bar 2: Utility */}
                <rect x="56" y="92" width="16" height="18" fill="#6C63FF" rx="2" />
                <text x="64" y="89" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">₹2.1K</text>

                {/* Bar 3: Education */}
                <rect x="94" y="100" width="16" height="10" fill="#6C63FF" rx="2" />
                <text x="102" y="97" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">₹1.2K</text>

                {/* Bar 4: Food */}
                <rect x="132" y="103" width="16" height="7" fill="#6C63FF" rx="2" />
                <text x="140" y="100" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">₹800</text>

                {/* Bar 5: Shopping */}
                <rect x="170" y="95" width="16" height="15" fill="#6C63FF" rx="2" />
                <text x="178" y="92" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">₹1.8K</text>

                {/* Bar 6: Entertainment */}
                <rect x="208" y="107" width="16" height="3" fill="#6C63FF" rx="2" />
                <text x="216" y="104" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">₹298</text>

                {/* X Labels */}
                <text x="26" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">House</text>
                <text x="64" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">Util</text>
                <text x="102" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">Edu</text>
                <text x="140" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">Food</text>
                <text x="178" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">Shop</text>
                <text x="216" y="122" fill="#8888AA" fontSize="7" fontWeight="bold" textAnchor="middle">Ent</text>
              </svg>
            </div>
          </div>

          {/* UPI Health Score Card */}
          <div className="bg-samridhi-card border border-samridhi-border p-5 rounded-2xl space-y-4 shadow-lg">
            <h3 className="font-extrabold text-xs text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-2">
              UPI Health metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {[
                { title: 'Payment Regularity', val: '94%' },
                { title: 'Merchant Diversity', val: '8.2/10' },
                { title: 'Transaction Velocity', val: 'Normal' },
                { title: 'Avg Monthly Volume', val: '₹16,198' }
              ].map((item, idx) => (
                <div key={idx} className="bg-samridhi-surface/50 border border-samridhi-border/60 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-samridhi-textMuted uppercase block leading-normal">{item.title}</span>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-extrabold text-samridhi-textPrimary">{item.val}</span>
                    <svg className="w-4 h-4 text-samridhi-success shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
