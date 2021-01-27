import * as echarts from 'echarts';

export function initDepositByInvitorSeries ({
  elementId,
  listData,
  titleName = 'Title'
}) {
  const seriesData = listData.map(item => {
    return {
      value: item.amount,
      name: item.id
    }
  });
  const myChart = echarts.init(document.getElementById(elementId));
  myChart.setOption({
    title: {
      text: titleName,
      subtext: 'wow',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'invitor',
        type: 'pie',
        radius: '50%',
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
}
