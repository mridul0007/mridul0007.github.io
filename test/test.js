(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <style>

    </style>
    <div> <h1>test</h1>
      <div id="github-data"></div>
      <script src="https://cdn.jsdelivr.net/npm/@octokit/core@latest/dist/octokit-core.umd.min.js"></script>
    </div>
  `;

  class OctoWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
      this.githubDataContainer = this.shadowRoot.querySelector('#github-data');
    }
 async connectedCallback() {
      setTimeout(async () => {
        if (window.Octokit) {
          const octokit = new window.Octokit({
            auth: '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' // For your testing purposes ONLY
          });

          try {
            const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
              owner: 'mridul0007',
              repo: 'testAPI',
              path: 'test.js', // Example path to a data file
              headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Accept': 'application/vnd.github.v3.raw' // Get raw content
              }
            });
            this.githubDataContainer.textContent = `Data from GitHub: ${result.data}`;
          } catch (error) {
            console.error("Error fetching GitHub data:", error);
            this.githubDataContainer.textContent = "Error loading data.";
          }
        } else {
          console.error("Octokit not loaded from CDN (after timeout).");
          this.githubDataContainer.textContent = "Error: Octokit not loaded.";
        }
      }, 50);
    }
  }

  // Define your custom element
  customElements.define('custom-test-octo', OctoWidget);
})();
