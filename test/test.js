(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
  <style>
   
  </style>
  <div> <h1>Hello World</h1>
  </div>
  `;
  
  
  
    class test extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM
        this.shadowRoot.appendChild(tmpl.content.cloneNode(true)); // Append template to shadow DOM
       
    }
}
  
    
  
    // Define your custom element
    customElements.define('custom-test-pg', testt);
  })();
