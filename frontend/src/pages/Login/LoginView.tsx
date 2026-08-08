import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lock, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const LoginView: React.FC = () => {
  const { setAppMode } = useEnvironmentStore();
  const [email, setEmail] = useState('operator@fluxx.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [authStep, setAuthStep] = useState<'idle' | 'auth' | 'map' | 'data' | 'ready'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthStep('auth');
    await new Promise((r) => setTimeout(r, 600));

    setAuthStep('map');
    await new Promise((r) => setTimeout(r, 600));

    setAuthStep('data');
    await new Promise((r) => setTimeout(r, 600));

    setAuthStep('ready');
    await new Promise((r) => setTimeout(r, 400));

    setAppMode('dashboard');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#080B10] px-4 select-none relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 glow-gradient-teal pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0D131C]/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10"
      >
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0EA89A] to-[#3DD6C6] flex items-center justify-center mx-auto shadow-lg shadow-[#0EA89A]/30">
            <Globe className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="font-display text-2xl font-black text-white tracking-wider">
            FLUXX COMMAND CENTER
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Authorized Environmental Operator Terminal
          </p>
        </div>

        {authStep === 'idle' ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">
                Operator Identifier
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#3DD6C6]"
                  placeholder="operator@fluxx.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">
                Access Token / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#3DD6C6]"
                  placeholder="••••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0EA89A] to-[#3DD6C6] text-slate-950 font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#0EA89A]/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAppMode('home')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Cinematic Experience
              </button>
            </div>
          </form>
        ) : (
          /* Transition Progress Sequence */
          <div className="space-y-4 py-4 font-mono text-xs">
            <div className="flex items-center space-x-3 text-[#3DD6C6]">
              {authStep === 'auth' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              <span className="font-bold">AUTHENTICATING OPERATOR...</span>
            </div>

            <div className={`flex items-center space-x-3 transition-colors ${authStep === 'auth' ? 'text-slate-600' : 'text-[#3DD6C6]'}`}>
              {authStep === 'map' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : authStep === 'data' || authStep === 'ready' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700" />
              )}
              <span className="font-bold">MAP INITIALIZING (KHARGHAR 3D)...</span>
            </div>

            <div className={`flex items-center space-x-3 transition-colors ${authStep === 'ready' || authStep === 'data' ? 'text-[#3DD6C6]' : 'text-slate-600'}`}>
              {authStep === 'data' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : authStep === 'ready' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700" />
              )}
              <span className="font-bold">DATA REPLAY STREAM CONNECTED...</span>
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
};
