<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  customErrorMessage: {
    type: String,
  },
  
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  updateModelValue(false)
}

const localCustomErrorMessage = ref(structuredClone(toRaw(props.customErrorMessage)))
const errorResult = ref()

const onDataError = (e) => {
  if(typeof e.value == 'string'){
    errorResult.value = e.value
  } else {
    if (e.value.status === 403 || e.value.status === 500 || e.value.status === 400) {
      errorResult.value = JSON.parse(e.value.errortext).error
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
    :persistent='props.isDialogVisible'
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="mb-4"
          style="width: 88px; height: 88px; pointer-events: none;"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-base font-weight-medium">
          Failed to reset, your email must be connected to an account or your email does not exist.
        </h6>
      </VCardText>

      <VCardActions class="align-center justify-center gap-2">
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
  backdrop-filter: blur(5px)
}

.v-overlay__scrim, .v-navigation-drawer__scrim {
  background: rgba(var(--v-overlay-scrim-background),var(--v-overlay-scrim-opacity))!important;
  opacity: 1!important;
}
</style>
