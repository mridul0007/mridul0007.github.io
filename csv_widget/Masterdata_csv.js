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


      let datasource = this.exportDataSource;
      console.log(datasource);
      // const dataBinding = this.dataBindings.getDataBinding('exportDataSource')
      // let x = dataBinding.getDimensions("dimensions");
      // console.log(x);

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

     // ...

    // Add a click event listener to the "Upload" button
    uploadButton.addEventListener('click', () => {
      // Get the selected file
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        // Create a FileReader object
        const reader = new FileReader();

        // Define an event handler for when the file is loaded
        reader.onload = (event) => {
          const fileContents = event.target.result; // This will contain the file contents
          
          // Detect the separator (either comma or semicolon)
          let separator = ',';
          if (fileContents.includes(';')) {
            separator = ';';
          }

          // Split the file contents by the detected separator
          const lines = fileContents.split('\n');
          lines.forEach((line) => {
            const values = line.split(separator);
            console.log('CSV Line:', values);
            // You can process each line's values here
          });
        };

        // Read the file as text
        reader.readAsText(selectedFile);
      }
    });

// ...

    }

    onCustomWidgetAfterUpdate(ochangedProperties) {}

    fireChanged() {}
  }

  customElements.define('custom-widget', MasterData_CSV);

 
  
})();