(function () {
  
  
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
      
    `;
  class MasterData_Maps extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      let shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
     
    }

    


    // show the pop up screen
    
  onCustomWidgetAfterUpdate(ochangedProperties) { }

  fireChanged() { }
}


  customElements.define('custom-widget', MasterData_Maps);

}) ();