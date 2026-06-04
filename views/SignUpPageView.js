// Sign Up View Component for Samridhi
// Exposes SignUpPageView globally

window.SignUpPageView = ({ setPage, onSignUp }) => {
  const { useState } = React;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Freelancer');
  const [upiVpa, setUpiVpa] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    onSignUp(name, email, userType, upiVpa, password);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#131124] via-samridhi-bg to-samridhi-bg">
      <div className="w-full max-w-md bg-samridhi-card border border-samridhi-border p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Header background accents */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-samridhi-primary to-samridhi-secondary"></div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20 mb-4">
            <span className="text-samridhi-bg font-extrabold text-xl">S</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create Your Account</h2>
          <p className="text-xs text-samridhi-textMuted mt-1">Join the 190M credit-invisible Indians building trust</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2 animate-pulse">
            <Icons.Lock className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                <Icons.User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samridhi Sharma"
                className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3.5 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

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
                className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3.5 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 pl-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Confirm</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 pl-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">User Profile Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3 px-4 text-samridhi-textPrimary focus:outline-none transition-colors"
            >
              <option value="Salaried">Salaried Employee</option>
              <option value="Freelancer">Freelancer / Gig Contractor</option>
              <option value="Student">Student (Vocational/Tech)</option>
              <option value="Entrepreneur">Micro-Entrepreneur / Merchant</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">UPI ID (VPA) for Cashflow Sync</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted font-bold text-xs">
                ⚡
              </div>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                placeholder="e.g. yourname@okaxis"
                className="w-full bg-samridhi-bg border border-samridhi-border focus:border-samridhi-primary focus:ring-1 focus:ring-samridhi-primary text-sm rounded-xl py-3.5 pl-10 pr-4 text-samridhi-textPrimary placeholder:text-samridhi-textMuted/50 focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-samridhi-textMuted leading-relaxed">Optional. Connects your transaction cashflow to calculate alternate credibility score.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95"
          >
            <span>Register & Calculate Score</span>
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-samridhi-textMuted">Already have an account? </span>
          <button 
            onClick={() => setPage('signin')}
            className="font-bold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
