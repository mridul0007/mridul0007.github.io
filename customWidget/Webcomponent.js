(function () {
    // let tmpl = document.createElement('template');
    // tmpl.innerHTML =
    //     `<button type="button" id="button_modify">MODIFY</button>`;

    // tmpl.innerHTML =
    //     `<button type="button" id="button_delete">DELETE</button>`;

    // tmpl.innerHTML =
    //     `<button type="button" id="button_create">CREATE</button>`;
    // Create the "MODIFY" button
    let modifyButton = document.createElement('button');
    modifyButton.setAttribute('type', 'button');
    modifyButton.setAttribute('id', 'button_modify');
    modifyButton.textContent = 'MODIFY';

    // Create the "DELETE" button
    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('id', 'button_delete');
    deleteButton.textContent = 'DELETE';

    // Append the buttons to the body
    document.body.appendChild(modifyButton);
    document.body.appendChild(deleteButton);


    class PerformanceHelp extends HTMLElement {
        constructor(height) {
            console.log(height);
            super();
            this.init();
        }

        init() {

            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.addEventListener("click", event => {
                var event = new Event("onClick");
                this.fireChanged();
                this.dispatchEvent(event);
            });
        }

        fireChanged() {
            console.log(this.dept);
            console.log("OnClick Triggered");

        }
        test() {
            console.log(this.dept);
        }

    }

    customElements.define('custom-button', PerformanceHelp);
})();
