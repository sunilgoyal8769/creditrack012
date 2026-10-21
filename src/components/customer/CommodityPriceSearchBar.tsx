import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Tag,
  Copy,
  Check,
  X,
  PlusCircle,
  HelpCircle,
  RefreshCw,
  ShoppingBag,
  Store,
  Layers,
} from 'lucide-react';
import { CommodityPriceResult } from '../../types';
import { api } from '../../lib/api';

interface CommodityPriceSearchBarProps {
  onRecordSale?: (commodity: string, price: number, unit?: string) => void;
  className?: string;
}

const POPULAR_COMMODITIES = [
  { label: 'Atta (10kg)', query: 'Atta wheat flour 10kg retail price india' },
  { label: 'Toor Dal (1kg)', query: 'Toor arhar dal 1kg price india' },
  { label: 'Mustard Oil (1L)', query: 'Mustard oil 1 litre pouch price india' },
  { label: 'Basmati Rice (1kg)', query: 'Basmati rice 1kg retail price india' },
  { label: 'Sugar (1kg)', query: 'Sugar chini 1kg retail price india' },
  { label: 'Onion / Pyaz (1kg)', query: 'Onion pyaz 1kg retail mandi price india' },
  { label: 'Tomato (1kg)', query: 'Tomato tamatar 1kg retail mandi price india' },
  { label: 'Full Cream Milk (1L)', query: 'Amul full cream milk 1 litre price' },
];

export function CommodityPriceSearchBar({
  onRecordSale,
  className = '',
}: CommodityPriceSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CommodityPriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;

    if (searchQuery) {
      setQuery(searchQuery);
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.commodities.getMarketPrice(q);
      setResult(data);
      setIsExpanded(true);
    } catch (err: any) {
      console.error('Failed to fetch commodity price:', err);
      setError(err.message || 'Unable to fetch current market price. Please try another commodity.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleCopyPrice = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <div
      className={`rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-slate-900/5 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-slate-900/40 p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      {/* Component Header with Google Search Grounding Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-200/50 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Commodity Market Price Finder
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                <Sparkles className="w-2.5 h-2.5" />
                Google Search Grounded
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Live retail & mandi prices to help shopkeepers record accurate credit and goods sold
            </p>
          </div>
        </div>

        {result && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="self-end sm:self-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {isExpanded ? 'Hide Result' : 'Show Result'}
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="mt-3.5 space-y-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
          <input
            id="commodity-price-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Search commodity or grocery item (e.g., Mustard Oil 1L, Toor Dal, Atta 10kg, Basmati Rice, Onion)..."
            className="w-full pl-10 pr-28 sm:pr-32 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              id="commodity-price-search-btn"
              type="button"
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Rate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-[11px]">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-emerald-500" />
            <span>Popular:</span>
          </span>
          {POPULAR_COMMODITIES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => handleSearch(c.query)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all shrink-0 cursor-pointer shadow-2xs font-medium active:scale-95"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-emerald-500/20 rounded-md w-1/3" />
            <div className="h-6 bg-emerald-500/20 rounded-full w-24" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 pt-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Querying Google Search grounding for latest mandi & retail prices...</span>
          </div>
        </div>
      )}

      {/* Error View */}
      {error && !isLoading && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-bold">Search could not be completed</p>
              <p className="text-[11px] text-red-600/90 dark:text-red-400/90 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="text-[11px] font-bold text-red-800 dark:text-red-200 underline hover:no-underline cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Result Card */}
      {result && !isLoading && isExpanded && (
        <div className="mt-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-xs overflow-hidden">
          {/* Result Card Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-200" />
                <h3 className="font-extrabold text-sm sm:text-base capitalize">
                  {result.query}
                </h3>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>Updated via Google Search</span>
                <span>•</span>
                <span>{new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Price Highlight Badge */}
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/20 self-start sm:self-auto">
              <span className="text-[11px] text-emerald-200 font-semibold">Recommended Retail:</span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {result.estimatedPrice ? `₹${result.estimatedPrice}` : 'Market Range'}
              </span>
              {result.unit && <span className="text-[11px] text-emerald-100 font-medium">{result.unit}</span>}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Rates Summary Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.priceRange && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Retail Price Range:
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {result.priceRange}
                  </span>
                </div>
              )}

              {result.wholesaleRate && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Mandi / Wholesale Rate:
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {result.wholesaleRate}
                  </span>
                </div>
              )}
            </div>

            {/* Formatted Insights / Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 mb-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Market Breakdown & Insights</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                {result.summary}
              </div>
            </div>

            {/* Real Google Grounding Web Sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Google Search Sources ({result.sources.length}):</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {result.sources.map((src, i) => (
                    <a
                      key={`${src.uri}-${i}`}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-medium transition-colors"
                      title={src.title}
                    >
                      <span className="truncate max-w-[200px]">{src.title || 'Market Source'}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions for Shopkeepers */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {result.estimatedPrice && onRecordSale && (
                  <button
                    id="commodity-record-credit-btn"
                    type="button"
                    onClick={() => {
                      if (result.estimatedPrice) {
                        onRecordSale(result.query, result.estimatedPrice, result.unit);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Record Credit at ₹{result.estimatedPrice}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleCopyPrice(
                      result.estimatedPrice
                        ? `₹${result.estimatedPrice} ${result.unit || ''}`.trim()
                        : result.priceRange || result.query
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Rate</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
