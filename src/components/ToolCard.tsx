import React from 'react';
import { Play, Sparkles, Star, Tag, Code2, Trash2 } from 'lucide-react';
import { CustomTool } from '../types';

interface ToolCardProps {
  tool: CustomTool;
  onRun: (tool: CustomTool) => void;
  onToggleFavorite: (toolId: string) => void;
  onDeleteTool?: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onRun,
  onToggleFavorite,
  onDeleteTool,
}) => {
  return (
    <div className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700">
              {tool.category}
            </span>
            {tool.isAiGenerated && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                AI Tool
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`p-2 rounded-xl transition-colors ${
                tool.isFavorite
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={tool.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Star className={`w-4 h-4 ${tool.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {tool.isAiGenerated && onDeleteTool && (
              <button
                onClick={() => onDeleteTool(tool.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="حذف الأداة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
          {tool.title}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* Inputs & Outputs Pill summary */}
        <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
          <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800/80">
            المدخلات: {tool.inputs.length}
          </span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800/80">
            المخرجات: {tool.outputs.length}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tool.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] text-slate-500 font-mono">
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onRun(tool)}
          className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium text-xs transition-all flex items-center gap-1.5 group-hover:shadow-lg group-hover:shadow-indigo-600/30"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>تشغيل الأداة</span>
        </button>
      </div>
    </div>
  );
};
