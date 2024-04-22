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
            }).addTo(map);
           
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            this.renderMap();
        }

        renderMap() {

            var marker = L.marker([51.1657, 10.4515]).addTo(this.map);
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

        }
    }
    
    customElements.define('custom-button', LeafletMap);
})();