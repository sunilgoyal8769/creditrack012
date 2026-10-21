import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  HelpCircle,
  TrendingUp,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const { business, isOwner } = useAuth();

  const navItems = isOwner
    ? [
        { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
        { id: 'customers', label: 'Customers (Grahak)', icon: Users },
        { id: 'transactions', label: 'All Transactions (Khata)', icon: Receipt },
        { id: 'settings', label: 'Settings & Store Info', icon: Settings },
      ]
    : [
        { id: 'customers', label: 'Customers (Grahak)', icon: Users },
        { id: 'transactions', label: 'All Transactions (Khata)', icon: Receipt },
        { id: 'settings', label: 'My Staff Account', icon: Settings },
      ];

  const content = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">CreditTrack</h2>
            <p className="text-xs text-slate-400">{business?.business_name}</p>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'customers' && currentView.startsWith('customer-'));
            return (
              <motion.button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        {/* Android App Download Banner */}
        <motion.a
          id="sidebar-download-apk-btn"
          href="/CreditTrack.apk"
          download="CreditTrack.apk"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 5.92 6 7.8h12c0-1.88-.97-3.54-2.47-4.64zM9 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black truncate flex items-center gap-1">
                <span>Android App</span>
                <span className="text-[10px] px-1 bg-white/25 rounded font-extrabold">APK</span>
              </div>
              <p className="text-[11px] text-emerald-100 truncate">1-Click Direct Download</p>
            </div>
          </div>
        </motion.a>

        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Digital Bahi-Khata</span>
          </div>
          <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-snug">
            All credit and repayment calculations are automated with real-time audit logs.
          </p>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span>CreditTrack v1.0</span>
          <span>Team Nexus</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
