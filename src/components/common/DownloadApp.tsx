import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ArrowDown,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface DownloadAppProps {
  variant?: 'landing' | 'settings' | 'card' | 'compact';
  className?: string;
  id?: string;
  showThemeToggle?: boolean;
}

export function DownloadApp({
  variant = 'landing',
  className = '',
  id = 'download-app-component',
  showThemeToggle = true,
}: DownloadAppProps) {
  const [showBuildGuide, setShowBuildGuide] = useState(false);
  const { isDark, setTheme } = useTheme();

  return (
    <section
      id={id}
      aria-label="Download CreditTrack Android App"
      className={`relative z-10 block w-full opacity-100 overflow-hidden rounded-3xl ${
        variant === 'landing'
          ? 'my-10 sm:my-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          : 'my-6 max-w-full'
      } ${className}`}
    >
      {/* Dynamic Multi-stop Emerald & Slate Gradient Background */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border-2 border-emerald-500/30 shadow-2xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden">
        {/* Ambient Gradient Glow Accents */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Badges, Download CTA & Theme Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Android Robot Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-xs">
                <svg className="w-4 h-4 fill-current text-emerald-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 5.92 6 7.8h12c0-1.88-.97-3.54-2.47-4.64zM9 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
                <span>CreditTrack Android App</span>
              </div>

              {/* Functional Theme & Appearance Selector */}
              {showThemeToggle && (
                <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
                  <span className="text-[11px] font-bold text-slate-300 px-2 flex items-center gap-1">
                    <span>Theme:</span>
                  </span>
                  <button
                    type="button"
                    id="download-app-theme-light-btn"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      !isDark
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Switch to Light Kirana Theme"
                    aria-label="Light Theme"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    id="download-app-theme-dark-btn"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Switch to Dark OLED Theme"
                    aria-label="Dark Theme"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Get the CreditTrack Android App for a better experience
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Experience ultra-fast bahi-khata ledger management directly on your Android phone or shop counter tablet. Track customer balances, issue PDF summaries, and send 1-click WhatsApp reminders with zero latency.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">100% Offline</div>
                  <div className="text-[10px] text-slate-400">Works without internet</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Instant Launch</div>
                  <div className="text-[10px] text-slate-400">Zero lag cash counter</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Private & Safe</div>
                  <div className="text-[10px] text-slate-400">Encrypted data</div>
                </div>
              </div>
            </div>

            {/* Prominent "Download APK" Button Area */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  id="prominent-download-apk-btn"
                  href="/CreditTrack.apk"
                  download="CreditTrack.apk"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer group active:scale-95 animate-pulse"
                >
                  {/* Android Robot SVG Icon */}
                  <svg className="w-6 h-6 text-slate-950 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 5.92 6 7.8h12c0-1.88-.97-3.54-2.47-4.64zM9 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                  </svg>
                  <span>Download APK</span>
                  <ArrowDown className="w-5 h-5 text-slate-950 group-hover:translate-y-1 transition-transform" />
                </a>

                <div className="text-center sm:text-left text-xs text-slate-300 space-y-0.5">
                  <div className="font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <span>Direct File Download (.apk)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-slate-400">Android 7.0+ • Release Build • Instant Install</div>
                </div>
              </div>

              {/* Accordion Guide: How APK is generated / compiled */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowBuildGuide((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer py-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>How to compile & update your own CreditTrack.apk file</span>
                  {showBuildGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showBuildGuide && (
                  <div className="mt-3 p-4 rounded-2xl bg-black/50 border border-emerald-500/25 text-xs text-slate-300 space-y-2.5 leading-relaxed">
                    <p className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      How to generate the .apk file for your web app:
                    </p>
                    <p>
                      CreditTrack is engineered as an installable Progressive Web App (PWA). You can package it into an Android APK using either method:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="font-bold text-emerald-300 block mb-1">1. Online Converter (Easiest)</span>
                        <p className="text-[11px] text-slate-400">
                          Once deployed on Vercel or your domain, paste the URL into <strong>PWA2APK</strong> or <strong>APKBuild.org</strong> to generate an Android Trusted Web Activity (TWA) APK.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="font-bold text-emerald-300 block mb-1">2. Capacitor CLI (Developer Route)</span>
                        <p className="text-[11px] text-slate-400">
                          Run <code>npm install @capacitor/core @capacitor/cli @capacitor/android</code>, initialize with <code>npx cap init</code>, and compile the signed APK in Android Studio.
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-300/90 pt-1 font-medium">
                      ✓ Simply place your compiled <code>CreditTrack.apk</code> in your <code>/public</code> directory before deploying so users trigger an immediate download!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sleek SVG Mobile Phone Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
              {/* Decorative Glow Ring behind phone */}
              <div className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent blur-xl pointer-events-none" />

              {/* Outer Phone Frame SVG Illustration */}
              <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-slate-700/80 shadow-2xl shadow-emerald-950/70">
                {/* Speaker Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                  <div className="w-8 h-1 rounded-full bg-slate-700" />
                </div>

                {/* Inner Screen Preview UI */}
                <div
                  className={`relative overflow-hidden rounded-[32px] pt-8 pb-5 px-3.5 space-y-3 transition-colors duration-300 ${
                    isDark
                      ? 'bg-slate-950 text-slate-100 border border-slate-800'
                      : 'bg-slate-50 text-slate-900 border border-slate-200'
                  }`}
                >
                  {/* Status Bar */}
                  <div
                    className={`flex items-center justify-between text-[10px] px-1 font-semibold ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>CreditTrack APK</span>
                    </div>
                  </div>

                  {/* App Header */}
                  <div
                    className={`flex items-center justify-between p-2 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                        BAHI-KHATA LEDGER
                      </div>
                      <div className="text-xs font-black">Sharma Kirana Store</div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                      CT
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-sm space-y-1">
                    <span className="text-[10px] text-emerald-100 font-semibold">Total Outstanding Udhaar</span>
                    <div className="text-xl font-black text-white">₹42,850</div>
                    <div className="flex items-center justify-between text-[10px] text-emerald-100/90 pt-1 border-t border-emerald-500/30">
                      <span>18 active customers</span>
                      <span className="font-bold">100% Synced</span>
                    </div>
                  </div>

                  {/* Customer Rows */}
                  <div className="space-y-1.5">
                    <div
                      className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold flex items-center justify-center">
                          R
                        </div>
                        <div>
                          <div className="text-[11px] font-bold">Rahul Sharma</div>
                          <div className="text-[9px] text-slate-400">Regular • 2 days ago</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-red-500">₹1,250</span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-bold flex items-center justify-center">
                          A
                        </div>
                        <div>
                          <div className="text-[11px] font-bold">Amit Kumar</div>
                          <div className="text-[9px] text-slate-400">Wholesale • Today</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-red-500">₹3,400</span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold flex items-center justify-center">
                          P
                        </div>
                        <div>
                          <div className="text-[11px] font-bold">Priya Verma</div>
                          <div className="text-[9px] text-emerald-500">Paid in full</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-500">₹0</span>
                    </div>
                  </div>

                  {/* Bottom Navigation Mockup */}
                  <div
                    className={`pt-1.5 flex items-center justify-around text-[9px] border-t ${
                      isDark ? 'border-slate-900 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="font-bold text-emerald-500">Ledger</span>
                    <span>Customers</span>
                    <span>Reminders</span>
                  </div>
                </div>

                {/* Home bar indicator */}
                <div className="w-24 h-1 bg-slate-500 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
