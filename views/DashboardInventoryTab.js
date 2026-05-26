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
      id: `inv-added-${Date.now()}`,
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
        text: `Asset added to Inventory: ${newItemName} (${qty} ${newItemUnit}) valued at ₹${(qty * price).toLocaleString()}. Credit valuation updated.`,
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
        text: `Removed inventory asset: ${name}. Credibility valuation updated.`,
        read: false,
        date: "Just now"
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Overview/Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Valuation Summary Card */}
        <div className="lg:col-span-8 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-samridhi-primary/5 to-transparent rounded-tr-2xl pointer-events-none"></div>
          <div>
            <h2 className="text-lg font-extrabold text-samridhi-textPrimary">Asset & Inventory Ledger</h2>
            <p className="text-xs text-samridhi-textMuted mt-1 max-w-lg leading-relaxed">
              Alternative underwriting assesses physical or digital asset value as collateral. Keeping your ledger updated helps lenders gauge your operational stability.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-samridhi-border/40">
            <div>
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider">Total Ledger Valuation</span>
              <span className="text-xl md:text-2xl font-black text-samridhi-secondary">₹{totalValuation.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider">Total Units Tracked</span>
              <span className="text-xl md:text-2xl font-black text-samridhi-textPrimary">{totalItemsCount}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-[10px] text-samridhi-textMuted font-bold uppercase tracking-wider">Alternative Score Impact</span>
              <span className="text-xs font-black text-samridhi-success inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-samridhi-success/15 border border-samridhi-success/20 rounded-lg">
                ⚡ +10 Points Active
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Category Card */}
        <div className="lg:col-span-4 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl flex flex-col justify-between shadow-lg">
          <h3 className="text-xs font-black uppercase text-samridhi-primary tracking-widest mb-3">Profile Alignment</h3>
          
          <div className="space-y-3">
            <span className="text-xs text-samridhi-textMuted block leading-normal">
              Based on your <strong className="text-samridhi-textPrimary">{user.type}</strong> profile, your credit evaluation parses:
            </span>
            <div className="bg-samridhi-surface/50 border border-samridhi-border p-4.5 rounded-xl space-y-2 text-xs">
              {user.type === 'Entrepreneur' && (
                <>
                  <p className="font-extrabold text-samridhi-textPrimary">🛒 Retail & Raw Material Stock</p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed">Quantifying supply value ensures lenders know you have enough collateral to buffer working capital lines.</p>
                </>
              )}
              {user.type === 'Freelancer' && (
                <>
                  <p className="font-extrabold text-samridhi-textPrimary">💻 Digital Templates & Hardware</p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed">Valuing active templates and computing hardware lists proxy professional capability and work capacity.</p>
                </>
              )}
              {user.type === 'Student' && (
                <>
                  <p className="font-extrabold text-samridhi-textPrimary">🎓 Learning Assets & Project Repos</p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed">Completed online course records and project builds represent high future vocational valuation.</p>
                </>
              )}
              {user.type === 'Salaried' && (
                <>
                  <p className="font-extrabold text-samridhi-textPrimary">📈 Financial Benefits & Assets</p>
                  <p className="text-[11px] text-samridhi-textMuted leading-relaxed">Provident funds, digital savings bonds, and corporate benefits sync status represent low risk reserves.</p>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Item List & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inventory Item Table (Col-8) */}
        <div className="lg:col-span-8 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-samridhi-border/40 pb-3">
            <h3 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider">Asset Item Registry</h3>
            <span className="text-[10px] font-bold text-samridhi-textMuted uppercase">Sync Status: Live</span>
          </div>

          <div className="overflow-x-auto">
            {!dashboardState.inventory || dashboardState.inventory.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <span className="text-4xl block">📦</span>
                <p className="text-xs text-samridhi-textMuted font-bold">No assets found in your ledger.</p>
                <p className="text-[10px] text-samridhi-textMuted max-w-xs mx-auto">Add your stock, software licenses, project portfolios, or savings certificates in the form to get started.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-samridhi-textMuted">
                <thead>
                  <tr className="border-b border-samridhi-border/60 text-samridhi-textPrimary font-extrabold uppercase">
                    <th className="py-2.5">Asset Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-right">Quantity</th>
                    <th className="py-2.5 text-right">Unit Price</th>
                    <th className="py-2.5 text-right">Valuation</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-samridhi-border/30">
                  {dashboardState.inventory.map((item) => {
                    const valuation = item.quantity * item.price;
                    return (
                      <tr key={item.id} className="hover:bg-samridhi-surface/30 transition-colors">
                        <td className="py-3 font-semibold text-samridhi-textPrimary">
                          <div>
                            <span className="block font-bold">{item.name}</span>
                            <span className="block text-[9px] text-samridhi-textMuted mt-0.5">Updated: {item.lastUpdated}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-samridhi-surface border border-samridhi-border rounded text-[9px] font-semibold">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-samridhi-textPrimary">
                          {item.quantity.toLocaleString()} <span className="text-[10px] text-samridhi-textMuted">{item.unit}</span>
                        </td>
                        <td className="py-3 text-right font-semibold">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-black text-samridhi-secondary">
                          ₹{valuation.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="text-[10px] font-bold text-samridhi-danger hover:underline px-2 py-1"
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
        <div className="lg:col-span-4 bg-samridhi-card border border-samridhi-border p-6 rounded-2xl shadow-lg h-fit">
          <h4 className="font-extrabold text-sm text-samridhi-textPrimary uppercase tracking-wider border-b border-samridhi-border/40 pb-3 mb-4">
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
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-samridhi-textMuted uppercase mb-1">Asset Category</label>
              <select 
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
              >
                <option value="">-- Select Category --</option>
                {defaultCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
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
                  className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
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
                  className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
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
                className="w-full bg-samridhi-bg border border-samridhi-border text-samridhi-textPrimary rounded-lg p-2.5 focus:border-samridhi-primary focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-samridhi-primary hover:bg-samridhi-primary/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md mt-6"
            >
              <span>Verify & Append Asset</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
