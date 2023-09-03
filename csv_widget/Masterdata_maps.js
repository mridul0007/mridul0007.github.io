(function () {
  // Define your Google Maps API key, latitude, longitude, and zoom level
  const API_KEY = 'YOUR_API_KEY';
  const LATITUDE = YOUR_LATITUDE;
  const LONGITUDE = YOUR_LONGITUDE;
  const ZOOM_LEVEL = YOUR_ZOOM_LEVEL;

  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <style>
      /* Add your custom styles for the map container */
      #map-widget {
        width: 100%;
        height: 400px;
      }
    </style>
  `;

  class MasterData_Maps extends HTMLElement {
    constructor() {
      super();
      this.init();
      loadGoogleMaps();
    }

    init() {
      let shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }

    onCustomWidgetAfterUpdate(ochangedProperties) {}

    fireChanged() {}
  }

  customElements.define('custom-widget', MasterData_Maps);

  function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
  }

  function initMap() {
    const shadowRoot = document.querySelector('custom-widget').shadowRoot;
    const mapElement = document.createElement('div');
    mapElement.id = 'map-widget';
    shadowRoot.appendChild(mapElement);

    const map = new google.maps.Map(mapElement, {
      center: { lat: LATITUDE, lng: LONGITUDE },
      zoom: ZOOM_LEVEL,
    });
  }
})();