// textwidget.js

(function() {
    let text = "";

    // Custom Widget Constructor
    let myWidget = {
        init: function(container) {
            this.container = container;
            this.render();
        },
        render: function() {
            this.container.innerHTML = `<div>${text}</div>`;
        },
        setText: function(newText) {
            text = newText;
            this.render();
        }
    };

    // Register the widget
    window.customWidgets = window.customWidgets || {};
    window.customWidgets.TextWidget = myWidget;
})();