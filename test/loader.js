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

class GitHubLoader extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    init() {
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.widgetContainer = shadowRoot.getElementById('github-widget-container');
    }

    async fetchGitHubFile(githubToken) {
        const url = "https://api.github.com/repos/mridul0007/testAPI/contents/textwidget.js";
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
            }
            self.widgetContainer.appendChild(scriptElement);
        } catch (error) {
            console.error("Error fetching GitHub file:", error);
        }
    }

    set_credentials(githubToken) {
        this.githubToken = githubToken;
        this.fetchGitHubFile(githubToken);
    }

}
customElements.define("custom-loader", GitHubLoader);

})();