// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `
//       <style>
//         .child_popup {
//           display: none;
//           flex-direction: column;
//         }
//         /* Add some spacing between the elements in the second div */
//         .child_popup .input-row {
//           display: flex;
//           align-items: center;
//           margin-bottom: 5px;
//         }
//         .child_popup .input-row label {
//           width: 120px; /* Adjust the width as needed for the labels */
//           margin-right: 10px;
//         }
//         .child_popup .input-row input {
//           flex: 1;
//         }

//         /* Style for the buttons */
//         .child_popup .button-row {
//           display: grid;
//           grid-template-columns: repeat(2, max-content);
//           gap: 10px;
//           margin-top: 5cm;
//         }
//       </style>
//       <div class="root">
//         <input type="text" id="text_box" placeholder="SELECTED INVESTMENTS">
//         <input type="text" id="input_box" placeholder="Enter value...">
//         <button type="button" id="button_modify">MODIFY</button>
//         <button type="button" id="button_delete">DELETE</button>
//         <button type="button" id="button_create">CREATE</button>
//       </div>
//       <div class="child_popup">
//         <div class="input-row">
//           <label for="text_box_id">ID:</label>
//           <input type="text" id="text_box_id" placeholder="Enter value...">
//         </div>
//         <div class="input-row">
//           <label for="text_box_desc">Description:</label>
//           <input type="text" id="text_box_desc" placeholder="Enter value...">
//         </div>
//         <div class="input-row">
//           <label for="text_box_department">Department:</label>
//           <input type="text" id="text_box_department" placeholder="Enter value...">
//         </div>
//         <div class="input-row">
//           <label for="text_box_hierarchy">Hierarchy:</label>
//           <input type="text" id="text_box_hierarchy" placeholder="Enter value...">
//         </div>

//         <!-- Buttons row -->
//         <div class="button-row">
//           <button type="button" id="button_ok">OK</button>
//           <button type="button" id="button_cancel">CANCEL</button>
//         </div>
//       </div>
//     `;

//     class PerformanceHelp extends HTMLElement {
//       constructor() {
//         super();
//         this.init();
//       }

//       init() {
//         let shadowRoot = this.attachShadow({ mode: 'open' });
//         shadowRoot.appendChild(tmpl.content.cloneNode(true));

//         // Add event listeners to the buttons
//         const buttonModify = shadowRoot.getElementById('button_modify');
//         buttonModify.addEventListener('click', () => {
//           this.toggleChildPopup();
//         });

//         const buttonDelete = shadowRoot.getElementById('button_delete');
//         buttonDelete.addEventListener('click', () => {
//           this.toggleChildPopup();
//         });

//         const buttonCreate = shadowRoot.getElementById('button_create');
//         buttonCreate.addEventListener('click', () => {
//           this.toggleChildPopup();
//         });

//         this.addEventListener('click', (event) => {
//           var event = new Event('onClick');
//           this.fireChanged();
//           this.dispatchEvent(event);
//         });
//       }

//       // Function to toggle visibility of the second div
//       toggleChildPopup() {
//         const childPopup = this.shadowRoot.querySelector('.child_popup');
//         const isVisible = childPopup.style.display === 'flex';
//         childPopup.style.display = isVisible ? 'none' : 'flex';
//       }

//       fireChanged() {
//         console.log('OnClick Triggered');
//       }
//     }

//     customElements.define('custom-button', PerformanceHelp);
//   })();


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
      </div>
    `;
    class MasterData_Maintain extends HTMLElement {
        

        constructor() {
            // var _p_pmm;
            super();
            this.init();
        }

        init() {
            let shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._export_settings = {};
            // Add event listeners to the buttons
            const buttonModify = shadowRoot.getElementById('button_modify');
            buttonModify.addEventListener('click', () => {
                this.showChildPopup()
                this.fillData();
            });

            const buttonDelete = shadowRoot.getElementById('button_delete');
            buttonDelete.addEventListener('click', () => {
                this.showChildPopup();
            });

            const buttonCreate = shadowRoot.getElementById('button_create');
            buttonCreate.addEventListener('click', () => {
                this.showChildPopup();
            });

            // Add event listeners to the "OK" and "CANCEL" buttons in the child popup
            const buttonOk = shadowRoot.getElementById('button_ok');
            
            buttonOk.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent("onSave"));
                this.hideChildPopup();
            })

            const buttonCancel = shadowRoot.getElementById('button_cancel');
            buttonCancel.addEventListener('click', () => {
                this.hideChildPopup();
            });



            // Get the input element with the ID "input_box"
            const inputBox = shadowRoot.getElementById('input_box');

            // Set the value of the input field
            inputBox.value = this.dept;
        }

        // Function to show the second div
        showChildPopup() {
            const childPopup = this.shadowRoot.querySelector('.child_popup');
            childPopup.style.display = 'flex';
        }

        // Function to hide the second div
        hideChildPopup() {
            const childPopup = this.shadowRoot.querySelector('.child_popup');
            childPopup.style.display = 'none';
        }

        OnCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties }
            console.log('changedProperties', changedProperties);
            const inputBox = this.shadowRoot.getElementById('input_box');

            // Set the value of the input field
            inputBox.value = this.dept;
            input.inputBox = setdept
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if ("dept" in changedProperties) {
                console.log('value changed', this.dept);
                const inputBox = this.shadowRoot.getElementById('input_box');
                inputBox.value = this.dept;
                console.log('changedProperties after update', changedProperties);
                // trial
            }

        }

               

        
        async fillData() {
           
            const inputBox = this.shadowRoot.getElementById('input_box');
            var ds = this.dataBindings.getDataBinding().getDataSource();
            console.log(ds);

            try {
                // Call the addDimensionToFeed method and wait for it to complete
                var set_hier = await ds.setHierarchy("MK_INVESTMENT","__FLAT__")

                // The code inside this block will be executed after the dimension is successfully added
                console.log(set_hier);
            } catch (error) {
                // If there's an error, it will be caught here
                console.error('fail to set hierarchy flat', error);
            }


            try {
                // Call the addDimensionToFeed method and wait for it to complete
                var ds_mem = await ds.getMember('MK_INVESTMENT', inputBox.value)

                // The code inside this block will be executed after the dimension is successfully added
                console.log(ds_mem);
            } catch (error) {
                // If there's an error, it will be caught here
                console.error('Error adding dimension to feed:', error);
            }


        }

        set_p_pmm(p_pmm) {
          this.p_pmm = p_pmm;
        }
      
        get_p_pmm() {
          return this.p_pmm;
        } 

        set_p_try(plm_operation){
          this.p_try.plm_operation = plm_operation;
        }

        get_p_try(){
          return this.p_try.plm_operation ;
        }



        fireChanged() {
            // console.log('OnClick Triggered');
            // this._props= {...this._props,...changedProperties}
            // const inputBox = shadowRoot.getElementById('input_box');

            // // Set the value of the input field
            // inputBox.value = this.dept;

        }
    }

    customElements.define('custom-button', MasterData_Maintain);
})();

