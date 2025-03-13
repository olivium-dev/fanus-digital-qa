const { NetlifyFunction } = require('@netlify/functions');

// Create a handler that uses Netlify's KV store
const handler = async (event, context) => {
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
    
    // Store the data in Netlify's KV store
    try {
      // Save to KV store
      await context.store.set('projects', projects);
      console.log('Data saved to KV store');
    } catch (storeError) {
      console.error('Error saving data to KV store:', storeError);
      // Continue execution even if KV store saving fails
      
      // Fallback to file storage
      try {
        // Create a data directory if it doesn't exist
        const fs = require('fs');
        const path = require('path');
        const dataDir = path.join('/tmp', 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Write the data to a JSON file
        const dataPath = path.join(dataDir, 'projects.json');
        fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
        
        console.log(`Data saved to ${dataPath} as fallback`);
      } catch (fsError) {
        console.error('Error saving data to file as fallback:', fsError);
      }
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

// Export the handler wrapped with Netlify Function
exports.handler = NetlifyFunction(handler); 