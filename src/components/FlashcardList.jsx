import React from 'react';
import Flashcard from './Flashcard';

const FlashcardList = ({ flashcards, bgColor, textColor, onDelete, onEdit, newCardId }) => {
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't created any flashcards yet!</p>
        <p>Select text on any webpage and right-click to create flashcards.</p>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      {flashcards.map((card) => (
        <Flashcard
          key={card.created}
          card={card}
          bgColor={bgColor}
          textColor={textColor}
          onDelete={onDelete}
          onEdit={onEdit}
          isNew={card.created === newCardId}
        />
      ))}
    </div>
  );
};

export default FlashcardList;