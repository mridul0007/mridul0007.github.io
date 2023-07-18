(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn">Helper Button</button>` ;   
   
    class PerformanceHelp extends HTMLElement {
        constructor(height) {
            console.log(height);
            super();
            this.init();           
        }

        init() {            
              
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.addEventListener("click", event => {
            var event = new Event("onClick");
            this.fireChanged();           
            this.dispatchEvent(event);
            });           
        }

        fireChanged() {
            console.log(this.$dept);
            console.log("OnClick Triggered");     
            
        }    
        test(){
            console.log(this.$dept);
        }
        
    }

    customElements.define('custom-button', PerformanceHelp);
})();
