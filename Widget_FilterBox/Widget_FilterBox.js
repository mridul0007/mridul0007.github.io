(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
 
        <style>
        .container {
            display: flex;
            align-items: center;
        }

        .child {
            display: none;
            align-items: center;
        }
        </style>
        <div class="container">
        <button id="filter_button">Filter</button>
        <div class="child">
            <input type="text" id="filter_input" list="description_list">
            <datalist id="description_list">
                <!-- Descriptions will be added here dynamically -->
            </datalist>
            <button id="close_button">Close</button>
        </div>
        </div>
        `;
  
    class FilterBox extends HTMLElement {
      constructor() {
        super();
        this.ids = [];
        this.desc = [];
        this.init();
      }
  
      init() {

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        const filterButton = shadowRoot.getElementById('filter_button');

        const populateInput = () => {
            const allDescriptions = this.desc.join(', '); // Join all descriptions with a comma
            filterInput.value = allDescriptions; // Set the input value
        };

        // Add a click event listener to the "filter_button"
        filterButton.addEventListener('click', async () => {
            const childDiv = shadowRoot.querySelector('.child');
            // Call the function or perform actions when the button is clicked
            

            const dataBinding = this.dataBindings.getDataBinding('exportDataSource');
            var ds2 = await this.dataBindings.getDataBinding().getDataSource().getMembers('MDBELNR');
            console.log(ds2);

            var dimensions =  await this.dataBindings.getDataBinding().getDataSource().getDimensions();
            var dimensions_feed =  await this.dataBindings.getDataBinding().getDimensions("dimensions");
            var filteredDimensions = dimensions.filter((dimension) => {
                return dimensions_feed.includes(dimension.id);
              });
            // var members = ArrayUtils.create(Type.MemberInfo);
            // var value = InputField_1.getValue();
            
            var temp;
            var members;
            for (var i = 0; i < filteredDimensions.length; i++) {
                members =  await this.dataBindings.getDataBinding().getDataSource().getMembers(filteredDimensions[i], {limit: 1000000});
                for (var j = 0; j < members.length; j++) {
                    temp = filteredDimensions[i].id + ":" + members[j].id;
                    this.ids.push(temp);
                    temp = filteredDimensions[i].description + ":" + members[j].description;
                    this.desc.push(temp);
                    
                }
            }

            if (childDiv.style.display === 'none' || childDiv.style.display === '') {
                childDiv.style.display = 'flex';
                populateInput();
            } else {
                childDiv.style.display = 'none';
            }

            const filterInput = shadowRoot.getElementById('filter_input');
            const descriptionList = shadowRoot.getElementById('description_list');

            filterInput.addEventListener('input', () => {
                const userInput = filterInput.value.toLowerCase(); // Get user input (convert to lowercase for case-insensitive filtering)
                
                // Clear the existing options in the datalist
                descriptionList.innerHTML = '';
                
                // Filter the descriptions based on user input
                const filteredDescriptions = this.desc.filter((description) =>
                    description.toLowerCase().includes(userInput)
                );
                
                // Add filtered descriptions to the datalist
                filteredDescriptions.forEach((filteredDescription) => {
                    const option = document.createElement('option');
                    option.value = filteredDescription;
                    descriptionList.appendChild(option);
                });
            });



            
            // console.log("IDS");
            // console.log(ids);
            // console.log("DESCRIPTION");
            // console.log(desc);
            // console.log("done");



        });

      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', FilterBox);
  })();

