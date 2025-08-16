<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import { isEpoch, toTimeDMYHMS } from '@/@core/utils/timeUtils';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

const toHistoryMsisdn = () => {
  appStore.currentMSISDN = detailSearchData.value.currentSearch
  router.push('/search/msisdn/history-msisdn/' + detailSearchData.value.currentSearch)
}

const toHistorySMS = () => {
  appStore.currentMSISDN = detailSearchData.value.currentSearch
  router.push('/search/msisdn/history-sms/' + detailSearchData.value.currentSearch)
}

const toUpdateImei = () => {
  appStore.currentMSISDN = detailSearchData.value.currentSearch
  router.push('/search/msisdn/update-imei/' + detailSearchData.value.currentSearch)
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
  if(confirmDialogProps.value.op == 'manual activation'){
    appStore.setPopup({
      title: 'Manual Activation',
      word: 'Do you want to proceed with manual activation?',
      action: 'confirm',
      onSucc: () => {
        doManualActivation()
      },
    })
  } else if(confirmDialogProps.value.op == 're-activation'){
    appStore.setPopup({
      title: 'Confirm SSP Re-activation',
      word: 'Do you want to proceed with SSP re-activation?',
      action: 'confirm',
      onSucc: () => {
        doSSPReActivation()
      },
    })
  } else if(confirmDialogProps.value.op == 'clear cache') {
    appStore.setPopup({
      title: 'Clear MSISDN Cache',
      word: 'Are you sure you want to clear the MSISDN cache?',
      action: 'confirm',
      onSucc: () => {
        doClearMSISDNCache()
      },
    })
  }
}

function dummymoffasdofetchSeachData(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: {
      cache: [
        {
          imei: '357260078965432', 
          tstamp: '1755253800'
        },
      ],
      whitelist: [
        {
          package_code: 'SDC123',
          package_name: 'SuperData Combo',
          expiry_package: '1767139200',
          tarif: 'Rp50.000',
          timestamp: '1754829000'
        },
      ],
      status: [
        {
          imei: '357260078965432',
          package_name: 'SuperData Combo',
          status: 'ACTIVE',
          package_code: 'SDC123',
          expiry_package: '1767139200',
          timestamp: '1755268200'
        },
      ],
      ssp_history: [
        {
          status: 'ACTIVE',
          bundilng_type: 'Whitelist MSISDN_TAC',
          sms_wording: 'Selamat Anda terdaftar di paket Bundling LTE 6GB, kuota LTE 1500 MB kuota Utama 500 MB',
          activated_time: '1756162145',
          terminated_reason: ' Auto Terminated',
          tstamp: '1753480790',
          terminated_time: '1756148390',
        },
      ],

    },
    msisdn: '12345678',
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
    msisdn: search.value || '',
  }

  console.log('appStore.currentMSISDN', appStore.currentMSISDN)
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

      detailSearchData.value.currentSearch  = response.msisdn
      detailSearchData.value.reactivateBy  = response.activate_by
      detailSearchData.value.result  = response.data

      search.value = null

      if(appStore.currentMSISDN !== ''){
        appStore.currentMSISDN = ''
      }

      appStore.hideLoader() 
    },
    onDataError
  )
}

const doManualActivation = () => {
  appStore.setPopup({
    title: 'Success!',
    word: 'The manual activation was completed successfully.',
    action: 'success',
    onSucc: () => {
      appStore.hideLoader()
    },
  })

  return

  console.log('Code doManualActivation!')
  appStore.showLoader()

  const params = {
    msisdn: detailSearchData.value.currentSearch,
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
        word: 'The manual activation was completed successfully.',
        action: 'success',
        onSucc: () => {
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

const doSSPReActivation = () => {
  appStore.setPopup({
    title: 'Success!',
    word: 'SSP has been successfully re-activated.',
    action: 'success',
    onSucc: () => {
      appStore.hideLoader()
    },
  })

  return

  console.log('Code doSSPReActivation!')
  appStore.showLoader()

  const params = {
    msisdn: detailSearchData.value.currentSearch,
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
        word: 'SSP has been successfully re-activated.',
        action: 'success',
        onSucc: () => {
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

const doClearMSISDNCache = () => {
  appStore.setPopup({
    title: 'Success!',
    word: 'MSISDN cache has been successfully cleared.',
    action: 'success',
    onSucc: () => {
      appStore.hideLoader()
    },
  })

  return

  console.log('Code doSSPReActivation!')
  appStore.showLoader()

  const params = {
    msisdn: detailSearchData.value.currentSearch,
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
        word: 'MSISDN cache has been successfully cleared.',
        action: 'success',
        onSucc: () => {
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
const priv = userData.priv

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

  if(appStore.currentMSISDN !== ''){
    search.value = appStore.currentMSISDN
    searchData()
  }
})
</script>

<template>
  <section>
    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Search MSISDN
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
              <VLabel for="searchMSISDN" class="ma-0 text-black font-weight-black">MSISDN Number</VLabel>
            </VCol>

            <VCol cols="12" md="5">
              <VTextField
                id="searchMSISDN"
                v-model="search"
                label="Number"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Number is required']"
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
        <div v-if="detailSearchData.result" class="d-flex justify-space-between pt-5">
          <VRow class="align-center">
            <VCol cols="12" md="4" class="d-flex align-center">
              <VLabel class="ma-0 text-black font-weight-black">MSISDN Detail</VLabel>
            </VCol>
            <VCol cols="12" md="2" class="px-0">
              <VChip>                
                <span class="text-primary font-weight-medium">{{ detailSearchData.currentSearch || '' }}</span>
              </VChip>
            </VCol>
          </VRow>
          <VRow class="align-center justify-end">
            <div class=" text-subtitle-1">
              Reactivate By:
            </div>
            <div class="text-black font-weight-bold text-subtitle-2 pl-2">
              {{ detailSearchData.reactivateBy || '' }}
            </div>
          </VRow>
        </div>
      </VCardTitle>
      <VDivider v-if="detailSearchData.result" />
      <VCardText v-if="detailSearchData.result" class="px-0">
        <VCard
          v-for="(value, key, index) in detailSearchData.result"
          :key="index"
          class="mx-0 my-3"
          variant="outlined"
        >
          <VCardTitle class="bg-title-detail-search text-black">
            <VIcon>{{ getCardIcon(key) }}</VIcon>
            <span class="text-subtitle-1 text-black font-weight-black pl-2">{{ getCardText(key) }}</span>
          </VCardTitle>

          <VCardText class="pt-4">
            <VRow 
              v-for="(value2, key2, index2) in value[0]"
              :key="index2"
              class="align-center"
            >
              <VCol cols="12" md="2">
                {{ snakeToTitleCase(key2) || '' }}
                <!-- MSISDN Detail -->
              </VCol>
              <VCol cols="12" md="10">
                <span v-if="isEpoch(value2)" class="ma-0 text-black font-weight-medium">{{ toTimeDMYHMS(value2) || '' }}</span>
                <span v-else class="ma-0 text-black font-weight-medium">{{ value2 || '' }}</span>
              </VCol>
            </VRow>  
          </VCardText>
        </VCard>
      </VCardText>
      <VDivider v-if="detailSearchData.result" />
      <VCardActions v-if="detailSearchData.result">
        <VRow class="align-center pt-5">
          <VCol cols="12" md="4">
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-history" @click="toHistoryMsisdn">History MSISDN</VBtn>
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-file-word" @click="toHistorySMS">History SMS Wording</VBtn>
          </VCol>
          <VCol cols="12" md="4">
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-refresh" @click="toUpdateImei">Update IMEI</VBtn>
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-form-textbox"
              @click.stop="() => {
                confirmDialogProps.op = 'manual activation'
                chooseConfirmPopup()
              }"
            >
              Manual Activation
            </VBtn>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-cloud-refresh"
              @click.stop="() => {
                confirmDialogProps.op = 're-activation'
                chooseConfirmPopup()
              }"
            >
              SSP Re-activation
            </VBtn>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn class="px-3" variant="flat" color="info" size="small" prepend-icon="mdi-trash-can"
              @click.stop="() => {
                confirmDialogProps.op = 'clear cache'
                chooseConfirmPopup()
              }"
            >
              Clear MSISDN Cache
            </VBtn>
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
