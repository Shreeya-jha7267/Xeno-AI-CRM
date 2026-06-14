import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Segments() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSegment, setAiSegment] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [customSegments, setCustomSegments] = useState([]);

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

  // Segment Filter Logic
  const isDormant = (dateStr) => {
    if (!dateStr) return true;
    const orderDate = new Date(dateStr);
    const currentDate = new Date("2026-06-15"); // From metadata local time
    const diffTime = Math.abs(currentDate - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 60;
  };

  const isRecent = (dateStr) => {
    if (!dateStr) return false;
    const orderDate = new Date(dateStr);
    const currentDate = new Date("2026-06-15");
    const diffTime = Math.abs(currentDate - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const getFilteredCustomers = (segmentId) => {
    const custom = customSegments.find(s => s.id === segmentId);
    if (custom) {
      return customers.filter(c => {
        let match = true;
        if (custom.rules.minSpend !== null) match = match && c.totalSpent >= custom.rules.minSpend;
        if (custom.rules.dormant === true) match = match && isDormant(c.lastOrderDate);
        if (custom.rules.emailDomain) match = match && c.email.includes(custom.rules.emailDomain);
        return match;
      });
    }

    switch (segmentId) {
      case "vip":
        return customers.filter((c) => c.totalSpent >= 5000);
      case "dormant":
        return customers.filter((c) => isDormant(c.lastOrderDate));
      case "high-spenders":
        return customers.filter((c) => c.totalSpent >= 2000 && c.totalSpent < 5000);
      case "recent":
        return customers.filter((c) => isRecent(c.lastOrderDate));
      case "all":
      default:
        return customers;
    }
  };

  const currentList = getFilteredCustomers(activeSegment);

  // Default Segments list
  const baseSegments = [
    {
      id: "all",
      name: "All Customers",
      desc: "Everyone in your CRM data",
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: "vip",
      name: "VIP Customers",
      desc: "Lifetime value spent >= $5,000",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: "dormant",
      name: "Dormant Leads",
      desc: "No order in the last 60 days",
      color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "high-spenders",
      name: "High Value",
      desc: "Spent between $2,000 and $5,000",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "recent",
      name: "Recent Buyers",
      desc: "Ordered in the last 30 days",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  // Merge custom segments
  const segmentsList = [...baseSegments, ...customSegments.map(s => ({
    id: s.id,
    name: s.name,
    desc: s.desc,
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  }))];

  // AI segment parsing logic
  const handleAiSegmentBuilder = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setStatusMessage("AI is analyzing criteria...");
    
    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      let minSpend = null;
      let dormant = false;
      let emailDomain = null;
      let conditions = [];

      // Parse spend rules
      const spendMatch = prompt.match(/(spend|spent|above|over|more than|>)\s*\$?(\d+)/);
      if (spendMatch) {
        minSpend = parseFloat(spendMatch[2]);
        conditions.push(`Total Spent >= $${minSpend}`);
      }

      // Parse dormant rules
      if (prompt.includes("dormant") || prompt.includes("inactive") || prompt.includes("haven't bought") || prompt.includes("no order")) {
        dormant = true;
        conditions.push("No order in last 60 days");
      }

      // Parse email rules
      if (prompt.includes("gmail")) {
        emailDomain = "gmail.com";
        conditions.push("Email contains 'gmail.com'");
      } else if (prompt.includes("yahoo")) {
        emailDomain = "yahoo.com";
        conditions.push("Email contains 'yahoo.com'");
      }

      if (conditions.length === 0) {
        // Fallback or generic filter
        minSpend = 1000;
        conditions.push("LTV >= $1,000");
      }

      const segmentName = `AI Segment: ${aiPrompt.trim().slice(0, 25)}${aiPrompt.length > 25 ? "..." : ""}`;
      const matchingCount = customers.filter(c => {
        let match = true;
        if (minSpend !== null) match = match && c.totalSpent >= minSpend;
        if (dormant) match = match && isDormant(c.lastOrderDate);
        if (emailDomain) match = match && c.email.includes(emailDomain);
        return match;
      }).length;

      setAiSegment({
        name: segmentName,
        desc: `AI-Generated: ${conditions.join(" AND ")}`,
        rules: { minSpend, dormant, emailDomain },
        count: matchingCount
      });
      setStatusMessage("");
    }, 800);
  };

  const saveAiSegment = () => {
    if (!aiSegment) return;
    
    const newId = `custom-${Date.now()}`;
    const newCustom = {
      id: newId,
      name: aiSegment.name,
      desc: aiSegment.desc,
      rules: aiSegment.rules
    };

    setCustomSegments(prev => [...prev, newCustom]);
    setActiveSegment(newId);
    setAiSegment(null);
    setAiPrompt("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight font-sans">Audience Segments</h1>
        <p className="text-sm text-slate-400 mt-1">
          Slice and dice your customer directory dynamically or let AI build your target profile group.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Segments and Customer List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Segments Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segmentsList.map((seg) => {
              const count = getFilteredCustomers(seg.id).length;
              const isActive = activeSegment === seg.id;
              
              return (
                <button
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id)}
                  className={`glass-panel glass-panel-hover flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive 
                      ? "border-brand-purple/80 bg-brand-purple/10 shadow-glow" 
                      : "border-brand-border/40 hover:border-brand-purple/40"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${seg.color} border border-white/5 mb-3`}>
                    {seg.icon}
                  </div>
                  
                  <h3 className="font-bold text-slate-200 text-sm tracking-wide group-hover:text-brand-purpleLight transition-colors">
                    {seg.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed flex-1">
                    {seg.desc}
                  </p>

                  <div className="mt-4 flex items-center justify-between w-full border-t border-brand-border/20 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Size</span>
                    <span className="font-extrabold text-base text-slate-100 bg-brand-bg/50 px-2.5 py-0.5 rounded-lg border border-brand-border/10">
                      {loading ? "..." : count}
                    </span>
                  </div>

                  {isActive && (
                    <span className="absolute top-0 right-0 w-12 h-12 bg-brand-purple/20 blur-md rounded-bl-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Customer Table List */}
          <div className="glass-panel rounded-3xl p-6 shadow-cardGlow border border-brand-border/40">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-200">Segment Roster</h2>
                <p className="text-xs text-slate-400">
                  Showing <strong className="text-brand-accentLight">{currentList.length}</strong> matching user profiles
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-border/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg/60 border-b border-brand-border/30">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Phone</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">LTV Spend</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/15">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-purple rounded-full animate-ping" />
                          Loading directory profiles...
                        </div>
                      </td>
                    </tr>
                  ) : currentList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                        No customers match the active segment criteria.
                      </td>
                    </tr>
                  ) : (
                    currentList.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-800/20 transition-all group">
                        <td className="p-4 font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                          {customer.name}
                        </td>
                        <td className="p-4 text-slate-400 text-sm">{customer.email}</td>
                        <td className="p-4 text-slate-400 text-sm">{customer.phone || "-"}</td>
                        <td className="p-4 text-slate-200 font-bold text-right text-sm">
                          ${customer.totalSpent?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-slate-400 text-center text-sm">
                          {customer.lastOrderDate ? (
                            <span className="px-2.5 py-1 bg-[#101227] border border-[#1f224a] rounded-lg text-xs">
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

        {/* Right 1 Column: AI Segment Builder */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-brand-teal/20 to-brand-accent/20 blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-brand-tealLight">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-100">AI Segment Builder</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Type targeting rules in plain language, and AI will compile standard filter conditions automatically.
            </p>

            <form onSubmit={handleAiSegmentBuilder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Target Intent
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., dormant customers with total spend above 4000"
                  rows="3"
                  className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-teal rounded-2xl p-3.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-teal to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-2xl text-white font-bold text-sm shadow-glowTeal hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Compile AI Segment
              </button>
            </form>

            {statusMessage && (
              <div className="mt-4 p-3.5 bg-slate-900/50 border-l-2 border-brand-teal text-slate-400 text-xs rounded-r-xl">
                {statusMessage}
              </div>
            )}

            {/* AI segment results preview */}
            {aiSegment && (
              <div className="mt-5 p-4 rounded-2xl bg-[#0b0c16] border border-brand-border/60 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-tealLight bg-brand-teal/10 px-2 py-0.5 border border-brand-teal/20 rounded-md uppercase tracking-wider">
                    Compiled Rules
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {aiSegment.count} found
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-200">{aiSegment.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed bg-brand-bg/50 p-2.5 rounded-lg border border-brand-border/10 font-mono text-brand-tealLight">
                    {aiSegment.desc}
                  </p>
                </div>

                <button
                  onClick={saveAiSegment}
                  className="w-full py-2.5 bg-slate-900 border border-brand-teal/40 hover:border-brand-teal/90 rounded-xl text-slate-200 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Save to Segment Deck
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Segments;
