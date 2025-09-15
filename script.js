// --- Visitor Counter Logic ---
const visitorCounterElement = document.getElementById("visitor-counter");

// Fetch the visitor count when the page loads
fetch('/.netlify/functions/visitor-counter')
  .then(response => response.json())
  .then(data => {
    visitorCounterElement.textContent = data.count;
  })
  .catch(error => {
    console.error('Error fetching visitor count:', error);
    visitorCounterElement.textContent = 'Error';
  });

// --- Secure Login Logic ---
document.getElementById('submit-button').addEventListener('click', async () => {
    const password = document.getElementById('password-input').value;
    const messageElement = document.getElementById('message');
    
    // Clear any previous messages
    messageElement.textContent = '';
    
    // Make a POST request to the Netlify Function
    try {
        const response = await fetch('/.netlify/functions/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = 'secret-page.html';
        } else {
            messageElement.textContent = data.message || 'Incorrect password.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
        messageElement.textContent = 'An error occurred. Please try again later.';
        messageElement.style.color = 'red';
    }
});