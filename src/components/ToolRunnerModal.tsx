import React, { useState, useEffect } from 'react';
import { X, Play, Copy, Check, Code2, RefreshCw, Sparkles, Terminal, Share2, Download } from 'lucide-react';
import { CustomTool } from '../types';

interface ToolRunnerModalProps {
  tool: CustomTool | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ToolRunnerModal: React.FC<ToolRunnerModalProps> = ({
  tool,
  isOpen,
  onClose,
}) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [outputValues, setOutputValues] = useState<Record<string, any>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'runner' | 'code'>('runner');
  const [execError, setExecError] = useState<string | null>(null);

  // Initialize input default values whenever tool changes
  useEffect(() => {
    if (tool) {
      const initial: Record<string, any> = {};
      tool.inputs.forEach((input) => {
        initial[input.id] = input.defaultValue ?? '';
      });
      setInputValues(initial);
      setExecError(null);
    }
  }, [tool]);

  // Execute JS logic whenever inputs change
  useEffect(() => {
    if (tool && Object.keys(inputValues).length > 0) {
      runLogic();
    }
  }, [inputValues, tool]);

  if (!isOpen || !tool) return null;

  const runLogic = () => {
    try {
      setExecError(null);
      // Create executable function from jsLogic string safely
      const executor = new Function('inputs', tool.jsLogic);
      const result = executor(inputValues) || {};
      setOutputValues(result);
    } catch (err: any) {
      setExecError(err.message || 'حدث خطأ في تنفيذ المنطق البرمجي للأداة.');
    }
  };

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportHtml = () => {
    const standaloneHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${tool.title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; max-width: 600px; margin: 0 auto; }
    h2 { color: #818cf8; }
    .box { background: #1e293b; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid #334155; }
    input, textarea, select { width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem; box-sizing: border-box; }
    pre { background: #0f172a; padding: 1rem; border-radius: 8px; font-family: monospace; overflow-x: auto; color: #38bdf8; }
  </style>
</head>
<body>
  <h2>${tool.title}</h2>
  <p>${tool.description}</p>
  <div class="box">
    <h3>كود المعالجة</h3>
    <pre>${tool.jsLogic}</pre>
  </div>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.id}-standalone.html`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                <span className="text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tool.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('runner')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'runner' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>تشغيل</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>الكود</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'runner' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Inputs Panel */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <h4 className="text-sm font-bold text-indigo-400 flex items-center justify-between">
                  <span>مدخلات الأداة</span>
                  <button
                    onClick={runLogic}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> إعادة التشغيل
                  </button>
                </h4>

                {tool.inputs.map((input) => (
                  <div key={input.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      {input.label}
                    </label>

                    {input.type === 'textarea' ? (
                      <textarea
                        value={inputValues[input.id] ?? ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        placeholder={input.placeholder}
                        rows={4}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    ) : input.type === 'select' ? (
                      <select
                        value={inputValues[input.id] ?? ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none"
                      >
                        {input.options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : input.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <input
                          type="checkbox"
                          checked={inputValues[input.id] === true || inputValues[input.id] === 'true'}
                          onChange={(e) => handleInputChange(input.id, e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                        />
                        <span className="text-xs text-slate-300">تفعيل هذا الخيار</span>
                      </label>
                    ) : input.type === 'color' ? (
                      <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={inputValues[input.id] || '#6366f1'}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-xs font-mono text-slate-200">
                          {inputValues[input.id] || '#6366f1'}
                        </span>
                      </div>
                    ) : input.type === 'range' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>{inputValues[input.id] ?? input.defaultValue}</span>
                          <span>المدى ({input.min || 0} - {input.max || 100})</span>
                        </div>
                        <input
                          type="range"
                          min={input.min || 0}
                          max={input.max || 100}
                          step={input.step || 1}
                          value={inputValues[input.id] ?? input.defaultValue ?? 10}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    ) : (
                      <input
                        type={input.type === 'number' ? 'number' : 'text'}
                        value={inputValues[input.id] ?? ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        placeholder={input.placeholder}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Outputs Panel */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center justify-between">
                    <span>مخرجات النتائج</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      معالجة فورية
                    </span>
                  </h4>

                  {execError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
                      ⚠️ خطأ في التنفيذ: {execError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {tool.outputs.map((out) => {
                      const val = outputValues[out.id] !== undefined ? String(outputValues[out.id]) : '...';

                      return (
                        <div key={out.id} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300">
                              {out.label}
                            </label>
                            <button
                              onClick={() => handleCopy(val, out.id)}
                              className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                            >
                              {copiedField === out.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">تم النسخ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>نسخ</span>
                                </>
                              )}
                            </button>
                          </div>

                          {out.type === 'code' || out.type === 'json' ? (
                            <pre className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-48">
                              {val}
                            </pre>
                          ) : (
                            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-100 font-medium leading-relaxed">
                              {val}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {tool.usageInstructions && (
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mt-4">
                    💡 <strong>طريقة الاستخدام:</strong> {tool.usageInstructions}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Code & Export Inspector Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  JavaScript Execution Function
                </span>
                <button
                  onClick={handleExportHtml}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل كملف Standalone HTML
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre">
                {tool.jsLogic}
              </pre>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">هيكلية كائن المدخلات (JSON Definition):</h5>
                <pre className="text-[11px] text-slate-400 font-mono overflow-x-auto">
                  {JSON.stringify(tool.inputs, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>متوافق ومعالج على السيرفر ومحلياً</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            إغلاق الأداة
          </button>
        </div>
      </div>
    </div>
  );
};
