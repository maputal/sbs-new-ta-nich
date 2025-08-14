<script setup>
  import { useGlobalStore } from '@/store/useGlobalStore';
  const router = useRouter()
  const store = useGlobalStore()
  const logout = () => {
    const onD = function () {
      store.SET_USER(null)
      store.SET_TOKEN(null)
      store.SET_PAYLOAD_FIN(null)
      if(localStorage){
        localStorage.removeItem('user', null)
        localStorage.removeItem('token', null)
        localStorage.removeItem('payload_fin', null)
      }
      router.push('/login').then(() => {
        localStorage.clear()
        window.location.reload(true)
      })
    }

    moffas.do_request('logout', '{}', onD, onD)
  }
  onMounted(() =>{
    logout()
  })
</script>

<template>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
