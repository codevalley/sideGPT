// content.js

function handleDOMContentLoaded() {
    const sidebar = document.querySelector('nav[aria-label="Chat history"]');
    if (sidebar) {
        fetchListAndURIs(sidebar);
        addSearchBar(sidebar);
    } else {
        console.log("Sidebar not found!");
    }
}

// This function gets called when the content script gets executed
function fetchListAndURIs(sidebar) {
    // Find the div with the specific class
    const topDiv = document.querySelector('div.flex.flex-col.gap-2.pb-2.dark\\:text-gray-100.text-gray-800.text-sm');
    console.log(topDiv); 
    const targetDiv = topDiv.querySelector('div:not([class])');
    console.log(targetDiv); // Ensure this is not null
    let entries = [];

    if (targetDiv) {
        // Extract entries and URIs
        const spans = targetDiv.querySelectorAll('span');
        spans.forEach(span => {
            const relativeDivs = span.querySelectorAll('div.relative.mt-5');
            relativeDivs.forEach(div => {
                const orderedLists = div.querySelectorAll('ol');
                orderedLists.forEach(ol => {
                    const items = ol.querySelectorAll('li.relative'); // Adjust the selector as needed
                    items.forEach(item => {
                        let anchor = item.querySelector('a');
                        if (anchor) {
                            // Use getAttribute to get the exact href value
                            let href = anchor.getAttribute('href');
                            entries.push({ text: item.textContent.trim(), uri: href });
                        }
                    });
                });
            });
        });
    } else {
        console.log("Target div not found");
    }

    console.log(entries);
    if (entries.length > 0) {
        setupSearch(entries, sidebar);
    }
}

function addSearchBar(sidebar) {
    const searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
    searchBar.setAttribute("id", "myExtensionSearchBar");
    searchBar.setAttribute("spellcheck", "true");
    searchBar.setAttribute("placeholder", "Search topics...");
    searchBar.classList.add("nyn-search-bar");

    sidebar.insertBefore(searchBar, sidebar.firstChild);

    searchBar.addEventListener("input", function () {
        showSuggestions(this.value, sidebar);
    });
}

function setupSearch(entries, sidebar) {
    window.myExtensionEntries = entries; // Make entries globally available for search
}

function filterEntries(query) {
    return window.myExtensionEntries.filter(entry => entry.text.toLowerCase().includes(query.toLowerCase()));
}

function showSuggestions(query, sidebar) {
    const suggestions = filterEntries(query);
    const suggestionsContainer = document.createElement('ul');
    suggestionsContainer.className = 'nyn-search-results';

    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion.text;
        li.setAttribute("data-projection-id",7);
        li.onclick = () => window.location.href = suggestion.uri;
        suggestionsContainer.appendChild(li);
    });

    const existingContainer = sidebar.querySelector('.nyn-search-results');
    if (existingContainer) {
        existingContainer.parentNode.removeChild(existingContainer);
    }

    sidebar.insertBefore(suggestionsContainer, sidebar.children[1]); // Adjust as needed
}

// Call the function when the content script loads
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
    setTimeout(handleDOMContentLoaded, 2000);
}
