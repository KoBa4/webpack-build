import '../../node_modules/focus-visible/dist/focus-visible'
import '../scss/main.scss'
// eslint-disable-next-line no-unused-vars
import sprites from './sprites'

if (module.hot) {
  module.hot.accept() // already had this init code

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear()
  })
}
