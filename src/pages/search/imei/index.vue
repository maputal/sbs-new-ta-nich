<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import { isEpoch, toTimeDMYHMS } from '@/@core/utils/timeUtils';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

const toHistoryIMEI = () => {
  appStore.currentIMEI = detailSearchData.value.currentSearch
  router.push('/search/imei/history-imei/' + detailSearchData.value.currentSearch)
}

// ===============================================  
const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}

const confirmDialogProps = ref({
  // confirmationStyling: '',
  // messageTitle: '',
  op: '',
})

const chooseConfirmPopup = (data) => {
  appStore.setPopup({
    title: 'Delete IMEI',
    word: 'Are you sure you want to delete this IMEI from the system?',
    action: 'confirm',
    onSucc: () => {
      deleteIMEI()
    },
  })
}

function dummymoffasdofetchSeachData(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: {
      msisdn: '12345678',
      imei: '865123045678901',
      package_name: 'SuperData Combo',
      package_code: 'SDC123',
      status: 'ACTIVE',
      tarif: 'Rp 0 (Including TAX)',
      activated_tstamp: '1754829000'
    },
    imei: '865123045678901',
    activate_by: 'Admin1'
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}
const searchData = () => {
  console.log('Code searchData!')
  appStore.showLoader() 

  const params = {
    imei: search.value || '',
  }

  console.log('appStore.currentIMEI', appStore.currentIMEI)
  console.log('params', params)

  // dummymoffasdofetchSeachData | globalRequest
  dummymoffasdofetchSeachData(
    'taSecure_POST',
    'search_msisdn',
    params,
    (data) => {
      const response = JSON.parse(data)
      console.log('hasil response=', response)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      detailSearchData.value.currentSearch  = response.imei
      detailSearchData.value.reactivateBy  = response.activate_by
      detailSearchData.value.result  = response.data

      search.value = null

      if(appStore.currentIMEI !== ''){
        appStore.currentIMEI = ''
      }

      appStore.hideLoader() 
    },
    onDataError
  )
}

const deleteIMEI = () => {
  appStore.setPopup({
    title: 'Success!',
    word: 'IMEI has been successfully deleted.',
    action: 'success',
    onSucc: () => {
      resetData()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code deleteIMEI!')
  appStore.showLoader()

  const params = {
    imei: detailSearchData.value.currentSearch,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'IMEI has been successfully deleted.',
        action: 'success',
        onSucc: () => {
          resetData()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

// =============================================== User interaction
const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const refVForm = ref()
const search = ref(null)

const detailSearchData = ref({
  currentSearch: '',
  reactivateBy: '',
  result: null,
})

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      searchData()
  })
}

const resetData = () => {
  detailSearchData.value.currentSearch = ''
  detailSearchData.value.reactivateBy = ''
  detailSearchData.value.result = null
}

function getCardIcon(key) {
  return {
    cache: 'mdi-database-outline',
    whitelist: 'mdi-list-box-outline',
    status: 'mdi-information-outline',
    ssp_history: 'mdi-history',
  }[key] || ''; // fallback icon
}

function getCardText(key) {
  return {
    cache: 'MSISDN Cache',
    whitelist: 'Whitelist',
    status: 'Bundling Status',
    ssp_history: 'SSP History',
  }[key] || '';
}

function snakeToTitleCase(str) {
  if (!str) return ''

  if(str.includes('_')) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')         // camelCase → camel Case
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')    // PascalCase → Pascal Case
    .replace(/^./, char => char.toUpperCase()); // Capitalize first letter
}
// =============================================== On Life Cycle Event
onMounted(() => {
  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }     

  if(appStore.currentIMEI !== ''){
    search.value = appStore.currentIMEI
    searchData()
  }
})

onBeforeRouteLeave ((to, from) => {
  // if (localStorage.getItem('ticket_id')) {
  //   localStorage.removeItem('ticket_id')       
  // }

  if(appStore.currentIMEI !== ''){
    appStore.currentIMEI = ''
  }
})
</script>

<template>
  <section>
    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Search IMEI
      </h6>
      <!-- <p class="text-subtitle-1 mb-2 font-weight-medium">
        Secure Bundling System
      </p> -->
    </div>

    <VCard class="full-height-card px-4">
      <VCardTitle class="pt-6 pb-6">
        <VForm ref="refVForm" @submit.prevent="onSubmit">
          <VRow class="align-center">
            <VCol cols="12" md="2" class="d-flex align-center">
              <VLabel for="searchIMEI" class="ma-0 text-black font-weight-black">Search IMEI</VLabel>
            </VCol>

            <VCol cols="12" md="5">
              <VTextField
                id="searchIMEI"
                v-model="search"
                label="IMEI"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'IMEI is required']"
                class="w-100"
                clearable
                @click:clear="resetData"
              />
            </VCol>

            <VCol cols="12" md="3">
              <VBtn variant="flat" color="primary" type="submit" prepend-icon="mdi-search">Search</VBtn>
            </VCol>
          </VRow>
        </VForm>
        <div v-if="detailSearchData.result" class="pt-5">
          <VRow class="align-center">
            <VCol cols="12" md="2" class="d-flex align-center">
              <VLabel class="ma-0 text-black font-weight-black">IMEI Detail</VLabel>
            </VCol>
            <VCol cols="12" md="8">
              <VChip>                
                <span class="text-primary font-weight-medium">{{ detailSearchData.currentSearch || '' }}</span>
              </VChip>
            </VCol>
            <VCol cols="12" md="2">
              <div class="d-flex align-center justify-end">
                <div class=" text-subtitle-1">
                  Reactivate By:
                </div>
                <div class="text-black font-weight-bold text-subtitle-2 pl-2">
                  {{ detailSearchData.reactivateBy || '' }}
                </div>
              </div>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
      <VDivider v-if="detailSearchData.result" />
      <VCardText v-if="detailSearchData.result">
        <VRow 
          v-for="(value, key, index) in detailSearchData.result"
          :key="index"
          class="align-center"
        >
          <VCol cols="12" md="2">
            {{ snakeToTitleCase(key) || '' }}
          </VCol>
          <VCol cols="12" md="10">
            <span v-if="isEpoch(value)" class="ma-0 text-black font-weight-medium">{{ toTimeDMYHMS(value) || '' }}</span>
            <span v-else class="ma-0 text-black font-weight-medium">{{ value || '' }}</span>
          </VCol>
        </VRow>  
      </VCardText>
      <VDivider v-if="detailSearchData.result" />
      <VCardActions v-if="detailSearchData.result">
        <VRow class="align-center justify-space-between pt-5">
          <VCol cols="12" md="6">
            <VBtn class="text-none px-3" variant="flat" color="info" size="small" prepend-icon="mdi-history" @click="toHistoryIMEI">History IMEI</VBtn>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex justify-end">
              <VBtn class="text-none px-3" variant="flat" color="primary" size="small" prepend-icon="mdi-trash-can"
                @click.stop="() => {
                  chooseConfirmPopup()
                }"
              >
                Delete IMEI
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardActions>
    </VCard>
  </section>
</template>
  
<style lang="scss" scoped>
.full-height-card {
  height: 100%;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
