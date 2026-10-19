'use client'

import React from 'react';
import { motion } from 'motion/react';

export interface InquiryKanbanCardProps {
  id: string;
  clientName: string;
  email: string;
  budgetTier: string;
  projectBrief: string;
  status: string;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
  priority?: string;
  date?: string;
  className?: string;
}

export const InquiryKanbanCard: React.FC<InquiryKanbanCardProps> = ({
  id,
  clientName,
  email,
  budgetTier,
  projectBrief,
  status,
  onClick,
  onDragStart,
  onDragEnd,
  draggable = true,
  priority,
  date,
  className = '',
}) => {
  return (
    // Native div handles HTML drag events; motion.div wraps for animations
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        layout
        layoutId={id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`p-3.5 rounded-xl bg-[#111111] border border-neutral-700/20 hover:border-neutral-700/60 shadow-lg cursor-pointer transition-colors space-y-2 select-none ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm text-white truncate">
            {clientName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-neutral-800/20 text-neutral-300 border border-neutral-700/30 shrink-0">
            {budgetTier}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span className="truncate">{email}</span>
          {date && <span className="text-[10px] text-slate-500 shrink-0">{date}</span>}
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {projectBrief}
        </p>

        {priority && (
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-300/80 font-semibold">{status}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              priority === 'URGENT'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : priority === 'HIGH'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {priority}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
