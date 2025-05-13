(function () {

    const event_array = [
      'EVENT_CLICK1',
      'EVENT_CLICK2',
      'EVENT_LOADER',
    ];
    const url = "https://api.github.com/repos/mridul0007/testAPI/contents/textwidget.js";
    
    const tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <style>
        #github-widget-container {
          width: 100%;
          height: 100%;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
      </style>
      <div id="github-widget-container"></div>
    `;
  
    class GitHubLoader extends HTMLElement {
        set_text(p_text) {
            this.Widget.set_text(p_text);
        }

      constructor() {
        super();
        this.Widget = null;
        this.init();
      }
  
      init() {
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.widgetContainer = shadowRoot.getElementById('github-widget-container');
      }
  
      async fetchGitHubFile(githubToken) {
        
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
          const decodedContent = atob(content);
  
          const blob = new Blob([decodedContent], { type: 'application/javascript' });
          const blobUrl = URL.createObjectURL(blob);
  
          const scriptElement = document.createElement('script');
          scriptElement.src = blobUrl;
  
          scriptElement.onload = () => {
            console.log("Script loaded from Blob URL");
            this.Widget = document.createElement('custom-textwidget');
            this.widgetContainer.appendChild(this.Widget);
  
            for (const eventName of event_array) {
              this.Widget.addEventListener(eventName, () => {
                console.log(`Received ${eventName}, re-dispatching...`);
                this.dispatchEvent(new CustomEvent(eventName, {}));
              });
            }
  
            this.dispatchEvent(new CustomEvent("EVENT_LOADER", {}));
          };
  
          this.widgetContainer.appendChild(scriptElement);
        } catch (error) {
          console.error("Error fetching GitHub file:", error);
        }
      }
  
      set_credentials(githubToken) {
        this.fetchGitHubFile(githubToken);
      }
  
     
    }
  
    customElements.define("custom-loader", GitHubLoader);
  
  })();
  