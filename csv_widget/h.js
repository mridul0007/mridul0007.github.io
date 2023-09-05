// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `
//     <div class="root">
//     <label for="input_box">Upload file:</label>
//     <input type="file" id="input_box" accept=".csv" style="display: none;">
//     <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
//     <button id="select_file_button">Select File</button>
//     <button id="upload_button">Upload</button>
//   </div>
//     `;

//     class MasterData_Maintain extends HTMLElement {
//         constructor() {
//             super();
//             this.init();
//         }

//         init() {
//             let shadowRoot = this.attachShadow({ mode: 'open' });
//             shadowRoot.appendChild(tmpl.content.cloneNode(true));
//             this._export_settings = {};
            
            
//             const fileInput = shadowRoot.getElementById('input_box');
//             const fileNameInput = shadowRoot.getElementById('file_name');
//             const selectFileButton = shadowRoot.getElementById('select_file_button');
//             const uploadButton = shadowRoot.getElementById('upload_button');
      
//             // Add a click event listener to the "Select File" button
//             selectFileButton.addEventListener('click', () => {
//               fileInput.click(); // Trigger a click event on the hidden file input
//             });
      
//             // Add a change event listener to the file input
//             fileInput.addEventListener('change', () => {
//               // Display the selected file name in the text input
//               fileNameInput.value = fileInput.files[0].name;
//             });
      
//            // ...
      
//           // Add a click event listener to the "Upload" button
//           uploadButton.addEventListener('click', () => {
//             // Get the selected file
//             const selectedFile = fileInput.files[0];
//             this.fillData();
//             if (selectedFile) {
//               // Create a FileReader object
//               const reader = new FileReader();
      
//               // Define an event handler for when the file is loaded
//               reader.onload = (event) => {
//                 const fileContents = event.target.result; // This will contain the file contents
                
//                 // Detect the separator (either comma or semicolon)
//                 let separator = ',';
//                 if (fileContents.includes(';')) {
//                   separator = ';';
//                 }
      
//                 // Split the file contents by the detected separator
//                 const lines = fileContents.split('\n');
//                 lines.forEach((line) => {
//                   const values = line.split(separator);
//                   console.log('CSV Line:', values);
//                   // You can process each line's values here
//                 });
//               };
              
              
//               // Read the file as text
//               reader.readAsText(selectedFile);
//             }
//           });


//         }
//         async fillData() {
            
 
//             // let datasource = this.exportDataSource;
//             // const dataBinding = this.dataBindings.getDataBinding('exportDataSource')
//             // // this.dataBindings.getDataBinding().addDimensionToFeed("dimensions", 'MK_REGION');
//             // let x = dataBinding.getDimensions("dimensions");
//             // let y = await dataBinding.getDataSource().getMembers(x,{offset: 0,limit:1});
//             // console.log(y);

//             // datasource.data.forEach(row => {
//             //     console.log(row);
//             // })

           






//         }


//         fireChanged() {
//             console.log('OnClick Triggered');
//             // this._props= {...this._props,...changedProperties}
//             // const inputBox = shadowRoot.getElementById('input_box');

//             // // Set the value of the input field
//             // inputBox.value = this.dept;

//         }
//     }

//     customElements.define('custom-button', MasterData_Maintain);
// })();


(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <div class="root">
        <label for="input_box">Upload file:</label>
        <input type="file" id="input_box" accept=".csv" style="display: none;">
        <input type="text" id="file_name" placeholder="Select a CSV file..." readonly>
        <button id="select_file_button">Select File</button>
        <button id="upload_button">Upload</button>
        <table id="csv_table">
          <!-- Table headers will be added here -->
        </table>
      </div>
    `;
  
    class MasterData_Maintain extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {

        // Create a script element for danfo.js and set its source
      const danfoScript = document.createElement('script');
      danfoScript.src = 'https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js';

      // Define an event listener for when the script is loaded
      danfoScript.onload = () => {
        // Now you can use danfo.js here
        this.setupDanfo();
      };

      // Append the script element to the document to load danfo.js
      document.body.appendChild(danfoScript);

      
  




        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
  
        const fileInput = shadowRoot.getElementById('input_box');
        const fileNameInput = shadowRoot.getElementById('file_name');
        const selectFileButton = shadowRoot.getElementById('select_file_button');
        const uploadButton = shadowRoot.getElementById('upload_button');
        const csvTable = shadowRoot.getElementById('csv_table');
  
        let csvData = []; // Array to store CSV data
        let columnNames = []; // Array to store column names
  
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
          // Get the selected file
          const selectedFile = fileInput.files[0];
  
          if (selectedFile) {
            // Create a FileReader object
            const reader = new FileReader();
  
            // Define an event handler for when the file is loaded
            reader.onload = (event) => {
              const fileContents = event.target.result;
  
              // Detect the separator (either comma or semicolon)
              let separator = ',';
              if (fileContents.includes(';')) {
                separator = ';';
              }
  
              // Split the file contents by the detected separator
              const lines = fileContents.split('\n');
  
              // Extract the header row (first row)
              const headerRow = lines[0];
              columnNames = headerRow.split(separator).map((columnName) => columnName.trim());
              console.log(columnNames);
  
              // Remove any existing table headers
              while (csvTable.firstChild) {
                csvTable.removeChild(csvTable.firstChild);
              }
  
              // Create table headers from column names
              const headerRowElement = document.createElement('tr');
              columnNames.forEach((columnName) => {
                const headerCell = document.createElement('th');
                headerCell.textContent = columnName;
                headerRowElement.appendChild(headerCell);
              });
              csvTable.appendChild(headerRowElement);
  
              // Continue processing the rest of the CSV data (excluding the header) if necessary
              for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(separator);
                console.log('CSV Line:', values);
                // Store or process the data as needed
              }
            };
  
            // Read the file as text
            reader.readAsText(selectedFile);
          }
        });
      }

      setupDanfo() {
        // You can use danfo.js here after it's loaded
        console.log('danfo.js is loaded and ready to use.');
        s = new dfd.Series([1, 3, 5, undefined, 6, 8])
        s.print()

      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    customElements.define('custom-button', MasterData_Maintain);
  })();
  
