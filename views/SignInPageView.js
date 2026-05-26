// Sign In View Component for Samridhi
// Exposes SignInPageView globally

window.SignInPageView = ({ setPage, onSignIn }) => {
  const { useState } = React;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Freelancer');
  const [error, setError] = useState('');

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

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#131124] via-samridhi-bg to-samridhi-bg">
      <div className="w-full max-w-md bg-samridhi-card border border-samridhi-border p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Header background accents */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-samridhi-primary to-samridhi-secondary"></div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-primary to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-primary/20 mb-4">
            <span className="text-samridhi-bg font-extrabold text-xl">S</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Sign In to Samridhi</h2>
          <p className="text-xs text-samridhi-textMuted mt-1">Unlock non-traditional loan rates powered by AI</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2">
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
              <a href="#" className="text-[11px] font-semibold text-samridhi-secondary hover:underline">Forgot password?</a>
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
            className="w-full py-3 bg-samridhi-primary hover:bg-samridhi-primary/95 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95"
          >
            <span>Sign In</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-samridhi-border/60"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-samridhi-card px-3 text-samridhi-textMuted font-bold">Sandbox Dev Quick Sign-In</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSignIn('demo.student@samridhi.in', 'password123', 'Student')}
            className="py-2 px-3 bg-samridhi-surface hover:bg-samridhi-primary/10 border border-samridhi-border text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 hover:text-samridhi-secondary"
          >
            <span>🎓 Student</span>
          </button>
          <button
            onClick={() => onSignIn('demo.freelancer@samridhi.in', 'password123', 'Freelancer')}
            className="py-2 px-3 bg-samridhi-surface hover:bg-samridhi-primary/10 border border-samridhi-border text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 hover:text-samridhi-secondary"
          >
            <span>💻 Freelancer</span>
          </button>
          <button
            onClick={() => onSignIn('demo.entrepreneur@samridhi.in', 'password123', 'Entrepreneur')}
            className="py-2 px-3 bg-samridhi-surface hover:bg-samridhi-primary/10 border border-samridhi-border text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 hover:text-samridhi-secondary"
          >
            <span>🛒 Merchant</span>
          </button>
          <button
            onClick={() => onSignIn('demo.salaried@samridhi.in', 'password123', 'Salaried')}
            className="py-2 px-3 bg-samridhi-surface hover:bg-samridhi-primary/10 border border-samridhi-border text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 hover:text-samridhi-secondary"
          >
            <span>💼 Salaried</span>
          </button>
        </div>

        <div className="mt-8 text-center text-xs">
          <span className="text-samridhi-textMuted">Don't have an account? </span>
          <button 
            onClick={() => setPage('signup')}
            className="font-bold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
