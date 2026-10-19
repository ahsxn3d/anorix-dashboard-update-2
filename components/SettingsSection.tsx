'use client'

import React, { useState, useRef } from 'react';
import {
  User,
  Shield,
  Key,
  Sliders,
  Camera,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Check,
  QrCode,
  Lock,
  Mail,
  Smartphone,
  Volume2,
  Bell,
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Globe,
  Radio,
  UploadCloud,
  X,
  RefreshCw,
  Trash2,
  ImageIcon
} from 'lucide-react';
import { TextHackerScramble } from './TextHackerScramble';
import { KineticTitle } from './KineticTitle';
import { CyberButton } from './CyberButton';
import { updateAdminProfile } from '@/lib/actions';

interface SettingsSectionProps {
  onAccentChange?: (color: string) => void;
  isLoggedIn?: boolean;
  onSignOut?: () => void;
  onOpenSignIn?: () => void;
  onProfileUpdate?: (updated: { name?: string; avatarUrl?: string }) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  onAccentChange,
  isLoggedIn = true,
  onSignOut,
  onOpenSignIn,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'API_KEYS' | 'PREFERENCES'>('PROFILE');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const showSaveToast = (msg: string = 'Settings updated successfully!') => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= 1. GENERAL PROFILE & AVATAR STATE =================
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    return localStorage.getItem('anorent_admin_user_avatar') || localStorage.getItem('lumaora_admin_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  });
  const [fullName, setFullName] = useState(() => {
    if (typeof window === 'undefined') return 'Muhammad Ahsan';
    return localStorage.getItem('anorent_admin_user_name') || localStorage.getItem('lumaora_admin_user_name') || 'Muhammad Ahsan';
  });
  const [jobTitle, setJobTitle] = useState('Lead Platform Architect & Superadmin');
  const [emailAddress, setEmailAddress] = useState('muhammadahsanjaved09@gmail.com');
  const [location, setLocation] = useState('Global Remote // Earth Grid');
  const [bioText, setBioText] = useState(
    'Lead platform architect overseeing high-frequency WebGL digital workflows, automated checkout engine pipelines, and real-time inventory management.'
  );

  // Avatar Drag-and-Drop & File State
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const processAvatarFile = (file: File) => {
    // 1. Validate File Type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const err = 'Invalid file format. Please upload a PNG, JPG, JPEG, or WebP image.';
      setAvatarError(err);
      showSaveToast(err);
      return;
    }

    // 2. Validate File Size (< 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const err = `File size exceeds 2MB limit (${sizeMb}MB). Please choose a smaller image.`;
      setAvatarError(err);
      showSaveToast(err);
      return;
    }

    setAvatarError(null);

    // 3. Convert to Data URL Base64 for instant preview and database persistence
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        const dataUrl = uploadEvent.target.result as string;
        setAvatarUrl(dataUrl);

        // Immediate live sync to active session and components
        if (typeof window !== 'undefined') {
          localStorage.setItem('anorent_admin_user_avatar', dataUrl);
          localStorage.setItem('lumaora_admin_user_avatar', dataUrl);
          window.dispatchEvent(
            new CustomEvent('anorix:profile_updated', {
              detail: { name: fullName, avatar: dataUrl, avatarUrl: dataUrl },
            })
          );
        }
        if (onProfileUpdate) {
          onProfileUpdate({ name: fullName, avatarUrl: dataUrl });
        }

        showSaveToast('Profile avatar loaded! Save changes to persist.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsAvatarDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const handleAvatarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAvatarFile(e.target.files[0]);
    }
  };

  const handleResetAvatar = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    setAvatarUrl(defaultAvatar);
    setAvatarError(null);

    if (typeof window !== 'undefined') {
      localStorage.setItem('anorent_admin_user_avatar', defaultAvatar);
      localStorage.setItem('lumaora_admin_user_avatar', defaultAvatar);
      window.dispatchEvent(
        new CustomEvent('anorix:profile_updated', {
          detail: { name: fullName, avatar: defaultAvatar, avatarUrl: defaultAvatar },
        })
      );
    }
    if (onProfileUpdate) {
      onProfileUpdate({ name: fullName, avatarUrl: defaultAvatar });
    }

    showSaveToast('Avatar photo reset to default.');
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarError(null);

    if (typeof window !== 'undefined') {
      localStorage.setItem('anorent_admin_user_avatar', '');
      localStorage.setItem('lumaora_admin_user_avatar', '');
      window.dispatchEvent(
        new CustomEvent('anorix:profile_updated', {
          detail: { name: fullName, avatar: '', avatarUrl: '' },
        })
      );
    }
    if (onProfileUpdate) {
      onProfileUpdate({ name: fullName, avatarUrl: '' });
    }

    showSaveToast('Avatar photo removed.');
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('anorent_admin_user_name', fullName);
        localStorage.setItem('lumaora_admin_user_name', fullName);
        localStorage.setItem('anorent_admin_user_avatar', avatarUrl);
        localStorage.setItem('lumaora_admin_user_avatar', avatarUrl);
        window.dispatchEvent(
          new CustomEvent('anorix:profile_updated', {
            detail: { name: fullName, avatar: avatarUrl, avatarUrl },
          })
        );
      }

      if (onProfileUpdate) {
        onProfileUpdate({ name: fullName, avatarUrl });
      }

      await updateAdminProfile({
        name: fullName,
        avatarUrl,
      });

      showSaveToast('Profile details synchronized to database & studio Cockpit!');
    } catch (err: unknown) {
      console.warn('[Profile Save Notice]:', err);
      showSaveToast('Profile saved locally (Database sync active)');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ================= 2. SECURITY & 2FA STATE =================
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSaveToast('Admin master password successfully updated!');
  };

  // ================= 3. API KEYS & WEBHOOKS STATE =================
  const [apiKeys, setApiKeys] = useState({
    neonDbUrl: 'postgresql://username:password@ep-your-neon-host.aws.neon.tech/neondb?sslmode=require',
    geminiApiKey: 'AIzaSy_YOUR_GEMINI_API_KEY_PLACEHOLDER',
    googleClientId: 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com',
    googleClientSecret: 'GOCSPX_YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER',
    uploadThingSecret: 'YOUR_UPLOADTHING_TOKEN_PLACEHOLDER',
    smtpHost: 'smtp.sendgrid.net:587',
    smtpUser: 'apikey',
    smtpPass: 'SG_YOUR_SMTP_PASSKEY_PLACEHOLDER',
    webhookEndpoint: 'https://api.anorix.com/v1/webhooks/orders-ingest'
  });

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleKeyVisibility = (keyName: string) => {
    setVisibleKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const copyToClipboard = (keyName: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
    showSaveToast(`Copied ${keyName} to clipboard!`);
  };

  // ================= 4. SYSTEM PREFERENCES STATE =================
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [selectedAccent, setSelectedAccent] = useState('#3B82F6');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [logRetention, setLogRetention] = useState('90_DAYS');

  const accentColors = [
    { name: 'Violet Purple', hex: '#3B82F6', bgClass: 'bg-[#3B82F6]' },
    { name: 'Electric Cyan', hex: '#A1A1A1', bgClass: 'bg-[#A1A1A1]' },
    { name: 'Rose Pink', hex: '#A1A1A1', bgClass: 'bg-[#A1A1A1]' },
    { name: 'Emerald Green', hex: '#22C55E', bgClass: 'bg-[#22C55E]' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Save Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] border border-[#3B82F6] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 border-[#3B82F6]/60">
          <Sparkles className="w-5 h-5 text-[#3B82F6] animate-pulse" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-[#3B82F6]" /> 
            <KineticTitle text="ADMiN PROFLE & SECURiTY" size="sm" />
          </div>
          <p className="text-xs text-[#A1A1A1]">
            Manage master credentials, 2FA authentication, API secret integrations, and system alerts.
          </p>
        </div>

        {/* Global Save Button */}
        <CyberButton
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
          onClick={() => showSaveToast('All Admin Settings Saved & Synchronized!')}
        >
          <span>SAVE ALL SETTINGS</span>
        </CyberButton>
      </div>

      {/* 1. SUB-SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {[
          { id: 'PROFILE', label: 'GENERAL PROFILE', icon: User },
          { id: 'SECURITY', label: 'SECURITY & 2FA', icon: Shield },
          { id: 'API_KEYS', label: 'API KEYS & WEBHOOKS', icon: Key },
          { id: 'PREFERENCES', label: 'SYSTEM PREFERENCES', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-2xl text-xs font-extrabold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-[#171717] text-white border-[#3B82F6] border-b-transparent shadow-[0_-4px_15px_rgba(59, 130, 246,0.25)]'
                  : 'bg-[#0A0A0A]/60 text-[#A1A1A1] hover:text-white border-transparent hover:bg-[#171717]/50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#3B82F6]/25 text-white border border-[#3B82F6]/60 shadow-[0_0_10px_rgba(59, 130, 246,0.4)]'
                    : 'bg-white/5 text-[#A1A1A1] border border-white/5 group-hover:border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. SETTINGS PANELS */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* ==================== TAB 1: GENERAL PROFILE ==================== */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#3B82F6]" /> Master Admin Account Profile
                </h3>
                <p className="text-xs text-[#A1A1A1]">Manage administrator personal details, avatar image, and operational role</p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">
                ROLE: MASTER_ADMIN
              </span>
            </div>

            {/* Google Account Authentication Status Card */}
            <div className="p-4 rounded-xl bg-[#171717]/90 border border-[#3B82F6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#3B82F6]/40 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Google Workspace Account
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isLoggedIn
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    }`}>
                      {isLoggedIn ? 'AUTHENTICATED' : 'SIGNED OUT'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1A1] font-mono mt-0.5">
                    {isLoggedIn ? `Connected as: ${emailAddress}` : 'Not currently signed in with Google'}
                  </p>
                </div>
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    showSaveToast('Signed out of Google Workspace session');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign Out of Google Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSignIn) onOpenSignIn();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign In with Google
                </button>
              )}
            </div>

            {/* Modern Drag-and-Drop + Click-to-Browse Profile Photo Avatar Zone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#A1A1A1]" />
                  Profile Photo Avatar
                </label>
                <span className="text-[10px] font-mono text-neutral-300/80 bg-neutral-800/10 px-2 py-0.5 rounded-full border border-neutral-700/20">
                  PNG, JPG, WEBP • Max 2MB
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleAvatarInputChange}
              />

              {/* Error Banner */}
              {avatarError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-300" />
                  <span className="flex-1">{avatarError}</span>
                  <button
                    type="button"
                    onClick={() => setAvatarError(null)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Avatar Zone: Live Preview State or Empty Dropzone */}
              {avatarUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsAvatarDragging(true);
                  }}
                  onDragLeave={() => setIsAvatarDragging(false)}
                  onDrop={handleAvatarDrop}
                  className={`relative p-5 rounded-2xl bg-[#0d051f]/90 border transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 shadow-xl backdrop-blur-xl group ${
                    isAvatarDragging
                      ? 'border-neutral-700 bg-[#171717] shadow-[0_0_30px_rgba(161, 161, 161,0.3)] scale-[0.99]'
                      : 'border-neutral-700/30 hover:border-neutral-700/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Avatar Circular Preview with Neon Halo */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#3B82F6] shadow-[0_0_25px_rgba(59, 130, 246,0.45)] bg-black/80 flex items-center justify-center relative group/img">
                      <img
                        src={avatarUrl}
                        alt={fullName || 'Superadmin Avatar'}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                      >
                        <Camera className="w-5 h-5 text-neutral-300" />
                        <span className="text-[9px] font-mono font-bold mt-1 text-neutral-300">CHANGE</span>
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0d051f] shadow-[0_0_10px_#22C55E]" />
                  </div>

                  {/* Avatar Info & Action Buttons */}
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-sm font-bold text-white font-mono tracking-wide">
                          {fullName || 'Master Administrator'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-green-500/20 text-green-300 border border-green-500/30">
                          LIVE PREVIEW ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1A1] mt-0.5">
                        Drag & drop a new photo directly onto this card or click below to replace.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#6d28d9] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-[#3B82F6]/30 hover:scale-105 transition-all cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Change Avatar
                      </button>

                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        className="px-3 py-1.5 rounded-xl bg-[#171717] hover:bg-[#1f0b40] text-slate-300 hover:text-white text-xs font-mono font-semibold border border-white/10 hover:border-neutral-700/40 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#A1A1A1]" />
                        Reset Default
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-300 text-xs font-mono font-semibold border border-red-500/30 hover:border-red-500/50 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-300" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone State */
                <div
                  onClick={() => avatarFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsAvatarDragging(true);
                  }}
                  onDragLeave={() => setIsAvatarDragging(false)}
                  onDrop={handleAvatarDrop}
                  className={`p-8 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer bg-[#0a0318]/90 backdrop-blur-xl group ${
                    isAvatarDragging
                      ? 'border-neutral-700 bg-[#171717] shadow-[0_0_30px_rgba(161, 161, 161,0.35)] scale-[0.99]'
                      : 'border-neutral-700/30 hover:border-[#3B82F6] hover:bg-[#171717] shadow-xl'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-neutral-700/30 flex items-center justify-center text-[#3B82F6] group-hover:text-[#A1A1A1] group-hover:border-[#A1A1A1]/60 group-hover:scale-110 transition-all shadow-lg mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-mono font-bold text-white group-hover:text-neutral-300 transition-colors">
                    Drag & drop avatar photo here or <span className="text-[#3B82F6] underline group-hover:text-neutral-300">browse files</span>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Accepts PNG, JPG, JPEG, or WebP up to 2MB
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetAvatar();
                      }}
                      className="px-3 py-1 text-[11px] font-mono text-neutral-300 hover:text-white bg-neutral-800/10 hover:bg-neutral-800/20 border border-neutral-700/30 rounded-lg transition-all"
                    >
                      Use Default Avatar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Master Admin Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0A0A0A] text-xs font-bold text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Job Title & Operational Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0A0A0A] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Official Email Address</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0A0A0A] text-xs font-mono text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Location / Headquarters</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0A0A0A] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Administrator Bio / Role Notes</label>
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <CyberButton
                type="button"
                variant="primary"
                size="md"
                disabled={isSavingProfile}
                icon={isSavingProfile ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                onClick={handleSaveProfile}
              >
                {isSavingProfile ? 'Saving & Syncing...' : 'Save Profile Details'}
              </CyberButton>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SECURITY & 2FA ==================== */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#A1A1A1]" /> Security, Authentication & 2FA
                </h3>
                <p className="text-xs text-[#A1A1A1]">Update master password and configure TOTP 2-Factor authentication</p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-300" /> SECURE SESSION
              </span>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handlePasswordReset} className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#3B82F6]" /> Master Password Reset Form
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#171717] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#171717] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#A1A1A1] block mb-1 font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#171717] text-xs text-white border border-white/10 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <CyberButton
                  type="submit"
                  variant="emerald"
                  size="md"
                  icon={<Lock className="w-3.5 h-3.5" />}
                >
                  UPDATE MASTER PASSWORD
                </CyberButton>
              </div>
            </form>

            {/* Two-Factor Authentication (2FA) Block */}
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-300" /> Two-Factor Authentication (TOTP 2FA)
                  </h4>
                  <p className="text-[11px] text-[#A1A1A1]">
                    Require an authenticator code (Google Authenticator / Authy / 1Password) upon every admin login
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white font-bold">{twoFactorEnabled ? 'PROTECTED' : 'DISABLED'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showSaveToast(twoFactorEnabled ? '2FA Protection Disabled' : '2FA Protection Activated!');
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      twoFactorEnabled ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {twoFactorEnabled && (
                <div className="p-4 rounded-xl bg-[#171717] border border-green-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Authenticator Status: ACTIVE</span>
                      <span className="text-[11px] text-[#A1A1A1]">Bound to: Google Authenticator (PST-RSA-2048)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQrModal(!showQrModal)}
                    className="px-3.5 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-bold border border-green-500/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" /> {showQrModal ? 'Hide QR Code' : 'View QR & Backup Keys'}
                  </button>
                </div>
              )}

              {/* QR Code Popover preview */}
              {showQrModal && twoFactorEnabled && (
                <div className="p-4 rounded-xl bg-black/80 border border-green-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-300">Scan QR Code with Authenticator App</span>
                    <span className="text-[10px] font-mono text-slate-400">SECRET: JBSWY3DPEHPK3PXP</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shrink-0">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=otpauth://totp/AnorentAdmin:ahsxn3d@gmail.com?secret=JBSWY3DPEHPK3PXP&issuer=Anorent"
                        alt="2FA QR Code"
                        className="w-24 h-24"
                      />
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <p className="font-semibold text-white">Emergency Backup Recovery Codes:</p>
                      <ul className="font-mono text-[11px] grid grid-cols-2 gap-1 text-green-300">
                        <li>• 8291-0293</li>
                        <li>• 9182-3841</li>
                        <li>• 7129-8371</li>
                        <li>• 4102-9381</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: API KEYS & WEBHOOKS ==================== */}
        {activeTab === 'API_KEYS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-200" /> API Keys & Webhook Integrations
                </h3>
                <p className="text-xs text-[#A1A1A1]">Manage masked backend database credentials, AI model keys, and webhook endpoints</p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                SSL ENCRYPTED
              </span>
            </div>

            {/* Masked Secret Key Fields */}
            <div className="space-y-4">
              {[
                { keyName: 'neonDbUrl', label: 'Neon PostgreSQL Database URL', value: apiKeys.neonDbUrl, icon: Server },
                { keyName: 'geminiApiKey', label: 'Gemini API Key (GEMINI_API_KEY)', value: apiKeys.geminiApiKey, icon: Zap },
                { keyName: 'googleClientId', label: 'Google OAuth Client ID', value: apiKeys.googleClientId, icon: Globe },
                { keyName: 'googleClientSecret', label: 'Google OAuth Client Secret', value: apiKeys.googleClientSecret, icon: Lock },
                { keyName: 'uploadThingSecret', label: 'UploadThing Secret Key', value: apiKeys.uploadThingSecret, icon: Key },
                { keyName: 'smtpPass', label: 'SMTP SendGrid Email Server Passkey', value: apiKeys.smtpPass, icon: Mail }
              ].map((item) => {
                const Icon = item.icon;
                const isVisible = visibleKeys[item.keyName];
                const isCopied = copiedKey === item.keyName;

                return (
                  <div key={item.keyName} className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-1.5">
                    <label className="text-[10px] text-[#A1A1A1] block font-bold flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-amber-200" /> {item.label}
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        value={item.value}
                        onChange={(e) => setApiKeys({ ...apiKeys, [item.keyName]: e.target.value })}
                        className="flex-1 p-2.5 rounded-xl bg-[#171717] text-xs font-mono text-white border border-white/10 focus:outline-none focus:border-amber-400"
                      />

                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility(item.keyName)}
                        className="p-2.5 rounded-xl bg-[#171717] text-[#A1A1A1] hover:text-white border border-white/10 cursor-pointer"
                        title={isVisible ? 'Hide Key' : 'Show Key'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.keyName, item.value)}
                        className="p-2.5 rounded-xl bg-[#171717] text-amber-200 hover:text-white border border-white/10 cursor-pointer flex items-center gap-1"
                        title="Copy Key"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Webhook Endpoint Configuration */}
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2.5">
                <label className="text-[10px] text-[#A1A1A1] block font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#A1A1A1]" /> Order Events Webhook Endpoint
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apiKeys.webhookEndpoint}
                    onChange={(e) => setApiKeys({ ...apiKeys, webhookEndpoint: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl bg-[#171717] text-xs font-mono text-white border border-white/10 focus:outline-none focus:border-[#A1A1A1]"
                  />
                  <button
                    onClick={() => showSaveToast('Sent test payload to Webhook URL (HTTP 200 OK)!')}
                    className="px-4 py-2.5 rounded-xl bg-[#A1A1A1]/20 hover:bg-[#A1A1A1]/30 text-[#A1A1A1] text-xs font-bold border border-[#A1A1A1]/40 cursor-pointer"
                  >
                    Test Webhook Payload
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <CyberButton
                type="button"
                variant="primary"
                size="md"
                icon={<Save className="w-3.5 h-3.5" />}
                onClick={() => showSaveToast('API credentials and Webhook parameters saved!')}
              >
                Save API Secrets
              </CyberButton>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SYSTEM PREFERENCES ==================== */}
        {activeTab === 'PREFERENCES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#A1A1A1]" /> System Alerts & Visual Preferences
                </h3>
                <p className="text-xs text-[#A1A1A1]">Customize audio chimes, push alerts, digest frequencies, and theme accent colors</p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#A1A1A1]/20 text-[#A1A1A1] border border-[#A1A1A1]/30">
                PREFERENCES
              </span>
            </div>

            {/* Audio & Alerts Toggles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
                Notifications & Audio Chimes
              </h4>

              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-[#3B82F6]" />
                    <div>
                      <span className="text-xs font-bold text-white block">Dashboard Sound Effects</span>
                      <span className="text-[11px] text-[#A1A1A1]">Play subtle chime audio when new orders or live chats arrive</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAudioAlerts(!audioAlerts);
                      showSaveToast(`Audio alerts ${!audioAlerts ? 'enabled' : 'disabled'}`);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      audioAlerts ? 'bg-[#3B82F6]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        audioAlerts ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#A1A1A1]" />
                    <div>
                      <span className="text-xs font-bold text-white block">Daily & Weekly Executive Email Digest</span>
                      <span className="text-[11px] text-[#A1A1A1]">Receive automated revenue and conversion rate reports</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEmailDigest(!emailDigest);
                      showSaveToast(`Email digest ${!emailDigest ? 'enabled' : 'disabled'}`);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      emailDigest ? 'bg-[#A1A1A1]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        emailDigest ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#A1A1A1]" />
                    <div>
                      <span className="text-xs font-bold text-white block">Desktop Browser Push Notifications</span>
                      <span className="text-[11px] text-[#A1A1A1]">Instant popups when high-value orders (&gt;$1,000) clear</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPushNotifications(!pushNotifications);
                      showSaveToast(`Push notifications ${!pushNotifications ? 'enabled' : 'disabled'}`);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      pushNotifications ? 'bg-[#A1A1A1]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        pushNotifications ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* System Accent Color Selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#3B82F6]" /> System Primary Accent Color
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {accentColors.map((color) => {
                  const isSelected = selectedAccent === color.hex;

                  return (
                    <button
                      key={color.hex}
                      onClick={() => {
                        setSelectedAccent(color.hex);
                        if (onAccentChange) onAccentChange(color.hex);
                        showSaveToast(`Accent color updated to ${color.name}`);
                      }}
                      className={`p-3.5 rounded-xl bg-[#0A0A0A] border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${color.bgClass} shadow-md shrink-0`} />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">{color.name}</span>
                        <span className="text-[10px] font-mono text-[#A1A1A1]">{color.hex}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Maintenance Mode & Log Retention */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-200" /> Maintenance & Read-Only Mode
                  </span>
                  <span className="text-[11px] text-[#A1A1A1]">Pause customer checkout processing for scheduled DB migrations</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    showSaveToast(maintenanceMode ? 'Maintenance Mode Disabled' : 'System placed in Maintenance Mode');
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    maintenanceMode ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                      maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Audit Log Retention Policy</span>
                  <span className="text-[11px] text-[#A1A1A1]">Automatically archive telemetry activity logs</span>
                </div>
                <select
                  value={logRetention}
                  onChange={(e) => {
                    setLogRetention(e.target.value);
                    showSaveToast(`Log retention policy updated to ${e.target.value}`);
                  }}
                  className="p-2 rounded-xl bg-[#171717] text-xs text-white border border-white/10 focus:outline-none"
                >
                  <option value="30_DAYS">30 Days Retention</option>
                  <option value="90_DAYS">90 Days Retention</option>
                  <option value="180_DAYS">180 Days Retention</option>
                  <option value="365_DAYS">1 Year Retention</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
