const projects = [
  {
    "saawt": {
      "name": "saawt",
      "description": "Audio and podcast mobile app",
      "progress": {
        "MVP1": 80,
        "MVP2": 0
      },
      "howToTest": "Go to https://saawtcloud.net/ and login by social media account or email",
      "envs": {
        "mock": {
          "mobile": {
            "link": "https://saawtcloud.net/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://saawtcloud.net/admin",
            "username": "admintest@mail.com",
            "password": "123456"
          }
        },
        "prod": {
          "mobile": {
            "link": "https://saawtcloud.net/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://saawtcloud.net/admin",
            "username": "admintest@mail.com",
            "password": "123456"
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
        "MVP1": 0,
        "MVP2": 0
      },
      "howToTest": "Navigate to https://seenwageem.com/ and create an account",
      "envs": {
        "mock": {
          "mobile": {
            "link": "https://mock.seenwageem.com/",
            "username": "user@dummy.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://mock.seenwageem.com/admin",
            "username": "admin@dummy.com",
            "password": "123456"
          }
        },
        "prod": {
          "mobile": {
            "link": "https://seenwageem.com/",
            "username": "user@dummy.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://seenwageem.com/admin",
            "username": "admin@dummy.com",
            "password": "123456"
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
      "howToTest": "Visit https://dd-dashboard.net, sign in with test account",
      "envs": {
        "mock": {
          "mobile": {
            "link": "https://mock.dd-dashboard.net/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://mock.dd-dashboard.net/admin",
            "username": "admintest@mail.com",
            "password": "123456"
          }
        },
        "prod": {
          "mobile": {
            "link": "https://dd-dashboard.net/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://dd-dashboard.net/admin",
            "username": "admintest@mail.com",
            "password": "123456"
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
        "MVP1": 10,
        "MVP2": 0
      },
      "howToTest": "Go to https://thakii.com/ and register with an email or social media",
      "envs": {
        "mock": {
          "mobile": {
            "link": "https://mock.thakii.com/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://mock.thakii.com/admin",
            "username": "admintest@mail.com",
            "password": "123456"
          }
        },
        "prod": {
          "mobile": {
            "link": "https://thakii.com/",
            "username": "test@mail.com",
            "password": "123456"
          },
          "admin": {
            "link": "https://thakii.com/admin",
            "username": "admintest@mail.com",
            "password": "123456"
          }
        }
      }
    }
  }
];
