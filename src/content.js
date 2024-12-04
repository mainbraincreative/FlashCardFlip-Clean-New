document.addEventListener('mouseup', function() {
    try {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        chrome.runtime.sendMessage({
          type: 'textSelected',
          text: selectedText
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Extension context refreshed - please reload the page');
          }
        });
      }
    } catch (error) {
      console.log('Selection handling error:', error);
    }
  });