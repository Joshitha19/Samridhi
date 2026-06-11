// views/DashboardView.js
// Main Premium Dashboard View shell for Samridhi
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
  kycCameraVerified,
  setKycCameraVerified,
  bankStatementUploaded,
  setBankStatementUploaded,
  voiceNavigationActive,
  setVoiceNavigationActive,
  whatIfRepayActive,
  setWhatIfRepayActive,
  whatIfLinkGithub,
  setWhatIfLinkGithub,
  whatIfNewCert,
  setWhatIfNewCert,
  whatIfConsistentUpi,
  setWhatIfConsistentUpi
}) => {
  const { useState, useEffect } = React;

  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your Samridhi AI assistant. Ask me anything about your credit score, loan eligibility, or how to improve your score." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const unreadCount = dashboardState.notifications.filter(n => !n.read).length;

  const handleReadNotifications = () => {
    dispatch({ type: 'READ_ALL_NOTIFICATIONS' });
    setShowNotifications(false);
  };

  // Smart mock responder mimicking Anthropic API behavior locally
  const generateBotResponse = (text) => {
    const query = text.toLowerCase();
    
    if (query.includes('score') || query.includes('rating') || query.includes('credit')) {
      return `Your current score is ${calculatedScore}/100 (LOW RISK). This alternative rating is based on your monthly income of ₹45,000, 4 verified skill credentials, and 38 UPI transactions this month. Pay utility bills via UPI and maintain credit age to boost it further.`;
    }
    if (query.includes('improve') || query.includes('increase') || query.includes('boost') || query.includes('raise')) {
      return `To improve your score: 1. Add 2 more verified skills certificates (+6 points). 2. Pay monthly utility and electricity bills via UPI (+4 points). 3. Accumulate 6 more months of transactional history (+3 points). Each action will automatically rebuild your underwriting profile.`;
    }
    if (query.includes('loan') || query.includes('recommend') || query.includes('apply') || query.includes('eligible')) {
      return `Based on your low risk tier, you qualify for our Personal Loan (₹2,50,000 at 11.5% p.a., EMI ₹5,847/mo) which has a 95% AI Match Score. You also qualify for an Education Loan (₹5,00,000) and Business Micro Loan (₹1,00,000). Apply directly inside the 'Apply for Loan' tab.`;
    }
    if (query.includes('interest') || query.includes('rate') || query.includes('emi')) {
      return `Matched interest rates start at 9.8% p.a. for Education Loans, 11.5% p.a. for Personal Loans, and 13.2% p.a. for Business Micro Loans. EMIs are calculated dynamically based on tenure and principal. Check the 'Recommendations' tab for split estimates.`;
    }
    if (query.includes('income') || query.includes('salary')) {
      return `Your verified monthly income is ₹45,000/mo. This steady cashflow establishes a solid financial buffer, lowering credit default risk and securing approval limits up to ₹5,00,000.`;
    }
    if (query.includes('skills') || query.includes('certifications') || query.includes('certs')) {
      return `You have 4 verified credentials (Python, Data Analysis, AWS, Freelancing) active on your profile. Adding 2 more verified certs increases your Skill Credibility Index by +6 score points.`;
    }
    
    return `Hello! I am Samridhi AI, your financial underwriting assistant. Your score is ${calculatedScore}/100 (LOW RISK), with ₹45,000/mo income and 4 verified skills. Ask me how to improve your score, check loan eligibility, or view interest rates.`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);

    // Simulate response delay and typing indicator
    setTimeout(() => {
      const response = generateBotResponse(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#020204] min-h-screen relative font-sans">
      
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Sidebar Panel */}
          <aside className="relative flex flex-col w-72 bg-[#07070C] border-r border-white/[0.05] h-full z-50 animate-fade-in shadow-2xl">
            {/* Profile Card Header */}
            <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-black text-xs text-samridhi-bg shadow-md">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-xs text-white tracking-wide truncate">{user.name || 'GUEST USER'}</h4>
                  <p className="text-[9px] text-samridhi-textMuted font-mono truncate">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-samridhi-textMuted hover:text-white bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {[
                { id: 'overview', name: 'Overview', icon: <Icons.Home /> },
                { id: 'apply', name: 'Apply for Loan', icon: <Icons.Apply /> },
                { id: 'score', name: 'My Score Factors', icon: <Icons.Score /> },
                { id: 'simulator', name: 'Score Simulator', icon: <Icons.Simulator /> },
                { id: 'transactions', name: 'Transaction Analysis', icon: <Icons.Transactions /> },
                { id: 'inventory', name: 'Asset Ledger', icon: <Icons.Inventory /> },
                { id: 'recommendations', name: 'Loan Recommendations', icon: <Icons.Offers /> },
                { id: 'profile', name: 'Profile Settings', icon: <Icons.User /> },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                      setShowNotifications(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-samridhi-primary/10 via-samridhi-primary/5 to-transparent border-l-2 border-samridhi-primary text-white text-glow-primary'
                        : 'text-samridhi-textMuted hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    <span className={isActive ? 'text-samridhi-primary' : 'text-samridhi-textMuted'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout Footer button */}
            <div className="p-4 border-t border-white/[0.03]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-samridhi-danger hover:bg-samridhi-danger/10 transition-all border border-transparent hover:border-samridhi-danger/25"
              >
                <Icons.Logout />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-black/40 backdrop-blur-3xl border-r border-white/[0.02] flex-col justify-between shrink-0 relative z-20">
        <div>
          {/* Profile Card Header */}
          <div className="p-6 border-b border-white/[0.03]">
            <div className="flex items-center space-x-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-black text-sm text-samridhi-bg shadow-[0_0_15px_rgba(213,0,249,0.25)]">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-white tracking-wide truncate">{user.name || 'GUEST USER'}</h4>
                <p className="text-[10px] text-samridhi-textMuted tracking-normal font-mono truncate">{user.email}</p>
              </div>
            </div>
            
            {/* User Type Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/[0.03] border border-white/[0.06] text-samridhi-secondary rounded-lg text-[9px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-samridhi-secondary animate-pulse"></span>
              <span>{user.type}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', name: 'Overview', icon: <Icons.Home /> },
              { id: 'apply', name: 'Apply for Loan', icon: <Icons.Apply /> },
              { id: 'score', name: 'My Score Factors', icon: <Icons.Score /> },
              { id: 'simulator', name: 'Score Simulator', icon: <Icons.Simulator /> },
              { id: 'transactions', name: 'Transaction Analysis', icon: <Icons.Transactions /> },
              { id: 'inventory', name: 'Asset Ledger', icon: <Icons.Inventory /> },
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-samridhi-primary/10 via-samridhi-primary/5 to-transparent border-l-2 border-samridhi-primary text-white text-glow-primary shadow-[inset_1px_0_0_rgba(255,255,255,0.03)]'
                      : 'text-samridhi-textMuted hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
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
        <div className="p-4 border-t border-white/[0.03]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-samridhi-danger hover:bg-samridhi-danger/10 transition-all border border-transparent hover:border-samridhi-danger/25"
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 h-16 bg-[#020204]/40 backdrop-blur-md border-b border-white/[0.02] px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger menu button for mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white hover:border-samridhi-primary focus:outline-none transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-samridhi-textMuted">
              Terminal &gt; <span className="text-white font-black">{activeTab}</span>
            </h2>
          </div>

          {/* Notification bell and utilities */}
          <div className="flex items-center space-x-4 relative">
            
            {/* Voice Control Toggle */}
            <div className="flex items-center space-x-2 bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 rounded-xl">
              <span className="text-[9px] uppercase font-black text-samridhi-textMuted tracking-wider">Voice Control</span>
              <button
                onClick={() => setVoiceNavigationActive(!voiceNavigationActive)}
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                  voiceNavigationActive ? 'bg-samridhi-primary' : 'bg-white/[0.08]'
                }`}
                title="Toggle continuous voice commands navigation"
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform ${voiceNavigationActive ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Score summary on header */}
            <div className="hidden sm:flex items-center space-x-2 bg-white/[0.02] border border-white/[0.05] px-3.5 py-1.5 rounded-xl">
              <span className="text-[9px] uppercase font-black text-samridhi-textMuted tracking-wider">Index score</span>
              <span className="text-xs font-black text-samridhi-secondary font-mono">{calculatedScore}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-samridhi-textPrimary hover:border-samridhi-primary transition-all relative"
              >
                <Icons.Bell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-samridhi-danger animate-ping"></span>
                )}
              </button>

              {/* NOTIFICATIONS DROPDOWN PANEL */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-samridhi-card/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl z-30 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-samridhi-textPrimary tracking-wider">System Logs ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleReadNotifications}
                        className="text-[9px] font-bold text-samridhi-secondary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                    {dashboardState.notifications.length === 0 ? (
                      <div className="p-4 text-center text-[10px] text-samridhi-textMuted">No notifications found</div>
                    ) : (
                      dashboardState.notifications.map((n) => (
                        <div key={n.id} className={`p-4 flex flex-col space-y-1 text-[11px] hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-samridhi-primary/5' : ''}`}>
                          <p className="text-samridhi-textPrimary leading-relaxed">{n.text}</p>
                          <span className="text-[8px] font-extrabold text-samridhi-textMuted uppercase mt-1 tracking-wider font-mono">{n.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-white/[0.05] bg-white/[0.01] text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[9px] font-bold text-samridhi-textMuted hover:text-samridhi-textPrimary py-1 w-full uppercase tracking-wider"
                    >
                      Close Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center font-extrabold text-xs text-samridhi-bg uppercase shadow-md">
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
              setUser={setUser}
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
            <div className="max-w-3xl mx-auto bg-samridhi-card/60 border border-white/[0.04] p-8 rounded-3xl space-y-8 animate-fade-in shadow-xl backdrop-blur-md">
              <div className="border-b border-white/[0.04] pb-4">
                <h2 className="text-lg font-black text-white tracking-wide">Apply for Smart Micro-Credit</h2>
                <p className="text-xs text-samridhi-textMuted mt-1 leading-relaxed">Our AI evaluates your alternative metrics to generate instant interest rates and terms.</p>
              </div>

              {/* Interactive Loan Apply Wizard */}
              <LoanWizard 
                calculatedScore={calculatedScore} 
                dispatch={dispatch} 
                user={user} 
                setActiveTab={setActiveTab} 
                voiceNavigationActive={voiceNavigationActive}
                setVoiceNavigationActive={setVoiceNavigationActive}
              />
            </div>
          )}

          {/* TAB 3: MY SCORE FACTORS */}
          {activeTab === 'score' && (
            <DashboardScoreTab
              calculatedScore={calculatedScore}
              dashboardState={dashboardState}
              user={user}
              setUser={setUser}
              aadhaarVerified={aadhaarVerified}
              panVerified={panVerified}
              upiLinked={upiLinked}
              upiVerified={upiVerified}
              setUpiVerified={setUpiVerified}
              dispatch={dispatch}
              setAadhaarVerified={setAadhaarVerified}
              setPanVerified={setPanVerified}
              setUpiLinked={setUpiLinked}
              setActiveTab={setActiveTab}
              whatIfRepayActive={whatIfRepayActive}
              setWhatIfRepayActive={setWhatIfRepayActive}
              whatIfLinkGithub={whatIfLinkGithub}
              setWhatIfLinkGithub={setWhatIfLinkGithub}
              whatIfNewCert={whatIfNewCert}
              setWhatIfNewCert={setWhatIfNewCert}
              whatIfConsistentUpi={whatIfConsistentUpi}
              setWhatIfConsistentUpi={setWhatIfConsistentUpi}
              kycCameraVerified={kycCameraVerified}
              bankStatementUploaded={bankStatementUploaded}
            />
          )}

          {/* TAB: SCORE SIMULATOR */}
          {activeTab === 'simulator' && (
            <DashboardSimulatorTab 
              calculatedScore={calculatedScore}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 4: TRANSACTION ANALYSIS */}
          {activeTab === 'transactions' && (
            <DashboardTransactionsTab 
              dashboardState={dashboardState} 
              dispatch={dispatch}
              bankStatementUploaded={bankStatementUploaded}
              setBankStatementUploaded={setBankStatementUploaded}
              calculatedScore={calculatedScore}
            />
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
              aadhaarVerified={aadhaarVerified}
              panVerified={panVerified}
              upiLinked={upiLinked}
              upiVerified={upiVerified}
              dashboardState={dashboardState}
              kycCameraVerified={kycCameraVerified}
              bankStatementUploaded={bankStatementUploaded}
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
              kycCameraVerified={kycCameraVerified}
              setKycCameraVerified={setKycCameraVerified}
            />
          )}

        </div>
      </div>

      {/* FLOATING AI CHAT ASSISTANT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
        {chatOpen && (
          <div className="w-85 h-[430px] bg-black/60 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col mb-4 animate-fade-in relative z-50">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-samridhi-success animate-pulse"></span>
                <span className="font-black text-xs text-white uppercase tracking-widest text-glow-success">Samridhi Copilot AI</span>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-samridhi-textMuted hover:text-white focus:outline-none transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[11px] leading-relaxed font-bold tracking-wide ${
                    msg.sender === 'user'
                      ? 'bg-white/[0.04] border border-white/[0.08] text-white rounded-tr-none'
                      : 'bg-gradient-to-r from-samridhi-primary to-samridhi-primary/80 text-white rounded-tl-none shadow-md shadow-samridhi-primary/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-samridhi-primary to-samridhi-primary/80 text-white rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center space-x-1.5 shadow-md shadow-samridhi-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Form */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 bg-white/[0.01] border-t border-white/[0.06] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask anything about underwriting..."
                className="flex-1 bg-white/[0.02] border border-white/[0.08] focus:border-samridhi-primary rounded-xl px-4 py-3 text-[11px] text-white placeholder:text-samridhi-textMuted/45 focus:outline-none transition-colors font-medium font-sans"
              />
              <button
                type="submit"
                className="p-3 bg-samridhi-primary hover:bg-samridhi-primary/90 text-white rounded-xl focus:outline-none shadow-lg shadow-samridhi-primary/10 shrink-0 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center text-samridhi-bg hover:opacity-90 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          <svg className="w-5 h-5 text-samridhi-bg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

    </div>
  );
};
