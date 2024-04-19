(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
        #loading_overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 9999;
            align-items: center;
            justify-content: center;
          }
      
          #loading_spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 4px solid white;
            border-top: 4px solid transparent;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
          }
      
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg);}
            100% { transform: translate(-50%, -50%) rotate(360deg);}
          }
            #map-container {
                height: 100%;
                width: 100%;
            }
        </style>
    
        <div id="map-container"></div>
        <div id="loading_overlay">
            <div id="loading_spinner"></div>
        </div>
    `;

    class OSMMapWidget extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.mapData = {};
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            var loadingOverlay = this.shadowRoot.getElementById('loading_overlay');
            loadingOverlay.style.display = "block";
        }

        async setData(mapData) {
            this.mapData = mapData;
            this.renderMap();
        }

        renderMap() {
            const startTime = new Date();
            var mapContainer = this.shadowRoot.querySelector('#map-container');

            // Initialize the map using Leaflet
            var map = L.map(mapContainer).setView([51.1657, 10.4515], 6); // Centered on Germany

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Create an array to hold individual markers and icons
            var markers = [];
            var iconUrls = [
                'https://mridul0007.github.io/GoogleMaps/dog.png',
                'https://mridul0007.github.io/GoogleMaps/cat.png',
                'https://mridul0007.github.io/GoogleMaps/car.png',
            ];

            var bounds = new L.LatLngBounds();
            for (var i = 0; i < this.mapData.length; i++) {
                var lat = this.mapData[i].lat;
                var lng = this.mapData[i].lng;
                var iconUrl = iconUrls[i % iconUrls.length];
                var imageUrl = this.mapData[i].imageUrl;

                var marker = L.marker([lat, lng], { icon: L.icon({ iconUrl: iconUrl }) });

                // Add click event listener to each marker
                marker.on('click', function () {
                    // Zoom in to street level when marker is clicked
                    map.setView(marker.getLatLng(), 15);
                    var infoWindow = L.popup()
                        .setLatLng(marker.getLatLng())
                        .setContent('<img src="' + imageUrl + '" alt="Image">')
                        .openOn(map);
                });

                markers.push(marker);
                bounds.extend([lat, lng]);
            }

            // Add markers to a cluster group
            var markerCluster = L.markerClusterGroup();
            markerCluster.addLayers(markers);
            map.addLayer(markerCluster);

            // Fit the map bounds to show all markers
            map.fitBounds(bounds);

            const endTime = new Date();
            const duration = endTime - startTime;
            console.log(duration);

            var loadingOverlay = this.shadowRoot.getElementById('loading_overlay');
            loadingOverlay.style.display = "none";
        }
    }

    customElements.define('custom-button', OSMMapWidget);
})();
