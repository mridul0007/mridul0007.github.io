(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
  <style>
    .scrollable-table {
      max-height: 10cm; /* Set the height you prefer */
      overflow-y: auto;
      border: 1px solid #ccc; /* Optional: Add a border around the scrollable container */
    }

    .scrollable-table table {
      width: 100%; /* Ensure the table takes up the full width */
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    
    .scrollable-table thead {
      position: sticky;
      top: 0;
      z-index: 1; /* Ensure the header stays above the scrolling rows */
      background-color: #f4f4f4; /* Match the header's background color */
    }
    img {
      max-width: 100px;
      max-height: 100px;
      object-fit: cover;
    }
  </style>

  <div class="scrollable-table">
    <table>
      <thead>
        <tr>
          <th>Framenumber</th>
          <th>Facenumber</th>
          <th>Bild</th>
          <th>Bild-Link</th>
          <th>Workflow</th>
          <th>Status</th>
          <th>Priorität</th>
          <th>Digital</th>
          <th>Region</th>
          <th>Niederlassung</th>
          <th>KNZ</th>
          <th>Ort</th>
        </tr>
      </thead>
      <tbody id="table-body">
        <!-- Rows will be dynamically added here -->
      </tbody>
    </table>
  </div>
  `;

  class TableWidget extends HTMLElement {
    constructor() {
      super();
      // Attach shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(tmpl.content.cloneNode(true));
    }

    connectedCallback() {
      console.log('Table Widget Initialized');
      this.init();
    }

    init() {
      // Example: Dynamically add rows to the table
      const tableBody = this.shadowRoot.querySelector('#table-body');
      tableBody.innerHTML = `
        <tr>
          <td>154776</td>
          <td>181748</td>
          <td><img src="https://i.scdn.co/image/ab67616d0000b2732ac525d334b13a4be87f40f6" alt="Bild"></td>
          <td><a href="https://example.com">https://example.com</a></td>
          <td>0 Bauteam</td>
          <td>Genug Standorte vor Aufbaufreigabe</td>
          <td>-</td>
          <td>Ja</td>
          <td>Südost</td>
          <td>Dresden</td>
          <td>14612000</td>
          <td>Dresden</td>
        </tr>
        <tr>
          <td>128446</td>
          <td>142352</td>
          <td><img src="https://th.bing.com/th/id/R.95a5443830e420083030546b21242395?rik=4A0VWHgfJWXqyw&pid=ImgRaw&r=0" alt="Bild"></td>
          <td><a href="https://example.com">https://example.com</a></td>
          <td>Bauteam</td>
          <td>Genug Standorte vor Aufbaufreigabe</td>
          <td>-</td>
          <td>Ja</td>
          <td>Südost</td>
          <td>Dresden</td>
          <td>14612000</td>
          <td>Dresden</td>
        </tr>
      `;
    }
  }

  // Define your custom element
  customElements.define('custom-button', TableWidget);
})();
