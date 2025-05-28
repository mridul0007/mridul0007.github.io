/**
 * @file Contigo Consulting AG Custom Maps Widget
 * @author  / MKoshy | JBuergmayr /
 * @copyright © Contigo Consulting AG, Brüsseler Str. 89-93, 50672 Köln. All rights reserved.
 * This code is the intellectual property of Contigo Consulting AG and is not to be used, reproduced, or distributed without explicit permission.
 */


(function () {


    // Constants for loading Leaflet CSS and JavaScript libraries.
    const osMap_loadLeafletCSS_href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const osMap_loadLeafletCSS_integrity =   'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    const osMap_loadLeafletJS_src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    const osMap_loadLeafletJS_integrity =  'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    const osMap_loadMarkerClusterCSS_href = [
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css'
    ];
    const osMap_loadMarkerClusterJS_src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster-src.js';
    // Constant for loading Google Maps Marker Clusterer library.
    const gMap_cluster_src = `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`;


    const google_mapsjs_api_key_in_js = ''; // Google Maps API key.
    const default_map_in_js = "";                           // default map to load  [3 possible values - 'google', 'osm', '' ]  value '' displays datasource overlay


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
                display: flex;
            }

            #d-data-source-overlay {
                position: static;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: none; /* Default to visible */
                text-align: center;
                color: white;
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
            }


            #d-osMap {
                height: 100%;
                width: 100%;
                display: block; 
                position: static
            }
            
            #d-gMap {
                height: 100%;
                width: 100%;
                display: none; 
                position: static
            }

            .leaflet-popup-content {
            width: auto;
            }


            .leaflet-popup-content-wrapper {
                overflow-y: auto;
                padding-top: 10px;
                padding: 10px;
              }

            .tg {
                border-collapse: collapse;
                border-spacing: 0;
                table-layout: auto;
            }
            .tg img {
                max-width: 400px;
                height: auto;
                display: block; /* Remove extra spacing */
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
                background-color:  #A4D6D4;
                display: none; /* Hidden by default */
                text-align: center;
                color: white;
                padding-top: 280px; 
                align-items: center; 
                justify-content: center; 
                flex-direction: column; 
}
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
                <div id="d-osMap"></div>
                <div id="d-gMap"></div>
            </div>
            <div id="d-bottom-bar">
                <div id="d-map-toggle">
                    <label><input type="radio" id='rb_gMap' name="rbg_mapType" value="google" checked> Google Maps</label>
                    <label><input type="radio" id='rb_osMap'name="rbg_mapType" value="osm" > OpenStreet Maps</label>
                </div>
                <div id="d-footnote">Contigo custom Maps widget</div>
            </div>

            <div id="d-loading-overlay">
                <p id="loading-text">Loaded 0 datapoints...</p>  
            </div>

        </div>
        


    `;

class CombinedMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.fe_osMap = null;                           // Leaflet map instance.
        this.fe_gMap = null;                            // Google Maps instance.
        this.DB_COORDINATE_DATA = [];                   // Array to store coordinate data.
        this.fe_gMap_markers = [];                      // Array to store Google Maps markers.
        this.fe_osMap_markers = [];                     // Array to store Leaflet markers.
        this.dataSource = "";                           // Selected data source (sac or csv).
        this.mapType = 'google';                       // assigning  Current map type (google or osm) based on the toggle button. default checked google.
        this.gMap_markerCluster = null;                 // Google Maps Marker Clusterer instance.
        this.markerClustererLoaded = false;
        this.google_mapsjs_api_key = google_mapsjs_api_key_in_js;
        this.default_map = default_map_in_js;
        this.gMapLoaded = false;                       // check whether map is loaded from widget api key or by set api key method
        this.init();
    }

    /**
     * Initializes the component by loading map dependencies and setting up event listeners.
     */

    async init() {
        // console.log("reached init");
        try{ 
            await this.fe_init_osMap();     // calls Open Street map initialization method
        } catch (error) {
            console.error("Error loading OSM dependencies:", error);
            return false;
        }


        try{ 
            if(this.google_mapsjs_api_key!= '' && this.fe_gMap === null)    // check if google maps api key is provided in the constructor before calling google maps initialization method
            {
                // console.log("reached init inside google block");
                await this.fe_init_gMap();
            }
        } catch (error) {
            console.error("Error loading google dependencies:", error);
            return false;
        }

        // call method set default map to with constructor given value
        this.set_default_map(this.default_map);
        
        const confirmButton = this.shadowRoot.querySelector('#confirmSource');
        const mapTypeRadios = this.shadowRoot.querySelectorAll('input[name="rbg_mapType"]');
        const csvUploadInput = this.shadowRoot.querySelector('#csvUpload');

        // Event Listner for the confirm buttom
        confirmButton.addEventListener('click', () => {
            const selectedSource = this.shadowRoot.querySelector('input[name="dataSource"]:checked');
            if (selectedSource) {
                this.dataSource = selectedSource.value;
                                                    // datasource values : [csv or sac] 
                if (this.dataSource === 'csv') {                       // csv selection
                    csvUploadInput.style.display = 'block';
                    if (csvUploadInput.files.length > 0) {
                        csvUploadInput.dispatchEvent(new Event('upload'));
                    }
                } else {                                               // sac selection
                    csvUploadInput.style.display = 'none';
                    this.fe_set_view_loadingScreen_overlay();
                    this.dispatchEvent(new CustomEvent("EVENTW2S_DB_FILL_COORDINATE_DATA"));
                }
            }
        });

        // Event Listener for the upload button 
        csvUploadInput.addEventListener('upload', (event) => {
            this.DB_handleCsvUpload(event.target.files[0]);
        });


        //  Event Listener for the radio button
        mapTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.mapType = radio.value;
                this.renderMap();
            });
        });

    }

    // Widget Render method. Renders the map based on the selected map type "google" [Google Maps] or "osm" [OpenStreetMap] and available data.
    async renderMap(){

        
        if (this.mapType === 'google' && this.DB_COORDINATE_DATA.length > 0) {
            this.fe_set_view_loadingScreen_overlay();
            if(this.fe_gMap_markers.length === 0)
            {   
                this.fe_set_view_gMap();
                this.shadowRoot.querySelector("#loading-text").textContent = `Inserting ${this.DB_COORDINATE_DATA.length} datapoints into ${this.mapType} Maps...`;
                this.fe_set_view_loadingScreen_overlay();
                await this.fe_render_gMap();
                this.fe_set_view_gMap();
            }
            else
            {
                this.fe_set_view_gMap();

            }
            
        } else if (this.mapType === 'osm' && this.DB_COORDINATE_DATA.length > 0) {
            this.fe_set_view_loadingScreen_overlay();
            if(this.fe_osMap_markers.length === 0)
                {   
                    this.fe_set_view_osMap();
                    this.shadowRoot.querySelector("#loading-text").textContent = `Inserting ${this.DB_COORDINATE_DATA.length} datapoints into ${this.mapType} Maps...`;
                    this.fe_set_view_loadingScreen_overlay();
                    await this.fe_render_osMap();
                    this.fe_set_view_osMap();

                }
                else
                {   
                    
                    this.fe_set_view_osMap();
                    this.fe_osMap.invalidateSize();
                }
            
        }

    }

    /** Sets the view to display the data source selection overlay. */
    async fe_set_view_dataSource_overlay()
    { 
        this.shadowRoot.querySelector('#d-osMap').style.display = 'none';
        this.shadowRoot.querySelector('#d-gMap').style.display = 'none';
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'flex';
    }

    /** Sets the view to display the loading screen overlay. */
    async fe_set_view_loadingScreen_overlay()
    {
    this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'block';
     }

     /** Sets the view to display the Google Maps interface. */
    async fe_set_view_gMap()
    {
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'none';
        this.shadowRoot.querySelector('#d-osMap').style.display = 'none';
        this.shadowRoot.querySelector('#d-gMap').style.display = 'block';
        this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';
        
    }

    /** Sets the view to display the OpenStreetMap interface. */
    async fe_set_view_osMap()
    {
        this.shadowRoot.querySelector('#d-data-source-overlay').style.display = 'none';
        this.shadowRoot.querySelector('#d-gMap').style.display = 'none';
        this.shadowRoot.querySelector('#d-osMap').style.display = 'block';
        this.shadowRoot.querySelector('#d-loading-overlay').style.display = 'none';

    }

    /** Initializes the OpenStreetMap (OSM) by loading Leaflet and Marker Cluster dependencies. */   
    async fe_init_osMap(){

        try {
                
            await this.osMap_loadLeafletCSS();  
            await this.osMap_loadLeafletJS();
            await this.osMap_loadMarkerClusterCSS();
            await this.osMap_loadMarkerClusterJS(); 
            console.log("All OSM dependencies loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading OSM dependencies:", error);
            return false;
        }
    }

     /** Renders the OpenStreetMap with markers based on the coordinate data. */
    fe_render_osMap(){


        return new Promise((resolve, reject) => {
            try {
                var bounds = new L.LatLngBounds();
                var mapIcon = L.Icon.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [-100, -20]
                    }
                });
    
                var markerCluster = L.markerClusterGroup();
    
                if (markerCluster) {
                    markerCluster.clearLayers();
                }
    
                var iconUrl = '';
                const mapInstance = this.fe_osMap;
    
                for (var i = 0; i < this.DB_COORDINATE_DATA.length; i++) {
                    var lat_m = this.DB_COORDINATE_DATA[i].properties["lat"];
                    var lng_m = this.DB_COORDINATE_DATA[i].properties["long"];
    
                    if (this.DB_COORDINATE_DATA[i].properties.icon && this.DB_COORDINATE_DATA[i].properties.icon.trim() !== "") {
                        iconUrl = this.DB_COORDINATE_DATA[i].properties.icon;
                    } else {
                        iconUrl = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                    }
                    var image_Url = this.DB_COORDINATE_DATA[i].properties["image"];    
                    var setIcon = new mapIcon({ iconUrl: iconUrl });
                    var marker = L.marker([lat_m, lng_m], { icon: setIcon });
                    marker.image_Url = image_Url;
                    
                    marker.on('click', (e) =>  {
                        const mapDiv = this.shadowRoot.getElementById('d-osMap');
                        const mapHeight = mapDiv.clientHeight;
                        const clickedMarker = e.target;
                        mapInstance.setView(e.latlng, 20);
                        var px = mapInstance.project(e.latlng);
                        console.log(px);
                        px.y -= mapHeight / 2.5;
                        console.log(px);
                        var tableContent = this.fe_generateTableContent(clickedMarker.image_Url);
                        const content = `<div style="max-width: none;">${tableContent}</div>`;
                        clickedMarker.bindPopup(content , { maxWidth: "auto", autoPanPaddingBottomRight: L.point(30,30), autoPanPaddingTopLeft: L.point(30,30) }).openPopup(); 
                        mapInstance.panTo(mapInstance.unproject(px), { animate: true });
                    });
                    
                    markerCluster.addLayer(marker);
                    bounds.extend([lat_m, lng_m]);
                    this.fe_osMap_markers.push(marker);
                }
    
                this.fe_osMap.addLayer(markerCluster);
                this.fe_osMap.fitBounds(bounds);
    
                setTimeout(() => {
                    this.fe_osMap.invalidateSize();
                    this.fe_osMap.fitBounds(bounds);
                    resolve(); 
                }, 100);
            } catch (error) {
                reject(error); 
            }
        });
    }

    /** Initializes the Google Maps instance by loading the Google Maps API and Marker Clusterer library. */
    async fe_init_gMap() {
        if(this.gMapLoaded === false)
        {   
            this.gMapLoaded = true;
            return new Promise((resolve, reject) => {
                var script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this.google_mapsjs_api_key}&callback=initgMap&loading=async&v=weekly&libraries=marker`;
                script.defer = true;
                script.onerror = () => {
                    console.error('Error loading Google Maps API');
                    reject(new Error('Error loading Google Maps API'));
                };
                document.head.appendChild(script);
                
                // Define the callback function that will be executed when the Google Maps API is loaded.
                window.initgMap = () => {
                    var mapContainer = this.shadowRoot.getElementById('d-gMap');
                    if (mapContainer) {
                        this.fe_gMap = null;
                        mapContainer.innerHTML = '';
                    }
                    // Create a new Google Maps instance and initialize it with the provided options (default lat,lng Contigo Consulting AG).  
                    this.fe_gMap = new google.maps.Map(mapContainer, {
                        center: { lat: 50.94195189462832, lng: 6.934832969310373}, 
                        zoom: 8,
                        mapId: 'f61d67e24706f841'
    
                    })
                    console.log("Gmap loaded");
                    ;
    
                    const clustererScript = document.createElement('script');
                    clustererScript.src = gMap_cluster_src;
                    clustererScript.onerror = () => console.error('Error loading MarkerClusterer library.');
                    clustererScript.onload = () => {
                        console.log("gmap Marker cluster loaded");
                         this.markerClustererLoaded =  true;
                    resolve();
                    };
                    document.head.appendChild(clustererScript);
                };
                
            });
        }
        
    }

      /** Renders the Google Maps with markers based on the coordinate data. */
    fe_render_gMap(){

        return new Promise((resolve, reject) => {
            try {
                if (this.gMap_markerCluster) {
                    this.gMap_markerCluster.clearMarkers();
                    this.gMap_markerCluster = null;
                }
                if (this.fe_gMap_markers && this.fe_gMap_markers.length > 0) {
                    this.fe_gMap_markers.forEach(marker => marker.setMap(null));
                    this.fe_gMap_markers = [];
                }
                let infoWindow = null;
                const bounds = new google.maps.LatLngBounds();
                google.maps.event.trigger(this.fe_gMap, 'resize');
    
                this.DB_COORDINATE_DATA.forEach(dataPoint => {
                    const markerImg = document.createElement("img");
                    if (dataPoint.properties.icon && dataPoint.properties.icon.trim() !== "") {
                        markerImg.src = dataPoint.properties.icon;
                    } else {
                        markerImg.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                    }
    
                    const lat_m = parseFloat(dataPoint.properties.lat);
                    const lng_m = parseFloat(dataPoint.properties.long);
                    const image_Url = dataPoint.properties.image;
    
                    if (lat_m && lng_m) {
                        const position = { lat: lat_m, lng: lng_m };
                        bounds.extend(position);
                        const marker = new google.maps.marker.AdvancedMarkerElement({
                            map: this.fe_gMap,
                            position,
                            content: markerImg,
                            title: dataPoint.id,
                        });
    
                        this.fe_gMap_markers.push(marker);
                        
                        marker.addListener('gmp-click', (event) => {
                             if (infoWindow) {
                                infoWindow.close();
                            }
                            else{
                                infoWindow = new google.maps.InfoWindow();
                            }
                            this.fe_gMap.setZoom(15);
                            this.fe_gMap.setCenter(position);
                            const tableContent = this.fe_generateTableContent(image_Url);
                            infoWindow.setContent(tableContent);
                            infoWindow.open(this.fe_gMap, marker);
                        });
                    }
                });
    
                if (this.fe_gMap_markers.length > 0) {
                    this.fe_gMap.fitBounds(bounds);
                }
    
                if (this.fe_gMap_markers.length > 20 && this.markerClustererLoaded) {
                    this.gMap_markerCluster = new markerClusterer.MarkerClusterer({
                        markers: this.fe_gMap_markers,
                        map: this.fe_gMap,
                    });
    
                    this.gMap_markerCluster.addListener('clusteringend', () => {
                        console.log("Google Map Clustering finished");
                        resolve(); 
                    });
                } else { 
                    resolve(); 
                }
                this.fe_gMap.addListener('click', () => {
                if (infoWindow) {
                    infoWindow.close();
                }
            });
            } catch (error) {
                reject(error); 
            }
        });

    }

    /** Sets the master coordinate data, handling both initial data loading and appending. */
    async set_coordinate_master_data(SAC_COORDINATE_DATA,flag) {
        if (!this.DB_COORDINATE_DATA) {
            this.DB_COORDINATE_DATA = []; 
        }
        this.DB_COORDINATE_DATA = [...this.DB_COORDINATE_DATA, ...SAC_COORDINATE_DATA];
        this.shadowRoot.querySelector("#loading-text").textContent = `Loaded ${this.DB_COORDINATE_DATA.length} datapoints from SAC...`;
        if (this.dataSource === 'sac' && flag === true) {
            this.shadowRoot.querySelector("#loading-text").textContent = `Inserting ${this.DB_COORDINATE_DATA.length} datapoints into ${this.mapType} Maps...`;
            await this.renderMap();
        }
    }

    /** Sets the Google Maps JavaScript API key and initializes the Google Maps instance. */
    async set_google_mapsjs_api_key(api_key) {
        // console.log("reached setmaps api key");
        if(this.google_mapsjs_api_key === '' && this.fe_gMap === null)
        {
            this.google_mapsjs_api_key = api_key;
            this.fe_init_gMap();
        }
        
    }

     /** Sets the default map type and triggers data loading from the data source. */
    async set_default_map(map_default){
        if(map_default != ''){

            this.mapType = map_default;
            this.dataSource = 'sac';
            if(this.mapType === 'google')
            {
                this.shadowRoot.getElementById('rb_gMap').checked = true;  
            }
            else{
                this.shadowRoot.getElementById('rb_osMap').checked = true;
            }
            this.fe_set_view_loadingScreen_overlay();
            this.dispatchEvent(new CustomEvent("EVENTW2S_DB_FILL_COORDINATE_DATA"));

            }
        

    }

    /** OSM dependency function start*/
    /** following five functions load the dependencies for OSM */
    async osMap_loadLeafletCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = osMap_loadLeafletCSS_href;
        link.integrity =  osMap_loadLeafletCSS_integrity;
        link.crossOrigin = '';
        this.shadowRoot.appendChild(link);
    }

    async osMap_loadLeafletJS() {
        return new Promise((resolve) => { 
            const script = document.createElement('script');
            script.src = osMap_loadLeafletJS_src;
            script.integrity = osMap_loadLeafletJS_integrity;
            script.crossOrigin = '';
            script.onload = () => {
                this.fe_init_onLoad_osMap();
                resolve(); 
            };
            this.shadowRoot.appendChild(script);
        });
    }

    async osMap_loadMarkerClusterCSS() {

        osMap_loadMarkerClusterCSS_href.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            this.shadowRoot.appendChild(link);
        });
    }

    async osMap_loadMarkerClusterJS() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = osMap_loadMarkerClusterJS_src;
            script.onload = () => {
                resolve();
            };
            this.shadowRoot.appendChild(script);
        });
    }
    
    /** Initializes the Leaflet map and sets the initial view to the data source overlay. */
    fe_init_onLoad_osMap() {
        this.fe_osMap = L.map(this.shadowRoot.getElementById('d-osMap')).setView([51.1657, 10.4515], 6); // Centered on Germany
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.fe_osMap);

        this.fe_set_view_dataSource_overlay();
    }

    /** OSM dependency function end*/

    /** Database function to handle CSV upload */
    async DB_handleCsvUpload(file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const csvData = event.target.result;
            this.fe_set_view_loadingScreen_overlay();
            let parsedCount = 0;
            this.DB_COORDINATE_DATA = this.DB_parseCsv(csvData, (count) => {
                parsedCount = count;
                this.shadowRoot.querySelector("#loading-text").textContent = `Loaded ${parsedCount} datapoints from file...`;
            });
            this.shadowRoot.querySelector("#loading-text").textContent = `Inserting ${this.DB_COORDINATE_DATA.length} datapoints into ${this.mapType} Maps...`;

            this.renderMap();
        };
        reader.readAsText(file);
    }

    /** Database function to parse the loaded CSV data into coordinate objects. */
    DB_parseCsv(csvData, progressCallback) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');   // header line 
        const result = [];
        let validCount = 0;

        for (let i = 1; i < lines.length; i++) {   // line by line parsing
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

            validCount++;

            if (progressCallback) {
                progressCallback(validCount);
            }
        }
        return result;
    }

    

    // Table content generator
    fe_generateTableContent(image_Url) {
        return `
        <style type="text/css">
        .tg  {border-collapse:collapse;border-spacing:0;}
        .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
        overflow:hidden;padding:0px 2px;word-break:normal;}
        .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
        font-weight:normal;overflow:hidden;padding:0px 2px;word-break:normal;}
        .tg .tg-baqh{text-align:center;vertical-align:top;justify-content: center;align-items: center;}
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
        <td class="tg-baqh" colspan="4"><img id="myPopupImage" src="${image_Url}" alt="Image"></td> 
        <!-- <td class="tg-baqh" colspan="4"><img src="http://platinpsst:85/ImageDBView/ViewImageOrg.aspx?3680010077251-02" alt="Image"></td> -->
        </tr>
        <tr>
            <td class="tg-0lax">Anbietergruppe:</td>
            <td class="tg-0lax">6</td>
            <td class="tg-0lax">7</td>
            <td class="tg-0lax">8</td>
        </tr>
        <tr>
            <td class="tg-0lax">WT-Gruppe:</td>
            <td class="tg-0lax">test content</td>
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
customElements.define('com-example-maps', CombinedMap);
})();
