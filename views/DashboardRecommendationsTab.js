// Dashboard Recommendations Tab Component for Samridhi
// Exposes DashboardRecommendationsTab globally

window.DashboardRecommendationsTab = ({
  user,
  calculatedScore,
  dispatch,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Info Panel */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Decentralized Capital Recommendations</h2>
          <p className="text-xs text-samridhi-textMuted">Matched partners providing custom loan options based on your trust score of <strong className="text-samridhi-secondary">{calculatedScore}</strong>.</p>
        </div>

        <div className="inline-flex items-center space-x-2 bg-samridhi-primary/10 border border-samridhi-primary/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-samridhi-primary">
          <span>Capital Pools Sync: Online</span>
        </div>
      </div>

      {/* Tailored AI Underwriting Rationale Banner */}
      <div className="bg-samridhi-surface border border-samridhi-border p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-secondary/15 to-transparent rounded-tr-2xl pointer-events-none"></div>
        <h3 className="text-xs font-black uppercase text-samridhi-secondary tracking-widest mb-2 flex items-center gap-1.5">
          <span>⚡</span> AI Underwriting Rationale: {user.type} Profile
        </h3>
        <p className="text-xs text-samridhi-textMuted leading-relaxed">
          {UNDERWRITING_RATIONALES[user.type] || "Connecting additional gig profiles and transactional histories increases credit limits."}
        </p>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_LOAN_OFFERS.map((offer) => {
          // Match user classification criteria
          const isHighlyEligible = (user.type === offer.type) && (
            (user.type === 'Freelancer' && calculatedScore >= 70) ||
            (user.type === 'Student' && calculatedScore >= 60) ||
            (user.type === 'Entrepreneur' && calculatedScore >= 65) ||
            (user.type === 'Salaried' && calculatedScore >= 60)
          );

          return (
            <div 
              key={offer.id} 
              className={`bg-samridhi-card border p-6 rounded-2xl flex flex-col justify-between transition-all ${
                isHighlyEligible 
                  ? 'border-samridhi-primary/45 shadow-[0_0_15px_rgba(108,99,255,0.08)]' 
                  : 'border-samridhi-border'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-samridhi-textMuted">{offer.lender}</span>
                      {isHighlyEligible && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-samridhi-success/15 border border-samridhi-success/30 rounded text-samridhi-success uppercase">
                          Match: {user.type} Profile
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-base text-samridhi-textPrimary mt-1">{offer.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-samridhi-surface border border-samridhi-border rounded-lg text-samridhi-secondary">
                    {offer.tag}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-samridhi-border/40 text-xs">
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Capital limit</span>
                    <span className="font-extrabold text-samridhi-textPrimary">{offer.amount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Interest Rate</span>
                    <span className="font-extrabold text-samridhi-success">{offer.interestRate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-samridhi-textMuted uppercase font-bold">Max Term</span>
                    <span className="font-extrabold text-samridhi-textPrimary">{offer.tenure}</span>
                  </div>
                </div>

                <p className="text-[11px] text-samridhi-textMuted mt-3">
                  {offer.eligibility}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    dispatch({
                      type: 'APPLY_LOAN',
                      payload: {
                        id: `l-sim-${Date.now()}`,
                        lender: offer.lender,
                        amount: parseInt(offer.amount.replace('₹', '').replace(',', '')),
                        rate: offer.interestRate,
                        emi: `₹${(parseInt(offer.amount.replace('₹', '').replace(',', '')) * 0.09).toFixed(0)}`,
                        status: "Active",
                        date: new Date().toISOString().split('T')[0]
                      }
                    });
                    dispatch({
                      type: 'ADD_NOTIFICATION',
                      payload: {
                        id: `n-${Date.now()}`,
                        text: `Applied successfully for ${offer.name} with ${offer.lender}. Active loans updated.`,
                        read: false,
                        date: "Just now"
                      }
                    });
                    setActiveTab('overview');
                  }}
                  className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Instant Apply Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
