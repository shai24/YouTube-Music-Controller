/**
 * This content script is injected into the YouTube Music page.
 * It directly interacts with the buttons on the page.
 */

// If the controller has already been initialized on this page, do nothing.
// This guard prevents the "Identifier has already been declared" error.
if (window.hasInitializedYTMController) {
  // The script has already been injected, so we don't need to do anything.
} else {
  // Set the flag to true to indicate that the script has now run once.
  window.hasInitializedYTMController = true;

  console.log("YTM Controller content script loaded and initialized.");

  // A helper function to find and click buttons on the page.
  function clickElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
    } else {
      console.log(`YTM Controller: Could not find element with selector: ${selector}`);
    }
  }

  // Listen for messages from the background script (background.js).
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action) {
      switch (request.action) {
        case "toggle-play-pause":
          clickElement('#play-pause-button');
          break;
        case "previous-track": // Added case for previous track
          clickElement('.previous-button');
          break;
        case "next-track":
          clickElement('.next-button');
          break;
      }
    }
    // This is good practice for message listeners.
    return true;
  });
}