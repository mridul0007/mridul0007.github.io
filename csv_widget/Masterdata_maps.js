(function () {
  


  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
  <div class="root">
    <label for="input_box">Upload file:</label>
    <input type="file" id="input_box" accept=".csv" style="display: none;">
    <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
    <button id="select_file_button">Select File</button>
    <button id="upload_button">Upload</button>
  </div>
  `;

  class MasterData_CSV extends HTMLElement {
    constructor() {
      super();
      this.init();
    
    }

    init() {
      let shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(tmpl.content.cloneNode(true));

      // Get references to the elements
      const fileInput = shadowRoot.getElementById('input_box');
      const fileNameInput = shadowRoot.getElementById('file_name');
      const selectFileButton = shadowRoot.getElementById('select_file_button');
      const uploadButton = shadowRoot.getElementById('upload_button');

      // Add a click event listener to the "Select File" button
      selectFileButton.addEventListener('click', () => {
        fileInput.click(); // Trigger a click event on the hidden file input
      });

      // Add a change event listener to the file input
      fileInput.addEventListener('change', () => {
        // Display the selected file name in the text input
        fileNameInput.value = fileInput.files[0].name;
      });

      // Add a click event listener to the "Upload" button
      uploadButton.addEventListener('click', () => {
        // Implement your file upload logic here
    });
  }

    onCustomWidgetAfterUpdate(ochangedProperties) {}

    fireChanged() {}
  }

  customElements.define('custom-widget', MasterData_CSV);

 
  
})();