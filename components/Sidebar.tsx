'use client'

import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  FolderKanban,
  Globe,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { NavTab } from '@/lib/types';
import { sound } from '@/lib/sound';
import { PlayfulLogo } from './PlayfulLogo';
import { StatusRadarPulse } from './StatusRadarPulse';
import { CyberScrambleText } from './CyberScrambleText';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onCloseMobile?: () => void;
  isLoggedIn?: boolean;
  user?: { name: string; email: string; avatar: string };
  onOpenSignIn?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onCloseMobile,
  isLoggedIn = true,
  user = {
    name: 'Ahsan Javed',
    email: 'ahsxn3d@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  onOpenSignIn
}) => {
  const navItems = [
    {
      id: 'inquiries' as NavTab,
      label: 'Inquiries Pipeline',
      icon: MessageSquare,
      badge: null,
      accentColor: 'from-[#3B82F6] to-[#3B82F6]'
    },
    {
      id: 'deployments' as NavTab,
      label: 'Deployments',
      icon: FolderKanban,
      badge: null,
      accentColor: 'from-[#A1A1A1] to-[#3b82f6]'
    },
    {
      id: 'cms' as NavTab,
      label: 'Website CMS',
      icon: Globe,
      badge: null,
      accentColor: 'from-[#A1A1A1] to-[#3B82F6]'
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & Security',
      icon: Settings,
      badge: null,
      accentColor: 'from-[#3B82F6] to-[#3B82F6]'
    }
  ];

  return (
    <aside className="w-60 bg-black h-screen px-4 py-5 flex flex-col justify-between shrink-0 select-none z-30 border-r border-white/10 relative overflow-hidden">

      {/* Top Section: Multi-Animated Logo & Navigation */}
      <div className="flex flex-col gap-5 relative z-10">
        {/* Signature Animated Playful Studio Logo with Continuous Virtual Working Aura */}
        <div className="flex flex-col items-center gap-1.5">
          <PlayfulLogo
            onClick={() => {
              setActiveTab('inquiries');
            }}
            brandText="ANORIX"
            autoPlay={true}
            interval={4000}
            className="w-full justify-center"
          />
          <div className="text-center px-1">
            <span className="text-[10px] tracking-[0.18em] uppercase text-white/40 block">
              ANORIX STUDIO // DIGITAL ARTIST & DEV
            </span>
            <span className="text-[10px] tracking-[0.16em] uppercase text-white/30 block mt-1">
              STUDIO COCKPIT v3.0 // HIGH-PERFORMANCE WEB ENGINEERING
            </span>
          </div>
        </div>

        {/* Live Quantum Telemetry Banner with StatusRadarPulse & Embossed Finish */}
        <motion.div
          className="p-3 rounded-2xl bg-[#0a0a0a] flex items-center justify-between border border-white/10 relative overflow-hidden group"
          whileHover={{ y: -1, borderColor: 'rgba(59, 130, 246,0.6)' }}
        >
          {/* Animated Laser Light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <StatusRadarPulse
            status="OPTIMAL"
            label="Cockpit Engine"
            sublabel="Sub-20ms Mesh"
            size="sm"
            className="border-none bg-transparent p-0 shadow-none"
          />
          <div className="p-1.5 rounded-full border border-white/15 text-white/60">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Navigation Section with 3D Embossed Pill Buttons ("Boss Effect") */}
        <nav className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              <CyberScrambleText text="COMMAND MODULES" scrambleSpeed={25} cycles={2} triggerKey={activeTab} />
            </span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onMouseEnter={() => sound.playHoverTick()}
                onClick={() => {
                  sound.playChime();
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-full text-[13px] transition-colors duration-500 group relative cursor-pointer select-none ${
                  isActive
                    ? 'text-black bg-white'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {/* Icon & Label Left Group */}
                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500 shrink-0 ${
                      isActive
                        ? 'text-black'
                        : 'text-white/45 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide text-xs font-semibold text-left truncate">
                    {item.label}
                  </span>
                </div>

                {/* Badge Tag */}
                {item.badge && (
                  <span
                    className={`relative z-10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-sm transition-transform shrink-0 ${
                      item.id === 'inquiries'
                        ? 'bg-[#A1A1A1]/20 text-[#A1A1A1] border border-[#A1A1A1]/50 shadow-[0_0_8px_rgba(161, 161, 161,0.4)] animate-pulse'
                        : isActive
                        ? 'bg-white/20 text-white border border-white/40'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile Card or Sign In Button with Embossed Finish */}
      <div className="pt-3 flex flex-col gap-2.5 border-t border-white/10 relative z-10">
        {isLoggedIn ? (
          <motion.div
            onClick={() => {
              setActiveTab('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="p-2.5 rounded-2xl bg-transparent hover:bg-white/5 transition-colors duration-500 flex items-center justify-between group cursor-pointer border border-white/10"
            title="Open Settings & Security"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#090317] shadow-[0_0_8px_#22C55E]" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-white group-hover:text-[#A1A1A1] transition-colors flex items-center gap-1 truncate">
                  <span className="truncate">{user.name}</span>
                  <ShieldCheck className="w-3 h-3 text-[#A1A1A1] shrink-0" />
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1 shrink-0 ml-1" />
          </motion.div>
        ) : (
          <motion.button
            onClick={() => {
              if (onOpenSignIn) onOpenSignIn();
              if (onCloseMobile) onCloseMobile();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full p-2.5 rounded-full bg-gradient-to-r from-[#171717] via-[#2a134a] to-[#171717] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(66,133,244,0.35)] hover:shadow-[0_0_25px_rgba(66,133,244,0.5)] transition-all flex items-center justify-between group cursor-pointer border border-[#4285F4]/50 hover:border-[#4285F4]"
            title="Sign in with Google Account"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Sign In</span>
                  <span className="text-[10px] font-normal text-[#A1A1A1]">• Google</span>
                </span>
                <span className="text-[9px] text-[#A1A1A1] font-mono">
                  Workspace OAuth
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-transform shrink-0" />
          </motion.button>
        )}
      </div>
    </aside>
  );
};
