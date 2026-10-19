'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Zap,
  TrendingUp,
  BarChart2,
  Copy,
  Check,
  X,
  Key,
  ChevronDown,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  Database
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { StatusRadarPulse } from './StatusRadarPulse';
import { sound } from '@/lib/sound';

interface RightAiAssistantProps {
  onCloseMobile?: () => void;
  onClose?: () => void;
}

export type GeminiModelId =
  | 'gemini-3.6-flash'
  | 'gemini-3.7-flash'
  | 'gemini-flash-latest'
  | 'gemini-pro-latest'
  | 'gemini-3.1-pro-preview';

interface ModelOption {
  id: GeminiModelId;
  name: string;
  badge: string;
  description: string;
  speed: string;
}

const GEMINI_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    badge: 'DEFAULT // RECOMMENDED',
    description: 'Ultra fast sub-second telemetry & live PostgreSQL analytics.',
    speed: '< 0.5s'
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    badge: 'HYBRID REASONING',
    description: 'High-speed cognitive analysis & complex system synthesis.',
    speed: '< 0.6s'
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    badge: 'AUTO STABLE',
    description: 'Continuous tracking of the latest stable production Flash.',
    speed: '< 0.7s'
  },
  {
    id: 'gemini-pro-latest',
    name: 'Gemini Pro Latest',
    badge: 'PRO ARCHITECT',
    description: 'Deep architectural logic, code generation & multi-step plans.',
    speed: '~ 1.5s'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    badge: 'ADVANCED LAB',
    description: 'Cutting-edge reasoning preview for full-stack workflows.',
    speed: '~ 2.0s'
  }
];

export const RightAiAssistant: React.FC<RightAiAssistantProps> = ({ onCloseMobile, onClose }) => {
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.6-flash');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '⚡ **ANORIX Chief Analytics Intelligence Online.**\n\nI am connected directly to your **Neon PostgreSQL database** and powered by **Google Gemini AI**.\n\nAsk me for real-time inquiry metrics, active transmissions, conversion breakdowns, archived briefs, deployments telemetry, or Next.js 16 full-stack architecture.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage if saved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('anorent_custom_gemini_key');
      if (savedKey) setCustomApiKey(savedKey);
      const savedModel = localStorage.getItem('anorent_selected_gemini_model') as GeminiModelId;
      if (savedModel && GEMINI_MODELS.some((m) => m.id === savedModel)) {
        setSelectedModel(savedModel);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anorent_custom_gemini_key', key);
    }
  };

  const handleSelectModel = (modelId: GeminiModelId) => {
    setSelectedModel(modelId);
    setIsModelDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anorent_selected_gemini_model', modelId);
    }
    sound.playHoverTick();
  };

  const suggestedQuestions = [
    '✨ Add Cyberpunk 3D Deployment',
    '✨ Create AI SaaS Project',
    '📊 Live Pipeline Analytics',
    '📥 Breakdown of New Leads',
    '🚫 Canceled & Archived Reasons',
    '🚀 Production Deployments Status',
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    sound.playClick();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages,
          model: selectedModel,
          customApiKey: customApiKey.trim() || undefined
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'No response returned from Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      sound.playSuccess();
    } catch (err) {
      console.error('[AI Chat Error]:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '⚠️ **Communication Error**: Unable to reach the Google Gemini AI endpoint. Please check your internet connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playHoverTick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    sound.playHoverTick();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `⚡ **Conversation reset.** Active Intelligence: **${selectedModel}**.\n\nPrisma PostgreSQL database bridge active. What analytics breakdown would you like to inspect?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const currentModelInfo = GEMINI_MODELS.find((m) => m.id === selectedModel) || GEMINI_MODELS[0];

  return (
    <aside className="w-full sm:w-96 md:w-[440px] bg-[#0A0A0A]/98 backdrop-blur-3xl h-full flex flex-col justify-between border-l border-neutral-700/20 select-none shadow-[-25px_0_70px_rgba(0,0,0,0.9)] z-40 relative overflow-hidden font-sans">
      {/* Background Ambient Cyber Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-[#A1A1A1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* 1. Header & Controls with High Z-Index to Prevent Message Overlapping */}
      <div className="p-4 border-b border-neutral-700/20 flex flex-col gap-3 relative z-50 bg-[#111111]/95 backdrop-blur-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#A1A1A1] p-[1px] shadow-[0_0_20px_rgba(59, 130, 246,0.5)]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[11px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#A1A1A1] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-wider font-mono">
                  ANORIX AI COPILOT
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-green-500/10 text-green-300 border border-green-500/30">
                  POSTGRES SYNCED
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-300/80 block">
                Google GenAI • Database Analytics Boss
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showKeyConfig || customApiKey
                  ? 'bg-neutral-800/20 border-neutral-700 text-neutral-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Configure Custom Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-300 transition-all cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Custom API Key Tray (Collapsible) */}
        {showKeyConfig && (
          <div className="p-3 rounded-xl bg-[#171717] border border-neutral-700/40 space-y-2 animate-in fade-in slide-in-from-top-2 shadow-2xl">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-300 font-bold flex items-center gap-1">
                <Key className="w-3 h-3 text-neutral-300" />
                Google AI Studio API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-300 hover:underline flex items-center gap-0.5 text-[9px]"
              >
                Get Key ↗
              </a>
            </div>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => handleSaveCustomKey(e.target.value)}
              placeholder="Paste API key (leave blank to use .env.local)"
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#3B82F6]"
            />
            <p className="text-[9px] font-mono text-slate-400 leading-tight">
              Pre-configured .env.local key is active. Override here if desired.
            </p>
          </div>
        )}

        {/* 2. Interactive Model Selector Dropdown with Strict Stacking Context */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="w-full px-3 py-2 rounded-xl bg-[#171717] hover:bg-[#1a0c36] border border-neutral-700/30 hover:border-neutral-700/60 transition-all flex items-center justify-between text-left cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Cpu className="w-3.5 h-3.5 text-[#A1A1A1] shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate font-mono">
                    {currentModelInfo.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#A1A1A1]/10 text-[#A1A1A1] border border-[#A1A1A1]/30 shrink-0">
                    {currentModelInfo.badge}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 truncate">
                  Latency {currentModelInfo.speed} • {currentModelInfo.description}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isModelDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu (Solid Opaque High-Z Background to Prevent Message Overlap) */}
          {isModelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-2xl bg-[#111111] border border-neutral-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.98)] z-[100] space-y-1 backdrop-blur-3xl animate-in fade-in slide-in-from-top-1">
              <div className="px-2 py-1 text-[9px] font-mono font-bold text-[#A1A1A1]/80 uppercase tracking-wider border-b border-white/5 pb-1">
                Select Google Gemini Model
              </div>
              {GEMINI_MODELS.map((model) => {
                const isSelected = model.id === selectedModel;
                return (
                  <div
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-800/30 border border-neutral-700 text-white shadow-[0_0_15px_rgba(59, 130, 246,0.3)]'
                        : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-mono text-white">{model.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-white/10 text-neutral-300">
                          {model.badge}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 truncate">
                        {model.description}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-300 font-bold shrink-0 ml-2">
                      {model.speed}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Messages List Area matching Website Deep Dark Theme */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 relative z-10 bg-transparent">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} group`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-xl bg-[#171717] border border-neutral-700/40 flex items-center justify-center shrink-0 text-[#A1A1A1] mt-1 shadow-[0_0_15px_rgba(59, 130, 246,0.35)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2.5 relative transition-all ${
                  isAi
                    ? 'bg-[#0E051E]/95 border border-neutral-700/30 text-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md'
                    : 'bg-gradient-to-r from-[#3B82F6] via-[#3B82F6] to-[#3B82F6] text-white font-medium shadow-[0_0_25px_rgba(59, 130, 246,0.45)]'
                }`}
              >
                {/* Message Content with Markdown & Cyber Text Styling */}
                <div className="whitespace-pre-wrap font-sans text-xs break-words selection:bg-neutral-800 selection:text-white space-y-2">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10 text-[9px] font-mono text-slate-400">
                  <span className="text-neutral-300/70">{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-green-300" />
                          <span className="text-green-300 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#A1A1A1] flex items-center justify-center shrink-0 text-white mt-1 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 animate-pulse pl-1 bg-[#171717]/80 p-2.5 rounded-xl border border-neutral-700/30 w-fit">
            <div className="w-5 h-5 rounded-lg bg-[#171717] border border-neutral-700/40 flex items-center justify-center text-[#A1A1A1]">
              <Sparkles className="w-3 h-3 animate-spin" />
            </div>
            <span>Querying PostgreSQL & {selectedModel}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Real-time Analytics Suggestion Chips & Cybernetic Input Bar */}
      <div className="p-3 border-t border-neutral-700/20 bg-[#111111]/95 backdrop-blur-2xl space-y-2.5 relative z-10">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#171717] hover:bg-[#200c42] border border-neutral-700/30 text-neutral-300 whitespace-nowrap transition-all cursor-pointer shrink-0 hover:border-neutral-700 disabled:opacity-50 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form with Neon Cybernetic Glow */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Analytics Boss (${selectedModel})...`}
            disabled={isTyping}
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#171717] border border-neutral-700/30 text-white placeholder-slate-500 font-sans text-xs focus:outline-none focus:border-[#A1A1A1] focus:shadow-[0_0_15px_rgba(161, 161, 161,0.3)] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#A1A1A1] text-white shadow-[0_0_20px_rgba(59, 130, 246,0.6)] hover:shadow-[0_0_30px_rgba(161, 161, 161,0.8)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
