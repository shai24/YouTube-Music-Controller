/**
 * This is the background service worker for the extension.
 * It listens for keyboard shortcut commands and tells the content script what to do.
 */

// This function finds a YouTube Music tab and executes the content script.
async function executeActionInYTMTab(action) {
  // Find any tab that has the YouTube Music URL.
  const tabs = await chrome.tabs.query({
    url: "https://music.youtube.com/*"
  });

  // If at least one YouTube Music tab is found...
  if (tabs.length > 0) {
    const targetTab = tabs[0]; // Use the first one found.

    try {
      // First, inject the content script into the tab to make sure it's running.
      await chrome.scripting.executeScript({
        target: { tabId: targetTab.id },
        files: ['content.js']
      });

      // After injecting, send a message to the content script with the action to perform.
      await chrome.tabs.sendMessage(targetTab.id, { action: action });

    } catch (e) {
      console.error(`Error executing script or sending message: ${e}`);
    }
  } else {
    console.log("YouTube Music Controller: No YouTube Music tab found.");
  }
}

// Listen for the commands defined in manifest.json.
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command received: ${command}`);
  // When a command is received, call our function with the appropriate action.
  if (command === "toggle-play-pause" || command === "next-track" || command === "previous-track") {
    executeActionInYTMTab(command);
  }
});
