import '../../node_modules/focus-visible/dist/focus-visible'
import '../scss/main.scss'

if (module.hot) {
  module.hot.accept() // already had this init code

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear()
  })
}
