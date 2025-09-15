const { data } = require('@netlify/functions'); // This is the fix

const KEY = 'visitorCount';

exports.handler = async (event, context) => {
  try {
    const currentCount = await data.get(KEY) || 0;
    const newCount = currentCount + 1;
    await data.set(KEY, newCount);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ count: newCount }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error('Function error:', error); // Added this for better debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update visitor count.' }),
    };
  }
};