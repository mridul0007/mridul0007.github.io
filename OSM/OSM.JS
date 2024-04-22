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

            var bounds = new L.LatLngBounds();

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



                var setIcon = new mapIcon({iconUrl: iconUrl});

            var marker = L.marker([lat_m, lng_m], {icon: setIcon} ).addTo(this.map);
            marker.bindPopup(tableContent).openPopup();
            bounds.extend([lat_m, lng_m]);

            }
            this.map.fitBounds(bounds);

        }
    }
    
    customElements.define('custom-button', LeafletMap);
})();