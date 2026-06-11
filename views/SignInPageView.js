// Sign In View Component for Samridhi
// Exposes SignInPageView globally

window.SignInPageView = ({ setPage, onSignIn, onSendOtp, onVerifyOtp }) => {
  const { useState } = React;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Freelancer');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Forgot password & OTP states
  const [viewState, setViewState] = useState('login'); // 'login', 'forgot', 'otp'
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isDemoOtp, setIsDemoOtp] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSignIn(email, password, userType);
  };

  const handleSendForgotPasswordOtp = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!forgotEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await onSendOtp(forgotEmail);
      setLoading(false);
      if (res && res.success) {
        setViewState('otp');
        setIsDemoOtp(res.isDemo);
        if (res.isDemo) {
          setDemoOtpCode(res.otp);
          // Show simulated alert so the developer/tester can see the code instantly
          alert(`Forgot Password: OTP code 6-digit verification code is: ${res.otp}`);
        } else {
          setSuccessMsg(`Secure 6-digit OTP code has been sent to your email inbox!`);
        }
      } else {
        setError(res ? res.error : 'Failed to send OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to request password reset OTP.');
    }
  };

  const handleVerifyForgotPasswordOtp = async (e) => {
    e.preventDefault();
    if (!otpToken || otpToken.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await onVerifyOtp(forgotEmail, otpToken, isDemoOtp, demoOtpCode);
      setLoading(false);
      if (res && res.success) {
        // Successful verification automatically logs in and navigates
      } else {
        setError(res ? res.error : 'Invalid OTP code.');
      }
    } catch (err) {
      setLoading(false);
      setError('OTP verification failed.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#081A0F] via-samridhi-bg to-samridhi-bg">
      <div className="w-full max-w-md bg-samridhi-card border border-samridhi-border p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Header background accents */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-samridhi-primary to-samridhi-secondary"></div>

        {viewState === 'login' && (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20 mb-4">
                <span className="text-samridhi-bg font-extrabold text-xl">₹</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Sign In to Samridhi</h2>
              <p className="text-xs text-samridhi-textMuted mt-1">Unlock non-traditional loan rates powered by AI</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2 animate-fade-in">
                <Icons.Lock className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                    <Icons.Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setViewState('forgot'); setError(''); setSuccessMsg(''); }}
                    className="text-[11px] font-semibold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                    <Icons.Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Select Earning Sector</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-colors"
                >
                  <option value="Freelancer">Freelancer / Gig Contractor</option>
                  <option value="Student">Student (Vocational/Tech)</option>
                  <option value="Entrepreneur">Micro-Entrepreneur / Merchant</option>
                  <option value="Salaried">Salaried Employee</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95 cursor-pointer"
              >
                <span>Sign In</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => onSignIn('demo@samridhi.in', 'password123', 'Entrepreneur')}
              className="w-full mt-3 py-3 bg-gradient-to-r from-samridhi-secondary to-samridhi-primary text-samridhi-bg font-extrabold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>One-Click Live Demo Sign-In</span>
            </button>
          </>
        )}

        {viewState === 'forgot' && (
          <>
            <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20 mb-4">
                <Icons.Lock className="w-5 h-5 text-samridhi-bg" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Reset Password</h2>
              <p className="text-xs text-samridhi-textMuted mt-1">We will send a 6-digit verification OTP to your email address</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2 animate-fade-in">
                <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendForgotPasswordOtp} className="space-y-5">
              <div className="flex flex-col space-y-1.5 animate-fade-in">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                    <Icons.Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="enter your registered email"
                    className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3.5 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Sending...' : 'Send Verification OTP'}</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => { setViewState('login'); setError(''); setSuccessMsg(''); }}
              className="w-full mt-4 py-2 bg-transparent text-samridhi-secondary hover:underline font-bold text-xs cursor-pointer focus:outline-none border-none"
            >
              Back to Login
            </button>
          </>
        )}

        {viewState === 'otp' && (
          <>
            <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20 mb-4">
                <Icons.ShieldAlert className="w-5 h-5 text-samridhi-bg" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Enter OTP Code</h2>
              <p className="text-xs text-samridhi-textMuted mt-1">A verification email was sent to <strong className="text-white">{forgotEmail}</strong></p>
            </div>

            {successMsg && (
              <div className="mb-4 p-3.5 bg-samridhi-success/10 border border-samridhi-success/30 rounded-xl text-xs font-bold text-samridhi-success flex items-center space-x-2 animate-fade-in">
                <Icons.CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2 animate-fade-in">
                <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isDemoOtp && (
              <div className="mb-4 p-3.5 bg-samridhi-warning/10 border border-samridhi-warning/30 rounded-xl text-xs font-mono text-samridhi-warning text-center animate-fade-in">
                <span>[Sandbox Bypass] Check browser console or use OTP: <strong>{demoOtpCode}</strong></span>
              </div>
            )}

            <form onSubmit={handleVerifyForgotPasswordOtp} className="space-y-5">
              <div className="flex flex-col space-y-1.5 animate-fade-in">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-lg tracking-[8px] font-mono font-bold text-center rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-samridhi-success hover:bg-samridhi-success/95 text-samridhi-bg font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Enter Dashboard'}</span>
                <Icons.Check className="w-4 h-4 text-samridhi-bg" />
              </button>
            </form>

            <div className="flex justify-between items-center mt-6 animate-fade-in">
              <button
                onClick={handleSendForgotPasswordOtp}
                className="text-xs font-bold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
              >
                Resend OTP
              </button>
              <button
                onClick={() => { setViewState('login'); setError(''); setSuccessMsg(''); }}
                className="text-xs font-bold text-samridhi-textMuted hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-xs">
          <span className="text-samridhi-textMuted">Don't have an account? </span>
          <button 
            onClick={() => setPage('signup')}
            className="font-bold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
