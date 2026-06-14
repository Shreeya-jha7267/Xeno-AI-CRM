import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [customersRes, campaignsRes, communicationsRes] = await Promise.all([
        axios.get(`${apiUrl}/customers`),
        axios.get(`${apiUrl}/campaigns`),
        axios.get(`${apiUrl}/communications`),
      ]);

      setCustomers(customersRes.data);
      setCampaigns(campaignsRes.data);
      setCommunications(communicationsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deliveredCount = communications.filter(
    (item) => item.status === "DELIVERED",
  ).length;
  
  const deliveryRate = communications.length
    ? Math.round((deliveredCount / communications.length) * 100)
    : 0;

  // Render miniature trend graphs for stats cards
  const MiniTrendLine = ({ strokeColor }) => (
    <svg className="w-16 h-8 opacity-70" viewBox="0 0 80 30">
      <path
        d="M 5 25 Q 20 5, 35 18 T 65 8 L 75 15"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-brand-border/40 shadow-cardGlow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-purple/10 to-brand-accent/15 blur-2xl pointer-events-none" />

        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] text-brand-purpleLight font-bold uppercase tracking-widest bg-brand-purple/15 px-2.5 py-1 rounded-md border border-brand-purple/20">
            System Control Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight font-sans mt-2">
            Welcome to Xeno AI-CRM
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate and deploy smart AI-native customer conversion strategies, segments, and campaigns in minutes. Monitor customer interactions and campaign outcomes in real time.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/campaigns"
            className="px-5 py-3 bg-gradient-to-r from-brand-purple to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold text-xs shadow-glow hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            Launch AI Studio
          </Link>
          <Link
            to="/segments"
            className="px-5 py-3 bg-slate-900 border border-brand-border hover:bg-[#151733] hover:border-slate-500 text-slate-300 hover:text-white rounded-2xl font-bold text-xs transition-all cursor-pointer"
          >
            Build Segments
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LTV Customers Stat */}
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-brand-border/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Customers</span>
            <span className="p-2 bg-indigo-500/10 text-brand-purpleLight rounded-xl border border-indigo-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-3xl font-black text-slate-100 font-sans tracking-tight">
                {loading ? "..." : customers.length}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Directory profiles</p>
            </div>
            <MiniTrendLine strokeColor="#818cf8" />
          </div>
        </div>

        {/* AI Campaigns Stat */}
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-brand-border/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Campaigns</span>
            <span className="p-2 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-3xl font-black text-slate-100 font-sans tracking-tight">
                {loading ? "..." : campaigns.length}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Generated campaigns</p>
            </div>
            <MiniTrendLine strokeColor="#ec4899" />
          </div>
        </div>

        {/* Messages Sent Stat */}
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-brand-border/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Messages Sent</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-3xl font-black text-slate-100 font-sans tracking-tight">
                {loading ? "..." : communications.length}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Queued dispatch</p>
            </div>
            <MiniTrendLine strokeColor="#10b981" />
          </div>
        </div>

        {/* Delivery Rate Stat */}
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-brand-border/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delivery Rate</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-3xl font-black text-slate-100 font-sans tracking-tight">
                {loading ? "..." : `${deliveryRate}%`}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Confirmed delivery</p>
            </div>
            <MiniTrendLine strokeColor="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-200">Recent Campaigns Log</h2>
            <p className="text-xs text-slate-400 mt-0.5">Summary tracker for campaign dispatch and deployment.</p>
          </div>
          <Link
            to="/analytics"
            className="text-xs text-brand-purpleLight font-bold hover:underline flex items-center gap-1"
          >
            Open Insights
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-brand-border/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/60 border-b border-brand-border/30">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Campaign</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Channel</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/15">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-semibold">
                    Syncing database logs...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-semibold">
                    No campaigns recorded yet.
                  </td>
                </tr>
              ) : (
                campaigns.slice(0, 6).map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-800/15 transition-all text-sm group">
                    <td className="p-4 font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                      {campaign.name}
                    </td>
                    <td className="p-4 text-slate-400">{campaign.channel}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        campaign.status === "RUNNING" || campaign.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border border-brand-border/10"
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-right">
                      {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
