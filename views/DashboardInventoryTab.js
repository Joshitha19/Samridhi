// Dashboard Inventory Tab Component for Samridhi
// Exposes DashboardInventoryTab globally

window.DashboardInventoryTab = ({
  user,
  dashboardState,
  dispatch
}) => {
  const { useState } = React;
  
  // State for adding a new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('units');

  // Custom categories based on role
  const categoriesByRole = {
    Entrepreneur: ['Raw Materials', 'Finished Goods', 'Packaging', 'Equipment'],
    Freelancer: ['Digital Templates', 'Software Licences', 'Deliverable Assets', 'Hardware Tools'],
    Student: ['Online Courses', 'Project Repositories', 'Research Papers', 'Skills Badges'],
    Salaried: ['Digital Bonds', 'Retirement Accounts', 'Tax Savings Certificates', 'Reimbursements']
  };

  const defaultCategories = categoriesByRole[user.type] || ['Assets', 'Supplies', 'Inventory'];
  const defaultCategory = defaultCategories[0];

  // Calculate totals
  const totalItemsCount = dashboardState.inventory ? dashboardState.inventory.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0) : 0;
  const totalValuation = dashboardState.inventory ? dashboardState.inventory.reduce((sum, item) => sum + (parseInt(item.quantity || 0) * parseFloat(item.price || 0)), 0) : 0;

  // Handles adding item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemQty || !newItemPrice) return;

    const qty = parseInt(newItemQty) || 0;
    const price = parseFloat(newItemPrice) || 0;
    const category = newItemCategory || defaultCategory;

    const newItem = {
      id: window.generateUUID ? window.generateUUID() : `inv-added-${Date.now()}`,
      name: newItemName,
      category: category,
      quantity: qty,
      unit: newItemUnit,
      price: price,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    dispatch({
      type: 'ADD_INVENTORY_ITEM',
      payload: newItem
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        text: `Asset added to Ledger: ${newItemName} (${qty} ${newItemUnit}) valued at ₹${(qty * price).toLocaleString()}. Credit valuation updated.`,
        read: false,
        date: "Just now"
      }
    });

    // Reset fields
    setNewItemName('');
    setNewItemQty('');
    setNewItemPrice('');
    setNewItemCategory('');
    setNewItemUnit('units');
  };

  // Handles delete
  const handleDeleteItem = (id, name) => {
    dispatch({
      type: 'REMOVE_INVENTORY_ITEM',
      payload: id
    });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        text: `Removed ledger asset: ${name}. Credibility valuation updated.`,
        read: false,
        date: "Just now"
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Overview/Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Valuation Summary Card */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-secondary relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-secondary/10 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider text-glow-secondary">Asset & Inventory Ledger</h2>
            <p className="text-xs text-samridhi-textMuted mt-1 max-w-lg leading-relaxed font-semibold">
              Alternative underwriting assesses physical or digital asset value as collateral. Keeping your ledger updated helps lenders gauge your operational stability.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/[0.04]">
            <div>
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider">Total Ledger Valuation</span>
              <span className="text-xl md:text-2xl font-black text-samridhi-secondary font-mono text-glow-secondary">₹{totalValuation.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider">Total Units Tracked</span>
              <span className="text-xl md:text-2xl font-black text-white font-mono">{totalItemsCount}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider font-semibold">Alternative Score Impact</span>
              <span className="text-[10px] font-black text-samridhi-success inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-samridhi-success/15 border border-samridhi-success/20 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>+10 Points Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Category Card */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-samridhi-primary/10 to-transparent rounded-tr-3xl pointer-events-none filter blur-xl"></div>
          <h3 className="text-xs font-black uppercase text-samridhi-primary tracking-widest mb-3 text-glow-primary">Profile Alignment</h3>
          
          <div className="space-y-3">
            <span className="text-xs text-samridhi-textMuted block leading-normal font-semibold">
              Based on your <strong className="text-white">{user.type}</strong> profile, your credit evaluation parses:
            </span>
            <div className="bg-white/[0.02] border border-white/[0.06] p-4.5 rounded-xl space-y-2 text-xs">
              {user.type === 'Entrepreneur' && (
                <>
                  <p className="font-extrabold text-white flex items-center space-x-1.5 font-sans">
                    <svg className="w-4 h-4 text-samridhi-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Retail & Raw Material Stock</span>
                  </p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed font-semibold">Quantifying supply value ensures lenders know you have enough collateral to buffer working capital lines.</p>
                </>
              )}
              {user.type === 'Freelancer' && (
                <>
                  <p className="font-extrabold text-white flex items-center space-x-1.5 font-sans">
                    <svg className="w-4 h-4 text-samridhi-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Digital Templates & Hardware</span>
                  </p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed font-semibold">Valuing active templates and computing hardware lists proxy professional capability and work capacity.</p>
                </>
              )}
              {user.type === 'Student' && (
                <>
                  <p className="font-extrabold text-white flex items-center space-x-1.5 font-sans">
                    <svg className="w-4 h-4 text-samridhi-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Learning Assets & Project Repos</span>
                  </p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed font-semibold">Completed online course records and project builds represent high future vocational valuation.</p>
                </>
              )}
              {user.type === 'Salaried' && (
                <>
                  <p className="font-extrabold text-white flex items-center space-x-1.5 font-sans">
                    <svg className="w-4 h-4 text-samridhi-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Financial Benefits & Assets</span>
                  </p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed font-semibold">Provident funds, digital savings bonds, and corporate benefits sync status represent low risk reserves.</p>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Item List & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inventory Item Table (Col-8) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-success space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider text-glow-success">Asset Item Registry</h3>
            <span className="text-[10px] font-bold text-samridhi-textMuted uppercase">Sync Status: Live</span>
          </div>

          <div className="overflow-x-auto">
            {!dashboardState.inventory || dashboardState.inventory.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto text-samridhi-textMuted">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-xs text-white font-black uppercase tracking-wider">No assets found in your ledger.</p>
                <p className="text-[10px] text-samridhi-textMuted max-w-xs mx-auto font-semibold">Add your stock, software licenses, project portfolios, or savings certificates in the form to get started.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-samridhi-textMuted">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white font-extrabold uppercase">
                    <th className="py-2.5">Asset Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-right">Quantity</th>
                    <th className="py-2.5 text-right">Unit Price</th>
                    <th className="py-2.5 text-right">Valuation</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] font-mono">
                  {dashboardState.inventory.map((item) => {
                    const valuation = item.quantity * item.price;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-semibold text-white font-sans">
                          <div>
                            <span className="block font-bold">{item.name}</span>
                            <span className="block text-[9px] text-samridhi-textMuted mt-0.5 font-mono">Updated: {item.lastUpdated}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-white/[0.02] border border-white/[0.06] rounded text-[9px] font-bold text-samridhi-textMuted uppercase tracking-wide">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-white">
                          {item.quantity.toLocaleString()} <span className="text-[10px] text-samridhi-textMuted font-sans">{item.unit}</span>
                        </td>
                        <td className="py-3 text-right font-semibold text-white">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-black text-samridhi-secondary">
                          ₹{valuation.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="text-[10px] font-black uppercase text-samridhi-danger hover:underline px-2 py-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Asset Form (Col-4) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/[0.04] border-glow-primary shadow-lg h-fit">
          <h4 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-white/[0.04] pb-3 mb-4 text-glow-primary">
            Add Ledger Asset
          </h4>
          
          <form onSubmit={handleAddItem} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Asset Name</label>
              <input 
                type="text" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={user.type === 'Entrepreneur' ? "e.g. Arabica Coffee Beans" : user.type === 'Freelancer' ? "e.g. High-End Laptop" : "e.g. AWS Certification Course"} 
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Asset Category</label>
              <select 
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all"
              >
                <option value="" className="bg-samridhi-bg text-samridhi-textMuted">-- Select Category --</option>
                {defaultCategories.map((cat, idx) => (
                  <option key={idx} value={cat} className="bg-samridhi-bg text-white">{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  placeholder="50" 
                  className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Unit (e.g. kg, pcs)</label>
                <input 
                  type="text" 
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  placeholder={user.type === 'Entrepreneur' ? "kg" : "units"}
                  className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Unit Valuation (₹)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="450" 
                className="w-full bg-white/[0.02] border border-white/[0.08] hover:border-samridhi-primary/30 focus:border-samridhi-primary text-white rounded-lg p-2.5 focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-black uppercase tracking-wider py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-samridhi-primary/15 mt-6"
            >
              <span>Verify & Append Asset</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
