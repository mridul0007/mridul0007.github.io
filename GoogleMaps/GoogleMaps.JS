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

        async set_api_key(api_key) {
            
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
              center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
              zoom: 6 // Set the initial zoom level
            });
            const cityData = [
                { name: "Berlin", lat: 52.5200, lng: 13.4051 },
                { name: "Hamburg", lat: 53.5503, lng: 10.0006 },
                { name: "Munich", lat: 48.1351, lng: 11.5731 },
                { name: "Cologne", lat: 50.9334, lng: 6.9599 },
                { name: "Frankfurt", lat: 50.1156, lng: 8.6823 },
              ];
          
            // Add markers for each city
            for (const city of cityData) {
              const marker = new google.maps.Marker({
                position: { lat: city.lat, lng: city.lng },
                map: map,
                title: city.name,
              });
          
              // Add a click event listener to display a popup with the city name
              marker.addListener('click', () => {
                const popup = new google.maps.InfoWindow({
                  content: city.name,
                });
                popup.open(map, marker);
              });
            }
          }
    }

    customElements.define('custom-button', GoogleMaps);
})();
