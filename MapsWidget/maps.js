(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #widget-container {
                height: 100%;
                width: 100%;
                position: relative;
                display: flex;
                flex-direction: column;
            }
            #map-container {
                height: 90%;
                width: 100%;
                position: relative;
            }
            #data-source-overlay {
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
            #google-map {
                height: 100%;
                width: 100%;
            }
            #leaflet-map {
                height: 100%;
                width: 100%;
                display: none;
            }
            #bottom-bar {
                background: linear-gradient(to bottom, #00B0B2, #A4D6D4);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
            }
            #map-toggle {
                z-index: 1000;
                background: transparent;
                padding: 5px;
                border-radius: 4px;
            }
            #footnote {
                font-size: 12px;
                color: black;
                z-index: 1000;
            }
            .leaflet-popup-content-wrapper {
                max-height: 400px;
                overflow-y: auto;
            }
        </style>

        <div id="widget-container">
            <div id="map-container">
                <div id="data-source-overlay">
                    <p>Select Data Source:</p>
                    <label><input type="radio" name="dataSource" value="sac"> SAC </label>
                    <label><input type="radio" name="dataSource" value="csv"> CSV </label>
                    <input type="file" id="csvUpload" accept=".csv">
                    <button id="confirmSource">Confirm</button>
                </div>
                <div id="google-map"></div>
                <div id="leaflet-map"></div>
            </div>
            <div style="width: 100%; height: 1px; background-color: #064635;"></div>
            <div id="bottom-bar">
                <div id="map-toggle">
                    <label><input type="radio" name="mapType" value="google" checked> Google Maps</label>
                    <label><input type="radio" name="mapType" value="leaflet"> Leaflet</label>
                </div>
                <div id="footnote">Contigo custom Maps widget</div>
            </div>
        </div>
    `;

    class CombinedMap extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.mapType = 'google';
        }
    }

    customElements.define('com-example-maps', CombinedMap);
})();