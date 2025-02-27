(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        #map-container {
                height: 100%;/* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
    
        <div id="map-container"></div>
    `;

    class GoogleMapsWidget extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.plm_data = {};
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }


        async set_api_key(api_key) {
            // Load the Google Maps JavaScript API with the provided key
            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap&loading=async`;
            console.log("reached Set API KEY");
            script.async = true;
            script.defer = true;
            script.onerror = () => console.error('Error loading Google Maps API');

            // Attach the script to the document
            document.head.appendChild(script);

            // Define the callback function (initMap) that will be called when the API is loaded
            window.initMap = () => {
                // this.renderMap();
            };
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            this.renderMap();
        }

        renderMap() {
            console.log("Reached rendermap")
            const startTime = new Date();
            // Get the map container element
            var mapContainer = this.shadowRoot.querySelector('#map-container');

            // Create a new map centered at a specific location
            var map = new
            google.maps.Map(mapContainer, {
              center: {lat: -34.397, lng: 150.644},
              zoom: 8,
              mapId: 'DEMO_MAP_ID'
            });
            console.log("Reached rendermap end")



        }
    }



        


    customElements.define('com-example-googlemaps', GoogleMapsWidget);
})();