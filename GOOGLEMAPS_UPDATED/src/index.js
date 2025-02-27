import { MarkerClusterer } from '@googlemaps/markerclusterer';

(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #loading_overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 9999;
                align-items: center;
                justify-content: center;
            }

            #loading_spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 4px solid white;
                border-top: 4px solid transparent;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }

            #map-container {
                height: 100%;
                width: 100%;
            }
        </style>

        <div id="map-container"></div>
        <div id="loading_overlay">
            <div id="loading_spinner"></div>
        </div>
    `;

    class GoogleMaps extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.plm_data = {};
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.shadowRoot.getElementById('loading_overlay').style.display = "block";
        }

        async set_api_key(api_key) {
            // Load the Google Maps JavaScript API with the provided key
            let script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap&v=weekly&libraries=marker`;
            script.async = true;
            script.defer = true;
            script.onerror = () => console.error('Error loading Google Maps API');

            // Attach the script to the document
            document.head.appendChild(script);

            // Define the callback function (initMap) that will be called when the API is loaded
            window.initMap = () => {
                this.renderMap(); // Call renderMap here, after the API is loaded.
            };
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            if (window.google && window.google.maps) {
                this.renderMap();
            }
        }

        renderMap() {
            const startTime = new Date();
            let mapContainer = this.shadowRoot.querySelector('#map-container');

            const mapStyles = [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                },
            ];

            const map = new google.maps.Map(mapContainer, {
                center: { lat: 0, lng: 0 },
                zoom: 2,
                disableDefaultUI: true,
                styles: mapStyles,
            });

            const markers = [];
            const bounds = new google.maps.LatLngBounds();

            this.plm_data.forEach((data) => {
                const lat_m = parseFloat(data.properties["lat"]);
                const lng_m = parseFloat(data.properties["long"]);
                const imageUrl = data.properties["image"];

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lat: lat_m, lng: lng_m },
                    title: data.id,
                    map: map,
                    content: this.createMarkerContent(data, imageUrl, map)
                });

                markers.push(marker);
                bounds.extend({ lat: lat_m, lng: lng_m });
            });

            map.fitBounds(bounds);
            map.panToBounds(bounds);

            // Use the MarkerClusterer:
            const markerCluster = new MarkerClusterer({ map, markers });

            const endTime = new Date();
            const duration = endTime - startTime;
            console.log(duration);

            this.shadowRoot.getElementById('loading_overlay').style.display = "none";
        }

        createMarkerContent(data, imageUrl, map) {
            const markerContent = document.createElement('div');
            markerContent.style.cursor = 'pointer';

            const icon = document.createElement('img');
            icon.src = imageUrl;
            icon.style.width = '30px';
            icon.style.height = '30px';
            markerContent.appendChild(icon);

            markerContent.addEventListener('click', () => {
                map.setZoom(15);
                map.setCenter({ lat: parseFloat(data.properties["lat"]), lng: parseFloat(data.properties["long"]) });

                const infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(this.createInfoWindowContent(data, imageUrl));
                infoWindow.open(map, {
                    lat: parseFloat(data.properties["lat"]),
                    lng: parseFloat(data.properties["long"])
                });
            });

            return markerContent;
        }

        createInfoWindowContent(data, imageUrl) {
            return `
                <style type="text/css">
                    .tg {border-collapse:collapse;border-spacing:0;}
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
                            <td class="tg-baqh" colspan="4"><img src="${imageUrl}" alt="Image" style="max-width: 200px; max-height: 200px;"></td>
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
                            <td class="tg-0lax">Tages