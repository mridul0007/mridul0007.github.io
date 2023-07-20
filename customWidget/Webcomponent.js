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
          display: grid;
          grid-template-columns: repeat(2, max-content);
          gap: 10px;
          margin-top: 2cm;
        }
      </style>
      <div class="root">
        <input type="text" id="text_box" placeholder="SELECTED INVESTMENTS">
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
  
    class PerformanceHelp extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
  
        // Add event listeners to the buttons
        const buttonModify = shadowRoot.getElementById('button_modify');
        buttonModify.addEventListener('click', () => {
          this.showChildPopup();
        });
  
        const buttonDelete = shadowRoot.getElementById('button_delete');
        buttonDelete.addEventListener('click', () => {
          this.toggleChildPopup();
        });
  
        const buttonCreate = shadowRoot.getElementById('button_create');
        buttonCreate.addEventListener('click', () => {
          this.toggleChildPopup();
        });
  
        // Add event listeners to the "OK" and "CANCEL" buttons in the child popup
        const buttonOk = shadowRoot.getElementById('button_ok');
        buttonOk.addEventListener('click', () => {
          this.hideChildPopup();
        });
  
        const buttonCancel = shadowRoot.getElementById('button_cancel');
        buttonCancel.addEventListener('click', () => {
          this.hideChildPopup();
        });
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
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    customElements.define('custom-button', PerformanceHelp);
  })();
  
  

