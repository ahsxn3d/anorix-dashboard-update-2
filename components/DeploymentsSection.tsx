'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Search,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Globe,
  Star,
  Zap,
  Copy,
  CheckCircle2,
  UploadCloud,
  LayoutGrid,
  Table as TableIcon,
  Code2,
  Eye,
  Users,
  Layers,
  Cpu,
  BarChart3,
  Flame,
  Check,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  DeploymentProduct,
  DeploymentCategory,
  DeploymentStatus,
  TechnicalMetric
} from '@/lib/types';
import {
  upsertDeploymentAction,
  deleteDeploymentAction,
  fetchDeploymentsAction
} from '@/lib/actions';
import { ButterButton } from './ButterButton';
import { CyberButton } from './CyberButton';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import { DashboardHoloCard } from './DashboardHoloCard';
import { KineticTitle } from './KineticTitle';
import { sound } from '@/lib/sound';
import { CyberScrambleText } from './CyberScrambleText';
import { StatusRadarPulse } from './StatusRadarPulse';
import { CyberDropdown } from './CyberDropdown';

const CATEGORY_OPTIONS: DeploymentCategory[] = [
  'SAAS DASHBOARDS',
  'UI TEMPLATES',
  'FULL-STACK APPS',
  'ANIMATED SITES'
];

const BADGE_PRESETS = ['FEATURED', 'NEW', 'POPULAR', 'PRO', 'ENTERPRISE', 'BETA'];

const INITIAL_DEPLOYMENTS: DeploymentProduct[] = [];

export const DeploymentsSection: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentProduct[]>([]);

  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | DeploymentCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeploymentStatus>('ALL');

  // Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepId, setEditingDepId] = useState<string | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<DeploymentProduct | null>(null);

  // Form Fields (Mapped to the exact Live Website ProductCard & Detail View schema)
  // 1. Basic Information
  const [title, setTitle] = useState('');
  const [idSlug, setIdSlug] = useState('');
  const [category, setCategory] = useState<DeploymentCategory>('SAAS DASHBOARDS');
  const [badge, setBadge] = useState('FEATURED');
  const [isFeatured, setIsFeatured] = useState(true);

  // 2. Descriptions & Media
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // 3. Links
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  // 4. Stats & Ratings
  const [rating, setRating] = useState<number>(4.9);
  const [usersCount, setUsersCount] = useState('14.2k+');
  const [viewsCount, setViewsCount] = useState('98k');

  // 5. Technical Metadata
  const [tags, setTags] = useState<string[]>(['React', 'Tailwind']);
  const [newTagInput, setNewTagInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js 15', 'TypeScript', 'Tailwind CSS']);
  const [newTechInput, setNewTechInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Sub-10ms telemetry streaming pipeline',
    'Zero-trust edge security & hardware MFA'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [technicalMetrics, setTechnicalMetrics] = useState<TechnicalMetric[]>([
    { label: 'Bundle Size', value: '42kb' },
    { label: 'FPS Benchmark', value: '60 FPS' }
  ]);
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');

  // Extended & Relational Fields
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [fpsBenchmark, setFpsBenchmark] = useState<number>(60);
  const [auditScore, setAuditScore] = useState<number>(100);
  const [status, setStatus] = useState<DeploymentStatus>('Production');
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  // Drag & drop thumbnail state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with PostgreSQL /api/deployments on mount
  useEffect(() => {
    let mounted = true;
    const syncDeployments = async () => {
      setIsLoadingApi(true);
      try {
        const fetched = await fetchDeploymentsAction();
        if (mounted) {
          const list = fetched || [];
          setDeployments(list);
          if (typeof window !== 'undefined') {
            localStorage.setItem('anorent_cms_deployments', JSON.stringify(list));
            localStorage.setItem('lumaora_cms_deployments', JSON.stringify(list));
          }
        }
      } catch (err) {
        console.warn('API fetch fallback:', err);
      } finally {
        if (mounted) setIsLoadingApi(false);
      }
    };

    syncDeployments();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopySlug = (slugText: string) => {
    navigator.clipboard.writeText(slugText);
    setCopiedSlug(slugText);
    showToast(`Copied slug "/deployments/${slugText}" to clipboard`);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const generateSlug = (rawTitle: string) => {
    return rawTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingDepId || !idSlug) {
      setIdSlug(generateSlug(val));
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingDepId(null);
    setTitle('');
    setIdSlug('');
    setCategory('SAAS DASHBOARDS');
    setBadge('FEATURED');
    setIsFeatured(true);
    setClient('');
    setYear('2026');
    setShortDescription('');
    setFullDescription('');
    setThumbnailUrl('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80');
    setCoverImageUrl('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80');
    setDemoUrl('');
    setGithubUrl('');
    setLiveUrl('');
    setRating(4.9);
    setUsersCount('10k+');
    setViewsCount('50k');
    setTags(['React', 'Tailwind', 'Next.js']);
    setTechStack(['Next.js 15', 'TypeScript', 'Tailwind CSS']);
    setFeatures([
      'Real-time edge telemetry synchronization',
      'Zero-trust authentication & access security',
      'Sub-50ms global TTFB edge cache'
    ]);
    setTechnicalMetrics([
      { label: 'Bundle Size', value: '42kb' },
      { label: 'FPS Benchmark', value: '60 FPS' },
      { label: 'Audit Score', value: '100/100' }
    ]);
    setFpsBenchmark(60);
    setAuditScore(100);
    setStatus('Production');
    setIsPublished(true);
    setDisplayOrder(deployments.length + 1);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (dep: DeploymentProduct) => {
    setEditingDepId(dep.id);
    setTitle(dep.title);
    setIdSlug(dep.id || dep.slug || generateSlug(dep.title));
    setCategory(dep.category || 'SAAS DASHBOARDS');
    setBadge(dep.badge || dep.badgeLabel || 'FEATURED');
    setIsFeatured(dep.isFeatured ?? true);
    setClient(dep.client || 'Studio Partner');
    setYear(dep.year || '2026');
    setShortDescription(dep.shortDescription || '');
    setFullDescription(dep.fullDescription || dep.shortDescription || '');
    setThumbnailUrl(dep.thumbnailUrl || '');
    setCoverImageUrl(dep.coverImageUrl || dep.thumbnailUrl || '');
    setDemoUrl(dep.demoUrl || '');
    setGithubUrl(dep.githubUrl || dep.sourceUrl || '');
    setLiveUrl(dep.liveUrl || dep.demoUrl || '');
    setRating(dep.rating ?? 4.9);
    setUsersCount(dep.usersCount || '10k+');
    setViewsCount(dep.viewsCount || '50k');
    setTags(dep.tags || ['React', 'Tailwind']);
    setTechStack(dep.techStack || ['Next.js 15', 'TypeScript']);
    
    // Normalize features array if legacy key/value
    if (Array.isArray(dep.features)) {
      const normalizedFeatures = dep.features.map((f) => (typeof f === 'string' ? f : `${f.key}: ${f.value}`));
      setFeatures(normalizedFeatures);
    } else {
      setFeatures(['High-performance edge architecture']);
    }

    if (Array.isArray(dep.technicalMetrics) && dep.technicalMetrics.length > 0) {
      setTechnicalMetrics(dep.technicalMetrics);
    } else if (Array.isArray(dep.metrics)) {
      setTechnicalMetrics(dep.metrics.map((m, idx) => ({ label: `Metric ${idx + 1}`, value: m })));
    } else {
      setTechnicalMetrics([
        { label: 'Bundle Size', value: '42kb' },
        { label: 'FPS Benchmark', value: '60 FPS' }
      ]);
    }

    setFpsBenchmark(dep.fpsBenchmark ?? 60);
    setAuditScore(dep.auditScore ?? 100);
    setStatus(dep.status || 'Production');
    setIsPublished(dep.published ?? dep.isPublished ?? true);
    setDisplayOrder(dep.displayOrder ?? 1);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  // Save / Submit DeploymentProduct
  const handleSaveDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a deployment title');
      return;
    }

    const finalId = idSlug.trim() || editingDepId || generateSlug(title);
    const finalSlug = idSlug.trim() || generateSlug(title);

    const itemData: DeploymentProduct = {
      // 1. Basic Information
      id: finalId,
      title: title.trim(),
      category,
      badge: badge.trim() || undefined,
      badgeLabel: badge.trim() || undefined,
      isFeatured,

      // 2. Descriptions & Media
      shortDescription: shortDescription.trim() || 'High-performance architectural web deployment.',
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      coverImageUrl: coverImageUrl.trim() || thumbnailUrl.trim(),

      // 3. Links
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      sourceUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || demoUrl.trim() || undefined,

      // 4. Stats & Ratings
      rating: Number(rating) || 4.9,
      usersCount: usersCount.trim() || '10k+',
      viewsCount: viewsCount.trim() || '50k',

      // 5. Technical Metadata
      tags: tags.length > 0 ? tags : ['React', 'Tailwind'],
      techStack: techStack.length > 0 ? techStack : ['Next.js 15', 'TypeScript'],
      features: features.length > 0 ? features : ['High-performance responsive architecture'],
      technicalMetrics: technicalMetrics.length > 0 ? technicalMetrics : [
        { label: 'Bundle Size', value: '42kb' },
        { label: 'FPS Benchmark', value: '60 FPS' }
      ],

      // Extended Relational fields
      slug: finalSlug,
      client: client.trim() || 'Studio Partner',
      year: year.trim() || '2026',
      metrics: technicalMetrics.map((tm) => `${tm.label}: ${tm.value}`),
      fpsBenchmark: Number(fpsBenchmark) || 60,
      auditScore: Number(auditScore) || 100,
      status,
      displayOrder: Number(displayOrder) || 1,
      lastDeployed: 'Just now',
      published: isPublished,
      isPublished
    };

    const res = await upsertDeploymentAction(itemData);
    if (res.success) {
      setDeployments((prev) => {
        const index = prev.findIndex((d) => d.id === itemData.id);
        const updated = index >= 0 ? prev.map((d) => (d.id === itemData.id ? itemData : d)) : [itemData, ...prev];
        localStorage.setItem('anorent_cms_deployments', JSON.stringify(updated));
        localStorage.setItem('lumaora_cms_deployments', JSON.stringify(updated));
        return updated;
      });
      setIsModalOpen(false);
      sound.playSuccess();
      router.refresh();
      showToast(`Saved "${itemData.title}" & synchronized with /api/deployments`);
    } else {
      showToast(`Error: ${res.message}`);
    }
  };

  // Delete DeploymentProduct
  const handleDelete = async (id: string, depTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${depTitle}"?`)) return;
    const res = await deleteDeploymentAction(id);
    if (res.success) {
      setDeployments((prev) => {
        const filtered = prev.filter((d) => d.id !== id);
        localStorage.setItem('anorent_cms_deployments', JSON.stringify(filtered));
        localStorage.setItem('lumaora_cms_deployments', JSON.stringify(filtered));
        return filtered;
      });
      sound.playTrash();
      router.refresh();
      showToast(`Deleted "${depTitle}"`);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (dep: DeploymentProduct) => {
    const updatedItem: DeploymentProduct = {
      ...dep,
      isFeatured: !dep.isFeatured,
      badge: !dep.isFeatured ? (dep.badge || 'FEATURED') : dep.badge
    };
    await upsertDeploymentAction(updatedItem);
    setDeployments((prev) => {
      const nextList = prev.map((d) => (d.id === dep.id ? updatedItem : d));
      localStorage.setItem('anorent_cms_deployments', JSON.stringify(nextList));
      localStorage.setItem('lumaora_cms_deployments', JSON.stringify(nextList));
      return nextList;
    });
    sound.playHoverTick();
    router.refresh();
    showToast(`"${dep.title}" featured status: ${updatedItem.isFeatured ? 'ACTIVE (Featured)' : 'STANDARD'}`);
  };

  // 1. Tag helper
  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // 2. Tech Stack helper
  const handleAddTech = () => {
    if (newTechInput.trim() && !techStack.includes(newTechInput.trim())) {
      setTechStack([...techStack, newTechInput.trim()]);
      setNewTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  // 3. Feature bullet helper
  const handleAddFeature = () => {
    if (newFeatureInput.trim() && !features.includes(newFeatureInput.trim())) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (featToRemove: string) => {
    setFeatures(features.filter((f) => f !== featToRemove));
  };

  // 4. Technical Metric key-value helper
  const handleAddTechnicalMetric = () => {
    if (newMetricLabel.trim() && newMetricValue.trim()) {
      setTechnicalMetrics([
        ...technicalMetrics,
        { label: newMetricLabel.trim(), value: newMetricValue.trim() }
      ]);
      setNewMetricLabel('');
      setNewMetricValue('');
    }
  };

  const handleRemoveTechnicalMetric = (indexToRemove: number) => {
    setTechnicalMetrics(technicalMetrics.filter((_, idx) => idx !== indexToRemove));
  };

  // Dropzone file handling
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG/JPG/WEBP)');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
        if (!coverImageUrl) setCoverImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered list with defensive null/undefined guards
  const filteredDeployments = (deployments || []).filter((d) => {
    if (!d) return false;
    const safeQuery = (searchQuery || '').trim().toLowerCase();
    const matchCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;

    if (!safeQuery) return matchCategory && matchStatus;

    const title = (d.title || '').toLowerCase();
    const slug = (d.slug || '').toLowerCase();
    const badge = (d.badge || '').toLowerCase();
    const client = (d.client || '').toLowerCase();
    const category = (d.category || '').toLowerCase();
    const shortDesc = (d.shortDescription || '').toLowerCase();
    const tagsMatch = Array.isArray(d.tags) && d.tags.some((t) => (t || '').toLowerCase().includes(safeQuery));
    const techMatch = Array.isArray(d.techStack) && d.techStack.some((t) => (t || '').toLowerCase().includes(safeQuery));

    const matchSearch =
      title.includes(safeQuery) ||
      slug.includes(safeQuery) ||
      badge.includes(safeQuery) ||
      client.includes(safeQuery) ||
      category.includes(safeQuery) ||
      shortDesc.includes(safeQuery) ||
      tagsMatch ||
      techMatch;

    return matchCategory && matchStatus && matchSearch;
  });

  // Summary Metrics
  const totalCount = deployments.length;
  const prodCount = deployments.filter((d) => d.status === 'Production').length;
  const featuredCount = deployments.filter((d) => d.isFeatured).length;
  const avgAudit = Math.round(deployments.reduce((acc, d) => acc + (d.auditScore || 100), 0) / (totalCount || 1));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#171717] border border-[#3B82F6]/50 text-white shadow-2xl shadow-[#3B82F6]/30 text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#3B82F6] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Overview Cards with DashboardHoloCard 3D Physics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(59, 130, 246, 0.45)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">
              <CyberScrambleText text="Total Deployments" scrambleSpeed={25} />
            </span>
            <FolderKanban className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            <CyberScrambleText text={String(totalCount)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live Website Schema Matched</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(16, 185, 129, 0.4)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-green-300">
              <CyberScrambleText text="API Endpoint Sync" scrambleSpeed={25} />
            </span>
            <Globe className="w-4 h-4 text-green-300" />
          </div>
          <div className="mt-2 text-2xl font-black text-green-300 font-mono flex items-center gap-2">
            <span>/api/deployments</span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Direct REST Synchronization</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(161, 161, 161, 0.4)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">
              <CyberScrambleText text="Featured Showcase" scrambleSpeed={25} />
            </span>
            <Star className="w-4 h-4 text-[#A1A1A1]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#A1A1A1] font-mono">
            <CyberScrambleText text={String(featuredCount)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Homepage hero priority</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(245, 158, 11, 0.4)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-200">
              <CyberScrambleText text="Avg Web Vitals" scrambleSpeed={25} />
            </span>
            <Zap className="w-4 h-4 text-amber-200" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-200 font-mono">
            <CyberScrambleText text={`${avgAudit}/100`} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lighthouse performance</p>
        </DashboardHoloCard>
      </div>

      {/* Action Header & Search Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111111]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderKanban className="w-5 h-5 text-[#3B82F6] shrink-0" />
              <KineticTitle text="DEPLOYMENTS MANAGER & SHOWCASE CONSOLE" size="sm" />
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#A1A1A1] border border-[#3B82F6]/30 shrink-0">
                Live Website Schema
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage product cards, detail view modals, tech stacks, tags, features, and technical metrics synced with <code className="text-[#3B82F6]">/api/deployments</code>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#171717] border border-white/10 shrink-0">
              <button
                onClick={() => {
                  sound.playHoverTick();
                  setViewMode('cards');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Product Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => {
                  sound.playHoverTick();
                  setViewMode('table');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Master Data Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <CyberButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                sound.playChime();
                handleOpenCreateModal();
              }}
            >
              Add Deployment
            </CyberButton>
          </div>
        </div>

        {/* Dedicated Search & Filter Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-white/5">
          {/* Search Input */}
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, badge, category, or stack..."
              className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]/50"
            />
          </div>

          {/* Filter Pills with Exact Categories */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 flex-nowrap sm:flex-wrap">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {(['ALL', ...CATEGORY_OPTIONS] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playHoverTick();
                    setCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 text-[11px] font-mono font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-[#3B82F6] text-white font-bold shadow-md shadow-[#3B82F6]/30'
                      : 'bg-[#171717] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat === 'ALL' ? 'ALL CATEGORIES' : cat}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10 shrink-0 hidden sm:block" />

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              {(['ALL', 'Production', 'Staging', 'Archived'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    sound.playHoverTick();
                    setStatusFilter(st);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    statusFilter === st
                      ? 'bg-white/20 text-white border border-white/30 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PRODUCT CARDS GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeployments.length === 0 ? (
            <div className="col-span-full py-20 px-6 text-center rounded-3xl bg-[#111111]/60 border border-neutral-700/20 backdrop-blur-xl space-y-4 shadow-2xl">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-neutral-800/20 animate-ping" />
                <FolderKanban className="w-6 h-6 text-[#3B82F6] relative z-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No deployments registered.</h4>
                <p className="text-xs font-mono text-[#A1A1A1]/70 max-w-md mx-auto">
                  Click &apos;New Deployment&apos; to publish your first production artifact to the PostgreSQL database.
                </p>
              </div>
              <CyberButton
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  sound.playChime();
                  setIsModalOpen(true);
                }}
              >
                New Deployment
              </CyberButton>
            </div>
          ) : (
            filteredDeployments.map((dep) => (
              <DashboardHoloCard
                key={dep.id}
                className="overflow-hidden shadow-2xl flex flex-col justify-between group p-0"
                glowColor={dep.isFeatured ? 'rgba(59, 130, 246, 0.45)' : 'rgba(161, 161, 161, 0.35)'}
              >
                <div>
                  {/* Thumbnail Cover with Floating Badges & Performance Benchmarks */}
                  <div className="relative h-48 w-full bg-black overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                    <img
                      src={dep.thumbnailUrl || dep.coverImageUrl}
                      alt={dep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/60" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#A1A1A1] border border-[#A1A1A1]/30">
                          {dep.category}
                        </span>
                        {dep.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase bg-amber-500/20 text-amber-200 border border-amber-500/40 backdrop-blur-md">
                            {dep.badge}
                          </span>
                        )}
                      </div>

                      <StatusRadarPulse
                        status={
                          dep.status === 'Production'
                            ? 'LIVE'
                            : dep.status === 'Staging'
                            ? 'SYNCING'
                            : 'MAINTENANCE'
                        }
                        label={dep.status || 'Production'}
                        size="sm"
                        className="bg-black/80 backdrop-blur-md border-white/20"
                      />
                    </div>

                    {/* Stats Overlaid on Thumbnail */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-2">
                        {dep.rating && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-amber-200 border border-amber-500/30 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-200" />
                            {dep.rating.toFixed(1)}
                          </span>
                        )}
                        {dep.usersCount && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-neutral-300 border border-neutral-700/30 flex items-center gap-1">
                            <Users className="w-3 h-3 text-neutral-300" />
                            {dep.usersCount}
                          </span>
                        )}
                        {dep.viewsCount && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-slate-300 border border-white/20 flex items-center gap-1 hidden sm:flex">
                            <Eye className="w-3 h-3 text-slate-400" />
                            {dep.viewsCount}
                          </span>
                        )}
                      </div>

                      {dep.isFeatured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B82F6]/80 text-white shadow-md">
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#A1A1A1] transition-colors line-clamp-1">
                          {dep.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ID: <code className="text-[#A1A1A1]">{dep.id}</code> {dep.client && `• ${dep.client}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(dep)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          dep.isFeatured
                            ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#A1A1A1] shadow-[0_0_12px_rgba(59, 130, 246,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                        }`}
                        title="Toggle isFeatured"
                      >
                        <Star className={`w-4 h-4 ${dep.isFeatured ? 'fill-current text-[#A1A1A1]' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {dep.shortDescription}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dep.techStack && dep.techStack.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#171717] text-neutral-300 border border-neutral-700/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {dep.techStack && dep.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-500">
                          +{dep.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Technical Metrics Chips */}
                    {dep.technicalMetrics && dep.technicalMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                        {dep.technicalMetrics.slice(0, 2).map((tm, tmIdx) => (
                          <div
                            key={tmIdx}
                            className="p-1.5 rounded-lg bg-black/40 border border-white/5 flex flex-col"
                          >
                            <span className="text-[9px] font-mono text-slate-400 truncate">{tm.label}</span>
                            <span className="text-xs font-mono font-bold text-neutral-300 truncate">{tm.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 sm:p-5 pt-3 border-t border-white/5 mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {dep.demoUrl ? (
                      <a
                        href={dep.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/60 text-neutral-300 border border-neutral-700/30 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                        title="Visit Live Demo"
                      >
                        <span>VISIT DEMO</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : null}

                    {dep.githubUrl ? (
                      <a
                        href={dep.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-neutral-800/40 text-neutral-300 border border-neutral-700/30 transition-colors"
                        title="GitHub Repository"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                      </a>
                    ) : null}

                    <button
                      onClick={() => setDetailModalItem(dep)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Preview Detail View Modal"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playHoverTick();
                        handleOpenEditModal(dep);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#3B82F6]/20 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playHoverTick();
                        handleDelete(dep.id, dep.title);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </DashboardHoloCard>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MASTER TABLE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-[#111111]/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#171717]/90 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Preview</th>
                  <th className="py-3.5 px-4">Title & ID</th>
                  <th className="py-3.5 px-4">Category & Badge</th>
                  <th className="py-3.5 px-4">Stats & Rating</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4 text-center">isFeatured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDeployments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-400 font-mono text-xs">
                      No deployments registered. Click &apos;New Deployment&apos; to publish your first production artifact.
                    </td>
                  </tr>
                ) : (
                  filteredDeployments.map((dep) => (
                    <tr key={dep.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Thumbnail Preview */}
                      <td className="py-3 px-4">
                        <div className="relative w-16 h-11 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                          <img
                            src={dep.thumbnailUrl}
                            alt={dep.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {dep.isFeatured && (
                            <div className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-[#3B82F6] text-white">
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title + ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{dep.title}</span>
                          {dep.demoUrl && (
                            <a
                              href={dep.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#3B82F6] hover:text-[#A1A1A1] transition-colors"
                              title="Visit Demo"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                          <span className="text-[#A1A1A1]">ID: {dep.id}</span>
                          <button
                            onClick={() => handleCopySlug(dep.id)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                            title="Copy ID"
                          >
                            {copiedSlug === dep.id ? (
                              <CheckCircle2 className="w-3 h-3 text-green-300" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Category & Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-[#171717] text-[#A1A1A1] border border-[#3B82F6]/30 w-fit">
                            {dep.category}
                          </span>
                          {dep.badge && (
                            <span className="text-[10px] font-mono text-amber-200">
                              [{dep.badge}]
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stats & Rating */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                          <span className="text-amber-200 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-200" /> {dep.rating?.toFixed(1) || '4.9'}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {dep.usersCount || '10k+ users'} • {dep.viewsCount || '50k views'}
                          </span>
                        </div>
                      </td>

                      {/* Tech Stack */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {dep.techStack?.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* isFeatured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(dep)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            dep.isFeatured
                              ? 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#A1A1A1]'
                              : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                          }`}
                          title="Toggle isFeatured"
                        >
                          <Star className={`w-3.5 h-3.5 ${dep.isFeatured ? 'fill-current text-[#A1A1A1]' : ''}`} />
                        </button>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <StatusRadarPulse
                          status={
                            dep.status === 'Production'
                              ? 'LIVE'
                              : dep.status === 'Staging'
                              ? 'SYNCING'
                              : 'MAINTENANCE'
                          }
                          label={dep.status || 'Production'}
                          size="sm"
                        />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailModalItem(dep)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                            title="Preview Detail Modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(dep)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#3B82F6]/20 hover:text-[#A1A1A1] border border-white/10 text-slate-300 transition-colors cursor-pointer"
                            title="Edit Deployment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(dep.id, dep.title)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-slate-400 transition-colors cursor-pointer"
                            title="Delete Deployment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DETAIL VIEW MODAL PREVIEW (Simulating Live Website Detail View) */}
      {/* ========================================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#111111] border border-neutral-700/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Image Cover */}
            <div className="relative h-60 w-full bg-black overflow-hidden">
              <img
                src={detailModalItem.coverImageUrl || detailModalItem.thumbnailUrl}
                alt={detailModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
              
              <button
                onClick={() => setDetailModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-800/20 text-neutral-300 border border-neutral-700/40">
                      {detailModalItem.category}
                    </span>
                    {detailModalItem.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-200 border border-amber-500/40">
                        {detailModalItem.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">{detailModalItem.title}</h2>
                </div>

                {detailModalItem.rating && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/70 border border-amber-500/40 flex items-center gap-1.5 font-mono text-amber-200 text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-200" />
                    <span>{detailModalItem.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto font-mono">
              {/* Short & Full Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">Overview & Architecture</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {detailModalItem.fullDescription || detailModalItem.shortDescription}
                </p>
              </div>

              {/* Technical Metrics Grid */}
              {detailModalItem.technicalMetrics && detailModalItem.technicalMetrics.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-300 mb-2 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Live Technical Metrics</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {detailModalItem.technicalMetrics.map((tm, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#171717] border border-neutral-700/20">
                        <div className="text-[10px] text-slate-400">{tm.label}</div>
                        <div className="text-xs font-bold text-neutral-300 mt-0.5">{tm.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Bullet List */}
              {detailModalItem.features && detailModalItem.features.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-green-300 mb-2 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Key Features & Capabilities</span>
                  </h4>
                  <ul className="space-y-1.5 font-sans text-xs text-slate-300">
                    {detailModalItem.features.map((f, idx) => {
                      const text = typeof f === 'string' ? f : `${f.key}: ${f.value}`;
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-green-300 shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Tech Stack Chips */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">Tech Stack & Dependencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailModalItem.techStack?.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-neutral-800/40 text-neutral-300 border border-neutral-700/30">
                      {t}
                    </span>
                  ))}
                  {detailModalItem.tags?.map((tag, idx) => (
                    <span key={`tag-${idx}`} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-slate-300 border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="p-5 bg-[#171717] border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{detailModalItem.usersCount || '10k+'} Users</span>
                <span>•</span>
                <span>{detailModalItem.viewsCount || '50k'} Views</span>
              </div>

              <div className="flex items-center gap-2">
                {detailModalItem.githubUrl && (
                  <a
                    href={detailModalItem.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {detailModalItem.demoUrl && (
                  <a
                    href={detailModalItem.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#3B82F6] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-neutral-800/30"
                  >
                    <span>VISIT DEMO</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CRUD MODAL DRAWER FOR CREATING & EDITING DEPLOYMENTS */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#111111] border border-neutral-700/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#3B82F6]/20 text-[#A1A1A1] border border-[#3B82F6]/30">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingDepId ? `Edit Deployment: ${title}` : 'Create New Deployment'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Exact Live Website Schema Contract • Synced with <code className="text-[#3B82F6]">/api/deployments</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveDeployment} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section A: Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold border-b border-white/5 pb-1">
                  1. Basic Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Deployment Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Aether Cloud Infrastructure"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Unique ID / Slug *</label>
                    <input
                      type="text"
                      required
                      value={idSlug}
                      onChange={(e) => setIdSlug(e.target.value)}
                      placeholder="e.g. aether-cloud"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#171717] border border-white/10 text-[#A1A1A1] placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category Dropdown with Exact Categories */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category *</label>
                    <CyberDropdown<DeploymentCategory>
                      value={category}
                      onChange={(val) => setCategory(val)}
                      options={CATEGORY_OPTIONS}
                      size="sm"
                    />
                  </div>

                  {/* Badge & Quick Presets */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Badge Label (e.g. FEATURED, NEW, PRO)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="FEATURED"
                      className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl bg-[#171717] border border-white/10 text-amber-200 placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {BADGE_PRESETS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBadge(b)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${
                            badge === b
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Is Featured Checkbox */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="text-xs font-semibold text-slate-300">Featured Flag</label>
                    <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#171717] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-[#3B82F6] bg-[#111111] border-white/20 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-white font-medium">Feature on Homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section B: Descriptions & Media */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold border-b border-white/5 pb-1">
                  2. Descriptions & Media
                </h4>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Short Description (1-2 concise lines on Card) *</label>
                    <span className="text-[10px] font-mono text-slate-500">{shortDescription.length}/250 chars</span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    maxLength={250}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Concise overview shown on the product card..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Description (Detailed overview for Detail Modal View)</label>
                  <textarea
                    rows={3}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Comprehensive architectural overview, edge pipelines, and specifications..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                {/* Section B: Media & CDN Assets */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Thumbnail UploadDropzone */}
                    <ImageUploadDropzone
                      endpoint="projectThumbnail"
                      value={thumbnailUrl}
                      onChange={(url) => setThumbnailUrl(url)}
                      label="Project Thumbnail (Card Image) *"
                      description="Upload to UploadThing CDN (Max 4MB)"
                      aspectRatio="video"
                    />

                    {/* Project Cover Image UploadDropzone */}
                    <ImageUploadDropzone
                      endpoint="projectCover"
                      value={coverImageUrl}
                      onChange={(url) => setCoverImageUrl(url)}
                      label="Project Cover Photo (Showcase Banner)"
                      description="Upload to UploadThing CDN (Max 8MB)"
                      aspectRatio="video"
                    />
                  </div>

                  {/* Manual URL Fallbacks / Overrides */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400">Direct Thumbnail URL (Synced):</span>
                      <input
                        type="url"
                        required
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://utfs.io/f/... or https://..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400">Direct Cover URL (Optional):</span>
                      <input
                        type="url"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="https://utfs.io/f/... or https://..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C: Links */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold border-b border-white/5 pb-1">
                  3. Links
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Demo URL ("VISIT DEMO" Button)</label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://example-demo.com"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">GitHub URL (Repository, optional)</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Live URL (Primary site link)</label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://live-app.com"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              {/* Section D: Stats & Ratings */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold border-b border-white/5 pb-1">
                  4. Stats & Ratings
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Rating (e.g. 4.9)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#171717] border border-white/10 text-amber-200 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Users Count (e.g. '14.2k+')</label>
                    <input
                      type="text"
                      value={usersCount}
                      onChange={(e) => setUsersCount(e.target.value)}
                      placeholder="14.2k+"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#171717] border border-white/10 text-neutral-300 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Views Count (e.g. '98k')</label>
                    <input
                      type="text"
                      value={viewsCount}
                      onChange={(e) => setViewsCount(e.target.value)}
                      placeholder="98k"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#171717] border border-white/10 text-slate-200 focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              {/* Section E: Technical Metadata (Multi-chip inputs & key-value pairs) */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold border-b border-white/5 pb-1">
                  5. Technical Metadata (Tags, Tech Stack, Features & Metrics)
                </h4>

                {/* Tags Array Builder */}
                <div className="p-3.5 rounded-xl bg-[#171717]/70 border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Tags (array of strings, e.g. ["React", "Tailwind", "Three.js"])</span>
                    <span className="text-[10px] text-slate-500">Press Enter to Add</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="e.g. React, Tailwind, Three.js"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#3B82F6]/20 text-[#A1A1A1] hover:bg-[#3B82F6]/30 border border-[#3B82F6]/40 cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#171717] text-[#A1A1A1] border border-[#3B82F6]/30"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Array Builder */}
                <div className="p-3.5 rounded-xl bg-[#171717]/70 border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Tech Stack (array of strings, e.g. ["Next.js", "WebGL", "TypeScript"])</span>
                    <span className="text-[10px] text-slate-500">Press Enter to Add</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTechInput}
                      onChange={(e) => setNewTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="e.g. Next.js 15, WebGL, TypeScript, Prisma"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#A1A1A1]/20 text-[#A1A1A1] hover:bg-[#A1A1A1]/30 border border-[#A1A1A1]/40 cursor-pointer"
                    >
                      Add Stack
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#0c2438] text-[#A1A1A1] border border-[#A1A1A1]/30"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="text-slate-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features Array (Bullet points for detail modal) */}
                <div className="p-3.5 rounded-xl bg-[#171717]/70 border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Features (array of strings, bullet points for detail modal)</span>
                    <span className="text-[10px] text-slate-500">Press Enter to Add</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="e.g. Sub-10ms real-time telemetry streaming"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/40 cursor-pointer"
                    >
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-white/5 text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-300 shrink-0" />
                          <span>{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feat)}
                          className="text-slate-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Metrics Key-Value Pair Builder */}
                <div className="p-3.5 rounded-xl bg-[#171717]/70 border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Technical Metrics (array of &#123; label: string, value: string &#125;)</span>
                    <span className="text-[10px] text-slate-500">e.g. Bundle Size: 42kb, FPS: 60 FPS</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={newMetricLabel}
                      onChange={(e) => setNewMetricLabel(e.target.value)}
                      placeholder="Label (e.g. Bundle Size)"
                      className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <input
                      type="text"
                      value={newMetricValue}
                      onChange={(e) => setNewMetricValue(e.target.value)}
                      placeholder="Value (e.g. 42kb)"
                      className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTechnicalMetric}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-800/20 text-neutral-300 hover:bg-neutral-800/30 border border-neutral-700/40 cursor-pointer"
                    >
                      Add Metric
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {technicalMetrics.map((tm, tmIdx) => (
                      <div
                        key={tmIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#111111] border border-white/5 font-mono text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400">{tm.label}</span>
                          <span className="font-bold text-neutral-300">{tm.value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnicalMetric(tmIdx)}
                          className="text-slate-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section F: Publishing & Status */}
              <div className="p-4 rounded-xl bg-[#171717] border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Deployment Status</label>
                    <CyberDropdown<DeploymentStatus>
                      value={status}
                      onChange={(val) => setStatus(val)}
                      options={['Production', 'Staging', 'Archived']}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Display Sort Order</label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="text-xs font-semibold text-slate-300">Publish State</label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#111111] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded text-green-300 bg-[#111111] border-white/20 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-green-300 font-medium">Published to Live Site</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <CyberButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Sparkles className="w-4 h-4 text-neutral-300" />}
                >
                  {editingDepId ? 'Save & Sync Deployment' : 'Create & Sync Deployment'}
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
