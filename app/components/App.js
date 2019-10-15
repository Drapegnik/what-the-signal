import React, {Fragment} from 'react'
import {Flex} from 'grid-styled'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {NonIdealState, Button} from '@blueprintjs/core'

import Header from 'components/Header'
import CombinedChart from 'components/CombinedChart'
import DataChart from 'components/DataChart'
import FFTChart from 'components/FFTChart'
import FullFFTChart from 'components/FullFFTChart'
import HistogramChart from 'components/HistogramChart'

import {selectAndOpenFile} from 'store/actions'
import {getChartIDs} from 'store/selectors'

const FullscreenMessage = styled(NonIdealState)`
  height: auto !important;
  flex-grow: 1;
`

const FullHeightFlex = styled(Flex)`
  height: 100%;
`

const Grid = styled.div`
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  flex: 1 0 auto;
  height: 1px;
`

const mapStateToProps = state => ({
  chartIDs: getChartIDs(state),
  columns: state.settings.columns,
  mode: state.settings.mode,
})

const mapDispatchToProps = {
  onOpenFile: selectAndOpenFile,
}

const App = ({chartIDs, mode, columns, onOpenFile}) => (
  <FullHeightFlex direction="column">
    <Header />
    {chartIDs.length === 0 && (
      <FullscreenMessage
        title="Get started"
        description="Click the button below to load a signal file"
        visual="inbox"
        action={
          <Button iconName="folder-open" onClick={onOpenFile}>
            Load file
          </Button>
        }
      />
    )}
    {chartIDs.length !== 0 && mode === 'split' && (
      <Grid columns={columns}>
        {chartIDs.map(id => (
          <DataChart key={id} syncZoom id={id} />
        ))}
      </Grid>
    )}
    {chartIDs.length !== 0 && mode === 'fft' && (
      <Fragment>
        <Grid columns={columns}>
          {chartIDs.map(id => (
            <DataChart key={id} id={id} />
          ))}
          {chartIDs.map(id => (
            <FFTChart key={id} id={id} />
          ))}
        </Grid>
      </Fragment>
    )}
    {chartIDs.length !== 0 && mode === 'histogram' && (
      <Fragment>
        <Grid columns={columns}>
          {chartIDs.map(id => (
            <DataChart key={id} id={id} />
          ))}
          {chartIDs.map(id => (
            <HistogramChart key={id} id={id} />
          ))}
        </Grid>
      </Fragment>
    )}
    {chartIDs.length !== 0 && mode === 'full-fft' && (
      <Fragment>
        <Grid columns={columns}>
          {chartIDs.map(id => (
            <DataChart key={id} id={id} />
          ))}
          {chartIDs.map(id => (
            <FullFFTChart key={id} id={id} />
          ))}
        </Grid>
      </Fragment>
    )}
    {chartIDs.length !== 0 && mode === 'combine' && <CombinedChart />}
  </FullHeightFlex>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
