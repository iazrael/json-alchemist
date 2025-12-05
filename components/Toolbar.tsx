import React from 'react';
import { 
  AlignLeft, 
  Minimize2, 
  Trash2, 
  Wand2, 
  Copy, 
  Check, 
  MessageSquareOff,
  Settings
} from 'lucide-react';
import { ProcessStatus } from '../types';

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onStripComments: () => void;
  onClear: () => void;
  onAiFix: () => void;
  onCopy: () => void;
  onSettings: () => void;
  status: ProcessStatus;
  isCopied: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFormat,
  onMinify,
  onStripComments,
  onClear,
  onAiFix,
  onCopy,
  onSettings,
  status,
  isCopied
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-secondary border-b border-color">
      
      {/* Primary Actions */}
      <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg">
        <button
          onClick={onFormat}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary hover:bg-slate-700 rounded-md transition-colors"
          title="Format (Beautify)"
        >
          <AlignLeft size={16} />
          <span className="hidden sm:inline">Format</span>
        </button>
        <button
          onClick={onMinify}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary hover:bg-slate-700 rounded-md transition-colors"
          title="Minify (Compress)"
        >
          <Minimize2 size={16} />
          <span className="hidden sm:inline">Minify</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg">
        <button
          onClick={onStripComments}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-300/80 hover:text-amber-200 hover:bg-slate-700 rounded-md transition-colors"
          title="Remove Line Comments"
        >
          <MessageSquareOff size={16} />
          <span className="hidden sm:inline">No Comments</span>
        </button>
        <button
          onClick={onAiFix}
          disabled={status === ProcessStatus.Processing}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all
            ${status === ProcessStatus.Processing 
              ? 'text-purple-400/50 cursor-not-allowed' 
              : 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
            }`}
          title="Fix with AI"
        >
          <Wand2 size={16} className={status === ProcessStatus.Processing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">AI Fix</span>
        </button>
      </div>

      <div className="flex-1" />

      {/* Utility Actions */}
      <div className="flex items-center gap-1">
         <button
          onClick={onSettings}
          className="p-2 text-secondary hover:text-primary hover:bg-slate-800 rounded-md transition-colors"
          title="AI Settings"
        >
          <Settings size={18} />
        </button>
         <button
          onClick={onClear}
          className="p-2 text-secondary hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
          title="Clear Input"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-950/30 rounded-md transition-colors border border-emerald-900/50"
          title="Copy Output"
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;