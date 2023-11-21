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
        varructor() {
            super();
            this.init();
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }

        async set_api_key(api_key) {
            
            // Load the Google Maps JavaScript API with the provided key
            var script = document.createElement('script');
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
            var mapContainer = this.shadowRoot.querySelector('#map-container');
        
            // Customize the map style to hide points of interest
            var mapStyles = [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                },
            ];
        
            // Create a new map centered at a specific location
            var map = new google.maps.Map(mapContainer, {
                center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
                zoom: 6, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });
        
            var cityData = [
                {
                  name: "Berlin",
                  lat: 52.5200,
                  lng: 13.4051,
                  additionalMarkers: [
                    { name: "Brandenburg Gate", lat: 52.5164, lng: 13.3777 },
                    { name: "Reichstag Building", lat: 52.5169, lng: 13.3809 },
                  ],
                },
                {
                  name: "Hamburg",
                  lat: 53.5503,
                  lng: 10.0006,
                  additionalMarkers: [
                    { name: "Miniatur Wunderland", lat: 53.5496, lng: 9.9953 },
                    { name: "Elbphilharmonie Hamburg", lat: 53.5461, lng: 9.9994 },
                  ],
                },
                {
                  name: "Munich",
                  lat: 48.1351,
                  lng: 11.5731,
                  additionalMarkers: [
                    { name: "Hofbräuhaus München", lat: 48.1372, lng: 11.5759 },
                    { name: "Deutsches Museum", lat: 48.1494, lng: 11.5705 },
                  ],
                },
                {
                  name: "Cologne",
                  lat: 50.9334,
                  lng: 6.9599,
                  additionalMarkers: [
                    { name: "Kölner Dom", lat: 50.9417, lng: 6.9589 },
                    { name: "Schokoladenmuseum", lat: 50.9378, lng: 6.9548 },
                  ],
                },
                {
                  name: "Frankfurt",
                  lat: 50.1156, lng: 8.6823,
                  additionalMarkers: [
                    { name: "Römer", lat: 50.1157, lng: 8.6792 },
                    { name: "Senckenberg Museum", lat: 50.1127, lng: 8.6753 },
                  ],
                },
              ];
        
              for (var city of cityData) {
                var marker = new google.maps.Marker({
                    position: { lat: city.lat, lng: city.lng },
                    map: map,
                    title: city.name,
                });

                // Add a click event listener to zoom in and display additional markers
                marker.addListener('click', () => {
                    var bounds = new google.maps.LatLngBounds();

                    // Extend bounds with the city marker
                    bounds.extend({ lat: city.lat, lng: city.lng });

                    // Add additional markers for the clicked city
                    for (var additionalMarkerData of city.additionalMarkers) {
                        var additionalMarkerPosition = { lat: additionalMarkerData.lat, lng: additionalMarkerData.lng };
                        var additionalMarkerContent = additionalMarkerData.name;

                        var additionalMarker = new google.maps.Marker({
                            position: additionalMarkerPosition,
                            map: map,
                            title: additionalMarkerContent,
                        });

                        bounds.extend(additionalMarkerPosition); // Extend bounds with additional markers
                    }

                    // Fit the map to the bounds
                    map.fitBounds(bounds);
                    map.setCenter(bounds.getCenter());

                    // Set a reasonable zoom level to maintain interactivity
                    var listener = google.maps.event.addListener(map, 'idle', () => {
                        if (map.getZoom() > 12) map.setZoom(12);
                        google.maps.event.removeListener(listener);
                        map.setCenter(bounds.getCenter());
                    });
                });
            }
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();