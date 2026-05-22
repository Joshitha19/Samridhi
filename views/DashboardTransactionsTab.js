// Dashboard Transaction Analysis Tab Component for Samridhi
// Exposes DashboardTransactionsTab globally

window.DashboardTransactionsTab = ({
  dashboardState
}) => {
  const {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } = window.Recharts;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Summary row */}
      <div className="bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Digital Cashflow Telemetry</h2>
          <p className="text-xs text-samridhi-textMuted">Analytics generated from linked UPI handles and bank statement parsers.</p>
        </div>

        {/* Stats details */}
        <div className="flex gap-8 text-xs">
          <div>
            <span className="block text-samridhi-textMuted font-bold">Total Inflow (Month)</span>
            <span className="text-base font-extrabold text-samridhi-success">₹45,000</span>
          </div>
          <div>
            <span className="block text-samridhi-textMuted font-bold">Total Outflow (Month)</span>
            <span className="text-base font-extrabold text-samridhi-secondary">₹17,800</span>
          </div>
          <div>
            <span className="block text-samridhi-textMuted font-bold">Inflow Consistency</span>
            <span className="text-base font-extrabold text-samridhi-primary">94% Stable</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: Monthly Trend (Col-7) */}
        <div className="lg:col-span-7 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-samridhi-textPrimary">Income vs Expense Trend</h3>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { name: 'Dec', Income: 38000, Expense: 14000 },
                  { name: 'Jan', Income: 42000, Expense: 18000 },
                  { name: 'Feb', Income: 40000, Expense: 15000 },
                  { name: 'Mar', Income: 45000, Expense: 16000 },
                  { name: 'Apr', Income: 44000, Expense: 17000 },
                  { name: 'May', Income: 45000, Expense: 17800 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2A2A3E" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#8888AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#8888AA" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A26', borderColor: '#2A2A3E', borderRadius: '8px', color: '#F0F0FF' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Income" stroke="#6C63FF" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="Expense" stroke="#00D4FF" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Spending category (Col-5) */}
        <div className="lg:col-span-5 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-samridhi-textPrimary">Category Expense Distribution</h3>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { category: 'Hosting', Amount: 3499 },
                  { category: 'F&B', Amount: 4200 },
                  { category: 'Utilities', Amount: 2600 },
                  { category: 'Co-work', Amount: 5000 },
                  { category: 'Transport', Amount: 2500 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#2A2A3E" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" stroke="#8888AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#8888AA" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A26', borderColor: '#2A2A3E', borderRadius: '8px', color: '#F0F0FF' }} cursor={{ fill: '#1E1E2E', opacity: 0.4 }} />
                <Bar dataKey="Amount" fill="#00D4FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};
