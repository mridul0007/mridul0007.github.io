(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
      <style>
        .child_popup {
          display: none;
          flex-direction: column;
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
          
      </style>
      <div class="root">
        <label for="input_box">SELECTED INVESTMENT:</label>
        <input type="text" id="input_box" placeholder="Enter value...">
        <button type="button" id="button_modify">MODIFY</button>
        <button type="button" id="button_delete">DELETE</button>
        <button type="button" id="button_create">CREATE</button>
      </div>
      <div class="child_popup">
        <div class="input-row">
          <label for="text_box_id">ID:</label>
          <input type="text" id="text_box_id" placeholder="Enter value...">
        </div>
        <div class="input-row">
          <label for="text_box_desc">Description:</label>
          <input type="text" id="text_box_desc" placeholder="Enter value...">
        </div>
          
        <div class="input-row">
            <label for="select_box_department">Department:</label>
            
        </div>
        <div class="input-row">
            <label for="select_box_hierarchy">Hierarchy:</label>
            
        </div>

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
  class MasterData_Maintain extends HTMLElement {
    constructor() {
      super();
      this.p_plm_obj = {};
      this.internal_operation = '';
      this.widget_status = 0;
      this.onSaveTriggered = false;
      this.plm_counter = 0;
      this.init();
    }

    init() {
      let shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
      this._export_settings = {};

      // const buttonModify = shadowRoot.getElementById('button_modify');
      // buttonModify.addEventListener('click', async () => {
      //   this.try_plm_obj;
      //   this.p_plm_obj.plm_operation = 'fill_data';
      //   this.plm_status = 0;
      //   this.widget_status = 1;

      //   await this.dispatchEvent(new CustomEvent("onSave"));
      //   await this.fillDataAfterVariableChange();
      // });


      // trial

      const buttonModify = shadowRoot.getElementById('button_modify');
      buttonModify.addEventListener('click', async () => {
        this.showLoadingScreen();
        this.plm_status = 0;
        this.widget_status = 1;
        this.p_plm_obj.member_id = this.mem_id;
        this.internal_operation = 'modify';
        this.p_plm_obj.plm_operation = 'fill_data';

        this.plm_query_execute(this.plm_counter);

        // setTimeout(() => this.fillDataAfterVariableChange(), 1500);
        // await this.dispatchEvent(new CustomEvent("onSave"));
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
      buttonOk.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent("onSave"));
        this.hideChildPopup();
      })

      const buttonCancel = shadowRoot.getElementById('button_cancel');
      buttonCancel.addEventListener('click', () => {
        this.plm_status = 0;
        this.hideChildPopup();
        this.widget_status = 0;
      });

      const inputBox = shadowRoot.getElementById('input_box');
      inputBox.value = this.id;
    }

    showChildPopup(callback) {
      const childPopup = this.shadowRoot.querySelector('.child_popup');
      childPopup.style.display = 'flex';
      if (typeof callback === 'function') {
        callback();
      }
    }

    hideChildPopup() {
      const childPopup = this.shadowRoot.querySelector('.child_popup');
      childPopup.style.display = 'none';
    }


    showLoadingScreen() {
      const loadingScreen = this.shadowRoot.querySelector('.loading-screen');
      loadingScreen.style.display = 'flex';
    }

    // Hide the loading screen
    hideLoadingScreen() {
      const loadingScreen = this.shadowRoot.querySelector('.loading-screen');
      loadingScreen.style.display = 'none';
    }

    onCustomWidgetAfterUpdate(ochangedProperties) {
      if ("mem_id" in ochangedProperties) {
        const inputBox = this.shadowRoot.getElementById('input_box');
        inputBox.value = this.mem_id;
      }
      if ("p_plm_obj" in ochangedProperties) {
        const inputBox = this.shadowRoot.getElementById('input_box');
        inputBox.value = this.p_plm_obj.member_id;
      }
    }

    async waitForVariableChange() {
      // this.p_plm_obj = this.get_p_plm_obj();
      var x = 0;
      return new Promise(resolve => {
        const checkChange = () => {
          if (this.plm_status !== 0) {
            console.log('resolved');
            resolve();
          } else {
            // Keep checking the variable's value until it changes
            console.log(x)

            if (x > 5) {
              alert("Connection error: refresh page");
              return;
            }
            // requestAnimationFrame(checkChange);
            setTimeout(() => checkChange(), 1500);
            x = x + 1;
          }
        };
        console.log('entered waitforvariable change')
        checkChange(); // Start the initial check
      });
    }

    async fillDataAfterVariableChange() {
      if (this.widget_status = 1) {

        await this.waitForVariableChange();
        await this.fillData();
        this.hideLoadingScreen();
        this.showChildPopup(() => {

        });
      }
    }


    plm_query_execute(plm_counter) {
      if (this.plm_status == 0) {
        this.plm_status = 1
        //  query_id++
        //  query.query_id = query_id
        //  p_query = query (direct assignment not setter!)
        plm_counter = plm_counter + 1;
        setTimeout(() => this.plm_query_execute(plm_counter), 1500);
        console.log(plm_counter);
        this.dispatchEvent(new CustomEvent("onSave"));

      }
      else if (this.plm_status == 2) {
        //  if query.query_id == p_query.query_id
        //    r_query = p_query
        //    PLM_STATUS = 0
        // new
        console.log(plm_counter);
        this.plm_status = 0;
        this.plm_counter = 0;
        this.fillData();
      }
      else {
        if (plm_counter < 5) {
          console.log(plm_counter);
          plm_counter = plm_counter + 1;
          setTimeout(() => this.plm_query_execute(plm_counter), 500);
        }
        else {
          alert("Connection error: refresh page adn try again");
        }
      }
    }




    async fillData() {
      this.plm_status = 0;
      const text_box_id = this.shadowRoot.getElementById('text_box_id');
      text_box_id.value = this.p_plm_obj.plm_PlanningModelMember.id;
      const text_box_desc = this.shadowRoot.getElementById('text_box_desc');
      text_box_desc.value = this.p_plm_obj.plm_PlanningModelMember.description;
      console.log(Object.keys(this.p_plm_obj.plm_PlanningModelMember));
      console.log(Object.values(this.p_plm_obj.plm_PlanningModelMember));
      this.hideLoadingScreen();
      this.showChildPopup();
    }

    set_p_plm_obj(p_plm_obj) {
      this.p_plm_obj = p_plm_obj;
    }

    set_plm_status(plm_status) {
      this.plm_status = plm_status;
    }

    get_p_plm_obj() {
      return this.p_plm_obj;
    }

    set_mem_id(mem_id) {
      if (this.widget_status == 0) {
        this.mem_id = mem_id;
        this.updateValues();
      }
      else {
        alert("ID already selected");
      }
    }

    fireChanged() { }

    updateValues() {
      const inputBox = this.shadowRoot.getElementById('input_box');
      inputBox.value = this.mem_id;

    }
  }

  customElements.define('custom-button', MasterData_Maintain);

})();


