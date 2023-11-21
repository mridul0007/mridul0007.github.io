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
        
            // Customize the map style to hide points of interest
            const mapStyles = [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                },
            ];
        
            // Create a new map centered at a specific location
            const map = new google.maps.Map(mapContainer, {
                center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
                zoom: 6, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });
        
            const cityData = [
                // ... (your existing city data)
            ];
        
            // Add markers for each city
            for (const city of cityData) {
                const marker = new google.maps.Marker({
                    position: { lat: city.lat, lng: city.lng },
                    map: map,
                    title: city.name,
                });
        
                // Add a click event listener to zoom in and display additional markers
                marker.addListener('click', () => {
                    map.setZoom(12); // Zoom in to city level
                    map.setCenter({ lat: city.lat, lng: city.lng }); // Center map on city location
        
                    // Remove existing additional markers (if any)
                    map.clearOverlays();
        
                    // Add additional markers for the clicked city
                    for (const additionalMarker of city.additionalMarkers) {
                        const additionalMarkerPosition = { lat: additionalMarker.lat, lng: additionalMarker.lng };
                        const additionalMarkerContent = additionalMarker.name;
        
                        const additionalMarker = new google.maps.Marker({
                            position: additionalMarkerPosition,
                            map: map,
                            title: additionalMarkerContent,
                        });
                    }
                });
            }
        }
        
          
    }

    customElements.define('custom-button', GoogleMaps);
})();
