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
                height: 92%;
                width: 100%;
                display: block;
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
                max-height: 400px; /* Adjust this value as needed */
                overflow-y: auto;
              }

            #d-bottom-bar {
                height: 42px;
                width: 755px;
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;  
                justify-content: space-between;
                align-items: center; 
                padding: 0 10px; 
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
        </style>
       <div id="d-widget-container">
            <div id="d-map-container">
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
        this.dataSource = "";
        this.fe_init_osMaps();
        this.init();
    }

    map = null;

    init() {

        const mapTypeRadios = this.shadowRoot.querySelectorAll('input[name="mapType"]');
        mapTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.mapType = radio.value;
                this.renderMap();
            });
        });
    }

    async renderMap(){

        if (this.mapType === 'google') {
            this.fe_render_gMaps();
        } else if (this.mapType === 'osm' ) {
            this.fe_render_osMaps();
        }

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
                var mapContainer = this.shadowRoot.querySelector('#d-google-map');
                //mapContainer.style.display ='block';
                this.fe_gm_map = new google.maps.Map(mapContainer, {
                    zoom: 8,
                    mapId: 'DEMO_MAP_ID'
                });


                resolve();
            };
        });
    }


    fe_render_gMaps(){

        this.shadowRoot.querySelector('#d-os-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-google-map').style.display = 'block';
    }

    fe_render_osMaps(){

        this.shadowRoot.querySelector('#d-google-map').style.display = 'none';
        this.shadowRoot.querySelector('#d-os-map').style.display = 'block';
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
        this.fe_osm_map = L.map(this.shadowRoot.getElementById('d-os-map')).setView([51.1657, 10.4515], 6); // Centered on Germany
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.fe_osm_map);
    }

    async set_data(plm_data) {
        this.plm_data = plm_data;
        this.renderMap();
    }

    
}
// console

customElements.define('com-example-maps', CombinedMap);
})();