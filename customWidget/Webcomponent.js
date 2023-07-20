// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = 
//     `<button type="button" id="button_modify">MODIFY</button>` 
//     `<button type="button" id="button_delete">DELETE</button>` 
//     `<button type="button" id="button_create">CREATE</button>` ;
    

   
//     class PerformanceHelp extends HTMLElement {
//         constructor(height) {
//             console.log(height);
//             super();
//             this.init();           
//         }

//         init() {            
              
//             let shadowRoot = this.attachShadow({mode: "open"});
//             shadowRoot.appendChild(tmpl.content.cloneNode(true));
//             this.addEventListener("click", event => {
//             var event = new Event("onClick");
//             this.fireChanged();           
//             this.dispatchEvent(event);
//             });           
//         }

//         fireChanged() {
//             console.log(this.dept);
//             console.log("OnClick Triggered");     
            
//         }    
//         test(){
//             console.log(this.dept);
//         }
        
//     }

//     customElements.define('custom-button', PerformanceHelp);
// })();
(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <input type="text" id="text_box" placeholder="SELECTED INVESTMENTS">
    <input type="text" id="input_box" placeholder="Enter value...">
    <button type="button" id="button_modify">MODIFY</button>
    <button type="button" id="button_delete">DELETE</button>
    <button type="button" id="button_create">CREATE</button>
   
  `;
  
    class PerformanceHelp extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.addEventListener('click', (event) => {
          var event = new Event('onClick');
          this.fireChanged();
          this.dispatchEvent(event);
        });
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    customElements.define('custom-button', PerformanceHelp);
  })();
  