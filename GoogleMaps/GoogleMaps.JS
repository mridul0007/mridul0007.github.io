(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML =
      `<button type="button" id="myBtn">Helper Button</button>`;
  
    class GoogleMaps extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {
        // Initialize Google Maps API
        const googleMapsAPIKey = 'AIzaSyBvDuhVqv5ahUahnypfBXm7xhLPraRwGww'; // Replace with your API key
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}`;
        script.onload = () => {
          this.createGoogleMap();
        };
        document.body.appendChild(script);
  
        // Set up event listener for the button
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.addEventListener('click', event => {
          var event = new Event('onClick');
          this.fireChanged();
          this.dispatchEvent(event);
        });
      }
  
      createGoogleMap() {
        // Create a Google Maps instance and add it to the shadow DOM
        const mapContainer = document.createElement('div');
        mapContainer.style.width = '400px';
        mapContainer.style.height = '300px';
        const mapOptions = {
          zoom: 8,
          center: { lat: 37.7749, lng: -122.4194 },
        };
        const map = new google.maps.Map(mapContainer, mapOptions);
        this.shadowRoot.appendChild(mapContainer);
  
        // Add a marker to the map
        const marker = new google.maps.Marker({
          position: { lat: 37.7749, lng: -122.4194 },
          map: map,
        });
  
        // Add event listener for marker clicks
        marker.addListener('click', () => {
          console.log('Marker clicked!');
        });
      }
  
      fireChanged() {
        console.log('OnClick Triggered');
      }
    }
  
    customElements.define('custom-button', GoogleMaps);
  })();
  