const getScriptPromisify = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject; // Handle any loading errors
    document.head.appendChild(script);
  });
};

(async function () {
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
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._chart = null;

      this.renderAfterLibraryLoaded();
    }

    async renderAfterLibraryLoaded() {
      try {
        await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js');

        // Create or retrieve the chart container
        if (!this._chart) {
          this._chart = echarts.init(this._shadowRoot.querySelector('#chart'));
        }

        const option = {
          title : {
              text : '2012 World GDP Top 8',
              subtext : 'from baike （Billion $）',
              x : 'center'
          },
          tooltip : {
              trigger: 'item',
              showDelay: 0,
              transitionDuration: 0.2,
              formatter : function (params) {
                  var value = params.value + '';
                  value = value.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                  return params.seriesName + '<br/>' + value + ' Billion';
              }
          },
          toolbox: {
              show : true,
              x: 'right',
              y: 'bottom',
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          dataRange: {
              orient: 'horizontal',
              x : 'center',
              y: 'center',
              min: 2000,
              max: 16000,
              splitNumber: 0,            // 分割段数，默认为5
              text:['16,000B','2,000B'],  
              calculable : true,
              itemWidth:40,
              color: ['orangered','yellow','lightskyblue']
          },
          series : [
              {
                  name: 'Japan',
                  type: 'map',
                  mapType: 'world|Japan',
                  mapLocation: {x:'5%', y:'10%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'Japan', value : 5963.9}
                  ]
              },
              {
                  name: 'China',
                  type: 'map',
                  mapType: 'world|Pakistan',
                  mapLocation: {x:'30%', y:'10%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  itemStyle: itemStyle,
                  data:[
                      {name : 'China', value : 25}
                  ]
              },
              {
                  name: 'Japan',
                  type: 'map',
                  mapType: 'world|Japan',
                  mapLocation: {x:'55%', y:'10%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'Japan', value : 5963.9}
                  ]
              },
              {
                  name: 'Germany',
                  type: 'map',
                  mapType: 'world|Germany',
                  mapLocation: {x:'76%', y:'10%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'Germany', value : 3400.5}
                  ]
              },
              {
                  name: 'France',
                  type: 'map',
                  mapType: 'world|France',
                  mapLocation: {x:'5%', y:'60%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'France', value : 2608.6}
                  ]
              },
              {
                  name: 'United Kingdom',
                  type: 'map',
                  mapType: 'world|United Kingdom',
                  mapLocation: {x:'33%', y:'60%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'United Kingdom', value : 2440.5}
                  ]
              },
              {
                  name: 'Brazil',
                  type: 'map',
                  mapType: 'world|Brazil',
                  mapLocation: {x:'55%', y:'60%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'Brazil', value : 2395.9}
                  ]
              },
              {
                  name: 'Russia',
                  type: 'map',
                  mapType: 'world|Russia',
                  mapLocation: {x:'76%', y:'70%',width:'22%',height:'35%'},
                  itemStyle: itemStyle,
                  data:[
                      {name : 'Russia', value : 2021.9}
                  ]
              }
          ]
      };
                          

        this._chart.setOption(option);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared);
})();
