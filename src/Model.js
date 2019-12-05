export default class Model {
  constructor() {
    this._soundOn = true
    this._musicOn = true
    this._bgMusicPlaying = false
    this._musicName = ''
  }
 
  set musicOn (value) {
    this._musicOn = value
  }
 
  get musicOn () {
    return this._musicOn
  }
 
  set soundOn (value) {
    this._soundOn = value
  }
 
  get soundOn () {
    return this._soundOn
  }
 
  set bgMusicPlaying (value) {
    this._bgMusicPlaying = value
  }
 
  get bgMusicPlaying () {
    return this._bgMusicPlaying
  }

  set musicName (value) {
    this._musicName = value
  }

  get musicName () {
    return this._musicName
  }
}
