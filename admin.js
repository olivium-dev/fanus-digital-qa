document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const projectsList = document.getElementById('projectsList');
  const projectForm = document.getElementById('projectForm');
  const editorTitle = document.getElementById('editorTitle');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const addEnvironmentBtn = document.getElementById('addEnvironmentBtn');
  const environmentsContainer = document.getElementById('environmentsContainer');
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // State
  let projects = [];
  let currentProjectKey = null;
  let isEditing = false;
  let projectToDelete = null;

  // Fetch projects from API
  async function fetchProjects() {
    try {
      const response = await fetch('/api/get-projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Check if the response is valid
      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from API');
      }
      
      projects = data;
      renderProjectsList();
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects. Please try again later. Error: ' + error.message);
    }
  }

  // Render the list of projects
  function renderProjectsList() {
    projectsList.innerHTML = '';
    
    projects.forEach(projectObj => {
      for (const key in projectObj) {
        const projectData = projectObj[key];
        
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        if (key === currentProjectKey) {
          projectItem.classList.add('active');
        }
        
        const projectItemHeader = document.createElement('div');
        projectItemHeader.classList.add('project-item-header');
        
        const projectTitle = document.createElement('h3');
        projectTitle.textContent = projectData.name;
        
        const projectActions = document.createElement('div');
        projectActions.classList.add('project-item-actions');
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit Project';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          editProject(key);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete Project';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showDeleteConfirmation(key);
        });
        
        projectActions.appendChild(editBtn);
        projectActions.appendChild(deleteBtn);
        
        projectItemHeader.appendChild(projectTitle);
        projectItemHeader.appendChild(projectActions);
        
        const projectDesc = document.createElement('p');
        projectDesc.textContent = projectData.description;
        
        projectItem.appendChild(projectItemHeader);
        projectItem.appendChild(projectDesc);
        
        projectItem.addEventListener('click', () => {
          editProject(key);
        });
        
        projectsList.appendChild(projectItem);
      }
    });
  }

  // Edit a project
  function editProject(projectKey) {
    isEditing = true;
    currentProjectKey = projectKey;
    editorTitle.textContent = 'Edit Project';
    
    // Find the project data
    const projectObj = projects.find(p => Object.keys(p)[0] === projectKey);
    const projectData = projectObj[projectKey];
    
    // Populate the form
    document.getElementById('projectKey').value = projectKey;
    document.getElementById('projectKey').disabled = true; // Can't change key when editing
    document.getElementById('projectName').value = projectData.name;
    document.getElementById('projectDescription').value = projectData.description;
    document.getElementById('mvp1Progress').value = projectData.progress.MVP1 || 0;
    document.getElementById('mvp2Progress').value = projectData.progress.MVP2 || 0;
    document.getElementById('howToTest').value = projectData.howToTest || '';
    
    // Clear environments container
    environmentsContainer.innerHTML = '';
    
    // Add environments
    for (const envKey in projectData.envs) {
      addEnvironmentToForm(envKey, projectData.envs[envKey]);
    }
    
    // Update active state in list
    renderProjectsList();
  }

  // Add a new project
  function addNewProject() {
    isEditing = false;
    currentProjectKey = null;
    editorTitle.textContent = 'Add New Project';
    
    // Reset the form
    projectForm.reset();
    document.getElementById('projectKey').disabled = false;
    environmentsContainer.innerHTML = '';
    
    // Add a default environment
    addEnvironmentToForm('Production', {
      mobile: { link: '', username: '', password: '' },
      admin: { link: '', username: '', password: '' }
    });
    
    // Update active state in list
    renderProjectsList();
  }

  // Add an environment to the form
  function addEnvironmentToForm(envName = '', envData = null) {
    const envId = `env-${Date.now()}`;
    const envCard = document.createElement('div');
    envCard.classList.add('environment-card');
    envCard.dataset.envId = envId;
    
    // Environment header with name and remove button
    const envHeader = document.createElement('h4');
    
    const envNameInput = document.createElement('input');
    envNameInput.type = 'text';
    envNameInput.value = envName;
    envNameInput.placeholder = 'Environment Name';
    envNameInput.classList.add('env-name-input');
    
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-env-btn');
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remove Environment';
    removeBtn.addEventListener('click', () => {
      envCard.remove();
    });
    
    envHeader.appendChild(envNameInput);
    envHeader.appendChild(removeBtn);
    envCard.appendChild(envHeader);
    
    // Mobile section
    const mobileSection = createEnvSection(
      'Mobile',
      envData?.mobile?.link || '',
      envData?.mobile?.username || '',
      envData?.mobile?.password || ''
    );
    envCard.appendChild(mobileSection);
    
    // Admin section
    const adminSection = createEnvSection(
      'Admin',
      envData?.admin?.link || '',
      envData?.admin?.username || '',
      envData?.admin?.password || ''
    );
    envCard.appendChild(adminSection);
    
    environmentsContainer.appendChild(envCard);
  }

  // Create an environment section (mobile, admin, etc.)
  function createEnvSection(sectionName, link, username, password) {
    const section = document.createElement('div');
    section.classList.add('env-section');
    
    const sectionTitle = document.createElement('h5');
    sectionTitle.textContent = sectionName;
    section.appendChild(sectionTitle);
    
    // Link input
    const linkGroup = document.createElement('div');
    linkGroup.classList.add('form-group');
    
    const linkLabel = document.createElement('label');
    linkLabel.textContent = 'Link:';
    
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.value = link;
    linkInput.classList.add('env-link');
    
    linkGroup.appendChild(linkLabel);
    linkGroup.appendChild(linkInput);
    section.appendChild(linkGroup);
    
    // Username input
    const usernameGroup = document.createElement('div');
    usernameGroup.classList.add('form-group');
    
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Username:';
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = username;
    usernameInput.classList.add('env-username');
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    section.appendChild(usernameGroup);
    
    // Password input
    const passwordGroup = document.createElement('div');
    passwordGroup.classList.add('form-group');
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password:';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'text';
    passwordInput.value = password;
    passwordInput.classList.add('env-password');
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    section.appendChild(passwordGroup);
    
    return section;
  }

  // Get form data as a project object
  function getFormData() {
    const projectKey = document.getElementById('projectKey').value;
    const projectName = document.getElementById('projectName').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const mvp1Progress = parseInt(document.getElementById('mvp1Progress').value) || 0;
    const mvp2Progress = parseInt(document.getElementById('mvp2Progress').value) || 0;
    const howToTest = document.getElementById('howToTest').value;
    
    // Build environments object
    const envs = {};
    const envCards = environmentsContainer.querySelectorAll('.environment-card');
    
    envCards.forEach(card => {
      const envName = card.querySelector('.env-name-input').value;
      if (!envName) return; // Skip environments without a name
      
      const envSections = card.querySelectorAll('.env-section');
      const envData = {};
      
      envSections.forEach(section => {
        const sectionName = section.querySelector('h5').textContent.toLowerCase();
        envData[sectionName] = {
          link: section.querySelector('.env-link').value,
          username: section.querySelector('.env-username').value,
          password: section.querySelector('.env-password').value
        };
      });
      
      envs[envName] = envData;
    });
    
    // Create the project object
    const projectData = {
      name: projectName,
      description: projectDescription,
      progress: {
        MVP1: mvp1Progress,
        MVP2: mvp2Progress
      },
      howToTest: howToTest,
      envs: envs
    };
    
    return { [projectKey]: projectData };
  }

  // Save project (add or update)
  async function saveProject(projectData) {
    try {
      // Find the project key
      const projectKey = Object.keys(projectData)[0];
      
      // If editing, update the existing project
      if (isEditing) {
        const projectIndex = projects.findIndex(p => Object.keys(p)[0] === projectKey);
        if (projectIndex !== -1) {
          projects[projectIndex] = projectData;
        }
      } else {
        // If adding, add the new project
        projects.push(projectData);
      }
      
      // Save to API
      const response = await fetch('/api/update-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projects)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('Save result:', result);
      
      // Direct update to data.json as a fallback
      try {
        // Create a Blob with the JSON data
        const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
        
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', blob, 'data.json');
        
        // Send the file to the server
        const uploadResponse = await fetch('/update-data', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          console.log('Data file updated directly');
        } else {
          console.warn('Failed to update data file directly:', await uploadResponse.text());
        }
      } catch (uploadError) {
        console.error('Error updating data file directly:', uploadError);
      }
      
      // Update the UI
      renderProjectsList();
      
      // Show success message
      alert(isEditing ? 'Project updated successfully!' : 'Project added successfully!');
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again. Error: ' + error.message);
      
      // Fallback: If API fails, at least update the UI
      renderProjectsList();
    }
  }

  // Delete a project
  async function deleteProject(projectKey) {
    try {
      // Remove the project from the array
      projects = projects.filter(p => Object.keys(p)[0] !== projectKey);
      
      // Save to API
      const response = await fetch('/api/update-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projects)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('Delete result:', result);
      
      // Update the UI
      currentProjectKey = null;
      renderProjectsList();
      
      // Reset the form
      addNewProject();
      
      // Show success message
      alert('Project deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again. Error: ' + error.message);
      
      // Fallback: If API fails, at least update the UI
      renderProjectsList();
    }
  }

  // Show delete confirmation modal
  function showDeleteConfirmation(projectKey) {
    projectToDelete = projectKey;
    confirmationModal.classList.add('active');
  }

  // Hide delete confirmation modal
  function hideDeleteConfirmation() {
    confirmationModal.classList.remove('active');
    projectToDelete = null;
  }

  // Event Listeners
  addProjectBtn.addEventListener('click', addNewProject);
  
  cancelBtn.addEventListener('click', () => {
    if (currentProjectKey) {
      editProject(currentProjectKey);
    } else {
      projectForm.reset();
      environmentsContainer.innerHTML = '';
    }
  });
  
  addEnvironmentBtn.addEventListener('click', () => {
    addEnvironmentToForm();
  });
  
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const projectData = getFormData();
    await saveProject(projectData);
  });
  
  confirmDeleteBtn.addEventListener('click', async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      hideDeleteConfirmation();
    }
  });
  
  cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
  
  // Initialize
  await fetchProjects();
  addNewProject(); // Start with an empty form
}); 