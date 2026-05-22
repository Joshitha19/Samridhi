// Dashboard Profile Tab Component for Samridhi
// Exposes DashboardProfileTab globally

window.DashboardProfileTab = ({
  user,
  setUser,
  dashboardState,
  dispatch,
  aadhaarVerified,
  setAadhaarVerified,
  panVerified,
  setPanVerified,
  upiLinked,
  setUpiLinked
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Account overview */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-6">
        <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Profile Credentials & KYC Verification</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal info form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value.toUpperCase() })}
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textMuted rounded-lg p-2.5 cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Earning Profile Sector</label>
              <select
                value={user.type}
                onChange={(e) => setUser({ ...user, type: e.target.value })}
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
              >
                <option value="Salaried">Salaried Employee</option>
                <option value="Freelancer">Freelancer / Gig Contractor</option>
                <option value="Student">Student (Vocational/Tech)</option>
                <option value="Entrepreneur">Micro-Entrepreneur / Merchant</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Linked UPI ID (VPA)</label>
              <input
                type="text"
                value={user.upiVpa || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setUser({ ...user, upiVpa: val });
                  setUpiLinked(val.trim() !== '');
                }}
                placeholder="e.g. yourname@okaxis"
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
              />
            </div>
          </div>

          {/* KYC Checklist */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-2.5">
              Gov ID Integrations
            </h4>
            
            <div className="space-y-3.5 pt-1">
              {/* Aadhaar */}
              <label className="flex items-center justify-between p-3 bg-samridhi-surface border border-samridhi-border/60 rounded-xl cursor-pointer hover:border-samridhi-border transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={aadhaarVerified}
                    onChange={(e) => setAadhaarVerified(e.target.checked)}
                    className="rounded text-samridhi-primary border-samridhi-border focus:ring-samridhi-primary bg-samridhi-bg"
                  />
                  <span className="text-xs font-bold text-samridhi-textPrimary">Aadhaar Registry Sync</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${aadhaarVerified ? 'bg-samridhi-success/10 text-samridhi-success' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                  {aadhaarVerified ? 'Verified (+4)' : 'Unlinked'}
                </span>
              </label>

              {/* PAN */}
              <label className="flex items-center justify-between p-3 bg-samridhi-surface border border-samridhi-border/60 rounded-xl cursor-pointer hover:border-samridhi-border transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={panVerified}
                    onChange={(e) => setPanVerified(e.target.checked)}
                    className="rounded text-samridhi-primary border-samridhi-border focus:ring-samridhi-primary bg-samridhi-bg"
                  />
                  <span className="text-xs font-bold text-samridhi-textPrimary">PAN Registry Match</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${panVerified ? 'bg-samridhi-success/10 text-samridhi-success' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                  {panVerified ? 'Verified (+3)' : 'Unlinked'}
                </span>
              </label>

              {/* UPI */}
              <label className="flex items-center justify-between p-3 bg-samridhi-surface border border-samridhi-border/60 rounded-xl cursor-pointer hover:border-samridhi-border transition-colors">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={upiLinked}
                    onChange={(e) => setUpiLinked(e.target.checked)}
                    className="rounded text-samridhi-primary border-samridhi-border focus:ring-samridhi-primary bg-samridhi-bg"
                  />
                  <span className="text-xs font-bold text-samridhi-textPrimary">UPI Aggregator Sync</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${upiLinked ? 'bg-samridhi-success/10 text-samridhi-success' : 'bg-samridhi-border text-samridhi-textMuted'}`}>
                  {upiLinked ? 'Synced (+10)' : 'Disconnected'}
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Skills credentials list */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-samridhi-border/40 pb-3">
          <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Credential Verification List</h3>
          <button
            onClick={() => {
              const skillName = prompt("Enter verification certificate name:") || "";
              const issuer = prompt("Enter issuing organization (e.g. Google):") || "";
              if (skillName && issuer) {
                dispatch({
                  type: 'ADD_SKILL',
                  payload: {
                    id: `s-added-${Date.now()}`,
                    name: skillName,
                    issuer,
                    verified: true
                  }
                });
                dispatch({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    id: `n-${Date.now()}`,
                    text: `Skill credential added: ${skillName}. Score updated by +4.`,
                    read: false,
                    date: "Just now"
                  }
                });
              }
            }}
            className="text-[10px] bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
          >
            <span>Add Certificate Link</span>
          </button>
        </div>

        <div className="space-y-2">
          {dashboardState.skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-samridhi-surface border border-samridhi-border/60 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎓</span>
                <div>
                  <h5 className="text-xs font-bold text-samridhi-textPrimary">{skill.name}</h5>
                  <p className="text-[10px] text-samridhi-textMuted">{skill.issuer}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'TOGGLE_SKILL_VERIFICATION', payload: skill.id });
                  dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                      id: `n-${Date.now()}`,
                      text: `Toggled verification for: ${skill.name}. Credibility indexes recalculated.`,
                      read: false,
                      date: "Just now"
                    }
                  });
                }}
                className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                  skill.verified 
                    ? 'bg-samridhi-success/15 border border-samridhi-success/30 text-samridhi-success' 
                    : 'bg-samridhi-bg border border-samridhi-border text-samridhi-textMuted hover:text-samridhi-textPrimary'
                }`}
              >
                {skill.verified ? 'Verified (+4)' : 'Verify Document'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
