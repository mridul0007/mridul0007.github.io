(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <div class="root">
        <label for="input_box">Upload file:</label>
        <input type="file" id="input_box" accept=".csv" style="display: none;">
        <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
        <button id="select_file_button">Select File</button>
        <button id="upload_button">Upload</button>
        <table id="csv_table">
          <!-- Table headers will be added here -->
        </table>
        <div id="csv_controls" style="display: none;">
          <!-- 1st row: Column names as drag and drop elements -->
          <div id="column_names" class="row">
            <!-- Column names will be added here -->
          </div>
          <!-- 2nd row: Individual drop zones for ID and Description -->
          <div class="row">
            <div id="id_drop_zone" class="drop-zone">ID</div>
            <div id="description_drop_zone" class="drop-zone">Description</div>
          </div>
          <!-- 3rd row: Drop zone for Hierarchy -->
          <div class="row">
            <div id="hierarchy_drop_zone" class="drop-zone">Hierarchy</div>
          </div>
          <!-- 4th row: Drop zone for Properties -->
          <div class="row">
            <div id="properties_drop_zone" class="drop-zone">Properties</div>
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
        const csvTable = shadowRoot.getElementById('csv_table');
        const csvControls = shadowRoot.getElementById('csv_controls');
        const columnNamesDiv = shadowRoot.getElementById('column_names');
        const idDropZone = shadowRoot.getElementById('id_drop_zone');
        const descriptionDropZone = shadowRoot.getElementById('description_drop_zone');
        const hierarchyDropZone = shadowRoot.getElementById('hierarchy_drop_zone');
        const propertiesDropZone = shadowRoot.getElementById('properties_drop_zone');
  
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
  
              // Display column names as drag and drop elements
              columnNamesDiv.innerHTML = columnNames
                .map((columnName) => `<div class="drag-element">${columnName}</div>`)
                .join('');
  
              // Show the CSV controls
              csvControls.style.display = 'block';
            };
  
            // Read the file as text
            reader.readAsText(selectedFile);
          }
        });
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', MasterData_Maintain);
  })();
  