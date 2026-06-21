import React from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Type } from 'lucide-react';

export const AccessibilityToolbar = () => {
  const { contrast, setContrastMode, fontSize, setFontSize } = useApp();

  return (
    <div className="accessibility-bar" role="region" aria-label="Accessibility Settings">
      <div className="a11y-group">
        <Eye size={16} aria-hidden="true" />
        <span>Contrast:</span>
        <button
          className={`a11y-btn ${contrast === 'normal' ? 'active' : ''}`}
          onClick={() => setContrastMode('normal')}
          aria-label="Set standard contrast mode"
          aria-pressed={contrast === 'normal'}
        >
          Standard
        </button>
        <button
          className={`a11y-btn ${contrast === 'high' ? 'active' : ''}`}
          onClick={() => setContrastMode('high')}
          aria-label="Set high contrast mode"
          aria-pressed={contrast === 'high'}
        >
          High Contrast
        </button>
      </div>

      <div className="a11y-group">
        <Type size={16} aria-hidden="true" />
        <span>Text Size:</span>
        <button
          className={`a11y-btn ${fontSize === 'normal' ? 'active' : ''}`}
          onClick={() => setFontSize('normal')}
          aria-label="Set normal text size"
          aria-pressed={fontSize === 'normal'}
        >
          A
        </button>
        <button
          className={`a11y-btn ${fontSize === 'medium' ? 'active' : ''}`}
          onClick={() => setFontSize('medium')}
          aria-label="Set medium text size (15% larger)"
          aria-pressed={fontSize === 'medium'}
        >
          A+
        </button>
        <button
          className={`a11y-btn ${fontSize === 'large' ? 'active' : ''}`}
          onClick={() => setFontSize('large')}
          aria-label="Set large text size (30% larger)"
          aria-pressed={fontSize === 'large'}
        >
          A++
        </button>
      </div>
    </div>
  );
};
export default AccessibilityToolbar;
