<script setup>
import icon from '@/assets/images/svg/gg_hello.svg'
import globalRequest from '@/plugins/globalRequest'
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'

  const appStore = useAppStore()
  const store = useGlobalStore()

  const userName = sessionStorage.getItem('username')

  const myUser = computed(() => ({
    // name: store.user?.name,
    name: userName ? userName : '',
    // phone_number: store.user?.account_obj.phone_number,
    // email: store.user?.account_obj.email,
    // company_name: store.user?.company_name,
  }))

  const route = useRoute()
  const router = useRouter()

  const onDataError = (e) => {
    console.log('masuk error di onDataError', e)
    appStore.hideLoader()
    appStore.showError(e)
  }

  const onLoadOwnInfo = (data) => {}

  const getUserInfo = () => {
    console.log('Code getUserInfo!')

    appStore.showLoader()

    // const params = {
    //   // row_length: rowPerPagePackage.value,
    //   // page_number: currentPagePackage.value,
    //   // group_id: selectedGroup.value[0],
    // }

    const params = 'HALO MANIEZZ'

    globalRequest(
      'taSecure_POST',
      'get_user_info',
      params,
      (data) => {
        console.log('getUserInfo response1', data)
        
        const response = JSON.parse(data)
        console.log('getUserInfo response2', response)

        if (response?.success == false) {
          console.log('masuk error')
          appStore.hideLoader()
          appStore.showError(response)
          return
        }

        appStore.hideLoader()
      },
      onDataError
    )
  }
  
  onMounted(() => {
    let pload = {}
    // globalRequest(
    //   'window.moffas.do_request',
    //   'getUserInfo',
    //   pload,
    //   onLoadOwnInfo,
    //   onDataError
    // )

    getUserInfo()
  })
</script>
<template>
  <div>
    <div>
      <VCard
        class="mb-6"
        color="primary"
      >
        <VCardText class="d-flex flex-wrap justify-space-between align-center flex-column flex-sm-row">
          <!-- 👉 Left Content -->
          <div>
            <div class="text-2xl font-weight-bold mb-2">
              Welcome Back, {{myUser.name}} !
            </div>
            <div class="">
              <p class="text-white mb-0 font-weight-medium">
                Here what’s going on with Secure Bundling System 
              </p>
            </div>
          </div>
    
          <!-- 👉 Right Content -->
          <div class="">
            <img
              class="size-img"
              :src="icon"
              alt="img"
            />
          </div>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
