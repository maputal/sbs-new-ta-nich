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
}

const onConfirmation = () => {
  if(errorResultObject.value.code == '401-004-001'){
    router.replace('/logout')
  }
  updateModelValue(false)
}

const localCustomErrorMessage = ref(toRaw(props.customErrorMessage))
// const localCustomErrorMessage = ref(structuredClone(toRaw(props.customErrorMessage)))

const route = useRoute()
const router = useRouter()
const errorResultObject = ref({
  code: '',
  message: '',
  traceId: ''
})

const onDataError = e => {
  console.log('e.value')
  console.log(e.value)
  if (typeof e.value == 'object' && e.value.error_code) {
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
// .error-dialog .v-overlay__scrim {
//   // backdrop-filter: blur(5px);
// }

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
