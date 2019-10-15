import React from 'react'
import {Box} from 'grid-styled'
import {connect} from 'react-redux'
import {Button, Menu, MenuItem, MenuDivider, Popover, Position} from '@blueprintjs/core'

import SettingsPopover from 'components/SettingsPopover'

import {selectAndOpenFile, takeScreenShot, closeFile, updateSettings, exit} from 'store/actions'

const mapDispatchToProps = {
  onOpenFile: selectAndOpenFile,
  onSave: takeScreenShot,
  onCloseFile: closeFile,
  onUpdateSettings: updateSettings,
  onExit: exit,
}

const Header = ({onOpenFile, onSave, onCloseFile, onUpdateSettings, onExit}) => (
  <div className="pt-navbar">
    <Box px={2}>
      <div className="pt-navbar-group pt-align-left">
        <Popover
          position={Position.BOTTOM_LEFT}
          content={
            <Menu>
              <MenuItem text="Add" label="⌘O" onClick={onOpenFile} />
              <MenuItem text="Save" label="⌘S" onClick={onSave} />
              <MenuItem text="Close" label="⌘E" onClick={onCloseFile} />
              <MenuDivider />
              <MenuItem text="Exit" label="⌘Q" onClick={onExit} />
            </Menu>
          }
          target={
            <Button className="pt-minimal" iconName="document" rightIconName="caret-down">
              File
            </Button>
          }
        />
        <Popover
          position={Position.BOTTOM_LEFT}
          content={
            <Menu>
              <MenuItem text="Domain">
                <MenuItem
                  iconName="time"
                  text="Time"
                  onClick={() => onUpdateSettings('mode', 'split')}
                />
                <MenuItem
                  iconName="pulse"
                  text="Frequency"
                  onClick={() => onUpdateSettings('mode', 'fft')}
                />
                <MenuItem
                  iconName="full-stacked-chart"
                  text="Full Length FFT"
                  onClick={() => onUpdateSettings('mode', 'full-fft')}
                />
                <MenuItem
                  iconName="full-stacked-chart"
                  text="Histogram"
                  onClick={() => onUpdateSettings('mode', 'histogram')}
                />
              </MenuItem>
              <MenuItem text="Layout">
                <MenuItem
                  iconName="grid-view"
                  text="Multiple charts"
                  onClick={() => onUpdateSettings('mode', 'split')}
                />
                <MenuItem
                  iconName="fullscreen"
                  text="Combine"
                  onClick={() => onUpdateSettings('mode', 'combine')}
                />
              </MenuItem>
            </Menu>
          }
          target={
            <Button className="pt-minimal" iconName="style" rightIconName="caret-down">
              View
            </Button>
          }
        />
      </div>
      <div className="pt-navbar-group pt-align-right">
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={<SettingsPopover />}
          target={<Button className="pt-minimal" iconName="cog" />}
        />
      </div>
    </Box>
  </div>
)

export default connect(
  null,
  mapDispatchToProps,
)(Header)
