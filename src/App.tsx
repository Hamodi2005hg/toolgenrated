import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GithubStatusBanner } from './components/GithubStatusBanner';
import { ArticleGenerator } from './components/ArticleGenerator';
import { AiToolGenerator } from './components/AiToolGenerator';
import { ToolCard } from './components/ToolCard';
import { ToolRunnerModal } from './components/ToolRunnerModal';
import { GithubPushModal } from './components/GithubPushModal';
import { DEFAULT_TOOLS } from './data/defaultTools';
import { CustomTool, GithubRepoStatus } from './types';
import { Sparkles, Layers, SearchX, FileText, Wrench, Code2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'article' | 'catalog'>('article');

  const [tools, setTools] = useState<CustomTool[]>(() => {
    const saved = localStorage.getItem('toolgenerator_custom_tools');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...DEFAULT_TOOLS];
      } catch (e) {
        return DEFAULT_TOOLS;
      }
    }
    return DEFAULT_TOOLS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('toolgenerator_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  // Modals & Active States
  const [activeTool, setActiveTool] = useState<CustomTool | null>(null);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  // GitHub Repo Status
  const [repoStatus, setRepoStatus] = useState<GithubRepoStatus | null>(null);
  const [repoLoading, setRepoLoading] = useState(false);

  const fetchGithubStatus = async () => {
    setRepoLoading(true);
    try {
      const res = await fetch('/api/github/status');
      const data = await res.json();
      setRepoStatus(data);
    } catch (e) {
      setRepoStatus({ ok: false, error: 'فشل الاتصال بـ GitHub API' });
    } finally {
      setRepoLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('toolgenerator_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToolGenerated = (newTool: CustomTool) => {
    const updated = [newTool, ...tools];
    setTools(updated);

    const customOnly = updated.filter((t) => t.isAiGenerated);
    localStorage.setItem('toolgenerator_custom_tools', JSON.stringify(customOnly));

    setActiveTool(newTool);
    setIsRunnerOpen(true);
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleDeleteTool = (toolId: string) => {
    const updated = tools.filter((t) => t.id !== toolId);
    setTools(updated);
    const customOnly = updated.filter((t) => t.isAiGenerated);
    localStorage.setItem('toolgenerator_custom_tools', JSON.stringify(customOnly));
  };

  const handleRunTool = (tool: CustomTool) => {
    setActiveTool(tool);
    setIsRunnerOpen(true);
  };

  const filteredTools = tools
    .map((t) => ({ ...t, isFavorite: favorites.includes(t.id) }))
    .filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (selectedCategory === 'الكل') return matchesSearch;
      if (selectedCategory === 'المفضلة') return matchesSearch && tool.isFavorite;
      return matchesSearch && tool.category === selectedCategory;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Tajawal',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenPushModal={() => setIsPushModalOpen(true)}
        isRepoConnected={repoStatus?.ok || false}
        totalToolsCount={tools.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* GitHub Repository Status & Sync Banner */}
        <GithubStatusBanner
          repoStatus={repoStatus}
          loading={repoLoading}
          onRefresh={fetchGithubStatus}
          onOpenPushModal={() => setIsPushModalOpen(true)}
        />

        {/* Feature Navigation Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 my-6">
          <button
            onClick={() => setActiveTab('article')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'article'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>أداة توليد المقالات الحصرية بأسلوب بشري (SEO)</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>مولد ومكتبة أدوات الويب والمطورين</span>
          </button>
        </div>

        {/* Tab 1: SEO Article Generator Tool */}
        {activeTab === 'article' && <ArticleGenerator />}

        {/* Tab 2: General Tools Library & AI Generator */}
        {activeTab === 'catalog' && (
          <div>
            <AiToolGenerator onToolGenerated={handleToolGenerated} />

            <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">
                  {selectedCategory === 'الكل' ? 'مكتبة الأدوات الشاملة' : selectedCategory}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({filteredTools.length})
                </span>
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onRun={handleRunTool}
                    onToggleFavorite={handleToggleFavorite}
                    onDeleteTool={handleDeleteTool}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center my-8">
                <SearchX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">لم يتم العثور على أدوات تطابق بحثك</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  جرب تغيير كلمة البحث أو يمكنك إدخال وصف لأداتك المطلوبة في المولد الذكي أعلاه لتوليدها فوراً!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Tool Generator Platform</span>
            <span>•</span>
            <span>مستودع الجيتهاب: Hamodi2005hg/toolgenrated</span>
          </div>
          <p>© 2026 جميع الحقوق محفوظة - متصل ومزامن مع GitHub</p>
        </div>
      </footer>

      {/* Tool Runner Modal */}
      <ToolRunnerModal
        tool={activeTool}
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
      />

      {/* GitHub Push Code Modal */}
      <GithubPushModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
        onSuccess={fetchGithubStatus}
      />
    </div>
  );
}
