import React, { useState } from 'react';
import { Wand2, Sparkles, Loader2, Lightbulb, Zap, Plus, ArrowLeft } from 'lucide-react';
import { CustomTool } from '../types';

interface AiToolGeneratorProps {
  onToolGenerated: (tool: CustomTool) => void;
}

export const AiToolGenerator: React.FC<AiToolGeneratorProps> = ({ onToolGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('برمجة وتطوير');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    'أداة حاسبة السعرات الحرارية والاحتياج اليومي للبروتين',
    'مولد أسماء المشاريع البرمجية والنطاقات المميزة',
    'متحول التاريخ من الهجري إلى الميلادي والعكس',
    'أداة فحص واكتشاف ثغرات نصوص SQL و XSS في الإدخال',
    'حاسبة الأقساط والقروض الشاملة مع جدولة الدفعات',
    'مولد نصوص لوريم إيبسوم باللغة العربية الفصحى',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      const data = await res.json();

      if (data.ok && data.tool) {
        const generatedTool: CustomTool = {
          ...data.tool,
          isAiGenerated: true,
          createdAt: new Date().toISOString(),
        };
        onToolGenerated(generatedTool);
        setPrompt('');
      } else {
        setError(data.error || 'فشل توليد الأداة. الرجاء المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع أثناء الاتصال بـ Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden my-8 backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
          <Wand2 className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            مولد الأدوات الذكي بذكاء Gemini AI
            <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
              Gemini 3.8 Flash
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            صف أي أداة أو خدمة صغيرة تريدها، وسيتم بناء واجهتها والأكواد المنطقية المشغلة لها فورياً!
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: أداة حساب ضريبة القيمة المضافة وتقسيم الفاتورة على الأشخاص..."
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none shrink-0"
          >
            <option value="برمجة وتطوير">برمجة وتطوير</option>
            <option value="ألوان وتصميم">ألوان وتصميم</option>
            <option value="حماية وتشفير">حماية وتشفير</option>
            <option value="رياضيات وحساب">رياضيات وحساب</option>
            <option value="نصوص وتحويلات">نصوص وتحويلات</option>
            <option value="صحة ولياقة">صحة ولياقة</option>
          </select>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري توليد الأداة...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                توليد الأداة الأن
              </>
            )}
          </button>
        </div>

        {/* Quick Inspiration Badges */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            اقتراحات سريعة لتوليد أدواتك:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(item)}
                className="text-xs bg-slate-950/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-lg px-3 py-1.5 transition-colors text-right"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};
