// content.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select the sidebar element - Adjust the selector as needed
    const sidebar = document.querySelector('nav[aria-label="Chat history"]');

    // Check if sidebar exists
    if(sidebar) {
        // Implement search or parse logic here
        console.log("Sidebar Found!", sidebar);
        // Example: Log all text content from the sidebar
        console.log("Sidebar Content:", sidebar.textContent);
    } else {
        console.log("Sidebar not found!");
    }
});

