'use client'

import React, { useState } from 'react';
import {
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  X,
  FileJson,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MasterWebsiteCustomizerData } from '@/lib/types';
import { ButterButton } from '@/components/ButterButton';
import { sound } from '@/lib/sound';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MasterWebsiteCustomizerData;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ExportJsonModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    onShowToast('Copied entire CMS JSON config to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    sound.playSuccess();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anorent-website-cms-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded CMS JSON configuration file', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[#111111] border border-neutral-700/30 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Export Website CMS Configuration JSON
              </h3>
              <p className="text-xs font-mono text-neutral-300/80">
                Full headless JSON structure compatible with external frontends and deployments.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Preview Box */}
        <div className="relative rounded-2xl bg-[#0A0A0A] border border-white/10 p-4 max-h-96 overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="text-xs font-mono text-slate-400">
            Total Entities: {data.deployments.length} Deployments, {data.reviews.length} Reviews, {data.milestones.length} Milestones
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-2 border border-white/10 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
            </button>
            <ButterButton onClick={handleDownload} variant="purple" size="md" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download .json File</span>
            </ButterButton>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedData: MasterWebsiteCustomizerData) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ImportJsonModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onShowToast
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      setValidationError(null);
    };
    reader.readAsText(file);
  };

  const handleValidateAndImport = () => {
    if (!jsonInput.trim()) {
      setValidationError('Please paste JSON content or upload a .json file.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // Validate core schema structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure. Must be an object.');
      }

      if (!parsed.deployments && !parsed.hero && !parsed.about) {
        throw new Error('JSON is missing essential CMS root keys (deployments, hero, about).');
      }

      sound.playSuccess();
      onImportSuccess(parsed as MasterWebsiteCustomizerData);
      onShowToast('Successfully imported and synchronized CMS state!', 'success');
      onClose();
    } catch (err: any) {
      sound.playClick();
      setValidationError(err.message || 'Malformed JSON syntax. Please check formatting.');
      onShowToast('JSON import validation failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-[#111111] border border-neutral-700/30 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800/20 border border-neutral-700/40 flex items-center justify-center text-neutral-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Import Website CMS Configuration
              </h3>
              <p className="text-xs font-mono text-neutral-300/80">
                Upload or paste a JSON configuration file to restore or synchronize content.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Upload Drop Area */}
        <div className="p-4 rounded-2xl bg-[#0A0A0A] border-2 border-dashed border-white/10 hover:border-neutral-700/50 text-center transition-all">
          <FileJson className="w-8 h-8 text-neutral-300 mx-auto mb-2 opacity-80" />
          <label className="text-xs font-mono text-slate-300 cursor-pointer block">
            <span className="text-neutral-300 font-bold underline">Choose .json file</span> or drag and drop
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* JSON Editor Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-300">
            Raw JSON Configuration Data
          </label>
          <textarea
            rows={10}
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setValidationError(null);
            }}
            placeholder='{\n  "hero": { ... },\n  "deployments": [ ... ]\n}'
            className="w-full px-4 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-neutral-300 font-mono text-xs focus:outline-none focus:border-neutral-700"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
          >
            Cancel
          </button>
          <ButterButton onClick={handleValidateAndImport} variant="cyan" size="md">
            Validate & Import State
          </ButterButton>
        </div>
      </div>
    </div>
  );
};

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetToDefaultsModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-200">
          <RotateCcw className="w-6 h-6" />
          <h3 className="text-base font-bold text-white font-mono">Reset CMS to Defaults?</h3>
        </div>

        <p className="text-xs font-mono text-slate-300 leading-relaxed">
          This will revert all 6 CMS customizer tabs (Hero, Deployments, Engineering Lab, Timeline, Reviews, and Contact/Footer) back to the official ANORENT Studio cybernetic defaults.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold shadow-lg shadow-amber-600/30"
          >
            Confirm Revert
          </button>
        </div>
      </div>
    </div>
  );
};
