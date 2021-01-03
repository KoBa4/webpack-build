// eslint-disable-next-line no-unused-vars
// import settings from '../img/icons/settings.svg'

function requireAll(r) {
  r.keys().forEach(element => r(element))
}

requireAll(require.context('../img/icons/', true, /\.svg$/))
