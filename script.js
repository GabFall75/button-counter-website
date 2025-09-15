// Get a reference to the element that will display the count
const counterElement = document.getElementById("counter");

// Fetch the visitor count from our Netlify Function
fetch('/.netlify/functions/visitor-counter')
  .then(response => response.json())
  .then(data => {
    // Update the counter on the page with the count from the function
    counterElement.textContent = data.count;
  })
  .catch(error => {
    console.error('Error fetching visitor count:', error);
    counterElement.textContent = 'Error';
  });