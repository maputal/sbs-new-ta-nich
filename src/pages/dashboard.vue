<script setup>
  import { useGlobalStore } from '@/store/useGlobalStore'

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

  const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
  const isErrorVisible = ref(false)
  const customErrorMessages = ref()
  const onDataError = (e) => {
    isErrorVisible.value = true
    customErrorMessages.value = e
  }
  const onLoadOwnInfo = (data) => {}
  
  onMounted(() => {
    let isEmbeddedSignup = store.payloadFin.embedded_signup
    if(!isEmbeddedSignup){
      toLoginWaba()
    } else {
      let pload = {}
      window.moffas.do_request(
        'getProfile',
        pload,
        onLoadOwnInfo,
        onDataError,
      )
    }
    todayDate.value = todayDateF()
  })
</script>
<template>
  <div>
    <!-- erorr dialogs -->
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    >
    </LazyErrorDialogs>
    <h6 class="text-2xl font-weight-bold mb-2">
      Hi, {{myUser.name}}
    </h6>
    <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
      <!-- 👉 Left Content -->
      <div class="mb-4">
        <!-- 👉 Address -->
        <p class="mb-0 font-weight-medium">
          Here what’s going on with Teleakses CRM Ticket 
        </p>
      </div>

      <!-- 👉 Right Content -->
      <div class="mb-4">
        <!-- 👉 Issue Date -->
        <p class="mb-2 font-weight-medium">
          <span>{{ todayDate }} </span>
          <!-- <span>{{ invoiceData.issuedDate }}</span> -->
        </p>
      </div>
    </div>
    <div>
      <VCard
        class="mb-6"
        title="Welcome To Teleakses CRM Ticket!"
      >
      </VCard>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
