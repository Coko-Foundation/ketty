import { startClient } from '@coko/client'

import routes from './routes'
import { lightTheme, darkTheme } from './themes'
// import makeApolloConfig from './apolloConfig'

const options = {
  // makeApolloConfig,
}

const theme =
  localStorage.getItem('ketty-theme') === 'dark' ? darkTheme : lightTheme

window.addEventListener('themUpdate', e => {
  const newTheme = e.detail['ketty-theme'] === 'dark' ? darkTheme : lightTheme

  startClient(routes, newTheme, options)
})

// update theme in other tabs when theme is changed
window.addEventListener('storage', event => {
  const { key, newValue } = event

  if (key === 'ketty-theme') {
    const newTheme = newValue === 'dark' ? darkTheme : lightTheme

    startClient(routes, newTheme, options)
  }
})

startClient(routes, theme, options)
