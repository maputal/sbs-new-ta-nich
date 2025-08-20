// import { useGlobalStore } from '@/store/useGlobalStore'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: to => {
    //     return { name: 'login-waba' }
    //   },
    // },
    {
      path: '/',
      redirect: to => {
        return { name: 'dashboard' }
      },
    },
    ...setupLayouts(routes),
  ],
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to, from, next) => {
  // const store = useGlobalStore()
  console.log(to)
  console.log(from)

  const sessionId = sessionStorage.getItem('session_id')
  const sessionSecret = sessionStorage.getItem('session_secret')

  // PROD
  // if (to.meta.requiresAuth && (!store.token || store.token === 'null')
  if (to.meta.requiresAuth && !sessionId && !sessionSecret) {
    console.log('MASOK SINI SA')
    // return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined }})
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  } 
  else {
    next();
    return;
  }

  // // DEV MODE, DEL/COMMENT WHEN PROD!!!
  // next();
  // return;
})

export default router
