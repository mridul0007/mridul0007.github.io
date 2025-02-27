(function () {
    let template = document.createElement('template');
    template.innerHTML = `
        <style>
            #map {
                height: 400px;
                width: 100%;
            }
        </style>
        <div id="map"></div>
    `;

    class GoogleMapsWidget extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._mapDiv = this._shadowRoot.getElementById('map');
            this._map = null;
            this._apiKey = null;
            this._plmData = [];
            this._markers = []; // Store markers for clearing
            this._markerCluster = null;
        }

        async connectedCallback() {
            await this.loadGoogleMapsAPI();
            this.initMap();
        }

        async loadGoogleMapsAPI() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this._apiKey}&callback=initGoogleMaps`;
                script.defer = true;
                script.async = true;

                window.initGoogleMaps = () => {
                    resolve();
                };

                script.onerror = () => {
                    reject(new Error('Failed to load Google Maps API.'));
                };

                document.head.appendChild(script);
            });
        }

        async initMap() {
             this._map = new google.maps.Map(this._mapDiv, {
                center: { lat: 0, lng: 0 },
                zoom: 2,
            });
        }

        async set_api_key(value) {
            this._apiKey = value;
        }

        set_data(value) {
            this._plmData = value;
            this.updateMap();
        }

        updateMap() {
            if (!this._map || !this._plmData || this._plmData.length === 0) return;

            // Clear existing markers and cluster
            this._markers.forEach(marker => marker.setMap(null));
            this._markers = [];
            if (this._markerCluster) {
                this._markerCluster.setMap(null);
            }

            // Create markers
            this._plmData.forEach(dataPoint => {
                if (dataPoint.properties && dataPoint.properties.lat && dataPoint.properties.long) {
                    const lat = parseFloat(dataPoint.properties.lat);
                    const lng = parseFloat(dataPoint.properties.long);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const marker = new google.maps.Marker({
                            position: { lat: lat, lng: lng },
                            map: this._map,
                        });
                        this._markers.push(marker);
                    }
                }
            });

            // Create marker clusterer
            if (this._markers.length > 0) {
                import("@googlemaps/markerclusterer").then(({ MarkerClusterer }) => {
                    this._markerCluster = new MarkerClusterer({
                        map: this._map,
                        markers: this._markers,
                    });
                });
            }
        }
    }

    customElements.define('com-example-googlemaps', GoogleMapsWidget);
})();