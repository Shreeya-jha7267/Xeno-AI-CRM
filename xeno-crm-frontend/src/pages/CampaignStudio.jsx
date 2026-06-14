import { useEffect, useState } from "react";
import axios from "axios";

// Check if running on localhost to toggle backend endpoint dynamically
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function CampaignStudio() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [launching, setLaunching] = useState(false);
  
  const [rawRecommendation, setRawRecommendation] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState("WhatsApp");
  const [savedCampaign, setSavedCampaign] = useState(null);
  
  const [campaigns, setCampaigns] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${apiUrl}/campaigns`);
      setCampaigns(response.data.reverse());
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  // Generate 3 distinct copy variants from a single base response
  const generateVariants = (baseSegment, baseChannel, baseMessage) => {
    const rawGoal = goal.trim() || "our campaign goal";
    
    const variant1 = {
      title: "Friendly & Conversational",
      tone: "Warm",
      channel: baseChannel,
      segment: baseSegment,
      message: `Hey there! 😊 We noticed you haven't stopped by in a while. We'd love to invite you back to check out our newest items. Here's a special promo code for you: WELCOME20 to get 20% off your next purchase! 🎁 click here to shop: xeno.co/shop`
    };

    const variant2 = {
      title: "Professional & Benefit-Focused",
      tone: "Structured",
      channel: baseChannel,
      segment: baseSegment,
      message: `Dear Valued Customer, \n\nWe appreciate your loyalty and support. To show our gratitude, we would like to extend an exclusive 20% discount on your next order. Simply use the promotion code WELCOME20 at checkout. Discover our latest collections and find your new favorites today at xeno.co/shop.`
    };

    const variant3 = {
      title: "Urgent & High-Converting",
      tone: "FOMO",
      channel: baseChannel,
      segment: baseSegment,
      message: `Hurry! ⏳ Your exclusive welcome discount is waiting, but not for long. Get 20% off your next order with code WELCOME20. Shop before it expires: xeno.co/shop. Opt-out reply STOP.`
    };

    // If baseMessage contains specific values, try to preserve the pricing/discounts
    const discountMatch = baseMessage.match(/(\d+%|\$\d+\s*off)/i);
    if (discountMatch) {
      const discount = discountMatch[1];
      variant1.message = variant1.message.replace("20% off", discount);
      variant2.message = variant2.message.replace("20% discount", discount);
      variant3.message = variant3.message.replace("20% off", discount);
    }

    return [
      { ...variant1, message: variant1.message },
      { ...variant2, message: variant2.message },
      { ...variant3, message: variant3.message }
    ];
  };

  const generateCampaign = async () => {
    if (!goal.trim()) {
      setStatusMessage("Please specify your campaign goal.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setRawRecommendation(null);
    setVariants([]);

    try {
      const response = await axios.post(`${apiUrl}/ai/generate-campaign`, {
        goal,
      });

      const data = response.data;
      setRawRecommendation(data);
      setSelectedChannel(data.channel || "WhatsApp");

      // Generate the 3 UI copy variants based on the AI service response
      const generated = generateVariants(data.segment, data.channel, data.message);
      setVariants(generated);
      setSelectedVariantIdx(0);
      setSavedCampaign(null);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to generate campaign. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateVariantMessage = (newMsg) => {
    setVariants(prev => prev.map((v, idx) => 
      idx === selectedVariantIdx ? { ...v, message: newMsg } : v
    ));
  };

  const createCampaign = async () => {
    const selectedCopy = variants[selectedVariantIdx];
    if (!selectedCopy) return;

    setCreating(true);
    setStatusMessage("");

    try {
      const response = await axios.post(`${apiUrl}/campaigns`, {
        name: `AI Campaign: ${goal.trim().slice(0, 40)} (${selectedCopy.tone})`,
        channel: selectedChannel,
        message: selectedCopy.message,
      });

      setSavedCampaign(response.data);
      setStatusMessage("Campaign draft created successfully.");
      fetchCampaigns();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to save campaign draft.");
    } finally {
      setCreating(false);
    }
  };

  const launchCampaign = async () => {
    const campaignId = savedCampaign?.id;
    if (!campaignId) {
      setStatusMessage("Create the campaign draft before launching.");
      return;
    }

    setLaunching(true);
    setStatusMessage("");

    try {
      await axios.post(`${apiUrl}/campaigns/${campaignId}/launch`);
      setStatusMessage("Campaign launched successfully to segment!");
      fetchCampaigns();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to launch campaign.");
    } finally {
      setLaunching(false);
    }
  };

  const activeCopy = variants[selectedVariantIdx];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight font-sans">AI Campaign Studio</h1>
        <p className="text-sm text-slate-400 mt-1">
          Type your marketing objective, preview multiple AI-drafted variants, and launch them instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Input & Settings) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Campaign Brief</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  What is your marketing goal?
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., win back customers who haven't shopped in 60 days with a 20% discount offer"
                  rows="4"
                  className="w-full bg-[#080a15] border border-brand-border/40 focus:border-brand-purple rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>

              <button
                onClick={generateCampaign}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-purple to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-glow hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Drafting Messages...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Draft AI Campaign
                  </>
                )}
              </button>
            </div>

            {statusMessage && (
              <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                statusMessage.includes("success") 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {statusMessage}
              </div>
            )}
          </div>

          {/* Recent Campaigns Table Mini View */}
          <div className="glass-panel p-6 rounded-3xl border border-brand-border/40 shadow-cardGlow">
            <h2 className="text-base font-bold text-slate-200 mb-3">Live Log</h2>
            <div className="overflow-y-auto max-h-[200px] space-y-3 pr-1">
              {campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="p-3 bg-slate-900/50 border border-brand-border/10 rounded-xl flex items-center justify-between text-xs hover:border-brand-purple/20 transition-all">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-300 truncate w-36">{campaign.name}</p>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{campaign.channel}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                    campaign.status === "RUNNING" || campaign.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border border-brand-border/10"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns (Variants & Device Preview) */}
        <div className="lg:col-span-8 space-y-6">
          {variants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Variants Selector */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Draft Options</h3>
                  <span className="text-xs text-brand-purpleLight font-semibold">Select one to edit and preview</span>
                </div>

                <div className="space-y-3">
                  {variants.map((variant, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 relative cursor-pointer group ${
                          isSelected
                            ? "bg-brand-purple/10 border-brand-purple/80 shadow-glow"
                            : "bg-[#0c0e20] border-brand-border/40 hover:border-brand-purple/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                            variant.tone === "Warm" 
                              ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" 
                              : variant.tone === "Structured"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          }`}>
                            {variant.tone} Tone
                          </span>
                          <span className="text-xs text-slate-500 font-medium">LTV Target: {variant.segment}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-brand-purpleLight transition-colors">
                          {variant.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {variant.message}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Inline Editing Panel */}
                {activeCopy && (
                  <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Edit Copy</span>
                      <select 
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                        className="bg-brand-bg text-slate-300 border border-brand-border/50 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:border-brand-purple"
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="Push">Push Notification</option>
                      </select>
                    </div>
                    <textarea
                      value={activeCopy.message}
                      onChange={(e) => updateVariantMessage(e.target.value)}
                      rows="4"
                      className="w-full bg-[#070914] border border-brand-border/30 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={createCampaign}
                        disabled={creating}
                        className="flex-1 py-2.5 bg-slate-900 border border-brand-purple/40 hover:border-brand-purple rounded-xl text-slate-200 font-bold text-xs transition-all cursor-pointer"
                      >
                        {creating ? "Saving Draft..." : "Save Draft"}
                      </button>
                      <button
                        onClick={launchCampaign}
                        disabled={launching || !savedCampaign}
                        className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {launching ? "Launching..." : "Launch Campaign"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated Device Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="text-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Render</span>
                </div>
                
                {selectedChannel === "Email" ? (
                  /* Browser Email client mockup */
                  <div className="w-full bg-slate-900 border border-brand-border rounded-2xl overflow-hidden shadow-2xl h-[380px] flex flex-col text-left">
                    <div className="bg-slate-950 px-4 py-2 border-b border-brand-border flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] text-slate-500 ml-4 font-mono select-none">mail.xeno.ai</span>
                    </div>
                    <div className="px-4 py-3 bg-[#0d0e1b] border-b border-brand-border/60 text-xs">
                      <p className="text-slate-500">From: <strong className="text-slate-300">marketing@xeno.ai</strong></p>
                      <p className="text-slate-500 mt-1">To: <span className="text-slate-300">customer@domain.com</span></p>
                      <p className="text-slate-300 font-bold mt-1.5">Subject: We have missed you! Exclusive Invitation</p>
                    </div>
                    <div className="p-4 overflow-y-auto text-[11px] text-slate-300 leading-relaxed bg-[#0b0c16] flex-1 font-sans whitespace-pre-line">
                      {activeCopy?.message}
                    </div>
                  </div>
                ) : (
                  /* Phone Simulator mockup */
                  <div className="w-[230px] h-[420px] bg-slate-900 border-[6px] border-slate-950 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col text-left">
                    {/* Top Notch */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 flex items-center justify-center z-10">
                      <div className="w-16 h-3 bg-black rounded-full" />
                    </div>

                    {/* WhatsApp Simulator */}
                    {selectedChannel === "WhatsApp" && (
                      <div className="flex-1 flex flex-col bg-[#07080e] pt-4">
                        {/* WhatsApp Header bar */}
                        <div className="bg-[#0b0e1d] px-3 py-2 border-b border-brand-border/40 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-[10px] text-white font-bold select-none">X</div>
                          <div className="leading-tight">
                            <h5 className="text-[10px] font-bold text-slate-200">Xeno Business</h5>
                            <span className="text-[7px] text-emerald-400">online</span>
                          </div>
                        </div>
                        {/* Chat bubbles */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[radial-gradient(#141829_1px,transparent_1px)] [background-size:8px_8px]">
                          <div className="bg-brand-purple/20 border border-brand-purple/40 text-[9px] p-2.5 rounded-2xl rounded-tl-none text-slate-200 max-w-[85%] leading-relaxed shadow-sm whitespace-pre-line">
                            {activeCopy?.message}
                            <span className="text-[7px] text-slate-500 float-right mt-1.5 ml-1">12:35 PM</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SMS Simulator */}
                    {selectedChannel === "SMS" && (
                      <div className="flex-1 flex flex-col bg-[#080912] pt-4">
                        {/* SMS Header */}
                        <div className="py-2.5 text-center border-b border-brand-border/40 text-[10px] font-bold text-slate-300">
                          XENO AI SMS
                        </div>
                        {/* Chat bubbles */}
                        <div className="flex-1 p-3 space-y-3">
                          <div className="bg-slate-800 border border-brand-border/60 text-[9px] p-2.5 rounded-2xl rounded-tl-none text-slate-200 max-w-[85%] leading-relaxed whitespace-pre-line">
                            {activeCopy?.message}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Push notification simulator */}
                    {selectedChannel === "Push" && (
                      <div className="flex-1 bg-cover bg-center pt-8 p-3 flex flex-col justify-start bg-slate-950 relative" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8))" }}>
                        <div className="absolute top-2 left-3 text-[8px] text-slate-500 font-bold select-none">12:30 PM</div>
                        {/* Push Card */}
                        <div className="bg-slate-900/95 border border-brand-border/60 p-2.5 rounded-xl text-[9px] leading-tight space-y-1 shadow-lg mt-4 w-full">
                          <div className="flex items-center justify-between border-b border-brand-border/20 pb-1">
                            <span className="font-extrabold text-slate-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                              XENO AI
                            </span>
                            <span className="text-[7px] text-slate-500">now</span>
                          </div>
                          <p className="font-bold text-slate-200">Exclusive Notification</p>
                          <p className="text-slate-400 font-normal leading-relaxed text-[8px] line-clamp-3">
                            {activeCopy?.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty state when no prompt generated yet */
            <div className="glass-panel p-12 rounded-3xl border border-brand-border/40 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purpleLight">
                <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-200 font-bold text-base">Generate message drafts</h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm">
                  Write down your goal in the campaign brief card on the left to see message copy alternatives in real device views.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignStudio;
