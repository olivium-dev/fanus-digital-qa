// Import required modules
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Default projects data
const defaultProjects = [
  {
    "saawt": {
      "name": "saawt",
      "description": "Audio and podcast mobile app",
      "progress": {
        "MVP1": 90,
        "MVP2": 0
      },
      "howToTest": "Download Saawt mobile application. Test login with email,facebook,google,apple and try to skip login. Test audio playback (play, pause, speed control). Try search for books and podcasts. Test downloading and offline playback and bookmarks. Go to profile and change username and profile picture.",
      "envs": {
        "mock": {
          "mobile": {
            "link": "<br/>Web: <a href='https://saawtcloud.net/'>Web App</a> <br/>Android: <a href='https://play.google.com/apps/internaltest/4701122055645703621'>Download here</a> <br/>iOS: <a>Request access</a>",
            "username": "haolivium@gmail.com",
            "password": "P@ssw0rd768"
          },
          "admin": {
            "link": "N/A",
            "username": "N/A",
            "password": "N/A"
          }
        },
        "Dev": {
          "mobile": {
            "link": "Android: https://play.google.com/apps/internaltest/4700407469738696848, iOS: Needs Testflight invite",
            "username": "haolivium@gmail.com",
            "password": "P@ssw0rd768"
          },
          "web": {
            "link": "https://saawtcloud.net/",
            "username": "haolivium@gmail.com",
            "password": "P@ssw0rd768"
          },
          "admin": {
            "link": "From either Web/Mobile, click on 'CMS' to navigate to CMS.",
            "username": "N/A",
            "password": "N/A"
          }
        }
      }
    }
  },
  {
    "SeenWaGeem": {
      "name": "SeenWaGeem",
      "description": "Social storytelling platform",
      "progress": {
        "MVP1": 100,
        "MVP2": 100
      },
      "howToTest": "----needed----",
      "envs": {
        "Production": {
          "mobile": {
            "link": "<br/>Android: <a href='https://play.google.com/store/apps/details?id=com.seenwageem&hl=nl'>Download here</a>, <br/>iOS: <a href='https://apps.apple.com/py/app/seenwageem/id6473081020?l=en-GB'>Download here</a>",
            "username": "<i>Your email</i>",
            "password": "<i>Your password</i>"
          },
          "admin": {
            "link": "https://appswg.com/",
            "username": "admin",
            "password": "admin"
          }
        }
      }
    }
  },
  {
    "DD": {
      "name": "DD",
      "description": "Data dashboard platform",
      "progress": {
        "MVP1": 40,
        "MVP2": 15
      },
      "howToTest": "Ensure core features work seamlessly.\n\nUser Authentication:\n\nLogin with email or ANONYMOUSLY.\n\nVerify integrations with platforms (Facebook, Instagram, TikTok, and X).\n\nPosting and Sharing:\n\nPost videos directly from the app and verify they appear correctly on connected platforms.\n\nTest sharing posts across platforms simultaneously.\n\nQuick Reply:\n\nTest replying to posts directly from the app.\n\nEnsure replies are synchronized and visible on the respective platform.\n\nReport and Protect Posts:\n\nTest the reporting mechanism for inappropriate content.\n\nVerify if reports are sent to the respective platform (e.g., Facebook, X).",
      "envs": {
        "Production": {
          "mobile": {
            "link": "</br><a href='https://digitaldefender.org/'>Web</a> </br>Android: N/A, </br>iOS: N/A",
            "username": "haolivium@gmail.com or click on ACCESS ANONYMOUSLY.",
            "password": "N/A"
          },
          "web": {
            "link": "<a href='https://digitaldefender.org/'>https://digitaldefender.org/</a>",
            "username": "haolivium@gmail.com </br> click on ACCESS ANONYMOUSLY.",
            "password": "N/A"
          },
          "admin": {
            "link": "<a href='https://digitaldefender.org/cms'>CMS</a>",
            "username": "superadmin@digitaldefender.com",
            "password": "Wat3rSt!ne@free"
          }
        }
      }
    }
  },
  {
    "Thakii": {
      "name": "Thakii",
      "description": "Learning management mobile app",
      "progress": {
        "MVP1": 100,
        "MVP2": 0
      },
      "howToTest": "Download the application then try to upload a video or a youtube URL. The video or the youtube URL has to be converted to a PDF file",
      "envs": {
        "Dev": {
          "mobile": {
            "link": "</br><a href='https://thakii.netlify.app/'>Web</a> </br><a href='https://drive.google.com/file/d/1joWB7unwkYRdEB_pVpu-JC59xtCqaAWp/view?usp=sharing'>Android</a> </br>iOS: N/A",
            "username": "N/A",
            "password": "N/A"
          },
          "web": {
            "link": "https://thakii.netlify.app/",
            "username": "N/A",
            "password": "N/A"
          },
          "admin": {
            "link": "No CMS",
            "username": "-",
            "password": "-"
          }
        }
      }
    }
  }
];

// Initialize global projects data if not already set
if (!global.projectsData) {
  global.projectsData = defaultProjects;
}

exports.handler = async function(event, context) {
  try {
    let projects = global.projectsData || defaultProjects;
    let dataSource = 'default';
    
    // Determine if we're in a Netlify production environment
    const isNetlifyProduction = process.env.NETLIFY && process.env.CONTEXT === 'production';
    console.log(`Environment: ${isNetlifyProduction ? 'Netlify Production' : 'Local/Development'}`);
    
    // Check if this is a browser request with localStorage data
    const headers = event.headers || {};
    const userAgent = headers['user-agent'] || '';
    const isLocalStorageRequest = headers['x-localstorage-data'] === 'true';
    
    if (isLocalStorageRequest) {
      // Return a script that will retrieve data from localStorage and send it back
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Loading Data</title>
          </head>
          <body>
            <h1>Loading data...</h1>
            <script>
              // Get data from localStorage
              const projectsData = localStorage.getItem('projects-data');
              
              // Send data back to the parent window
              if (window.opener) {
                window.opener.postMessage({ type: 'PROJECTS_DATA', data: projectsData }, '*');
                document.body.innerHTML = '<h1>Data loaded!</h1><p>You can close this window.</p>';
              } else {
                document.body.innerHTML = '<h1>Data loaded!</h1><pre>' + (projectsData || 'No data found') + '</pre>';
              }
            </script>
          </body>
          </html>
        `
      };
    }
    
    // 1. Try to read from the /tmp directory (works in both environments)
    try {
      const dataPath = path.join('/tmp', 'data', 'projects.json');
      if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        projects = JSON.parse(fileData);
        console.log('Projects data loaded from tmp file');
        dataSource = 'tmp file';
        
        // Update the global variable
        global.projectsData = projects;
      }
    } catch (fsError) {
      console.error('Error reading projects data from file:', fsError);
      // Continue with other methods
    }
    
    // 2. If in local development, try to read from the data.json file
    if (dataSource === 'default' && !isNetlifyProduction) {
      try {
        const dataJsonPath = path.join(process.cwd(), 'data.json');
        if (fs.existsSync(dataJsonPath)) {
          const fileData = fs.readFileSync(dataJsonPath, 'utf8');
          projects = JSON.parse(fileData);
          console.log('Projects data loaded from data.json file');
          dataSource = 'data.json';
          
          // Update the global variable
          global.projectsData = projects;
        }
      } catch (jsonError) {
        console.error('Error reading from data.json:', jsonError);
        // Continue with other methods
      }
    }
    
    console.log(`Data source used: ${dataSource}`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(projects)
    };
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch projects data', details: error.message })
    };
  }
}; 