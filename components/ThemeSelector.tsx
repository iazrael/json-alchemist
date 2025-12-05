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
    case 'dark':
      return 'linear-gradient(135deg, #0f172a 0%, #020617 100%)';
    case 'light':
      return 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)';
    case 'blue':
      return 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)';
    case 'green':
      return 'linear-gradient(135deg, #064e3b 0%, #052e16 100%)';
    default:
      return '#0f172a';
  }
}

export default ThemeSelector;