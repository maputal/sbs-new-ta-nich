<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}
// ===============================================  
const refVForm = ref()
const search = ref(null)

const detailData = ref({
  msisdn: '',
  currentIMEI: '',
  newIMEI: null,
})

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      if(detailData.value.newIMEI == detailData.value.currentIMEI){
        appStore.showError('The new IMEI must be different from the current one. Please try again.')
      } else {
        appStore.setPopup({
          title: 'Update IMEI',
          word: 'Are you sure you want to update IMEI for this MSISDN?',
          action: 'confirm',
          onSucc: () => {
            updateData()
          },
        })
      }
  })
}

const resetData = () => {
  detailData.value.msisdn = ''
  detailData.value.currentIMEI = ''
  detailData.value.newIMEI = null
}

function dummymoffasdofetchData(type, op, params, onSuccess, onError) {
  let dummyData = {    
    msisdn: '12345678',
    old_imei: '357260078965432',
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}
const fetchData = () => {
  console.log('Code fetchData!')
  appStore.showLoader() 

  const params = {
    msisdn: route.params.id || '',
  }
  console.log('params', params)

  // dummymoffasdofetchData | globalRequest
  dummymoffasdofetchData(
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

      detailData.value.msisdn  = response.msisdn
      detailData.value.currentIMEI  = response.old_imei

      appStore.hideLoader() 
    },
    onDataError
  )
}

const updateData = () => {
  console.log('Code updateData!')
  appStore.showLoader() 

  const params = {
    msisdn: detailData.value.msisdn || '',
    old_imei: detailData.value.currentIMEI || '',
    new_imei: detailData.value.newIMEI || '',
  }
  console.log('params', params)

  // dummymoffasdofetchData | globalRequest
  dummymoffasdofetchData(
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

      appStore.hideLoader() 

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully updated the IMEI',
        action: 'success',
        onSucc: () => {
          resetData()
          fetchData()
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

// =============================================== On Life Cycle Event
onMounted(() => {
  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }

  fetchData()
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
      <VCardTitle class="pt-3 pb-2">
        <VRow class="align-center justify-space-between">
          <VCol cols="12" md="4" class="d-flex align-center">
            <VBtn variant="tonal" color="#4F4F4F" icon="mdi-arrow-left" @click="goBack" />
          </VCol>
          <VCol cols="12" md="2" class="d-flex justify-end px-0">
            <VLabel class="ma-0 text-black font-weight-black">Update IMEI</VLabel>
          </VCol>
        </VRow>
      </VCardTitle>

      <VDivider />

      <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VCardText class="px-0">
          <VRow>
            <VCol cols="12" md="6">
              <VLabel for="MSISDN" class="mb-3 text-black font-weight-black">MSISDN</VLabel>
              <VTextField
                id="MSISDN"
                v-model="detailData.msisdn"
                label="Number"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Number is required']"
                focused
                readonly
              />
            </VCol>
            <VCol cols="12" md="6">
              <VLabel for="newIMEI" class="mb-3 text-black font-weight-black">New IMEI</VLabel>
              <VTextField
                id="newIMEI"
                v-model="detailData.newIMEI"
                label="Number"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Number is required']"
                focused
              />
            </VCol>
            <VCol cols="12" md="6">
              <VLabel for="currentIMEI" class="mb-3 text-black font-weight-black">Old IMEI</VLabel>
              <VTextField
                id="currentIMEI"
                v-model="detailData.currentIMEI"
                label="Number"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Number is required']"
                focused
                readonly
              />
            </VCol>
          </VRow>
        </VCardText>
  
        <VDivider />
  
        <VCardActions>
          <VRow class="align-center justify-end my-2">
            <VBtn class="px-3" variant="flat" color="primary" type="submit">Update</VBtn>
          </VRow>
        </VCardActions>
      </VForm>
    </VCard>
  </section>
</template>
  
<style lang="scss" scoped>
.full-height-card {
  height: 100%;
}
.bg-hover:hover {
  background-color: rgba(68, 73, 74, 5%);
  // cursor: pointer;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
