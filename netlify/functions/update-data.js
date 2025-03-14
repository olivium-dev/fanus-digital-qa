const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const util = require('util');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const form = new multiparty.Form();
    const parseForm = util.promisify(form.parse).bind(form);
    
    const { fields, files } = await parseForm(event);
    
    if (!files || !files.file || !files.file[0]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }
    
    const uploadedFile = files.file[0];
    
    // Read the file content
    const fileContent = fs.readFileSync(uploadedFile.path, 'utf8');
    
    // Validate the JSON
    try {
      JSON.parse(fileContent);
    } catch (jsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' })
      };
    }
    
    // Determine the target path for data.json
    const dataJsonPath = path.join(process.cwd(), 'data.json');
    
    // Write the file to the data.json in the site root
    fs.writeFileSync(dataJsonPath, fileContent);
    
    console.log(`Data file updated at ${dataJsonPath}`);
    
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