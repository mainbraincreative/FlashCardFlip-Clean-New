import React, { useState } from 'react';

function Flashcard({ content, onDelete, onSave, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [text, setText] = useState(content);
  const [tempText, setTempText] = useState(content); // For handling cancel

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempText(text); // Store current text in case of cancel
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setText(tempText);
    onSave(id, tempText);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setTempText(text); // Reset to original text
    setIsEditing(false);
  };

  const handleFlip = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleFlip}
      style={{
        backgroundColor: 'white',
        color: '#39363b'
      }}
    >
      <div className="flashcard-inner">
        {/* Front */}
        <div className="flashcard-front">
          {/* Button container - always at top-right */}
          <div className="button-container">
            <button 
              className="edit-button" 
              onClick={handleEdit}
            >
              ✏️
            </button>
            <button 
              className="close-button" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              ❌
            </button>
          </div>

          <div className="content-area">
            {isEditing ? (
              <textarea
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                style={{ color: '#39363b' }}
              />
            ) : (
              <div>{text}</div>
            )}
          </div>

          {/* Edit controls */}
          {isEditing && (
            <div className="edit-controls">
              <button 
                className="save-button" 
                onClick={handleSave}
              >
                Save
              </button>
              <button 
                className="cancel-button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="flashcard-back">
          {/* Button container - also at top-right */}
          <div className="button-container">
            <button 
              className="edit-button" 
              onClick={handleEdit}
            >
              ✏️
            </button>
            <button 
              className="close-button" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              ❌
            </button>
          </div>
          
          <div className="content-area">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;