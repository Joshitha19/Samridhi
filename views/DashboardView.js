// views/DashboardView.js
// Main Dashboard View shell for Samridhi
// Exposes DashboardView globally

window.DashboardView = ({
  user,
  setUser,
  activeTab,
  setActiveTab,
  calculatedScore,
  dashboardState,
  dispatch,
  handleLogout,
  showNotifications,
  setShowNotifications,
  aadhaarVerified,
  setAadhaarVerified,
  panVerified,
  setPanVerified,
  upiLinked,
  setUpiLinked,
  upiVerified,
  setUpiVerified,
  whatIfRepayActive,
  setWhatIfRepayActive,
  whatIfLinkGithub,
  setWhatIfLinkGithub,
  whatIfNewCert,
  setWhatIfNewCert,
  whatIfConsistentUpi,
  setWhatIfConsistentUpi
}) => {
  const unreadCount = dashboardState.notifications.filter(n => !n.read).length;

  const handleReadNotifications = () => {
    dispatch({ type: 'READ_ALL_NOTIFICATIONS' });
    setShowNotifications(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#08080C] min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-samridhi-surface border-r border-samridhi-border/60 flex flex-col justify-between shrink-0">
        <div>
          {/* Profile Card Header */}
          <div className="p-6 border-b border-samridhi-border/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-bold text-lg text-samridhi-bg shadow-md">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-sm text-samridhi-textPrimary truncate">{user.name || 'GUEST USER'}</h4>
                <p className="text-[10px] text-samridhi-textMuted truncate">{user.email}</p>
              </div>
            </div>
            
            {/* User Type Badge */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-samridhi-secondary/10 border border-samridhi-secondary/25 text-samridhi-secondary rounded-lg text-[10px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-samridhi-secondary"></span>
              <span>{user.type}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', name: 'Overview', icon: <Icons.Home /> },
              { id: 'apply', name: 'Apply for Loan', icon: <Icons.Apply /> },
              { id: 'score', name: 'My Score Factors', icon: <Icons.Score /> },
              { id: 'transactions', name: 'Transaction Analysis', icon: <Icons.Transactions /> },
              { id: 'inventory', name: 'Asset & Inventory', icon: <Icons.Inventory /> },
              { id: 'recommendations', name: 'Loan Recommendations', icon: <Icons.Offers /> },
              { id: 'profile', name: 'Profile Settings', icon: <Icons.User /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowNotifications(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-samridhi-primary/10 border-l-4 border-samridhi-primary text-samridhi-textPrimary'
                      : 'text-samridhi-textMuted hover:bg-samridhi-card/50 hover:text-samridhi-textPrimary border-l-4 border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-samridhi-primary' : 'text-samridhi-textMuted'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer button */}
        <div className="p-4 border-t border-samridhi-border/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold text-samridhi-danger hover:bg-samridhi-danger/10 transition-all border border-transparent hover:border-samridhi-danger/20"
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 h-16 bg-samridhi-surface border-b border-samridhi-border/60 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-samridhi-textMuted">
              Dashboard &gt; <span className="text-samridhi-textPrimary font-black">{activeTab}</span>
            </h2>
          </div>

          {/* Notification bell and utilities */}
          <div className="flex items-center space-x-4 relative">
            
            {/* Score summary on header */}
            <div className="hidden sm:flex items-center space-x-2 bg-samridhi-card border border-samridhi-border px-3.5 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-samridhi-textMuted tracking-wider">Index score</span>
              <span className="text-sm font-extrabold text-samridhi-secondary">{calculatedScore}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-samridhi-card border border-samridhi-border text-samridhi-textPrimary hover:border-samridhi-primary transition-all relative"
              >
                <Icons.Bell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-samridhi-danger animate-ping"></span>
                )}
              </button>

              {/* NOTIFICATIONS DROPDOWN PANEL */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-samridhi-card border border-samridhi-border rounded-2xl shadow-2xl z-30 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-samridhi-border flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-samridhi-textPrimary">System logs ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleReadNotifications}
                        className="text-[10px] font-bold text-samridhi-secondary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-samridhi-border/40">
                    {dashboardState.notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-samridhi-textMuted">No notifications found</div>
                    ) : (
                      dashboardState.notifications.map((n) => (
                        <div key={n.id} className={`p-4 flex flex-col space-y-1 text-xs hover:bg-samridhi-surface/50 transition-colors ${!n.read ? 'bg-samridhi-primary/5' : ''}`}>
                          <p className="text-samridhi-textPrimary leading-normal">{n.text}</p>
                          <span className="text-[9px] font-bold text-samridhi-textMuted uppercase mt-1">{n.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-samridhi-border bg-samridhi-surface/40 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] font-bold text-samridhi-textMuted hover:text-samridhi-textPrimary py-1 w-full"
                    >
                      Close Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-bold text-xs text-samridhi-bg uppercase">
              {user.name ? user.name[0] : 'U'}
            </div>
          </div>
        </header>

        {/* TAB CONTAINER CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <DashboardOverviewTab 
              user={user}
              calculatedScore={calculatedScore}
              dashboardState={dashboardState}
              dispatch={dispatch}
              setActiveTab={setActiveTab}
              upiLinked={upiLinked}
              upiVerified={upiVerified}
              setUpiVerified={setUpiVerified}
            />
          )}

          {/* TAB 2: APPLY FOR LOAN */}
          {activeTab === 'apply' && (
            <div className="max-w-3xl mx-auto bg-samridhi-card border border-samridhi-border p-8 rounded-3xl space-y-8 animate-fade-in">
              <div className="border-b border-samridhi-border/40 pb-4">
                <h2 className="text-xl font-extrabold text-samridhi-textPrimary">Apply for Smart Micro-Credit</h2>
                <p className="text-xs text-samridhi-textMuted mt-1">Our AI evaluates your alternative metrics to generate instant interest rates and terms.</p>
              </div>

              {/* Interactive Loan Apply Wizard */}
              <LoanWizard calculatedScore={calculatedScore} dispatch={dispatch} user={user} />
            </div>
          )}

          {/* TAB 3: MY SCORE FACTORS */}
          {activeTab === 'score' && (
            <DashboardScoreTab
              calculatedScore={calculatedScore}
              dashboardState={dashboardState}
              aadhaarVerified={aadhaarVerified}
              panVerified={panVerified}
              upiLinked={upiLinked}
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

          {/* TAB 4: TRANSACTION ANALYSIS */}
          {activeTab === 'transactions' && (
            <DashboardTransactionsTab dashboardState={dashboardState} />
          )}

          {/* TAB: ASSET & INVENTORY LEDGER */}
          {activeTab === 'inventory' && (
            <DashboardInventoryTab 
              user={user}
              dashboardState={dashboardState}
              dispatch={dispatch}
            />
          )}

          {/* TAB 5: LOAN RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <DashboardRecommendationsTab 
              user={user}
              calculatedScore={calculatedScore}
              dispatch={dispatch}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <DashboardProfileTab 
              user={user}
              setUser={setUser}
              dashboardState={dashboardState}
              dispatch={dispatch}
              aadhaarVerified={aadhaarVerified}
              setAadhaarVerified={setAadhaarVerified}
              panVerified={panVerified}
              setPanVerified={setPanVerified}
              upiLinked={upiLinked}
              setUpiLinked={setUpiLinked}
            />
          )}

        </div>
      </div>
    </div>
  );
};
