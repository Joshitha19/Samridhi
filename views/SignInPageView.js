// Sign In View Component for Samridhi
// Exposes SignInPageView globally

window.SignInPageView = ({ setPage, onSignIn }) => {
  const { useState } = React;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    onSignIn(email, password);
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
            <span className="bg-samridhi-card px-3 text-samridhi-textMuted font-bold">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => {
            // Mock OAuth Integration
            onSignIn('demo.freelancer@samridhi.in', 'password123');
          }}
          className="w-full py-2.5 bg-samridhi-surface hover:bg-samridhi-bg border border-samridhi-border text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2.5 hover:text-samridhi-secondary"
        >
          {/* Google G logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 1 12 1 7.37 1 3.4 3.65 1.54 7.5l3.85 2.99C6.27 7.21 8.87 5.04 12 5.04z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.46-1.1 2.7-2.34 3.53l3.65 2.83c2.14-1.97 3.74-4.87 3.74-8.46z" />
            <path fill="#FBBC05" d="M5.39 14.8c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.54 7.21C.56 9.17 0 11.33 0 13.5s.56 4.33 1.54 6.29l3.85-2.99z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.1.74-2.5 1.18-4.31 1.18-3.13 0-5.73-2.17-6.68-5.45l-3.85 2.99C3.4 20.35 7.37 23 12 23z" />
          </svg>
          <span>Single Sign-On (Sandbox Dev)</span>
        </button>

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
