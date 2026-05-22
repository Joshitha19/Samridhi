// Dashboard Score Factors Tab Component for Samridhi
// Exposes DashboardScoreTab globally

window.DashboardScoreTab = ({
  calculatedScore,
  dashboardState,
  aadhaarVerified,
  panVerified,
  upiLinked,
  whatIfRepayActive,
  setWhatIfRepayActive,
  whatIfLinkGithub,
  setWhatIfLinkGithub,
  whatIfNewCert,
  setWhatIfNewCert,
  whatIfConsistentUpi,
  setWhatIfConsistentUpi
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Explainable AI (XAI) Scoring Engine</h2>
        <p className="text-xs text-samridhi-textMuted leading-relaxed">
          Traditional models evaluate only historic banking bureau footprints. Samridhi analyzes alternate telemetry streams across 4 major dimensions. Below are your dynamic credit vectors contributing to your score of <strong className="text-samridhi-secondary">{calculatedScore}/100</strong>.
        </p>

        {/* Progress score grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Metric 1 */}
          <div className="bg-samridhi-surface border border-samridhi-border/60 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-samridhi-textPrimary">Alternative Cashflow Recency (25%)</span>
              <span className="text-samridhi-secondary">{upiLinked ? '85/100' : '0/100'}</span>
            </div>
            <div className="w-full bg-samridhi-bg h-2 rounded-full overflow-hidden">
              <div className="bg-samridhi-secondary h-full transition-all duration-700" style={{ width: upiLinked ? '85%' : '0%' }}></div>
            </div>
            <p className="text-[10px] text-samridhi-textMuted leading-normal">
              {upiLinked 
                ? 'UPI linking confirmed. Evaluates transaction volume consistency over the past 30 days.'
                : 'UPI cashflow not connected. Connect banking details to raise alternative credibility metrics.'}
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-samridhi-surface border border-samridhi-border/60 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-samridhi-textPrimary">Verified Professional Credentials (25%)</span>
              <span className="text-samridhi-primary">
                {Math.min(100, 45 + (dashboardState.skills.filter(s => s.verified).length * 15))}/100
              </span>
            </div>
            <div className="w-full bg-samridhi-bg h-2 rounded-full overflow-hidden">
              <div className="bg-samridhi-primary h-full transition-all duration-700" style={{ width: `${Math.min(100, 45 + (dashboardState.skills.filter(s => s.verified).length * 15))}%` }}></div>
            </div>
            <p className="text-[10px] text-samridhi-textMuted leading-normal">
              Analyzing {dashboardState.skills.filter(s => s.verified).length} active verified certificates. Certifications from AWS and Meta act as proxies for earning potential.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-samridhi-surface border border-samridhi-border/60 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-samridhi-textPrimary">Simulated Repayment Index (30%)</span>
              <span className="text-samridhi-success">80/100</span>
            </div>
            <div className="w-full bg-samridhi-bg h-2 rounded-full overflow-hidden">
              <div className="bg-samridhi-success h-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-[10px] text-samridhi-textMuted leading-normal">
              Historical data indicates no payment defaults inside Samridhi networks. Timely repayments provide high structural trust scores.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="bg-samridhi-surface border border-samridhi-border/60 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-samridhi-textPrimary">KYC & Digital Footprint Stability (20%)</span>
              <span className="text-samridhi-warning">
                {((aadhaarVerified ? 50 : 0) + (panVerified ? 50 : 0))}/100
              </span>
            </div>
            <div className="w-full bg-samridhi-bg h-2 rounded-full overflow-hidden">
              <div className="bg-samridhi-warning h-full transition-all duration-700" style={{ width: `${(aadhaarVerified ? 50 : 0) + (panVerified ? 50 : 0)}%` }}></div>
            </div>
            <p className="text-[10px] text-samridhi-textMuted leading-normal">
              Matches Government registry verification and identity parameters (Aadhaar & PAN matching status).
            </p>
          </div>

        </div>
      </div>

      {/* INTERACTIVE CREDIT SIMULATOR */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
        <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-3">
          Credit Score Simulator (What-If Analysis)
        </h3>
        <p className="text-xs text-samridhi-textMuted leading-relaxed">
          Toggle the actions below to simulate how financial behaviors and additional digital assets will affect your real-time Samridhi AI Credibility Score:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
          
          <button
            onClick={() => setWhatIfRepayActive(!whatIfRepayActive)}
            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
              whatIfRepayActive 
                ? 'bg-samridhi-success/5 border-samridhi-success text-samridhi-textPrimary shadow-[0_0_10px_rgba(0,230,118,0.1)]' 
                : 'bg-samridhi-surface border-samridhi-border hover:border-samridhi-border/80 text-samridhi-textMuted'
            }`}
          >
            <span className="text-xs font-bold mb-1">Repay Active Microloan</span>
            <div className="flex items-center justify-between w-full mt-4">
              <span className={`text-[10px] font-black ${whatIfRepayActive ? 'text-samridhi-success' : 'text-samridhi-textMuted'}`}>+6 Points</span>
              <span className="text-[11px]">{whatIfRepayActive ? 'Active' : 'Simulate'}</span>
            </div>
          </button>

          <button
            onClick={() => setWhatIfLinkGithub(!whatIfLinkGithub)}
            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
              whatIfLinkGithub 
                ? 'bg-samridhi-primary/5 border-samridhi-primary text-samridhi-textPrimary shadow-[0_0_10px_rgba(108,99,255,0.1)]' 
                : 'bg-samridhi-surface border-samridhi-border hover:border-samridhi-border/80 text-samridhi-textMuted'
            }`}
          >
            <span className="text-xs font-bold mb-1">Link GitHub Account</span>
            <div className="flex items-center justify-between w-full mt-4">
              <span className={`text-[10px] font-black ${whatIfLinkGithub ? 'text-samridhi-primary' : 'text-samridhi-textMuted'}`}>+8 Points</span>
              <span className="text-[11px]">{whatIfLinkGithub ? 'Active' : 'Simulate'}</span>
            </div>
          </button>

          <button
            onClick={() => setWhatIfNewCert(!whatIfNewCert)}
            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
              whatIfNewCert 
                ? 'bg-samridhi-secondary/5 border-samridhi-secondary text-samridhi-textPrimary shadow-[0_0_10px_rgba(0,212,255,0.1)]' 
                : 'bg-samridhi-surface border-samridhi-border hover:border-samridhi-border/80 text-samridhi-textMuted'
            }`}
          >
            <span className="text-xs font-bold mb-1">Add Google UX Cert</span>
            <div className="flex items-center justify-between w-full mt-4">
              <span className={`text-[10px] font-black ${whatIfNewCert ? 'text-samridhi-secondary' : 'text-samridhi-textMuted'}`}>+5 Points</span>
              <span className="text-[11px]">{whatIfNewCert ? 'Active' : 'Simulate'}</span>
            </div>
          </button>

          <button
            onClick={() => setWhatIfConsistentUpi(!whatIfConsistentUpi)}
            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
              whatIfConsistentUpi 
                ? 'bg-samridhi-warning/5 border-samridhi-warning text-samridhi-textPrimary shadow-[0_0_10px_rgba(255,179,0,0.1)]' 
                : 'bg-samridhi-surface border-samridhi-border hover:border-samridhi-border/80 text-samridhi-textMuted'
            }`}
          >
            <span className="text-xs font-bold mb-1">30-Day Steady Deposits</span>
            <div className="flex items-center justify-between w-full mt-4">
              <span className={`text-[10px] font-black ${whatIfConsistentUpi ? 'text-samridhi-warning' : 'text-samridhi-textMuted'}`}>+7 Points</span>
              <span className="text-[11px]">{whatIfConsistentUpi ? 'Active' : 'Simulate'}</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
