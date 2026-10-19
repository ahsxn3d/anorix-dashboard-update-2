'use client'

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  ExternalLink
} from 'lucide-react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; avatar: string }) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedAccount, setSelectedAccount] = useState<'primary' | 'secondary'>('primary');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<'idle' | 'oauth' | 'verifying' | 'success'>('idle');

  if (!isOpen) return null;

  const accounts = {
    primary: {
      name: 'Muhammad Ahsan',
      email: 'muhammadahsanjaved09@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Platform Owner & Architect'
    },
    secondary: {
      name: 'Ahsan Javed',
      email: 'ahsxn3d@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Creative Technologist'
    }
  };

  // Direct Live Google OAuth 2.0 Consent Screen Redirect
  const handleLiveGoogleOAuth = () => {
    setIsAuthenticating(true);
    setAuthStep('oauth');
    // Redirect browser directly to Google OAuth consent route
    window.location.href = '/api/auth/google';
  };

  // Quick Demo / Mock Account Switcher
  const handleQuickAccountSignIn = () => {
    setIsAuthenticating(true);
    setAuthStep('oauth');

    setTimeout(() => {
      setAuthStep('verifying');
    }, 600);

    setTimeout(() => {
      setAuthStep('success');
    }, 1200);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthStep('idle');
      const account = accounts[selectedAccount];
      onSuccess({
        name: account.name,
        email: account.email,
        avatar: account.avatar
      });
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a0a0a] rounded-3xl border border-white/15 p-6 space-y-6 overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isAuthenticating}
          className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white border border-white/15 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black border border-white/15 mb-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4]/20 via-[#EA4335]/20 to-[#34A853]/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <svg className="w-8 h-8 relative z-10 drop-shadow-md" viewBox="0 0 24 24">
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

          <h3 className="text-2xl font-black tracking-tight flex items-center justify-center gap-1.5 overflow-hidden">
            <span className="text-white">Sign In with</span>
            <span className="inline-flex items-center font-bold tracking-normal">
              <span className="animate-letter-bounce text-[#4285F4]" style={{ animationDelay: '0.05s' }}>G</span>
              <span className="animate-letter-bounce text-[#EA4335]" style={{ animationDelay: '0.12s' }}>o</span>
              <span className="animate-letter-bounce text-[#FBBC05]" style={{ animationDelay: '0.19s' }}>o</span>
              <span className="animate-letter-bounce text-[#4285F4]" style={{ animationDelay: '0.26s' }}>g</span>
              <span className="animate-letter-bounce text-[#34A853]" style={{ animationDelay: '0.33s' }}>l</span>
              <span className="animate-letter-bounce text-[#EA4335]" style={{ animationDelay: '0.40s' }}>e</span>
            </span>
          </h3>
          <p className="text-xs text-[#A1A1A1]">
            Authenticate to access <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#A1A1A1] to-[#A1A1A1] font-bold">Anorix Studio Cockpit</span>
          </p>
        </div>

        {/* Auth Steps Feedback */}
        {isAuthenticating ? (
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#3B82F6]/40 text-center space-y-4 animate-in fade-in">
            <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/20 border-t-[#3B82F6] animate-spin" />
              {authStep === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-green-300" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#3B82F6]" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {authStep === 'oauth' && 'Opening Google OAuth 2.0 Consent Screen...'}
                {authStep === 'verifying' && 'Verifying Security Tokens & Permissions...'}
                {authStep === 'success' && 'Authentication Successful!'}
              </p>
              <p className="text-xs text-[#A1A1A1] mt-1 font-mono">
                Redirecting to Google accounts...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Google Consent Screen Action */}
            <button
              onClick={handleLiveGoogleOAuth}
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-[0_4px_25px_rgba(66,133,244,0.35)] hover:shadow-[0_6px_35px_rgba(66,133,244,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between group border border-white/60"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24">
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
                <span className="font-bold text-xs tracking-wide">
                  Continue with Google Consent Screen
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-black transition-transform" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-mono text-[#A1A1A1]/60 uppercase tracking-widest">or quick demo profile</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Quick Account Switcher for Instant Dev Access */}
            <div className="space-y-2">
              {(Object.keys(accounts) as Array<'primary' | 'secondary'>).map((accKey) => {
                const acc = accounts[accKey];
                const isSelected = selectedAccount === accKey;

                return (
                  <button
                    key={accKey}
                    onClick={() => setSelectedAccount(accKey)}
                    className={`w-full p-2.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-black border-white'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-[#A1A1A1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#3B82F6]/50"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {acc.name}
                        </span>
                        <span className="text-[10px] text-[#A1A1A1] font-mono block">
                          {acc.email}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-white bg-white'
                          : 'border-white/20 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={handleQuickAccountSignIn}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-white hover:text-black text-white border border-white/20 text-xs transition-colors duration-500 cursor-pointer"
              >
                Sign In Selected Mock Profile
              </button>
            </div>

            {/* Persistent Session Note */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center gap-2.5 text-[10px] text-[#A1A1A1]">
              <Lock className="w-3.5 h-3.5 text-green-300 shrink-0" />
              <span>
                Session will remain signed in forever until explicitly signed out in Settings.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
