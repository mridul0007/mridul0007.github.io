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
          <label for="text_box_department">Department:</label>
          <input type="text" id="text_box_department" placeholder="Enter value...">
        </div>
        <div class="input-row">
          <label for="text_box_hierarchy">Hierarchy:</label>
          <input type="text" id="text_box_hierarchy" placeholder="Enter value...">
        </div>
  
        <!-- Buttons row -->
        <div class="button-row">
          <button type="button" id="button_ok">OK</button>
          <button type="button" id="button_cancel">CANCEL</button>
        </div>
        
        <div class="loading">
        <div id="loading_text" style="display: none;">Loading...</div>
      </div>
    `;
  class MasterData_Maintain extends HTMLElement {
    constructor() {
      super();
      this.p_plm_obj = {};
      this.try_plm_obj = {};
      this.onSaveTriggered = false;
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
      //   this.p_plm_obj.status = 0;
      //   this.p_plm_obj.internal_status = 1;

      //   await this.dispatchEvent(new CustomEvent("onSave"));
      //   await this.fillDataAfterVariableChange();
      // });


      // trial

      const buttonModify = shadowRoot.getElementById('button_modify');
      buttonModify.addEventListener('click', async () => {
        this.try_plm_obj;
        this.p_plm_obj.plm_operation = 'fill_data';
        this.p_plm_obj.status = 0;
        this.p_plm_obj.internal_status = 1;
        setTimeout(() => this.fillDataAfterVariableChange(), 1500);
        await this.dispatchEvent(new CustomEvent("onSave"));
        // await this.fillDataAfterVariableChange();
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
        this.p_plm_obj.status = 0;
        this.hideChildPopup();
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

    onCustomWidgetAfterUpdate(ochangedProperties) {
      if ("id" in ochangedProperties) {
        const inputBox = this.shadowRoot.getElementById('input_box');
        inputBox.value = this.id;
      }
      if ("p_plm_obj" in ochangedProperties) {
        const inputBox = this.shadowRoot.getElementById('input_box');
        inputBox.value = this.p_plm_obj.member_id;
      }
    }

    async waitForVariableChange() {
      // this.p_plm_obj = this.get_p_plm_obj();
      var x = 0;
      const loadingText = this.shadowRoot.getElementById('loading_text');
      loadingText.style.display = 'block';

      return new Promise(resolve => {
        const checkChange = () => {
          if (this.p_plm_obj.status !== 0) {
            console.log('resolved')
            loadingText.style.display = 'none';

            resolve();
          } else {
            // Keep checking the variable's value until it changes
            console.log(x)

            if (x > 300) {
              alert("Connection error: refresh page");
              return;
            }
            // requestAnimationFrame(checkChange);
            setTimeout(() =>this.fillDataAfterVariableChange(), 1500);
            x = x + 1;
          }
        };
        console.log('entered waitforvariable change')
        checkChange(); // Start the initial check
      });
    }

    async fillDataAfterVariableChange() {
      if (this.p_plm_obj.internal_status = 1) {

        await this.waitForVariableChange();
        await this.fillData();
        this.showChildPopup(() => {

        });
      }
    }

    async fillData() {
      this.p_plm_obj.status = 0;
      const text_box_id = this.shadowRoot.getElementById('text_box_id');
      text_box_id.value = this.p_plm_obj.plm_PlanningModelMember.id;
      const text_box_desc = this.shadowRoot.getElementById('text_box_desc');
      text_box_desc.value = this.p_plm_obj.plm_PlanningModelMember.description;
      console.log(Object.keys(this.p_plm_obj.plm_PlanningModelMember));
      console.log(Object.values(this.p_plm_obj.plm_PlanningModelMember));
    }

    set_p_plm_obj(p_plm_obj) {
      this.p_plm_obj = p_plm_obj;
      this.updateValues();

    }

    get_p_plm_obj() {
      return this.p_plm_obj;
    }

    get_empty_plm_obj() {
      p_local = {};
      return p_local;
    }

    fireChanged() { }

    updateValues() {
      const inputBox = this.shadowRoot.getElementById('input_box');
      inputBox.value = this.p_plm_obj.member_id;
    }
  }

  customElements.define('custom-button', MasterData_Maintain);

})();


