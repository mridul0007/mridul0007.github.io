(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #d-widget-container {
                height: 100%;
                width: 100%;
                position: relative;
                display: flex;
                flex-direction: column;
            }
            #d-map-container {
                height: 98%;
                width: 100%;
                position: relative;
            }
            #d-data-source-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }
            #d-confirmSource {
                margin-top: 5px; /* Add 5px margin to the top */
            }
            #d-csvUpload {
                display: none;
            }    
            #d-google-map {
                height: 100%;
                width: 100%;
                display:none;
            }
            #d-os-map {
                height: 100%;
                width: 100%;
                display: none;
            }
            #d-bottom-bar {
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0px;
                
            }
            #d-map-toggle {
                z-index: 1000;
                background: transparent;
                padding: 5px;
                border-radius: 4px;
            }
            #d-footnote {
                font-size: 10px;
                color: white;
                z-index: 1000;
                margin-right: 10px;
            }
            #d-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                color: white;
            }
        </style>

        <div id="d-widget-container">
            <div id="d-map-container">
                <div id="d-data-source-overlay">
                    <p>Select Data Source:</p>
                    <label><input type="radio" name="dataSource" value="sac"> SAC </label>
                    <label><input type="radio" name="dataSource" value="csv"> CSV </label>
                    <input type="file" id="csvUpload" accept=".csv" style="display: none;">
                    <button id="confirmSource">Confirm</button>
                </div>
                <div id="d-google-map"></div>
                <div id="d-os-map"></div>
            </div>
            <div style="width: 100%; height: 1px; background-color: #064635;"></div>
            <div id="d-bottom-bar">
                <div id="d-map-toggle">
                    <label><input type="radio" name="mapType" value="google" checked> Google Maps</label>
                    <label><input type="radio" name="mapType" value="osm"> OpenStreet Maps</label>
                </div>
                <div id="d-footnote">Contigo custom Maps widget</div>
            </div>
            <div id="d-loading-overlay">
                <p>Loading... <span id="loading-progress">0</span> rows processed</p>
            </div>
        </div>
    `;

    class CombinedMap extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.DB_COORDINATE_DATA = {};
            this.FE_GM_MARKERS = [];
            this.dataSource = null;
            this.loadingOverlay = null;
            this.mapType = 'google';
            this.google_mapsjs_api_key='';
            this.fe_gm_map = null;
            this.fe_os_map = null;
            this.init();
        }

        init() {
            const confirmButton = this.shadowRoot.querySelector('#confirmSource');
            const csvUploadInput = this.shadowRoot.querySelector('#csvUpload');
            const dataSourceOverlay = this.shadowRoot.querySelector('#d-data-source-overlay');
            const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');
            const mapTypeRadios = this.shadowRoot.querySelectorAll('input[name="mapType"]');

            confirmButton.addEventListener('click', () => {
                const selectedSource = this.shadowRoot.querySelector('input[name="dataSource"]:checked');
                if (selectedSource) {
                    this.dataSource = selectedSource.value;
                    if (this.dataSource === 'csv') {
                        csvUploadInput.style.display = 'block';
                        if (csvUploadInput.files.length > 0) {
                            csvUploadInput.dispatchEvent(new Event('change'));
                        }
                    } else {
                        csvUploadInput.style.display = 'none';
                        dataSourceOverlay.style.display = 'none';
                        loadingOverlay.style.display = 'flex';
                        this.dispatchEvent(new CustomEvent("EVENTW2S_DB_FILL_COORDINATE_DATA"));
                    }
                }
            });

            csvUploadInput.addEventListener('change', (event) => {
                this.handleCsvUpload(event.target.files[0]);
            });
            
            mapTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.mapType = radio.value;
                    this.renderMap();
                });
            });
        }

        async handleCsvUpload(file) {
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (event) => {
                const csvData = event.target.result;
                const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');
                const dataSourceOverlay = this.shadowRoot.querySelector('#d-data-source-overlay');
                const loadingProgress = this.shadowRoot.querySelector('#loading-progress');
                dataSourceOverlay.style.display = 'none';
                loadingOverlay.style.display = 'flex';
                let progress = 0;
                this.DB_COORDINATE_DATA = this.parseCsv(csvData, (count) => {
                    progress = count;
                    loadingProgress.textContent = progress;
                });
                loadingProgress.textContent = progress;
                loadingOverlay.style.display = 'none';
                this.renderMap();
            };
            reader.readAsText(file);
        }

        parseCsv(csvData, progressCallback) {
            const lines = csvData.split('\n');
            const headers = lines[0].split(',');
            const result = [];

            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const currentLine = lines[i].split(',');

                if (currentLine.length === 1 && currentLine[0] === "") {
                    continue;
                }

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j].trim()] = currentLine[j].trim();
                }

                result.push({
                    properties: {
                        title: obj.TITLE,
                        lat: obj.LAT,
                        long: obj.LNG,
                        icon: obj.IconUrl,
                        image: obj.ImageUrl
                    },
                    id: obj.TITLE
                });

                if (progressCallback) {
                    progressCallback(i);
                }
            }
            return result;
        }

        async set_coordinate_master_data(DB_COORDINATE_DATA) {
            this.DB_COORDINATE_DATA = DB_COORDINATE_DATA;
            if (this.dataSource === 'sac') {
                this.renderMap();
            }
        }

        async set_google_mapsjs_api_key(api_key) {
            this.google_mapsjs_api_key = api_key;
        }


        async renderMap() {
            this.clear_views();
            if (this.mapType === 'google' && this.DB_COORDINATE_DATA.length > 0) {
                await this.fe_gm_init();
                this.fe_render_gMaps();
            } else if (this.mapType === 'osm' && this.DB_COORDINATE_DATA.length > 0) {
                await this.fe_osm_init();
                this.fe_render_osMaps();
            }
        }
        
        async fe_gm_init() {
            return new Promise((resolve, reject) => {
                var script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this.google_mapsjs_api_key}&callback=initMap&loading=async&v=weekly&libraries=marker`;
                script.defer = true;
                script.onerror = () => {
                    console.error('Error loading Google Maps API');
                    reject(new Error('Error loading Google Maps API'));
                };
                document.head.appendChild(script);
        
                window.initMap = () => {
                    resolve();
                };
            });
        }

        async fe_render_gMaps(){
            this.clear_views();

            const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');

            if (this.markerCluster) {
                this.markerCluster.clearMarkers();
                this.markerCluster = null;
            }
            if (this.FE_GM_MARKERS && this.FE_GM_MARKERS.length > 0) {
                this.FE_GM_MARKERS.forEach(marker => marker.setMap(null));
                this.FE_GM_MARKERS = [];
            }

            const bounds = new google.maps.LatLngBounds();
            var mapContainer = this.shadowRoot.querySelector('#d-google-map');
            mapContainer.style.display ='flex';
            this.fe_gm_map = new google.maps.Map(mapContainer, {
                zoom: 8,
                mapId: 'DEMO_MAP_ID'
            });

            google.maps.event.trigger(this.fe_gm_map, 'resize');

            this.DB_COORDINATE_DATA.forEach(dataPoint => {
                const markerImg = document.createElement("img");
                if (dataPoint.properties.icon && dataPoint.properties.icon.trim() !== "") {
                    markerImg.src = dataPoint.properties.icon;
                } else {
                    // Use default marker image
                    markerImg.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                }
                
                var lat_m = parseFloat(dataPoint.properties.lat);
                var lng_m = parseFloat(dataPoint.properties.long);
                var image_Url = dataPoint.properties.image;


                if (lat_m && lng_m) {
                    const position = { lat: lat_m, lng: lng_m };
                    bounds.extend(position);
                    let marker = new google.maps.marker.AdvancedMarkerElement({
                        map : this.fe_gm_map,
                        position,
                        content: markerImg,
                        title: dataPoint.id,
                    });

                    this.FE_GM_MARKERS.push(marker);

                    marker.addListener('click', (event) => {
                        this.fe_gm_map.setZoom(15);
                        this.fe_gm_map.setCenter(position);
                        var infoWindow = new google.maps.InfoWindow();

                        var tableContent = this.generateTableContent(image_Url);
                        

                        infoWindow.setContent(tableContent);
                        infoWindow.open(this.fe_gm_map, marker);
                    });
                }
            });

            if (this.FE_GM_MARKERS.length > 0) {
                this.fe_gm_map.fitBounds(bounds);
            }

            if (this.FE_GM_MARKERS.length > 20) {
                var script = document.createElement('script');
                script.src = `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`;
                script.onerror = () => console.error('Error loading MarkerClusterer library.');
                document.head.appendChild(script);

                script.onload = () => {
                    this.markerCluster = new markerClusterer.MarkerClusterer({
                        markers: this.FE_GM_MARKERS,
                        map: this.fe_gm_map,
                    });
                };
            } 
            else {
                console.log("No valid markers to display");
            }
            loadingOverlay.style.display = 'none';
        }

        async fe_osm_init() {
            return new Promise(async (resolve, reject) => {
                try {
                    // Create a dedicated container for Leaflet resources
                    if (!this.leafletContainer) {
                        this.leafletContainer = document.createElement('div');
                        this.leafletContainer.id = 'leaflet-resources';
                        document.body.appendChild(this.leafletContainer);
                    }
                    
                    // Load Leaflet CSS
                    if (!document.querySelector('link[href*="leaflet.css"]')) {
                        const leafletCSS = document.createElement('link');
                        leafletCSS.rel = 'stylesheet';
                        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                        document.head.appendChild(leafletCSS);
                    }
                    
                    // Load MarkerCluster CSS
                    if (!document.querySelector('link[href*="MarkerCluster.Default.css"]')) {
                        const markerClusterCSS = document.createElement('link');
                        markerClusterCSS.rel = 'stylesheet';
                        markerClusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
                        document.head.appendChild(markerClusterCSS);
                    }
                    
                    // Load Leaflet JS (main library)
                    if (!window.L) {
                        await new Promise((resolveLeaflet, rejectLeaflet) => {
                            const leafletScript = document.createElement('script');
                            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                            leafletScript.onload = resolveLeaflet;
                            leafletScript.onerror = rejectLeaflet;
                            document.head.appendChild(leafletScript);
                        });
                    }
                    
                    // Once Leaflet is loaded, load MarkerCluster JS
                    if (!window.L.markerClusterGroup) {
                        await new Promise((resolveMarkerCluster, rejectMarkerCluster) => {
                            const markerClusterScript = document.createElement('script');
                            markerClusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
                            markerClusterScript.onload = resolveMarkerCluster;
                            markerClusterScript.onerror = rejectMarkerCluster;
                            document.head.appendChild(markerClusterScript);
                        });
                    }
                    
                    // Small delay to ensure everything is initialized properly
                    setTimeout(() => {
                        resolve();
                    }, 200);
                } catch (error) {
                    console.error("Error initializing OSM dependencies:", error);
                    reject(error);
                }
            });
        }

        async fe_render_osMaps() {
            this.clear_views();
            const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');
            loadingOverlay.style.display = 'flex';
            
            try {
                const osMapContainer = this.shadowRoot.getElementById('d-os-map');
                osMapContainer.style.display = 'flex';
                
                // Check if the map already exists and remove it
                if (this.fe_os_map) {
                    this.fe_os_map.remove();
                    this.fe_os_map = null;
                }
                
                // Check if Leaflet is available
                if (!window.L) {
                    console.error("Leaflet library is not available");
                    loadingOverlay.style.display = 'none';
                    return;
                }
                
                // Initialize map
                this.fe_os_map = L.map(osMapContainer).setView([51.1657, 10.4515], 6); // Centered on Germany
                
                // Add the tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(this.fe_os_map);
                
                // Check if MarkerCluster is available
                if (!L.markerClusterGroup) {
                    console.error("MarkerCluster is not available");
                    loadingOverlay.style.display = 'none';
                    return;
                }
                
                // Create marker cluster group
                const markerCluster = L.markerClusterGroup();
                
                // Create marker icon
                const mapIcon = L.Icon.extend({
                    options: {
                        shadowUrl: '',
                        iconSize: [30, 30],
                        shadowSize: [50, 64],
                        iconAnchor: [20, 20],
                        shadowAnchor: [4, 62],
                        popupAnchor: [0, -10]
                    }
                });
                
                // Icon URLs for markers
                const iconUrls = [
                    'https://mridul0007.github.io/GoogleMaps/dog.png',
                    'https://mridul0007.github.io/GoogleMaps/cat.png',
                    'https://mridul0007.github.io/GoogleMaps/car.png',
                ];
                
                const bounds = L.latLngBounds();
                
                // Add markers to the cluster
                this.DB_COORDINATE_DATA.forEach((point, index) => {
                    const lat = parseFloat(point.properties.lat);
                    const lng = parseFloat(point.properties.long);
                    
                    if (isNaN(lat) || isNaN(lng)) {
                        console.warn("Invalid coordinates:", point);
                        return;
                    }
                    
                    const iconUrl = iconUrls[index % iconUrls.length];
                    const imageUrl = point.properties.image;
                    const tableContent = this.generateTableContent(imageUrl);
                    const setIcon = new mapIcon({ iconUrl: iconUrl });
                    
                    const marker = L.marker([lat, lng], { icon: setIcon });
                    
                    marker.on('click', (e) => {
                        this.fe_os_map.setView(e.latlng, 15);
                    });
                    
                    marker.bindPopup(tableContent, { 
                        autoPan: true, 
                        anchor: [0.5, -0.5], 
                        keepInView: true 
                    });
                    
                    markerCluster.addLayer(marker);
                    bounds.extend([lat, lng]);
                });
                
                // Add the marker cluster to the map
                this.fe_os_map.addLayer(markerCluster);
                
                // Fit map to bounds if there are any
                if (bounds.isValid()) {
                    this.fe_os_map.fitBounds(bounds);
                }
                
                // Give the map a moment to render properly
                setTimeout(() => {
                    this.fe_os_map.invalidateSize();
                }, 100);
                
            } catch (error) {
                console.error("Error rendering OSM map:", error);
            } finally {
                loadingOverlay.style.display = 'none';
            }
        }

        generateTableContent(image_Url){
            return  `
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
                <td class="tg-0lax">PPS:</td>
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
        }

        async clear_views(){
            this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
            this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
        }
    }

    customElements.define('com-example-maps', CombinedMap);
})();