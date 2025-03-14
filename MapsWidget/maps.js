(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #d-widget-container {
                height: 100%;
                width: 100%;
                display: block;
            }
            #d-map-container {
                height: 100%;
                width: 100%;
                display: block;
            }

            #d-os-map {
                height: 100%;
                width: 100%;
                display: block; 
                position: static
            }

            .leaflet-popup-content-wrapper {
                max-height: 400px; /* Adjust this value as needed */
                overflow-y: auto;
              }
        </style>
       <div id="d-widget-container">
            <div id="d-map-container">
                <div id="d-os-map"></div>
            </div>
        </div>

    `;

class CombinedMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.fe_osm_map = null;
        this.fe_init_osMaps();
    }

    map = null;


    async fe_init_osMaps(){

        try {
                
            await this.loadLeafletCSS();
            
            
            await this.loadLeafletJS();
            
           
            await this.loadMarkerClusterCSS();
            await this.loadMarkerClusterJS();
            
            console.log("All OSM dependencies loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading OSM dependencies:", error);
            return false;
        }


    }

    

    async loadLeafletCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        this.shadowRoot.appendChild(link);
    }

    async loadLeafletJS() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = this.initMap.bind(this);
        this.shadowRoot.appendChild(script);
    }

    async loadMarkerClusterCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
        this.shadowRoot.appendChild(link);
    }

    async loadMarkerClusterJS() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
        script.onload = this.renderMap.bind(this);
        this.shadowRoot.appendChild(script);
    }

    initMap() {
        this.fe_osm_map = L.map(this.shadowRoot.getElementById('d-map-container')).setView([51.1657, 10.4515], 6); // Centered on Germany
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.fe_osm_map);
    }

    async set_data(plm_data) {
        this.plm_data = plm_data;
        this.renderMap();
    }

    renderMap() {
        var bounds = new L.LatLngBounds();

        var iconUrls = [
            'https://mridul0007.github.io/GoogleMaps/dog.png',
            'https://mridul0007.github.io/GoogleMaps/cat.png',
            'https://mridul0007.github.io/GoogleMaps/car.png',
        ];

        var mapIcon = L.Icon.extend({
            options: {
                shadowUrl: '',
                iconSize:     [30, 30],
                shadowSize:   [50, 64],
                iconAnchor:   [20, 20],
                shadowAnchor: [4, 62],
                popupAnchor:  [0, -10]
            }
        });

        var markerCluster = L.markerClusterGroup();
        const mapInstance = this.map;

        for (var i = 0; i < this.plm_data.length; i++) {
            var lat_m = this.plm_data[i].properties["lat"];
            var lng_m = this.plm_data[i].properties["long"];
            var iconUrl = iconUrls[i % iconUrls.length];
            var image_Url = this.plm_data[i].properties["image"];
            var tableContent = `
            <style type="text/css" >
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
                                            <td class="tg-0lax">Old Data XXXX</td>
                                            <td class="tg-0lax">8</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax">WT-Gruppe:</td>
                                            <td class="tg-0lax">6</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-0lax">New Data 2131</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax"PPS:</td>
                                            <td class="tg-0lax">Mridul</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-0lax">8</td>
                                        </tr>
                                        <tr>
                                            <td class="tg-0lax">Tagespreis:</td>
                                            <td class="tg-0lax">Mridul</td>
                                            <td class="tg-0lax">7</td>
                                            <td class="tg-73oq">8</td>
                                        </tr>
                                        </tbody>
                                        </table>
            `;

            var setIcon = new mapIcon({ iconUrl: iconUrl });
            var marker = L.marker([lat_m, lng_m], { icon: setIcon });

           
            marker.on('click', function(e) {
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;
                mapInstance.setView(e.latlng, 15);
            }.bind(this)); 
            marker.bindPopup(tableContent,{ autoPan: true, anchor: [0.5, -0.5], keepInView: true });
            markerCluster.addLayer(marker);
            bounds.extend([lat_m, lng_m]);
        }

        this.map.addLayer(markerCluster);
        this.map.fitBounds(bounds);
    }
}
// console

customElements.define('com-example-maps', CombinedMap);
})();