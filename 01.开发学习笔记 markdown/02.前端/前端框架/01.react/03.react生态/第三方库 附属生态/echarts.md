# 

echarts的registerMap接受geoJson格式数据，以此为地图的轮廓。

```
let publicUrl = 'https://geo.datav.aliyun.com/areas_v2/bound/';

//echarts绘图
function initEcharts(chart, name, geoJson, alladcode) {
  echarts.registerMap(name, geoJson);
  let option = {
    title: {
      text: name,
      left: 'center'
    },
    series: [{
      type: 'map',
      map: name,
      itemStyle: {
        areaColor: '#1890ff'
      }
    }]
  }

  chart.setOption(option)
  // 解绑click事件
  chart.off("click");
  //给地图添加监听事件 最底层不添加
  geoJson?.features?.[0]?.properties?.level!=='district' && chart.on('click', params => {
    let clickRegionCode = alladcode.filter(areaJson => areaJson.name === params.name)[0].adcode;
    getGeoJson(clickRegionCode + '_full.json').then(regionGeoJson => initEcharts(chart, params.name, regionGeoJson, alladcode))
      .catch(err => {
        getGeoJson('100000_full.json').then(
          chinaGeoJson => initEcharts(chart,'全国', chinaGeoJson, alladcode)
        )

      })
  })
}
//获取地图json数据
async function getGeoJson(jsonName) {
  return (await instance.get(publicUrl + jsonName)).data
}

async function init() {
  let chart = echarts.init(document.getElementById('container') as HTMLElement);
  let alladcode = await getGeoJson('all.json')
  let chinaGeoJson = await getGeoJson('100000_full.json')
  console.log('chinaGeoJson',chinaGeoJson)
  initEcharts( chart,'全国', chinaGeoJson, alladcode)
}

init();
```