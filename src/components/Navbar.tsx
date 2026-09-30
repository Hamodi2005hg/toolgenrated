import React from 'react';
import { Wrench, Github, Search, Plus, Sparkles, FolderGit2 } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenPushModal: () => void;
  isRepoConnected: boolean;
  totalToolsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenPushModal,
  isRepoConnected,
  totalToolsCount,
}) => {
  const categories = [
    'الكل',
    'برمجة وتطوير',
    'ألوان وتصميم',
    'حماية وتشفير',
    'رياضيات وحساب',
    'نصوص وتحويلات',
    'المفضلة',
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white tracking-tight">
                    Tool Generator
                  </h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {totalToolsCount} أداة
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  منصة توليد وتشغيل أدوات الويب ومزامنة الجيتهاب
                </p>
              </div>
            </div>

            {/* Mobile GitHub Push Button */}
            <button
              onClick={onOpenPushModal}
              className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400"
              title="رفع على GitHub"
            >
              <Github className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & GitHub Button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أداة برمجية، كلمة سر، لون، JSON..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={onOpenPushModal}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Github className="w-4 h-4 text-indigo-400" />
              <span>GitHub Sync</span>
              {isRepoConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
