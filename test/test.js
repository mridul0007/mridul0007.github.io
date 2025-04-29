(function () {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = `
      <style>
          #github-widget-container {
              width: 100%;
              height: 100%;
              border: 1px solid #ccc; /* Optional: make container visible */
              box-sizing: border-box;
          }
      </style>
          <div id="github-widget-container"></div>
  `;

  class PerformanceHelp extends HTMLElement {
      constructor() {
          super();
          this.init();
      }

      init() {
          const shadowRoot = this.attachShadow({ mode: "open" });
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          this.widgetContainer = shadowRoot.getElementById('github-widget-container');
          console.log("PerformanceHelp.init() called");
      }

      async fetchGitHubFile(githubToken, googleMapsApiKey) {
          const url = "https://api.github.com/repos/Contigo-Consulting-AG/CST_Stroeer/contents/MAPSWidget/MAPSWidget.js";
          const self = this;

          try {
              console.log("fetchGitHubFile() called, URL:", url);
              const response = await fetch(url, {
                  method: 'GET',
                  mode: 'cors',
                  headers: {
                      "Accept": "application/vnd.github+json",
                      'Authorization': `token ${githubToken}`
                  }
              });

              if (!response.ok) {
                  const errorText = `HTTP error! status: ${response.status}, text: ${await response.text()}`;
                  throw new Error(errorText);
              }

              const jsonContent = await response.json();
              const content = jsonContent.content;
              const decodedContent = atob(content); // Decode base64

              // Create a blob and object URL for script loading
              const blob = new Blob([decodedContent], { type: 'application/javascript' });
              const blobUrl = URL.createObjectURL(blob);

              const scriptElement = document.createElement('script');
              scriptElement.src = blobUrl;

              scriptElement.onload = function () {
                  console.log("Script loaded from Blob URL");

                  if (customElements.get('com_contigo-consulting_sacmapswidget_developement')) {
                      const mapWidget = document.createElement('com_contigo-consulting_sacmapswidget_developement');
                      // mapWidget.style.width = '100%';
                      // mapWidget.style.height = '100%';
                      // mapWidget.style.display = 'block';

                      mapWidget.addEventListener('EVENTW2S_DB_FILL_COORDINATE_DATA', (event) => {
                        console.log("Received EVENTW2S_DB_FILL_COORDINATE_DATA:", event);
                      });

                      self.widgetContainer.appendChild(mapWidget);
                      console.log("Custom widget created and added:", mapWidget);

                      // Call the Google Maps API key setter
                      if (typeof mapWidget.set_google_mapsjs_api_key === 'function') {
                          mapWidget.set_google_mapsjs_api_key(googleMapsApiKey)
                              .then(() => {
                                  console.log("Google Maps JS API key set successfully.");
                              })
                              .catch(err => {
                                  console.error("Error setting Google Maps JS API key:", err);
                              });
                      } else {
                          console.warn('Function set_google_mapsjs_api_key() is not available.');
                      }
                  } else {
                      console.warn('Custom element not found after script load.');
                  }

                  // Clean up blob URL
                  URL.revokeObjectURL(blobUrl);
              };

              scriptElement.onerror = function (error) {
                  console.error('Error loading or executing the blob script:', error);
              };

              this.shadowRoot.appendChild(scriptElement);

          } catch (error) {
              console.error('Error fetching GitHub file:', error);
          }
      }

      set_credentials(githubToken, googleMapsApiKey) {
          this.githubToken = githubToken;
          this.googleMapsApiKey = googleMapsApiKey;
          this.fetchGitHubFile(githubToken, googleMapsApiKey);
      }

      fireChanged() {
          console.log("OnClick Triggered");
      }
  }

  customElements.define('custom-test-post', PerformanceHelp);
})();
