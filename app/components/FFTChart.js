import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {NonIdealState} from '@blueprintjs/core'

import Chart from 'components/Chart'
import {makeFFTDataGetter} from 'selectors'

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
  const selector = makeFFTDataGetter()
  return (state, ownProps) => ({
    data: selector(state, ownProps.id),
    fftResolution: state.settings.fftResolution,
  })
}

const FFTChart = ({id, data, fftResolution}) => {
  if (!data.spectrum) {
    return (
      <NonIdealState
        title="Select FFT Range"
        description="Please, click any point on the left to see FFT chart"
        visual="series-search"
      />
    )
  }
  return (
    <Container>
      <Chart
        config={{
          chart: {
            zoomType: 'x',
            spacingTop: 30,
            spacingBottom: 0,
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
              const freq = this.x * data.chunkFreq / fftResolution * 2
              return `[${freq.toFixed(0)}Hz]: ${this.y.toFixed(3)}`
            },
          },
          series: [
            {
              data: data.spectrum,
              id,
            },
          ],
        }}
        render={props => <ChartContainer {...props} />}
      />
    </Container>
  )
}

export default connect(mapStateToProps)(FFTChart)
