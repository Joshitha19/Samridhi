// Samridhi Explainable ML Underwriting & Scoring Engine
// Shared globally via the window object

window.calculateCredibilityScore = (user, metrics) => {
  const {
    aadhaarVerified = false,
    panVerified = false,
    upiLinked = false,
    upiVerified = false,
    skills = [],
    inventory = [],
    whatIfRepayActive = false,
    whatIfLinkGithub = false,
    whatIfNewCert = false,
    whatIfConsistentUpi = false
  } = metrics;

  // Base score depends on user type / role
  let score = 55;
  if (user) {
    if (user.type === 'Salaried') score = 65;
    if (user.type === 'Freelancer') score = 58;
    if (user.type === 'Entrepreneur') score = 62;
    if (user.type === 'Student') score = 48;
  }

  // Aadhaar & PAN validation points (proxies for KYC stability)
  if (aadhaarVerified) score += 4;
  if (panVerified) score += 3;

  // UPI cashflow sync points
  if (upiLinked) score += 10;
  if (upiVerified) score += 15;

  // Professional certificates (proxy for future earning potential)
  const verifiedSkillsCount = skills.filter(s => s.verified).length;
  score += verifiedSkillsCount * 4;

  // Inventory assets verification (alternative collateral proxy)
  if (inventory && inventory.length > 0) {
    score += 10;
  }

  // Live simulation What-If points (behavioral predictions)
  if (whatIfRepayActive) score += 6;
  if (whatIfLinkGithub) score += 8;
  if (whatIfNewCert) score += 5;
  if (whatIfConsistentUpi) score += 7;

  // Clamp credibility score inside credit rating standard scale (0 - 100)
  return Math.min(100, Math.max(0, score));
};

window.UNDERWRITING_RATIONALES = {
  Student: "Your credit eligibility emphasizes vocational certification verification logs and GitHub project telemetry. Since you lack standard salary pay slips, your verified certifications act as proxies for earning potential. Keeping certifications active and linking project repositories will boost your borrowing limits.",
  Freelancer: "Your credibility score evaluates your UPI invoice consistency index and Upwork/gig-platform ratings. Alternating high-value credit deposits with low-frequency utility payouts helps establish invoice stream stability. Connecting additional gig portfolios increases loan limits.",
  Entrepreneur: "Your underwriting profile parses merchant transaction frequency and customer retention density. Stability is calculated based on daily cashflow velocity and operational recency. Maintaining steady digital ledger records on-platform maximizes micro-capital pool eligibility.",
  Salaried: "Your eligibility assessment uses PAN/Aadhaar registry matches cross-referenced with direct bank payroll credits. Standard salary receipt consistency represents a low risk category, matching corporate group finance pools."
};

window.MOCK_LOAN_OFFERS = [
  {
    id: "rec-1",
    lender: "Samridhi Capital Fund",
    name: "Freelancer Cashflow Advance",
    amount: "₹1,50,000",
    interestRate: "9.5% p.a.",
    tenure: "12 Months",
    eligibility: "Requires Score > 70",
    tag: "Best for Gig Workers",
    type: "Freelancer"
  },
  {
    id: "rec-2",
    lender: "Nutan Micro-Finance",
    name: "Student Skill-Growth Credit",
    amount: "₹45,000",
    interestRate: "7.8% p.a.",
    tenure: "6 Months",
    eligibility: "Requires Score > 60 & Verified Certification",
    tag: "Low Interest",
    type: "Student"
  },
  {
    id: "rec-3",
    lender: "Pragati Cooperative",
    name: "Micro-business Expansion Line",
    amount: "₹3,00,000",
    interestRate: "11.2% p.a.",
    tenure: "18 Months",
    eligibility: "Requires Score > 65",
    tag: "High Capital",
    type: "Entrepreneur"
  },
  {
    id: "rec-4",
    lender: "Shakti Credit Corp",
    name: "Salaried Quick Advance",
    amount: "₹1,00,000",
    interestRate: "10.0% p.a.",
    tenure: "12 Months",
    eligibility: "Requires Salary Slip Verification Line",
    tag: "Fast Approval",
    type: "Salaried"
  }
];

window.FEATURES_DATA = [
  {
    title: "Skill Credibility Index",
    description: "Bypasses standard reports by verifying code repos, freelancing credentials, and professional certificates.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "UPI Analysis",
    description: "Scans transactional recency, inflow-outflow consistency, and utility patterns to map digital solvency.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Credibility Score 0-100",
    description: "Consolidates multidimensional behavior metrics into a single real-time trust rating.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-success" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Risk Classification",
    description: "Tiers loan applicants instantly using advanced AI clusters to identify credit-invisible opportunities.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-warning" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  },
  {
    title: "Smart Loan Recommender",
    description: "AI-matching engine pairs your credibility metrics with ideal micro-loans, starting from low interest rates.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )
  },
  {
    title: "Explainable AI (XAI)",
    description: "Glass-box transparency detailing the exact parameters determining credit scores, ensuring fair evaluations.",
    icon: (
      <svg className="w-6 h-6 text-samridhi-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }
];

window.HOW_IT_WORKS_STEPS = [
  { step: "01", title: "Data Collection", desc: "Integrate UPI transaction logs, GitHub/LinkedIn repos, and certification platforms securely." },
  { step: "02", title: "Preprocessing", desc: "Cleans data anomalies, structures timelines, and categorizes income patterns." },
  { step: "03", title: "Feature Engineering", desc: "Builds 25+ features covering cash stability, gig-ratings, and skill metrics." },
  { step: "04", title: "ML Scored Underwriting", desc: "Predicts credit trustworthiness through non-traditional neural scoring models." },
  { step: "05", title: "Credit Approval Decision", desc: "Pairs applicants with low-interest institutional capital partners instantly." }
];

window.STATS = [
  { val: "190M+", label: "Credit-Invisible Indians" },
  { val: "25+", label: "Alternative Features Scanned" },
  { val: "0 - 100", label: "Algorithmic Trust Rating" },
  { val: "3", label: "Targeted Risk Categories" }
];
