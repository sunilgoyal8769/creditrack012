import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Laptop, Palette, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export function ThemeSettingsCard() {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  const options: { id: ThemeMode; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'light',
      title: 'Light Kirana Mode',
      desc: 'Crisp white paper ledger style, high contrast, perfect for bright daylight counters.',
      icon: Sun,
    },
    {
      id: 'dark',
      title: 'Dark OLED Mode',
      desc: 'Deep slate background, reduces eye strain at night, saves phone battery.',
      icon: Moon,
    },
    {
      id: 'system',
      title: 'System Automatic',
      desc: 'Automatically matches your device or Android phone display preferences.',
      icon: Laptop,
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Theme & Display Appearance</h2>
            <p className="text-xs text-slate-400">Personalize CreditTrack look and feel across your devices</p>
          </div>
        </div>

        {/* Quick Instant Toggle Button */}
        <motion.button
          type="button"
          id="quick-theme-toggle-settings-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          <span>Toggle to {isDark ? 'Light' : 'Dark'}</span>
        </motion.button>
      </div>

      {/* 3 Theme Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;

          return (
            <motion.button
              key={opt.id}
              type="button"
              id={`theme-option-${opt.id}-btn`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(opt.id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </div>

              {/* Mini UI color preview pill */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full border ${
                    opt.id === 'light'
                      ? 'bg-white border-slate-300'
                      : opt.id === 'dark'
                      ? 'bg-slate-950 border-slate-700'
                      : 'bg-gradient-to-r from-white to-slate-950 border-slate-400'
                  }`}
                />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isSelected ? 'Active Mode' : 'Select'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
