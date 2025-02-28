(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 400px; /* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
    
        <div id="map-container"></div>
    `;

    class GoogleMapsWidget extends HTMLElement {
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
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap&loading=async&v=weekly&libraries=marker`;
            console.log("reached Set API KEY");
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
            console.log("Reached rendermap")
            var markers = [];
            const bounds = new google.maps.LatLngBounds();
            // Get the map container element
            var mapContainer = this.shadowRoot.querySelector('#map-container');

            // Create a new map centered at a specific location
            var map = new
            google.maps.Map(mapContainer, {
              center: {lat: 52.520, lng: 13.405},
              zoom: 8,
              mapId: 'DEMO_MAP_ID'
            });

             // Add markers using AdvancedMarkerElement
            this.plm_data.forEach(dataPoint => {
            const markerImg = document.createElement("img");
            markerImg.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
            var lat_m = parseFloat(dataPoint.properties["lat"]); 
            var lng_m = parseFloat(dataPoint.properties["long"]);
                if (lat_m && lng_m) {
                    let marker = new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat: lat_m, lng: lng_m },
                        content: markerImg,
                        title: dataPoint.id,
                      });

                    markers.push(marker); 
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
                                            <td class="tg-baqh" colspan="4"><img src="${markerImg}" alt="Image"></td>
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
                    });
                    console.log("Marker clicked:", dataPoint.id); 
                    marker = null; 
                }
            }
        
        );

        
        if (this.markers.length > 0) {
            // Fit the map to the bounds of all markers
            map.fitBounds(bounds);
            
            // Create a marker clusterer
            this.markerCluster = new markerClusterer.MarkerClusterer({
                map,
                markers: this.markers,
                renderer: {
                    render: ({ count, position }) => {
                        // Create custom cluster marker
                        const clusterDiv = document.createElement("div");
                        clusterDiv.innerHTML = String(count);
                        clusterDiv.style.color = "white";
                        clusterDiv.style.backgroundColor = "#1978c8";
                        clusterDiv.style.borderRadius = "50%";
                        clusterDiv.style.padding = "10px";
                        clusterDiv.style.width = "30px";
                        clusterDiv.style.height = "30px";
                        clusterDiv.style.textAlign = "center";
                        clusterDiv.style.lineHeight = "30px";
                        clusterDiv.style.fontWeight = "bold";
                        
                        return new google.maps.marker.AdvancedMarkerElement({
                            map,
                            position,
                            content: clusterDiv,
                            zIndex: 1000,
                        });
                    }
                },
                // Customize clustering algorithm if needed
                algorithm: {
                    maxZoom: 15, // Maximum zoom level for clustering
                    radius: 60,  // Cluster radius in pixels
                }
            });
            
            console.log("Created marker cluster with", this.markers.length, "markers");
        } else {
            console.log("No valid markers to display");
        }
    }
}

        


    customElements.define('com-example-googlemaps', GoogleMapsWidget);
})();