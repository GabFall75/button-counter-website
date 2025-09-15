const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
  });

  try {
    await client.connect();

    // Create the visitors table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        count INT PRIMARY KEY DEFAULT 0
      );
    `);

    // Get the current count or insert the first row if it doesn't exist
    let res = await client.query('SELECT count FROM visitors');
    if (res.rows.length === 0) {
        await client.query('INSERT INTO visitors (count) VALUES (0)');
        res = await client.query('SELECT count FROM visitors');
    }

    const currentCount = res.rows[0].count;
    const newCount = currentCount + 1;
    
    // Update the count
    await client.query('UPDATE visitors SET count = $1', [newCount]);

    return {
      statusCode: 200,
      body: JSON.stringify({ count: newCount }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update visitor count.' }),
    };
  } finally {
    await client.end();
  }
};