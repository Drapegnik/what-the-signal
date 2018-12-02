import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Chart from 'components/Chart'

import {updateSettings} from 'store/actions'
import {getCombinedData} from 'store/selectors'

const Container = styled.div`
  height: 100px;
`

const mapStateToProps = state => ({
  data: getCombinedData(state),
  zoom: state.settings.zoom,
})

const mapDispatchToProps = {
  onUpdateSettings: updateSettings,
}

// UNUSED:
const SelectionChart = ({data, zoom, onUpdateSettings}) => (
  <Chart
    config={{
      chart: {
        zoomType: 'x',
        events: {
          selection(event) {
            const [xAxis] = event.xAxis
            onUpdateSettings('zoom', [xAxis.min, xAxis.max])
            return false
          },
        },
      },
      plotOptions: {
        line: {
          enableMouseTracking: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      xAxis: {
        plotBands: [
          {
            id: 'mask-before',
            from: zoom[0] || 0,
            to: zoom[1] || Math.max(...data.map(({samples}) => samples.length)),
            color: 'rgba(1, 1, 1, 0.2)',
          },
        ],
      },
      yAxis: {
        visible: false,
      },
      series: data.map(({fileName, samples}) => ({
        id: fileName,
        data: samples,
      })),
    }}
    render={props => <Container {...props} />}
  />
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectionChart)
