// Select elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Initialize quotes array
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" }
];

// Load stored quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerText = quotes[randomIndex].text;
}

// Add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Filter quotes by category
function filterQuotes() {
  const category = document.getElementById("filterCategory").value.trim().toLowerCase();
  const filtered = quotes.filter(q => q.category.toLowerCase() === category);

  if (filtered.length > 0) {
    quoteDisplay.innerText = filtered[Math.floor(Math.random() * filtered.length)].text;
  } else {
    quoteDisplay.innerText = "No quotes found in this category.";
  }
}

// Download quotes as JSON
function downloadQuotes() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

// Load quotes on page load
loadQuotes();

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
