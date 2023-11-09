
(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
        #loading_overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 9999;
            allign-items: center;
            justify-content: center;
          }
      
          #loading_spinner {
           
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 4px solid white;
            border-top: 4px solid transparent;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
          }
      
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg);}
            100% { transform: translate(-50%, -50%) rotate(360deg);}
          }
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
        <div class="child">
            <input type="text" id="filter_input" list="description_list">
            <datalist id="description_list">
                <!-- Descriptions will be added here dynamically -->
            </datalist>
            <button id="filter_button">Filter</button>
        </div>
        </div>
        <div id="loading_overlay">
        <div id="loading_spinner"></div>
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

            // const searchButton = shadowRoot.getElementById('search_button');
            const filterInput = shadowRoot.getElementById('filter_input');
            var descriptionList = shadowRoot.getElementById('description_list');
            const filterButton = shadowRoot.getElementById('filter_button');
           


            filterButton.addEventListener('click', async () => {
                const filterInput = shadowRoot.getElementById('filter_input');
                const index = this.desc.findIndex((element) => element === filterInput.value);

                    if (index !== -1) {
                        var temp = this.ids[index];
                        const parts = temp.split(':');
                        this.p_dimension_id = parts[0]
                        this.p_member_id = parts[1]
                        this.dispatchEvent(new CustomEvent("onFilterSelect"));
                    } else {
                    console.log(`The value ${valueToFind} is not found in the array.`);
                    
                    }
                console.log(filterInput.value);
                console.log(temp);


            })

            

            // Add an input event listener to the filter input
            filterInput.addEventListener('input', () => {
                const userInput = filterInput.value.toLowerCase();

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

                descriptionList.addEventListener('change', (event) => {
                    const selectedValue = event.target.value;
                    filterInput.value = selectedValue; // Set the input value to the selected option
                    descriptionList.innerHTML = ''; // Close the dropdown after selecting
                    this.fireChanged(selectedValue); // Trigger your custom event or function here for the selected value
                });
                
            });

            filterInput.addEventListener('change', () => {
                descriptionList.innerHTML = ''; // Close the dropdown after selecting
                this.fireChanged(selectedValue); 
                const filterInput = shadowRoot.getElementById('filter_input');
                const index = this.desc.findIndex((element) => element === filterInput.value);

                    if (index !== -1) {
                        var temp = this.ids[index];
                        const parts = temp.split(':');
                        this.p_dimension_id = parts[0]
                        this.p_member_id = parts[1]
                        this.dispatchEvent(new CustomEvent("onFilterSelect"));
                    } else {
                    console.log(`The value ${valueToFind} is not found in the array.`);
                    
                    }
                console.log(filterInput.value);
                console.log(temp);

            });




        }


        fireChanged(selectedValue) {
            console.log('Filter Value Selected:', selectedValue);
            // You can implement your custom event handling here
        }


        set_p_member_id(mem_id) {
            this.p_member_id = mem_id;
          }
        
          get_p_member_id() {
            return this.p_member_id;
          }

        set_p_dimension_id(dim_id) {
        this.p_dimension_id = dim_id;
        }
    
        get_p_dimension_id() {
        return this.p_dimension_id;
        }

        async start_Binding(){
            var loadingOverlad = this.shadowRoot.getElementById('loading_overlay');
            loadingOverlad.style.display = "block";
                const childDiv = this.shadowRoot.querySelector('.child');
                
                const dataBinding = this.dataBindings.getDataBinding('exportDataSource');
                var ds2 = await this.dataBindings.getDataBinding().getDataSource().getMembers('MDBELNR');
                console.log(ds2);

                var dimensions =  await this.dataBindings.getDataBinding().getDataSource().getDimensions();
                var dimensions_feed =  await this.dataBindings.getDataBinding().getDimensions("dimensions");
                var filteredDimensions = dimensions.filter((dimension) => {
                    return dimensions_feed.includes(dimension.id);
                });

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

                var descriptionList = this.shadowRoot.getElementById('description_list');
                // Clear the existing options in the datalist
                descriptionList.innerHTML = '';

                // Add all descriptions to the datalist
                this.desc.forEach((description) => {
                    const option = document.createElement('option');
                    option.value = description;
                    descriptionList.appendChild(option);
                });
                loadingOverlad.style.display = "none";
                if (childDiv.style.display === 'none' || childDiv.style.display === '') {
                    childDiv.style.display = 'flex';
                } else {
                    childDiv.style.display = 'none';
                }

        }
    }   

    // Define your custom element
    customElements.define('custom-button', FilterBox);
})();
