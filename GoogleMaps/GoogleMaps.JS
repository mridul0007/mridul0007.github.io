(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 400px; /* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
        <button type="button" id="myBtn">Helper Button</button>
        <div id="map-container"></div>
    `;

    class GoogleMaps extends HTMLElement {
        constructor() {
            super();
            this.init();
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }

        set_api_key(api_key) {
            
            // Load the Google Maps JavaScript API with the provided key
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => console.error('Error loading Google Maps API');

            // Attach the script to the document
            document.head.appendChild(script);

            // Define the callback function (initMap) that will be called when the API is loaded
            window.initMap = () => {
                this.renderMap();
            };
        }

        renderMap() {
            // Get the map container element
            const mapContainer = this.shadowRoot.querySelector('#map-container');

            // Create a new map centered at a specific location
            const map = new google.maps.Map(mapContainer, {
                center: { lat: 0, lng: 0 }, // Set your desired initial coordinates
                zoom: 8 // Set the initial zoom level
            });

            // You can customize the map further as needed
            // For example, add markers, shapes, etc.
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();
