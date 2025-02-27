(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            #map-container {
                height: 400px; /* Adjust the height as needed */
                width: 100%; /* Adjust the width as needed */
            }
        </style>
    
        <div id="map-container"></div>
    `;

    class GoogleMapsWidget extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.plm_data = {};
        }

        init() {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }


        async set_api_key(api_key) {
            // Load the Google Maps JavaScript API with the provided key
            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap&loading=async&v=weekly&libraries=marker`;
            console.log("reached Set API KEY");
            script.async = true;
            script.defer = true;
            script.onerror = () => console.error('Error loading Google Maps API');

            // Attach the script to the document
            document.head.appendChild(script);

            // Define the callback function (initMap) that will be called when the API is loaded
            window.initMap = () => {
                // this.renderMap();
            };
        }

        async set_data(plm_data) {
            this.plm_data = plm_data;
            this.renderMap();
        }

        renderMap() {
            console.log("Reached rendermap")
            var markers = [];
            const startTime = new Date();
            var beachFlagImg = document.createElement("img");
            beachFlagImg.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

            // Get the map container element
            var mapContainer = this.shadowRoot.querySelector('#map-container');

            // Create a new map centered at a specific location
            var map = new
            google.maps.Map(mapContainer, {
              center: {lat: 52.520, lng: 13.405},
              zoom: 8,
              mapId: 'DEMO_MAP_ID'
            });

             // Add markers using AdvancedMarkerElement
            this.plm_data.forEach(dataPoint => {
            var lat_m = parseFloat(dataPoint.properties["lat"]); 
            var lng_m = parseFloat(dataPoint.properties["long"]);
                if (lat_m && lng_m) {
                    let marker = new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat: lat_m, lng: lng_m },
                        content: beachFlagImg,
                        title: dataPoint.id,
                      });
                      markers.push(marker);    
                }
            }
        
        );

        
      
            console.log("Reached rendermap end");
            console.log("Number of markers:=:", markers.length);
        }
    }



        


    customElements.define('com-example-googlemaps', GoogleMapsWidget);
})();