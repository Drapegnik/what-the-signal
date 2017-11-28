import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {NonIdealState} from '@blueprintjs/core'

import Chart from 'components/Chart'
import {makeFullFFTDataGetter} from 'selectors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const ChartContainer = styled.div`
  min-height: 0;
  flex: 1 1 auto;
`

const mapStateToProps = () => {
  const selector = makeFullFFTDataGetter()
  return (state, ownProps) => ({
    data: selector(state, ownProps.id),
    fftResolution: state.settings.fftResolution,
  })
}

const FullFFTChart = ({id, data, fftResolution}) => {
  if (!data.spectrum) {
    return (
      <NonIdealState
        visual="warning-sign"
        title="Too little data"
        description={`Sample count is less then fft resolution (${
          fftResolution
        })`}
      />
    )
  }
  return (
    <Container>
      <Chart
        config={{
          chart: {
            type: 'heatmap',
            zoomType: 'xy',
            spacingTop: 30,
            spacingBottom: 0,
          },
          yAxis: {
            max: fftResolution / 2,
          },
          colorAxis: {
            stops: [
              [0, '#3060cf'],
              [0.5, '#fffbbc'],
              [0.9, '#c4463a'],
              [1, '#c4463a'],
            ],
          },
          tooltip: {
            enabled: true,
            positioner() {
              return {
                x: this.chart.chartWidth - this.label.width,
                y: 0,
              }
            },
            style: {
              color: 'white',
            },
            borderWidth: 0,
            backgroundColor: 'none',
            formatter() {
              const {point} = this
              const freq = this.y * data.chunkFreq / fftResolution * 2
              const time = data.lengthSeconds / data.samples.length * point.x
              // prettier-ignore
              return `[${time.toFixed(3)}s] [${freq.toFixed(0)}Hz]: ${point.value.toFixed(3)}`
            },
          },
          series: [
            {
              data: data.spectrum,
              borderWidth: 0,
              colsize: fftResolution / 2,
              turboThreshold: Number.MAX_VALUE,
              boostThreshold: 100,
              id,
            },
          ],
        }}
        render={props => <ChartContainer {...props} />}
      />
    </Container>
  )
}

export default connect(mapStateToProps)(FullFFTChart)
