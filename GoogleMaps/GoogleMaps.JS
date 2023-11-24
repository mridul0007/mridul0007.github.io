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
//             var bounds = new google.maps.LatLngBounds();
//             var berlinDataPoints = [
//                 { lat: 48.5200, lng: 13.4050 },
//                 { lat: 52.5300, lng: 13.4150 },
//                 { lat: 52.5400, lng: 13.4250 },
//                 { lat: 52.5500, lng: 13.4350 },
//                 { lat: 52.5600, lng: 13.4450 },
//                 { lat: 52.5700, lng: 13.4550 },
//                 { lat: 52.5800, lng: 13.4650 },
//                 { lat: 52.5900, lng: 13.4750 },
//                 { lat: 52.6000, lng: 13.4850 },
//                 { lat: 52.6100, lng: 13.4950 },
//                 { lat: 52.6200, lng: 13.5050 },
//                 { lat: 52.6300, lng: 13.5150 },
//                 { lat: 52.6400, lng: 13.5250 },
//                 { lat: 52.6500, lng: 13.5350 },
//                 { lat: 52.6600, lng: 13.5450 },
//                 { lat: 52.6700, lng: 13.5550 },
//                 { lat: 52.6800, lng: 13.5650 },
//                 { lat: 52.6900, lng: 13.5750 },
//                 { lat: 52.7000, lng: 13.5850 },
//                 { lat: 52.7100, lng: 13.5950 },
//                 { lat: 52.7200, lng: 13.6050 },
//                 { lat: 52.7300, lng: 13.6150 },
//                 { lat: 52.7400, lng: 13.6250 },
//                 { lat: 52.7500, lng: 13.6350 },
//                 { lat: 52.7600, lng: 13.6450 },
//                 { lat: 52.7700, lng: 13.6550 },
//                 { lat: 52.7800, lng: 13.6650 },
//                 { lat: 52.7900, lng: 13.6750 },
//                 { lat: 52.8000, lng: 13.6850 },
//                 { lat: 52.8100, lng: 13.6950 },
//                 { lat: 52.8200, lng: 13.7050 },
//                 { lat: 52.8300, lng: 13.7150 },
//                 { lat: 52.8400, lng: 13.7250 },
//                 { lat: 52.8500, lng: 13.7350 },
//                 { lat: 52.8600, lng: 13.7450 },
//                 { lat: 52.8700, lng: 13.7550 },
//                 { lat: 52.8800, lng: 13.7650 },
//                 { lat: 52.8900, lng: 13.7750 },
//                 { lat: 52.9000, lng: 13.7850 },
//                 { lat: 52.9100, lng: 13.7950 },
//                 { lat: 52.9200, lng: 13.8050 },
//                 { lat: 52.9300, lng: 13.8150 },
//                 { lat: 52.9400, lng: 13.8250 },
//                 { lat: 52.9500, lng: 13.8350 },
//                 { lat: 52.9600, lng: 13.8450 },
//                 { lat: 52.9700, lng: 13.8550 },
//                 { lat: 52.9800, lng: 13.8650 },
//                 { lat: 52.9900, lng: 13.8750 },
//                 { lat: 53.0000, lng: 13.8850 },
//                 { lat: 53.0100, lng: 13.8950 },
//                 { lat: 53.0200, lng: 13.9050 },
//                 { lat: 53.0300, lng: 13.9150 },
//                 { lat: 53.0400, lng: 13.9250 },
//                 { lat: 53.0500, lng: 13.9350 },
//                 { lat: 53.0600, lng: 13.9450 },
//                 { lat: 53.0700, lng: 13.9550 },
//                 { lat: 53.0800, lng: 13.9650 },
//                 { lat: 53.0900, lng: 13.9750 },
//                 { lat: 53.1000, lng: 13.9850 },
//                 { lat: 53.1100, lng: 13.9950 },
//                 { lat: 53.1200, lng: 14.0050 },
//                 { lat: 53.1300, lng: 14.0150 },
//                 { lat: 53.1400, lng: 14.0250 },
//                 { lat: 53.1500, lng: 14.0350 },
//                 { lat: 53.1600, lng: 14.0450 },
//                 { lat: 53.1700, lng: 14.0550 },
//                 { lat: 53.1800, lng: 14.0650 },
//                 { lat: 53.1900, lng: 14.0750 },
//                 { lat: 53.2000, lng: 14.0850 },
//                 { lat: 53.2100, lng: 14.0950 },
//                 { lat: 53.2200, lng: 14.1050 },
//                 { lat: 53.2300, lng: 14.1150 },
//                 { lat: 53.2400, lng: 14.1250 },
//                 { lat: 53.2500, lng: 14.1350 },
//                 { lat: 53.2600, lng: 14.1450 },
//                 { lat: 53.2700, lng: 14.1550 },
//                 { lat: 53.2800, lng: 14.1650 },
//                 { lat: 53.2900, lng: 14.1750 },
//                 { lat: 53.3000, lng: 14.1850 },
//                 { lat: 53.3100, lng: 14.1950 },
//                 { lat: 53.3200, lng: 14.2050 },
//                 { lat: 53.3300, lng: 14.2150 },
//                 { lat: 53.3400, lng: 14.2250 },
//                 { lat: 53.3500, lng: 14.2350 },
//                 { lat: 53.3600, lng: 14.2450 },
//                 { lat: 53.3700, lng: 14.2550 },
//                 { lat: 53.3800, lng: 14.2650 },
//                 { lat: 53.3900, lng: 14.2750 },
//                 { lat: 53.4000, lng: 14.2850 },
//                 { lat: 53.4100, lng: 14.2950 },
//                 { lat: 53.4200, lng: 14.3050 },
//                 { lat: 53.4300, lng: 14.3150 },
//                 { lat: 53.4400, lng: 14.3250 },
//                 { lat: 53.4500, lng: 14.3350 },
//                 { lat: 53.4600, lng: 14.3450 },
//                 { lat: 53.4700, lng: 14.3550 },
//                 { lat: 53.4800, lng: 14.3650 },
//                 { lat: 53.4900, lng: 14.3750 },
//                 { lat: 53.5000, lng: 14.3850 },
//                 { lat: 53.5100, lng: 14.3950 },
//                 { lat: 53.5200, lng: 14.4050 },
//                 { lat: 53.5300, lng: 14.4150 },
//                 { lat: 53.5400, lng: 14.4250 },
//                 { lat: 53.5500, lng: 14.4350 },
//                 { lat: 53.5600, lng: 14.4450 },
//                 { lat: 53.5700, lng: 14.4550 },
//                 { lat: 53.5800, lng: 14.4650 },
//                 { lat: 53.5900, lng: 14.4750 },
//                 { lat: 53.6000, lng: 14.4850 },
//                 { lat: 53.6100, lng: 14.4950 },
//                 { lat: 53.6200, lng: 14.5050 },
//                 { lat: 53.6300, lng: 14.5150 },
//                 { lat: 53.6400, lng: 14.5250 },
//                 { lat: 53.6500, lng: 14.5350 },
//                 { lat: 53.6600, lng: 14.5450 },
//                 { lat: 53.6700, lng: 14.5550 },
//                 { lat: 53.6800, lng: 14.5650 },
//                 { lat: 53.6900, lng: 14.5750 },
//                 { lat: 53.7000, lng: 14.5850 },
//                 { lat: 53.7100, lng: 14.5950 },
//                 { lat: 53.7200, lng: 14.6050 },
//                 { lat: 53.7300, lng: 14.6150 },
//                 { lat: 60.7400, lng: 18.6250 }];

//                 var lat_m,lng_m;
//                for(var i =0 ;i < berlinDataPoints.length; i++)
//                {
//                 lat_m = berlinDataPoints[i].lat;
//                 lng_m =berlinDataPoints[i].lng;
//                 var marker = new google.maps.Marker({
//                             position: { lat: lat_m, lng: lng_m },
//                             title: "City " + i,
//                         });
                
//                         // Push the marker to the array
//                         markers.push(marker);
//                         bounds.extend(marker.getPosition());

//                }
//             // Add 150 markers with random positions
//             // for (var i = 0; i < 150; i++) {
//             //     var randomLat = 51.5078 - latRange / 2 + Math.random() * latRange; // Adjust latitude range based on container size
//             //     var randomLng = 9.5790 - lngRange / 2 + Math.random() * lngRange; // Adjust longitude range based on container size
        
//             //     var marker = new google.maps.Marker({
//             //         position: { lat: randomLat, lng: randomLng },
//             //         title: "City " + i,
//             //     });
        
//             //     // Push the marker to the array
//             //     markers.push(marker);
//             //     bounds.extend(marker.getPosition());
//             // }
//              // Center the map initially using all markers
//             map.fitBounds(bounds);
//             map.setZoom(6);
                
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
//                 // ar bounds = new google.maps.LatLngBounds();
//                 // markers.forEach(marker => {
//                 //     bounds.extend(marker.getPosition());
//                 // });
        
//                 // // Fit the map to the bounds
//                 // map.fitBounds(bounds);v
        
//                 // Add a click event listener to zoom in and display individual markers
//                 markers.forEach((marker) => {
//                     marker.addListener('click', () => {
//                         // Zoom in
//                         map.setZoom(6);
        
//                         // Delay the centering operation to ensure it happens after the zoom
//                         setTimeout(() => {
//                             // Center map on the clicked marker
//                             map.setCenter(marker.getPosition());
//                         }, 300); // Adjust the delay as needed
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
                center: { lat: 51.5078, lng: 9.5790 }, // Germany's central coordinates
                zoom: 3, // Set the initial zoom level
                disableDefaultUI: false, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });

            // Create an array to hold individual markers
            var markers = [];
            var berlinDataPoints = [
                { lat: 48.5200, lng: 13.4050 },
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
                { lat: 52.8100, lng: 13.6950 },
                { lat: 52.8200, lng: 13.7050 },
                { lat: 52.8300, lng: 13.7150 },
                { lat: 52.8400, lng: 13.7250 },
                { lat: 52.8500, lng: 13.7350 },
                { lat: 52.8600, lng: 13.7450 },
                { lat: 52.8700, lng: 13.7550 },
                { lat: 52.8800, lng: 13.7650 },
                { lat: 52.8900, lng: 13.7750 },
                { lat: 52.9000, lng: 13.7850 },
                { lat: 52.9100, lng: 13.7950 },
                { lat: 52.9200, lng: 13.8050 },
                { lat: 52.9300, lng: 13.8150 },
                { lat: 52.9400, lng: 13.8250 },
                { lat: 52.9500, lng: 13.8350 },
                { lat: 52.9600, lng: 13.8450 },
                { lat: 52.9700, lng: 13.8550 },
                { lat: 52.9800, lng: 13.8650 },
                { lat: 52.9900, lng: 13.8750 },
                { lat: 53.0000, lng: 13.8850 },
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
                { lat: 53.3600, lng: 14.2450 },
                { lat: 53.3700, lng: 14.2550 },
                { lat: 53.3800, lng: 14.2650 },
                { lat: 53.3900, lng: 14.2750 },
                { lat: 53.4000, lng: 14.2850 },
                { lat: 53.4100, lng: 14.2950 },
                { lat: 53.4200, lng: 14.3050 },
                { lat: 53.4300, lng: 14.3150 },
                { lat: 53.4400, lng: 14.3250 },
                { lat: 53.4500, lng: 14.3350 },
                { lat: 53.4600, lng: 14.3450 },
                { lat: 53.4700, lng: 14.3550 },
                { lat: 53.4800, lng: 14.3650 },
                { lat: 53.4900, lng: 14.3750 },
                { lat: 53.5000, lng: 14.3850 },
                { lat: 53.5100, lng: 14.3950 },
                { lat: 53.5200, lng: 14.4050 },
                { lat: 53.5300, lng: 14.4150 },
                { lat: 53.5400, lng: 14.4250 },
                { lat: 53.5500, lng: 14.4350 },
                { lat: 53.5600, lng: 14.4450 },
                { lat: 53.5700, lng: 14.4550 },
                { lat: 53.5800, lng: 14.4650 },
                { lat: 53.5900, lng: 14.4750 },
                { lat: 53.6000, lng: 14.4850 },
                { lat: 53.6100, lng: 14.4950 },
                { lat: 53.6200, lng: 14.5050 },
                { lat: 53.6300, lng: 14.5150 },
                { lat: 53.6400, lng: 14.5250 },
                { lat: 53.6500, lng: 14.5350 },
                { lat: 53.6600, lng: 14.5450 },
                { lat: 53.6700, lng: 14.5550 },
                { lat: 53.6800, lng: 14.5650 },
                { lat: 53.6900, lng: 14.5750 },
                { lat: 53.7000, lng: 14.5850 },
                { lat: 53.7100, lng: 14.5950 },
                { lat: 53.7200, lng: 14.6050 },
                { lat: 53.7300, lng: 14.6150 },
                { lat: 60.7400, lng: 18.6250 }];

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



