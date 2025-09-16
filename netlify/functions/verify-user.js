const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const { username, password } = JSON.parse(event.body);

    // This query finds a user with the given username and password.
    // In a real application, you would hash the password before comparing it.
    const res = await client.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (res.rows.length > 0) {
      // User found, credentials are correct
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Login successful!' }),
        headers: { 'Content-Type': 'application/json' }
      };
    } else {
      // No matching user found
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: 'Invalid username or password.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
  } catch (error) {
    console.error('Login function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'An error occurred.' }),
      headers: { 'Content-Type': 'application/json' }
    };
  } finally {
    await client.end();
  }
};