(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 800px; /* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
    
        <div id="map-container"></div>
    `;

    class GoogleMaps extends HTMLElement {
        constructor() {
            super();
            this.init();
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }

        async set_api_key(apiKey) {
            this.apiKey = apiKey;
            await this.loadGoogleMapsScript();
        }

        loadGoogleMapsScript() {
            return new Promise((resolve, reject) => {
                const mapsScript = document.createElement('script');
                mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
                mapsScript.defer = true;
                mapsScript.async = true;
                mapsScript.onload = () => {
                    // Once the Google Maps API script is loaded, load the Marker Cluster library
                    const clusterScript = document.createElement('script');
                    clusterScript.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
                    clusterScript.defer = true;
                    clusterScript.async = true;
                    clusterScript.onload = resolve;
                    clusterScript.onerror = reject;
                    document.head.appendChild(clusterScript);
                };
                mapsScript.onerror = reject;
                document.head.appendChild(mapsScript);
            });
        }

        renderMap() {
            // Get the map container element
            const mapContainer = this.shadowRoot.getElementById('map-container');

            // Use the Google Maps API to create a map
            const map = new google.maps.Map(mapContainer, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });


            var markers = [];
            var berlinDataPoints = [
                { lat: 48.5200, lng: 13.4050 },
                { lat: 52.5300, lng: 13.4150 },
                { lat: 52.5400, lng: 13.4250 },
                { lat: 52.5500, lng: 13.4350 },
                { lat: 52.5600, lng: 13.4450 },
                { lat: 52.5700, lng: 13.4550 },
                { lat: 52.5800, lng: 13.4650 },
                { lat: 52.5900, lng: 13.4750 },
                { lat: 52.6000, lng: 13.4850 },
                { lat: 52.6100, lng: 13.4950 },
                { lat: 52.6200, lng: 13.5050 },
                { lat: 52.6300, lng: 13.5150 },
                { lat: 52.6400, lng: 13.5250 },
                { lat: 52.6500, lng: 13.5350 },
                { lat: 52.6600, lng: 13.5450 },
                { lat: 52.6700, lng: 13.5550 },
                { lat: 52.6800, lng: 13.5650 },
                { lat: 52.6900, lng: 13.5750 },
                { lat: 52.7000, lng: 13.5850 },
                { lat: 52.7100, lng: 13.5950 },
                { lat: 52.7200, lng: 13.6050 },
                { lat: 52.7300, lng: 13.6150 },
                { lat: 52.7400, lng: 13.6250 },
                { lat: 52.7500, lng: 13.6350 },
                { lat: 52.7600, lng: 13.6450 },
                { lat: 52.7700, lng: 13.6550 },
                { lat: 52.7800, lng: 13.6650 },
                { lat: 52.7900, lng: 13.6750 },
                { lat: 52.8000, lng: 13.6850 },
                { lat: 52.8100, lng: 13.6950 },
                { lat: 52.8200, lng: 13.7050 },
                { lat: 52.8300, lng: 13.7150 },
                { lat: 52.8400, lng: 13.7250 },
                { lat: 52.8500, lng: 13.7350 },
                { lat: 52.8600, lng: 13.7450 },
                { lat: 52.8700, lng: 13.7550 },
                { lat: 52.8800, lng: 13.7650 },
                { lat: 52.8900, lng: 13.7750 },
                { lat: 52.9000, lng: 13.7850 },
                { lat: 52.9100, lng: 13.7950 },
                { lat: 52.9200, lng: 13.8050 },
                { lat: 52.9300, lng: 13.8150 },
                { lat: 52.9400, lng: 13.8250 },
                { lat: 52.9500, lng: 13.8350 },
                { lat: 52.9600, lng: 13.8450 },
                { lat: 52.9700, lng: 13.8550 },
                { lat: 52.9800, lng: 13.8650 },
                { lat: 52.9900, lng: 13.8750 },
                { lat: 53.0000, lng: 13.8850 },
                { lat: 53.0100, lng: 13.8950 },
                { lat: 53.0200, lng: 13.9050 },
                { lat: 53.0300, lng: 13.9150 },
                { lat: 53.0400, lng: 13.9250 },
                { lat: 53.0500, lng: 13.9350 },
                { lat: 53.0600, lng: 13.9450 },
                { lat: 53.0700, lng: 13.9550 },
                { lat: 53.0800, lng: 13.9650 },
                { lat: 53.0900, lng: 13.9750 },
                { lat: 53.1000, lng: 13.9850 },
                { lat: 53.1100, lng: 13.9950 },
                { lat: 53.1200, lng: 14.0050 },
                { lat: 53.1300, lng: 14.0150 },
                { lat: 53.1400, lng: 14.0250 },
                { lat: 53.1500, lng: 14.0350 },
                { lat: 53.1600, lng: 14.0450 },
                { lat: 53.1700, lng: 14.0550 },
                { lat: 53.1800, lng: 14.0650 },
                { lat: 53.1900, lng: 14.0750 },
                { lat: 53.2000, lng: 14.0850 },
                { lat: 53.2100, lng: 14.0950 },
                { lat: 53.2200, lng: 14.1050 },
                { lat: 53.2300, lng: 14.1150 },
                { lat: 53.2400, lng: 14.1250 },
                { lat: 53.2500, lng: 14.1350 },
                { lat: 53.2600, lng: 14.1450 },
                { lat: 53.2700, lng: 14.1550 },
                { lat: 53.2800, lng: 14.1650 },
                { lat: 53.2900, lng: 14.1750 },
                { lat: 53.3000, lng: 14.1850 },
                { lat: 53.3100, lng: 14.1950 },
                { lat: 53.3200, lng: 14.2050 },
                { lat: 53.3300, lng: 14.2150 },
                { lat: 53.3400, lng: 14.2250 },
                { lat: 53.3500, lng: 14.2350 },
                { lat: 53.3600, lng: 14.2450 },
                { lat: 53.3700, lng: 14.2550 },
                { lat: 53.3800, lng: 14.2650 },
                { lat: 53.3900, lng: 14.2750 },
                { lat: 53.4000, lng: 14.2850 },
                { lat: 53.4100, lng: 14.2950 },
                { lat: 53.4200, lng: 14.3050 },
                { lat: 53.4300, lng: 14.3150 },
                { lat: 53.4400, lng: 14.3250 },
                { lat: 53.4500, lng: 14.3350 },
                { lat: 53.4600, lng: 14.3450 },
                { lat: 53.4700, lng: 14.3550 },
                { lat: 53.4800, lng: 14.3650 },
                { lat: 53.4900, lng: 14.3750 },
                { lat: 53.5000, lng: 14.3850 },
                { lat: 53.5100, lng: 14.3950 },
                { lat: 53.5200, lng: 14.4050 },
                { lat: 53.5300, lng: 14.4150 },
                { lat: 53.5400, lng: 14.4250 },
                { lat: 53.5500, lng: 14.4350 },
                { lat: 53.5600, lng: 14.4450 },
                { lat: 53.5700, lng: 14.4550 },
                { lat: 53.5800, lng: 14.4650 },
                { lat: 53.5900, lng: 14.4750 },
                { lat: 53.6000, lng: 14.4850 },
                { lat: 53.6100, lng: 14.4950 },
                { lat: 53.6200, lng: 14.5050 },
                { lat: 53.6300, lng: 14.5150 },
                { lat: 53.6400, lng: 14.5250 },
                { lat: 53.6500, lng: 14.5350 },
                { lat: 53.6600, lng: 14.5450 },
                { lat: 53.6700, lng: 14.5550 },
                { lat: 53.6800, lng: 14.5650 },
                { lat: 53.6900, lng: 14.5750 },
                { lat: 53.7000, lng: 14.5850 },
                { lat: 53.7100, lng: 14.5950 },
                { lat: 53.7200, lng: 14.6050 },
                { lat: 53.7300, lng: 14.6150 },
                { lat: 60.7400, lng: 18.6250 }];

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < berlinDataPoints.length; i++) {
                var lat_m = berlinDataPoints[i].lat;
                var lng_m = berlinDataPoints[i].lng;
                var marker = new google.maps.Marker({
                    position: { lat: lat_m, lng: lng_m },
                    title: "City " + i,
                });

                // // Push the marker to the array
                markers.push(marker);
                // bounds.extend(marker.getPosition());
            }

            // Now you can use the Marker Cluster library
            const markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

            // Add markers or any other map functionality as needed
        }
    }

    customElements.define('custom-button', GoogleMaps);
})();
