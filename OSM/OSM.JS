// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `
//         <style>
//             #map {
//                 height: 500px;
//                 width: 500px;
//             }
//         </style>
//         <div id="map"></div>
//     `;

// class LeafletMap extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//         this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
//         this.loadLeafletCSS();
//         this.loadLeafletJS();
//         this.loadMarkerClusterCSS();
//         this.loadMarkerClusterJS();
//     }

//     loadLeafletCSS() {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//         link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
//         link.crossOrigin = '';
//         this.shadowRoot.appendChild(link);
//     }

//     loadLeafletJS() {
//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//         script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
//         script.crossOrigin = '';
//         script.onload = this.initMap.bind(this);
//         this.shadowRoot.appendChild(script);
//     }

//     loadMarkerClusterCSS() {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
//         this.shadowRoot.appendChild(link);
//     }

//     loadMarkerClusterJS() {
//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
//         script.onload = this.renderMap.bind(this);
//         this.shadowRoot.appendChild(script);
//     }

//     initMap() {
//         this.map = L.map(this.shadowRoot.getElementById('map')).setView([51.1657, 10.4515], 6); // Centered on Germany
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(this.map);
//     }

//     async set_data(plm_data) {
//         this.plm_data = plm_data;
//         this.renderMap();
//     }

//     renderMap() {
//         var bounds = new L.LatLngBounds();

//         var iconUrls = [
//             'https://mridul0007.github.io/GoogleMaps/dog.png',
//             'https://mridul0007.github.io/GoogleMaps/cat.png',
//             'https://mridul0007.github.io/GoogleMaps/car.png',
//         ];

//         var mapIcon = L.Icon.extend({
//             options: {
//                 shadowUrl: '',
//                 iconSize:     [20, 20],
//                 shadowSize:   [50, 64],
//                 iconAnchor:   [20, 20],
//                 shadowAnchor: [4, 62],
//                 popupAnchor:  [0, 10]
//             }
//         });

//         var markerCluster = L.markerClusterGroup();

//         for (var i = 0; i < this.plm_data.length; i++) {
//             var lat_m = this.plm_data[i].properties["lat"];
//             var lng_m = this.plm_data[i].properties["long"];
//             var iconUrl = iconUrls[i % iconUrls.length];
//             var image_Url = this.plm_data[i].properties["image"];
//             var tableContent = `
//             <div style="max-width: 400px; max-height: 300px; overflow: auto;">
//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                 <tr style="background-color: #f2f2f2;">
//                     <th colspan="4" style="text-align: center;">QID: 36520</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 <tr>
//                     <td colspan="4" style="text-align: center; border: 1px solid #ddd;">WTN: Nicht vorhanden</td>
//                 </tr>
//                 <tr>
//                     <td colspan="4" style="text-align: center; border: 1px solid #ddd;">VIKTORIAALLEE 44</td>
//                 </tr>
//                 <tr>
//                     <td colspan="4" style="text-align: center; border: 1px solid #ddd;"><img src="${image_Url}" alt="Image" style="max-width: 100%; height: auto;"></td>
//                 </tr>
//                 <tr>
//                     <td style="text-align: left; border: 1px solid #ddd;">Anbietergruppe:</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">6</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">7</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">8</td>
//                 </tr>
//                 <tr>
//                     <td style="text-align: left; border: 1px solid #ddd;">WT-Gruppe:</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">6</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">7</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">8</td>
//                 </tr>
//                 <tr>
//                     <td style="text-align: left; border: 1px solid #ddd;">PPS:</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">6</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">7</td>
//                     <td style="align: center; border: 1px solid #ddd;">8</td>
//                 </tr>
//                 <tr>
//                     <td style="text-align: left; border: 1px solid #ddd;">Tagespreis:</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">6</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">7</td>
//                     <td style="text-align: center; border: 1px solid #ddd;">8</td>
//                 </tr>
//                 </tbody>
//             </table>
//             </div>
//             `;

//             var setIcon = new mapIcon({ iconUrl: iconUrl });

//             var marker = L.marker([lat_m, lng_m], { icon: setIcon }).on('click', onClick);;
//             marker.bindPopup(tableContent);
//             markerCluster.addLayer(marker);
//             bounds.extend([lat_m, lng_m]);
//         }
//          // Bind click event to marker
//          function onClick(e) {
//             this.map.setView(e.latlng, 18);
//             // Open popup
//             e.target.openPopup();
//             alert(this.getLatLng());
//         }

//         this.map.addLayer(markerCluster);
//         this.map.fitBounds(bounds);
//     }
// }

// customElements.define('custom-button', LeafletMap);
// })();
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
            // this.loadLeafletCSS();
            // this.loadLeafletJS();
            // this.loadMarkerClusterCSS();
            // this.loadMarkerClusterJS();
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

            this.loadLeafletCSS();
            this.loadLeafletJS();
            this.loadMarkerClusterCSS();
            this.loadMarkerClusterJS();

            var bounds = new L.LatLngBounds();

            var iconUrls = [
                'https://mridul0007.github.io/GoogleMaps/dog.png',
                'https://mridul0007.github.io/GoogleMaps/cat.png',
                'https://mridul0007.github.io/GoogleMaps/car.png',
            ];

            var mapIcon = L.Icon.extend({
                options: {
                    shadowUrl: '',
                    iconSize: [20, 20],
                    shadowSize: [50, 64],
                    iconAnchor: [20, 20],
                    shadowAnchor: [4, 62],
                    popupAnchor: [0, 10]
                }
            });

            var markerCluster = L.markerClusterGroup();

            // Define the onClick function outside the renderMap method
            function onClick(e) {
                this.map.setView(e.latlng, 30);
                e.target.openPopup();
            }

            for (var i = 0; i < this.plm_data.length; i++) {
                var lat_m = this.plm_data[i].properties["lat"];
                var lng_m = this.plm_data[i].properties["long"];
                var iconUrl = iconUrls[i % iconUrls.length];
                var image_Url = this.plm_data[i].properties["image"];
                var tableContent = `
                <div style="max-width: 400px; max-height: 300px; overflow: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th colspan="4" style="text-align: center;">QID: 36520</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="4" style="text-align: center; border: 1px solid #ddd;">WTN: Nicht vorhanden</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: center; border: 1px solid #ddd;">VIKTORIAALLEE 44</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: center; border: 1px solid #ddd;"><img src="${image_Url}" alt="Image" style="max-width: 100%; height: auto;"></td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: 1px solid #ddd;">Anbietergruppe:</td>
                        <td style="text-align: center; border: 1px solid #ddd;">6</td>
                        <td style="text-align: center; border: 1px solid #ddd;">7</td>
                        <td style="text-align: center; border: 1px solid #ddd;">8</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: 1px solid #ddd;">WT-Gruppe:</td>
                        <td style="text-align: center; border: 1px solid #ddd;">6</td>
                        <td style="text-align: center; border: 1px solid #ddd;">7</td>
                        <td style="text-align: center; border: 1px solid #ddd;">8</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: 1px solid #ddd;">PPS:</td>
                        <td style="text-align: center; border: 1px solid #ddd;">6</td>
                        <td style="text-align: center; border: 1px solid #ddd;">7</td>
                        <td style="align: center; border: 1px solid #ddd;">8</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: 1px solid #ddd;">Tagespreis:</td>
                        <td style="text-align: center; border: 1px solid #ddd;">6</td>
                        <td style="text-align: center; border: 1px solid #ddd;">7</td>
                        <td style="text-align: center; border: 1px solid #ddd;">8</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                `;

                var setIcon = new mapIcon({ iconUrl: iconUrl });

                var marker = L.marker([lat_m, lng_m], { icon: setIcon });
                marker.bindPopup(tableContent);
                marker.on('click', onClick); // Bind click event to marker
                markerCluster.addLayer(marker);
                bounds.extend([lat_m, lng_m]);
            }

            this.map.addLayer(markerCluster);
            this.map.fitBounds(bounds);
        }
    }

    customElements.define('custom-button', LeafletMap);
})();

