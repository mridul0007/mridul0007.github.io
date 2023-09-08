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
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start; /* Forces elements to start a new row */
    }
    .drop-zone.hover {
      background-color: #f0f0f0;
    }
    .drop-element {
      margin: 5px;
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
    <!-- Buttons for Cancel and Import -->
    <button id="cancel_button">Cancel</button>
    <button id="import_button">Import</button>
  </div>
  `;

  class MasterData_Maintain extends HTMLElement {
    constructor() {
      super();
      this.columnNames = [];
      this.df = null; 
      this.mem_properties = [];
      this.mem_hierarchies = [];
      this.mem_id = null;
      this.mem_description = null;
      this.init();
    }

    init() {
      // Create a script element for danfo.js and set its source
      const danfoScript = document.createElement('script');
      danfoScript.src = 'https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js';
      // Define an event listener for when the script is loaded
      const scriptLoaded = new Promise((resolve) => {
        danfoScript.onload = resolve;
      });

      const setupDanfo = async () => {
        // Wait for the script to be loaded
        await scriptLoaded;
        // Now you can use danfo.js here
        console.log('danfo.js is loaded and ready to use.');
      }

      // Append the script element to the document to load danfo.js
      document.body.appendChild(danfoScript);

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
      

      // Add a click event listener to the "Select File" button
      selectFileButton.addEventListener('click', async () => {
        await setupDanfo();
        fileInput.click(); // Trigger a click event on the hidden file input
      });

      // Add a change event listener to the file input
      fileInput.addEventListener('change', () => {
        // Display the selected file name in the text input
        fileNameInput.value = fileInput.files[0].name;
      });

      // Add a click event listener to the "Upload" button
      uploadButton.addEventListener('click', async () => {
        // Get the selected file
        this.df = await dfd.readCSV(fileInput.files[0]);
        this.df.head().print();

        this.columnNames = this.df.columns;
        columnNamesDiv.innerHTML = this.columnNames
          .map((columnName) => `<button class="drag-element" draggable="true" id="${columnName}">${columnName}</button>`)
          .join('');

        // Show the CSV controls
        dragDropElements.style.display = 'block'; // Show drag and drop elements
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
            newElement.classList.add('drop-element');
            newElement.textContent = columnName;

            // Append the new element to the drop zone
            target.appendChild(newElement);

            // Remove the draggable button from its parent (row)
            const draggableButton = columnNamesDiv.querySelector(`button#${columnName}`);
            if (draggableButton) {
              draggableButton.remove();
            }

            switch (dropTarget) {
              case 'ID':
                this.mem_id = columnName;
                break;
              case 'Description':
                this.mem_description = columnName;
                break;
              case 'Hierarchy':
                this.mem_hierarchies.push(columnName);
                break;
              case 'Properties':
                this.mem_properties.push(columnName);
                break;
              // Add cases for other drop zones as needed
            }

            // You can handle the dropped column name here
            console.log(`Dropped "${columnName}" into ${dropTarget}`);
            console.log(this.mem_id);
            console.log(this.mem_description);
            console.log(this.mem_hierarchies);
            console.log(this.mem_properties);
          }
        });
      });

      // Add a click event listener to the "Cancel" button
      const cancelButton = shadowRoot.getElementById('cancel_button');
      cancelButton.addEventListener('click', () => {
        // Hide the drag-and-drop elements
        dragDropElements.style.display = 'none';

        // Clear the variables
        this.mem_id = null;
        this.mem_description = null;
        this.mem_hierarchies = [];
        this.mem_properties = [];
      });

      // Add a click event listener to the "Import" button
      const importButton = shadowRoot.getElementById('import_button');
      // ...

// Add a click event listener to the "Import" button
importButton.addEventListener('click', () => {
  // Check if the required columns are selected
  if (this.mem_hierarchies.length > 0 || this.mem_properties.length > 0) {
    // Initialize an array to store the imported data
    const importedData = [];
    const row = this.df;
    // Loop through the rows of the data frame
    for (let i = 0; i < this.df.shape[0]; i++) {
       

      let importedItem = {
        ID: row.$data[i][0], // Access cell value by column name
        Description: row.$data[i][1], // Access cell value by column name
        Hierarchy: {},
        Properties: {}
      };

      // Loop through the hierarchy columns
      this.mem_hierarchies.forEach((hierarchyColumn) => {

        var temp_hier = this.df.loc({rows: [i],columns: [hierarchyColumn]}).$data[0];
        if( temp_hier !== null)
        {
          importedItem.Hierarchy[hierarchyColumn] = temp_hier;
        }
      });

      // Loop through the properties columns
      this.mem_properties.forEach((propertyColumn) => {

        var temp_prop = this.df.loc({rows: [i],columns: [propertyColumn]}).$data[0];
        if( temp_prop !== null)
        {
          importedItem.Hierarchy[hierarchyColumn] = temp_prop;
        }

      });

      importedData.push(importedItem);
    }

    // Now you have the imported data in the `importedData` array
    console.log(importedData);

    // You can perform further processing or send the data to your server here
  } else {
    // Display an error message or alert if required columns are not selected
    console.error('Please select all required columns: ID, Description, Hierarchy, Properties');
  }
});

// ...

      
      
    }
    readCSV() {
      // Implement your readCSV() function if needed
    }

    fireChanged() {
      console.log('OnClick Triggered');
    }
  }

  // Define your custom element
  customElements.define('custom-button', MasterData_Maintain);
})();
