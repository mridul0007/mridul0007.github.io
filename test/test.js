import { Octokit } from '@octokit/core';

(function () {
  // Define the HTML template for your custom element
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <style>

    </style>
    <div> <h1>Loaded Octokit</h1>
      <div id="github-data"></div>
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
      // **SECURITY WARNING:** Use a backend for your actual token!
      const octokit = new Octokit({
        auth: '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'
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
    }
  }

  // Define your custom element
  customElements.define('custom-test-octo', OctoWidget);
})();