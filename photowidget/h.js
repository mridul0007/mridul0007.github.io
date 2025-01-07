(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
<style>
  :host {
    display: block;
    margin-left: 0.5rem;
    margin-top: 0.5rem;
  }

  .layout {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 200px);
    gap: 10px;
    width: 100%;
    max-width: 600px;
  }

  .box {
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
    width: 200px; /* Fixed width */
    height: 200px; /* Fixed height to maintain square aspect ratio */
  }

  .box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .box img:hover {
    transform: scale(1.1);
  }

  .navigation-buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 8px;
  }

  .nav-button {
    padding: 8px 16px;
    font-size: 18px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .nav-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    max-width: 200px;
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
<div class="layout">
  <div class="photo-section">
    <div class="container">
      <div class="box"><img id="img1" src="" alt="Box 1"></div>
      <div class="box"><img id="img2" src="" alt="Box 2"></div>
      <div class="box"><img id="img3" src="" alt="Box 3"></div>
      <div class="box"><img id="img4" src="" alt="Box 4"></div>
    </div>
    <div class="navigation-buttons">
      <button class="nav-button" id="prev-btn" disabled><</button>
      <button class="nav-button" id="next-btn" disabled>></button>
    </div>
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
</div>
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
      this.prevButton = this.shadowRoot.getElementById('prev-btn');
      this.nextButton = this.shadowRoot.getElementById('next-btn');

      // Map club names to images
      this.clubImageMap = {
        'Manchester United': [
          'https://media.gettyimages.com/id/1917992001/photo/wigan-england-bruno-fernandes-of-manchester-united-is-congratulated-by-teammates-after.jpg?s=612x612&w=gi&k=20&c=CfFgd-Xv8QID8icBDESPJx7MbPhsoIbwZvv6S7RA04A=',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeJQyDiBmouEtZ3czWEddEziz2RxKIWBfFVg&s',
          'https://assets.goal.com/images/v3/bltc044f74b72e40288/656fedc92073b5c79fcb807686fbc40ac54f2fdb.png?auto=webp&format=pjpg&width=3840&quality=60',
          'https://library.sportingnews.com/styles/twitter_card_120x120/s3/2022-04/Manchester%20United%20crest%20Champions%20League%20trophy%20split%20041922.png?itok=95wJoNCH',
          'https://media.gettyimages.com/id/1917992001/photo/wigan-england-bruno-fernandes-of-manchester-united-is-congratulated-by-teammates-after.jpg?s=612x612&w=gi&k=20&c=CfFgd-Xv8QID8icBDESPJx7MbPhsoIbwZvv6S7RA04A=',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeJQyDiBmouEtZ3czWEddEziz2RxKIWBfFVg&s'
        ],
        'FC Barcelona': [
          'https://rukminim2.flixcart.com/image/850/1000/l0e6kcw0/poster/a/m/a/medium-fc-barcelona-logo-on-fine-art-paper-hd-quality-wallpaper-original-imagc6xxqrgzmxv3.jpeg?q=20&crop=false',
          'https://www.fcbarcelona.com/fcbarcelona/photo/2019/03/12/304ae4e8-6c40-4e91-a01f-b9c85767bf10/uAnwfqJX.jpg',
          'https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg)/origin-imgresizer.eurosport.com/2021/11/02/3247572-66468708-2560-1440.jpg',
          'https://www.aljazeera.com/wp-content/uploads/2023/06/2023-06-03T161801Z_431956431_UP1EJ63199ZLD_RTRMADP_3_SOCCER-CHAMPIONS-FCB-WOB-PREVIEW-1685809233.jpg?resize=1800%2C1800',
          'https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg)/origin-imgresizer.eurosport.com/2021/11/02/3247572-66468708-2560-1440.jpg',
          'https://www.aljazeera.com/wp-content/uploads/2023/06/2023-06-03T161801Z_431956431_UP1EJ63199ZLD_RTRMADP_3_SOCCER-CHAMPIONS-FCB-WOB-PREVIEW-1685809233.jpg?resize=1800%2C1800'
        ],
        'Real Madrid': [
          'https://www.reddit.com/media?url=https%3A%2F%2Fexternal-preview.redd.it%2Freal-madrid-cf-web-oficial-del-real-madrid-cf-mbappe-v0-4Zi0mI0v73EJmHIlWbfMqlHxLRsIoY-o32oej3ZXmgY.jpg%3Fauto%3Dwebp%26s%3D73e630760a37a9a29df097ed72732b337018928f',
          'https://realsoccerclub.org/wp-content/uploads/2022/05/avc8199_thumb-real-madrid-campeones-de-europa-14-veces-levantan-el-trofeo.jpg',
          'https://cdn.britannica.com/94/204494-050-39C19F9E/crisiano-ronaldo-in-action-at-the-spanish-cup-match-between-fc-barcelona-and-real-madrid-2012.jpg',
          'https://www.shutterstock.com/image-photo/barcelona-apr-5-real-madrid-260nw-2420517127.jpg'
        ],
        'Bayern Munich': [
          'https://i.scdn.co/image/ab67616d0000b2732ac525d334b13a4be87f40f6',
          'https://img.fcbayern.com/image/upload/f_auto/q_auto/ar_2:1,c_fill,g_custom,w_1280/v1/cms/public/images/fcbayern-com/homepage/club/erfolge/champions-league/2020_header.jpg',
          'https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg)/origin-imgresizer.eurosport.com/2021/11/02/3247575-66468768-2560-1440.jpg',
          'https://www.getfootballnewsgermany.com/assets/arsenal-fc-v-fc-bayern-munchen-quarter-final-first-leg-uefa-champions-league-2023-24-scaled.jpg'
        ]
      };
      this.currentClub = null;
      this.currentIndex = 0;
      this.populateTable();
      this.addEventListeners();

      
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
        { club: 'Bayern Munich', url: 'https://www.fcbayern.com' }
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
    addEventListeners() {
      this.prevButton.addEventListener('click', () => {
        if (this.currentClub) {
          this.currentIndex = Math.max(this.currentIndex - 4, 0);
          this.renderImages();
        }
      });

      this.nextButton.addEventListener('click', () => {
        if (this.currentClub) {
          const images = this.clubImageMap[this.currentClub];
          this.currentIndex = Math.min(this.currentIndex + 4, images.length - 4);
          this.renderImages();
        }
      });
    }

     updateImages(clubName) {
      this.currentClub = clubName;
      this.currentIndex = 0;
      this.renderImages();
    }

    renderImages() {
      const images = this.clubImageMap[this.currentClub];
      if (images) {
        this.images.forEach((imgElement, index) => {
          const imgIndex = this.currentIndex + index;
          imgElement.src = images[imgIndex] || '';
          imgElement.alt = `${this.currentClub} Image ${imgIndex + 1}`;
        });

        // Enable/disable navigation buttons
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex + 4 >= images.length;
      }
    }
  }

  

  // Define your custom element
  customElements.define('custom-button', Photowidget);
})();
