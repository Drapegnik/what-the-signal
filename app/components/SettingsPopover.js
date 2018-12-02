import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {FormGroup} from '@blueprintjs/core'

import {updateSettings} from 'store/actions'

const Container = styled.div`
  padding: 32px;
  width: 200px;
`

const np2 = n => 1 << (31 - Math.clz32(n))

const mapStateToProps = state => ({
  settings: state.settings,
})

const mapDispatchToProps = {
  onUpdate: updateSettings,
}

const SettingsPopover = ({settings, onUpdate}) => {
  const changeResolution = value => {
    if (!value || !Number(value) || value < 0) {
      return
    }
    onUpdate('fftResolution', np2(Number(value)))
  }
  return (
    <Container>
      <FormGroup label="Columns">
        <input
          type="number"
          className="pt-input pt-fill"
          value={settings.columns}
          onChange={({target: {value}}) => onUpdate('columns', value)}
        />
      </FormGroup>
      {/* `key` used for rerendering `input` and pass new calculated `fftResolution` */}
      <FormGroup key={settings.fftResolution} label="FFT Resolution">
        <input
          className="pt-input pt-fill"
          defaultValue={settings.fftResolution}
          onBlur={({target: {value}}) => {
            changeResolution(value)
          }}
          onKeyPress={({key, target: {value}}) => {
            if (key === 'Enter') {
              changeResolution(value)
            }
          }}
        />
      </FormGroup>
    </Container>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPopover)
