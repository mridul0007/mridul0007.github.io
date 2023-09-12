(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
 
    <button id="filter_button">Filter</button>
    <div class="child" >
    <label for="select_box_filter">Filter:</label>
          <select id="select_box_filter">
          </select>
    <button id="close_button">Close</button>
    </div>


    `;
  
    class FilterBox extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        const filterButton = shadowRoot.getElementById('filter_button');

        // Add a click event listener to the "filter_button"
        filterButton.addEventListener('click', async () => {
            // Call the function or perform actions when the button is clicked
            // if (childDiv.style.display === 'none') {
            //     childDiv.style.display = 'flex';
            // } else {
            //     childDiv.style.display = 'none';
            // }

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
            var ids = [];
            var desc = [];
            var temp = '';
            var members;

            for (var i = 0; i < filteredDimensions.length; i++) {
                members =  await this.dataBindings.getDataBinding().getDataSource().getMembers(filteredDimensions[i], {limit: 1000000});
                for (var j = 0; j < members.length; j++) {
                    temp = filteredDimensions[i].id + ":" + members[j].id;
                    ids.push(temp);
                    temp = filteredDimensions[i].description + ":" + members[j].description;
                    desc.push(temp);
                    
                }
            }
            console.log("IDS");
            console.log(ids);
            console.log("DESCRIPTION");
            console.log(desc);
            console.log("done");



        });

      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', FilterBox);
  })();