

(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 100%;/* Adjust the height as needed */
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

            var mapStyles = [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                    
                },
            ];

            // Create a new map centered at a specific location
            var map = new google.maps.Map(mapContainer, {
                center: { lat: 0, lng: 0 }, // Germany's central coordinates
                zoom: 2, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });

            // Create an array to hold individual markers
            var markers = [];



            function getRandomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }
            
            // NRW bounding box coordinates
            const nrwBounds = {
                minLat: 50.2985,
                maxLat: 51.7519,
                minLng: 5.8662,
                maxLng: 9.4324,
            };
            
            // Array to store generated points
            const nrwDataPoints = [];
            
            // Generate 1000 random latitude and longitude points inside NRW
            for (let i = 0; i < 1000; i++) {
                const lat = getRandomInRange(nrwBounds.minLat, nrwBounds.maxLat);
                const lng = getRandomInRange(nrwBounds.minLng, nrwBounds.maxLng);
                
                nrwDataPoints.push({ lat, lng });
            }
            
            // Log the generated data points
            console.log(nrwDataPoints);
            
                var iconUrls = [
                    'https://mridul0007.github.io/GoogleMaps/dog.png',
                    'https://mridul0007.github.io/GoogleMaps/cat.png',
                    // ... add more icon URLs as needed
                ];

               var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < nrwDataPoints.length; i++) {
                var lat_m = nrwDataPoints[i].lat;
                var lng_m = nrwDataPoints[i].lng;
                var iconUrl = iconUrls[i % iconUrls.length];


                

                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(lat_m), lng: parseFloat(lng_m) },
                    title: "City " + i,
                    icon : iconUrl,
                });

                // // Push the marker to the array
                markers.push(marker);
                var loc = new google.maps.LatLng(parseFloat(lat_m), parseFloat(lng_m));
                bounds.extend(loc);
                
                // bounds.extend(marker.getPosition());
            }
            map.fitBounds(bounds);
            map.panToBounds(bounds);

            // Center the map initially using all markers
            // map.fitBounds(bounds);
            // map.setZoom(6);

            // Import the MarkerClusterer library
            var script = document.createElement('script');
            script.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
            document.head.appendChild(script);

            // Wait for the MarkerClusterer library to load before creating the cluster
            script.onload = () => {
                // Create a MarkerClusterer object. The markers will be clustered at different zoom levels.
                var markerCluster = new markerClusterer.MarkerClusterer({ markers, map, gridSize: 40,viewportPadding : 50 ,
                    onClusterClickHandler: (event, cluster, map) => {
                        // Zoom in to the cluster
                        map.zoomIn();
                    
                        // Extend the cluster bounds to include all markers
                        const bounds = cluster.getBounds();
                        const paddedBounds = extendBoundsToPaddedViewport(bounds, map.getProjection(), 50);
                        map.fitBounds(paddedBounds);
                      }
                });

                // Add a click event listener to zoom in and display individual markers
                markers.forEach((marker) => {
                    marker.addListener('click', () => {
                        // Get the bounds of the clicked marker
                        console.log('Marker Clicked:', marker);
                        var markerBounds = new google.maps.LatLngBounds();
                        console.log('Marker Bounds:', markerBounds);
                        markerBounds.extend(marker.getPosition());
                    });
                });
            };
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();



