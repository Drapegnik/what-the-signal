import {extname, join as joinPath, dirname} from 'path'
import parseFile from 'utils/parse-file'

import Toaster, {Intent} from 'components/Toaster'

const electron = window.require('electron')
const {desktopCapturer} = electron
const {dialog, getCurrentWindow, require: hostRequire} = electron.remote
const fs = hostRequire('fs')
const os = hostRequire('os')

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

export const takeScreenShot = () => dispatch => {
  const handleVideoStream = stream => {
    // Create hidden video tag
    const video = document.createElement('video')
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;'
    // Event connected to stream
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    video.onloadedmetadata = function() {
      // Set video ORIGINAL height (screenshot)
      video.style.height = this.videoHeight + 'px'
      video.style.width = this.videoWidth + 'px'

      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = this.videoWidth
      canvas.height = this.videoHeight
      const ctx = canvas.getContext('2d')
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const base64Image = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '')
      const timestamp = new Date().getTime()
      fs.writeFile(`${os.homedir()}/Desktop/plot-${timestamp}.png`, base64Image, 'base64', err => {
        if (err) {
          dispatch(fatalError(err, {message: `Error writeFile: ${err.message}`}))
          return
        }
        dispatch({type: 'TakeScreenShot'})
      })

      // Remove hidden video tag
      video.remove()
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop()
      } catch (error) {
        dispatch(fatalError(error, {message: `takeScreenShot error: ${error.message}`}))
      }
    }
    video.src = URL.createObjectURL(stream)
    document.body.appendChild(video)
  }

  desktopCapturer.getSources({types: ['window', 'screen']}, (error /*, sources*/) => {
    if (error) {
      dispatch(fatalError(error, {message: `desktopCapturer error: ${error.message}`}))
    }

    // TEMP const [source] = sources.filter(({name}) => name === 'Electron')
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            minWidth: 1280,
            maxWidth: 4000,
            minHeight: 720,
            maxHeight: 4000,
          },
        },
      },
      handleVideoStream,
      error => {
        console.log(error)
        dispatch(fatalError(error, {message: `navigator.webkitGetUserMedia: ${error.name}`}))
      },
    )
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
