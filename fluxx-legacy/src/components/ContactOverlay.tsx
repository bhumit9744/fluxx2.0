"use client";

import { useState } from "react";
import { Send, CheckCircle2, Mail, MapPin, Sparkles } from "lucide-react";

export function ContactOverlay() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    org: "",
    email: "",
    fleetScale: "5-20 units",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-12 font-mono">
      <div className="pointer-events-auto max-w-4xl w-full glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row gap-8 shadow-2xl">
        {/* LEFT COLUMN: HERO TEXT & CONTACT INFO */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>FINAL TOUCHDOWN // MISSION COMPLETE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              LET&apos;S BUILD THE FUTURE TOGETHER
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-sans leading-relaxed mt-3">
              Deploy autonomous sovereign VTOL fleets for commercial agriculture,
              carbon-negative bio-refining, or national food security initiatives.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>missions@fluxx-aerospace.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>FLUXX Sovereign Hangar 01, Mojave & Bengaluru</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM */}
        <div className="flex-1 glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                MISSION BRIEF RECEIVED
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 font-sans">
                Our flight operations & agronomic engineering team will initiate contact within 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs hover:bg-slate-300 dark:hover:bg-white/20 font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Commander / Director Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-xs shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Organization / Agri-Cooperative
                </label>
                <input
                  required
                  type="text"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  placeholder="Enterprise / Government Entity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-xs shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Fleet Deployment Scale
                </label>
                <select
                  value={form.fleetScale}
                  onChange={(e) => setForm({ ...form, fleetScale: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-xs shadow-sm"
                >
                  <option value="1-5 units">1 - 5 Autonomous VTOL Units</option>
                  <option value="5-20 units">5 - 20 Multi-Hectare Cohort</option>
                  <option value="20+ units">20+ Sovereign Swarm Fleet</option>
                  <option value="Biomass Refinery">Biomass Refinery Co-Development</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@enterprise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-xs shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 mt-4"
              >
                <span>Transmit Mission Request</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
