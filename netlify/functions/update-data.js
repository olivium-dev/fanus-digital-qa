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
    
    // Determine the target path for data.json
    const dataJsonPath = path.join(process.cwd(), 'data.json');
    
    // Write the data to the data.json file
    fs.writeFileSync(dataJsonPath, JSON.stringify(projectsData, null, 2));
    
    console.log(`Data file updated at ${dataJsonPath}`);
    
    // Update the global variable
    global.projectsData = projectsData;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Data file updated successfully',
        path: dataJsonPath
      })
    };
  } catch (error) {
    console.error('Error updating data file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update data file', details: error.message })
    };
  }
}; 