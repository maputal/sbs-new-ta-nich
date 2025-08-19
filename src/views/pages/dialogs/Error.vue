<script setup>
import { useAppStore } from '@/store/app'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    // required: true,
  },
  customErrorMessage: {
    // type: String,
    required: true,
  },
})

const appStore = useAppStore()

const emit = defineEmits([
  'update:isDialogVisible',
])

const updateModelValue = val => {
  // console.log('val updateModelValue', val)
  // emit('update:isDialogVisible', val)

  appStore.hideError()

  console.log('errorCode.value di updateModelValue', errorCode.value)
  if (errorCode.value == '403004'){
    location.reload()
  }
}

const onConfirmation = () => {
  if(errorResult.value.includes('401')){
    router.replace('/logout')
  }

  isTraceID.value = false
  updateModelValue(false)
}

const localCustomErrorMessage = ref(toRaw(props.customErrorMessage))
// const localCustomErrorMessage = ref(structuredClone(toRaw(props.customErrorMessage)))

const errorResult = ref()
const errorStatus = ref()
const errorCode = ref()
const isTraceID = ref(false)
const isStatus403 = ref(false)
const isInsufficientWallet = ref(false)
const route = useRoute()
const router = useRouter()
const errorResultObject = ref({
  code: '',
  message: '',
  traceId: ''
})


// const onDataError = e => {
//   console.log('e.value')
//   console.log(e.value)
//   if(typeof e.value == 'string'){
//     errorResult.value = e.value
//   } else if (typeof e.value == 'object' && e.value.error_code) {
//     errorResultObject.value.code = e.value.error_code
//     errorResultObject.value.message = e.value.error_message
//   } else {
//     if (e.value.status === 403 || e.value.status === 500 || e.value.status === 400) {
//       if (e.value.errortext) {
//         errorResult.value = JSON.parse(e.value.errortext).error
//         if(e.value.status === 403) {
//           errorStatus.value = JSON.parse(e.value.errortext).status
//           isStatus403.value = true
//         }
//       } else {
//         errorResultObject.value.code = e.value.status
//         errorResultObject.value.message = e.value.statusText
//       }
//     } else if (e.value.status === 401) {
//       onConfirmation()
//       router.replace('/logout')
//     } else if(e.value.hasOwnProperty('trace_id')){
//       errorResult.value = e.value
//       console.log(e)
//       isTraceID.value = true
//       errorCode.value = e.value.error_code
//     } else if(e.value?.error){
//       errorResult.value = e.value?.error || 'Something went wrong. Please try again.'
//     }
//   }
// }

const onDataError = e => {
  console.log('e.value')
  console.log(e.value)
  if(typeof e.value == 'string'){
    errorResult.value = e.value
  } else if (typeof e.value == 'object' && e.value.error_code) {
    errorResultObject.value.code = e.value.error_code
    errorResultObject.value.message = e.value.error_message

    if(e.value.trace_id){
      errorResultObject.value.traceId = e.value.trace_id
    }
  }
}

onMounted(() => {
  // console.log(props.isDialogVisible)
  // console.log(props.customErrorMessage)
  // console.log(localCustomErrorMessage.value)
  if(typeof localCustomErrorMessage.value !== 'undefined'){
    onDataError(localCustomErrorMessage)
  }
})
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VOverlay
    :model-value="appStore.isErrorVisible"
    class="error-dialog d-flex justify-center mt-3"
    location-strategy="connected"
    scroll-strategy="none"
    persistent
    :z-index="3000"
  >
    <VCard min-width="500px">
      <VCardText class="d-flex align-center pb-1">
        <VIcon color="error" icon="mdi-close-circle" size="x-large" class="mr-2"></VIcon>
        <div>
          <h2 class="text-subtitle-1 text-black font-weight-bold pb-2">
            Error!
          </h2>
  
          <h6 v-if="errorResultObject.code" class="text-subtitle-2 font-weight-medium">
            ({{ errorResultObject.code }}) {{ errorResultObject.message }}
          </h6>   
          <h6 v-if="errorResultObject.traceId" class="text-caption text-grey-400 font-weight-medium">
            Trace ID : {{ errorResultObject.traceId }}
          </h6>  
        </div>
      </VCardText>

      <VCardActions class="align-center gap-2 justify-end">
        <VBtn size="small" variant="elevated" @click="onConfirmation">Ok</VBtn>
      </VCardActions>
    </VCard>
  </VOverlay>
</template>

<style lang="scss">
.error-dialog .v-overlay__scrim {
  // backdrop-filter: blur(5px);
}

.error-dialog
.v-overlay__scrim,
.v-navigation-drawer__scrim {
  background: grey !important;
  opacity: 0.2 !important;
}
</style>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
