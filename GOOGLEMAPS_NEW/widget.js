(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 100%;
                width: 100%;
                position: relative;
            }
            #data-source-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            #csvUpload {
                display: none;
            }
        </style>

        <div id="map-container">
            <div id="data-source-overlay">
                <p>Select Data Source:</p>
                <label><input type="radio" name="dataSource" value="sac"> SAC Input</label>
                <label><input type="radio" name="dataSource" value="csv"> CSV Upload</label>
                <input type="file" id="csvUpload" accept=".csv">
                <button id="confirmSource">Confirm</button>
            </div>
        </div>
    `;

    class GoogleMapsWidget extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.plm_data = {};
            this.markers = [];
            this.dataSource = null;
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));

            const confirmButton = this.shadowRoot.querySelector('#confirmSource');
            const csvUploadInput = this.shadowRoot.querySelector('#csvUpload');
            const dataSourceOverlay = this.shadowRoot.querySelector('#data-source-overlay');

            confirmButton.addEventListener('click', () => {
                const selectedSource = this.shadowRoot.querySelector('input[name="dataSource"]:checked');
                if (selectedSource) {
                    this.dataSource = selectedSource.value;
                    if (this.dataSource === 'csv') {
                        csvUploadInput.style.display = 'block';
                    } else {
                        csvUploadInput.style.display = 'none';
                    }
                    if (this.dataSource === 'sac') {
                        dataSourceOverlay.style.display = 'none';
                        this.dispatchEvent(new CustomEvent("onPlmQueryExecution"));
                    }
                }
            });

            csvUploadInput.addEventListener('change', (event) => {
                this.handleCsvUpload(event.target.files[0]);
                dataSourceOverlay.style.display = 'none';
            });
        }

        async set_api_key(api_key) {
            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap&loading=async&v=weekly&libraries=marker`;
            console.log("reached Set API KEY");
            script.async = true;
            script.defer = true;
            script.onerror = () => console.error('Error loading Google Maps API');
            document.head.appendChild(script);
            window.initMap = () => {};
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            if (this.dataSource === 'sac') {
                this.renderMap();
            }
        }

        async handleCsvUpload(file) {
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (event) => {
                const csvData = event.target.result;
                this.plm_data = this.parseCsv(csvData);
                this.renderMap();
            };

            reader.readAsText(file);
        }

        parseCsv(csvData) {
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
            }
            return result;
        }

        renderMap() {
            if (this.dataSource === null) return; // Wait for data source selection

            console.log("Reached rendermap");

            if (this.markerCluster) {
                this.markerCluster.clearMarkers();
                this.markerCluster = null;
            }
            if (this.markers && this.markers.length > 0) {
                this.markers.forEach(marker => marker.setMap(null));
                this.markers = [];
            }

            const bounds = new google.maps.LatLngBounds();
            var mapContainer = this.shadowRoot.querySelector('#map-container');
            var map = new google.maps.Map(mapContainer, {
                zoom: 8,
                mapId: 'DEMO_MAP_ID'
            });

            google.maps.event.trigger(map, 'resize');

            this.plm_data.forEach(dataPoint => {
                const markerImg = document.createElement("img");
                markerImg.src = dataPoint.properties.icon;
                var lat_m = parseFloat(dataPoint.properties.lat);
                var lng_m = parseFloat(dataPoint.properties.long);
                var image_Url = dataPoint.properties.image;

                if (lat_m && lng_m) {
                    const position = { lat: lat_m, lng: lng_m };
                    bounds.extend(position);
                    let marker = new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position,
                        content: markerImg,
                        title: dataPoint.id,
                    });

                    this.markers.push(marker);

                    marker.addListener('click', function () {
                        map.setZoom(15);
                        map.setCenter(position);
                        var infoWindow = new google.maps.InfoWindow();

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
                        

                        infoWindow.setContent(tableContent);
                        infoWindow.open(map, marker);
                    });

                    console.log("Marker no:", dataPoint.id);
                }
            });

            if (this.markers.length > 0) {
                map.fitBounds(bounds);
            }

            if (this.markers.length > 20) {
                var script = document.createElement('script');
                script.src = `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`;
                script.onerror = () => console.error('Error loading MarkerClusterer library.');
                document.head.appendChild(script);

                script.onload = () => {
                    var markerCluster = new markerClusterer.MarkerClusterer({
                        markers: this.markers,
                        map: map,
                    });
                };
            } else {
                console.log("No valid markers to display");
            }
        }
    }

    customElements.define('com-example-googlemaps', GoogleMapsWidget);
})();