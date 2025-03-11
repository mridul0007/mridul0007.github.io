(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
        #map-container {
            height: 100%;
            width: 100%;
            position: relative;
        }
        #google-map {
            height: 100%;
            width: 100%;
        }
        #leaflet-map {
            height: 100%;
            width: 100%;
            display: none; /* Initially hidden */
        }
        #map-toggle {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background: white;
            padding: 5px;
            border-radius: 4px;
        }
        #footnote {
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            color: black;
            z-index: 1000;
        }
        .leaflet-popup-content-wrapper {
            max-height: 400px;
            overflow-y: auto;
        }
    </style>

    <div id="map-container">
        <div id="google-map"></div>
        <div id="leaflet-map"></div>
        <div id="map-toggle">
            <label><input type="radio" name="mapType" value="google" checked> Google Maps</label>
            <label><input type="radio" name="mapType" value="leaflet"> Leaflet</label>
        </div>
        <div id="footnote">Contigo custom Maps widget</div>
    </div>
`;

class CombinedMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.mapType = 'google'; // Default map type

        // Initialize both map types
        this.initGoogleMap();
        this.initLeafletMap();
        this.setupToggle();
    }

    async set_google_mapsjs_api_key(google_mapsjs_api_key) {
        var script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${google_mapsjs_api_key}&callback=initMap&loading=async&v=weekly&libraries=marker,places`;
        script.async = true;
        script.defer = true;
        script.onerror = () => console.error('Error loading Google Maps API');
        document.head.appendChild(script);
        window.initMap = () => {
            this.renderMap();
        };
    }

    initGoogleMap() {
        this.googleMapContainer = this.shadowRoot.getElementById('google-map');
        // Google Maps initialization will be handled in the callback after the API is loaded
    }

    initLeafletMap() {
        this.leafletMapContainer = this.shadowRoot.getElementById('leaflet-map');
        this.loadLeafletCSS();
        this.loadLeafletJS();
        this.loadMarkerClusterCSS();
        this.loadMarkerClusterJS();
    }

    loadLeafletCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        this.shadowRoot.appendChild(link);
    }

    loadLeafletJS() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = this.initMap.bind(this);
        this.shadowRoot.appendChild(script);
    }

    loadMarkerClusterCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
        this.shadowRoot.appendChild(link);
    }

    loadMarkerClusterJS() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
        script.onload = this.renderMap.bind(this);
        this.shadowRoot.appendChild(script);
    }

    initLeaflet() {
        this.leafletMap = L.map(this.leafletMapContainer).setView([51.1657, 10.4515], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.leafletMap);
    }

    setupToggle() {
        const toggle = this.shadowRoot.querySelectorAll('input[name="mapType"]');
        toggle.forEach(radio => {
            radio.addEventListener('change', (event) => {
                this.mapType = event.target.value;
                this.updateMapDisplay();
                this.renderMap();
            });
        });
    }

    updateMapDisplay() {
        if (this.mapType === 'google') {
            this.googleMapContainer.style.display = 'block';
            this.leafletMapContainer.style.display = 'none';
        } else {
            this.googleMapContainer.style.display = 'none';
            this.leafletMapContainer.style.display = 'block';
            if (!this.leafletMap) {
                this.initLeaflet();
            }
        }
    }

    async set_data(plm_data) {
        this.plm_data = plm_data;
        this.renderMap();
    }

    renderMap() {
        if (this.mapType === 'google') {
            this.renderGoogleMap();
        } else {
            this.renderLeafletMap();
        }
    }

    renderGoogleMap() {
        if (!window.google || !window.google.maps) return; // Wait for Google Maps API to load
        const map = new google.maps.Map(this.googleMapContainer, {
            zoom: 8,
            mapId: 'DEMO_MAP_ID'
        });

        const bounds = new google.maps.LatLngBounds();
        const markers = [];

        this.plm_data.forEach(dataPoint => {
            // ... (Google Maps marker creation and info window logic) ...
        });

        if (markers.length > 0) {
            map.fitBounds(bounds);
        }

        if (markers.length > 20) {
            // ... (Google Maps marker clustering logic) ...
        }
    }

    renderLeafletMap() {
        if (!this.leafletMap) return;

        this.leafletMap.eachLayer(layer => {
            if (layer instanceof L.MarkerClusterGroup || layer instanceof L.Marker) {
                this.leafletMap.removeLayer(layer);
            }
        });

        const bounds = new L.LatLngBounds();
        const markerCluster = L.markerClusterGroup();
        const iconUrls = [ /* ... (icon URLs) ... */ ];
        const mapIcon = L.Icon.extend({ /* ... (map icon definition) ... */ });

        this.plm_data.forEach((dataPoint, i) => {
            // ... (Leaflet marker creation and popup logic) ...
        });

        this.leafletMap.addLayer(markerCluster);
        this.leafletMap.fitBounds(bounds);
    }
}

customElements.define('com-example-maps', CombinedMap);
})();
