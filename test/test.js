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
      }

      async fetchGitHubFile(token1) {
        const url = "https://api.github.com/repos/Contigo-Consulting-AG/CST_Stroeer/contents/MAPSWidget/MAPSWidget.js";
          var token = token1; // Replace with a secure method to store tokens

          try {
              const response = await fetch(url, {
                  method: 'GET',
                  mode: 'cors',
                  headers: {
                      "Accept" : "application/vnd.github+json",
                      'Authorization': `token ${token}`
                  }
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const jsonContent = await response.json();
 
              const content = jsonContent.content;
      
              let contentdec = atob( content );
       
              console.log(contentdec);

              const githubDataDiv = this.shadowRoot.getElementById('github-data');
              const scriptElement = document.createElement('script');
              scriptElement.type = 'text/javascript';
              scriptElement.textContent = contentdec; // Set the JavaScript code as the script's content
              document.head.appendChild(scriptElement);

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