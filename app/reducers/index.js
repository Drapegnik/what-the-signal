import {combineReducers} from 'redux'
import createReducer from 'utils/create-reducer'

const InitialFiles = {
  // hey: {
  //   lengthSeconds: 3,
  //   samples: [1, 0, 1, 0, 1, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2],
  // },
  // ho: {
  //   lengthSeconds: 2,
  //   samples: [0, 1, 0, 1, 0, 1, 0, 0, 0, 5, 5, 5, 2, 2, 2],
  // },
}

const files = createReducer(InitialFiles, {
  AddFile: (state, {payload: {fileName, data}}) => ({
    ...state,
    [fileName]: data,
  }),
  CloseFile: () => ({}),
})

const InitialSettings = {
  mode: 'split',
  fftResolution: 1024,
  fftFrom: 0,
  columns: 2,
  zoom: [],
}

const settings = createReducer(InitialSettings, {
  UpdateSettings: (state, {payload: {field, value}}) => {
    const updates = {[field]: value}
    if (field === 'mode' && value === 'fft') {
      updates.zoom = []
    }
    return {
      ...state,
      ...updates,
    }
  },
  CloseFile: state => ({
    ...state,
    zoom: [],
  }),
})

const rootReducer = combineReducers({
  files,
  settings,
})

export default rootReducer
