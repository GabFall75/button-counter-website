exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const password = data.password;

    // This is the hardcoded password for now. We will change this to a secure
    // environment variable in the next step.
    const correctPassword = process.env.PASSWORD;

    if (password === correctPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Password correct!' })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: 'Incorrect password.' })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'An error occurred.' })
    };
  }
};