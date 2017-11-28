import DataView from 'jdataview'

export default buffer => {
  const view = new DataView(buffer, undefined, undefined, true)
  const magic = view.getString(4)
  const channelCount = view.getInt32()
  const samplesPerChunk = view.getInt32()
  const spectralLineCount = view.getInt32()
  const chunkFreq = view.getInt32()
  const freqStep = view.getFloat32()
  const chunkReceivingTime = view.getFloat32()
  const lengthSeconds = view.getInt32()
  const chunkCountRequest = view.getInt32()
  const sampleCount = view.getInt32()
  const chunkCount = view.getInt32()
  const max = view.getFloat32()
  const min = view.getFloat32()
  const samples = []
  for (let i = 0; i < sampleCount; i++) {
    samples.push(view.getFloat32())
  }
  return {
    magic,
    channelCount,
    samplesPerChunk,
    spectralLineCount,
    chunkFreq,
    freqStep,
    chunkReceivingTime,
    lengthSeconds,
    chunkCountRequest,
    sampleCount,
    chunkCount,
    max,
    min,
    samples,
  }
}
