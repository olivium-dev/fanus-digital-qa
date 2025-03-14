const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
    global.projectsData = projects;
    
    // Log the data for debugging
    console.log('Received projects data update request');
    
    // Determine if we're in a Netlify production environment
    const isNetlifyProduction = process.env.NETLIFY && process.env.CONTEXT === 'production';
    console.log(`Environment: ${isNetlifyProduction ? 'Netlify Production' : 'Local/Development'}`);
    
    // Store the data using available methods
    let storageSuccess = false;
    
    // 1. Try to use file system storage (works locally and sometimes in Netlify Functions)
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
      storageSuccess = true;
    } catch (fsError) {
      console.error('Error saving data to file:', fsError);
    }
    
    // 2. If in Netlify production, try to save to a public JSON file in the site
    if (isNetlifyProduction) {
      try {
        // Create a data.json file in the site's public directory
        const publicDataPath = path.join(process.env.NETLIFY_FUNCTION_DIR, '..', '..', 'data.json');
        fs.writeFileSync(publicDataPath, JSON.stringify(projects, null, 2));
        console.log(`Data saved to public file: ${publicDataPath}`);
        storageSuccess = true;
      } catch (publicFsError) {
        console.error('Error saving data to public file:', publicFsError);
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: `Projects data update request received successfully. Storage success: ${storageSuccess}`,
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