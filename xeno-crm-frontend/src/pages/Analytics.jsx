import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Analytics() {
  const [campaigns, setCampaigns] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom interactive tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    value: ""
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [campaignsRes, communicationsRes] = await Promise.all([
        axios.get(`${apiUrl}/campaigns`),
        axios.get(`${apiUrl}/communications`),
      ]);

      setCampaigns(campaignsRes.data);
      setCommunications(communicationsRes.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSent = communications.length;
  const deliveredCount = communications.filter(
    (item) => item.status === "DELIVERED",
  ).length;

  const deliveryRate = totalSent ? Math.round((deliveredCount / totalSent) * 100) : 0;
  const openRate = totalSent ? 68 : 0; // Default simulated open rate
  const ctrRate = totalSent ? 34 : 0;   // Default simulated click rate
  const conversionRate = totalSent ? 14 : 0; // Simulated conversion rate

  // Channel breakdown counts
  const getChannelCount = (channel) => {
    return campaigns.filter(c => c.channel?.toLowerCase() === channel.toLowerCase()).length;
  };

  const channelStats = [
    { label: "WhatsApp", count: getChannelCount("WhatsApp") },
    { label: "Email", count: getChannelCount("Email") },
    { label: "SMS", count: getChannelCount("SMS") },
    { label: "Push", count: getChannelCount("Push") }
  ];

  const maxChannelCount = Math.max(...channelStats.map(s => s.count), 1);

  // Line chart coordinates for Campaign CTR Trend
  // We take the last 6 campaigns and plot a simulated line
  const activeCampaigns = campaigns.slice(-6);
  const lineChartData = activeCampaigns.map((c, idx) => {
    const campaignComms = communications.filter((item) => item.campaignId === c.id);
    const sent = campaignComms.length;
    const delivered = campaignComms.filter((item) => item.status === "DELIVERED").length;
    // Calculate click-through rates (base rate + seed variations)
    const baseCtr = sent ? Math.round((delivered * 0.34)) : 0;
    const ctrPct = sent ? Math.round((baseCtr / sent) * 100) : 10 + (idx * 8) % 45;
    const convPct = sent ? Math.round((baseCtr * 0.4) / sent * 100) : 4 + (idx * 5) % 18;
    return {
      name: c.name.replace("AI Campaign: ", "").slice(0, 14),
      fullName: c.name,
      ctr: ctrPct,
      conversion: convPct
    };
  });

  const handleShowTooltip = (e, title, value) => {
    const rect = e.target.getBoundingClientRect();
    const container = e.currentTarget.closest(".relative-container")?.getBoundingClientRect();
    
    // Position tooltip relative to container wrapper
    const x = rect.left - (container?.left || 0) + rect.width / 2;
    const y = rect.top - (container?.top || 0) - 45;

    setTooltip({
      visible: true,
      x,
      y,
      title,
      value
    });
  };

  const handleHideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="space-y-6 relative-container relative">
      {/* Tooltip Overlay */}
      {tooltip.visible && (
        <div
          className="absolute z-50 pointer-events-none bg-slate-950/95 border border-brand-purple/50 px-3 py-2 rounded-xl text-left shadow-glow text-xs backdrop-blur-md transition-all duration-150 animate-fadeIn"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translateX(-50%)" }}
        >
          <p className="font-extrabold text-slate-100">{tooltip.title}</p>
          <p className="text-[10px] text-brand-accentLight mt-0.5">{tooltip.value}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight font-sans">Campaign Insights</h1>
        <p className="text-sm text-slate-400 mt-1">
          Deep analytics overview covering message open rates, CTR engagement trends, and delivery performance.
        </p>
      </div>

      {/* Top Rings Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Delivery Rate Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delivery Rate</span>
            <h3 className="text-2xl font-black text-slate-100 font-sans tracking-tight">{deliveryRate}%</h3>
            <p className="text-[10px] text-slate-400">Total Sent: {totalSent}</p>
          </div>
          <div className="relative w-18 h-18">
            <svg className="w-full h-full -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#10132b" strokeWidth="5.5" fill="transparent" />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#14b8a6"
                strokeWidth="5.5"
                fill="transparent"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * deliveryRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#14b8a6]">✓</div>
          </div>
        </div>

        {/* Open Rate Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Open Rate</span>
            <h3 className="text-2xl font-black text-slate-100 font-sans tracking-tight">{openRate}%</h3>
            <p className="text-[10px] text-slate-400">Industry Avg: 22%</p>
          </div>
          <div className="relative w-18 h-18">
            <svg className="w-full h-full -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#10132b" strokeWidth="5.5" fill="transparent" />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#6366f1"
                strokeWidth="5.5"
                fill="transparent"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * openRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brand-purpleLight">✉</div>
          </div>
        </div>

        {/* CTR Rate Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Click Rate (CTR)</span>
            <h3 className="text-2xl font-black text-slate-100 font-sans tracking-tight">{ctrRate}%</h3>
            <p className="text-[10px] text-slate-400">Total Clicks: {Math.round(deliveredCount * 0.34)}</p>
          </div>
          <div className="relative w-18 h-18">
            <svg className="w-full h-full -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#10132b" strokeWidth="5.5" fill="transparent" />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#ec4899"
                strokeWidth="5.5"
                fill="transparent"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * ctrRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-pink-400">⬈</div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Conversions</span>
            <h3 className="text-2xl font-black text-slate-100 font-sans tracking-tight">{conversionRate}%</h3>
            <p className="text-[10px] text-slate-400">Goal Achievement</p>
          </div>
          <div className="relative w-18 h-18">
            <svg className="w-full h-full -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#10132b" strokeWidth="5.5" fill="transparent" />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#eab308"
                strokeWidth="5.5"
                fill="transparent"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * conversionRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-yellow-400">★</div>
          </div>
        </div>
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart Panel */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-200">CTR & Conversion Engagement Trends</h2>
            <p className="text-xs text-slate-400 mt-0.5">Plotting campaign outcome percentage points across drafts.</p>
          </div>

          <div className="h-60 relative w-full border-b border-l border-brand-border/20 pt-4 flex flex-col justify-end">
            {lineChartData.length === 0 ? (
              <div className="text-center text-xs text-slate-600 my-auto">No campaigns saved to draw trends.</div>
            ) : (
              <div className="w-full h-full relative">
                {/* SVG Line Graph */}
                <svg className="w-full h-full" viewBox="0 0 540 200" preserveAspectRatio="none">
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="ctrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline */}
                  <line x1="0" y1="50" x2="540" y2="50" stroke="#1f2244" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="540" y2="100" stroke="#1f2244" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="540" y2="150" stroke="#1f2244" strokeWidth="1" strokeDasharray="5,5" />

                  {/* Dynamic Paths */}
                  {/* CTR Path */}
                  <path
                    d={lineChartData.reduce((acc, curr, idx) => {
                      const x = (idx / Math.max(lineChartData.length - 1, 1)) * 500 + 20;
                      const y = 200 - (curr.ctr * 1.6);
                      return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, "")}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                    className="transition-all duration-1000"
                  />
                  
                  {/* CTR Area Fill */}
                  {lineChartData.length > 1 && (
                    <path
                      d={
                        lineChartData.reduce((acc, curr, idx) => {
                          const x = (idx / (lineChartData.length - 1)) * 500 + 20;
                          const y = 200 - (curr.ctr * 1.6);
                          return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, "") + 
                        ` L ${(lineChartData.length - 1) / (lineChartData.length - 1) * 500 + 20} 200 L 20 200 Z`
                      }
                      fill="url(#ctrGrad)"
                    />
                  )}

                  {/* Conversion Path */}
                  <path
                    d={lineChartData.reduce((acc, curr, idx) => {
                      const x = (idx / Math.max(lineChartData.length - 1, 1)) * 500 + 20;
                      const y = 200 - (curr.conversion * 1.6);
                      return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, "")}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    className="transition-all duration-1000"
                  />

                  {/* Interactive Nodes */}
                  {lineChartData.map((d, idx) => {
                    const x = (idx / Math.max(lineChartData.length - 1, 1)) * 500 + 20;
                    const yCtr = 200 - (d.ctr * 1.6);
                    const yConv = 200 - (d.conversion * 1.6);

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={yCtr}
                          r="6.5"
                          fill="#060813"
                          stroke="#818cf8"
                          strokeWidth="3"
                          className="hover:scale-150 hover:fill-indigo-400 transition-all duration-200 cursor-pointer"
                          onMouseEnter={(e) => handleShowTooltip(e, d.fullName, `CTR: ${d.ctr}%`)}
                          onMouseLeave={handleHideTooltip}
                        />
                        <circle
                          cx={x}
                          cy={yConv}
                          r="6.5"
                          fill="#060813"
                          stroke="#ec4899"
                          strokeWidth="3.5"
                          className="hover:scale-150 hover:fill-pink-400 transition-all duration-200 cursor-pointer"
                          onMouseEnter={(e) => handleShowTooltip(e, d.fullName, `Conversion: ${d.conversion}%`)}
                          onMouseLeave={handleHideTooltip}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X Axis Labels */}
                <div className="absolute inset-x-0 bottom-[-24px] flex justify-between px-2 text-[10px] text-slate-500 font-bold select-none">
                  {lineChartData.map((d, idx) => (
                    <span key={idx} className="truncate w-14 text-center">{d.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center justify-center text-[10px] font-bold mt-7 uppercase select-none">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#818cf8] rounded-full" /> Click-Through Rate (CTR)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#ec4899] rounded-full" /> Conversion Rate</span>
          </div>
        </div>

        {/* Bar Chart Panel */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-200">Channel Distribution</h2>
            <p className="text-xs text-slate-400 mt-0.5">Frequency of channels selected in saved campaigns.</p>
          </div>

          <div className="h-60 flex items-end justify-around border-b border-brand-border/20 pt-4 px-2 relative">
            {channelStats.map((s, idx) => {
              const barHeight = s.count ? (s.count / maxChannelCount) * 140 : 10;
              
              return (
                <div key={idx} className="flex flex-col items-center group w-12">
                  <div
                    style={{ height: `${barHeight}px` }}
                    className="w-8 rounded-t-xl bg-gradient-to-t from-brand-purple to-brand-accentLight border border-brand-purpleLight/30 transition-all duration-500 group-hover:from-brand-purpleLight group-hover:to-brand-accent shadow-inner relative cursor-pointer"
                    onMouseEnter={(e) => handleShowTooltip(e, `${s.label} Campaigns`, `${s.count} draft(s)`)}
                    onMouseLeave={handleHideTooltip}
                  >
                    <span className="absolute -top-6 inset-x-0 text-[10px] font-bold text-brand-purpleLight text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {s.count}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-2 rotate-12 select-none group-hover:text-slate-300 transition-colors">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-center text-slate-500 font-semibold mt-4">
            Frequency across {campaigns.length} CRM campaigns
          </div>
        </div>
      </div>

      {/* Campaigns list Table */}
      <div className="glass-panel rounded-3xl p-6 shadow-cardGlow border border-brand-border/40">
        <h2 className="text-base font-bold text-slate-200 mb-4">Detailed Performance Table</h2>
        
        <div className="overflow-x-auto rounded-xl border border-brand-border/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/60 border-b border-brand-border/30">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Campaign</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Channel</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Sent</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Delivered</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Reads</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/15">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-semibold">
                    Fetching campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-semibold">
                    No campaigns recorded yet. Create and launch a campaign in AI Studio.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const comms = communications.filter((item) => item.campaignId === c.id);
                  const sent = comms.length;
                  const delivered = comms.filter((item) => item.status === "DELIVERED").length;
                  const reads = Math.round(delivered * 0.68);
                  const clicks = Math.round(delivered * 0.34);

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/15 transition-all text-sm group">
                      <td className="p-4 font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                        {c.name}
                      </td>
                      <td className="p-4 text-slate-400">{c.channel || "WhatsApp"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          c.status === "RUNNING" || c.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border border-brand-border/10"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 text-right font-medium">{sent}</td>
                      <td className="p-4 text-emerald-400 text-right font-semibold">{delivered}</td>
                      <td className="p-4 text-slate-400 text-right">{reads}</td>
                      <td className="p-4 text-brand-purpleLight text-right font-semibold">{clicks}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
