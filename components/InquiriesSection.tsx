'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit3,
  Mail,
  Send,
  Building,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Star,
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Check,
  Flame,
  ArrowRight,
  GripVertical,
  TrendingUp,
  Zap,
  Layers
} from 'lucide-react';
import {
  ContactSubmission,
  SubmissionStatus,
  BudgetTier,
  ReviewItem
} from '@/lib/types';
import {
  updateSubmissionStatusAction,
  deleteSubmissionAction,
  toggleReviewApprovalAction,
  upsertReviewAction,
  deleteReviewAction
} from '@/lib/actions';
import { ButterButton } from './ButterButton';
import { CyberButton } from './CyberButton';
import { HoloCard } from './HoloCard';
import { DashboardHoloCard } from './DashboardHoloCard';
import { KineticTitle } from './KineticTitle';
import { sound } from '@/lib/sound';
import { CyberScrambleText } from './CyberScrambleText';
import { InquiryKanbanCard } from './InquiryKanbanCard';

interface StatusColumnDef {
  id: SubmissionStatus;
  label: string;
  dotColor: string;
  headerBg: string;
  headerBorder: string;
  accentBorderTop: string;
  titleColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeGlow: string;
  columnGlow: string;
  columnBorder: string;
}

const STATUS_COLUMNS: StatusColumnDef[] = [
  {
    id: 'NEW',
    label: 'New Intake',
    dotColor: 'bg-[var(--info-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--info-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--info-bg)]',
    badgeText: 'text-[var(--info-fg)]',
    badgeBorder: 'border-[var(--info-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  },
  {
    id: 'QUALIFYING',
    label: 'Qualifying Brief',
    dotColor: 'bg-[var(--warn-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--warn-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--warn-bg)]',
    badgeText: 'text-[var(--warn-fg)]',
    badgeBorder: 'border-[var(--warn-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  },
  {
    id: 'PROPOSAL_SENT',
    label: 'Proposal Sent',
    dotColor: 'bg-[var(--info-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--info-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--info-bg)]',
    badgeText: 'text-[var(--info-fg)]',
    badgeBorder: 'border-[var(--info-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  },
  {
    id: 'IN_NEGOTIATION',
    label: 'In Negotiation',
    dotColor: 'bg-[var(--info-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--info-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--info-bg)]',
    badgeText: 'text-[var(--info-fg)]',
    badgeBorder: 'border-[var(--info-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  },
  {
    id: 'WON',
    label: 'Won & Active',
    dotColor: 'bg-[var(--ok-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--ok-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--ok-bg)]',
    badgeText: 'text-[var(--ok-fg)]',
    badgeBorder: 'border-[var(--ok-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  },
  {
    id: 'LOST',
    label: 'Closed / Lost',
    dotColor: 'bg-[var(--neu-fg)]',
    headerBg: 'bg-[#111111]',
    headerBorder: 'border-b border-[#232323]',
    accentBorderTop: 'border-t-2 border-t-[var(--neu-border)]',
    titleColor: 'text-[#EDEDED]',
    badgeBg: 'bg-[var(--neu-bg)]',
    badgeText: 'text-[var(--neu-fg)]',
    badgeBorder: 'border-[var(--neu-border)]',
    badgeGlow: '',
    columnGlow: 'transparent',
    columnBorder: 'border-[#232323]'
  }
];

const INITIAL_SUBMISSIONS: ContactSubmission[] = [];
const INITIAL_REVIEWS: ReviewItem[] = [];

export const InquiriesSection: React.FC = () => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'KANBAN' | 'TABLE' | 'REVIEWS'>('KANBAN');
  
  // ContactSubmissions State - Initialized clean
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real database records on mount
  React.useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { fetchInquiriesAction, fetchReviewsAction } = await import('@/lib/actions');
        const [dbInquiries, dbReviews] = await Promise.all([
          fetchInquiriesAction(),
          fetchReviewsAction(),
        ]);
        if (mounted) {
          setSubmissions(dbInquiries);
          setReviews(dbReviews);
        }
      } catch (err) {
        console.warn('[Inquiries DB fetch warning]:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [budgetTierFilter, setBudgetTierFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [draggedSubmissionId, setDraggedSubmissionId] = useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = useState<SubmissionStatus | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRoleCompany, setReviewRoleCompany] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status Handler
  const handleUpdateStatus = async (id: string, newStatus: SubmissionStatus) => {
    const res = await updateSubmissionStatusAction(id, newStatus);
    if (res.success) {
      setSubmissions((prev) => {
        const updated = prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub));
        localStorage.setItem('anorent_cms_submissions', JSON.stringify(updated));
        localStorage.setItem('lumaora_cms_submissions', JSON.stringify(updated));
        return updated;
      });
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
      showToast(`Submission moved to ${newStatus} [${res.revalidatedPaths?.join(', ')}]`);
    }
  };

  // Save Notes on Selected Submission
  const handleSaveNotes = async (notes: string) => {
    if (!selectedSubmission) return;
    const res = await updateSubmissionStatusAction(selectedSubmission.id, selectedSubmission.status, notes);
    if (res.success) {
      setSubmissions((prev) => {
        const updated = prev.map((sub) =>
          sub.id === selectedSubmission.id ? { ...sub, internalNotes: notes } : sub
        );
        localStorage.setItem('anorent_cms_submissions', JSON.stringify(updated));
        localStorage.setItem('lumaora_cms_submissions', JSON.stringify(updated));
        return updated;
      });
      setSelectedSubmission({ ...selectedSubmission, internalNotes: notes });
      showToast('Internal notes saved successfully');
    }
  };

  // Delete Submission
  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Delete this contact submission?')) return;
    const res = await deleteSubmissionAction(id);
    if (res.success) {
      setSubmissions((prev) => {
        const filtered = prev.filter((sub) => sub.id !== id);
        localStorage.setItem('anorent_cms_submissions', JSON.stringify(filtered));
        localStorage.setItem('lumaora_cms_submissions', JSON.stringify(filtered));
        return filtered;
      });
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      showToast(`Submission deleted [${res.revalidatedPaths?.join(', ')}]`);
    }
  };

  // Review Approval Toggle
  const handleToggleReviewApproval = async (review: ReviewItem) => {
    const nextApproved = !review.isApproved;
    const res = await toggleReviewApprovalAction(review.id, nextApproved);
    if (res.success) {
      setReviews((prev) => {
        const updated = prev.map((r) => (r.id === review.id ? { ...r, isApproved: nextApproved } : r));
        localStorage.setItem('anorent_cms_reviews', JSON.stringify(updated));
        localStorage.setItem('lumaora_cms_reviews', JSON.stringify(updated));
        return updated;
      });
      showToast(`Review by ${review.name || review.author} is now ${nextApproved ? 'LIVE' : 'HIDDEN'} on website`);
    }
  };

  // Review Featured Toggle
  const handleToggleReviewFeatured = (review: ReviewItem) => {
    const nextFeatured = !review.isFeatured;
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === review.id ? { ...r, isFeatured: nextFeatured } : r));
      localStorage.setItem('anorent_cms_reviews', JSON.stringify(updated));
      localStorage.setItem('lumaora_cms_reviews', JSON.stringify(updated));
      return updated;
    });
    showToast(`Review by ${review.name || review.author} is now ${nextFeatured ? 'FEATURED' : 'STANDARD'}`);
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this client review?')) return;
    const res = await deleteReviewAction(id);
    if (res.success) {
      setReviews((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        localStorage.setItem('anorent_cms_reviews', JSON.stringify(filtered));
        localStorage.setItem('lumaora_cms_reviews', JSON.stringify(filtered));
        return filtered;
      });
      showToast('Review removed');
    }
  };

  // Add New Review
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: reviewName.trim(),
      roleCompany: reviewRoleCompany.trim() || 'Client',
      email: reviewEmail.trim() || 'client@example.com',
      rating: reviewRating,
      comment: reviewComment.trim(),
      dateString: 'Just now',
      isVerified: true,
      isApproved: true
    };

    const res = await upsertReviewAction(newRev);
    if (res.success) {
      setReviews((prev) => {
        const updated = [newRev, ...prev];
        localStorage.setItem('anorent_cms_reviews', JSON.stringify(updated));
        localStorage.setItem('lumaora_cms_reviews', JSON.stringify(updated));
        return updated;
      });
      setIsReviewModalOpen(false);
      setReviewName('');
      setReviewRoleCompany('');
      setReviewEmail('');
      setReviewComment('');
      showToast(`Review added and published [${res.revalidatedPaths?.join(', ')}]`);
    }
  };

  // Drag and Drop helpers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSubmissionId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: SubmissionStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoveredColumnId !== colId) {
      setHoveredColumnId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: SubmissionStatus) => {
    e.preventDefault();
    setHoveredColumnId(null);
    const subId = e.dataTransfer.getData('text/plain') || draggedSubmissionId;
    if (subId) {
      handleUpdateStatus(subId, targetStatus);
    }
    setDraggedSubmissionId(null);
  };

  // Filter logic with defensive null/undefined guards
  const filteredSubmissions = submissions.filter((sub) => {
    const safeQuery = (searchQuery || '').trim().toLowerCase();
    const clientName = (sub.name || sub.clientName || '').toLowerCase();
    const email = (sub.email || '').toLowerCase();
    const company = (sub.company || '').toLowerCase();
    const brief = (sub.message || sub.projectBrief || sub.projectType || '').toLowerCase();

    const matchBudget =
      budgetTierFilter === 'ALL' ||
      (sub.budget || sub.budgetTier) === budgetTierFilter;

    if (!safeQuery) return matchBudget;

    const matchSearch =
      clientName.includes(safeQuery) ||
      email.includes(safeQuery) ||
      company.includes(safeQuery) ||
      brief.includes(safeQuery);

    return matchBudget && matchSearch;
  });

  const getSubmissionsByStatus = (status: SubmissionStatus) =>
    filteredSubmissions.filter((sub) => sub.status === status);

  // Metrics
  const totalSubmissions = submissions.length;
  const unreadCount = submissions.filter((s) => s.status === 'UNREAD').length;
  const activeMilestones = submissions.filter((s) => s.status === 'MILESTONE_ACTIVE').length;
  const closedCount = submissions.filter((s) => s.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#171717] border border-[#3B82F6]/50 text-white shadow-2xl shadow-[#3B82F6]/30 text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#3B82F6] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Title Header */}
      <div className="p-5 rounded-2xl bg-[#111111]/90 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
            <KineticTitle text="INQUiRiES & ESCROW PiPELiNE" size="sm" />
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-800/20 text-neutral-300 border border-neutral-700/30">
              Live Intake
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            <CyberScrambleText text="Real-time client leads, escrow sprint stages, triage controls, and verified testimonials." scrambleSpeed={22} cycles={2} />
          </p>
        </div>
      </div>

      {/* Top Metrics Row with DashboardHoloCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(161, 161, 161, 0.35)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
              <CyberScrambleText text="Total Submissions" scrambleSpeed={25} />
            </span>
            <MessageSquare className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            <CyberScrambleText text={String(totalSubmissions)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Prisma ContactSubmission</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(245, 158, 11, 0.35)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-200">
              <CyberScrambleText text="Fresh Briefs (Unread)" scrambleSpeed={25} />
            </span>
            <Flame className="w-4 h-4 text-amber-200" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-200 font-mono">
            <CyberScrambleText text={String(unreadCount)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Needs architectural triage</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(16, 185, 129, 0.35)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-green-300">
              <CyberScrambleText text="Active Escrow Sprints" scrambleSpeed={25} />
            </span>
            <Zap className="w-4 h-4 text-green-300" />
          </div>
          <div className="mt-2 text-2xl font-black text-green-300 font-mono">
            <CyberScrambleText text={String(activeMilestones)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Milestone deployment phase</p>
        </DashboardHoloCard>

        <DashboardHoloCard className="p-0 shadow-lg relative overflow-hidden" glowColor="rgba(59, 130, 246, 0.35)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#3B82F6]">
              <CyberScrambleText text="Approved Reviews" scrambleSpeed={25} />
            </span>
            <Star className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#A1A1A1] font-mono">
            <CyberScrambleText text={String(reviews.filter((r) => r.isApproved).length)} scrambleSpeed={25} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Public showcase testimonials</p>
        </DashboardHoloCard>
      </div>

      {/* Console Tab Switcher & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111111]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#171717] border border-white/10 w-fit">
            <button
              onClick={() => {
                sound.playHoverTick();
                setActiveConsoleTab('KANBAN');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeConsoleTab === 'KANBAN'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban Pipeline</span>
            </button>

            <button
              onClick={() => {
                sound.playHoverTick();
                setActiveConsoleTab('TABLE');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeConsoleTab === 'TABLE'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Submissions Table</span>
            </button>

            <button
              onClick={() => {
                sound.playHoverTick();
                setActiveConsoleTab('REVIEWS');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeConsoleTab === 'REVIEWS'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews Moderation</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                {reviews.length}
              </span>
            </button>
          </div>

          {/* Quick Action Button */}
          {activeConsoleTab === 'REVIEWS' ? (
            <CyberButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                sound.playChime();
                setIsReviewModalOpen(true);
              }}
            >
              Add Client Review
            </CyberButton>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                Smooth drag & drop across status columns
              </span>
            </div>
          )}
        </div>

        {/* Filter Controls (for Submissions) */}
        {activeConsoleTab !== 'REVIEWS' && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-white/5">
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, email, company or brief contents..."
                className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="sm:col-span-6 flex items-center justify-end gap-2">
              <span className="text-xs text-slate-400 font-medium">Budget:</span>
              <select
                value={budgetTierFilter}
                onChange={(e) => setBudgetTierFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="ALL">All Budget Tiers</option>
                <option value="$1k - $3k (Micro Deployment)">$1k - $3k (Micro Deployment)</option>
                <option value="$3k - $7k (Full Web App)">$3k - $7k (Full Web App)</option>
                <option value="$7k - $15k (Enterprise Architecture)">$7k - $15k (Enterprise Architecture)</option>
                <option value="$15k+ (Bespoke Retainer / Studio Partner)">$15k+ (Bespoke Retainer)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeConsoleTab === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STATUS_COLUMNS.map((col) => {
            const columnSubs = getSubmissionsByStatus(col.id);
            const isColumnHovered = hoveredColumnId === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  sound.playChime();
                  handleDrop(e, col.id);
                }}
                className={`flex flex-col rounded-2xl bg-[#0c051a]/95 border transition-all duration-300 min-h-[480px] overflow-hidden ${
                  col.accentBorderTop
                } ${
                  isColumnHovered
                    ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/50 bg-[#14082c] shadow-[0_0_28px_rgba(59, 130, 246,0.3)]'
                    : `${col.columnBorder} shadow-xl shadow-black/60`
                }`}
              >
                {/* Custom Themed Column Header */}
                <div className={`p-3.5 ${col.headerBg} ${col.headerBorder} flex items-center justify-between transition-colors`}>
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    </div>
                    <span className={`text-xs font-black tracking-wide ${col.titleColor} drop-shadow-sm`}>
                      {col.label}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black tracking-wider ${col.badgeBg} ${col.badgeText} border ${col.badgeBorder} ${col.badgeGlow}`}
                  >
                    {columnSubs.length}
                  </span>
                </div>

                {/* Card Stream with safe scroll padding preventing cutoffs */}
                <div className="p-3 pb-8 space-y-3 flex-1 overflow-y-auto max-h-[640px]">
                  {columnSubs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5 rounded-2xl bg-[#0A0A0A]/60 border border-dashed border-white/10 my-auto min-h-[160px]">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-neutral-800/20 animate-ping" />
                        <div className="w-3 h-3 rounded-full bg-neutral-800" />
                      </div>
                      <p className="text-[11px] font-mono text-neutral-300/70 max-w-[200px] leading-relaxed">
                        No active transmissions in this lane. Waiting for incoming project briefs...
                      </p>
                    </div>
                  ) : (
                    columnSubs.map((sub) => {
                      const rawBudget = sub.budgetTier || sub.budget || '$5k - $10k';
                      const safeBudget = rawBudget.includes('(') ? rawBudget.split('(')[0].trim() : rawBudget;
                      const rawDate = sub.date || (sub.createdAt ? String(sub.createdAt).split('T')[0] : 'Recent');
                      const safeDate = rawDate.includes(',') ? rawDate.split(',')[0] : rawDate;

                      return (
                        <InquiryKanbanCard
                          key={sub.id}
                          id={sub.id}
                          clientName={sub.clientName || sub.name || 'Anonymous Client'}
                          email={sub.company || sub.email || 'No email'}
                          budgetTier={safeBudget}
                          projectBrief={sub.projectBrief || sub.message || 'No project brief provided'}
                          status={sub.status}
                          date={safeDate}
                          onDragStart={(e) => {
                            sound.playHoverTick();
                            handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, sub.id);
                          }}
                          onClick={() => {
                            sound.playHoverTick();
                            setSelectedSubmission(sub);
                          }}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: SUBMISSIONS TABLE */}
      {activeConsoleTab === 'TABLE' && (
        <div className="rounded-2xl bg-[#111111]/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#171717]/90 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Client / Brand</th>
                  <th className="py-3.5 px-4">Budget Tier</th>
                  <th className="py-3.5 px-4">Project Brief</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 font-mono text-xs">
                      No submissions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{sub.clientName}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {sub.email} {sub.company ? `• ${sub.company}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-[#3B82F6]/15 text-[#A1A1A1] border border-[#3B82F6]/30">
                          {sub.budgetTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="line-clamp-2 text-slate-300 leading-relaxed">{sub.projectBrief}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {sub.date}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <select
                          value={sub.status}
                          onChange={(e) => handleUpdateStatus(sub.id, e.target.value as SubmissionStatus)}
                          className="px-2 py-1 text-[10px] font-mono font-bold rounded-lg bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                        >
                          {STATUS_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#3B82F6]/20 hover:text-[#A1A1A1] border border-white/10 text-slate-300"
                            title="View Brief Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-slate-400"
                            title="Delete Submission"
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

      {/* VIEW 3: REVIEWS MODERATION */}
      {activeConsoleTab === 'REVIEWS' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#111111]/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#171717]/90 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Author / Company</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Quote / Comment</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-center">Verified</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-center">Live on Website</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-500 font-mono text-xs">
                        No reviews found. Click "Add Client Review" to create one.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{rev.author || rev.name}</div>
                          <div className="text-[11px] text-slate-400">{rev.company || rev.roleCompany}</div>
                          <div className="text-[10px] font-mono text-slate-500">{rev.email}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-amber-200">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <p className="line-clamp-2 text-slate-300 italic">"{rev.quote || rev.comment}"</p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          {rev.dateString}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {rev.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800/10 text-neutral-300 border border-neutral-700/20">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Unverified</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleReviewFeatured(rev)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                              rev.isFeatured
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-slate-700'
                            }`}
                          >
                            {rev.isFeatured ? 'FEATURED' : 'STANDARD'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleReviewApproval(rev)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                              rev.isApproved
                                ? 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30'
                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-slate-700'
                            }`}
                          >
                            {rev.isApproved ? 'LIVE' : 'HIDDEN'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-slate-400"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Drawer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#111111] border border-white/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-800/20 text-neutral-300 border border-neutral-700/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedSubmission.clientName}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Prisma ContactSubmission: <code className="text-[#3B82F6]">{selectedSubmission.id}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#171717]/70 border border-white/5 text-xs">
                <div>
                  <span className="text-slate-500 block">Direct Email:</span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-mono text-neutral-300 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{selectedSubmission.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Company / Brand:</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {selectedSubmission.company || 'Not Specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Budget Allocation:</span>
                  <span className="font-mono text-[#A1A1A1] font-bold mt-0.5 block">
                    {selectedSubmission.budgetTier}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Received Timestamp:</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">{selectedSubmission.date}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Scope Brief</label>
                <div className="p-4 rounded-xl bg-[#171717] border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedSubmission.projectBrief}
                </div>
              </div>

              {/* Status Selector & Quick Transitions */}
              <div className="p-4 rounded-xl bg-[#171717] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Kanban Status Pipeline</label>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleUpdateStatus(selectedSubmission.id, e.target.value as SubmissionStatus)}
                    className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    {STATUS_COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Status Transition CyberButtons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400">Quick Move:</span>
                  {STATUS_COLUMNS.filter(c => c.id !== selectedSubmission.status).map(col => (
                    <CyberButton
                      key={col.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedSubmission.id, col.id)}
                      className="text-[10px] py-0.5 px-2"
                    >
                      → {col.label}
                    </CyberButton>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Internal Architectural Notes (Prisma Field)
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedSubmission.internalNotes || ''}
                  onBlur={(e) => handleSaveNotes(e.target.value)}
                  placeholder="Add private technical notes, estimated sprint effort, or NDA status..."
                  className="w-full p-3 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
                />
                <p className="text-[10px] text-slate-500 mt-1">Changes save automatically on blur.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#171717] border-t border-white/10 flex items-center justify-between">
              <CyberButton
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => handleDeleteSubmission(selectedSubmission.id)}
              >
                Delete Submission
              </CyberButton>

              <div className="flex items-center gap-2">
                <CyberButton
                  variant="primary"
                  size="md"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => {
                    window.location.href = `mailto:${selectedSubmission.email}?subject=Architectural Proposal - Anorix Studio`;
                  }}
                >
                  Reply via Email
                </CyberButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-white/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Star className="w-5 h-5 text-amber-200 fill-amber-400" />
                <h3 className="text-base font-bold text-white">Add Client Review Item</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Role & Company</label>
                  <input
                    type="text"
                    value={reviewRoleCompany}
                    onChange={(e) => setReviewRoleCompany(e.target.value)}
                    placeholder="e.g. Managing Partner, Sterling Capital"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Star Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Client Testimonial *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the architectural outcome, speed, and feedback..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <CyberButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Star className="w-4 h-4 text-amber-200" />}
                >
                  Publish Client Review
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
