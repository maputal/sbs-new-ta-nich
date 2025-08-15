<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  customErrorMessage: {
    // type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const updateModelValue = val => {
  console.log('val updateModelValue', val)
  emit('update:isDialogVisible', val)

  console.log('errorCode.value di updateModelValue', errorCode.value)
  if (errorCode.value == '403004'){
    location.reload()
  }
}

const onConfirmation = () => {
  isTraceID.value = false
  updateModelValue(false)
}

const localErrorMessage = ref(structuredClone(toRaw(props.errorMessage)))
const localCustomErrorMessage = ref(toRaw(props.customErrorMessage))
// const localCustomErrorMessage = ref(structuredClone(toRaw(props.customErrorMessage)))
const isLocalDialogVisible = ref(structuredClone(toRaw(props.isDialogVisible)))
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
  message: ''
})


const onDataError = e => {
  console.log('e.value')
  console.log(e.value)
  if(typeof e.value == 'string'){
    errorResult.value = e.value
  } else if (typeof e.value == 'object' && e.value.error_code) {
    errorResultObject.value.code = e.value.error_code
    errorResultObject.value.message = e.value.error_message
  } else {
    if (e.value.status === 403 || e.value.status === 500 || e.value.status === 400) {
      if (e.value.errortext) {
        errorResult.value = JSON.parse(e.value.errortext).error
        if(e.value.status === 403) {
          errorStatus.value = JSON.parse(e.value.errortext).status
          isStatus403.value = true
        }
      } else {
        errorResultObject.value.code = e.value.status
        errorResultObject.value.message = e.value.statusText
      }
    } else if (e.value.status === 401) {
      onConfirmation()
      router.replace('/logout')
    } else if(e.value.hasOwnProperty('trace_id')){
      errorResult.value = e.value
      if (e.value.error_code === "403007") {
        console.log('masuk hasOwnProperty(trace_id), tapi error_code = 403007')
        console.log(e)
        isInsufficientWallet.value = true
      } else {
        console.log('masuk hasOwnProperty(trace_id), tapi error_code != 403007')
        console.log(e)
        isTraceID.value = true
        errorCode.value = e.value.error_code
      }
    }
  }
}

onMounted(() => {
  // console.log(props.isDialogVisible)
  // console.log(props.errorMessage)
  // console.log(props.customErrorMessage)
  // console.log(localErrorMessage.value)
  // console.log(localCustomErrorMessage.value)
  if(typeof localCustomErrorMessage.value !== 'undefined'){
    onDataError(localCustomErrorMessage)
  }
})
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="500"
    class="error-dialog"
    :persistent="props.isDialogVisible"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText v-if="isInsufficientWallet">
        <div class="d-flex align-center pl-1">
          <VIcon color="error" icon="mdi-alert-outline" size="large"></VIcon>
          <h4 class="text-lg font-weight-bold pl-2">
            {{ errorResult.error_message }}
          </h4> 
        </div>
        <p class="text-black pt-2">
          Please ensure you have sufficient balance/limit
        </p> 
      </VCardText>
      <VCardText v-else>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="mb-4"
          style="width: 88px; height: 88px; pointer-events: none;"
        >
          <span class="text-5xl">!</span>
        </VBtn>
        <div 
          v-if="isTraceID"
          class="text-2xl font-weight-medium "
        >
          <p>{{ errorResult.error_message }}</p>
          <p 
            class="text-caption text-disabled"
          > 
            <b>Please attach the trace id below for report purpose</b><br>
            Trace ID : {{ errorResult.trace_id }}
          </p>
        </div>
        <h6
          v-else-if="isStatus403"
          class="text-lg font-weight-medium"
        >
          [{{ errorStatus }}] {{ errorResult }} 
        </h6>
        <h6
          v-else-if="errorResultObject.code"
          class="text-lg font-weight-medium"
        >
          [{{ errorResultObject.code }}] {{ errorResultObject.message }} 
        </h6>        
        <h6
          v-else
          class="text-lg font-weight-medium"
        >
          {{ errorResult }}
        </h6>
      </VCardText>
      <VCardActions 
        class="align-center gap-2"
        :class="isInsufficientWallet ? 'justify-end' : 'justify-center'"
      >
        <VBtn
          variant="elevated"
          @click="onConfirmation"
        >
          Ok
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.error-dialog .v-overlay__scrim {
  backdrop-filter: blur(5px);
}

.error-dialog
.v-overlay__scrim,
.v-navigation-drawer__scrim {
  background: rgba(var(--v-overlay-scrim-background, 88, 88, 88, 0.1), var(--v-overlay-scrim-opacity, 0.5)) !important;
  opacity: 1 !important;
}
</style>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
