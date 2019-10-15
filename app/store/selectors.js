import {createSelector} from 'reselect'
import {hann} from 'fft-windowing'
import {FFT} from 'dsp.js'
import math from 'mathjs'
import loMin from 'lodash/min'
import loMax from 'lodash/max'

export const getChartIDs = createSelector(
  state => state.files,
  data => Object.keys(data),
)

const rms = v => Math.sqrt(v.reduce((a, x) => a + x * x, 0) / v.length)

export const getCombinedData = createSelector(
  state => state.files,
  files =>
    Object.entries(files).map(([fileName, data]) => ({
      ...data,
      fileName,
    })),
)

export const makeChartDataGetter = () =>
  createSelector(
    (state, id) => state.files[id],
    state => state.settings.zoom,
    (data, zoom) => {
      const [from = 0, to = data.samples.length] = zoom.map(Math.round)
      const selectedSamples = data.samples.slice(from < 0 ? 0 : from, to)
      const max = math.max(selectedSamples)
      const min = math.min(selectedSamples)
      return {
        ...data,
        stats: {
          std: math.std(selectedSamples),
          amp: math.abs(max) + math.abs(min),
          crest: max / rms(selectedSamples),
          max,
          min,
        },
      }
    },
  )

export const makeFFTDataGetter = () =>
  createSelector(
    (state, id) => state.files[id],
    state => state.settings.fftResolution,
    state => state.settings.fftFrom,
    (data, fftResolution, fftFrom) => {
      const fftTo = fftFrom + fftResolution
      if (fftFrom < 0 || fftTo >= data.samples.length) {
        return data
      }
      const selectedSamples = data.samples.slice(fftFrom, fftTo)
      const fft = new FFT(fftResolution, data.chunkFreq)
      fft.forward(selectedSamples)
      return {
        spectrum: [...fft.spectrum],
        ...data,
      }
    },
  )

export const makeHistogramDataGetter = () =>
  createSelector(
    (state, id) => state.files[id],
    state => state.settings.fftResolution,
    state => state.settings.fftFrom,
    (data, fftResolution, fftFrom) => {
      const fftTo = fftFrom + fftResolution
      if (fftFrom < 0 || fftTo >= data.samples.length) {
        return data
      }
      const selectedSamples = data.samples.slice(fftFrom, fftTo)
      const min = loMin(selectedSamples)
      const max = loMax(selectedSamples)

      const categories = []
      const result = []

      const STEP = 5
      for (let tmp = min; tmp < max + (max - min) / (STEP + 1); tmp += (max - min) / STEP) {
        categories.push(tmp.toFixed(4))
        result.push(0)
      }

      for (let i = 0; i < selectedSamples.length; i++) {
        for (let j = 0; j < categories.length; j++) {
          if (selectedSamples[i] <= categories[j]) {
            result[j]++
            break
          }
        }
      }

      return {histogram: result, categories, ...data}
    },
  )

export const makeFullFFTDataGetter = () =>
  createSelector(
    (state, id) => state.files[id],
    state => state.settings.fftResolution,
    (data, fftResolution) => {
      if (data.samples.length < fftResolution) {
        return
      }
      const spectrum = []
      for (let i = 0; i < data.samples.length - fftResolution; i += fftResolution / 2) {
        const samples = data.samples.slice(i, i + fftResolution)
        const fft = new FFT(fftResolution, data.chunkFreq)
        fft.forward(hann(samples))
        for (let x = 0; x < fft.spectrum.length; x++) {
          spectrum.push([i, x, fft.spectrum[x]])
        }
      }
      return {
        spectrum,
        ...data,
      }
    },
  )
