document.addEventListener("DOMContentLoaded", () => {
    const projectContainer = document.getElementById("projectContainer");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContent = document.getElementById("modalContent");
    const closeModalBtn = document.getElementById("closeModalBtn");
  
    // Colors for the top bar of each project
    const colors = [
      "#FF8A80", "#FFD180", "#FFFF8D", "#CFD8DC",
      "#80D8FF", "#A7FFEB", "#CCFF90", "#F48FB1"
    ];
    let colorIndex = 0;
  
    // Helper function: create a short snippet
    function createSnippet(text, maxLength = 80) {
      if (text.length <= maxLength) {
        return text; // No need to truncate
      }
      return text.slice(0, maxLength) + "...";
    }
  
    // Close modal function
    function closeModal() {
      modalOverlay.classList.remove("active");
      modalContent.innerHTML = "";
    }
  
    closeModalBtn.addEventListener("click", closeModal);
  
    // Close modal if user clicks the overlay
    window.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  
    projects.forEach(projectObj => {
      // Each element in 'projects' is an object with a single key (e.g. 'saawt', 'SeenWaGeem', etc.)
      for (const key in projectObj) {
        const projectData = projectObj[key];
  
        // Create the project card container
        const card = document.createElement("div");
        card.classList.add("project-card");
  
        // Color bar
        const colorBar = document.createElement("div");
        colorBar.classList.add("project-color-bar");
        colorBar.style.backgroundColor = colors[colorIndex % colors.length];
        colorIndex++;
  
        // Title
        const title = document.createElement("h2");
        title.classList.add("project-title");
        title.textContent = projectData.name;
  
        // Progress
        const progressWrapper = document.createElement("div");
        progressWrapper.classList.add("progress-wrapper");
        Object.entries(projectData.progress).forEach(([progressKey, progressValue]) => {
          const progressItem = document.createElement("div");
          progressItem.classList.add("progress-item");
          progressItem.innerHTML = `<span>${progressKey}:</span> ${progressValue}%`;
          progressWrapper.appendChild(progressItem);
        });
  
        // Snippets for description and howToTest
        const snippetBlock = document.createElement("div");
        snippetBlock.classList.add("snippet-block");
  
        // Short version of description
        const shortDesc = document.createElement("p");
        shortDesc.innerHTML = `<strong>Description:</strong> ${createSnippet(projectData.description)}`;
  
        // "Show More" for Description
        const descShowMoreBtn = document.createElement("button");
        descShowMoreBtn.classList.add("show-more-btn");
        descShowMoreBtn.textContent = "Show More (Description)";
        descShowMoreBtn.addEventListener("click", () => {
          // Populate modal with full Description
          modalContent.innerHTML = `
            <h2>${projectData.name} - Description</h2>
            <p>${projectData.description}</p>
          `;
          modalOverlay.classList.add("active");
        });
  
        // Short version of howToTest
        const shortTest = document.createElement("p");
        shortTest.innerHTML = `<strong>How to Test:</strong> ${createSnippet(projectData.howToTest)}`;
  
        // "Show More" for HowToTest
        const testShowMoreBtn = document.createElement("button");
        testShowMoreBtn.classList.add("show-more-btn");
        testShowMoreBtn.textContent = "Show More (How To Test)";
        testShowMoreBtn.addEventListener("click", () => {
          // Populate modal with full HowToTest
          modalContent.innerHTML = `
            <h2>${projectData.name} - How To Test</h2>
            <p>${projectData.howToTest}</p>
          `;
          modalOverlay.classList.add("active");
        });
  
        // Add them all to snippetBlock
        snippetBlock.appendChild(shortDesc);
        snippetBlock.appendChild(descShowMoreBtn);
        snippetBlock.appendChild(document.createElement("br")); // quick line break
        snippetBlock.appendChild(shortTest);
        snippetBlock.appendChild(testShowMoreBtn);
  
        // Environments
        const envContainer = document.createElement("div");
        envContainer.classList.add("env-container");
        const envTitle = document.createElement("h3");
        envTitle.classList.add("project-subtitle");
        envTitle.textContent = "Environments:";
        envContainer.appendChild(envTitle);
  
        Object.entries(projectData.envs).forEach(([envKey, envData]) => {
          const envHeader = document.createElement("h4");
          envHeader.textContent = envKey.toUpperCase();
  
          const envList = document.createElement("ul");
          envList.classList.add("env-list");
  
          // Mobile environment
          const mobileItem = document.createElement("li");
          mobileItem.innerHTML = `
            <span>Mobile Link:</span> ${envData.mobile.link}<br>
            <span>Username:</span> ${envData.mobile.username}<br>
            <span>Password:</span> ${envData.mobile.password}
          `;
          // Admin environment
          const adminItem = document.createElement("li");
          adminItem.innerHTML = `
            <span>Admin Link:</span> ${envData.admin.link}<br>
            <span>Username:</span> ${envData.admin.username}<br>
            <span>Password:</span> ${envData.admin.password}
          `;
  
          envList.appendChild(mobileItem);
          envList.appendChild(adminItem);
  
          envContainer.appendChild(envHeader);
          envContainer.appendChild(envList);
        });
  
        // Add all items to the card
        card.appendChild(colorBar);
        card.appendChild(title);
        card.appendChild(progressWrapper);
        card.appendChild(snippetBlock);
        card.appendChild(envContainer);
  
        // Finally, add this card to the main container
        projectContainer.appendChild(card);
      }
    });
  });
  