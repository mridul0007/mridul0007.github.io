(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
      /* Add some basic styling for the drop zones */
      .drop-zone {
        border: 2px dashed #aaa;
        padding: 10px;
        margin: 10px;
        min-height: 50px;
        text-align: center;
        cursor: pointer;
      }
      .drop-zone.hover {
        background-color: #f0f0f0;
      }
    </style>
    <div class="root">
      <label for="input_box">Upload file:</label>
      <input type="file" id="input_box" accept=".csv" style="display: none;">
      <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
      <button id="select_file_button">Select File</button>
      <button id="upload_button">Upload</button>
    </div>
    <div class="drag-drop-elements" style="display: none;">
      <!-- 1st row: Column names as draggable buttons -->
      <div id="column_names" class="row">
        <!-- Column names will be added here as draggable buttons -->
      </div>
      <!-- 2nd row: Drop zones for ID and Description with box titles -->
      <div class="drop-box">
        <div class="drop-box-title">ID</div>
        <div id="id_drop_zone" class="drop-zone" data-drop-target="ID">
          <!-- ID drop zone content will be added here -->
        </div>
      </div>
      <div class="drop-box">
        <div class="drop-box-title">Description</div>
        <div id="description_drop_zone" class="drop-zone" data-drop-target="Description">
          <!-- Description drop zone content will be added here -->
        </div>
      </div>
      <!-- 3rd row: Drop zone for Hierarchy with box title -->
      <div class="drop-box">
        <div class="drop-box-title">Hierarchy</div>
        <div id="hierarchy_drop_zone" class="drop-zone" data-drop-target="Hierarchy">
          <!-- Hierarchy drop zone content will be added here -->
        </div>
      </div>
      <!-- 4th row: Drop zone for Properties with box title -->
      <div class="drop-box">
        <div class="drop-box-title">Properties</div>
        <div id="properties_drop_zone" class="drop-zone" data-drop-target="Properties">
          <!-- Properties drop zone content will be added here -->
        </div>
      </div>
    </div>
    `;
  
    class MasterData_Maintain extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {
        // Create a shadow DOM for your custom element
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
  
        // DOM elements
        const fileInput = shadowRoot.getElementById('input_box');
        const fileNameInput = shadowRoot.getElementById('file_name');
        const selectFileButton = shadowRoot.getElementById('select_file_button');
        const uploadButton = shadowRoot.getElementById('upload_button');
        const columnNamesDiv = shadowRoot.getElementById('column_names');
        const uploadControls = shadowRoot.querySelector('.upload-controls');
        const dragDropElements = shadowRoot.querySelector('.drag-drop-elements');
  
        // Variables to store CSV data and column names
        let csvData = [];
        let columnNames = [];
  
        // Add a click event listener to the "Select File" button
        selectFileButton.addEventListener('click', () => {
          fileInput.click(); // Trigger a click event on the hidden file input
        });
  
        // Add a change event listener to the file input
        fileInput.addEventListener('change', () => {
          // Display the selected file name in the text input
          fileNameInput.value = fileInput.files[0].name;
        });
  
        // Add a click event listener to the "Upload" button
        uploadButton.addEventListener('click', () => {
          // Get the selected file
          const selectedFile = fileInput.files[0];
  
          if (selectedFile) {
            // Create a FileReader object
            const reader = new FileReader();
  
            // Define an event handler for when the file is loaded
            reader.onload = (event) => {
              const fileContents = event.target.result;
  
              // Detect the separator (either comma or semicolon)
              let separator = ',';
              if (fileContents.includes(';')) {
                separator = ';';
              }
  
              // Split the file contents by the detected separator
              const lines = fileContents.split('\n');
  
              // Extract the header row (first row)
              columnNames = lines[0]
                .split(separator)
                .map((columnName) => columnName.trim());
  
              // Replace the inner HTML of the "columnNamesDiv" with draggable buttons
              columnNamesDiv.innerHTML = columnNames
                .map((columnName) => `<button class="drag-element" draggable="true">${columnName}</button>`)
                .join('');
  
              // Show the CSV controls
              dragDropElements.style.display = 'block'; // Show drag and drop elements
            };
  
            // Read the file as text
            reader.readAsText(selectedFile);
          }
        });
  
        // Implement drag-and-drop functionality
        columnNamesDiv.addEventListener('dragstart', (event) => {
          event.dataTransfer.setData('text/plain', event.target.textContent);
        });
  
        const dropZones = shadowRoot.querySelectorAll('.drop-zone');
  
        dropZones.forEach((dropZone) => {
          dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            // Add a class to indicate the hover state
            dropZone.classList.add('hover');
          });
  
          dropZone.addEventListener('dragleave', (event) => {
            // Remove the hover class when the element is dragged out
            dropZone.classList.remove('hover');
          });
  
          dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.classList.remove('hover'); // Remove the hover class
  
            const columnName = event.dataTransfer.getData('text/plain');
            const target = event.target;
  
            if (target.classList.contains('drop-zone')) {
              // Set the data-drop-target attribute of the drop zone
              const dropTarget = target.getAttribute('data-drop-target');
  
              // Create a new element to display the dropped value
              const newElement = document.createElement('div');
              newElement.textContent = columnName;
  
              // Append the new element to the drop zone
              target.appendChild(newElement);
  
              // You can handle the dropped column name here
              console.log(`Dropped "${columnName}" into ${dropTarget}`);
            }
          });
        });
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', MasterData_Maintain);
  })();
  