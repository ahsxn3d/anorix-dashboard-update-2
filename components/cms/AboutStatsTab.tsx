'use client'

import React, { useState } from 'react';
import {
  User,
  Activity,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  X,
  Code2,
  CheckCircle2,
  Sliders,
  BarChart3,
  Calendar,
  Layers,
  Image as ImageIcon,
  Tag,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { AboutPageContent, MilestoneCard, ProofMetricCard } from '@/lib/types';
import { ButterButton } from '@/components/ButterButton';
import { DashboardHoloCard } from '@/components/DashboardHoloCard';
import { ImageUploadDropzone } from '@/components/ImageUploadDropzone';
import { sound } from '@/lib/sound';

interface AboutStatsTabProps {
  about: AboutPageContent;
  milestones?: MilestoneCard[];
  onAboutChange: (about: AboutPageContent) => void;
  onMilestonesChange?: (milestones: MilestoneCard[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AboutStatsTab: React.FC<AboutStatsTabProps> = ({
  about,
  milestones = [],
  onAboutChange,
  onMilestonesChange,
  onShowToast
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  // New Milestone State Form
  const [newMilestone, setNewMilestone] = useState<Partial<MilestoneCard>>({
    year: '2026',
    phase: 'PHASE 04',
    title: '',
    subtitle: 'Production Protocol',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
    highlightTag: 'Live Milestone',
    tags: ['Next.js 15', 'TypeScript']
  });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneTagInput, setMilestoneTagInput] = useState('');

  // Skill Add / Remove
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skill = newSkill.trim();
    if (!about.techSkills?.includes(skill)) {
      onAboutChange({
        ...about,
        techSkills: [...(about.techSkills || []), skill]
      });
      onShowToast(`Added skill "${skill}"`, 'info');
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onAboutChange({
      ...about,
      techSkills: (about.techSkills || []).filter((s) => s !== skillToRemove)
    });
    onShowToast(`Removed skill "${skillToRemove}"`, 'info');
  };

  const defaultProofMetrics: ProofMetricCard[] = [
    {
      id: 'metric-1',
      label: 'Deployments Delivered',
      value: about.deploymentsDelivered || '12+',
      subtext: 'Bespoke full-stack architectures shipped',
      icon: 'zap'
    },
    {
      id: 'metric-2',
      label: 'Client Satisfaction',
      value: about.clientSatisfaction || '99.8%',
      subtext: 'Zero SLA compromises on project delivery',
      icon: 'shield'
    },
    {
      id: 'metric-3',
      label: 'Years Active in Industry',
      value: about.yearsActive || '5+ Years',
      subtext: 'Continuous high-scale engineering track record',
      icon: 'trending'
    },
    {
      id: 'metric-4',
      label: 'Hardware Motion Benchmark',
      value: '60 FPS / <30ms',
      subtext: 'Zero frame drops with WebGL GPU acceleration',
      icon: 'clock'
    }
  ];

  const currentProofMetrics: ProofMetricCard[] = [
    about.proofMetrics?.[0] || defaultProofMetrics[0],
    about.proofMetrics?.[1] || defaultProofMetrics[1],
    about.proofMetrics?.[2] || defaultProofMetrics[2],
    about.proofMetrics?.[3] || defaultProofMetrics[3]
  ];

  // Helper to update specific proof metric by index
  const handleUpdateMetric = (index: number, field: keyof ProofMetricCard, value: string | number) => {
    const updatedMetrics = [...currentProofMetrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: value
    };
    onAboutChange({
      ...about,
      proofMetrics: updatedMetrics
    });
  };

  // Milestone Add
  const handleCreateMilestone = () => {
    if (!newMilestone.title?.trim() || !newMilestone.description?.trim()) {
      onShowToast('Please provide a milestone title and description.', 'error');
      return;
    }

    const createdItem: MilestoneCard = {
      id: `mile-${Date.now()}`,
      year: newMilestone.year || '2026',
      phase: newMilestone.phase || 'PHASE 01',
      title: newMilestone.title.trim(),
      subtitle: newMilestone.subtitle || 'Ecosystem Expansion',
      description: newMilestone.description.trim(),
      thumbnail: newMilestone.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      highlightTag: newMilestone.highlightTag || 'Active Phase',
      tags: newMilestone.tags || [],
      displayOrder: (milestones.length || 0) + 1
    };

    if (onMilestonesChange) {
      onMilestonesChange([...milestones, createdItem]);
    }
    sound.playSuccess();
    onShowToast(`Milestone "${createdItem.title}" created successfully!`, 'success');
    setIsAddingMilestone(false);
    setNewMilestone({
      year: '2026',
      phase: 'PHASE 04',
      title: '',
      subtitle: 'Production Protocol',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
      highlightTag: 'Live Milestone',
      tags: ['Next.js 15', 'TypeScript']
    });
  };

  // Milestone Delete
  const handleDeleteMilestone = (id: string, title: string) => {
    if (onMilestonesChange) {
      onMilestonesChange(milestones.filter((m) => m.id !== id));
      sound.playTrash();
      onShowToast(`Removed milestone "${title}"`, 'info');
    }
  };

  // Milestone Edit Field
  const handleUpdateMilestoneField = (id: string, field: keyof MilestoneCard, value: any) => {
    if (onMilestonesChange) {
      onMilestonesChange(
        milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Live Animated Stats Matrix Preview Card */}
      <DashboardHoloCard
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#171717]/95 via-[#111111]/95 to-[#0A0A0A]/95 border border-neutral-700/30 relative overflow-hidden"
        glowColor="rgba(59, 130, 246, 0.35)"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Live Stats Matrix & Telemetry Preview
              </h3>
              <p className="text-[11px] font-mono text-neutral-300/70">
                These live dynamic counters feed the homepage stats grid and proof badges in real time
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-green-950/60 text-green-300 border border-green-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>4 Dynamic Benchmarks Live</span>
          </div>
        </div>

        {/* 4 Dynamic Counter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(about.proofMetrics || []).slice(0, 4).map((metric, i) => (
            <div
              key={metric.id || i}
              className="p-4 rounded-2xl bg-[#0A0A0A]/90 border border-neutral-700/30 hover:border-neutral-700/60 transition-all relative overflow-hidden group shadow-lg"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-800/10 rounded-full blur-2xl pointer-events-none group-hover:bg-neutral-800/20 transition-all" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                <span className="font-bold text-neutral-300 uppercase">
                  {i === 0
                    ? '01 // DEPLOYMENTS'
                    : i === 1
                    ? '02 // SATISFACTION'
                    : i === 2
                    ? '03 // EXPERIENCE'
                    : '04 // BENCHMARK'}
                </span>
                <span className="text-green-300 font-bold">{metric.percentage || 100}%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-800 to-neutral-800">
                {metric.value}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 font-mono">{metric.label}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">{metric.subtext}</div>
            </div>
          ))}
        </div>
      </DashboardHoloCard>

      {/* 2. Main Profile & Dynamic Counters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creator Profile & Story Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <DashboardHoloCard
            className="p-6 md:p-8 rounded-3xl bg-[#171717]/90 border border-white/10 space-y-6"
            glowColor="rgba(59, 130, 246, 0.25)"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Founder & Studio Profile Information
                </h3>
                <p className="text-xs font-mono text-neutral-300/80">
                  Manage your public bio, role titles, story narrative, and avatar image.
                </p>
              </div>
            </div>

            {/* Row: Founder / Studio Name & Role Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">Founder / Studio Name *</label>
                <input
                  type="text"
                  value={about.artistName || about.profileName || ''}
                  onChange={(e) =>
                    onAboutChange({
                      ...about,
                      artistName: e.target.value,
                      profileName: e.target.value
                    })
                  }
                  placeholder="e.g. Ahsan Javed / ANORENT Studio"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">Role / Title *</label>
                <input
                  type="text"
                  value={about.role || about.title || ''}
                  onChange={(e) =>
                    onAboutChange({
                      ...about,
                      role: e.target.value,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. Principal Systems Architect & Lead Designer"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Row: Short Bio / Tagline & Social Handle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300">Short Bio / Tagline</label>
                <input
                  type="text"
                  value={about.tagline || about.shortBio || ''}
                  onChange={(e) =>
                    onAboutChange({
                      ...about,
                      tagline: e.target.value,
                      shortBio: e.target.value
                    })
                  }
                  placeholder="e.g. Architecting High-Velocity Digital Systems & 60FPS Apps"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-700/30 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">Social Handle</label>
                <input
                  type="text"
                  value={about.handle || ''}
                  onChange={(e) => onAboutChange({ ...about, handle: e.target.value })}
                  placeholder="@Ahsanwebdesign"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Profile / Avatar Image UploadDropzone */}
            <div className="space-y-2">
              <ImageUploadDropzone
                endpoint="avatarImage"
                value={about.avatarUrl || ''}
                onChange={(url) => onAboutChange({ ...about, avatarUrl: url })}
                label="Profile / Avatar Photo (Permanent CDN Hosting)"
                description="UploadTo UploadThing (Max 2MB)"
                aspectRatio="avatar"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Direct Avatar CDN URL (Synced):</span>
                <input
                  type="url"
                  value={about.avatarUrl || ''}
                  onChange={(e) => onAboutChange({ ...about, avatarUrl: e.target.value })}
                  placeholder="https://utfs.io/f/... or https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Extended Story Narrative */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Extended Story Narrative (Full About Bio) *
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {about.executiveBio?.length || 0} chars
                </span>
              </div>
              <textarea
                rows={5}
                value={about.executiveBio || ''}
                onChange={(e) => onAboutChange({ ...about, executiveBio: e.target.value })}
                placeholder="Comprehensive overview of design philosophy, engineering standards, and production expertise..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6] leading-relaxed"
              />
            </div>

            {/* Location & Timezone + Availability Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">Location & Timezone</label>
                <input
                  type="text"
                  value={about.location || about.locationTimezone || ''}
                  onChange={(e) =>
                    onAboutChange({
                      ...about,
                      location: e.target.value,
                      locationTimezone: e.target.value
                    })
                  }
                  placeholder="San Francisco, CA (Remote PST)"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-green-300">Availability Status Badge</label>
                <input
                  type="text"
                  value={about.availability || about.availabilityStatus || ''}
                  onChange={(e) =>
                    onAboutChange({
                      ...about,
                      availability: e.target.value,
                      availabilityStatus: e.target.value
                    })
                  }
                  placeholder="AVAILABLE FOR NEW PROJECTS"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-green-500/30 text-green-300 font-mono text-xs focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            {/* Tech Skills & Stack Chips */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#0A0A0A] border border-white/10">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                Technical Skills & Architecture Stack
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Next.js 15, WebGL, Tailwind)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#3B82F6] text-white text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(about.techSkills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800/30 text-neutral-300 border border-neutral-700/30 flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </DashboardHoloCard>
        </div>

        {/* Right Column: Dynamic Proof Metrics & Benchmarks Editor */}
        <div className="lg:col-span-5 space-y-6">
          <DashboardHoloCard
            className="p-6 md:p-8 rounded-3xl bg-[#171717]/90 border border-white/10 space-y-6"
            glowColor="rgba(161, 161, 161, 0.25)"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-800/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Proof Metrics & Benchmarks
                </h3>
                <p className="text-xs font-mono text-neutral-300/80">
                  Update counter values, labels, and subtexts displayed on the About page.
                </p>
              </div>
            </div>

            {/* Metric 1: Deployments Delivered Count */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  1. Deployments Delivered Count
                </span>
                <span className="text-[10px] font-mono text-neutral-300">e.g. 12+ / 40+</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Count Value *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[0]?.value || '12+'}
                    onChange={(e) => handleUpdateMetric(0, 'value', e.target.value)}
                    placeholder="12+"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs font-bold focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Label *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[0]?.label || 'Deployments Delivered'}
                    onChange={(e) => handleUpdateMetric(0, 'label', e.target.value)}
                    placeholder="Deployments Delivered"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Subtext Narrative</label>
                <input
                  type="text"
                  value={currentProofMetrics[0]?.subtext || 'Bespoke full-stack architectures shipped'}
                  onChange={(e) => handleUpdateMetric(0, 'subtext', e.target.value)}
                  placeholder="Bespoke full-stack architectures shipped"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Metric 2: Client Satisfaction Rate */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-green-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-green-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  2. Client Satisfaction Rate
                </span>
                <span className="text-[10px] font-mono text-green-300">e.g. 99.8% / 100%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Rate Value *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[1]?.value || '99.8%'}
                    onChange={(e) => handleUpdateMetric(1, 'value', e.target.value)}
                    placeholder="99.8%"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs font-bold focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Label *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[1]?.label || 'Client Satisfaction'}
                    onChange={(e) => handleUpdateMetric(1, 'label', e.target.value)}
                    placeholder="Client Satisfaction"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Subtext Narrative</label>
                <input
                  type="text"
                  value={currentProofMetrics[1]?.subtext || 'Zero SLA compromises on project delivery'}
                  onChange={(e) => handleUpdateMetric(1, 'subtext', e.target.value)}
                  placeholder="Zero SLA compromises on project delivery"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Metric 3: Years Active / Experience */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-700/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  3. Years Active / Experience
                </span>
                <span className="text-[10px] font-mono text-neutral-300">e.g. 5+ / 8+ Years</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Experience Value *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[2]?.value || '5+ Years'}
                    onChange={(e) => handleUpdateMetric(2, 'value', e.target.value)}
                    placeholder="5+ Years"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs font-bold focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Label *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[2]?.label || 'Years Active in Industry'}
                    onChange={(e) => handleUpdateMetric(2, 'label', e.target.value)}
                    placeholder="Years Active in Industry"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Subtext Narrative</label>
                <input
                  type="text"
                  value={currentProofMetrics[2]?.subtext || 'Continuous high-scale engineering track record'}
                  onChange={(e) => handleUpdateMetric(2, 'subtext', e.target.value)}
                  placeholder="Continuous high-scale engineering track record"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-neutral-700"
                />
              </div>
            </div>

            {/* Metric 4: Performance Benchmark */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  4. Performance Benchmark
                </span>
                <span className="text-[10px] font-mono text-amber-200">e.g. 60 FPS / &lt;30ms</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Benchmark Value *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[3]?.value || '60 FPS / <30ms'}
                    onChange={(e) => handleUpdateMetric(3, 'value', e.target.value)}
                    placeholder="60 FPS / <30ms"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Label *</label>
                  <input
                    type="text"
                    value={currentProofMetrics[3]?.label || 'Hardware Motion Benchmark'}
                    onChange={(e) => handleUpdateMetric(3, 'label', e.target.value)}
                    placeholder="Hardware Motion Benchmark"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Subtext Narrative</label>
                <input
                  type="text"
                  value={currentProofMetrics[3]?.subtext || 'Zero frame drops with WebGL GPU acceleration'}
                  onChange={(e) => handleUpdateMetric(3, 'subtext', e.target.value)}
                  placeholder="Zero frame drops with WebGL GPU acceleration"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </DashboardHoloCard>
        </div>
      </div>

      {/* 3. Story Timeline & Milestones Dynamic List Manager */}
      <DashboardHoloCard
        className="p-6 md:p-8 rounded-3xl bg-[#171717]/90 border border-white/10 space-y-6"
        glowColor="rgba(59, 130, 246, 0.25)"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Story Timeline & Milestones Manager
              </h3>
              <p className="text-xs font-mono text-neutral-300/80">
                Manage the historical milestones, phase roadmaps, and tech achievements on your About page.
              </p>
            </div>
          </div>

          <ButterButton
            onClick={() => {
              sound.playClick();
              setIsAddingMilestone(!isAddingMilestone);
            }}
            variant="purple"
            size="sm"
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingMilestone ? 'Cancel Form' : 'Add New Milestone'}</span>
          </ButterButton>
        </div>

        {/* Add Milestone Drawer / Form */}
        {isAddingMilestone && (
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-700/40 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                New Milestone Creator
              </span>
              <span className="text-[10px] font-mono text-slate-400">All fields fully configurable</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Phase / Step Number *</label>
                <input
                  type="text"
                  value={newMilestone.phase || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, phase: e.target.value })}
                  placeholder="e.g. PHASE 01 // GENESIS"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Year / Timeline Tag *</label>
                <input
                  type="text"
                  value={newMilestone.year || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                  placeholder="e.g. 2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Highlight Tag</label>
                <input
                  type="text"
                  value={newMilestone.highlightTag || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, highlightTag: e.target.value })}
                  placeholder="e.g. Studio Launch"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Milestone Title *</label>
                <input
                  type="text"
                  value={newMilestone.title || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g. Studio Foundation & Shader R&D"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Milestone Subtitle</label>
                <input
                  type="text"
                  value={newMilestone.subtitle || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, subtitle: e.target.value })}
                  placeholder="e.g. Next-Gen Bespoke Contracting"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300">Milestone Narrative & Description *</label>
              <textarea
                rows={3}
                value={newMilestone.description || ''}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Pioneered custom WebGL interactive engines and initiated direct bespoke contracting for high-scale clients..."
                className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={newMilestone.thumbnail || ''}
                  onChange={(e) => setNewMilestone({ ...newMilestone, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Tech Specs / Tags (comma separated)</label>
                <input
                  type="text"
                  value={(newMilestone.tags || []).join(', ')}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      tags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="e.g. Next.js 15, WebGL, Shaders"
                  className="w-full px-3 py-2 rounded-xl bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMilestone(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-all cursor-pointer"
              >
                Cancel
              </button>
              <ButterButton
                onClick={handleCreateMilestone}
                variant="purple"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Milestone</span>
              </ButterButton>
            </div>
          </div>
        )}

        {/* Existing Milestones List */}
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0A0A0A] border border-dashed border-white/10 text-slate-400 font-mono text-xs">
              No milestones currently added. Click "Add New Milestone" above to populate the timeline.
            </div>
          ) : (
            milestones.map((milestone, idx) => (
              <div
                key={milestone.id || idx}
                className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-neutral-700/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-neutral-800/60 text-neutral-300 border border-neutral-700/30">
                      {milestone.phase || `PHASE 0${idx + 1}`}
                    </span>
                    <span className="text-xs font-mono font-bold text-green-300">
                      {milestone.year || '2026'}
                    </span>
                    {milestone.highlightTag && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                        {milestone.highlightTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingMilestoneId(
                          editingMilestoneId === milestone.id ? null : milestone.id
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{editingMilestoneId === milestone.id ? 'Close' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(milestone.id, milestone.title)}
                      className="px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-300 hover:text-red-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer border border-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Inline Editing Form */}
                {editingMilestoneId === milestone.id ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Phase</label>
                        <input
                          type="text"
                          value={milestone.phase || ''}
                          onChange={(e) =>
                            handleUpdateMilestoneField(milestone.id, 'phase', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Year</label>
                        <input
                          type="text"
                          value={milestone.year || ''}
                          onChange={(e) =>
                            handleUpdateMilestoneField(milestone.id, 'year', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Highlight Tag</label>
                        <input
                          type="text"
                          value={milestone.highlightTag || ''}
                          onChange={(e) =>
                            handleUpdateMilestoneField(milestone.id, 'highlightTag', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Title</label>
                        <input
                          type="text"
                          value={milestone.title || ''}
                          onChange={(e) =>
                            handleUpdateMilestoneField(milestone.id, 'title', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={milestone.subtitle || ''}
                          onChange={(e) =>
                            handleUpdateMilestoneField(milestone.id, 'subtitle', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={milestone.description || ''}
                        onChange={(e) =>
                          handleUpdateMilestoneField(milestone.id, 'description', e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Standard Compact Display */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-8 space-y-1">
                      <div className="text-sm font-bold text-white font-mono">{milestone.title}</div>
                      {milestone.subtitle && (
                        <div className="text-xs text-neutral-300/80 font-mono">{milestone.subtitle}</div>
                      )}
                      <p className="text-xs text-slate-300 font-mono leading-relaxed pt-1">
                        {milestone.description}
                      </p>
                      {milestone.tags && milestone.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {milestone.tags.map((t, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800/40 text-neutral-300 border border-neutral-700/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {milestone.thumbnail && (
                      <div className="md:col-span-4 rounded-xl overflow-hidden border border-white/10 max-h-24">
                        <img
                          src={milestone.thumbnail}
                          alt={milestone.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DashboardHoloCard>
    </div>
  );
};
