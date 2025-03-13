document.addEventListener("DOMContentLoaded", async () => {
    const timelineContainer = document.getElementById("timelineContainer");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
  
    // Modal elements
    const jsonModal = document.getElementById("jsonModal");
    const closeJsonModalBtn = document.getElementById("closeJsonModalBtn");
    const exportedJson = document.getElementById("exportedJson");
    
    // Fetch timeline data from API
    let timelineData = [];
    try {
      const response = await fetch('/api/get-timeline');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      timelineData = await response.json();
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      // Fallback to local data if API fails
      console.log('Falling back to local data');
      if (typeof window.timelineData !== 'undefined') {
        timelineData = window.timelineData;
      }
    }
  
    // A helper function to render each block in a "card"
    function renderBlock(blockIndex, blockData) {
      // Create the container
      const card = document.createElement("div");
      card.classList.add("block-card");
  
      // Title
      const header = document.createElement("div");
      header.classList.add("block-header");
      header.textContent = `Block ${blockIndex + 1}: ${blockData.shortTitle}`;
      card.appendChild(header);
  
      // Field: weeks
      const weeksGroup = createFieldGroup(
        "Weeks",
        blockData.weeks,
        (val) => { timelineData[blockIndex].weeks = val; }
      );
      card.appendChild(weeksGroup);
  
      // Field: shortTitle
      const shortTitleGroup = createFieldGroup(
        "Short Title",
        blockData.shortTitle,
        (val) => { timelineData[blockIndex].shortTitle = val; }
      );
      card.appendChild(shortTitleGroup);
  
      // Field: progressStatus
      const progressStatusGroup = createFieldGroup(
        "Progress Status",
        blockData.progressStatus,
        (val) => { timelineData[blockIndex].progressStatus = val; }
      );
      card.appendChild(progressStatusGroup);
  
      // Field: paymentStatus
      const paymentStatusGroup = createFieldGroup(
        "Payment Status",
        blockData.paymentStatus,
        (val) => { timelineData[blockIndex].paymentStatus = val; }
      );
      card.appendChild(paymentStatusGroup);
  
      // Field: blockTitle
      const blockTitleGroup = createFieldGroup(
        "Block Title",
        blockData.blockTitle,
        (val) => { timelineData[blockIndex].blockTitle = val; }
      );
      card.appendChild(blockTitleGroup);
  
      // Field: totalBlock
      const totalBlockGroup = createFieldGroup(
        "Total Block (USD)",
        blockData.totalBlock,
        (val) => { timelineData[blockIndex].totalBlock = parseFloat(val) || 0; }
      );
      card.appendChild(totalBlockGroup);
  
      // KeyFocus - an array, we can do text area (line separated)
      const keyFocusGroup = document.createElement("div");
      keyFocusGroup.classList.add("field-group");
  
      const keyFocusLabel = document.createElement("label");
      keyFocusLabel.classList.add("field-label");
      keyFocusLabel.textContent = "Key Focus Items (one per line):";
      keyFocusGroup.appendChild(keyFocusLabel);
  
      const keyFocusTextarea = document.createElement("textarea");
      keyFocusTextarea.classList.add("field-input");
      keyFocusTextarea.rows = 4;
      keyFocusTextarea.value = blockData.keyFocus.join("\n");
      keyFocusTextarea.addEventListener("change", (e) => {
        const lines = e.target.value.split("\n").map(str => str.trim()).filter(Boolean);
        timelineData[blockIndex].keyFocus = lines;
      });
      keyFocusGroup.appendChild(keyFocusTextarea);
      card.appendChild(keyFocusGroup);
  
      // Payments Breakdown
      const paymentsContainer = document.createElement("div");
      paymentsContainer.classList.add("payments-container");
  
      const paymentsHeader = document.createElement("h4");
      paymentsHeader.textContent = "Payments Breakdown";
      paymentsContainer.appendChild(paymentsHeader);
  
      blockData.paymentsBreakdown.forEach((paymentObj, payIndex) => {
        // Create a row for each payment role
        const row = document.createElement("div");
        row.classList.add("payment-row");
  
        // Role
        const roleInput = document.createElement("input");
        roleInput.classList.add("field-input", "payment-input");
        roleInput.type = "text";
        roleInput.value = paymentObj.role;
        roleInput.addEventListener("change", (e) => {
          timelineData[blockIndex].paymentsBreakdown[payIndex].role = e.target.value;
        });
  
        // Amount
        const amountInput = document.createElement("input");
        amountInput.classList.add("field-input", "payment-input");
        amountInput.type = "number";
        amountInput.value = paymentObj.amount;
        amountInput.addEventListener("change", (e) => {
          timelineData[blockIndex].paymentsBreakdown[payIndex].amount = parseFloat(e.target.value) || 0;
        });
  
        // Status
        const statusInput = document.createElement("select");
        statusInput.classList.add("field-input", "payment-input");
        const statuses = ["pending", "not-paid", "paid", "in-progress"]; // Example statuses
        statuses.forEach(st => {
          const opt = document.createElement("option");
          opt.value = st;
          opt.textContent = st;
          if (paymentObj.status === st) opt.selected = true;
          statusInput.appendChild(opt);
        });
        statusInput.addEventListener("change", (e) => {
          timelineData[blockIndex].paymentsBreakdown[payIndex].status = e.target.value;
        });
  
        // Append to row
        row.appendChild(roleInput);
        row.appendChild(amountInput);
        row.appendChild(statusInput);
        paymentsContainer.appendChild(row);
      });
  
      card.appendChild(paymentsContainer);
  
      return card;
    }
  
    /**
     * Helper function to generate a labeled input
     * @param {string} label
     * @param {string|number} initialValue
     * @param {function} onChange
     * @returns HTMLElement (div)
     */
    function createFieldGroup(label, initialValue, onChange) {
      const group = document.createElement("div");
      group.classList.add("field-group");
  
      const labelEl = document.createElement("label");
      labelEl.classList.add("field-label");
      labelEl.textContent = label;
  
      const inputEl = document.createElement("input");
      inputEl.classList.add("field-input");
      inputEl.type = "text";
      inputEl.value = initialValue;
      inputEl.addEventListener("change", (e) => {
        onChange(e.target.value);
      });
  
      group.appendChild(labelEl);
      group.appendChild(inputEl);
  
      return group;
    }
  
    // Render all blocks
    function renderAllBlocks() {
      timelineContainer.innerHTML = ""; // clear previous
      timelineData.forEach((block, idx) => {
        const blockCard = renderBlock(idx, block);
        timelineContainer.appendChild(blockCard);
      });
    }
  
    // Initial render
    renderAllBlocks();
  
    // Save changes to the server
    async function saveChangesToServer() {
      try {
        const response = await fetch('/api/update-timeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(timelineData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        alert('Timeline data saved successfully!');
        return result;
      } catch (error) {
        console.error('Error saving timeline data:', error);
        alert('Failed to save timeline data. See console for details.');
        return null;
      }
    }
  
    // Show modal with updated JSON
    function showExportedJson() {
      // Convert the updated timelineData to a formatted JSON string
      const jsonString = JSON.stringify(timelineData, null, 2);
  
      // Put it in the textarea
      exportedJson.value = jsonString;
  
      // Show the modal
      jsonModal.classList.add("active");
    }
  
    // Save/Export button: save to server and open the modal with exported JSON
    saveChangesBtn.addEventListener("click", async () => {
      await saveChangesToServer();
      showExportedJson();
    });
  
    // Close the modal when clicking the "X" button
    closeJsonModalBtn.addEventListener("click", () => {
      jsonModal.classList.remove("active");
    });
  
    // Optional: Close the modal if the user clicks outside it
    window.addEventListener("click", (e) => {
      if (e.target === jsonModal) {
        jsonModal.classList.remove("active");
      }
    });
  });
  