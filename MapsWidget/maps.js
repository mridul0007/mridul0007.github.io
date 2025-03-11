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
                height: 95%;
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
            }
            #d-leaflet-map {
                height: 100%;
                width: 100%;
                display: none;
            }
            #d-bottom-bar {
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
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
                <div id="d-leaflet-map"></div>
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
                <p>Loading...</p>
            </div>
        </div>
    `;

    class CombinedMap extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.plm_data = {};
            this.markers = [];
            this.dataSource = null;
            this.loadingOverlay = null;
            this.mapType = 'google';
            this.init();
        }

        init() {
            const confirmButton = this.shadowRoot.querySelector('#confirmSource');
            const csvUploadInput = this.shadowRoot.querySelector('#csvUpload');
            const dataSourceOverlay = this.shadowRoot.querySelector('#d-data-source-overlay');
            const loadingOverlay = this.shadowRoot.querySelector('#d-loading-overlay');

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
                        // this.dispatchEvent(new CustomEvent("onPlmQueryExecution"));
                    }
                }
            });

            csvUploadInput.addEventListener('change', (event) => {
                this.handleCsvUpload(event.target.files[0]);
            });
        }

        async handleCsvUpload(file) {
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (event) => {
                const csvData = event.target.result;
                const loadingOverlay = this.shadowRoot.querySelector('#loading-overlay');
                loadingOverlay.style.display = 'flex';
                this.plm_data = this.parseCsv(csvData);
                // this.renderMap();
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

    }


    customElements.define('com-example-maps', CombinedMap);
})();