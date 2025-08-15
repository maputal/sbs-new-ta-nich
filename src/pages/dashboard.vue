<script setup>
  import icon from '@/assets/images/svg/gg_hello.svg';
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';
import { useGlobalStore } from '@/store/useGlobalStore';

const appStore = useAppStore()

  const store = useGlobalStore()
  const myUser = computed(() => ({
    name: store.user?.name,
    phone_number: store.user?.account_obj.phone_number,
    email: store.user?.account_obj.email,
    company_name: store.user?.company_name,
  }))

  const route = useRoute()
  const router = useRouter()

  const toLoginWaba = () => {
    router.replace('/')
  }
  
  const todayDate = ref('')

  const months = {
    1:'January',
    2:'February',
    3:'March',
    4:'April',
    5:'May',
    6:'June',
    7:'July',
    8:'August',
    9:'September',
    10:'October',
    11:'November',
    12:'Desember', 
  }

  const days = {
    0:'Sunday',
    1:'Monday',
    2:'Tuesday',
    3:'Wednesday',
    4:'Thursday',
    5:'Friday',
    6:'Saturday',
  }

  const todayDateF = () => {
    let today = new Date()
    let dd = today.getDate()
    let day = today.getDay();
    let year = today.getFullYear()
    let month = today.getMonth() + 1
    let date =
      dd < 10 ? '0' + dd : dd
    return (
      days[day] +
      ', ' +
      date +
      ' ' +
      months[month] +
      ' ' +
      year
    )
  }

  const onDataError = (e) => {
    console.log('masuk error di onDataError', e)
    appStore.hideLoader()
    appStore.showError(e)
  }

  const onLoadOwnInfo = (data) => {}
  
  onMounted(() => {
    let isEmbeddedSignup = store.payloadFin.embedded_signup
    if(!isEmbeddedSignup){
      toLoginWaba()
    } else {
      let pload = {}
      globalRequest(
        'window.moffas.do_request',
        'getProfile',
        pload,
        onLoadOwnInfo,
        onDataError
      )
    }
    todayDate.value = todayDateF()
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
