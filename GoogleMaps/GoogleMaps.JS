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
            this.plm_data = {};
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
                // this.renderMap();
            };
        }
        async set_data(plm_data) {
            this.plm_data = plm_data;
            this.renderMap();
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
                disableDefaultUI: true, // Disable default UI elements
                styles: mapStyles, // Apply custom map styles
            });

            // Create an array to hold individual markers and icons
            var markers = [];
            var iconUrls = [
                'https://mridul0007.github.io/GoogleMaps/dog.png',
                'https://mridul0007.github.io/GoogleMaps/cat.png',
                'https://mridul0007.github.io/GoogleMaps/car.png',
            ];

            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < this.plm_data.length; i++) {
                var lat_m = this.plm_data[i].properties["lat"];
                var lng_m = this.plm_data[i].properties["long"];
                var iconUrl = iconUrls[i % iconUrls.length];
                var image_Url = this.plm_data[i].properties["image"];


                

                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(lat_m), lng: parseFloat(lng_m) },
                    title: this.plm_data[i].id,
                    icon : iconUrl,
                    imageUrl: image_Url,
                    randdata : "hello"
                });
                // Add click event listener to each marker
                marker.addListener('click', function () {
                    // Zoom in to street level when marker is clicked
                    map.setZoom(15); 
                    map.setCenter(marker.getPosition());
                    var infoWindow = new google.maps.InfoWindow();

                    var tableContent = `
                                        <style type="text/css">
                                        .tg  {border-collapse:collapse;border-spacing:0;}
                                        .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
                                        overflow:hidden;padding:0px 2px;word-break:normal;}
                                        .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
                                        font-weight:normal;overflow:hidden;padding:0px 2px;word-break:normal;}
                                        .tg .tg-baqh{text-align:center;vertical-align:top}
                                        .tg .tg-jdb5{border-color:#000000;font-weight:bold;text-align:center;vertical-align:bottom}
                                        .tg .tg-amwm{font-weight:bold;text-align:center;vertical-align:top}
                                        .tg .tg-0lax{text-align:left;vertical-align:top}
                                        .tg .tg-73oq{border-color:#000000;text-align:left;vertical-align:top}
                                        </style>
                                        <table class="tg">
                                        <thead>
                                        <tr>
                                            <th class="tg-jdb5" colspan="4">QID: 36520</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td class="tg-amwm" colspan="4">WTN: Nicht vorhanden</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-amwm" colspan="4">VIKTORIAALLEE 44</td>
                                        </tr>
                                        <tr>
                                        <td class="tg-baqh" colspan="4"><img src="${image_Url}" alt="Image"></td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax">Anbietergruppe:</td>
                                            <td class="tg-0lax">6</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-0lax">8</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax">WT-Gruppe:</td>
                                            <td class="tg-0lax">6</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-0lax">8</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax"PPS:</td>
                                            <td class="tg-0lax">6</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-0lax">8</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax">Tagespreis:</td>
                                            <td class="tg-0lax">6</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-73oq">8</td>
                                        </tr>
                                        </tbody>
                                        </table>
                                    `;


                    var content =  tableContent;

                    // Set the content of the InfoWindow
                    infoWindow.setContent(content);

                    // Open the InfoWindow on the clicked marker
                    infoWindow.open(map, marker);
                    const startTime = new Date();
                    this.dispatchEvent(new CustomEvent("onPlmQueryExecution", { bubbles: true }));
                    
                    const endTime = new Date();
                    const duration = endTime - startTime;
                    console.log(duration);
                    console.log(ret);
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
             script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
            document.head.appendChild(script);

            // Wait for the MarkerClusterer library to load before creating the cluster
            script.onload = () => {
                
                var markerCluster = new MarkerClusterer(map, markers, {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                });
                
            };
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();



