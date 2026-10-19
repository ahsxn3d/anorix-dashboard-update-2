'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Command,
  Bell,
  Calendar,
  Sparkles,
  Menu,
  Bot,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Zap,
  Activity,
  FolderKanban,
  MessageSquare,
  Globe,
  Settings,
  Layers
} from 'lucide-react';
import { sound } from '@/lib/sound';
import { StatusRadarPulse } from './StatusRadarPulse';
import { CyberScrambleText } from './CyberScrambleText';
import { NavTab } from '@/lib/types';

interface HeaderProps {
  activeTab?: NavTab;
  onSearchChange?: (term: string) => void;
  onToggleMobileSidebar?: () => void;
  onToggleAiSidebar?: () => void;
  isAiSidebarOpen?: boolean;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  onTriggerCmsReload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'inquiries',
  onSearchChange,
  onToggleMobileSidebar,
  onToggleAiSidebar,
  isAiSidebarOpen = false,
  selectedTimeframe,
  setSelectedTimeframe,
  onTriggerCmsReload
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);

  const tabLabels: Record<NavTab, { label: string; icon: typeof MessageSquare; code: string }> = {
    inquiries: { label: 'INQUIRIES PIPELINE', icon: MessageSquare, code: 'MOD_01' },
    deployments: { label: 'PROJECT DEPLOYMENTS', icon: FolderKanban, code: 'MOD_02' },
    cms: { label: 'WEBSITE CMS STUDIO', icon: Globe, code: 'MOD_03' },
    settings: { label: 'SETTINGS & SECURITY', icon: Settings, code: 'MOD_04' }
  };

  // Trigger bounce & ripple wave on page switch
  useEffect(() => {
    setBounceKey((k) => k + 1);
  }, [activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const timeframes = ['Today', '7 Days', '30 Days', 'Year-to-Date', 'Custom'];
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState('2026-08-20');

  const handleTimeframeClick = (tf: string) => {
    sound.playHoverTick();
    setSelectedTimeframe(tf);
    if (tf === 'Custom') {
      setShowCustomDatePicker(!showCustomDatePicker);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const handleSyncClick = () => {
    sound.playChime();
    setIsSyncing(true);
    if (onTriggerCmsReload) onTriggerCmsReload();
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const currentTabInfo = tabLabels[activeTab] || tabLabels.inquiries;
  const ActiveIcon = currentTabInfo.icon;

  return (
    <header className="w-full relative z-20">
      {/* Dynamic Animated Outline with Boss Bounce on Page Shift */}
      <motion.div
        key={`header-outline-${bounceKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-14 px-4 md:px-6 bg-black/80 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 border-b border-white/10"
      >
        {/* Left Section: Active Page Embossed Pill Badge with Ripple & Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-2xl">
          {/* Mobile Sidebar Menu Trigger */}
          <motion.button
            onClick={onToggleMobileSidebar}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="md:hidden p-2 rounded-full text-white/70 hover:text-white shrink-0 cursor-pointer border border-white/15"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </motion.button>

          {/* Active Page Embossed Pill ("Boss Effect") with Spring Ripple Bounce on Page Shift */}
          <motion.div
            key={`page-pill-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="hidden sm:flex items-center gap-2.5 px-1 py-1 shrink-0"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-7 h-7 rounded-full text-white/70 flex items-center justify-center shrink-0"
            >
              <ActiveIcon className="w-3.5 h-3.5" />
            </motion.div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] tracking-[-0.02em] text-white">
                <CyberScrambleText
                  text={currentTabInfo.label}
                  scrambleSpeed={25}
                  cycles={2}
                  triggerKey={bounceKey}
                />
              </span>
            </div>
            <span className="text-[10px] tracking-[0.14em] text-white/35 px-1.5">
              {currentTabInfo.code}
            </span>
          </motion.div>

          {/* Compact Search Bar with 3D Embossed Pill Depth */}
          <div className="relative w-full max-w-sm group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/35 group-focus-within:text-white transition-colors">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search leads, CMS, nodes..."
              className="w-full pl-8 pr-9 py-1.5 text-xs rounded-full bg-transparent text-white placeholder-white/30 focus:outline-none border border-white/15 focus:border-white/60 transition-colors duration-500"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-white/40 border border-white/15 rounded-full">
                <Command className="w-2 h-2" /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Timeframe Selector, Sync & AI Drawer Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Timeframe Selector Pill Capsule with 3D Embossed Sliders */}
          <div className="relative hidden md:flex items-center">
            <div className="flex items-center gap-1">
              {timeframes.map((tf) => {
                const isSelected = selectedTimeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => handleTimeframeClick(tf)}
                    className={`relative px-3 py-1 text-[12px] rounded-full transition-colors duration-500 cursor-pointer z-10 select-none ${
                      isSelected ? 'text-black' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="header-timeframe-pill"
                        className="absolute inset-0 rounded-full bg-white -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      />
                    )}
                    <span>{tf}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Date Picker Popover */}
            <AnimatePresence>
              {selectedTimeframe === 'Custom' && showCustomDatePicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-12 right-0 w-64 p-3.5 bg-[#0a0a0a] rounded-2xl z-50 border border-white/10"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" /> Date Range
                    </span>
                    <button
                      onClick={() => setShowCustomDatePicker(false)}
                      className="text-[10px] text-[#A1A1A1] hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-mono text-[#A1A1A1] block mb-0.5">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded-lg bg-[#0A0A0A] text-slate-100 border border-white/10 focus:border-[#3B82F6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#A1A1A1] block mb-0.5">End Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded-lg bg-[#0A0A0A] text-slate-100 border border-white/10 focus:border-[#3B82F6]"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowCustomDatePicker(false);
                        setSelectedTimeframe(`Custom (${customStartDate} to ${customEndDate})`);
                      }}
                      className="w-full py-1.5 text-xs rounded-full bg-white text-black cursor-pointer"
                    >
                      Apply Range
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sync CMS State Button with Embossed Pill Design */}
          {onTriggerCmsReload && (
            <motion.button
              onClick={handleSyncClick}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="p-1.5 md:px-3 py-1.5 rounded-full bg-transparent hover:bg-white hover:text-black text-white border border-white/20 transition-colors duration-500 cursor-pointer flex items-center gap-1.5 text-xs"
              title="Authenticate & Re-sync Headless CMS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline text-[11px]">Sync Cloud</span>
            </motion.button>
          )}

          {/* Notifications Button with Embossed Pill Circle */}
          <div className="relative">
            <motion.button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-full text-white/60 hover:text-white border border-white/15 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-white rounded-full" />
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-3 w-80 p-4 bg-[#0a0a0a] rounded-2xl z-50 border border-white/10"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <StatusRadarPulse
                      status="LIVE"
                      label="Live Telemetry"
                      sublabel="Edge Streams"
                      size="sm"
                      className="bg-transparent border-none p-0 shadow-none"
                    />
                    <span className="text-[10px] font-mono text-[#A1A1A1] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="flex flex-col gap-2.5 mt-3 max-h-64 overflow-y-auto">
                    <div className="p-3 rounded-xl bg-black border border-white/10 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs">High-Priority Brief Received</p>
                        <span className="text-[9px] font-mono text-green-300">Just now</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Elena Rostova requested WebGL architectural proposal ($7k - $15k).
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle AI Assistant Drawer Button with 3D Embossed Pill Finish */}
          <motion.button
            onClick={onToggleAiSidebar}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 transition-colors duration-500 cursor-pointer border ${
              isAiSidebarOpen
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/20 hover:bg-white hover:text-black'
            }`}
            title={isAiSidebarOpen ? 'Close AI Studio Assistant' : 'Open AI Studio Assistant'}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wide hidden sm:inline">AI Copilot</span>
            {isAiSidebarOpen ? (
              <PanelRightClose className="w-3 h-3" />
            ) : (
              <PanelRightOpen className="w-3 h-3" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </header>
  );
};
