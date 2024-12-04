import React, { useState, useRef, useEffect } from 'react';

const COLOR_SCHEMES = {
  custom: {
    name: "Custom Colors",
    bg: "#1e293b",
    text: "#ffffff"
  },
  focusedForest: {
    name: "Focused Forest",
    bg: "#B2C8A3",
    text: "#2B4A2F",
    description: "Soft sage green with deep evergreen text. Reduces eye strain for prolonged focus."
  },
  memoryMint: {
    name: "Memory Mint",
    bg: "#DFFFE4",
    text: "#2E2E2E",
    description: "Refreshing mint green with charcoal text. Ideal for clear-headed studying."
  },
  midnightRecall: {
    name: "Midnight Recall",
    bg: "#1A2A4D",
    text: "#F5F5F5",
    description: "Dark navy with soft white text. Reduces blue light exposure."
  },
  focusFlame: {
    name: "Focus Flame",
    bg: "#FFC1A6",
    text: "#3D1F1E",
    description: "Warm coral with espresso text. Promotes gentle focus."
  },
  sunnyScholar: {
    name: "Sunny Scholar",
    bg: "#FFF9CC",
    text: "#2F3131",
    description: "Pale yellow with midnight gray text. Bright and clear."
  }
};

const ColorCustomizer = ({ bgColor, textColor, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [hoveredScheme, setHoveredScheme] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (scheme) => {
    onSave(scheme.bg, scheme.text);
    setIsOpen(false);
  };

  return (
    <div className="color-customizer" ref={containerRef}>
      <div className="color-buttons">
        <button 
          className="color-button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <span className="color-icon">⚙️</span>
        </button>
      </div>

      {isOpen && (
        <div className="color-panel">
          <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          <div className="panel-header">
            <button 
              className={`panel-tab ${!showPresets ? 'active' : ''}`}
              onClick={() => setShowPresets(false)}
            >
              Custom
            </button>
            <button 
              className={`panel-tab ${showPresets ? 'active' : ''}`}
              onClick={() => setShowPresets(true)}
            >
              Presets
            </button>
          </div>

          {!showPresets ? (
            <div className="custom-colors">
              <div className="color-input-group">
                <label>Bkg:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => onSave(e.target.value, textColor)}
                />
              </div>
              <div className="color-input-group">
                <label>Text:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => onSave(bgColor, e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="preset-list">
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <button
                  key={key}
                  className="preset-button"
                  onClick={() => handlePresetSelect(scheme)}
                  onMouseEnter={() => setHoveredScheme(key)}
                  onMouseLeave={() => setHoveredScheme(null)}
                >
                  <div 
                    className="preset-swatch"
                    style={{ backgroundColor: scheme.bg }}
                  >
                    <span style={{ color: scheme.text }}>Aa</span>
                  </div>
                  <span className="preset-name">{scheme.name}</span>
                  {hoveredScheme === key && scheme.description && (
                    <div className="preset-tooltip">{scheme.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorCustomizer;