/* eslint-disable import/order */
import '@/@fake-db/db'
// import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { useGlobalStore } from '@/store/useGlobalStore'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()

// Load config before creating app
async function loadConfig() {
  try {
    const base = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${base}config/config.json`)
    const config = await response.json()
    
    return config
  } catch (error) {
    console.error('Failed to load configuration:', error)
    return {}
  }
}

// Initialize app after config is loaded
loadConfig().then(config => {
  // Create Vue app
  const app = createApp(App)

  console.log('config di main.js=', config)
  // Set config globally
  window.$config = config

  // Use plugins
  app.use(vuetify)
  app.use(createPinia())
  app.use(router)
  app.use(layoutsPlugin)

  // Check local storage to handle refreshes
  const store = useGlobalStore()
  if (window.localStorage) {
    let localUserString = window.localStorage.getItem('user') || 'null'
    let localUser = JSON.parse(localUserString)
    if (localUser && store.user !== localUser) {
      store.SET_USER(localUser)
      store.SET_TOKEN(window.localStorage.getItem('token'))
      store.SET_PAYLOAD_FIN(JSON.parse(window.localStorage.getItem('payload_fin')))
    }
  }

  // Mount app
  app.mount('#app')
})
