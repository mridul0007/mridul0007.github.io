(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #d-widget-container {
                height: 622px;
                width: 755px;
                display: block;
            }

            #d-map-container {
                height: 580px;
                width: 755px;
            }

            #d-data-source-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: block; /* Default to visible */
                text-align: center;
                color: white;
                padding-top: 250px; /* Center content manually */
            }

            #d-confirmSource {
                margin-top: 5px;
            }

            #d-csvUpload {
                display: none;
            }

            #d-google-map, #d-os-map {
                height: 100%;
                width: 100%;
                display: none; 
                position: static
            }

            #d-bottom-bar {
                height: 42px;
                width: 755px;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: block;
                position: relative;
            }

            #d-map-toggle {
                position: absolute;
                top: 5px;
                left: 5px;
                background: transparent;
                border-radius: 4px;
            }

            #d-footnote {
                font-size: 10px;
                color: white;
                position: absolute;
                right: 10px;
                bottom: 5px;
            }

            #d-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none; /* Hidden by default */
                text-align: center;
                color: white;
                padding-top: 280px; /* Center content manually */
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
                    <label><input type="radio" name="mapType" value="google" > Google Maps</label>
                    <label><input type="radio" name="mapType" value="osm" checked> OpenStreet Maps</label>
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
            this.mapType = 'osm';
            this.google_mapsjs_api_key='';
            this.fe_gm_map = null;
            this.fe_os_map = null;
            this.fe_osm_init();
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
                        //loadingOverlay.style.display = 'block';
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
                //loadingOverlay.style.display = 'block';
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
            mapContainer.style.display ='block';
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
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                link.crossOrigin = '';
                link.onload = resolve;
                document.head.appendChild(link);
            });
        }
        
        async loadLeafletJS() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                script.crossOrigin = '';
                script.onload = this.init_bind_OSMap.bind(this);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        async loadMarkerClusterCSS() {
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
                link.onload = resolve;
                document.head.appendChild(link);
            });
        }
        
        async loadMarkerClusterJS() {
            return new Promise((resolve, reject) => {
                // Check if Leaflet is available first
                if (typeof L === 'undefined') {
                    reject(new Error("Leaflet must be loaded before MarkerCluster"));
                    return;
                }
                
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
                script.onload = () => {
                    if (L.markerClusterGroup) {
                        console.log("MarkerClusterer script loaded successfully");
                        resolve();
                    } else {
                        reject(new Error("MarkerClusterGroup not available after script load"));
                    }
                };
                script.onerror = (e) => {
                    console.error("Error loading MarkerClusterer script:", e);
                    reject(new Error("Failed to load MarkerClusterer"));
                };
                document.head.appendChild(script);
            });
        }

        init_bind_OSMap() {
            
            const osMapContainer = this.shadowRoot.querySelector('#d-os-map');
            osMapContainer.style.display = 'block';

            const resizeObserver = new ResizeObserver(() => {
                if (this.fe_os_map) {
                    this.fe_os_map.invalidateSize();
                }
            });

            resizeObserver.observe(osMapContainer);

            this.fe_os_map = L.map( osMapContainer ).setView([51.1657, 10.4515], 6); // Centered on Germany
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.fe_os_map);

            L.marker([51.5, -0.09]).addTo(this.fe_os_map)
                .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                .openPopup();

            
                
            


           // osMapContainer.style.display = 'block';
            console.log("finished binding")
        }
    
    

        async fe_render_osMaps() {
            
         console.log("reached render Os Maps")       
        
        }

        generateTableContent(image_Url) {
            return `
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

        async clear_views() {

            this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
            this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
           
        }
    }

    customElements.define('com-example-maps', CombinedMap);
})();


