import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Search,
  BookOpen,
  Sliders,
  Share2,
  ExternalLink,
  Edit3,
  Award,
  Zap,
} from 'lucide-react';

interface GeneratedArticleData {
  title: string;
  metaDescription: string;
  keywordsList: string[];
  articleContent: string;
  imageSuggestions: Array<{
    label: string;
    arabicDescription: string;
    englishSearchQuery: string;
  }>;
  estimatedReadTime: string;
  seoScore: number;
}

export const ArticleGenerator: React.FC = () => {
  // Form State
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('العربية');
  const [wordCountLength, setWordCountLength] = useState('متوسط (800 - 1200 كلمة)');
  const [headings, setHeadings] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('بشري احترافي وسلس (SEO-Optimized)');

  // Execution State
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState<GeneratedArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          language,
          wordCountLength,
          headings,
          keywords,
          tone,
        }),
      });

      const data = await res.json();

      if (data.ok && data.article) {
        setArticleData(data.article);
        setEditableContent(data.article.articleContent);
      } else {
        setError(data.error || 'حدث خطأ أثناء توليد المقال. يرجى المحاولة لاحقاً.');
      }
    } catch (err: any) {
      setError(err.message || 'فشل الاتصال بخدمة توليد المقالات.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    if (!editableContent) return;
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (format: 'md' | 'txt' | 'html') => {
    if (!articleData) return;

    let content = editableContent;
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'md') {
      content = `# ${articleData.title}\n\n> **الوصف:** ${articleData.metaDescription}\n\n${editableContent}`;
      mimeType = 'text/markdown';
      ext = 'md';
    } else if (format === 'html') {
      content = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${articleData.title}</title>
  <meta name="description" content="${articleData.metaDescription}">
  <style>
    body { font-family: 'Tajawal', system-ui, sans-serif; background: #0f172a; color: #f1f5f9; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.8; }
    h1 { color: #818cf8; border-bottom: 2px solid #334155; padding-bottom: 0.5rem; }
    h2, h3 { color: #38bdf8; margin-top: 1.5rem; }
    .meta { background: #1e293b; p: 1rem; border-radius: 8px; margin-bottom: 2rem; border-right: 4px solid #6366f1; }
    img-box { background: #0284c7; padding: 1rem; border-radius: 8px; text-align: center; margin: 1.5rem 0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${articleData.title}</h1>
  <div class="meta">
    <p><strong>وصف الميتا (SEO Meta):</strong> ${articleData.metaDescription}</p>
    <p><strong>الكلمات المفتاحية:</strong> ${articleData.keywordsList.join(', ')}</p>
  </div>
  <div>${editableContent.replace(/\n/g, '<br/>')}</div>
</body>
</html>`;
      mimeType = 'text/html';
      ext = 'html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${articleData.title.replace(/\s+/g, '_')}.${ext}`;
    a.click();
  };

  const wordCount = editableContent
    ? editableContent.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-8 relative overflow-hidden">
      
      {/* Top Header Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">مولد المقالات البشري و SEO Expert</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% متوافق مع AdSense
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              توليد مقالات حصرية بأسلوب بشري طبيعي وكسر نمطية AI مع توزيع أماكن الصور وعناوين H2/H3 وصياغة متوافقة مع محركات البحث.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Model: Gemini 3.8 Flash Humanized Prompt
        </span>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerateArticle} className="space-y-5 mt-6">
        
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">
            عنوان المقال أو موضوع البحث الرئيسي <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: أفضل طرق تحسين محركات البحث SEO للمتاجر الإلكترونية في 2026..."
            required
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
          />
        </div>

        {/* Configurations Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              لغة المقالة
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="العربية">العربية (Arabic)</option>
              <option value="الإنجليزية">الإنجليزية (English)</option>
              <option value="الفرنسية">الفرنسية (French)</option>
              <option value="الألمانية">الألمانية (German)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              حجم المقالة المستهدف
            </label>
            <select
              value={wordCountLength}
              onChange={(e) => setWordCountLength(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="مختصر (500 - 800 كلمة)">مختصر (500 - 800 كلمة)</option>
              <option value="متوسط (800 - 1200 كلمة)">متوسط (800 - 1200 كلمة)</option>
              <option value="شامل ومفصل (1500+ كلمة)">شامل ومفصل (1500+ كلمة)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              نبرة وطابع الكتابة
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="بشري احترافي وسلس (SEO-Optimized)">بشري احترافي وسلس (SEO-Optimized)</option>
              <option value="حواري وقصصي مشوق">حواري وقصصي مشوق</option>
              <option value="تعليمي خطوة بخطوة">تعليمي خطوة بخطوة</option>
              <option value="تسويقي ومقنع">تسويقي ومقنع</option>
            </select>
          </div>
        </div>

        {/* Optional Inputs Accordion/Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              العناوين الرئيسية والفرعية (اختياري)
            </label>
            <textarea
              value={headings}
              onChange={(e) => setHeadings(e.target.value)}
              placeholder="اكتب العناوين التي تود تضمينها (مفصولة بأسطر)..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الكلمات المفتاحية المستهدفة (اختياري)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="ضع الكلمات المفتاحية لمستهدفات السيو تفصل بينها فاصلة..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري صياغة المقال بأسلوب بشري وسيو احترافي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>توليد المقال الأن</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Generated Article Display */}
      {articleData && (
        <div className="mt-10 pt-8 border-t border-slate-800 space-y-6 animate-fadeIn">
          
          {/* Article Header & Performance Bar */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  العنوان المنسق للمقال
                </span>
                <h3 className="text-2xl font-black text-white">{articleData.title}</h3>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-400 block font-semibold">SEO Score</span>
                  <strong className="text-sm text-emerald-300 font-extrabold">{articleData.seoScore || 98}/100</strong>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-indigo-400 block font-semibold">عدد الكلمات</span>
                  <strong className="text-sm text-indigo-300 font-extrabold">{wordCount} كلمة</strong>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-purple-400 block font-semibold">وقت القراءة</span>
                  <strong className="text-sm text-purple-300 font-extrabold">{articleData.estimatedReadTime || '5 دقائق'}</strong>
                </div>
              </div>
            </div>

            {/* Meta Description Box */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 block mb-1">
                📌 وصف الميتا لمتاجر ومحركات البحث (SEO Meta Description):
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{articleData.metaDescription}</p>
            </div>

            {/* Target Keywords Pills */}
            {articleData.keywordsList && articleData.keywordsList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">الكلمات المفتاحية:</span>
                {articleData.keywordsList.map((kw, i) => (
                  <span key={i} className="bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[11px]">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar for Copy & Downloads */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  editMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editMode ? 'المعاينة النهائية' : 'نموذج التعديل المباشر'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyContent}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={() => handleDownloadFile('md')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-medium border border-indigo-500/30 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل (.MD)</span>
              </button>

              <button
                onClick={() => handleDownloadFile('html')}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-medium border border-purple-500/30 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل (.HTML)</span>
              </button>
            </div>
          </div>

          {/* Main Article Content Container */}
          <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-4">
            
            {editMode ? (
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={22}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-xs font-mono text-slate-100 leading-relaxed focus:outline-none"
              />
            ) : (
              <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-4 font-sans dir-rtl">
                {editableContent.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-black text-white mt-6 mb-3 border-b border-slate-800 pb-2">{paragraph.replace('# ', '')}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold text-indigo-400 mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold text-sky-300 mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.includes('[مكان الصورة') || paragraph.startsWith('[')) {
                    return (
                      <div key={index} className="my-6 p-4 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-500/40 text-sky-200 text-xs flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold block text-sm text-sky-300">ملاحظة موضع صورة توضيحية:</span>
                            <p className="mt-0.5">{paragraph}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return <p key={index} className="text-slate-200 leading-8 text-sm md:text-base">{paragraph}</p>;
                })}
              </div>
            )}
          </div>

          {/* Image Suggestions Card */}
          {articleData.imageSuggestions && articleData.imageSuggestions.length > 0 && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                مقترحات الصور للبحث والتنزيل:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {articleData.imageSuggestions.map((img, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-indigo-300 block">{img.label || `الصورة ${idx + 1}`}</span>
                    <p className="text-slate-400">{img.arabicDescription}</p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">Query: {img.englishSearchQuery}</span>
                      <a
                        href={`https://unsplash.com/s/photos/${encodeURIComponent(img.englishSearchQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline text-[11px] flex items-center gap-1"
                      >
                        Unsplash <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
