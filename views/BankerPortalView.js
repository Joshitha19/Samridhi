// Banker Portal Sign In / Sign Up View Component for Samridhi
// Exposes BankerPortalView globally

window.BankerPortalView = ({ setPage, onBankerSignIn, onBankerSignUp }) => {
  const { useState } = React;
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [employeeId, setEmployeeId] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [designation, setDesignation] = useState('Credit Risk Underwriter');
  const [licenseId, setLicenseId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!name || !email || !password || !confirmPassword || !bankName || !employeeId || !ifscCode || !designation || !licenseId) {
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
      if (!/^[A-Z0-9-]{4,15}$/i.test(employeeId)) {
        setError('Employee ID must be alphanumeric and between 4 to 15 characters.');
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode)) {
        setError('IFSC code must be a valid 11-character Indian banking format (e.g. SBIN0000123).');
        return;
      }
      if (!/^[A-Z0-9-]{5,20}$/i.test(licenseId)) {
        setError('Regulatory License ID must be alphanumeric and between 5 to 20 characters.');
        return;
      }
      onBankerSignUp(name, email, bankName, password, {
        employeeId: employeeId.toUpperCase(),
        ifscCode: ifscCode.toUpperCase(),
        designation: designation,
        licenseId: licenseId.toUpperCase()
      });
    } else {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      onBankerSignIn(email, password);
    }
  };

  const handleDemoLogin = () => {
    onBankerSignIn('banker@samridhi.in', 'password123');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0A160F] via-[#090b10] to-[#090b10]">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/[0.04] border-glow-secondary relative overflow-hidden animate-fade-in">
        {/* Header background accents */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-samridhi-success to-samridhi-secondary"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-success/5 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-samridhi-success to-samridhi-secondary flex items-center justify-center shadow-lg shadow-samridhi-success/20 mb-4">
            <span className="text-[#090b10] font-black text-xl">B</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider text-glow-secondary">
            {isRegistering ? 'Banker Registration' : 'Banker Portal'}
          </h2>
          <p className="text-xs text-samridhi-textMuted mt-1 font-semibold">
            {isRegistering ? 'Register as an institutional credit evaluator' : 'Access the alternative credit underwriting terminal'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-samridhi-danger/10 border border-samridhi-danger/30 rounded-xl text-xs font-bold text-samridhi-danger flex items-center space-x-2 font-semibold">
            <Icons.Lock className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
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
                  placeholder="e.g. Officer Rohan Mehra"
                  className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Official Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                <Icons.Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@bank.in"
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 px-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider font-semibold">
                {isRegistering ? 'Confirm' : 'Secured Code'}
              </label>
              <input
                type="password"
                value={isRegistering ? confirmPassword : '••••••••'}
                disabled={!isRegistering}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isRegistering ? '••••••••' : 'Read-only'}
                className="w-full bg-white/[0.02] border border-white/[0.08] disabled:opacity-40 text-sm rounded-xl py-3 px-4 text-white focus:outline-none transition-all focus:border-samridhi-success"
              />
            </div>
          </div>

          {isRegistering && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Employee ID / Staff Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                      <Icons.Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP-10492"
                      className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Branch IFSC Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                      <Icons.CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      placeholder="e.g. SBIN0000123"
                      maxLength={11}
                      className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Designation / Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                      <Icons.Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Credit Risk Analyst"
                      className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Regulatory License ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samridhi-textMuted">
                      <Icons.ShieldAlert className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={licenseId}
                      onChange={(e) => setLicenseId(e.target.value)}
                      placeholder="e.g. RBI-SBI-9847"
                      className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-samridhi-textMuted/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-samridhi-textMuted uppercase tracking-wider">Associated Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-success/30 focus:border-samridhi-success text-sm rounded-xl py-3 px-4 text-white focus:outline-none transition-all"
                >
                  <option value="State Bank of India" className="bg-samridhi-bg text-white">State Bank of India (SBI)</option>
                  <option value="HDFC Bank" className="bg-samridhi-bg text-white">HDFC Bank</option>
                  <option value="ICICI Bank" className="bg-samridhi-bg text-white">ICICI Bank</option>
                  <option value="Axis Bank" className="bg-samridhi-bg text-white">Axis Bank</option>
                  <option value="Punjab National Bank" className="bg-samridhi-bg text-white">Punjab National Bank (PNB)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-samridhi-success hover:bg-samridhi-success/90 text-[#090b10] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-samridhi-success/10 transition-all duration-300 flex items-center justify-center space-x-2 mt-6 active:scale-95 text-sm"
          >
            <span>{isRegistering ? 'Register Banker' : 'Access Dashboard'}</span>
            <Icons.ChevronRight className="w-4 h-4 text-[#090b10]" />
          </button>
        </form>

        <button
          onClick={handleDemoLogin}
          className="w-full mt-3 py-3 bg-white/[0.02] border border-samridhi-success/45 hover:border-samridhi-success text-samridhi-success font-black rounded-xl shadow-lg hover:bg-samridhi-success/5 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
        >
          <span>One-Click Banker Demo Login</span>
        </button>

        <div className="mt-8 text-center text-xs border-t border-white/[0.04] pt-4">
          <span className="text-samridhi-textMuted font-semibold">
            {isRegistering ? 'Already have a banker account? ' : 'Need to register a bank account? '}
          </span>
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="font-bold text-samridhi-secondary hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            {isRegistering ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
