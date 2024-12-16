(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <style>
      /* General styling for the widget */
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two columns */
        grid-template-rows: repeat(2, 200px); /* Two rows */
        gap: 10px; /* Spacing between boxes */
        width: 100%;
        max-width: 600px;
        margin-left: 2rem;
      }

      .box {
        background-color: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border-radius: 8px;
      }

      .box img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures images are cropped properly */
        transition: transform 0.3s ease;
      }

      .box img:hover {
        transform: scale(1.1); /* Zoom on hover */
      }
    </style>
    <div class="container">
      <div class="box"><img src="image1.jpg" alt="Image 1"></div>
      <div class="box"><img src="image2.jpg" alt="Image 2"></div>
      <div class="box"><img src="image3.jpg" alt="Image 3"></div>
      <div class="box"><img src="image4.jpg" alt="Image 4"></div>
    </div>
  `;

  class Photowidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Attach shadow DOM
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true)); // Append template to shadow DOM
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
  customElements.define('custom-button', Photowidget);
})();
