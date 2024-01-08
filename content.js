// content.js

// Wait for the DOM to be fully loaded
console.log('content script loaded');

function handleDOMContentLoaded() {
    const sidebar = document.querySelector('nav[aria-label="Chat history"]');
    if(sidebar) {
        fetchListAndURIs(sidebar);
    } else {
        console.log("Sidebar not found!");
    }
}



// This function gets called when the content script gets executed
function fetchListAndURIs() {
    // Step 1: Find the div with the specific class
    const topDiv = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm');
    console.log(topDiv); 
    const targetDiv = topDiv.querySelector('div:not([class])');
    console.log(targetDiv); // Ensure this is not null
    // Initialize an array to hold our list of entries and URIs
    let entries = [];

    if (targetDiv) {
        const spans = targetDiv.querySelectorAll('span');
        spans.forEach(span => {
            const relativeDivs = span.querySelectorAll('div.relative.mt-5');
            relativeDivs.forEach(div => {
                const orderedLists = div.querySelectorAll('ol');
                orderedLists.forEach(ol => {
                    const items = ol.querySelectorAll('li.relative'); // Adjust the selector as needed
                    items.forEach(item => {
                        // Assuming each list item has an anchor tag
                        let anchor = item.querySelector('a');
                        if (anchor) {
                            // Push an object with the item text and the URI to the entries array
                            entries.push({
                                text: item.textContent.trim(),
                                uri: anchor.href
                            });
                        }
                    });
                });
            });
        });
    } else {
        console.log("Target div not found");
    }

    // Log the entries or send them to your extension's background script or popup
    console.log(entries);
    // Example: chrome.runtime.sendMessage({type: "ENTRIES_FOUND", data: entries});
}


// Call the function when the content script loads

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
    // DOMContentLoaded has already fired
    setTimeout(handleDOMContentLoaded, 2000);
}