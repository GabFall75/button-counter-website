const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
  });

  try {
    await client.connect();
    const { username, password } = JSON.parse(event.body);

    // First, check if a user with this username already exists
    const checkRes = await client.query('SELECT id FROM users WHERE username = $1', [username]);

    if (checkRes.rows.length > 0) {
      return {
        statusCode: 409, // Conflict
        body: JSON.stringify({ success: false, message: 'Username already exists.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // This is where you would hash the password in a real app.
    // For now, we'll insert it as plain text for simplicity.
    const res = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);

    if (res.rows.length > 0) {
      return {
        statusCode: 201, // Created
        body: JSON.stringify({ success: true, message: 'Registration successful!' }),
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