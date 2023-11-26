(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 800px; /* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
    
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

        async set_api_key(apiKey) {
            this.apiKey = apiKey;
            await this.loadGoogleMapsScript();
        }

        loadGoogleMapsScript() {
            return new Promise((resolve, reject) => {
                const mapsScript = document.createElement('script');
                mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
                mapsScript.defer = true;
                mapsScript.async = true;
                mapsScript.onload = () => {
                    // Once the Google Maps API script is loaded, load the Marker Cluster library
                    const clusterScript = document.createElement('script');
                    clusterScript.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
                    clusterScript.defer = true;
                    clusterScript.async = true;
                    clusterScript.onload = resolve;
                    clusterScript.onerror = reject;
                    document.head.appendChild(clusterScript);
                };
                mapsScript.onerror = reject;
                document.head.appendChild(mapsScript);
            });
        }

        renderMap() {
            // Get the map container element
            const mapContainer = this.shadowRoot.getElementById('map-container');

            // Use the Google Maps API to create a map
            const map = new google.maps.Map(mapContainer, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });

            // Now you can use the Marker Cluster library
            const markerCluster = new MarkerClusterer(map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

            // Add markers or any other map functionality as needed
        }
    }

    customElements.define('google-maps', GoogleMaps);
})();
