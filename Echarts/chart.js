var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement('template');
  prepared.innerHTML = `
    <style>
      #root {
        width: 100%;
        height: 100%;
      }
      #chart { 
        width: 100%;
        height: 100%;
      }
    </style>
    <div id="root">
      <div id="chart"></div>
    </div>
  `;

  class SamplePrepared extends HTMLElement {
    constructor () {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true)); // Fixed this line

      this._root = this._shadowRoot.getElementById('root');

      this._props = {};
      this._chart = null;

      this.render();
    }

    onCustomWidgetResize (width, height) {
      if (this._chart) {
        // Resize the chart if it exists
        this._chart.resize({ width: '100%', height: '100%' });
      }
    }

    async render () {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js');

      if (!this._chart) {
        // Create ECharts chart if it doesn't exist
        this._chart = echarts.init(this._shadowRoot.getElementById('chart'));
      }

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

      this._chart.setOption(geoMapOption);
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared);
})();
