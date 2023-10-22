const getScriptPromisify = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject; // Handle any loading errors
    document.head.appendChild(script);
  });
};

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
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
      this.render()
    }

    async render () {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const myChart = echarts.init(this._root)

        var option;

        myChart.showLoading();
        $.get('https://cdnjs.cloudflare.com/ajax/libs/echarts/5.0.0/map/json/USA.json', function (usaJson) {
          myChart.hideLoading();
          echarts.registerMap('USA', usaJson, {
            Alaska: {
              // 把阿拉斯加移到美国主大陆左下方
              left: -131,
              top: 25,
              width: 15
            },
            Hawaii: {
              left: -110,
              top: 28,
              width: 5
            },
            'Puerto Rico': {
              // 波多黎各
              left: -76,
              top: 26,
              width: 2
            }
          });
          var data = [
            { name: 'Alabama', value: 4822023 },
            { name: 'Alaska', value: 731449 },
            { name: 'Arizona', value: 6553255 },
            { name: 'Arkansas', value: 2949131 },
            { name: 'California', value: 38041430 },
            { name: 'Colorado', value: 5187582 },
            { name: 'Connecticut', value: 3590347 },
            { name: 'Delaware', value: 917092 },
            { name: 'District of Columbia', value: 632323 },
            { name: 'Florida', value: 19317568 },
            { name: 'Georgia', value: 9919945 },
            { name: 'Hawaii', value: 1392313 },
            { name: 'Idaho', value: 1595728 },
            { name: 'Illinois', value: 12875255 },
            { name: 'Indiana', value: 6537334 },
            { name: 'Iowa', value: 3074186 },
            { name: 'Kansas', value: 2885905 },
            { name: 'Kentucky', value: 4380415 },
            { name: 'Louisiana', value: 4601893 },
            { name: 'Maine', value: 1329192 },
            { name: 'Maryland', value: 5884563 },
            { name: 'Massachusetts', value: 6646144 },
            { name: 'Michigan', value: 9883360 },
            { name: 'Minnesota', value: 5379139 },
            { name: 'Mississippi', value: 2984926 },
            { name: 'Missouri', value: 6021988 },
            { name: 'Montana', value: 1005141 },
            { name: 'Nebraska', value: 1855525 },
            { name: 'Nevada', value: 2758931 },
            { name: 'New Hampshire', value: 1320718 },
            { name: 'New Jersey', value: 8864590 },
            { name: 'New Mexico', value: 2085538 },
            { name: 'New York', value: 19570261 },
            { name: 'North Carolina', value: 9752073 },
            { name: 'North Dakota', value: 699628 },
            { name: 'Ohio', value: 11544225 },

            { name: 'South Dakota', value: 833354 },
            { name: 'Tennessee', value: 6456243 },
            { name: 'Texas', value: 26059203 },
            { name: 'Utah', value: 2855287 },
            { name: 'Puerto Rico', value: 3667084 }
          ];
          data.sort(function (a, b) {
            return a.value - b.value;
          });
          const mapOption = {
            visualMap: {
              left: 'right',
              min: 500000,
              max: 38000000,
              inRange: {
                // prettier-ignore
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
              },
              text: ['High', 'Low'],
              calculable: true
            },
            series: [
              {
                id: 'population',
                type: 'map',
                roam: true,
                map: 'USA',
                animationDurationUpdate: 1000,
                universalTransition: true,
                data: data
              }
            ]
          };
          const barOption = {
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              axisLabel: {
                rotate: 30
              },
              data: data.map(function (item) {
                return item.name;
              })
            },
            animationDurationUpdate: 1000,
            series: {
              type: 'bar',
              id: 'population',
              data: data.map(function (item) {
                return item.value;
              }),
              universalTransition: true
            }
          };
          let currentOption = mapOption;
          myChart.setOption(mapOption);
          setInterval(function () {
            currentOption = currentOption === mapOption ? barOption : mapOption;
            myChart.setOption(currentOption, true);
          }, 2000);
        });

        option && myChart.setOption(option);




      
      // chart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()