(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map {
                height: 500px;
                width: 500px;
            }
        </style>
        <div id="map"></div>
    `;

    class LeafletMap extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.loadLeafletCSS();
            this.loadLeafletJS();
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

        initMap() {
            this.map = L.map(this.shadowRoot.getElementById('map')).setView([51.1657, 10.4515], 6); // Centered on Germany
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
           
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            this.renderMap();
        }

        renderMap() {

            var iconUrls = [
                'https://mridul0007.github.io/GoogleMaps/dog.png',
                'https://mridul0007.github.io/GoogleMaps/cat.png',
                'https://mridul0007.github.io/GoogleMaps/car.png',
            ];

            var mapIcon = L.Icon.extend({
                options: {
                    shadowUrl: '',
                    iconSize:     [20, 20],
                    shadowSize:   [50, 64],
                    iconAnchor:   [20,20],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76]
                }
            });

            // var dogIcon = new mapIcon({iconUrl: 'https://mridul0007.github.io/GoogleMaps/dog.png'}),
            // catIcon = new mapIcon({iconUrl: 'https://mridul0007.github.io/GoogleMaps/cat.png'}),
            // carIcon = new mapIcon({iconUrl: 'https://mridul0007.github.io/GoogleMaps/car.png'});

            for (var i = 0; i < this.plm_data.length; i++) {
                var lat_m = this.plm_data[i].properties["lat"];
                var lng_m = this.plm_data[i].properties["long"];
                var iconUrl = iconUrls[i % iconUrls.length];
                var image_Url = this.plm_data[i].properties["image"];

                var setIcon = new mapIcon({iconUrl: iconUrl});

            var marker = L.marker([lat_m, lng_m], {icon: setIcon} ).addTo(this.map);
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
            bounds.extend([lat_m, lng_m]);

            }
            this.map.fitBounds(bounds);

        }
    }
    
    customElements.define('custom-button', LeafletMap);
})();