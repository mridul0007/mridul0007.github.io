(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <div>
      <h1>test</h1>
      <div id="github-widget-container"></div>
    </div>
  `;

  class PerformanceHelp extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      let shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
      this.widgetContainer = shadowRoot.getElementById('github-widget-container');
    }

    async fetchGitHubFile(token1) {
      const url = "https://api.github.com/repos/Contigo-Consulting-AG/CST_Stroeer/contents/MAPSWidget/MAPSWidget.js";
      var token = token1; // Replace with a secure method to store tokens
      const self = this; // Capture 'this' for use in the 'load' event

      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            "Accept": "application/vnd.github+json",
            'Authorization': `token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonContent = await response.json();
        const content = jsonContent.content;
        let contentdec = atob(content);

        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.textContent = contentdec;

        // Listen for the 'load' event of the script to ensure it has executed
        scriptElement.onload = function() {
          // Now the 'CombinedMap' custom element should be defined
          if (customElements.get('com_contigo-consulting_sacmapswidget_developement')) {
            const mapWidget = document.createElement('com_contigo-consulting_sacmapswidget_developement');
            self.widgetContainer.appendChild(mapWidget);

            // You might need to set properties or call methods on 'mapWidget' here
            // For example, setting an API key if the widget has such a method:
            // mapWidget.set_google_mapsjs_api_key('YOUR_GOOGLE_MAPS_API_KEY');
          } else {
            console.warn('CombinedMap custom element not found after script load.');
          }
        };

        scriptElement.onerror = function(error) {
          console.error('Error loading or executing the fetched script:', error);
        };

        this.shadowRoot.appendChild(scriptElement);

      } catch (error) {
        console.error('Error fetching GitHub file:', error);
      }
    }

    set_token(token) {
      this.token = token;
      this.fetchGitHubFile(token); // Call the function with the token
    }

    fireChanged() {
      console.log("OnClick Triggered");
    }
  }

  customElements.define('custom-test-post', PerformanceHelp);
})();