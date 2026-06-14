import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    totalSpent: "",
    lastOrderDate: "",
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addCustomer = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      await axios.post(`${apiUrl}/customers`, {
        ...form,
        totalSpent: parseFloat(form.totalSpent) || 0,
      });
      setStatusMessage("Customer profile added successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        totalSpent: "",
        lastOrderDate: "",
      });
      fetchCustomers();
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to add customer. Verify format.");
    }
  };

  // Filter list based on search term
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight font-sans">Customer Directory</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review existing consumer rosters, search profiles, and create new target contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Add Customer Form */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purpleLight">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-200">Add Customer Profile</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Add a new customer account to keep your active list growing.
            </p>

            <form onSubmit={addCustomer} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-xl p-3 text-slate-200 text-xs focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-xl p-3 text-slate-200 text-xs focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-xl p-3 text-slate-200 text-xs focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">LTV ($ spent)</label>
                  <input
                    name="totalSpent"
                    type="number"
                    step="0.01"
                    value={form.totalSpent}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-xl p-3 text-slate-200 text-xs focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Last Order</label>
                  <input
                    name="lastOrderDate"
                    type="date"
                    value={form.lastOrderDate}
                    onChange={handleChange}
                    className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-xl p-3 text-slate-200 text-xs focus:outline-none transition-all text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-brand-purple to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold text-xs shadow-glow hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Create Account Profile
              </button>
            </form>

            {statusMessage && (
              <div className="mt-3.5 p-3.5 bg-slate-900/50 border-l-2 border-brand-purpleLight text-slate-400 text-xs rounded-r-xl leading-relaxed">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Customer Directory Table */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-200">Directory Roster</h2>
                <p className="text-xs text-slate-400">Search profiles using name or email tags.</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-bg/60 border border-brand-border/50 focus:border-brand-purple rounded-xl py-2 pl-9 pr-3 text-slate-200 text-xs focus:outline-none transition-all placeholder:text-slate-600"
                />
                <svg className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-border/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg/60 border-b border-brand-border/30">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Name</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Phone</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">LTV Spend</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/15">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                        Directory loading...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                        No profiles match search keywords.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-800/15 transition-all text-sm group">
                        <td className="p-4 font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                          {customer.name}
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{customer.email}</td>
                        <td className="p-4 text-slate-400 text-xs">{customer.phone || "-"}</td>
                        <td className="p-4 text-slate-200 font-bold text-right text-xs">
                          ${customer.totalSpent?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-slate-400 text-center text-xs">
                          {customer.lastOrderDate ? (
                            <span className="px-2 py-0.5 bg-[#101227] border border-[#1f224a] rounded-lg">
                              {customer.lastOrderDate}
                            </span>
                          ) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
