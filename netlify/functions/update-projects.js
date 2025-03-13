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
    const projects = JSON.parse(event.body);
    
    // Validate the data (basic validation)
    if (!Array.isArray(projects)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid data format. Expected an array.' })
      };
    }
    
    // Update the projects data in memory for the get-projects function
    // This is a simplified approach for testing
    global.projectsData = projects;
    
    // Log the data for debugging
    console.log('Received projects data update request');
    
    // Store the data in a JSON file in the data directory
    try {
      // Create a data directory if it doesn't exist
      const dataDir = path.join('/tmp', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Write the data to a JSON file
      const dataPath = path.join(dataDir, 'projects.json');
      fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
      
      console.log(`Data saved to ${dataPath}`);
    } catch (fsError) {
      console.error('Error saving data to file:', fsError);
      // Continue execution even if file saving fails
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Projects data update request received successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error updating projects data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update projects data', details: error.message })
    };
  }
}; 