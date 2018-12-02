import {basename} from 'path'

import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Chart from 'components/Chart'

import {getCombinedData} from 'store/selectors'

const Fill = styled.div`
  flex: 1 1 auto;
  min-height: 0;
`

const mapStateToProps = state => ({
  data: getCombinedData(state),
  zoom: state.settings.zoom,
})

const CombinedChart = ({data}) => (
  <Chart
    config={{
      chart: {
        zoomType: 'x',
      },
      tooltip: {
        enabled: true,
        shared: true,
        crosshairs: true,
        formatter() {
          return this.points
            .map((point, index) => {
              const {fileName, samples, lengthSeconds} = data[index]
              const time = (lengthSeconds / samples.length) * point.x
              // What a mess, prettier
              return `<span style="color:${point.point.color}">\u25CF</span> ${basename(
                fileName,
              )}: <b>${time.toFixed(3)}s</b>, <b>${point.y}</b><br/>`
            })
            .join('')
        },
      },
      series: data.map(({fileName, samples}) => ({
        id: fileName,
        data: samples,
      })),
    }}
    render={props => <Fill {...props} />}
  />
)

export default connect(mapStateToProps)(CombinedChart)
