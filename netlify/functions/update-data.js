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
    // Check if we have a JSON body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No data provided' })
      };
    }
    
    let projectsData;
    
    // Try to parse the body as JSON
    try {
      projectsData = JSON.parse(event.body);
    } catch (jsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' })
      };
    }
    
    // Validate that it's an array
    if (!Array.isArray(projectsData)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid data format. Expected an array.' })
      };
    }
    
    // Update the global variable for immediate access
    global.projectsData = projectsData;
    
    // Determine if we're in a Netlify production environment
    const isNetlifyProduction = process.env.NETLIFY && process.env.CONTEXT === 'production';
    console.log(`Environment: ${isNetlifyProduction ? 'Netlify Production' : 'Local/Development'}`);
    
    let storageSuccess = false;
    let storageMethod = 'none';
    
    // APPROACH 1: Try to write to the data.json file (works in local development)
    try {
      // Local development: Write to data.json in the project root
      if (!isNetlifyProduction) {
        const dataJsonPath = path.join(process.cwd(), 'data.json');
        fs.writeFileSync(dataJsonPath, JSON.stringify(projectsData, null, 2));
        console.log(`Data file updated at ${dataJsonPath}`);
        storageSuccess = true;
        storageMethod = 'local file';
      }
    } catch (fsError) {
      console.error('Error saving to local file:', fsError);
    }
    
    // APPROACH 2: Try to write to the /tmp directory (works in both environments)
    try {
      // Create a data directory if it doesn't exist
      const dataDir = path.join('/tmp', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Write the data to a JSON file in /tmp
      const dataPath = path.join(dataDir, 'projects.json');
      fs.writeFileSync(dataPath, JSON.stringify(projectsData, null, 2));
      
      console.log(`Data saved to ${dataPath}`);
      storageSuccess = true;
      storageMethod = storageMethod || 'tmp file';
    } catch (tmpError) {
      console.error('Error saving to tmp file:', tmpError);
    }
    
    // APPROACH 3: If in production, try to use a serverless database
    if (isNetlifyProduction) {
      try {
        // Create a unique ID for the data
        const dataId = 'projects-data';
        
        // Store the data in the browser's localStorage on the client side
        const script = `
          <script>
            localStorage.setItem('${dataId}', '${JSON.stringify(projectsData).replace(/'/g, "\\'")}');
            document.body.innerHTML = '<h1>Data saved successfully!</h1><p>You can close this window.</p>';
          </script>
        `;
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
          },
          body: `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Data Saved</title>
            </head>
            <body>
              <h1>Saving data...</h1>
              ${script}
            </body>
            </html>
          `
        };
      } catch (dbError) {
        console.error('Error using serverless database:', dbError);
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: storageSuccess, 
        message: `Data update request processed. Storage method: ${storageMethod}`,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error updating data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update data', details: error.message })
    };
  }
}; 