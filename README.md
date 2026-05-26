# Samridhi: AI-Based Credibility System for Smart Loan Approval

Samridhi is a premium, modern dark-themed web application designed to empower India's credit-invisible population (freelancers, gig workers, students, and micro-entrepreneurs) through alternative AI-driven underwriting and credit accessibility.

## 🚀 Key Features

- **Asset & Inventory Ledger**: Introduces role-customized asset listing (product stock ledger for Entrepreneurs, active projects/deliverables for Freelancers, courses/learning assets for Students) to verify collateral value and award a **+10 score points** credibility boost.
- **Explainable AI (XAI)**: Visualizes the impact of different credibility factors on the final score.
- **Dynamic What-If Simulator**: Enables users to preview how linking credentials (like GitHub, Upwork, or government IDs) affects their score in real time.
- **UPI KYC & Mobile Deep Linking**: Integrates dynamic QR codes (via `api.qrserver.com`) and mobile payment links using the standard `upi://pay` protocol to authenticate profiles.
- **Role-Based Personalization**: Underwriting rationales and loan offers are custom-tailored to the user's selected role (Freelancer, Student, Entrepreneur, or Salaried).
- **Interactive Cashflow Telemetry**: Displays interactive income-vs-expense area charts and category distribution bar charts using Recharts.

---

## 🛠️ Modular Architecture

To allow independent modifications by Machine Learning engineers and Front-End developers, the codebase is structured into **16 modular files**. 

The application runs entirely client-side inside the browser using **Babel Standalone** to parse JSX. This allows you to launch the app instantly by **double-clicking `index.html`** without needing any build tools (Webpack, Vite), Node.js, or local servers.

### File Structure

```text
Samridhi/
├── index.html                  # Entry point (CDNs, Tailwind configs, sequential script tags)
├── README.md                   # Project documentation
├── ml_engine.js                # [ML Engineers] Underwriting model logic, weights, and product offers
├── app.js                      # Root React coordinator, global states, and navigation routing
├── components/
│   ├── icons.js                # Reusable SVG Icons collection
│   ├── CircularGauge.js        # SVG Credit Score gauge
│   └── LoanWizard.js           # Multi-step loan customizer and contract signer
└── views/
    ├── LandingPageView.js      # Public landing/marketing page with interactive score preview
    ├── SignInPageView.js       # Log-in view
    ├── SignUpPageView.js       # Register view (VPA syncing & role selection)
    ├── DashboardView.js        # Main dashboard sidebar wrapper and notification drawer
    ├── DashboardOverviewTab.js # Core dashboard status, transaction logs, and UPI QR verification
    ├── DashboardScoreTab.js    # Score factors and What-If simulator panels
    ├── DashboardTransactionsTab.js # Cashflow analysis visualization (Recharts)
    ├── DashboardInventoryTab.js # Asset & Inventory ledger (stock ledger, software assets, certifications)
    ├── DashboardRecommendationsTab.js # Tailored loan offers and AI Underwriting Rationales
    └── DashboardProfileTab.js  # User settings, profile updates, and KYC document toggles
```

---

## 🏃 How to Run the App

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Joshitha19/Samridhi.git
   ```
2. Navigate into the directory and open `index.html` directly in any modern web browser (Double-click `index.html` or drag it into Chrome/Edge/Firefox).
3. No compilation or dependencies installation is needed!

---

## ⚙️ How to Modify and Customize

### Modifying the Machine Learning Model
If you want to alter score calculations, change weights, update mock loan products, or rewrite underwriting explanations, edit **`ml_engine.js`**:
* Update `calculateCredibilityScore(user, options)` to adjust scoring rules.
* Change base scores inside the `roleConfigs` object.
* Modify `MOCK_LOAN_OFFERS` or `UNDERWRITING_RATIONALES` to customize recommended micro-credit packages.

### Modifying the UI & Pages
* Global state router and main layout: **`app.js`**
* Styling configurations (Colors, Fonts): Tailwind Play settings are located in the `<head>` of **`index.html`**.
* Tabs and views: Edit the respective file inside the **`views/`** directory.
