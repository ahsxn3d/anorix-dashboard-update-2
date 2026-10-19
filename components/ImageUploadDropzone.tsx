'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { sound } from '@/lib/sound';

export type UploadEndpoint = 'projectThumbnail' | 'projectCover' | 'avatarImage';

interface ImageUploadDropzoneProps {
  endpoint: UploadEndpoint;
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'avatar';
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  endpoint,
  value,
  onChange,
  label,
  description,
  aspectRatio = 'video',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setUploadProgress(100);
      if (res && res[0]) {
        const url = (res[0] as any).ufsUrl || res[0].url;
        onChange(url);
        setErrorMessage(null);
        sound.playSuccess();
      }
      setTimeout(() => setUploadProgress(0), 1000);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
    onUploadError: (error: Error) => {
      console.error('[UploadThing Client Error]:', error);
      setErrorMessage(error.message || 'Upload failed. Please check file size and try again.');
      setUploadProgress(0);
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    sound.playClick();
    try {
      await startUpload([file]);
    } catch (err) {
      console.error('[File Select Upload Error]:', err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
    sound.playHoverTick();
  };

  // Determine size hint by endpoint
  const sizeHints: Record<UploadEndpoint, string> = {
    projectThumbnail: 'Max 4MB (PNG, JPG, WEBP, GIF)',
    projectCover: 'Max 8MB (PNG, JPG, WEBP)',
    avatarImage: 'Max 2MB (PNG, JPG, WEBP)',
  };

  // Determine aspect ratio class
  const aspectClasses: Record<string, string> = {
    avatar: 'aspect-square max-w-[160px] rounded-full mx-auto',
    square: 'aspect-square max-w-[280px]',
    video: 'aspect-video w-full',
    wide: 'aspect-[21/9] w-full',
  };

  const isAvatar = aspectRatio === 'avatar';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Hint */}
      {(label || description) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#A1A1A1]" />
              {label}
            </label>
          )}
          {description && (
            <span className="text-[10px] font-mono text-slate-500">{description}</span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={isUploading}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
          <span className="flex-1 truncate">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload State or Existing Image Preview */}
      {value ? (
        /* Image Preview Box */
        <div
          className={`relative group overflow-hidden border border-neutral-700/30 hover:border-[#3B82F6] bg-[#0A0318] transition-all shadow-[0_0_30px_rgba(0,0,0,0.6)] ${
            isAvatar ? 'rounded-full aspect-square max-w-[160px] mx-auto' : 'rounded-2xl ' + aspectClasses[aspectRatio]
          }`}
        >
          <Image
            src={value}
            alt={label || 'Uploaded asset'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 600px"
            unoptimized={true}
          />

          {/* Dark Glass Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-green-500/20 text-green-300 border border-green-500/40 flex items-center gap-1 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                CDN STORED
              </span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 transition-colors backdrop-blur-md"
                title="View Full Resolution"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                {isUploading ? 'Uploading...' : 'Replace'}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>

          {/* Progress Bar inside preview if replacing */}
          {isUploading && (
            <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin" />
              <div className="w-full max-w-xs space-y-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A1A1A1] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                  <span>Uploading to CDN...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Dropzone Container */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-6 border-2 border-dashed bg-[#0B0418]/80 hover:bg-[#171717] backdrop-blur-xl ${
            isDragging
              ? 'border-neutral-700 bg-[#15082e] shadow-[0_0_30px_rgba(161, 161, 161,0.3)] scale-[0.99]'
              : 'border-neutral-700/30 hover:border-neutral-700/80 shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
          } ${isAvatar ? 'rounded-full aspect-square max-w-[160px] mx-auto' : 'rounded-2xl ' + aspectClasses[aspectRatio]}`}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

          {isUploading ? (
            /* Uploading State */
            <div className="w-full max-w-xs space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#170833] border border-neutral-700/40 flex items-center justify-center mx-auto text-[#A1A1A1] shadow-[0_0_20px_rgba(59, 130, 246,0.5)]">
                <UploadCloud className="w-6 h-6 animate-bounce text-[#A1A1A1]" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-white">Transmitting to CDN...</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] via-[#3B82F6] to-[#A1A1A1] transition-all duration-300 shadow-[0_0_10px_rgba(161, 161, 161,0.5)]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-neutral-300">UploadThing Node</span>
                  <span className="text-neutral-300 font-bold">{uploadProgress}%</span>
                </div>
              </div>
            </div>
          ) : (
            /* Idle Drag State */
            <div className="space-y-2.5 text-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-neutral-700/30 flex items-center justify-center mx-auto text-neutral-300 group-hover:text-[#A1A1A1] group-hover:border-[#A1A1A1]/60 group-hover:scale-110 transition-all shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>

              {!isAvatar && (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                      Drag & drop image or <span className="text-[#A1A1A1] underline">browse</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {sizeHints[endpoint]}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/10 border border-neutral-700/20 text-[9px] font-mono text-neutral-300">
                    <ShieldCheck className="w-3 h-3 text-neutral-300" />
                    Permanent CDN Hosting
                  </div>
                </>
              )}

              {isAvatar && (
                <p className="text-[10px] font-mono text-slate-400 font-bold">
                  Upload Avatar
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
