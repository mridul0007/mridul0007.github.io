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
        
//             // Customize the map style to hide points of interest
//             var mapStyles = [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'off' }],
//                 },
//             ];
        
//             // Create a new map centered at a specific location
//             var map = new google.maps.Map(mapContainer, {
//                 center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
//                 zoom: 3, // Set the initial zoom level
//                 disableDefaultUI: false, // Disable default UI elements
//                 styles: mapStyles, // Apply custom map styles
//             });
        
//             var cityData = [
//                 {
//                   name: "Berlin",
//                   lat: 52.5200,
//                   lng: 13.4051,
//                   additionalMarkers: [
//                     { name: "Brandenburg Gate", lat: 52.5164, lng: 13.3777 },
//                     { name: "Reichstag Building", lat: 52.5169, lng: 13.3809 },
//                   ],
//                 },
//                 {
//                   name: "Hamburg",
//                   lat: 53.5503,
//                   lng: 10.0006,
//                   additionalMarkers: [
//                     { name: "Miniatur Wunderland", lat: 53.5496, lng: 9.9953 },
//                     { name: "Elbphilharmonie Hamburg", lat: 53.5461, lng: 9.9994 },
//                   ],
//                 },
//                 {
//                   name: "Munich",
//                   lat: 48.1351,
//                   lng: 11.5731,
//                   additionalMarkers: [
//                     { name: "Hofbräuhaus München", lat: 48.1372, lng: 11.5759 },
//                     { name: "Deutsches Museum", lat: 48.1494, lng: 11.5705 },
//                   ],
//                 },
//                 {
//                   name: "Cologne",
//                   lat: 50.9334,
//                   lng: 6.9599,
//                   additionalMarkers: [
//                     { name: "Kölner Dom", lat: 50.9417, lng: 6.9589 },
//                     { name: "Schokoladenmuseum", lat: 50.9378, lng: 6.9548 },
//                   ],
//                 },
//                 {
//                   name: "Frankfurt",
//                   lat: 50.1156, lng: 8.6823,
//                   additionalMarkers: [
//                     { name: "Römer", lat: 50.1157, lng: 8.6792 },
//                     { name: "Senckenberg Museum", lat: 50.1127, lng: 8.6753 },
//                   ],
//                 },
//               ];
            
//               // Add markers for each city
//             for (var city of cityData) {
//                 var bounds = new google.maps.LatLngBounds();
//                 var cityMarker = new google.maps.Marker({
//                     position: { lat: city.lat, lng: city.lng },
//                     map: map,
//                     title: city.name,
//                 }
//                 );
//                 //bounds.extend(new google.maps.LatLng(city.lat,city.lng));
            

//                 // Add a click event listener to zoom in and display additional markers
//                 cityMarker.addListener('click', (function (clickedCity) {
//                     return function () {
//                         var bounds = new google.maps.LatLngBounds();

//                         // Extend bounds with the city marker
//                         bounds.extend(new google.maps.LatLng(clickedCity.lat, clickedCity.lng ));

//                         // Add additional markers for the clicked city
//                         for (var additionalMarkerData of clickedCity.additionalMarkers) {
//                             var additionalMarkerPosition = {
//                                 lat: additionalMarkerData.lat,
//                                 lng: additionalMarkerData.lng,
//                             };
//                             var additionalMarkerContent = additionalMarkerData.name;

//                             var additionalMarker = new google.maps.Marker({
//                                 position: additionalMarkerPosition,
//                                 map: map,
//                                 title: additionalMarkerContent,
//                             });
//                             bounds.extend(new google.maps.LatLng(additionalMarkerPosition));
//                         }

//                         // Fit the map to the bounds
//                         map.fitBounds(bounds);

//                         // Set a reasonable zoom level to maintain interactivity
//                         const listener = google.maps.event.addListener(map, 'idle', () => {
//                             if (map.getZoom() > 12) map.setZoom(8);
//                             google.maps.event.removeListener(listener);

//                             // Explicitly set the center after fitting bounds
//                             map.setCenter(bounds.getCenter());
//                         });

//                         // You can access clickedCity here
//                         console.log('Clicked city:', clickedCity.name);
//                             };
//                         })(city));
//                         map.fitBounds(bounds);
//             }
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
                zoom: 3, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });

            // Create an array to hold individual markers
            var markers = [];

            // Add 1000 markers with random positions
            for (var i = 0; i < 150; i++) {
                var randomLat = 51.5078 + Math.random() * 5; // Adjust latitude range as needed
                var randomLng = 9.5790 + Math.random() * 5; // Adjust longitude range as needed

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

                // Add a click event listener to zoom in and display individual markers
                markers.forEach((marker) => {
                    marker.addListener('click', () => {
                        // Zoom in
                        map.setZoom(12);
                        
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
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();

