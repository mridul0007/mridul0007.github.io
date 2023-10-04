(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
  <style>
    #loading_overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 9999;
      allign-items: center;
      justify-content: center;
    }

    #loading_spinner {
    
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 4px solid white;
      border-top: 4px solid transparent;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg);}
      100% { transform: translate(-50%, -50%) rotate(360deg);}
    }
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

    .error-message {
      display: flex;
      color: black;
      padding: 10px;
      text-align: center;
    }


  </style>
  <div class="root">
    <label for="input_box_id">Dimension ID:</label>
    <input type="text" id="dimension_id" placeholder="Dimension ID...">
    <label for="input_box">Upload file:</label>
    <input type="file" id="input_box" accept=".csv" style="display: none;">
    <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
    <button id="select_file_button">Select File</button>
    <button id="upload_button">Upload</button>
  </div>

  <input type="text" id="error_Div" placeholder="" style="display: none; background: none; border: none; margin-top: 10px;" readonly>


  <div class="drag-drop-elements" id="drag_drop_cont" style="display: none;">
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
  <div id="loading_overlay">
        <div id="loading_spinner"></div>
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
      this.p_plm_query = {
        plm_mp_dimension_id: '',
        plm_mp_planningmodelmembers: []
      };
      this.plm_status = 0;
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
      var loadingOverlad = shadowRoot.getElementById('loading_overlay');
      const dimension_id_lable = shadowRoot.getElementById('input_box_id');
      const dimension_id_inp = shadowRoot.getElementById('dimension_id');
      const fileInput = shadowRoot.getElementById('input_box');
      const fileNameInput = shadowRoot.getElementById('file_name');
      const selectFileButton = shadowRoot.getElementById('select_file_button');
      const uploadButton = shadowRoot.getElementById('upload_button');
      const columnNamesDiv = shadowRoot.getElementById('column_names');
      const dragDropElements = shadowRoot.querySelector('.drag-drop-elements'); 

      // Variables to store CSV data and column names
      let csvData = [];
      let sourceDiv;
      
      // Add a click event listener to the "Select File" button
      selectFileButton.addEventListener('click', async () => {
        await setupDanfo();
        fileInput.click();
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
        sourceDiv = event.currentTarget;
        event.dataTransfer.setData('text/plain', event.target.textContent);
      });

      const dropZones = shadowRoot.querySelectorAll('.drop-zone');

      dropZones.forEach((dropZone) => {

        dropZone.addEventListener('dragstart', (event) => {
          sourceDiv = event.currentTarget;
          event.dataTransfer.setData('text/plain', event.target.textContent);
        });
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
            const dragParent = sourceDiv.getAttribute('data-drop-target');

            // Create a new button element with the dropped column name as the content
            const newElement = document.createElement('button');
            newElement.classList.add('drag-element');
            newElement.textContent = columnName;
            newElement.draggable = true;
            newElement.id = columnName;

            // Append the new button element to the drop zone
            target.appendChild(newElement);

            // Remove the draggable button from its parent (row)
            const div_id = shadowRoot.getElementById(sourceDiv.id);
            const draggableButton = div_id.querySelector(`button#${columnName}`);
            if (draggableButton) {
              draggableButton.remove();
            }
          }
        });
      });
      
      // Add a click event listener to the "Cancel" button
      const cancelButton = shadowRoot.getElementById('cancel_button');
      cancelButton.addEventListener('click', () => {
        // Hide the drag-and-drop elements
        dragDropElements.style.display = 'none';
        this.clearDragAndDropFields();
      });

      // Add a click event listener to the "Import" button
      const importButton = shadowRoot.getElementById('import_button');
      
      // Add a click event listener to the "Import" button
      importButton.addEventListener('click', async () => {

        this.p_plm_query.plm_mp_dimension_id = dimension_id_inp.value;

        const hierarchyDropZone = shadowRoot.getElementById('hierarchy_drop_zone');
        const propertiesDropZone = shadowRoot.getElementById('properties_drop_zone');

        // Function to collect button elements within a drop zone
        function collectButtonsFromDropZone(dropZone) {
          const buttons = dropZone.querySelectorAll('.drag-element');
          const buttonNames = [...buttons].map((button) => button.textContent);
          return buttonNames;
        }

        // Collect buttons from the Hierarchy and Properties drop zones
        this.mem_hierarchies = collectButtonsFromDropZone(hierarchyDropZone);
        this.mem_properties = collectButtonsFromDropZone(propertiesDropZone);

        // Now you have the button names within these drop zones
        console.log('Hierarchy Buttons:', this.mem_hierarchies);
        console.log('Properties Buttons:', this.mem_properties);

        let input_invst = {
          id: "DUMMY", // Replace with your actual value
          description: "DUMMY", // Replace with your actual value
          properties: {},
          hierarchies: {},
        };

        // Populate the properties field dynamically
        for (const propName of this.mem_properties) {
          input_invst.properties[propName] = "";
        }

        // Populate the hierarchies field dynamically
        for (const hierarchyName of this.mem_hierarchies) {
          input_invst.hierarchies[hierarchyName] = { parentId: "" };
        }
        let input_invst_dummy = JSON.parse(JSON.stringify(input_invst));
        this.p_plm_query.plm_mp_planningmodelmembers.push(input_invst_dummy);

        
          // Initialize an array to store the imported data
          const importedData = [];
          const row = this.df;
          // Loop through the rows of the data frame
          for (let i = 0; i < this.df.shape[0]; i++) {
            
            input_invst.id = this.df.loc({rows: [i],columns: ["ID"]}).$data[0][0];
            input_invst.description = this.df.loc({rows: [i],columns: ["Description"]}).$data[0][0];

           


            // Loop through the hierarchy columns
            this.mem_hierarchies.forEach((hierarchyColumn) => {

              var temp_hier = this.df.loc({rows: [i],columns: [hierarchyColumn]}).$data[0][0];
              if( temp_hier === null)
              {
                
                input_invst.hierarchies[hierarchyColumn].parentId = 'DUMMY';
            
              }
              else if( temp_hier === "<root>")
              {
                
                input_invst.hierarchies[hierarchyColumn].parentId = '';
            
              }
              else{
                input_invst.hierarchies[hierarchyColumn].parentId = temp_hier;
                
              }
            });

            // Loop through the properties columns
            this.mem_properties.forEach((propertyColumn) => {

              var temp_prop = this.df.loc({rows: [i],columns: [propertyColumn]}).$data[0][0];
              if( temp_prop === null)
              {
                
                input_invst.properties[propertyColumn]= '';
              }
              else{
                
                input_invst.properties[propertyColumn]= temp_prop;
              }

            });

            
            let input_invst_copy = JSON.parse(JSON.stringify(input_invst));
            this.p_plm_query.plm_mp_planningmodelmembers.push(input_invst_copy);

          }

          // Now you have the imported data in the `PLM` array
          console.log('plm query');
          console.log(this.p_plm_query.plm_mp_planningmodelmembers);
          // this.dispatchEvent(new CustomEvent("onPlmQueryExecution"));
          var r_query = await this.plm_query_execute(this.p_plm_query);
          
        
      });

      

    }

    clearDragAndDropFields() {
      // Clear the column names div
      const columnNamesDiv = this.shadowRoot.getElementById('column_names');
      columnNamesDiv.innerHTML = '';
  
      // Clear the drop zones
      const dropZones = this.shadowRoot.querySelectorAll('.drop-zone');
      dropZones.forEach((dropZone) => {
        dropZone.innerHTML = '';
      });
  
      // Hide the drag-and-drop elements
      const dragDropElements = this.shadowRoot.querySelector('.drag-drop-elements');
      dragDropElements.style.display = 'none';
      this.p_plm_query.plm_mp_planningmodelmembers = [];
  
      // Clear the variables
      this.mem_id = null;
      this.mem_description = null;
      this.mem_hierarchies = [];
      this.mem_properties = [];
    }

    showMessage(display_text, msg_type) {
      const errorDiv = this.shadowRoot.getElementById('error_Div');
      if(msg_type === 'red')
      {
        errorDiv.style.color = 'lightcoral';
      }
      else{
        errorDiv.style.color = 'lightgreen';
      }
      errorDiv.style.borderColor = msg_type;
    
      errorDiv.value  = display_text;
      errorDiv.style.display = 'flex';
  }

    loadingScreen(){
      var loadingOverlad = this.shadowRoot.getElementById('loading_overlay');
      loadingOverlad.style.display = "block";

    }

    hideLoadingScreen(){
      var loadingOverlad = this.shadowRoot.getElementById('loading_overlay');
      loadingOverlad.style.display = "none";
    }

    async sleep(ms) {
      return new Promise(function(resolve) {
        setTimeout(resolve, ms);
      });
    }

    hideMessage() {
      const errorDiv = this.shadowRoot.getElementById('error_Div');
      errorDiv.style.display = 'none';
  }

  //   plm query execute function
    async plm_query_execute(p_query) {
      var loadingOverlad = this.shadowRoot.getElementById('loading_overlay');
      const dragDropElements = this.shadowRoot.querySelector('.drag-drop-elements'); 
      loadingOverlad.style.display = "block";
      // let iteration = 0;
      // const iteration_max = 10;
      let iteration_time = 0;
      const max_time = 500000000;
    
      while (iteration_time <= max_time) {
        if (this.plm_status == 0) {
          this.plm_status = 1;
          // iteration = iteration + 1;
          iteration_time = iteration_time + 50;
          this.p_plm_query =  p_query; 
          this.dispatchEvent(new CustomEvent("onPlmQueryExecution"));
          await this.sleep(50);
          break; // Exit the loop
        } else {
          await this.sleep(50);
        }
        console.log(iteration_time);
      }
    
      if (iteration_time === max_time) {
        setTimeout(() => {
          this.hideMessage();
        }, 3000);
        this.showMessage('Connection Error, reload page');
      } else {
        iteration_time = 0;
        while (iteration_time <= max_time) {
          console.log(iteration_time);
          console.log(this.plm_status);
          if (this.plm_status == 2) {
            loadingOverlad.style.display = "none";
            setTimeout(() => {
              this.hideMessage();
            }, 3000);
            this.showMessage(this.p_plm_query.plm_mp_planningmodelmember_status,"green");
            dragDropElements.style.display = 'none'; 
            this.clearDragAndDropFields();
            let r_query = this.p_plm_query;
            this.plm_status = 0;
            return r_query;
          } else {
            await this.sleep(50);
          }
          iteration_time = iteration_time + 50;
        }
    
        if (iteration_time === max_time) {
          console.log("finish");
          loadingOverlad.style.display = "none";
          dragDropElements.style.display = 'none'; 
          setTimeout(() => {
            this.hideMessage();
          }, 3000);
          this.showMessage(this.p_plm_query.plm_mp_planningmodelmember_status,"red");
          this.clearDragAndDropFields();
          this.plm_status = 0;
        }
      }
    }
  
    set_p_plm_query(p_plm_query) {
      this.p_plm_query = p_plm_query;
      this.plm_status = 2;
    }
  
    get_p_plm_query() {
      return this.p_plm_query;
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
