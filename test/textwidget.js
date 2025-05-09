// textwidget.js
class CustomTextWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.textElement = document.createElement("div");
      this.textElement.style.padding = "10px";
      this.textElement.style.border = "1px solid #ccc";
      this.textElement.style.borderRadius = "5px";
      this.textElement.style.cursor = "pointer";
      this.textElement.style.background = "#f9f9f9";
  
      this.textElement.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onCustomWidgetEvent", {
          detail: {
            name: "EVENT_CLICK"
          }
        }));
      });
  
      this.shadowRoot.appendChild(this.textElement);
    }
  
    // Called when widget is created or properties change
    onCustomWidgetAfterUpdate(changedProps) {
      if (changedProps.p_text !== undefined) {
        this.textElement.textContent = changedProps.p_text;
      }
    }
  
    // Method exposed to scripting API
    set_text(p_text) {
      this.textElement.textContent = p_text;
    }
  }
  
  customElements.define("custom-textwidget", CustomTextWidget);
  