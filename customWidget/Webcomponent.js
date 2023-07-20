// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `
//     <div class="root">
//         <input type="text" id="text_box" placeholder="SELECTED INVESTMENTS">
//         <input type="text" id="input_box" placeholder="Enter value...">
//         <button type="button" id="button_modify">MODIFY</button>
//         <button type="button" id="button_delete">DELETE</button>
//         <button type="button" id="button_create">CREATE</button>
//     </div>
//     <div class="child_popup">
//     <input type="text" id="text_box" placeholder="SELECTED INVESTMENTS">
//     <input type="text" id="input_box" placeholder="Enter value...">
//     <button type="button" id="button_modify">MODIFY</button>
//     <button type="button" id="button_delete">DELETE</button>
//     <button type="button" id="button_create">CREATE</button>
// </div>
//   `;
  
//     class PerformanceHelp extends HTMLElement {
//       constructor() {
//         super();
//         this.init();
//       }
  
//       init() {
//         let shadowRoot = this.attachShadow({ mode: 'open' });
//         shadowRoot.appendChild(tmpl.content.cloneNode(true));
//         this.addEventListener('click', (event) => {
//           var event = new Event('onClick');
//           this.fireChanged();
//           this.dispatchEvent(event);
//         });
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
        <input type="text" id="text_box_2" placeholder="SELECTED INVESTMENTS">
        <input type="text" id="input_box_2" placeholder="Enter value...">
        <button type="button" id="button_modify_2">MODIFY</button>
        <button type="button" id="button_delete_2">DELETE</button>
        <button type="button" id="button_create_2">CREATE</button>
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
  
        // Add event listener to the first "MODIFY" button
        const buttonModify = shadowRoot.getElementById('button_modify');
        buttonModify.addEventListener('click', () => {
          this.toggleChildPopup();
        });
  
        this.addEventListener('click', (event) => {
          var event = new Event('onClick');
          this.fireChanged();
          this.dispatchEvent(event);
        });
      }
  
      // Function to toggle visibility of the second div
      toggleChildPopup() {
        const childPopup = this.shadowRoot.querySelector('.child_popup');
        childPopup.style.display = childPopup.style.display === 'none' ? 'block' : 'none';
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    customElements.define('custom-button', PerformanceHelp);
  })();
  