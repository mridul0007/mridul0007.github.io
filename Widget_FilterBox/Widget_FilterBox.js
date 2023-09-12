(function () {
    // Define the HTML template for your custom element
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <button id="filter_button">Filter</button>
    <div class="child">
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
        const dataBinding = this.dataBindings.getDataBinding('exportDataSource');
        var ds2 = await this.dataBindings.getDataBinding().getDataSource().getMembers('MDBELNR');
        console.log(ds2);


        });

      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    // Define your custom element
    customElements.define('custom-button', FilterBox);
  })();