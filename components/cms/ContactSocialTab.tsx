'use client'

import React, { useState } from 'react';
import {
  Mail,
  Share2,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe,
  Plus,
  Trash2,
  Send,
  MessageSquare,
  Copy,
  Clock,
  Check,
  ShieldAlert
} from 'lucide-react';
import { ContactPageContent, FooterContent } from '@/lib/types';
import { ButterButton } from '@/components/ButterButton';
import { DashboardHoloCard } from '@/components/DashboardHoloCard';
import { sound } from '@/lib/sound';

interface ContactSocialTabProps {
  contact: ContactPageContent;
  footer: FooterContent;
  onContactChange: (contact: ContactPageContent) => void;
  onFooterChange: (footer: FooterContent) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ContactSocialTab: React.FC<ContactSocialTabProps> = ({
  contact,
  footer,
  onContactChange,
  onFooterChange,
  onShowToast
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email?: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    onFooterChange({
      ...footer,
      socialLinks: {
        ...footer.socialLinks,
        [key]: value
      }
    });
  };

  const handleTestLink = (name: string, url?: string) => {
    if (!url) {
      onShowToast(`Please enter a valid URL for ${name}`, 'error');
      return;
    }
    sound.playClick();
    if (isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
      onShowToast(`Opened ${name} in a new tab`, 'info');
    } else {
      onShowToast(`Invalid URL format for ${name}. Expected format: https://...`, 'error');
    }
  };

  const handleCopyEmail = () => {
    const emailToCopy = contact.directEmail || 'ahsxn3d@gmail.com';
    navigator.clipboard.writeText(emailToCopy);
    sound.playClick();
    setCopiedEmail(true);
    onShowToast(`Copied ${emailToCopy} to clipboard!`, 'success');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* 1. Live Inquiries & Connected Hub Preview */}
      <DashboardHoloCard
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#171717]/95 via-[#111111]/95 to-[#0A0A0A]/95 border border-neutral-700/30 relative overflow-hidden"
        glowColor="rgba(59, 130, 246, 0.35)"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Live Inquiries & Social Hub Status
              </h3>
              <p className="text-[11px] font-mono text-neutral-300/70">
                Connected email routing and social links active across public website header, drawer, and footer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-800/60 text-neutral-300 border border-neutral-700/40 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isValidEmail(contact.directEmail) ? 'bg-green-400' : 'bg-amber-400 animate-ping'}`} />
              <span>Target: {contact.directEmail || 'ahsxn3d@gmail.com'}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Copy contact email"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Channel Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {footer.socialLinks?.dribbble && (
            <a
              href={footer.socialLinks.dribbble}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 border border-white/10 hover:border-neutral-700/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Globe className="w-4 h-4 text-neutral-300" />
              <span>Dribbble</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {footer.socialLinks?.github && (
            <a
              href={footer.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 border border-white/10 hover:border-neutral-700/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Github className="w-4 h-4 text-neutral-300" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {footer.socialLinks?.discord && (
            <a
              href={footer.socialLinks.discord}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 border border-white/10 hover:border-neutral-700/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-neutral-300" />
              <span>Discord</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {footer.socialLinks?.twitter && (
            <a
              href={footer.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 border border-white/10 hover:border-neutral-700/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Twitter className="w-4 h-4 text-neutral-300" />
              <span>Twitter / X</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {footer.socialLinks?.linkedin && (
            <a
              href={footer.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-blue-950/40 border border-white/10 hover:border-blue-500/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {footer.socialLinks?.telegram && (
            <a
              href={footer.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 border border-white/10 hover:border-neutral-700/40 text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-neutral-300" />
              <span>Telegram</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
        </div>
      </DashboardHoloCard>

      {/* 2. Main Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Contact Email & Inquiry Headings */}
        <div className="lg:col-span-6 space-y-6">
          <DashboardHoloCard
            className="p-6 md:p-8 rounded-3xl bg-[#171717]/90 border border-white/10 space-y-6"
            glowColor="rgba(59, 130, 246, 0.25)"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Contact & Inquiry Configuration
                </h3>
                <p className="text-xs font-mono text-neutral-300/80">
                  Configure where website client submissions and inquiries are routed.
                </p>
              </div>
            </div>

            {/* Primary Contact / Support Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Primary Contact / Support Email Address *
                </label>
                {isValidEmail(contact.directEmail) ? (
                  <span className="text-[10px] font-mono text-green-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid email
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Enter valid email
                  </span>
                )}
              </div>
              <input
                type="email"
                required
                value={contact.directEmail || ''}
                onChange={(e) => onContactChange({ ...contact, directEmail: e.target.value })}
                placeholder="e.g. ahsxn3d@gmail.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border text-white font-mono text-xs focus:outline-none ${
                  isValidEmail(contact.directEmail)
                    ? 'border-white/10 focus:border-[#3B82F6]'
                    : 'border-amber-500/50 focus:border-amber-400'
                }`}
              />
            </div>

            {/* Contact Form Header Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">
                Contact Form Header Title *
              </label>
              <input
                type="text"
                value={contact.headline || ''}
                onChange={(e) => onContactChange({ ...contact, headline: e.target.value })}
                placeholder="e.g. INITIATE BESPOKE DEPLOYMENT"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            {/* Contact Form Subtitle Copy */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">
                Contact Form Subtitle & Guarantee Copy *
              </label>
              <textarea
                rows={3}
                value={contact.subtitle || ''}
                onChange={(e) => onContactChange({ ...contact, subtitle: e.target.value })}
                placeholder="Direct founder engagement with milestone-protected escrow guarantees. Share your technical requirements below."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6] leading-relaxed"
              />
            </div>

            {/* Footer Tagline Statement */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">
                Website Footer Tagline Statement
              </label>
              <input
                type="text"
                value={footer.tagline || ''}
                onChange={(e) => onFooterChange({ ...footer, tagline: e.target.value })}
                placeholder="ARCHITECTING HIGH-VELOCITY DIGITAL SYSTEMS // BUILT WITH NEXT.JS 15"
                className="w-full px-4 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            {/* Copyright Statement */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">
                Copyright Statement Text
              </label>
              <input
                type="text"
                value={footer.copyrightStatement || footer.copyrightText || ''}
                onChange={(e) =>
                  onFooterChange({
                    ...footer,
                    copyrightStatement: e.target.value,
                    copyrightText: e.target.value
                  })
                }
                placeholder="© 2026 ANORENT STUDIO. ALL RIGHTS RESERVED."
                className="w-full px-4 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </DashboardHoloCard>
        </div>

        {/* Right Column: Social & Portfolio Channel Destination URLs */}
        <div className="lg:col-span-6 space-y-6">
          <DashboardHoloCard
            className="p-6 md:p-8 rounded-3xl bg-[#171717]/90 border border-white/10 space-y-6"
            glowColor="rgba(161, 161, 161, 0.25)"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-800/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Social & Portfolio Channel URLs
                </h3>
                <p className="text-xs font-mono text-neutral-300/80">
                  External links displayed across the studio header, contact drawer, and footer.
                </p>
              </div>
            </div>

            {/* 1. Dribbble */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  1. Dribbble Profile URL
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('Dribbble', footer.socialLinks?.dribbble)}
                  className="text-[10px] font-mono text-neutral-300 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.dribbble || ''}
                onChange={(e) => handleSocialLinkChange('dribbble', e.target.value)}
                placeholder="https://dribbble.com/anorent"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neutral-700"
              />
            </div>

            {/* 2. GitHub */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <Github className="w-3.5 h-3.5" />
                  2. GitHub Profile URL
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('GitHub', footer.socialLinks?.github)}
                  className="text-[10px] font-mono text-neutral-300 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.github || ''}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                placeholder="https://github.com/anorent"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            {/* 3. Discord */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  3. Discord Server / Community URL
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('Discord', footer.socialLinks?.discord)}
                  className="text-[10px] font-mono text-neutral-300 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.discord || ''}
                onChange={(e) => handleSocialLinkChange('discord', e.target.value)}
                placeholder="https://discord.gg/anorent"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neutral-700"
              />
            </div>

            {/* 4. Twitter / X */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <Twitter className="w-3.5 h-3.5" />
                  4. Twitter / X Profile URL
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('Twitter/X', footer.socialLinks?.twitter)}
                  className="text-[10px] font-mono text-neutral-300 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="https://x.com/Ahsanwebdesign"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neutral-700"
              />
            </div>

            {/* 5. LinkedIn */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-blue-500/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-blue-300 flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5" />
                  5. LinkedIn Profile URL
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('LinkedIn', footer.socialLinks?.linkedin)}
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/anorent"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 6. Telegram / Direct Messenger */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  6. Telegram / Messenger Link
                </label>
                <button
                  type="button"
                  onClick={() => handleTestLink('Telegram', footer.socialLinks?.telegram)}
                  className="text-[10px] font-mono text-neutral-300 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test Link
                </button>
              </div>
              <input
                type="url"
                value={footer.socialLinks?.telegram || ''}
                onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                placeholder="https://t.me/anorent"
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neutral-700"
              />
            </div>
          </DashboardHoloCard>
        </div>
      </div>
    </div>
  );
};
