// Load quotes from local storage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong> <em>(${randomQuote.category})</em>`;
}

// Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteForm');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };

    // Add the new quote to the local quotes array
    quotes.push(newQuote);
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes(); // Save quotes to local storage

    // Send the new quote to the server
    await sendQuoteToServer(newQuote);

    // Sync with the server
    await syncWithServer();

    // Display a random quote
    showRandomQuote();
  } else {
    alert('Please fill in both the quote and category fields.');
  }
}

// Function to send a new quote to the server
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1, // Simulate a user ID
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send quote to server');
    }

    const data = await response.json();
    console.log('Quote sent to server:', data);
  } catch (error) {
    console.error('Error sending quote to server:', error);
  }
}

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter from local storage
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  // Save the selected filter to local storage
  localStorage.setItem('lastFilter', selectedCategory);

  // Display a random quote from the filtered list
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `<strong>${randomQuote.text}</strong> <em>(${randomQuote.category})</em>`;
  } else {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes found for this category.';
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save imported quotes to local storage
    populateCategories(); // Update the category dropdown
    alert('Quotes imported successfully!');
    filterQuotes(); // Refresh the displayed quotes
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    return serverQuotes.map(post => ({ text: post.title, category: 'Server' })); // Map server data to quotes
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}

// Function to sync local data with the server
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Merge server and local quotes (server data takes precedence)
  const mergedQuotes = [...localQuotes, ...serverQuotes].reduce((acc, quote) => {
    const existingQuote = acc.find(q => q.text === quote.text);
    if (!existingQuote) {
      acc.push(quote);
    }
    return acc;
  }, []);

  // Update local storage and quotes array
  quotes = mergedQuotes;
  saveQuotes();

  // Notify the user
  const notification = document.createElement('div');
  notification.textContent = 'Data synced with the server.';
  notification.style.backgroundColor = '#d4edda';
  notification.style.color = '#155724';
  notification.style.padding = '10px';
  notification.style.marginTop = '10px';
  notification.style.borderRadius = '5px';
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', filterQuotes);

// Event listener for the "Export Quotes" button
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Event listener for the "Import Quotes" file input
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Create the "Add Quote" form dynamically
createAddQuoteForm();

// Populate categories and display a random quote when the page loads
populateCategories();
filterQuotes();

// Periodically sync with the server (every 30 seconds)
setInterval(syncWithServer, 30000);
