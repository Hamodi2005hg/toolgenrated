import React, { useState } from 'react';
import { Github, RefreshCw, UploadCloud, CheckCircle2, AlertCircle, ExternalLink, Sparkles, FolderGit2, Code2 } from 'lucide-react';
import { GithubRepoStatus } from '../types';

interface GithubStatusBannerProps {
  repoStatus: GithubRepoStatus | null;
  loading: boolean;
  onRefresh: () => void;
  onOpenPushModal: () => void;
}

export const GithubStatusBanner: React.FC<GithubStatusBannerProps> = ({
  repoStatus,
  loading,
  onRefresh,
  onOpenPushModal,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden my-6">
      {/* Subtle Background Glow */}
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Repo Info Section */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0">
            <FolderGit2 className="w-8 h-8" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                مستودع GitHub المحدد
              </span>
              {repoStatus?.ok ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  متصل وجاهز
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {loading ? 'جاري الفحص...' : 'في انتظار المزامنة'}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <span>Hamodi2005hg / toolgenrated</span>
              {repoStatus?.htmlUrl && (
                <a
                  href={repoStatus.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                  title="فتح المستودع على GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </h2>

            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تم ربط المستودع بنجاح. يمكنك مزامنة ورفع كافة أكواد التطبيق والمولد البرمجي إلى مستودع الجيتهاب بضغطة زر.
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                الفرع الأساسي: <strong className="text-slate-200 font-mono">{repoStatus?.defaultBranch || 'main'}</strong>
              </span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                عدد التغييرات (Commits): <strong className="text-slate-200">{repoStatus?.commitsCount || 0}</strong>
              </span>
              {repoStatus?.isEmpty && (
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/30">
                  المستودع فارغ حالياً ويحتاج رفع الأكواد الأولي
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
            title="تحديث حالة المستودع"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="lg:hidden">تحديث الحالة</span>
          </button>

          <button
            onClick={onOpenPushModal}
            className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
          >
            <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            <span>رفع الأكواد إلى GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
