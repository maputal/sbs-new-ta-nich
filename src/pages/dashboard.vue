<script setup>
  import { useGlobalStore } from '@/store/useGlobalStore'
  import icon from '@/assets/images/svg/gg_hello.svg'
  import axios from '@axios'

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

  const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
  const companyID = ref(window.moffas.config.param_company_id)
  const sessionID = ref(localStorage.getItem('moffas.token'))

  const fetchDepartment = () => {
    let params = {
      company_id: companyID.value,
      session_id: sessionID.value,
      row_length: 100,
      current_page: 1, 
      search_filter: '',
    }
    // if (filter.value.group_name != '') {
    //   params.group_name = filter.value.group_name
    // }

    axios.post(urlBE.value + 'retrieve_page_access', params)
    .then(function (response) {
      console.log('response department list=', response);
      const responseData = response.data

      console.log('response')
      console.log(response)

      if(response.data.error_code) {
        onDataError(response.data)

        return
      }

      tableData.value = responseData.data
      totalPage.value = responseData.page_total
      totalDepartment.value = responseData.recordsTotal 

      showProgressCircular.value = false
    })
    .catch(function (error) {
      console.log(error);
      onDataError(error)
    });
  }
  
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

    // fetchDepartment()
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
