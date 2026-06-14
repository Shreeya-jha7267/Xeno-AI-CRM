import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar({ theme, toggleTheme, collapsed, setCollapsed }) {

  // SVG Icons
  const DashboardIcon = () => (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const CustomersIcon = () => (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const SegmentsIcon = () => (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const CampaignsIcon = () => (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  const InsightsIcon = () => (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  );

  const activeStyleClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 relative ${
      isActive
        ? "text-brand-lightText bg-brand-purple/20 border border-brand-purple/30 shadow-glow"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
    }`;

  const mobileActiveStyleClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 py-2 px-3 transition-all duration-300 relative text-xs font-semibold ${
      isActive ? "text-brand-accentLight scale-105" : "text-slate-400"
    }`;

  return (
    <>
      {/* Desktop Left-Hand Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#070918]/90 backdrop-blur-xl border-r border-[#181b37] text-slate-100 z-50 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-[#181b37]">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-accent flex items-center justify-center font-bold text-white shadow-glow">
              X
            </div>
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-slate-100 via-brand-purpleLight to-brand-accentLight bg-clip-text text-transparent">
              XENO CRM
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-[#11132a] border border-[#21254e] hover:bg-brand-purple/20 hover:border-brand-purpleLight text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <NavLink to="/" className={activeStyleClass}>
            {({ isActive }) => (
              <>
                <DashboardIcon />
                {!collapsed && <span>Dashboard</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-brand-purple to-brand-accent rounded-r-md glowing-active" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/customers" className={activeStyleClass}>
            {({ isActive }) => (
              <>
                <CustomersIcon />
                {!collapsed && <span>Customers</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-brand-purple to-brand-accent rounded-r-md glowing-active" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/segments" className={activeStyleClass}>
            {({ isActive }) => (
              <>
                <SegmentsIcon />
                {!collapsed && <span>Segments</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-brand-purple to-brand-accent rounded-r-md glowing-active" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/campaigns" className={activeStyleClass}>
            {({ isActive }) => (
              <>
                <CampaignIconWrapper />
                {!collapsed && <span>Campaign Studio</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-brand-purple to-brand-accent rounded-r-md glowing-active" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/analytics" className={activeStyleClass}>
            {({ isActive }) => (
              <>
                <InsightsIcon />
                {!collapsed && <span>Insights</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-brand-purple to-brand-accent rounded-r-md glowing-active" />
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#181b37] flex flex-col gap-3">
          {!collapsed && (
            <div className="px-2 py-1 rounded-lg bg-slate-900/50 border border-[#171a36] text-[10px] text-slate-500 font-semibold text-center uppercase tracking-widest">
              Gemini AI Active
            </div>
          )}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#1f2244] bg-[#0c0d1e] hover:bg-[#151733] text-slate-400 hover:text-slate-200 transition-all cursor-pointer ${
              collapsed ? "w-12 h-12" : "w-full"
            }`}
            title="Toggle Theme style"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {!collapsed && <span className="text-xs font-semibold uppercase tracking-wider">{theme === "terra" ? "Classic Mode" : "Terra Mode"}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#070918]/90 backdrop-blur-xl border-b border-[#181b37] sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-accent flex items-center justify-center font-bold text-xs text-white shadow-glow">
            X
          </div>
          <span className="font-extrabold text-sm tracking-widest text-slate-100">XENO CRM</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[#1f2244] bg-[#0c0d1e] text-slate-400 hover:text-slate-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#070918]/95 backdrop-blur-xl border-t border-[#181b37] z-50 flex justify-around items-center py-1.5 shadow-2xl">
        <NavLink to="/" className={mobileActiveStyleClass}>
          {({ isActive }) => (
            <>
              <DashboardIcon />
              <span>Dashboard</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-accentLight rounded-full shadow-glow" />}
            </>
          )}
        </NavLink>
        <NavLink to="/customers" className={mobileActiveStyleClass}>
          {({ isActive }) => (
            <>
              <CustomersIcon />
              <span>Customers</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-accentLight rounded-full shadow-glow" />}
            </>
          )}
        </NavLink>
        <NavLink to="/segments" className={mobileActiveStyleClass}>
          {({ isActive }) => (
            <>
              <SegmentsIcon />
              <span>Segments</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-accentLight rounded-full shadow-glow" />}
            </>
          )}
        </NavLink>
        <NavLink to="/campaigns" className={mobileActiveStyleClass}>
          {({ isActive }) => (
            <>
              <CampaignIconWrapper />
              <span>Campaigns</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-accentLight rounded-full shadow-glow" />}
            </>
          )}
        </NavLink>
        <NavLink to="/analytics" className={mobileActiveStyleClass}>
          {({ isActive }) => (
            <>
              <InsightsIcon />
              <span>Insights</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-accentLight rounded-full shadow-glow" />}
            </>
          )}
        </NavLink>
      </nav>
    </>
  );
}

// Inner helper component for nice campaign icon
function CampaignIconWrapper() {
  return (
    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

export default Navbar;
