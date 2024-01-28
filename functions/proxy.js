// functions/proxy.js

const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    // Extract the URL from the query parameters
    const apiUrl = event.queryStringParameters.url;

    // Make a request to the API
    const response = await axios.get(apiUrl);

    // Return the response to the client
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
