const projects = [
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
            "link": "Android: https://play.google.com/apps/internaltest/4701122055645703621, iOS: no link",
            "username": "haolivium@gmail.com",
            "password": "P@ssw0rd768"
          },
          // Provide an admin object even if it's N/A:
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
          // This 'web' key is optional — your code doesn't currently use it, 
          // but you can keep it if you want to display or handle web separately:
          "web": {
            "link": "https://saawtcloud.net/",
            "username": "haolivium@gmail.com",
            "password": "P@ssw0rd768"
          },
          "admin": {
            // The original data only had "how to",
            // so you might convert it to link/username/password 
            // or leave placeholders as shown:
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
