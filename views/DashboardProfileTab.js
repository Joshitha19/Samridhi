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
  const { useState } = React;
  
  // Local state for inline certification form
  const [showAddForm, setShowAddForm] = useState(false);
  const [certName, setCertName] = useState('');
  const [issuingBody, setIssuingBody] = useState('');
  const [certYear, setCertYear] = useState('2026');

  // Toggle Preferences state
  const [scoreAlerts, setScoreAlerts] = useState(true);
  const [offerAlerts, setOfferAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);

  // Linked accounts state
  const [linkedUpi, setLinkedUpi] = useState(true);
  const [linkedBank, setLinkedBank] = useState(true);
  const [linkedLinkedIn, setLinkedLinkedIn] = useState(false);
  const [linkedCoursera, setLinkedCoursera] = useState(true);

  // Profile fields editing
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editIncome, setEditIncome] = useState(45000);
  const [editLocation, setEditLocation] = useState('Bangalore, India');

  const handleAddCertSubmit = (e) => {
    e.preventDefault();
    if (!certName || !issuingBody) return;

    dispatch({
      type: 'ADD_SKILL',
      payload: {
        id: `s-added-${Date.now()}`,
        name: certName,
        issuer: `${issuingBody} (${certYear})`,
        verified: true
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        text: `New credential added: ${certName} from ${issuingBody}. Credit capacity recalculated.`,
        read: false,
        date: "Just now"
      }
    });

    // Reset
    setCertName('');
    setIssuingBody('');
    setShowAddForm(false);
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editName
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-xs">
      
      {/* PROFILE HEADER CARD */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg relative">
        {/* Edit Profile / Save button */}
        <div className="absolute top-6 right-6">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-3 py-1.5 bg-samridhi-success text-samridhi-bg font-extrabold rounded-lg text-[10px] uppercase hover:opacity-90 transition-opacity"
            >
              Save Details
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-samridhi-surface border border-samridhi-border text-samridhi-textPrimary hover:border-samridhi-primary/40 font-bold rounded-lg text-[10px] uppercase transition-all flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar (80px Gradient) */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-black text-2xl text-samridhi-bg shadow-lg">
            {user.name ? user.name[0] : 'U'}
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1 w-full">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.toUpperCase())}
                  className="bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary font-extrabold text-lg px-2.5 py-1 rounded focus:border-samridhi-primary focus:outline-none"
                />
              ) : (
                <h2 className="text-lg font-black text-samridhi-textPrimary">{user.name}</h2>
              )}
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-[10px] text-samridhi-textMuted font-bold">{user.email}</span>
                <span className="px-2 py-0.5 bg-samridhi-secondary/15 border border-samridhi-secondary/35 text-samridhi-secondary rounded text-[9px] font-black uppercase">
                  {user.type}
                </span>
              </div>
            </div>

            {/* 2x2 Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-samridhi-border/30 text-left text-xs font-semibold">
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold">Monthly Income</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editIncome}
                    onChange={(e) => setEditIncome(parseInt(e.target.value) || 0)}
                    className="bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary w-28 px-2 py-0.5 rounded text-xs"
                  />
                ) : (
                  <span className="text-samridhi-textPrimary font-bold">₹{editIncome.toLocaleString()}</span>
                )}
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary w-36 px-2 py-0.5 rounded text-xs"
                  />
                ) : (
                  <span className="text-samridhi-textPrimary font-bold">{editLocation}</span>
                )}
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold">Account Since</span>
                <span className="text-samridhi-textPrimary font-bold">Jan 2026</span>
              </div>
              <div>
                <span className="block text-[9px] text-samridhi-textMuted uppercase font-bold">PAN</span>
                <span className="text-samridhi-success font-bold flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS & CERTIFICATIONS CARD */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-samridhi-textPrimary uppercase tracking-wider">
            Verified Skills & Certifications
          </h3>
          <span className="text-[10px] text-samridhi-textMuted font-bold uppercase block mt-0.5">
            Skill Credibility Index: 14/20
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skill List */}
          {dashboardState.skills.map((skill) => (
            <div key={skill.id} className="bg-samridhi-surface border border-samridhi-border p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-samridhi-primary/10 flex items-center justify-center text-samridhi-primary">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-samridhi-textPrimary">{skill.name}</h4>
                  <p className="text-[9px] text-samridhi-textMuted mt-0.5 truncate max-w-[150px]">{skill.issuer}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-samridhi-success uppercase flex items-center space-x-0.5 shrink-0 bg-samridhi-success/5 border border-samridhi-success/20 px-2 py-0.5 rounded-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified</span>
              </div>
            </div>
          ))}

          {/* Add Certification Card (Dashed) */}
          {showAddForm ? (
            <form onSubmit={handleAddCertSubmit} className="bg-samridhi-surface border-2 border-dashed border-samridhi-primary/40 p-4 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Cert Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud Practitioner"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className="w-full bg-samridhi-bg border border-samridhi-border rounded p-1.5 focus:border-samridhi-primary focus:outline-none font-bold text-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Issuing Body</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coursera"
                    value={issuingBody}
                    onChange={(e) => setIssuingBody(e.target.value)}
                    className="w-full bg-samridhi-bg border border-samridhi-border rounded p-1.5 focus:border-samridhi-primary focus:outline-none font-bold text-[10px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Year</label>
                  <select
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    className="w-full bg-samridhi-bg border border-samridhi-border rounded p-1.5 text-samridhi-textPrimary focus:outline-none text-[10px] font-bold"
                  >
                    {['2026', '2025', '2024', '2023', '2022', '2021'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-samridhi-textMuted uppercase mb-0.5">Upload File</label>
                  <input
                    type="file"
                    className="w-full text-[9px] text-samridhi-textMuted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-bold file:bg-samridhi-border file:text-samridhi-textPrimary cursor-pointer focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-samridhi-border/40">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 bg-samridhi-bg border border-samridhi-border text-samridhi-textMuted rounded text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-samridhi-primary text-white rounded text-[10px] font-bold shadow"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <div 
              onClick={() => setShowAddForm(true)}
              className="bg-samridhi-surface/30 border-2 border-dashed border-samridhi-border hover:border-samridhi-primary/45 transition-colors p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer text-center group"
            >
              <div className="w-7 h-7 rounded-full bg-samridhi-border group-hover:bg-samridhi-primary/10 transition-colors flex items-center justify-center mb-2 text-samridhi-textMuted group-hover:text-samridhi-primary font-black">
                +
              </div>
              <span className="font-extrabold text-xs text-samridhi-textPrimary">Add Certification</span>
              <p className="text-[10px] text-samridhi-textMuted mt-1">Upload verified files to boost your trust index</p>
            </div>
          )}
        </div>
      </div>

      {/* LINKED ACCOUNTS CARD */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-samridhi-textPrimary uppercase tracking-wider">
            Linked Telemetry Accounts
          </h3>
          <p className="text-[10px] text-samridhi-textMuted mt-0.5">Toggle live sync endpoints to adjust underwriting signals.</p>
        </div>

        <div className="space-y-3.5">
          {/* UPI */}
          <div className="flex items-center justify-between p-3.5 bg-samridhi-surface border border-samridhi-border/60 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-secondary/10 flex items-center justify-center text-samridhi-secondary">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-samridhi-textPrimary">UPI / PhonePe Aggregator</h4>
                <span className="text-[9px] font-bold text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedUpi(!linkedUpi)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedUpi ? 'bg-samridhi-success' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedUpi ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Bank */}
          <div className="flex items-center justify-between p-3.5 bg-samridhi-surface border border-samridhi-border/60 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-success/10 flex items-center justify-center text-samridhi-success">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-samridhi-textPrimary">Bank Statement Parser</h4>
                <span className="text-[9px] font-bold text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedBank(!linkedBank)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedBank ? 'bg-samridhi-success' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedBank ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center justify-between p-3.5 bg-samridhi-surface border border-samridhi-border/60 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-primary/10 flex items-center justify-center text-samridhi-primary">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-samridhi-textPrimary">LinkedIn Professional profile</h4>
                <span className="text-[9px] font-bold text-samridhi-textMuted">Not Connected</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setLinkedLinkedIn(!linkedLinkedIn)}
                className="text-[9px] font-extrabold uppercase border border-samridhi-border px-2.5 py-1 rounded-lg hover:border-samridhi-primary hover:text-samridhi-primary transition-colors"
              >
                Connect
              </button>
              <button
                onClick={() => setLinkedLinkedIn(!linkedLinkedIn)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                  linkedLinkedIn ? 'bg-samridhi-success' : 'bg-samridhi-border'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedLinkedIn ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {/* Coursera */}
          <div className="flex items-center justify-between p-3.5 bg-samridhi-surface border border-samridhi-border/60 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-samridhi-warning/10 flex items-center justify-center text-samridhi-warning">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-samridhi-textPrimary">Coursera / Udemy certifications</h4>
                <span className="text-[9px] font-bold text-samridhi-success">Connected</span>
              </div>
            </div>
            
            <button
              onClick={() => setLinkedCoursera(!linkedCoursera)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                linkedCoursera ? 'bg-samridhi-success' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${linkedCoursera ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-sm font-extrabold text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-2">
          Notification Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="flex items-center justify-between p-3 bg-samridhi-surface rounded-xl">
            <span className="font-bold text-xs text-samridhi-textPrimary">Score change alerts</span>
            <button
              onClick={() => setScoreAlerts(!scoreAlerts)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                scoreAlerts ? 'bg-samridhi-primary' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${scoreAlerts ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-samridhi-surface rounded-xl">
            <span className="font-bold text-xs text-samridhi-textPrimary">Loan offer alerts</span>
            <button
              onClick={() => setOfferAlerts(!offerAlerts)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                offerAlerts ? 'bg-samridhi-primary' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${offerAlerts ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-samridhi-surface rounded-xl">
            <span className="font-bold text-xs text-samridhi-textPrimary">Payment reminders</span>
            <button
              onClick={() => setPaymentReminders(!paymentReminders)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                paymentReminders ? 'bg-samridhi-primary' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${paymentReminders ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-samridhi-surface rounded-xl">
            <span className="font-bold text-xs text-samridhi-textPrimary">Monthly report digest</span>
            <button
              onClick={() => setMonthlyReport(!monthlyReport)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                monthlyReport ? 'bg-samridhi-primary' : 'bg-samridhi-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${monthlyReport ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-samridhi-card border-2 border-samridhi-danger/35 p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-sm font-extrabold text-samridhi-danger uppercase tracking-wider">
          Danger Zone
        </h3>
        <p className="text-[10px] text-samridhi-textMuted leading-relaxed">
          Critical operations. Once executed, details relating to alternative indexes, linked accounts, and transactions will be deleted permanently.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button 
            onClick={() => alert("Clear all data requested. Confirm details via support channels.")}
            className="px-4 py-2 border border-samridhi-danger text-samridhi-danger hover:bg-samridhi-danger/10 transition-colors font-extrabold rounded-xl text-[10px] uppercase"
          >
            Clear All Data
          </button>
          <button
            onClick={() => alert("Delete account process initiated. Authentication will be disabled.")}
            className="px-4 py-2 border border-samridhi-danger text-samridhi-danger hover:bg-samridhi-danger/10 transition-colors font-extrabold rounded-xl text-[10px] uppercase"
          >
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
};
