// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `
//         <style>
//             #map-container {
//                 height: 800px; /* Adjust the height as needed */
//                 width: 100%; /* Adjust the width as needed */
//             }
//         </style>
    
//         <div id="map-container"></div>
//     `;

//     class GoogleMaps extends HTMLElement {
//         constructor() {
//             super();
//             this.init();
//         }

//         init() {
//             this.attachShadow({ mode: 'open' });
//             this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
//         }

//         async set_api_key(api_key) {
//             // Load the Google Maps JavaScript API with the provided key
//             var script = document.createElement('script');
//             script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`;
//             script.async = true;
//             script.defer = true;
//             script.onerror = () => console.error('Error loading Google Maps API');

//             // Attach the script to the document
//             document.head.appendChild(script);

//             // Define the callback function (initMap) that will be called when the API is loaded
//             window.initMap = () => {
//                 this.renderMap();
//             };
//         }
          
//         renderMap() {
//             // Get the map container element
//             var mapContainer = this.shadowRoot.querySelector('#map-container');

//             var mapStyles = [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'off' }],
//                 },
//             ];
        
//             // Adjust latitude and longitude range based on the map container size
//             var containerHeight = mapContainer.clientHeight;
//             var containerWidth = mapContainer.clientWidth;
//             var latRange = containerHeight / 111; // Approximate degrees per pixel for latitude
//             var lngRange = containerWidth / (111 * Math.cos((51.5078 * Math.PI) / 180)); // Approximate degrees per pixel for longitude
        
//             // Create a new map centered at a specific location
//             var map = new google.maps.Map(mapContainer, {
//                 center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
//                 zoom: 3, // Set the initial zoom level
//                 disableDefaultUI: false, // Disable default UI elements
//                 styles: mapStyles, // Apply custom map styles
//             });
        
//             // Create an array to hold individual markers
//             var markers = [];
        
//             // Add 150 markers with random positions
//             for (var i = 0; i < 150; i++) {
//                 var randomLat = 51.5078 - latRange / 2 + Math.random() * latRange; // Adjust latitude range based on container size
//                 var randomLng = 9.5790 - lngRange / 2 + Math.random() * lngRange; // Adjust longitude range based on container size
        
//                 var marker = new google.maps.Marker({
//                     position: { lat: randomLat, lng: randomLng },
//                     title: "City " + i,
//                 });
        
//                 // Push the marker to the array
//                 markers.push(marker);
//             }
        
//             // Import the MarkerClusterer library
//             var script = document.createElement('script');
//             script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
//             document.head.appendChild(script);
        
//             // Wait for the MarkerClusterer library to load before creating the cluster
//             script.onload = () => {
//                 // Create a MarkerClusterer object. The markers will be clustered at different zoom levels.
//                 var markerCluster = new MarkerClusterer(map, markers, {
//                     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
//                 });
        
//                 // Create a LatLngBounds object to encompass all markers
//                 var bounds = new google.maps.LatLngBounds();
//                 markers.forEach(marker => {
//                     bounds.extend(marker.getPosition());
//                 });
        
//                 // Fit the map to the bounds
//                 map.fitBounds(bounds);
        
//                 // Add a click event listener to zoom in and display individual markers
//                 markers.forEach((marker) => {
//                     marker.addListener('click', () => {
//                         // Zoom in
//                         map.setZoom(12);
        
//                         // Delay the centering operation to ensure it happens after the zoom
//                         setTimeout(() => {
//                             // Center map on the clicked marker
//                             map.setCenter(marker.getPosition());
//                         }, 100); // Adjust the delay as needed
//                     });
//                 });
        
//                 // Add a click event listener to zoom out and display clustered markers
//                 map.addListener('zoom_changed', () => {
//                     var currentZoom = map.getZoom();
        
//                     // If the zoom level is greater than a threshold, show individual markers
//                     if (currentZoom > 10) {
//                         markerCluster.clearMarkers();
//                     } else {
//                         markerCluster.addMarkers(markers);
//                     }
//                 });
//             };
//         }
        
//     }

//     customElements.define('custom-button', GoogleMaps);
// })();


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
            return new Promise((resolve, reject) => {
                // Define the callback function (initMap) that will be called when the API is loaded
                window.initMap = () => {
                    // Resolve the promise when the map is ready
                    resolve();
                };
        
                // Load the Google Maps JavaScript API with the provided key
                var script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onerror = () => {
                    console.error('Error loading Google Maps API');
                    reject('Error loading Google Maps API');
                };
        
                // Attach the script to the document
                document.head.appendChild(script);
            }).then(() => {
                // Call renderMap to initialize the map
                this.renderMap();
            });
        }
        

        async renderMap() {
            // Wait for the Google Maps API to be loaded
            await this.set_api_key('YOUR_API_KEY'); // Replace with your actual API key

            // Get the map container element
            var mapContainer = this.shadowRoot.querySelector('#map-container');

            // Adjust latitude and longitude range based on the map container size
            var containerHeight = mapContainer.clientHeight;
            var containerWidth = mapContainer.clientWidth;
            var latRange = containerHeight / 111; // Approximate degrees per pixel for latitude
            var lngRange = containerWidth / (111 * Math.cos((51.5078 * Math.PI) / 180)); // Approximate degrees per pixel for longitude

            // Create a new map centered at a specific location
            var map = new google.maps.Map(mapContainer, {
                center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
                zoom: 3, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });

            // Create an array to hold individual markers
            var markers = [];

            // Add 150 markers with random positions
            for (var i = 0; i < 150; i++) {
                var randomLat = 51.5078 - latRange / 2 + Math.random() * latRange; // Adjust latitude range based on container size
                var randomLng = 9.5790 - lngRange / 2 + Math.random() * lngRange; // Adjust longitude range based on container size

                var marker = new google.maps.Marker({
                    position: { lat: randomLat, lng: randomLng },
                    title: "City " + i,
                });

                // Push the marker to the array
                markers.push(marker);
            }

            // Import the MarkerClusterer library
            var script = document.createElement('script');
            script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
            document.head.appendChild(script);

            // Wait for the MarkerClusterer library to load before creating the cluster
            script.onload = () => {
                // Create a MarkerClusterer object. The markers will be clustered at different zoom levels.
                var markerCluster = new MarkerClusterer(map, markers, {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                });

                // Create a LatLngBounds object to encompass all markers
                var bounds = new google.maps.LatLngBounds();
                markers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                });

                // Fit the map to the bounds
                map.fitBounds(bounds);

                // Add a click event listener to zoom in and display individual markers
                markers.forEach((marker) => {
                    marker.addListener('click', () => {
                        // Calculate the new zoom level
                        var newZoom = calculateZoomLevel(map, map.getBounds(), marker);

                        // Set the new zoom level
                        map.setZoom(newZoom);

                        // Center map on the clicked marker
                        map.setCenter(marker.getPosition());
                    });
                });

                // Add a click event listener to zoom out and display clustered markers
                map.addListener('zoom_changed', () => {
                    var currentZoom = map.getZoom();

                    // If the zoom level is greater than a threshold, show individual markers
                    if (currentZoom > 10) {
                        markerCluster.clearMarkers();
                    } else {
                        markerCluster.addMarkers(markers);
                    }
                });
            };

            // Function to calculate the zoom level based on marker and bounds
            function calculateZoomLevel(map, bounds, marker) {
                var maxZoom = 18; // You can adjust the maximum zoom level as needed
                var desiredPixelSize = 150; // Adjust the desired pixel size of the marker on the map

                // Get the pixel position of the marker
                var markerPixel = map.getProjection().fromLatLngToPoint(marker.getPosition());

                // Get the pixel position of the top-left and bottom-right corners of the bounds
                var swPixel = map.getProjection().fromLatLngToPoint(bounds.getSouthWest());
                var nePixel = map.getProjection().fromLatLngToPoint(bounds.getNorthEast());

                // Calculate the current pixel size of the bounds
                var currentPixelSize = Math.abs(nePixel.x - swPixel.x);

                // Calculate the target pixel size based on the desired pixel size
                var targetPixelSize = currentPixelSize * (desiredPixelSize / map.getDiv().offsetWidth);

                // Calculate the zoom level based on the ratio of the target and current pixel sizes
                var zoom = Math.min(maxZoom, map.getZoom() + Math.log2(targetPixelSize / currentPixelSize));

                return zoom;
            }
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();
