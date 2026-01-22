import { startClient } from '@coko/client'

import routes from './routes'
import { lightTheme, darkTheme } from './themes'
import { themeInitializer } from './utils'
// import makeApolloConfig from './apolloConfig'

const options = {
  // makeApolloConfig,
}

// apply new theme on themeUpdate event
window.addEventListener('themeUpdate', e => {
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

// calculate initial theme and use it to start the app
const theme = themeInitializer() === 'dark' ? darkTheme : lightTheme

startClient(routes, theme, options)
