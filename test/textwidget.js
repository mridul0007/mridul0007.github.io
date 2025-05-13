// textwidget.js
class CustomTextWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      // Container for text and buttons
      const container = document.createElement("div");
      container.style.padding = "10px";
      container.style.border = "1px solid #ccc";
      container.style.borderRadius = "5px";
      container.style.background = "#f9f9f9";
  
      // Main text element
      this.textElement = document.createElement("div");
      this.textElement.style.marginBottom = "10px";
      container.appendChild(this.textElement);
  
      // Button 1
      const button1 = document.createElement("button");
      button1.textContent = "Button 1";
      button1.style.marginRight = "5px";
      button1.addEventListener("click", () => {
        console.log("Dispatching EVENT_CLICK1 event");
        this.dispatchEvent(new CustomEvent("EVENT_CLICK1", {}));
    });
  
      // Button 2
      const button2 = document.createElement("button");
      button2.textContent = "Button 2";
      button2.addEventListener("click", () => {
        console.log("Dispatching EVENT_CLICK2 event");
        this.dispatchEvent(new CustomEvent("EVENT_CLICK2", {}));
      });
  
      // Append buttons
      container.appendChild(button1);
      container.appendChild(button2);
  
      // Append everything to shadow DOM
      this.shadowRoot.appendChild(container);
    }
  
    // Method exposed to scripting API
    set_text(p_text) {
      this.textElement.textContent = p_text;
    }
  }
  
  customElements.define("custom-textwidget", CustomTextWidget);
  
  