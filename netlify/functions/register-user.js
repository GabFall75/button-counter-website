const { Client } = require('pg');
const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.handler = async (event, context) => {
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
      // --- Send Confirmation Email ---
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      
      const sendSmtpEmail = {
        to: [{ email: email, name: username }],
        sender: { email: 'falgab1975@gmail.com', name: 'Gabriele Blog' },
        subject: 'Registration Confirmation',
        htmlContent: '<h1>Welcome to My Website!</h1><p>Thank you for registering. Your account is now active.</p>',
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      // --- End of Email Logic ---

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