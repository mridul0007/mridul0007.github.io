(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <style>
     :host {
      display: block;
      margin-left: 0.5rem; /* Margin applied to the widget itself */
      margin-top: 0.5rem;
    }
      /* General styling for the widget */
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two columns */
        grid-template-rows: repeat(2, 200px); /* Two rows */
        gap: 10px; /* Spacing between boxes */
        width: 100%;
        max-width: 600px;
        margin-left: 1rem;
        
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
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }

      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }

      th {
        background-color: #f4f4f4;
        font-weight: bold;
      }

      tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      a {
        color: blue;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    </style>
    <div class="container">
      <div class="box"><img id="img1" src="" alt="Box 1"></div>
      <div class="box"><img id="img2" src="" alt="Box 2"></div>
      <div class="box"><img id="img3" src="" alt="Box 3"></div>
      <div class="box"><img id="img4" src="" alt="Box 4"></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>CLUB</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody id="table-body">
        <!-- Rows will be dynamically added here -->
      </tbody>
    </table>
  `;

  class Photowidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Attach shadow DOM
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true)); // Append template to shadow DOM
      this.tableBody = this.shadowRoot.getElementById('table-body');
      this.images = [
        this.shadowRoot.getElementById('img1'),
        this.shadowRoot.getElementById('img2'),
        this.shadowRoot.getElementById('img3'),
        this.shadowRoot.getElementById('img4')
      ];

      // Map club names to images
      this.clubImageMap = {
        'Manchester United': [
          'https://media.gettyimages.com/id/1917992001/photo/wigan-england-bruno-fernandes-of-manchester-united-is-congratulated-by-teammates-after.jpg?s=612x612&w=gi&k=20&c=CfFgd-Xv8QID8icBDESPJx7MbPhsoIbwZvv6S7RA04A=',
          'https://via.placeholder.com/200?text=ManU+2',
          'https://via.placeholder.com/200?text=ManU+3',
          'https://via.placeholder.com/200?text=ManU+4'
        ],
        'FC Barcelona': [
          'https://media.gettyimages.com/id/1917992001/photo/wigan-england-bruno-fernandes-of-manchester-united-is-congratulated-by-teammates-after.jpg?s=612x612&w=gi&k=20&c=CfFgd-Xv8QID8icBDESPJx7MbPhsoIbwZvv6S7RA04A=',
          'https://via.placeholder.com/200?text=Barca+2',
          'https://via.placeholder.com/200?text=Barca+3',
          'https://via.placeholder.com/200?text=Barca+4'
        ],
        'Real Madrid': [
          'https://via.placeholder.com/200?text=Real+1',
          'https://via.placeholder.com/200?text=Real+2',
          'https://via.placeholder.com/200?text=Real+3',
          'https://via.placeholder.com/200?text=Real+4'
        ],
        'Bayern Munich': [
          'https://via.placeholder.com/200?text=Bayern+1',
          'https://via.placeholder.com/200?text=Bayern+2',
          'https://via.placeholder.com/200?text=Bayern+3',
          'https://via.placeholder.com/200?text=Bayern+4'
        ]
      };
      this.populateTable();
      
    }

    // Custom initialization method (optional)
    init() {
      console.log('Photo Widget Initialized');
    }

    // Example event handler
    fireChanged() {
      console.log('OnClick Triggered  lll');
    }

    populateTable() {

      const clubData = [
        { club: 'Manchester United', url: 'https://www.manutd.com' },
        { club: 'FC Barcelona', url: 'https://www.fcbarcelona.com' },
        { club: 'Real Madrid', url: 'https://www.realmadrid.com' },
        { club: 'Bayern Munich', url: 'https://www.fcbayern.com' },
        { club: 'Chelsea FC', url: 'https://www.chelseafc.com' }
      ];
      // Clear existing rows
      this.tableBody.innerHTML = '';

      // Check if data is valid
      if (!Array.isArray(clubData)) {
        console.error('Data should be an array of objects with club and url keys.');
        return;
      }

      // Populate rows
      clubData.forEach(item => {
        const row = document.createElement('tr');

        // Club column
        const clubCell = document.createElement('td');
        clubCell.textContent = item.club || 'N/A';
        row.appendChild(clubCell);

        // URL column
        const urlCell = document.createElement('td');
        const urlLink = document.createElement('a');
        urlLink.href = item.url || '#';
        urlLink.textContent = item.url || 'N/A';
        urlLink.target = '_blank';
        urlCell.appendChild(urlLink);
        row.appendChild(urlCell);
        row.addEventListener('click', () => this.updateImages(item.club));

        // Add row to table
        this.tableBody.appendChild(row);
      });
    }
    updateImages(clubName) {
      const images = this.clubImageMap[clubName];
      if (images) {
        this.images.forEach((imgElement, index) => {
          imgElement.src = images[index] || '';
          imgElement.alt = `${clubName} Image ${index + 1}`;
        });
      } else {
        console.warn('No images found for club:', clubName);
      }
    }
  }
  
  

  // Define your custom element
  customElements.define('custom-button', Photowidget);
})();
