import {Component} from 'react'
import Highcharts from 'highcharts'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'

import addBoost from 'highcharts/modules/boost'
import addHeatmap from 'highcharts/modules/heatmap'

import theme from 'utils/chart-theme'

Highcharts.setOptions(theme)
addHeatmap(Highcharts)
addBoost(Highcharts)

class Chart extends Component {
  componentDidMount() {
    this.renderChart()
    setTimeout(() => this.chart.reflow(), 1000)
  }

  componentDidUpdate(prevProps) {
    this.renderChart()
    this.syncThings(prevProps)
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  renderChart() {
    if (!this.container) {
      return
    }

    if (this.chart) {
      this.chart.update(this.getConfig(), true, true)
    } else {
      this.chart = new Highcharts.Chart(this.container, this.getConfig())
    }
  }

  getConfig() {
    return merge(this.props.config, {
      chart: {
        events: {
          click: this.handleChartClick,
        },
      },
      xAxis: {
        events: {
          afterSetExtremes: this.handleSetExtremes,
        },
      },
      plotOptions: {
        series: {
          events: {
            click: this.handleSeriesClick,
            mouseOut: this.handlePointOut,
          },
          point: {
            events: {
              mouseOver: this.handlePointOver,
            },
          },
        },
      },
    })
  }

  syncThings(prevProps) {
    const {zoom} = this.props
    const [xAxis] = this.chart.xAxis
    const [nextMin, nextMax] = zoom || []
    const {min, max} = xAxis.getExtremes()
    const zoomUpdated = min !== nextMin && max !== nextMax
    if (zoom !== prevProps.zoom && zoomUpdated) {
      xAxis.setExtremes(nextMin, nextMax)
    }
  }

  notifyHighlight = debounce(v => {
    const {onHighlight} = this.props
    if (onHighlight) {
      onHighlight(v)
    }
  }, 100)

  handleSeriesClick = event => {
    const {onClick} = this.props
    if (onClick) {
      onClick(event.point.x)
    }
  }

  handleChartClick = event => {
    const {onClick} = this.props
    if (event.target.textContent === 'Reset zoom') {
      return
    }
    if (onClick) {
      onClick(event.xAxis[0].value)
    }
  }

  handlePointOver = event => {
    this.notifyHighlight(event.target.x)
  }

  handlePointOut = () => {
    this.notifyHighlight(-1)
  }

  handleSetExtremes = event => {
    const {onZoom} = this.props
    if (onZoom) {
      onZoom(event.min, event.max)
    }
  }

  storeRef = element => {
    this.container = element
    this.renderChart()
  }

  render() {
    const {render} = this.props
    return render({
      innerRef: this.storeRef,
    })
  }
}

export default Chart
