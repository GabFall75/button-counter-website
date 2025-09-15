const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const filePath = path.join(process.cwd(), '.netlify', 'state', 'visitors.json');
    
    // Read the current count
    const data = fs.readFileSync(filePath, 'utf-8');
    let visitorData = JSON.parse(data);
    
    // Increment the count
    visitorData.count++;
    
    // Write the new count back to the file
    fs.writeFileSync(filePath, JSON.stringify(visitorData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ count: visitorData.count }),
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