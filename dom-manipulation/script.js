// Function to sync local quotes with the server
async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Merge local and server quotes (avoid duplicates)
        const mergedQuotes = [...localQuotes, ...serverQuotes].reduce((acc, quote) => {
            if (!acc.find(q => q.text === quote.text)) {
                acc.push(quote);
            }
            return acc;
        }, []);

        // Update local storage
        quotes = mergedQuotes;
        saveQuotes();

        // Notify user of the sync
        showNotification("Quotes synced successfully!", "success");
    } catch (error) {
        console.error("Error syncing quotes:", error);
        showNotification("Failed to sync quotes.", "error");
    }
}

// Function to show a notification message
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.padding = '10px';
    notification.style.marginTop = '10px';
    notification.style.borderRadius = '5px';
    notification.style.width = 'fit-content';

    if (type === "success") {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
    } else {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Periodically check for new quotes every 30 seconds
setInterval(syncQuotes, 30000);
