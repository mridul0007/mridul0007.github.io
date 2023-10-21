var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
    <style>
      #root {
        width: 100%;
        height: 100%;
      }
    </style>
    <div id="root" style="width: 100%; height: 100%;">
      <div id="chart"></div>
    </div>
  `

  class SamplePrepared extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      // this.render()
    }

    async render () {
      this._shadowRoot.appendChild(prepared.content)

      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const chart = echarts.init(document.getElementById('chart'));

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

      chart.setOption(geoMapOption);
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()
