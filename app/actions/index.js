import {extname, join as joinPath, dirname} from 'path'
import parseFile from 'utils/parse-file'

import Toaster, {Intent} from 'components/Toaster'

const electron = window.require('electron')
const {dialog, getCurrentWindow, require: hostRequire} = electron.remote
const fs = hostRequire('fs')

export const fatalError = (error, meta) => dispatch => {
  Toaster.show({
    message: meta.message || `Unexpected error: ${error.message}`,
    intent: Intent.DANGER,
  })
  dispatch({
    type: 'FatalError',
    payload: {
      error,
      meta,
    },
  })
}

export const openBinaryFile = fileName => dispatch => {
  fs.readFile(fileName, (error, data) => {
    if (error) {
      dispatch(
        fatalError(error, {
          message: `Error loading file: ${error.message}`,
          fileName,
        }),
      )
      return
    }
    dispatch({
      type: 'AddFile',
      payload: {
        fileName,
        data: parseFile(data),
      },
    })
  })
}

export const openTextFile = fileName => dispatch => {
  fs.readFile(fileName, 'utf8', (error, data) => {
    if (error) {
      dispatch(
        fatalError(error, {
          message: `Error loading file: ${error.message}`,
          fileName,
        }),
      )
      return
    }
    const dir = dirname(fileName)
    data
      .split(/[\r\n]+/)
      .filter(l => Boolean(l))
      .forEach(line => {
        dispatch(openBinaryFile(joinPath(dir, line)))
      })
  })
}

export const selectAndOpenFile = () => dispatch => {
  const fileNames = dialog.showOpenDialog(getCurrentWindow(), {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Signal Files',
        extensions: ['txt', 'bin'],
      },
      {
        name: 'All Files',
        extensions: ['*'],
      },
    ],
  })

  if (!fileNames) {
    return
  }

  for (const fileName of fileNames) {
    switch (extname(fileName).toLowerCase()) {
      case '.bin':
        dispatch(openBinaryFile(fileName))
        break
      case '.txt':
        dispatch(openTextFile(fileName))
        break
      default:
        dispatch(
          fatalError(new Error(`Unsupported file type: ${extname(fileName)}`), {
            message: `Unsupported file type: ${extname(fileName)}`,
            fileName,
          }),
        )
        break
    }
  }

  dispatch({
    type: 'FilesSelected',
    payload: {fileNames},
  })
}

export const closeFile = () => ({
  type: 'CloseFile',
})

export const updateSettings = (field, value) => ({
  type: 'UpdateSettings',
  payload: {field, value},
})

export const exit = () => () => {
  getCurrentWindow().close()
}
