(function () {
    // Function to load Leaflet library dynamically
    function loadLeaflet(callback) {
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.onload = callback;
        document.head.appendChild(script);

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(style);
    }

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
            // Load Leaflet library dynamically before rendering the map
            loadLeaflet(() => {
                this.renderMap();
            });
        }

        async setData(mapData) {
            this.mapData = mapData;
            this.renderMap();
        }

        renderMap() {
           
            var mapContainer = this.shadowRoot.querySelector('#map-container');
        
            // Check if mapContainer exists
            if (!mapContainer) {
                console.error('Map container element not found.');
                return;
            }
        
            // Initialize the map using Leaflet
            var map = L.map(mapContainer).setView([51.1657, 10.4515], 6); // Centered on Germany
        
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        
            // Generate 200 random marker points within Germany
            var markers = [];
            var bounds = new L.LatLngBounds();
            for (var i = 0; i < 200; i++) {
                // Generate random coordinates within Germany's bounding box
                var lat = Math.random() * (55.0576 - 47.2701) + 47.2701;
                var lng = Math.random() * (15.0419 - 5.8663) + 5.8663;
        
                var marker = L.marker([lat, lng]);
                markers.push(marker);
                bounds.extend([lat, lng]);
            }
        
            // Add markers to a cluster group
            // var markerCluster = L.markerClusterGroup();
            // markerCluster.addLayers(markers);
            // map.addLayer(markerCluster);
        
            // Fit the map bounds to show all markers
            map.fitBounds(bounds);
        
          

            var loadingOverlad = this.shadowRoot.getElementById('loading_overlay');
            loadingOverlad.style.display = "none";
        }
        
    }


    customElements.define('custom-button', OSMMapWidget);
})();
