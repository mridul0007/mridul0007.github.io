// var getScriptPromisify = (src) => {
//   return new Promise(resolve => {
//     $.getScript(src, resolve)
//   })
// }

// (function () {
//   const prepared = document.createElement('template')
//   prepared.innerHTML = `
//     <style>
//       #root {
//         width: 100%;
//         height: 100%;
//       }
//     </style>
//     <div id="root" style="width: 100%; height: 100%;">
//       <div id="chart"></div>
//     </div>
//   `

//   class SamplePrepared extends HTMLElement {
//     constructor () {
//       super()

//       this._shadowRoot = this.attachShadow({ mode: 'open' })
//       this._shadowRoot.appendChild(prepared.content.cloneNode(true))

//       this._root = this._shadowRoot.getElementById('root')

//       this._props = {}

//       // this.render()
//     }

//     onCustomWidgetResize (width, height) {
//       this.render()
//     }

//     async render () {
//       this._shadowRoot.appendChild(prepared.content)

//       await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

//       const chart = echarts.init(document.getElementById('chart'));

//       const geoMapOption = {
//         type: 'geo',
//         map: 'USA',
//         data: [
//           { name: 'California', value: 39500000 },
//           { name: 'Texas', value: 29000000 },
//           { name: 'Florida', value: 21500000 },
//           { name: 'New York', value: 20000000 },
//           { name: 'Illinois', value: 12500000 },
//         ],
//         itemStyle: {
//           color: '#fff',
//           borderColor: '#ccc',
//         },
//       };

//       chart.setOption(geoMapOption);
//     }
//   }

//   customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
// })()

// Define a callback function to load ECharts script
var loadECharts = function(callback) {
  // Check if ECharts is already loaded
  if (typeof echarts !== 'undefined') {
    callback();
  } else {
    var script = document.createElement('script');
    script.src = 'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js';
    script.onload = callback;
    document.body.appendChild(script);
  }
};

// Custom widget constructor
function CustomEChartsWidget() {
  var widget = this;
  // Define widget properties and methods

  widget.init = function() {
    // Initialize the widget
    loadECharts(widget.render);
  };

  widget.render = function() {
    // Render your ECharts chart here
    var chartContainer = widget.createDiv();
    chartContainer.style.width = '100%';
    chartContainer.style.height = '400px'; // Set the desired height

    widget.dom.append(chartContainer);

    // Create your ECharts instance and set options
    var myChart = echarts.init(chartContainer);

    const geoMapOption = {
              type: 'geo',
              map: 'USA',
              data: [
                { name: 'California', value: 39500000 },
                { name: 'Texas', value: 29000000 },
                { name: 'Florida', value: 21500000 },
                { name: 'New York', value: 20000000 },
                { name: 'Illinois', value: 12500000 },
              ],
              itemStyle: {
                color: '#fff',
                borderColor: '#ccc',
              },
            };
      
            myChartchart.setOption(geoMapOption);
  };

  widget.init();
}

// Register the custom widget with SAC
customOnLoad(function() {
  // Register the widget constructor
  CustomWidget.registerWidgetConstructor('customEChartsWidget', CustomEChartsWidget);

  // Add your widget to the widget list
  var widgetInfo = {
    id: 'customEChartsWidget',
    displayName: 'Custom ECharts Widget',
    icon: 'bar-chart',
  };
  CustomWidget.registerWidget('customEChartsWidget', widgetInfo);
});

