const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the incoming JSON data
    const timelineData = JSON.parse(event.body);
    
    // Validate the data (basic validation)
    if (!Array.isArray(timelineData)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid data format. Expected an array.' })
      };
    }
    
    // In a real application, we would write to the file here
    // For testing purposes, we'll just return a success message
    console.log('Received timeline data update request');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Timeline data update request received successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update timeline data', details: error.message })
    };
  }
}; 