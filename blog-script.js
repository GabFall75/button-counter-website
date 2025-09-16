document.getElementById('sign-in-button').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevents the form from submitting in the traditional way
    
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const messageElement = document.getElementById('message');
    
    messageElement.textContent = 'Signing in...';

    try {
        const response = await fetch('/.netlify/functions/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            messageElement.textContent = 'Sign-in successful!';
            messageElement.style.color = 'green';
            // In a real app, you would save a token here, then redirect
            window.location.href = 'blog.html';
        } else {
            messageElement.textContent = data.message || 'Incorrect username or password.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        messageElement.textContent = 'An error occurred. Please try again later.';
        messageElement.style.color = 'red';
    }
});