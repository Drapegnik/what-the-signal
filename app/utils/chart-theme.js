export default {
  colors: [
    '#7cb5ec',
    '#f7a35c',
    '#90ee7e',
    '#7798BF',
    '#aaeeee',
    '#ff0066',
    '#eeaaee',
    '#55BF3B',
    '#DF5353',
    '#7798BF',
    '#aaeeee',
  ],
  credits: {
    enabled: false,
  },
  boost: {
    useGPUTranslations: true,
  },
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Dosis, sans-serif',
    },
  },
  title: {
    text: null,
    style: {
      color: 'white',
      fontSize: '14px',
    },
  },
  subtitle: {
    text: null,
    style: {
      color: 'white',
    },
  },
  tooltip: {
    borderWidth: 0,
    backgroundColor: 'rgba(219,219,216,0.8)',
    shadow: false,
    enabled: false,
  },
  legend: {
    enabled: false,
    itemStyle: {
      fontWeight: 'bold',
      fontSize: '13px',
    },
  },
  xAxis: {
    gridLineWidth: 1,
    lineColor: '#404048',
    gridLineColor: '#404048',
    tickColor: null,
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  yAxis: {
    gridLineColor: '#404048',
    minorGridLineColor: '#404048',
    minorTickInterval: 'auto',
    title: {
      text: null,
    },
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  plotOptions: {
    candlestick: {
      lineColor: '#404048',
    },
    line: {
      lineWidth: 1,
      boostThreshold: 1,
      states: {
        hover: {
          lineWidthPlus: 0,
        },
      },
    },
  },
  // General
  background2: '#F0F0EA',
}
