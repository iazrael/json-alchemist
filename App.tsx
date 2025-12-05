import React, { useState, useEffect } from 'react';
import { stripComments, formatJson, minifyJson, validateJson, isGoLike } from './services/jsonUtils';
import { fixJsonWithOpenAI } from './services/openaiService';
import Toolbar from './components/Toolbar';
import SettingsModal from './components/SettingsModal';
import ThemeSelector from './components/ThemeSelector';
import { ProcessStatus, AIConfig, ThemeConfig } from './types';
import { AlertCircle, Code2, CheckCircle2, FileJson } from 'lucide-react';

const SAMPLE_JSON = `{
  // This is a comment
  "name": "JSON Alchemist",
  "version": 1.0,
  "features": [
    "Format",
    "Minify",
    /* Multi-line 
       comment */
    "AI Repair"
  ],
  "isAwesome": true,
  "oops": "missing_comma" 
}`;

const THEMES: ThemeConfig[] = [
  { name: '月夜黑主题', classPrefix: 'midnight' },
  { name: '云朵白主题', classPrefix: 'cloud' },
  { name: '海洋蓝主题', classPrefix: 'ocean' },
  { name: '青草绿主题', classPrefix: 'grass' },
  { name: '樱花粉主题', classPrefix: 'cherry' },
  { name: '橘子橙主题', classPrefix: 'citrus' },
  { name: '紫色主题', classPrefix: 'lavender' }
];

const DEFAULT_CONFIG: AIConfig = {
  provider: 'OPENAI',
  openAi: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-3.5-turbo'
  },
  theme: {
    name: '月夜黑主题',
    classPrefix: 'midnight'
  }
};

const App: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.Idle);
  const [isCopied, setIsCopied] = useState(false);
  const [detectedType, setDetectedType] = useState<'JSON' | 'GO' | 'UNKNOWN'>('JSON');
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('json_alchemist_config');
    if (saved) {
      const config = JSON.parse(saved);
      return config.theme || DEFAULT_CONFIG.theme;
    }
    return DEFAULT_CONFIG.theme;
  });
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('json_alchemist_config');
    const config = saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    // Ensure theme is properly set
    if (!config.theme) {
      config.theme = DEFAULT_CONFIG.theme;
    }
    return config;
  });

  // Save config to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('json_alchemist_config', JSON.stringify(aiConfig));
    // Update theme state when aiConfig changes
    if (aiConfig.theme) {
      setTheme(aiConfig.theme);
    }
  }, [aiConfig]);
  
  // Apply theme to document root
  useEffect(() => {
    document.documentElement.className = theme.classPrefix;
  }, [theme]);

  // Real-time validation & detection
  useEffect(() => {
    if (!input.trim()) {
      setError(null);
      setDetectedType('UNKNOWN');
      return;
    }

    // Check for JSON validity
    const { isValid, error: valError } = validateJson(input);
    
    if (isValid) {
      setError(null);
      setDetectedType('JSON');
    } else {
      // If invalid JSON, check if it looks like Go
      if (isGoLike(input)) {
        setDetectedType('GO');
        setError("Detected Golang format. Use 'Format' or 'AI Fix' to convert.");
      } else {
        setDetectedType('UNKNOWN');
        setError(valError);
      }
    }
  }, [input]);

  const handleAiFix = async () => {
    setStatus(ProcessStatus.Processing);
    setError(null);
    try {
      let fixed = '';
      fixed = await fixJsonWithOpenAI(input, aiConfig.openAi);
      
      // Auto-format the result from AI for better readability
      const formatted = formatJson(fixed);
      setOutput(formatted);
      
      // Update input logic: if we were fixing broken JSON, maybe update input?
      // Keeping original behavior: only update input if not converting form Go
      if (detectedType !== 'GO') {
          setInput(fixed);
      }
      
      setStatus(ProcessStatus.Success);
    } catch (e: any) {
      setError(e.message);
      setStatus(ProcessStatus.Error);
    }
  };

  const handleFormat = async () => {
    // If it looks like Go, we divert to AI Fix automatically for a "Smart Format" experience
    if (detectedType === 'GO') {
      await handleAiFix();
      return;
    }

    try {
      const formatted = formatJson(input);
      setOutput(formatted);
      setError(null);
      setStatus(ProcessStatus.Success);
    } catch (e: any) {
      setError(e.message);
      setStatus(ProcessStatus.Error);
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError(null);
      setStatus(ProcessStatus.Success);
    } catch (e: any) {
      setError(e.message);
      setStatus(ProcessStatus.Error);
    }
  };

  const handleStripComments = () => {
    try {
      const cleaned = stripComments(input);
      const formatted = formatJson(cleaned);
      setOutput(formatted);
      setError(null);
      setStatus(ProcessStatus.Success);
    } catch (e: any) {
      // Fallback: just strip regex matches without parsing
      const rawStripped = stripComments(input);
      setOutput(rawStripped);
      const { isValid, error: valError } = validateJson(rawStripped);
      if (!isValid) setError(valError);
      else setError(null);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setStatus(ProcessStatus.Idle);
  };

  const handleThemeChange = (newTheme: ThemeConfig) => {
    setAiConfig({ ...aiConfig, theme: newTheme });
  };

  return (
    <div className="flex flex-col h-screen bg-primary text-secondary">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-header-bg-from to-header-bg-to border-b border-color">
        <div className="flex items-center">
          <div className="p-2 bg-brand-500/10 rounded-lg mr-3">
            <Code2 className="text-brand-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              JSON Alchemist
            </h1>
            <p className="text-xs text-slate-500 font-medium">Formatter, Validator & AI Repair</p>
          </div>
        </div>
        <ThemeSelector 
          themes={THEMES} 
          currentTheme={theme} 
          onThemeChange={handleThemeChange} 
        />
      </header>

      {/* Toolbar */}
      <Toolbar 
        onFormat={handleFormat}
        onMinify={handleMinify}
        onStripComments={handleStripComments}
        onAiFix={handleAiFix}
        onClear={handleClear}
        onCopy={handleCopy}
        onSettings={() => setIsSettingsOpen(true)}
        status={status}
        isCopied={isCopied}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Input Pane */}
        <div className="flex-1 flex flex-col min-h-[50%] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-slate-800 relative group">
          <div className="flex items-center justify-between absolute top-0 left-0 w-full px-3 py-1 bg-secondary/80 z-10 backdrop-blur-sm border-b border-color">
             <span className="text-xs font-mono text-slate-500">INPUT</span>
             {detectedType === 'GO' && (
               <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                 Golang Detected
               </span>
             )}
          </div>
          <textarea
            className="flex-1 w-full bg-primary p-4 pt-10 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-brand-500/30 text-secondary placeholder-slate-700"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="// Paste JSON, JSON5, or Go Map/Struct here..."
          />
        </div>

        {/* Output Pane */}
        <div className="flex-1 flex flex-col min-h-[50%] lg:min-h-0 relative bg-secondary/30">
           <div className="absolute top-0 left-0 px-3 py-1 bg-secondary/80 text-xs font-mono text-slate-500 rounded-br-lg z-10 backdrop-blur-sm border-r border-b border-color">
            OUTPUT
          </div>
          <textarea
            className="flex-1 w-full bg-secondary/30 p-4 pt-10 text-sm font-mono leading-relaxed resize-none focus:outline-none text-accent read-only:opacity-90 placeholder-slate-700"
            spellCheck={false}
            readOnly
            value={output}
            placeholder="Result will appear here..."
          />
        </div>

      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-secondary border-t border-color px-4 py-2 text-xs font-mono flex items-center justify-between h-12">
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          {status === ProcessStatus.Processing ? (
             <div className="flex items-center text-purple-400 gap-2">
               <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
               <span>Processing with Custom AI...</span>
             </div>
          ) : error ? (
             <div className="flex items-center text-amber-400 gap-2 overflow-hidden">
               <AlertCircle size={14} className="flex-shrink-0" />
               <span className="truncate">{error}</span>
             </div>
          ) : input.trim() && detectedType === 'JSON' ? (
            <div className="flex items-center text-emerald-400 gap-2">
               <CheckCircle2 size={14} />
               <span>Valid JSON syntax</span>
             </div>
          ) : input.trim() && detectedType === 'GO' ? (
             <div className="flex items-center text-blue-400 gap-2">
               <FileJson size={14} />
               <span>Ready to convert Go to JSON</span>
             </div>
          ) : (
            <span className="text-slate-500">Ready</span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-slate-500 hidden md:flex">
          <span>Ln {input.split('\n').length}</span>
          <span>Sz {(new Blob([input]).size / 1024).toFixed(2)} KB</span>
        </div>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={setAiConfig}
      />
    </div>
  );
};

export default App;