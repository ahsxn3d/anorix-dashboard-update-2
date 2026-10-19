'use client'

import React, { useState } from 'react';
import {
  Globe,
  Layers,
  Sparkles,
  User,
  Share2,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  Zap,
  Sliders,
  Type,
  Activity,
  Mail
} from 'lucide-react';
import {
  MasterWebsiteCustomizerData,
  DeploymentProduct,
  HeroSectionContent,
  AboutPageContent,
  ContactPageContent,
  FooterContent,
  SiteHeaderConfig,
  MilestoneCard
} from '@/lib/types';
import {
  INITIAL_MASTER_CUSTOMIZER_DATA,
  INITIAL_DEPLOYMENTS_CMS,
  INITIAL_HERO_CMS,
  INITIAL_ENGINEERING_LAB_CMS,
  INITIAL_MILESTONES_CMS,
  INITIAL_STAGES_CMS,
  INITIAL_ABOUT_CMS,
  INITIAL_REVIEWS_CMS,
  INITIAL_CONTACT_CMS,
  INITIAL_FOOTER_CMS,
  INITIAL_HEADER_CMS
} from './cms/cmsDefaults';
import { AboutStatsTab } from './cms/AboutStatsTab';
import { ContactSocialTab } from './cms/ContactSocialTab';
import { ExportJsonModal, ImportJsonModal, ResetToDefaultsModal } from './cms/JsonSyncModals';
import { saveMasterWebsiteCustomizerAction } from '@/lib/actions';
import { ButterButton } from './ButterButton';
import { DashboardHoloCard } from './DashboardHoloCard';
import { sound } from '@/lib/sound';

interface CmsSectionProps {
  onTriggerReload?: () => void;
}

export type CmsTabId = 'about' | 'contact';

export const CmsSection: React.FC<CmsSectionProps> = ({ onTriggerReload }) => {
  // Exactly 2 Focused Website CMS Tabs: 1. About & Stats Highlights, 2. Contact & Social Channels
  const [activeTab, setActiveTab] = useState<CmsTabId>('about');

  // Master State - initialized clean
  const [masterData, setMasterData] = useState<MasterWebsiteCustomizerData>(INITIAL_MASTER_CUSTOMIZER_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real database records on mount
  React.useEffect(() => {
    let mounted = true;
    async function loadCmsData() {
      try {
        const { fetchHeroContentAction, fetchAboutContentAction } = await import('@/lib/actions');
        const [dbHero, dbAbout] = await Promise.all([
          fetchHeroContentAction(),
          fetchAboutContentAction(),
        ]);
        if (mounted) {
          setMasterData((prev) => ({
            ...prev,
            hero: dbHero ? { ...prev.hero, ...dbHero } : prev.hero,
            about: dbAbout
              ? {
                  ...prev.about,
                  ...dbAbout,
                  proofMetrics:
                    dbAbout.proofMetrics && dbAbout.proofMetrics.length > 0
                      ? dbAbout.proofMetrics
                      : prev.about.proofMetrics,
                }
              : prev.about,
          }));
        }
      } catch (err) {
        console.warn('[CMS DB fetch warning]:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadCmsData();
    return () => {
      mounted = false;
    };
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toast Notification System
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'info' | 'error';
    id: number;
  } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 3500);
  };

  // Synchronize state changes to masterData and localStorage
  const handleDeploymentsChange = (deployments: DeploymentProduct[]) => {
    const updated = { ...masterData, deployments };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_deployments', JSON.stringify(deployments));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  const handleHeroChange = (hero: HeroSectionContent) => {
    const updated = { ...masterData, hero };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_hero', JSON.stringify(hero));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  const handleAboutChange = (about: AboutPageContent) => {
    const updated = { ...masterData, about };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_about', JSON.stringify(about));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  const handleMilestonesChange = (milestones: MilestoneCard[]) => {
    const updated = { ...masterData, milestones };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_milestones', JSON.stringify(milestones));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  const handleContactChange = (contact: ContactPageContent) => {
    const updated = { ...masterData, contact };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_contact', JSON.stringify(contact));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  const handleFooterChange = (footer: FooterContent) => {
    const updated = { ...masterData, footer };
    setMasterData(updated);
    localStorage.setItem('anorent_cms_footer', JSON.stringify(footer));
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(updated));
  };

  // Save All handler with simulated edge cache invalidation
  const handleSaveAll = async () => {
    sound.playClick();
    setIsSaving(true);

    try {
      // Persist to localStorage
      localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(masterData));
      localStorage.setItem('anorent_cms_deployments', JSON.stringify(masterData.deployments));
      localStorage.setItem('anorent_cms_hero', JSON.stringify(masterData.hero));
      localStorage.setItem('anorent_cms_about', JSON.stringify(masterData.about));
      localStorage.setItem('anorent_cms_contact', JSON.stringify(masterData.contact));
      localStorage.setItem('anorent_cms_footer', JSON.stringify(masterData.footer));

      // Trigger server action simulation
      await saveMasterWebsiteCustomizerAction(masterData);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeStr);
      sound.playSuccess();
      showToast('All website content changes published & synchronized successfully!', 'success');

      if (onTriggerReload) {
        onTriggerReload();
      }
    } catch {
      showToast('Failed to sync changes with server. Local changes retained.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Import JSON success handler
  const handleImportSuccess = (imported: MasterWebsiteCustomizerData) => {
    const merged: MasterWebsiteCustomizerData = {
      ...masterData,
      ...imported,
      deployments: imported.deployments || masterData.deployments,
      hero: imported.hero || masterData.hero,
      about: imported.about || masterData.about,
      contact: imported.contact || masterData.contact,
      footer: imported.footer || masterData.footer
    };

    setMasterData(merged);
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(merged));
    localStorage.setItem('anorent_cms_deployments', JSON.stringify(merged.deployments));
    localStorage.setItem('anorent_cms_hero', JSON.stringify(merged.hero));
    localStorage.setItem('anorent_cms_about', JSON.stringify(merged.about));
    localStorage.setItem('anorent_cms_contact', JSON.stringify(merged.contact));
    localStorage.setItem('anorent_cms_footer', JSON.stringify(merged.footer));

    showToast('Loaded complete website CMS configuration', 'success');
    if (onTriggerReload) onTriggerReload();
  };

  // Reset to defaults
  const handleConfirmReset = () => {
    sound.playSuccess();
    setMasterData(INITIAL_MASTER_CUSTOMIZER_DATA);
    localStorage.setItem('anorent_website_cms_customizer', JSON.stringify(INITIAL_MASTER_CUSTOMIZER_DATA));
    localStorage.setItem('anorent_cms_deployments', JSON.stringify(INITIAL_DEPLOYMENTS_CMS));
    localStorage.setItem('anorent_cms_hero', JSON.stringify(INITIAL_HERO_CMS));
    localStorage.setItem('anorent_cms_about', JSON.stringify(INITIAL_ABOUT_CMS));
    localStorage.setItem('anorent_cms_contact', JSON.stringify(INITIAL_CONTACT_CMS));
    localStorage.setItem('anorent_cms_footer', JSON.stringify(INITIAL_FOOTER_CMS));

    showToast('Reverted all CMS modules to studio default settings', 'info');
    if (onTriggerReload) onTriggerReload();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-mono text-xs ${
              toast.type === 'success'
                ? 'bg-green-950/90 border-green-500/50 text-green-300'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-300'
                : 'bg-neutral-800/90 border-neutral-700/50 text-neutral-300'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-neutral-300 shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* TOP CMS HEADER BANNER & GLOBAL CONTROLS */}
      <DashboardHoloCard
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#171717]/95 via-[#111111]/95 to-[#0A0A0A]/95 border border-neutral-700/30 relative overflow-hidden"
        glowColor="rgba(59, 130, 246, 0.4)"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest text-[#A1A1A1] bg-[#A1A1A1]/10 border border-[#A1A1A1]/30 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-neutral-300" />
                WEBSITE CONTENT & DEPLOYMENTS MANAGER
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3B82F6]/20 text-neutral-300 border border-neutral-700/30">
                FOCUSED CMS
              </span>
              {lastSavedTime && (
                <span className="text-[11px] font-mono text-green-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved at {lastSavedTime}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Website Content & Deployments Manager
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl font-mono leading-relaxed">
              Focused headless CMS for managing essential website content: creator profile, dynamic benchmarks & stats, timeline milestones, and contact routing channels.
            </p>
          </div>

          {/* Global Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-center">
            <button
              onClick={() => {
                sound.playClick();
                setIsImportModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 text-neutral-300 hover:text-white border border-neutral-700/30 text-xs font-mono font-bold flex items-center gap-2 transition-all"
              title="Import JSON configuration file"
            >
              <Upload className="w-4 h-4 text-neutral-300" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsExportModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-neutral-800/40 text-neutral-300 hover:text-white border border-neutral-700/30 text-xs font-mono font-bold flex items-center gap-2 transition-all"
              title="Sync / Export JSON to transfer data to live website"
            >
              <Download className="w-4 h-4 text-neutral-300" />
              <span>Sync / Export JSON</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsResetModalOpen(true);
              }}
              className="px-3 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-amber-950/40 text-amber-200 hover:text-white border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Reset all tabs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <ButterButton
              onClick={handleSaveAll}
              disabled={isSaving}
              variant="purple"
              size="md"
              className="flex items-center gap-2 shadow-lg shadow-neutral-800/30"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </ButterButton>
          </div>
        </div>
      </DashboardHoloCard>

      {/* 2 FOCUSED MANAGEMENT TABS NAVIGATION BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-2 rounded-2xl bg-[#171717]/90 border border-neutral-700/20 backdrop-blur-md shadow-xl">
        {/* Tab 1 */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('about');
          }}
          className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-3 text-center cursor-pointer ${
            activeTab === 'about'
              ? 'bg-[#3B82F6] text-white shadow-lg shadow-neutral-800/30 scale-[1.01]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
              activeTab === 'about'
                ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                : 'bg-white/5 text-neutral-300 border border-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
          </div>
          <span className="truncate">1. ABOUT & STATS HIGHLIGHTS</span>
        </button>

        {/* Tab 2 */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('contact');
          }}
          className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-3 text-center cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#3B82F6] text-white shadow-lg shadow-neutral-800/30 scale-[1.01]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
              activeTab === 'contact'
                ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                : 'bg-white/5 text-neutral-300 border border-white/10'
            }`}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
          </div>
          <span className="truncate">2. CONTACT & SOCIAL CHANNELS</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="pt-2">
        {activeTab === 'about' && (
          <AboutStatsTab
            about={masterData.about}
            milestones={masterData.milestones || []}
            onAboutChange={handleAboutChange}
            onMilestonesChange={handleMilestonesChange}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSocialTab
            contact={masterData.contact}
            footer={masterData.footer}
            onContactChange={handleContactChange}
            onFooterChange={handleFooterChange}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* GLOBAL MODALS */}
      <ExportJsonModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={masterData}
        onShowToast={showToast}
      />

      <ImportJsonModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        onShowToast={showToast}
      />

      <ResetToDefaultsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
};
