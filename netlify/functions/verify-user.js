const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL, // <--- Corrected variable name
  });

  try {
    await client.connect();
    const { username, password } = JSON.parse(event.body);

    const res = await client.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (res.rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Login successful!' }),
        headers: { 'Content-Type': 'application/json' }
      };
    } else {
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