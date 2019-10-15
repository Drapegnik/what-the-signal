import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Chart from 'components/Chart'
import {makeHistogramDataGetter} from 'store/selectors'

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
  const selector = makeHistogramDataGetter()
  return (state, ownProps) => ({
    data: selector(state, ownProps.id),
  })
}

const HistogramChart = ({id, data: {histogram, categories}}) => {
  return (
    <Container>
      <Chart
        config={{
          chart: {
            type: 'column',
            zoomType: 'x',
            spacingTop: 30,
            spacingBottom: 0,
          },
          xAxis: {
            categories,
            crosshair: true,
          },
          yAxis: {
            min: 0,
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
              return `${point.y}`
            },
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
            },
          },
          series: [
            {
              data: histogram,
              id,
            },
          ],
        }}
        render={props => <ChartContainer {...props} />}
      />
    </Container>
  )
}

export default connect(mapStateToProps)(HistogramChart)
