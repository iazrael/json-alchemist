import React from 'react';
import { Palette } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ThemeSelectorProps {
  themes: ThemeConfig[];
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Palette size={18} className="text-secondary" />
      <div className="flex gap-1">
        {themes.map((theme) => (
          <button
            key={theme.classPrefix}
            onClick={() => onThemeChange(theme)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              currentTheme.classPrefix === theme.classPrefix
                ? 'border-brand-500 scale-110'
                : 'border-slate-600 hover:border-slate-400'
            }`}
            title={theme.name}
            style={{
              background: getThemePreviewColor(theme.classPrefix)
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to get preview colors for themes
function getThemePreviewColor(themeClass: string): string {
  switch (themeClass) {
    case 'midnight':
      return 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
    case 'cloud':
      return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
    case 'ocean':
      return 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
    case 'grass':
      return 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)';
    case 'cherry':
      return 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)';
    case 'citrus':
      return 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)';
    case 'lavender':
      return 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)';
    default:
      return '#0f172a';
  }
}

export default ThemeSelector;