import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {FormGroup} from '@blueprintjs/core'

import {updateSettings} from 'actions'

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

const SettingsPopover = ({settings, onUpdate}) => (
  <Container>
    <FormGroup label="Columns">
      <input
        type="number"
        className="pt-input pt-fill"
        value={settings.columns}
        onChange={({target: {value}}) => onUpdate('columns', value)}
      />
    </FormGroup>
    <FormGroup label="FFT Resolution">
      <input
        className="pt-input pt-fill"
        defaultValue={settings.fftResolution}
        onBlur={({target: {value}}) => {
          if (!value || !Number(value) || value < 0) {
            return
          }
          onUpdate('fftResolution', np2(Number(value)))
        }}
      />
    </FormGroup>
  </Container>
)

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPopover)
