document.getElementById('registration-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevents the form from submitting in the traditional way
    
    const username = document.getElementById('username-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const messageElement = document.getElementById('message');
    
    messageElement.textContent = 'Registering...';
    messageElement.style.color = 'black';

    try {
        const response = await fetch('/.netlify/functions/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = data.message || 'Registration failed.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        messageElement.textContent = 'An error occurred. Please try again later.';
        messageElement.style.color = 'red';
    }
});