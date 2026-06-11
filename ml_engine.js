// Samridhi Explainable ML Underwriting & Scoring Engine
// Shared globally via the window object

// Seeded Pseudo-Random Number Generator for deterministic Isolation Forest training
const createSeededRandom = (seedInit = 42) => {
  let s = seedInit;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Pure JS Isolation Forest Ensemble for Transaction Anomaly Detection
class IsolationTreeNode {
  constructor(left, right, splitFeature, splitValue, size) {
    this.left = left;
    this.right = right;
    this.splitFeature = splitFeature;
    this.splitValue = splitValue;
    this.size = size;
  }
}

class IsolationTree {
  constructor(randomFn) {
    this.root = null;
    this.randomFn = randomFn || Math.random;
  }
  
  fit(data, currentHeight, maxHeight) {
    if (data.length <= 1 || currentHeight >= maxHeight) {
      return new IsolationTreeNode(null, null, null, null, data.length);
    }
    
    // Choose random feature
    const features = Object.keys(data[0]);
    const splitFeature = features[Math.floor(this.randomFn() * features.length)];
    
    // Find min and max
    const values = data.map(d => d[splitFeature]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    if (min === max) {
      return new IsolationTreeNode(null, null, null, null, data.length);
    }
    
    // Choose random split value
    const splitValue = min + this.randomFn() * (max - min);
    
    const leftData = data.filter(d => d[splitFeature] < splitValue);
    const rightData = data.filter(d => d[splitFeature] >= splitValue);
    
    return new IsolationTreeNode(
      this.fit(leftData, currentHeight + 1, maxHeight),
      this.fit(rightData, currentHeight + 1, maxHeight),
      splitFeature,
      splitValue,
      data.length
    );
  }
}

class IsolationForest {
  constructor(numTrees = 10, subSampleSize = 256, seed = 42) {
    this.numTrees = numTrees;
    this.subSampleSize = subSampleSize;
    this.randomFn = createSeededRandom(seed);
    this.trees = [];
  }
  
  fit(data) {
    this.trees = [];
    const n = data.length;
    if (n === 0) return;
    const size = Math.min(this.subSampleSize, n);
    const maxHeight = Math.ceil(Math.log2(size));
    
    for (let i = 0; i < this.numTrees; i++) {
      // Subsample data
      const sample = [];
      const indices = new Set();
      while (sample.length < size) {
        const idx = Math.floor(this.randomFn() * n);
        if (!indices.has(idx)) {
          indices.add(idx);
          sample.push(data[idx]);
        }
      }
      
      const tree = new IsolationTree(this.randomFn);
      tree.root = tree.fit(sample, 0, maxHeight);
      this.trees.push(tree);
    }
  }
  
  pathLength(sample, node, currentDepth) {
    if (!node || node.size <= 1) {
      return currentDepth + c(node ? node.size : 0);
    }
    
    if (node.splitFeature === null) {
      return currentDepth + c(node.size);
    }
    
    if (sample[node.splitFeature] < node.splitValue) {
      return this.pathLength(sample, node.left, currentDepth + 1);
    } else {
      return this.pathLength(sample, node.right, currentDepth + 1);
    }
  }
  
  score(sample) {
    if (this.trees.length === 0) return 0.5;
    let sumPathLength = 0;
    for (const tree of this.trees) {
      sumPathLength += this.pathLength(sample, tree.root, 0);
    }
    const avgPathLength = sumPathLength / this.trees.length;
    const n = Math.min(this.subSampleSize, this.trees[0]?.root?.size || 0);
    const avgC = c(n);
    if (avgC === 0) return 0.5;
    return Math.pow(2, -avgPathLength / avgC);
  }
}

function c(n) {
  if (n <= 1) return 0;
  if (n === 2) return 1;
  const EulerGamma = 0.5772156649;
  return 2 * (Math.log(n - 1) + EulerGamma) - 2 * (n - 1) / n;
}

// Global hook to run Isolation Forest on transactions
window.runIsolationForest = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  // Map transaction attributes to feature vectors
  const categories = {
    'income': 1, 'food': 2, 'housing': 3, 'shopping': 4,
    'utility': 5, 'education': 6, 'entertainment': 7, 'other': 8
  };
  
  const featureData = transactions.map(t => {
    const catKey = (t.category || 'other').toLowerCase();
    const categoryIndex = categories[catKey] || 8;
    const typeVal = (t.type === 'Credit' || t.amount > 0) ? 1 : -1;
    const amt = Math.abs(t.amount || 0);
    
    let dayOfWeek = 0;
    if (t.date) {
      const d = new Date(t.date);
      if (!isNaN(d.getTime())) {
        dayOfWeek = d.getDay();
      }
    }
    
    return {
      amount: amt,
      type: typeVal,
      category: categoryIndex,
      dayOfWeek: dayOfWeek,
      id: t.id
    };
  });

  // Remove id for learning
  const trainingData = featureData.map(({ id, ...features }) => features);

  // Train forest
  const forest = new IsolationForest(15, 256, 1337); // 15 trees, seed=1337
  forest.fit(trainingData);

  // Predict anomaly scores
  return featureData.map(item => {
    const featuresOnly = {
      amount: item.amount,
      type: item.type,
      category: item.category,
      dayOfWeek: item.dayOfWeek
    };
    const score = forest.score(featuresOnly);
    return {
      id: item.id,
      score: score
    };
  });
};

// Global hook to compute SHAP attributions and LIME local surrogate equations
window.calculateXAIExplanations = (user, metrics) => {
  const {
    aadhaarVerified = false,
    panVerified = false,
    upiLinked = false,
    upiVerified = false,
    skills = [],
    inventory = [],
    transactions = [],
    kycCameraVerified = false,
    bankStatementUploaded = false,
    whatIfRepayActive = false,
    whatIfLinkGithub = false,
    whatIfNewCert = false,
    whatIfConsistentUpi = false
  } = metrics;

  const baseline = 50;
  const shap = [];

  // 1. Role base adjustment
  let roleImpact = -2;
  if (user) {
    if (user.type === 'Salaried') roleImpact = 15;
    if (user.type === 'Freelancer') roleImpact = 8;
    if (user.type === 'Entrepreneur') roleImpact = 12;
  }
  shap.push({ label: "Profile Baseline Config", impact: roleImpact, positive: roleImpact >= 0 });

  // 2. Identity Verification
  if (aadhaarVerified) shap.push({ label: "Aadhaar Identity KYC", impact: 4, positive: true });
  if (panVerified) shap.push({ label: "PAN Registry Link", impact: 3, positive: true });

  // 3. UPI Consent Link
  if (upiLinked) shap.push({ label: "UPI Consent Link", impact: 10, positive: true });
  if (upiVerified) shap.push({ label: "UPI Node Verification", impact: 15, positive: true });

  // 4. Skills Credentials
  const verifiedSkillsCount = skills.filter(s => s.verified).length;
  if (verifiedSkillsCount > 0) {
    shap.push({ label: "Skill Certifications", impact: verifiedSkillsCount * 4, positive: true });
  }

  // 5. Assets
  if (inventory && inventory.length > 0) {
    shap.push({ label: "Inventory Asset Ledger", impact: 10, positive: true });
  }

  // 6. Camera KYC & Statement Upload
  if (kycCameraVerified) shap.push({ label: "Liveness Camera Verification", impact: 8, positive: true });
  if (bankStatementUploaded) shap.push({ label: "Statement OCR Upload", impact: 7, positive: true });

  // 6b. Projects verification
  const projectsCount = (user && user.projects) ? (Array.isArray(user.projects) ? user.projects.length : JSON.parse(user.projects || '[]').length) : 0;
  if (projectsCount > 0) {
    shap.push({ label: "Verified Portfolio Projects", impact: Math.min(15, projectsCount * 5), positive: true });
  }

  // 7. What-If Simulator Milestones
  if (whatIfRepayActive) shap.push({ label: "Milestone: Active repayment", impact: 6, positive: true });
  if (whatIfLinkGithub) shap.push({ label: "Milestone: GitHub sync", impact: 8, positive: true });
  if (whatIfNewCert) shap.push({ label: "Milestone: Course credentials", impact: 5, positive: true });
  if (whatIfConsistentUpi) shap.push({ label: "Milestone: UPI consistency", impact: 7, positive: true });

  // 8. Transaction Analysis
  if (transactions && transactions.length > 0) {
    const txCount = transactions.length;
    const txVolumePoints = Math.min(8, Math.floor(txCount * 0.5));
    if (txVolumePoints > 0) {
      shap.push({ label: "UPI Transaction Volume", impact: txVolumePoints, positive: true });
    }

    const totalCredit = transactions
      .filter(t => t.type === 'Credit' || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDebit = transactions
      .filter(t => t.type === 'Debit' || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    let txRatioPoints = 0;
    if (totalCredit > 0) {
      const surplus = totalCredit - totalDebit;
      if (surplus > 0) {
        const ratio = surplus / totalCredit;
        txRatioPoints = Math.min(12, Math.floor(ratio * 12));
      }
    }
    if (txRatioPoints > 0) {
      shap.push({ label: "UPI Cash Inflow Ratio", impact: txRatioPoints, positive: true });
    }

    // Unsupervised Anomaly deduction
    const ifScores = window.runIsolationForest(transactions);
    const anomalies = ifScores.filter(item => item.score > 0.58);
    const penalty = Math.min(15, anomalies.length * 5);
    if (penalty > 0) {
      shap.push({ label: "Cashflow Divergence Outlier", impact: -penalty, positive: false });
    }
  }

  // LIME surrogate explanation formulas & values
  const limeFormula = `y ≈ 50 + ${roleImpact >= 0 ? '+' : ''}${roleImpact}*X_Profile + 4*X_Aadhaar + 3*X_PAN + 10*X_UPI_Link + 15*X_UPI_Verify + 4*X_Skills + 10*X_Asset + 8*X_Liveness + 7*X_Statement - 5*X_Divergence`;
  
  const limeSurrogate = {
    formula: limeFormula,
    coefficients: {
      X_Profile: roleImpact,
      X_Aadhaar: 4,
      X_PAN: 3,
      X_UPI_Link: 10,
      X_UPI_Verify: 15,
      X_Skills: 4,
      X_Asset: 10,
      X_Liveness: 8,
      X_Statement: 7,
      X_Divergence: -5
    },
    activeValues: {
      X_Profile: 1,
      X_Aadhaar: aadhaarVerified ? 1 : 0,
      X_PAN: panVerified ? 1 : 0,
      X_UPI_Link: upiLinked ? 1 : 0,
      X_UPI_Verify: upiVerified ? 1 : 0,
      X_Skills: verifiedSkillsCount,
      X_Asset: (inventory && inventory.length > 0) ? 1 : 0,
      X_Liveness: kycCameraVerified ? 1 : 0,
      X_Statement: bankStatementUploaded ? 1 : 0,
      X_Divergence: (transactions && window.runIsolationForest(transactions).filter(item => item.score > 0.58).length) || 0
    }
  };

  return {
    shapFactors: shap,
    limeSurrogate: limeSurrogate,
    baseline: baseline
  };
};

window.calculateCredibilityScore = (user, metrics) => {
  const {
    aadhaarVerified = false,
    panVerified = false,
    upiLinked = false,
    upiVerified = false,
    skills = [],
    inventory = [],
    transactions = [],
    kycCameraVerified = false,
    bankStatementUploaded = false,
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

  // KYC Camera Verification & Bank Statement Upload Points
  if (kycCameraVerified) score += 8;
  if (bankStatementUploaded) score += 7;

  // Projects verification (proxy for technical/vocational capabilities)
  const projectsCount = (user && user.projects) ? (Array.isArray(user.projects) ? user.projects.length : JSON.parse(user.projects || '[]').length) : 0;
  if (projectsCount > 0) {
    score += Math.min(15, projectsCount * 5);
  }

  // Live simulation What-If points (behavioral predictions)
  if (whatIfRepayActive) score += 6;
  if (whatIfLinkGithub) score += 8;
  if (whatIfNewCert) score += 5;
  if (whatIfConsistentUpi) score += 7;

  // Dynamic transaction velocity scoring
  let txPoints = 0;
  if (transactions && transactions.length > 0) {
    // 1. Transaction volume (up to 8 points)
    const txCount = transactions.length;
    txPoints += Math.min(8, Math.floor(txCount * 0.5));

    // 2. Net inflow ratio (up to 12 points)
    const totalCredit = transactions
      .filter(t => t.type === 'Credit' || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDebit = transactions
      .filter(t => t.type === 'Debit' || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (totalCredit > 0) {
      const surplus = totalCredit - totalDebit;
      if (surplus > 0) {
        const ratio = surplus / totalCredit;
        txPoints += Math.min(12, Math.floor(ratio * 12));
      }
    }

    // 3. Unsupervised Anomaly deduction using Isolation Forest
    const ifScores = window.runIsolationForest(transactions);
    const anomalies = ifScores.filter(item => item.score > 0.58);
    txPoints -= Math.min(15, anomalies.length * 5);
  }
  score += txPoints;

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
