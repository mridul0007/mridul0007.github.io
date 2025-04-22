(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  ` <div> <h1>test</h1>
      <div id="github-data"></div>
    </div>
    ` ;   
 
  class PerformanceHelp extends HTMLElement {
      constructor() {
          super();
          this.init();           
      }

      init() {            
          let shadowRoot = this.attachShadow({mode: "open"});
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          this.fetchGitHubFile();         
      }

      async fetchGitHubFile() {
          const url = "https://raw.githubusercontent.com/mridul0007/testAPI/main/test.js";
          const token = "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"; // Replace with a secure method to store tokens

          try {
              const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                      'Authorization': `token ${token}`,
                      'Content-Type': 'application/json'
                  }
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const fileContent = await response.text();
              console.log(fileContent);

              const githubDataDiv = this.shadowRoot.getElementById('github-data');
              githubDataDiv.innerHTML = `<pre>${fileContent}</pre>`;
          } catch (error) {
              console.error('Error fetching GitHub file:', error);
          }
      }

      fireChanged() {
          console.log("OnClick Triggered");     
      }        
  }

  customElements.define('custom-test-post', PerformanceHelp);
})();