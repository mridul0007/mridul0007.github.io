

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
                    stylers: [{ visibility: 'off' }],
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
            var berlinDataPoints = [
              
                { lat: 52.5300, lng: 13.4150 },
                { lat: 52.5400, lng: 13.4250 },
                { lat: 52.5500, lng: 13.4350 },
                { lat: 52.5600, lng: 13.4450 },
                { lat: 52.5700, lng: 13.4550 },
                { lat: 52.5800, lng: 13.4650 },
                { lat: 52.5900, lng: 13.4750 },
                { lat: 52.6000, lng: 13.4850 },
                { lat: 52.6100, lng: 13.4950 },
                { lat: 52.6200, lng: 13.5050 },
                { lat: 52.6300, lng: 13.5150 },
                { lat: 52.6400, lng: 13.5250 },
                { lat: 52.6500, lng: 13.5350 },
                { lat: 52.6600, lng: 13.5450 },
                { lat: 52.6700, lng: 13.5550 },
                { lat: 52.6800, lng: 13.5650 },
                { lat: 52.6900, lng: 13.5750 },
                { lat: 52.7000, lng: 13.5850 },
                { lat: 52.7100, lng: 13.5950 },
                { lat: 52.7200, lng: 13.6050 },
                { lat: 52.7300, lng: 13.6150 },
                { lat: 52.7400, lng: 13.6250 },
                { lat: 52.7500, lng: 13.6350 },
                { lat: 52.7600, lng: 13.6450 },
                { lat: 52.7700, lng: 13.6550 },
                { lat: 52.7800, lng: 13.6650 },
                { lat: 52.7900, lng: 13.6750 },
                { lat: 52.8000, lng: 13.6850 },
                { lat: 53.0100, lng: 13.8950 },
                { lat: 53.0200, lng: 13.9050 },
                { lat: 53.0300, lng: 13.9150 },
                { lat: 53.0400, lng: 13.9250 },
                { lat: 53.0500, lng: 13.9350 },
                { lat: 53.0600, lng: 13.9450 },
                { lat: 53.0700, lng: 13.9550 },
                { lat: 53.0800, lng: 13.9650 },
                { lat: 53.0900, lng: 13.9750 },
                { lat: 53.1000, lng: 13.9850 },
                { lat: 53.1100, lng: 13.9950 },
                { lat: 53.1200, lng: 14.0050 },
                { lat: 53.1300, lng: 14.0150 },
                { lat: 53.1400, lng: 14.0250 },
                { lat: 53.1500, lng: 14.0350 },
                { lat: 53.1600, lng: 14.0450 },
                { lat: 53.1700, lng: 14.0550 },
                { lat: 53.1800, lng: 14.0650 },
                { lat: 53.1900, lng: 14.0750 },
                { lat: 53.2000, lng: 14.0850 },
                { lat: 53.2100, lng: 14.0950 },
                { lat: 53.2200, lng: 14.1050 },
                { lat: 53.2300, lng: 14.1150 },
                { lat: 53.2400, lng: 14.1250 },
                { lat: 53.2500, lng: 14.1350 },
                { lat: 53.2600, lng: 14.1450 },
                { lat: 53.2700, lng: 14.1550 },
                { lat: 53.2800, lng: 14.1650 },
                { lat: 53.2900, lng: 14.1750 },
                { lat: 53.3000, lng: 14.1850 },
                { lat: 53.3100, lng: 14.1950 },
                { lat: 53.3200, lng: 14.2050 },
                { lat: 53.3300, lng: 14.2150 },
                { lat: 53.3400, lng: 14.2250 },
                { lat: 53.3500, lng: 14.2350 },
                { lat: 53.7300, lng: 14.6150 }];
               

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < berlinDataPoints.length; i++) {
                var lat_m = berlinDataPoints[i].lat;
                var lng_m = berlinDataPoints[i].lng;
                var marker = new google.maps.Marker({
                    position: { lat: lat_m, lng: lng_m },
                    title: "City " + i,
                });

                // // Push the marker to the array
                markers.push(marker);
                // bounds.extend(marker.getPosition());
            }

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
                var markerCluster = new markerClusterer.MarkerClusterer({ markers, map, gridSize: 40,viewportPadding : 50 });
                // Calculate the bounds of all markers
                var bounds = new google.maps.LatLngBounds();
                markers.forEach((marker) => {
                    bounds.extend(marker.getPosition());
                });

                // Set the map center and zoom to fit all markers
                map.fitBounds(bounds);

                google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
                    // Get all markers in the clicked cluster
                    var markersInCluster = cluster.getMarkers();
                
                    // Calculate the bounds of all markers in the cluster
                    var clusterBounds = new google.maps.LatLngBounds();
                    markersInCluster.forEach((marker) => {
                        clusterBounds.extend(marker.getPosition());
                    });
                
                    // Adjust the map bounds to fit all markers in the cluster
                    map.fitBounds(clusterBounds);
                    map.setZoom(map.getZoom() - 1);
                })
                

                // Add a click event listener to zoom in and display individual markers
                markers.forEach((marker) => {
                    marker.addListener('click', () => {
                        // Get the bounds of the clicked marker
                        console.log('Marker Clicked:', marker);
                        var markerBounds = new google.maps.LatLngBounds();
                        console.log('Marker Bounds:', markerBounds);
                        markerBounds.extend(marker.getPosition());
                        console.log('Marker Bounds extend:', markerBounds);

                        // Get the bounds of the cluster
                        var clusterBounds = markerCluster.getBounds();

                        // Extend the bounds of the clicked marker with the cluster bounds
                        markerBounds.union(clusterBounds);
                        console.log('Marker Bounds union:', markerBounds);

                        // Fit the map to the extended bounds
                        map.fitBounds(markerBounds);

                        // Set a suitable zoom level (adjust as needed)
                        map.setZoom(map.getZoom() - 1);
                    });
                });
            };
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();



