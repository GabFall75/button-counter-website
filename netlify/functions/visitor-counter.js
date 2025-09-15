import { data } from '@netlify/functions';

const KEY = 'visitorCount';

exports.handler = async (event, context) => {
  try {
    // Get the current count from the data store. Default to 0 if it doesn't exist.
    const currentCount = await data.get(KEY) || 0;
    
    // Increment the count
    const newCount = currentCount + 1;
    
    // Set the new count in the data store
    await data.set(KEY, newCount);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ count: newCount }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update visitor count.' }),
    };
  }
};