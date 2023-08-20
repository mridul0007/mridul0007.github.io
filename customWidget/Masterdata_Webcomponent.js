(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
        .child_popup {
          display: none;
          flex-direction: column;
          margin: 0.2cm; /* Add a 2cm margin to all sides */
          padding: 0.2cm; /* Add a 2cm padding to all sides */
        }
        
          /* Add some spacing between the elements in the second div */
          .child_popup .input-row {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }
          .child_popup .input-row label {
            width: 120px; /* Adjust the width as needed for the labels */
            margin-right: 10px;
          }
          .child_popup .input-row input {
            flex: 1;
          }
    
          /* Style for the buttons */
          .child_popup .button-row {
            display: flex; /* Set display to flex to ensure the buttons are visible */
            flex-direction: row; /* Explicitly set the flex direction to row */
            gap: 10px;
            margin-top: 2cm;
          }
          /* Add your custom styles for the loading screen here */
          .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
        
          /* Style the loading text */
          .loading-screen span code {
            font-size: 32px; /* Adjust the font size as needed */
            color: white; /* Text color */
            font-weight: bold; /* Bold font */
          }

          /* Add some spacing between the elements in the second div */
          .child_popup .input-row {
            display: flex;
            flex-direction: column; /* Change to column layout */
            align-items: flex-start; /* Align labels and inputs to the left */
            margin-bottom: 5px;
          }

          /* Add some spacing between the label and input pairs */
          .label-input-wrapper {
            margin-bottom: 0.2cm;
          }

          .label-input-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }
          
          .label-input-wrapper label {
            width: 120px;
            margin-right: 10px;
          }
          
          .label-input-wrapper input {
            flex: 1;
            margin-left: 14px; /* Add a left margin to the input fields */
          }

          .header-label {
            font-style: italic; /* Add italic font style to the header label */
            text-decoration: underline; /* Add underlined text decoration to the header label */
          }
          

            
        </style>
        <div class="root">
          <label for="input_box">SELECTED INVESTMENT:</label>
          <input type="text" id="input_box" placeholder="Enter value...">
          <button type="button" id="button_modify">MODIFY</button>
          <button type="button" id="button_delete">DELETE</button>
          <button type="button" id="button_create">CREATE</button>
        </div>
        <div class="child_popup">
          <!-- Buttons row -->
          <div class="button-row">
              <button type="button" id="button_ok">OK</button>
              <button type="button" id="button_cancel">CANCEL</button>
          </div>
        </div>
        
          
        <div class="loading-screen" style="display: none;">
          <span>Loading...</span>
        </div>  
          
      `;

      function generateFields(fieldsArray,array_des) {
        const fieldsContainer = document.createElement('div');
        fieldsContainer.classList.add('input-row');
        let p_flag = 0;
      
        fieldsArray.forEach(fieldName => {
          if ((array_des === 'Properties' || array_des === 'Hierarchies') && p_flag == 0) {
            const headerLabel = document.createElement('label');
            headerLabel.textContent = array_des;
            headerLabel.classList.add('header-label'); // Add the 'header-label' class
            fieldsContainer.appendChild(headerLabel);
            p_flag = 1;
          }
      
          const labelElement = document.createElement('label');
          labelElement.setAttribute('for', fieldName); // Use the field name as the "for" attribute
          labelElement.textContent = fieldName + ':';
      
          const inputElement = document.createElement('input');
          inputElement.type = 'text'; // You can change the input type as needed
          inputElement.id = fieldName; // Use the field name as the input's "id"
          inputElement.placeholder = 'Enter ' + fieldName + '...';
      
          const labelInputWrapper = document.createElement('div'); // Create a wrapper for label and input
          labelInputWrapper.classList.add('label-input-wrapper');
          labelInputWrapper.appendChild(labelElement);
          labelInputWrapper.appendChild(inputElement);
      
          fieldsContainer.appendChild(labelInputWrapper); // Append the label and input wrapper
        });
        p_flag = 0;
        return fieldsContainer;
      }
      
      
      
      
      

    class MasterData_Maintain extends HTMLElement {
      constructor() {
        super();
        this.p_plm_query = {};
        this.widget_operation = '';  // Widget operation 'MODIFY' 'DELETE' 'INSERT'
        this.plm_status = 0; //'0: pl free' '1: plm start execution query' '2: plm finished execution query'
        this.init();
      }
  
      init() {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this._export_settings = {};
  
        // const departmentOptions = ["Department 1", "Department 2", "Department 3"];
        // // Get the select element for the department dropdown
        // const selectDepartment = this.shadowRoot.getElementById('select_box_department');
  
        // // Populate the department options
        // departmentOptions.forEach(option => {
        //   const optionElement = document.createElement('option');
        //   optionElement.textContent = option;
        //   selectDepartment.appendChild(optionElement);
        // });
  
  
        // button modify logic code
        const buttonModify = shadowRoot.getElementById('button_modify');
        buttonModify.addEventListener('click', async () => {
          if (this.p_mem_id_selection != null) {
            this.showLoadingScreen();
            this.widget_operation = 'MODIFY';
            let p_qury = {};
            p_qury.plm_mp_member_id = this.p_mem_id_selection;
            p_qury.plm_method = 'fill_data';
            let r_query = await this.plm_query_execute(p_qury);
            this.fillData(r_query);
          }
          else {
            alert("Select an ID");
          }
        });


        const buttonDelete = shadowRoot.getElementById('button_delete');
        buttonDelete.addEventListener('click', () => {
          this.showChildPopup();
        });

  
        const buttonCreate = shadowRoot.getElementById('button_create');
        buttonCreate.addEventListener('click', () => {
          this.showChildPopup();
        });

  
        const buttonOk = shadowRoot.getElementById('button_ok');
        buttonOk.addEventListener('click', async () => {
          
          let p_query = await this.readData();
          p_query.plm_method = this.widget_operation;
          let r_query = await this.plm_query_execute(p_query);
          this.clear_plmquery();
          this.hideChildPopup();
        })

  
        const buttonCancel = shadowRoot.getElementById('button_cancel');
        buttonCancel.addEventListener('click', () => {
          this.clear_plmquery();
          this.hideChildPopup();
        });

  
        const inputBox = shadowRoot.getElementById('input_box');
        inputBox.value = this.id;



        const identity = ['id', 'description'];
        const properties = ['TAX_CLASS', 'DEDUCTION_YEAR', 'MEM_ACTIVE'];
        const hierarchies = ['DEPARTMENT', 'LEVEL'];

        const childPopup = this.shadowRoot.querySelector('.child_popup');

        // Clear existing content
        childPopup.innerHTML = '';

        // Generate and append elements for identity, properties, and hierarchies
        const identityFields = generateFields(identity, 'Identity');
        const propertiesFields = generateFields(properties, 'Properties');
        const hierarchiesFields = generateFields(hierarchies, 'Hierarchies');

        // Append the generated fields to the child_popup div
        childPopup.appendChild(identityFields);
        childPopup.appendChild(propertiesFields);
        childPopup.appendChild(hierarchiesFields);
      }

      // show the pop up screen
      showChildPopup(callback) {
        const childPopup = this.shadowRoot.querySelector('.child_popup');
        childPopup.style.display = 'flex';
        if (typeof callback === 'function') {
          callback();
        }
      }

      // Hide the pop up screen
      hideChildPopup() {
        const childPopup = this.shadowRoot.querySelector('.child_popup');
        childPopup.style.display = 'none';
      }

      // show the loading screen
      showLoadingScreen() {
        const loadingScreen = this.shadowRoot.querySelector('.loading-screen');
        loadingScreen.style.display = 'flex';
      }

  
      // Hide the loading screen
      hideLoadingScreen() {
        const loadingScreen = this.shadowRoot.querySelector('.loading-screen');
        loadingScreen.style.display = 'none';
      }
  
  
    //   sleep function for synchronization
      async sleep(ms) {
        return new Promise(function(resolve) {
          setTimeout(resolve, ms);
        });
      }

    //   plm query execute function
      async plm_query_execute(p_query) {
        this.showLoadingScreen();
        let iteration = 0;
        
        const iteration_max = 10;
      
        while (iteration < iteration_max) {
          if (this.plm_status == 0) {
            this.plm_status = 1;
            iteration = iteration + 1;
            this.p_plm_query =  p_query; 
            this.dispatchEvent(new CustomEvent("onPlmQueryExecution"));
            await this.sleep(200);
            break; // Exit the loop
          } else {
            await this.sleep(1500);
          }
          console.log(iteration);
        }
      
        if (iteration === iteration_max) {
          alert("connection error");
        } else {
          iteration = 0;
          while (iteration < iteration_max) {
            if (this.plm_status == 2) {
              let r_query = this.p_plm_query;
              this.plm_status = 0;
              this.hideLoadingScreen();
              return r_query;
            } else {
              await this.sleep(1500);
            }
            iteration = iteration + 1;
          }
      
          if (iteration === iteration_max) {
            alert("connection error: please reload");
            this.plm_status = 0;
            this.hideLoadingScreen();
          }
        }
        console.log(iteration);
      }
      
    //   assigning data to respective HTML fields
      async fillData(plm_query) {
      this.plm_status = 0;
      this.p_plm_query =plm_query;
      const text_box_id = this.shadowRoot.getElementById('text_box_id');
      text_box_id.value = this.p_plm_query.plm_mp_planningmodelmember.id;
      const text_box_desc = this.shadowRoot.getElementById('text_box_desc');
      text_box_desc.value = this.p_plm_query.plm_mp_planningmodelmember.description;
      console.log(Object.keys(this.p_plm_query.plm_mp_planningmodelmember));
      console.log(Object.values(this.p_plm_query.plm_mp_planningmodelmember));
      this.showChildPopup();

      const { identity, properties, hierarchies } = this.getAllKeys(this.p_plm_query.plm_mp_planningmodelmember);
  
      console.log('All Keys:', identity);
      console.log('Properties:', properties);
      console.log('Hierarchies:', hierarchies);

      
    }



    getAllKeys(jsonObj) {
      const properties = [];
      const hierarchies = [];
      const identity = [];
    
      function traverse(obj) {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (key === 'properties') {
              properties.push(...Object.keys(obj[key]));
            } else if (key === 'hierarchies') {
              hierarchies.push(...Object.keys(obj[key]));
            } else {
              traverse(obj[key]);
            }
          } else {
            if (key === 'property') {
              properties.push(key);
            } else if (key === 'hierarchies') {
              hierarchies.push(key);
            } else {
              identity.push(key);
            }
          }
        }
      }
    
      traverse(jsonObj);
    
      return { identity,properties, hierarchies};
    }
      
      
      
      











  
    //   reading inputed data from respective HTML fields
    async readData() {
        let p_query = this.p_plm_query;
        const text_box_id = this.shadowRoot.getElementById('text_box_id');
        p_query.plm_mp_planningmodelmember.id = text_box_id.value;
        const text_box_desc = this.shadowRoot.getElementById('text_box_desc');
        p_query.plm_mp_planningmodelmember.description = text_box_desc.value ;
        return p_query;
    }
  
    set_p_plm_query(p_plm_query) {
      this.p_plm_query = p_plm_query;
      this.plm_status = 2;
    }
  
    get_p_plm_query() {
      return this.p_plm_query;
    }
  
    set_p_mem_id_selection(p_mem_id_selection) {
      if (this.widget_operation == '') {
        this.p_mem_id_selection = p_mem_id_selection;
        this.updateValues();
      }
      else {
        alert("ID already selected");
      }
    }

    // updating member id to inputbox .
    updateValues() {
      const inputBox = this.shadowRoot.getElementById('input_box');
      inputBox.value = this.p_mem_id_selection; //set memid selection
  
    }

    clear_plmquery() {
        this.plm_status = 0;
        this.widget_operation = '';
        this.p_plm_query ={};
      }

    onCustomWidgetAfterUpdate(ochangedProperties) { }

    fireChanged() { }
  }

  
    customElements.define('custom-widget', MasterData_Maintain);
  
  }) ();
  
  
  