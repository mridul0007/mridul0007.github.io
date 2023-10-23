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

      // this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    async render (data_inp) {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const myChart = echarts.init(this._root)

        var option;

        var idArray = [];
        console.log(data_inp);
        // Iterate over the array of objects and extract the IDs.
        for (var i = 0 ; i < data_inp.length; i++) {
          console.log("entered");
          idArray.push(data_inp[i].properties['LOCATION_STATE']);
          console.log(data_inp[i].properties['LOCATION_STATE']);
}

        myChart.showLoading();
        function countElements(array) {
          // Create an object to store the counts of each element in the array.
          var counts = {};
        
          // Iterate over the array and increment the count of the current element in the object.
          for (var element of array) {
            counts[element] = counts[element] ? counts[element] + 1 : 1;
          }
        
          // Return the object containing the counts of each element in the array.
          return counts;
        }

        var counts = countElements(idArray);
        console.log(counts);

        const formattedArray = [];
        for (const key in counts) {
          formattedArray.push({ name: key, value: counts[key] });
        }
        
        // Example usage:
        
        
        console.log(counts); // { 1: 7, 2: 4 }
        $.get('https://mridul0007.github.io/Echarts/German_State.json', function (StateJson) {
          myChart.hideLoading();
          echarts.registerMap('German', StateJson);
          var data = formattedArray;
          data.sort(function (a, b) {
            return a.value - b.value;
          });
          const mapOption = {

            select: {

            }
            tooltip: {
              show: true,
              triggerOn: "click",
            },
            visualMap: {
              left: 'right',
              min: 1,
              max: 15,
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
                map: 'German',
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
          // let currentOption = mapOption;
         myChart.setOption(mapOption);
          setInterval(function () {
            currentOption = currentOption === mapOption ? barOption : mapOption;
            myChart.setOption(currentOption, true);
          }, 10000);
          // myChart.on("showTip", console.log);
          // myChart.on('click', function (params) {
          //   if (params.seriesType === 'map') {
          //     // Toggle between map and bar chart when a state is clicked.
          //     if (myChart.getOption() === mapOption) {
          //       myChart.setOption(barOption);
          //     } else {
          //       myChart.setOption(mapOption);
          //     }
          //   }
          // });
        });

        option && myChart.setOption(option);




      
      // chart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()