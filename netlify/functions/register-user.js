const { Client } = require('pg');
const brevo = require('brevo');

exports.handler = async (event, context) => {
	// Add this line at the very beginning of the function
  console.log('Function started.');
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
  });

  try {
    await client.connect();
    const { username, email, password } = JSON.parse(event.body);

    const checkRes = await client.query('SELECT id FROM users WHERE username = $1', [username]);

    if (checkRes.rows.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ success: false, message: 'Username already exists.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const res = await client.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [username, password, email]);

    if (res.rows.length > 0) {
      // --- Add this diagnostic line here ---
      console.log('Code reached email sending section.');

      const apiInstance = new brevo.TransactionalEmailsApi();
      const apiKey = apiInstance.authentications['apiKey'];
      apiKey.apiKey = process.env.BREVO_API_KEY;
    
      const sendSmtpEmail = {
        to: [{ email: email, name: username }],
        sender: { email: 'your-email@example.com', name: 'Your Website Name' },
        subject: 'Registration Confirmation',
        htmlContent: '<h1>Welcome to My Website!</h1><p>Thank you for registering. Your account is now active.</p>',
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, message: 'Registration successful! A confirmation email has been sent.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    } else {
      return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Registration failed.' }),
      headers: { 'Content-Type': 'application/json' }
      };
    }
  } catch (error) {
    console.error('Registration function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'An error occurred.' }),
      headers: { 'Content-Type': 'application/json' }
    };
  } finally {
    await client.end();
  }
};