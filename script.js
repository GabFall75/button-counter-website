// --- Visitor Counter Logic ---
const visitorCounterElement = document.getElementById("visitor-counter");

// Fetch the visitor count from our Netlify Function when the page loads
fetch('/.netlify/functions/visitor-counter')
  .then(response => response.json())
  .then(data => {
    visitorCounterElement.textContent = data.count;
  })
  .catch(error => {
    console.error('Error fetching visitor count:', error);
    visitorCounterElement.textContent = 'Error';
  });


// --- Click Counter Logic ---
const clickCounterElement = document.getElementById("click-counter");
const buttonElement = document.getElementById("click-button");

let clickCount = 0;

buttonElement.addEventListener("click", () => {
    clickCount++;
    clickCounterElement.textContent = clickCount;
});