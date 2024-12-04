import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const Flashcard = ({ card, onDelete, onEdit, bgColor, textColor }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTerm, setEditedTerm] = useState(card.term);
  const [editedDefinition, setEditedDefinition] = useState(card.definition);

  const FrontButtons = () => (
    <div className="card-actions">
      {isEditing ? (
        <div className="edit-actions">
          <button className="action-button save" onClick={handleSave}>Save</button>
          <button className="action-button cancel" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="normal-actions">
          <button className="edit-button" onClick={handleEdit}>✎</button>
          <button className="delete-button" onClick={(e) => {
            e.stopPropagation();
            onDelete(card);
          }}>×</button>
        </div>
      )}
    </div>
  );

  const BackButtons = () => (
    <div className="card-actions">
      {isEditing ? (
        <div className="edit-actions">
          <button className="action-button save" onClick={handleSave}>Save</button>
          <button className="action-button cancel" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="normal-actions">
          <button className="edit-button" onClick={handleEdit}>✎</button>
          <button className="delete-button" onClick={(e) => {
            e.stopPropagation();
            onDelete(card);
          }}>×</button>
        </div>
      )}
    </div>
  );

  const handleFlip = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onEdit(card, {
      term: editedTerm,
      definition: editedDefinition
    });
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedTerm(card.term);
    setEditedDefinition(card.definition);
    setIsEditing(false);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
      <div className="flashcard-inner" onClick={handleFlip}>
        <div className="flashcard-front" style={{ backgroundColor: bgColor }}>
          <div className="flashcard-content">
            {isEditing ? (
              <textarea
                value={editedTerm}
                onChange={(e) => setEditedTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="edit-input"
              />
            ) : (
              <h3 className="flashcard-term" style={{ color: textColor }}>{card.term}</h3>
            )}
          </div>
          <FrontButtons />
        </div>

        <div className="flashcard-back" style={{ backgroundColor: bgColor }}>
          <div className="flashcard-content">
            {isEditing ? (
              <textarea
                value={editedDefinition}
                onChange={(e) => setEditedDefinition(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="edit-input"
              />
            ) : (
              <p className="flashcard-definition" style={{ color: textColor }}>{card.definition}</p>
            )}
          </div>
          <BackButtons />
        </div>
      </div>
    </div>
  );
};

const ColorCustomizer = ({ bgColor, textColor, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorSchemes = {
    'Standard Study': { bg: '#EDEDED', text: '#2B2B2B' },
    'Retention Blue': { bg: '#B3E5FC', text: '#0D47A1' },
    'Cramming Red': { bg: '#FFCDD2', text: '#B71C1C' },
    'Memory Green': { bg: '#C8E6C9', text: '#1B5E20' },
    'Focus Yellow': { bg: '#FFF9C4', text: '#F57F17' },
    'Motivation Orange': { bg: '#FFECB3', text: '#E65100' }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.color-customizer')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="color-customizer">
      <button 
        className="color-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️
      </button>
      {isOpen && (
        <div className="color-panel">
          <div className="custom-color-section">
            <h3>Custom Colors</h3>
            <div className="color-picker">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onSave(e.target.value, textColor)}
                className="color-input"
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => onSave(bgColor, e.target.value)}
                className="color-input"
              />
            </div>
          </div>
          <div className="preset-schemes">
            <h3>Preset Schemes</h3>
            {Object.entries(colorSchemes).map(([name, colors]) => (
              <button
                key={name}
                className="scheme-button"
                onClick={() => {
                  onSave(colors.bg, colors.text);
                  setIsOpen(false);
                }}
              >
                <div 
                  className="scheme-preview"
                  style={{ backgroundColor: colors.bg }}
                >
                  <span style={{ color: colors.text }}>Aa</span>
                </div>
                <span className="scheme-name">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Popup = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    chrome.storage.sync.get(['flashcards', 'bgColor', 'textColor'], (result) => {
      setFlashcards(result.flashcards || []);
      if (result.bgColor) setBgColor(result.bgColor);
      if (result.textColor) setTextColor(result.textColor);
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'flashcardCreated') {
        setFlashcards(prev => [message.flashcard, ...prev]);
      }
    });
  }, []);

  const handleDelete = (cardToDelete) => {
    const updatedCards = flashcards.filter(card => card.created !== cardToDelete.created);
    chrome.storage.sync.set({ flashcards: updatedCards });
    setFlashcards(updatedCards);
  };

  const handleEdit = (card, newData) => {
    const updatedCards = flashcards.map(c => 
      c.created === card.created 
        ? { ...c, ...newData }
        : c
    );
    chrome.storage.sync.set({ flashcards: updatedCards });
    setFlashcards(updatedCards);
  };

  const handleColorSave = (newBg, newText) => {
    chrome.storage.sync.set({
      bgColor: newBg,
      textColor: newText
    });
    setBgColor(newBg);
    setTextColor(newText);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src="images/flashcardflip-48.png" alt="FlashCardFlip" className="app-logo" />
          <h1>FlashCardFlip</h1>
        </div>
        <ColorCustomizer
          bgColor={bgColor}
          textColor={textColor}
          onSave={handleColorSave}
        />
      </header>
      
      <div className="flashcards-container">
        {flashcards.length === 0 ? (
          <div className="empty-state">
            <p>No flashcards yet!</p>
            <p>Select text on any webpage and right-click to create flashcards.</p>
          </div>
        ) : (
          flashcards.map((card) => (
            <Flashcard
              key={card.created}
              card={card}
              onDelete={handleDelete}
              onEdit={handleEdit}
              bgColor={bgColor}
              textColor={textColor}
            />
          ))
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);