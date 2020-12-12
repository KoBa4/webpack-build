import '../../node_modules/focus-visible/dist/focus-visible'
import '../scss/main.scss'
// import '../index.html'

if (module.hot) {
  module.hot.accept() // already had this init code

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear()
  })
}

class Game {
  constructor() {
    // eslint-disable-next-line no-unused-vars
    let name = 'Violin Charades'
  }
}
// eslint-disable-next-line no-unused-vars
const myGame = new Game()
console.log('test')
