import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { AIConfig, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-primary border border-color rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-color bg-secondary/50">
          <h2 className="text-lg font-semibold text-primary">Settings</h2>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-secondary">AI Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocalConfig({ ...localConfig, provider: 'GEMINI' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  localConfig.provider === 'GEMINI'
                    ? 'bg-brand-500/10 border-brand-500 text-brand-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <span className="font-semibold">Gemini</span>
                <span className="text-[10px] opacity-70 mt-1">Default (Free)</span>
              </button>
              <button
                onClick={() => setLocalConfig({ ...localConfig, provider: 'OPENAI' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  localConfig.provider === 'OPENAI'
                    ? 'bg-brand-500/10 border-brand-500 text-brand-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <span className="font-semibold">OpenAI Compatible</span>
                <span className="text-[10px] opacity-70 mt-1">Custom / Local</span>
              </button>
            </div>
          </div>

          {/* Configuration Fields */}
          {localConfig.provider === 'GEMINI' ? (
            <div className="p-4 bg-secondary/50 rounded-lg border border-color/50 flex items-start gap-3">
               <div className="text-emerald-400 mt-0.5"><Save size={16} /></div>
               <div className="text-sm text-secondary">
                 Using built-in Google Gemini integration. API Key is managed securely via environment variables.
               </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary">Base URL</label>
                <input
                  type="text"
                  value={localConfig.openAi.baseUrl}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    openAi: { ...localConfig.openAi, baseUrl: e.target.value }
                  })}
                  placeholder="https://api.openai.com/v1"
                  className="w-full bg-primary border border-color rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                />
                <p className="text-[10px] text-slate-500">Endpoint root (e.g. for LocalAI, vLLM, DeepSeek)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary">API Key</label>
                <input
                  type="password"
                  value={localConfig.openAi.apiKey}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    openAi: { ...localConfig.openAi, apiKey: e.target.value }
                  })}
                  placeholder="sk-..."
                  className="w-full bg-primary border border-color rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary">Model Name</label>
                <input
                  type="text"
                  value={localConfig.openAi.model}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    openAi: { ...localConfig.openAi, model: e.target.value }
                  })}
                  placeholder="gpt-3.5-turbo"
                  className="w-full bg-primary border border-color rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-200/80 text-xs">
                <AlertTriangle size={14} />
                <span>API Keys are stored in your browser's LocalStorage.</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-secondary border-t border-color flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-brand-500/20"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;