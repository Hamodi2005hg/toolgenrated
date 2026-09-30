import React, { useState, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle, Code2, Loader2, ExternalLink } from 'lucide-react';

interface GithubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultToken?: string;
  onSuccess: () => void;
}

export const GithubPushModal: React.FC<GithubPushModalProps> = ({
  isOpen,
  onClose,
  defaultToken = '',
  onSuccess,
}) => {
  const [token, setToken] = useState(defaultToken);
  const [commitMessage, setCommitMessage] = useState('تحديث شامل وإضافة أداة كتابة المقالات البشرية لـ SEO');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string; url?: string } | null>(null);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/github/push-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          message: commitMessage,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setStatusMsg({
          type: 'success',
          text: data.message || 'تم الرفع إلى المستودع بنجاح!',
          url: data.repoUrl,
        });
        onSuccess();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'فشلت عملية الرفع.',
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'حدث خطأ في الاتصال بالسيرفر.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">رفع المشروع إلى GitHub</h3>
              <p className="text-xs text-slate-400">Hamodi2005hg/toolgenrated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handlePush} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              رمز الوصول الشخصي (GitHub Access Token)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono dir-ltr"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              أدخل رمز وصول GitHub الخاص بك (ghp_...).
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              عنوان التغيير (Commit Message)
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Included Files Summary */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              الملفات التي سيتم إرسالها لمستودع GitHub:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1">✓ index.html</span>
              <span className="flex items-center gap-1">✓ metadata.json</span>
              <span className="flex items-center gap-1">✓ package.json</span>
              <span className="flex items-center gap-1">✓ server.ts</span>
              <span className="flex items-center gap-1">✓ src/App.tsx</span>
              <span className="flex items-center gap-1">✓ ArticleGenerator.tsx</span>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span>{statusMsg.text}</span>
                {statusMsg.url && (
                  <a
                    href={statusMsg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1 font-medium text-emerald-400 underline flex items-center gap-1"
                  >
                    مشاهدة التغيير على GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Submit & Cancel */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري رفع الأكواد...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  تأكيد الرفع المباشر
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
