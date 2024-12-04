// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.contextMenus.create({
    id: 'createFlashcard',
    title: 'Create Flashcard',
    contexts: ['selection']
  });
});

async function createFlashcardWithGPT(text) {
  try {
    const response = await fetch('https://flashcard-proxy.dean-ed9.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const parsedContent = await response.json();
    
    return {
      term: parsedContent.front,
      definition: parsedContent.back,
      created: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return {
      term: text.split(' ').slice(0, 5).join(' '),
      definition: text,
      created: new Date().toISOString()
    };
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'createFlashcard') {
    const selectedText = info.selectionText.trim();
    
    try {
      chrome.action.setBadgeText({ text: '...' });
      
      const cardContent = await createFlashcardWithGPT(selectedText);
      
      chrome.storage.sync.get(['flashcards'], function(result) {
        const flashcards = result.flashcards || [];
        flashcards.unshift(cardContent);
        
        chrome.storage.sync.set({ flashcards: flashcards }, () => {
          chrome.action.setBadgeText({ text: '' });
          chrome.action.openPopup().catch(() => {
            chrome.action.setBadgeText({ text: '✓' });
            setTimeout(() => {
              chrome.action.setBadgeText({ text: '' });
            }, 1000);
          });
        });
      });
    } catch (error) {
      console.error('Error processing flashcard:', error);
      chrome.action.setBadgeText({ text: '!' });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2000);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'textSelected') {
    console.log('Text selected message received');
    sendResponse({ received: true });
  }
  return true;
});