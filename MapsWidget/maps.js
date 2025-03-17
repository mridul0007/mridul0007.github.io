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
                height: 94%;
                width: 100%;
                display: block;
            }

            #d-data-source-overlay {
                position: static;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: none; /* Default to visible */
                text-align: center;
                color: white;
                flex-direction: column; /* Stack elements vertically */
                align-items: center; /* Center horizontally */
                justify-content: center; /* Center vertically */
            }


            #d-os-map {
                height: 100%;
                width: 100%;
                display: block; 
                position: static
            }
            
            #d-google-map {
                height: 100%;
                width: 100%;
                display: none; 
                position: static
            }


            .leaflet-popup-content-wrapper {
                height: 600px; /* Adjust this value as needed */
                overflow-y: auto;
                width:420px;
              }

            #d-bottom-bar {
                height: 6%;
                width: 100%;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;  
                justify-content: space-between;
                align-items: center; 
                position: relative; 
                
                
            }

            #d-map-toggle {
                
                background: transparent;
                border-radius: 4px;
            }

            #d-footnote {
                font-size: 10px;
                color: white;
                position: relative;
                margin-right: 30px;
                
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
                align-items: center; /* Center horizontally */
                justify-content: center; /* Center vertically */
                flex-direction: column; /* Stack elements vertically */
}
            }

            #loading-animation {
                border: 8px solid rgba(255, 255, 255, 0.3);
                border-top: 8px solid white;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
                <div id="d-os-map"></div>
                <div id="d-google-map"></div>
            </div>
            <div id="d-bottom-bar">
                <div id="d-map-toggle">
                    <label><input type="radio" name="mapType" value="google" > Google Maps</label>
                    <label><input type="radio" name="mapType" value="osm" checked> OpenStreet Maps</label>
                </div>
                <div id="d-footnote">Contigo custom Maps widget</div>
            </div>

            <div id="d-loading-overlay">
             <div id="loading-animation"></div>
                <p>Loading data...</p>       
            </div>

        </div>
        


    `;

class CombinedMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.fe_osm_map = null;
        this.fe_gm_map = null;
        this.DB_COORDINATE_DATA = {};
        this.FE_GM_MARKERS = [];
        this.FE_OS_MARKER = [];
        this.dataSource = "";
        this.mapType = 'osm';
        //this.fe_init_osMaps();
        //this.fe_init_gMaps();
        this.init();
    }



    async init() {

        try{
            
            await this.fe_init_osMaps();

        } catch (error) {
            console.error("Error loading OSM dependencies:", error);
            return false;
        }
        

        
        const confirmButton = this.shadowRoot.querySelector('#confirmSource');
        const mapTypeRadios = this.shadowRoot.querySelectorAll('input[name="mapType"]');
        const csvUploadInput = this.shadowRoot.querySelector('#csvUpload');

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
                    // dataSourceOverlay.style.display = 'none';
                    this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'block';
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

    async renderMap(){

        
        if (this.mapType === 'google' && this.DB_COORDINATE_DATA.length > 0) {
            this.set_loadingScreen_overlay();
            if(this.FE_GM_MARKERS.length === 0)
            {
                this.fe_render_gMaps();
            }
            else
            {
                this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
                this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
                this.shadowRoot.querySelector('#d-google-map').style.display = 'block';
            }
            
        } else if (this.mapType === 'osm' && this.DB_COORDINATE_DATA.length > 0) {
            this.set_loadingScreen_overlay();
            if(this.FE_OS_MARKER.length === 0)
                {
                    this.fe_render_osMaps();
                }
                else
                {
                    this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
                    this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
                    this.shadowRoot.querySelector('#d-os-map').style.display = 'block';
                }
            
        }

    }


    async set_dataSource_overlay()
    {

        
        this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'flex';
    }

    async set_loadingScreen_overlay()
    {
        this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'none';
        this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'block';


    }


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

    async fe_init_gMaps() {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.google_mapsjs_api_key}&callback=initgMap&loading=async&v=weekly&libraries=marker`;
            script.defer = true;
            script.onerror = () => {
                console.error('Error loading Google Maps API');
                reject(new Error('Error loading Google Maps API'));
            };
            document.head.appendChild(script);
    
            window.initgMap = () => {
                var mapContainer = this.shadowRoot.getElementById('d-google-map');
                this.fe_gm_map = new google.maps.Map(mapContainer, {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8,
                    mapId: 'DEMO_MAP_ID'
                });
                resolve();
            };
        });
    }


    fe_render_gMaps(){

        this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'none';
        

        if (this.markerCluster) {
            this.markerCluster.clearMarkers();
            this.markerCluster = null;
        }
        if (this.FE_GM_MARKERS && this.FE_GM_MARKERS.length > 0) {
            this.FE_GM_MARKERS.forEach(marker => marker.setMap(null));
            this.FE_GM_MARKERS = [];
        }

        const bounds = new google.maps.LatLngBounds();
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

                    marker.addListener('gmp-click', (event) => {
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

                    google.maps.event.addListener(this.markerCluster, 'clusteringend', () => {
                        console.log("Clustering finished");
                        this.shadowRoot.querySelector('#d-google-map').style.display = 'block';
                        this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
                    });
                };
            } 
            else {
                this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
            this.shadowRoot.querySelector('#d-google-map').style.display = 'block';
            }

            
            
        
    }

    fe_render_osMaps(){

        this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'none';
        this.shadowRoot.querySelector('#d-os-map').style.display = 'block';
        const osMapContainer = this.shadowRoot.querySelector('#d-os-map');

        var bounds = new L.LatLngBounds();

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

        if(markerCluster){
            markerCluster.clearLayers();
        }
        
        var iconUrl = '';
        const mapInstance = this.fe_osm_map;

        for (var i = 0; i < this.DB_COORDINATE_DATA.length; i++) {
            var lat_m = this.DB_COORDINATE_DATA[i].properties["lat"];
            var lng_m = this.DB_COORDINATE_DATA[i].properties["long"];
            
                if (this.DB_COORDINATE_DATA[i].properties.icon && this.DB_COORDINATE_DATA[i].properties.icon.trim() !== "") {
                    iconUrl = this.DB_COORDINATE_DATA[i].properties.icon;
                } else {
                    // Use default marker image
                    iconUrl =  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                }
            var image_Url = this.DB_COORDINATE_DATA[i].properties["image"];
            var tableContent = this.generateTableContent(image_Url);

            var setIcon = new mapIcon({ iconUrl: iconUrl });
            var marker =  L.marker([lat_m, lng_m], { icon: setIcon });

           
            marker.on('click', function(e) {
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;
                mapInstance.setView(e.latlng, 15);
            }.bind(this)); 
            marker.bindPopup(tableContent,{ autoPan: true, anchor: [0.5, -0.5], keepInView: true });
            markerCluster.addLayer(marker);
            bounds.extend([lat_m, lng_m]);
            this.FE_OS_MARKER.push(marker);
        }

        this.fe_osm_map.addLayer(markerCluster);
        this.fe_osm_map.fitBounds(bounds);
        this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
    }



    async set_coordinate_master_data(DB_COORDINATE_DATA) {
        this.DB_COORDINATE_DATA = DB_COORDINATE_DATA;
        if (this.dataSource === 'sac') {
            this.renderMap();
        }
    }

    async set_google_mapsjs_api_key(api_key) {
        this.google_mapsjs_api_key = api_key;
        this.fe_init_gMaps();
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
        return new Promise((resolve) => { // Wrap in a Promise for async/await
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => {
                this.initosMap();
                resolve(); // Resolve the promise when Leaflet is loaded
            };
            this.shadowRoot.appendChild(script);
        });
    }

    async loadMarkerClusterCSS() {

        const stylesheets = [
            'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
            'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css'
        ];
    
        stylesheets.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            this.shadowRoot.appendChild(link);
        });
    }

    async loadMarkerClusterJS() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
            script.onload = () => {
                resolve();
            };
            this.shadowRoot.appendChild(script);
        });
    }

    initosMap() {
        this.fe_osm_map = L.map(this.shadowRoot.getElementById('d-os-map')).setView([51.1657, 10.4515], 6); // Centered on Germany
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.fe_osm_map);

        this.set_dataSource_overlay();
    }


    async handleCsvUpload(file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const csvData = event.target.result;
            const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');
            // const loadingProgress = this.shadowRoot.querySelector('#loading-progress');
            
 
            let progress = 0;
            this.DB_COORDINATE_DATA = this.parseCsv(csvData, (count) => {
                progress = count;
                //  loadingProgress.textContent = progress;
            });
            // loadingProgress.textContent = progress;

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

    async set_data_count(progress_count){
        // const loadingProgress = this.shadowRoot.querySelector('#loading-progress');
        loadingProgress.textContent = progress_count;
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


    
}
// console
// everything is working now

customElements.define('com-example-maps', CombinedMap);
})();