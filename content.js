// content.js

// // Wait for the DOM to be fully loaded
// console.log('content script loaded');

function handleDOMContentLoaded() {
    const sidebar = document.querySelector('nav[aria-label="Chat history"]');
    if(sidebar) {
        fetchListAndURIs(sidebar);
        addSearchBar(sidebar);
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
    // Add the search functionality after fetching the entries
    if (entries.length > 0) {
        setupSearch(entries);
        
    }
    // Example: chrome.runtime.sendMessage({type: "ENTRIES_FOUND", data: entries});
}

function addSearchBar(sidebar) {
    const searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
    searchBar.setAttribute("id", "myExtensionSearchBar");
    searchBar.setAttribute("placeholder", "Search...");
    searchBar.classList.add("nyn-search-bar");

    sidebar.insertBefore(searchBar, sidebar.firstChild);

    // Event listener for handling search
    searchBar.addEventListener("input", function () {
        handleSearch(this.value);
    });
}

function setupSearch(entries) {
    window.myExtensionEntries = entries; // Make entries globally available for search
}

function handleSearch(query) {
    const results = window.myExtensionEntries.filter(entry =>
        entry.text.toLowerCase().includes(query.toLowerCase())
    );
    console.log(results); // For now, just log the results
    // TODO: Implement UI for displaying results and handling click events
}
// Call the function when the content script loads

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
    // DOMContentLoaded has already fired
    setTimeout(handleDOMContentLoaded, 2000);
}