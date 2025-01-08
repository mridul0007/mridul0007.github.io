(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `

`;



  class tablewidget extends HTMLElement {
    constructor() {
      super();
     
    }

    // Custom initialization method (optional)
    init() {
      console.log('Photo Widget Initialized');
    }

    // Example event handler
    fireChanged() {
      console.log('OnClick Triggered  lll');
    }

    
  }

  

  // Define your custom element
  customElements.define('custom-button', tablewidget);
})();
