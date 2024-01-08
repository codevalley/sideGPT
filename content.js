// content.js

// Wait for the DOM to be fully loaded
console.log('content script loaded');

function handleDOMContentLoaded() {
    const sidebar = document.querySelector('nav[aria-label="Chat history"]');
    if(sidebar) {
        console.log("Sidebar Found!", sidebar);
        //console.log("Sidebar Content:", sidebar.textContent);
        fetchListAndURIs(sidebar);
    } else {
        console.log("Sidebar not found!");
    }
}



// This function gets called when the content script gets executed
function fetchListAndURIs() {
    // Find all the list items on the page using the class name of the li element
    let items = document.querySelectorAll('li.relative');  // Adjusted the selector to match the given structure

    // Initialize an array to hold our list of entries and URIs
    let entries = [];

    // Iterate over each item and get the text and the URI
    items.forEach(item => {
        // Target the anchor tag within the item
        let anchor = item.querySelector('div > a'); // Adjusted the selector based on the provided structure

        // Target the text container within the item, adjusting the selector to specifically target the div containing the text
        let textContainer = item.querySelector('div.relative > div.group > a > div.relative');

        if(anchor && textContainer) {
            // Push an object with the item text (trimming to clean up) and the URI to the entries array
            entries.push({
                text: textContainer.textContent.trim(), // Get the trimmed text of the specified div
                uri: anchor.href // Get the href attribute of the anchor
            });
        }
    });

    // Now, entries array contains objects with the text and URI of each item
    console.log(entries); // For now, just log the entries to the console
    // Example: chrome.runtime.sendMessage({type: "ENTRIES_FOUND", data: entries});
}


// Call the function when the content script loads

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
    // DOMContentLoaded has already fired
    handleDOMContentLoaded();
}