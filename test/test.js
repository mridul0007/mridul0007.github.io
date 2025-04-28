(function () {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = `
      <style>
          #github-widget-container {
              width: 800px;
              height: 700px;
              border: 1px solid #ccc; /* Optional: make container visible */
              box-sizing: border-box;
          }
      </style>
      <div>
          <div id="github-widget-container"></div>
      </div>
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

      async fetchGitHubFile(token1) {
          const url = "https://api.github.com/repos/Contigo-Consulting-AG/CST_Stroeer/contents/MAPSWidget/MAPSWidget.js";
          const token = token1; // Replace with your actual token
          const self = this;

          try {
              console.log("fetchGitHubFile() called, URL:", url);
              const response = await fetch(url, {
                  method: 'GET',
                  mode: 'cors',
                  headers: {
                      "Accept": "application/vnd.github+json",
                      'Authorization': `token ${token}`
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
                      self.widgetContainer.appendChild(mapWidget);
                      console.log("Custom widget created and added:", mapWidget);
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

      set_token(token) {
          this.token = token;
          this.fetchGitHubFile(token);
      }

      fireChanged() {
          console.log("OnClick Triggered");
      }
  }

  customElements.define('custom-test-post', PerformanceHelp);
})();
