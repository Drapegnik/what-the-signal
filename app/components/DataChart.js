import {basename} from 'path'

import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Chart from 'components/Chart'

import {updateSettings} from 'store/actions'
import {makeChartDataGetter} from 'store/selectors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const StatList = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
  width: 100%;
  height: 40px;
  padding: 5px;
  top: 20px;
`

const StatCell = styled.span`
  background-color: #202b33;
  border-radius: 5px;
  font-size: 10px;
  padding: 5px;
`

const ChartContainer = styled.div`
  min-height: 0;
  flex: 1 1 auto;
`

const StatsDefs = [
  {
    id: 'min',
    label: 'MIN',
  },
  {
    id: 'max',
    label: 'MAX',
  },
  {
    id: 'std',
    label: 'SD',
  },
  {
    id: 'amp',
    label: 'AMP',
  },
  {
    id: 'crest',
    label: 'PF',
  },
]

const mapStateToProps = () => {
  const selector = makeChartDataGetter()
  return (state, ownProps) => ({
    data: selector(state, ownProps.id),
    fftResolution: state.settings.fftResolution,
    fftFrom: state.settings.fftFrom,
    zoom: state.settings.zoom,
    mode: state.settings.mode,
  })
}

const mapDispatchToProps = {
  onUpdateSettings: updateSettings,
}

const DataChart = ({id, data, zoom, fftResolution, fftFrom, mode, onUpdateSettings}) => (
  <Container>
    <StatList>
      {StatsDefs.map(s => (
        <StatCell key={s.id}>
          {s.label}: {data.stats[s.id].toFixed(3)}
        </StatCell>
      ))}
    </StatList>
    <Chart
      config={{
        chart: {
          zoomType: 'x',
          spacingTop: 30,
          spacingBottom: 0,
        },
        title: {
          text: basename(id),
          align: 'left',
          margin: 0,
          y: -10,
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
          pointFormat: 'Value: {point.y}',
          formatter() {
            const time = (data.lengthSeconds / data.samples.length) * this.x
            return `[${time.toFixed(3)}s]: ${this.y.toFixed(3)}`
          },
          headerFormat: '',
          valueDecimals: 3,
        },
        xAxis: {
          crosshair: true,
          plotBands: mode === 'fft' && [
            {
              label: {
                text: 'FFT Range',
                style: {
                  color: 'yellow',
                },
              },
              color: 'rgba(244, 245, 83, 0.2)',
              from: fftFrom,
              to: fftFrom + fftResolution,
            },
          ],
        },
        series: [
          {
            data: data.samples,
            id,
          },
        ],
      }}
      zoom={zoom}
      render={props => <ChartContainer {...props} />}
      onZoom={(min, max) => {
        if (min !== zoom.min && max !== zoom.max) {
          onUpdateSettings('zoom', [min, max])
        }
      }}
      onClick={x => {
        onUpdateSettings('fftFrom', x)
      }}
    />
  </Container>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataChart)
