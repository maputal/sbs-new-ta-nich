<script setup>
import { useAppStore } from '@/store/app'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    // required: true,
  },
})

const appStore = useAppStore()

const popup = computed(() => appStore.popup)
const closePopup = appStore.closePopup
const confirmPopup = appStore.confirmPopup

const emit = defineEmits([
  'update:isDialogVisible',
])

// const onConfirmation = () => {
//   isTraceID.value = false
//   updateModelValue(false)
// }

onMounted(() => {
  // console.log(props.isDialogVisible)
  // console.log(props.customErrorMessage)
  // console.log(localCustomErrorMessage.value)

  // if(typeof localCustomErrorMessage.value !== 'undefined'){
  //   onDataError(localCustomErrorMessage)
  // }
})
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VOverlay
    :model-value="popup.visible"
    class="error-dialog d-flex justify-center mt-3"
    location-strategy="connected"
    scroll-strategy="none"
    persistent
    :z-index="3000"
  >
    <VCard min-width="500px">
      <VCardText class="d-flex align-center pb-3">
        <VIcon v-if="popup.action === 'error'" icon="mdi-close-circle" color="error" size="x-large" class="mr-2"/>
        <VIcon v-else-if="popup.action !== 'success'" color="warning" icon="mdi-alert-circle" size="x-large" class="mr-2"></VIcon>
        <VIcon v-else color="success" icon="mdi-check-circle" size="x-large" class="mr-2"></VIcon>

        <div>
          <h2 class="text-subtitle-1 text-black font-weight-bold">
            {{ popup.title || 'Success' }}
          </h2>
  
          <h6 class="text-subtitle-2 font-weight-medium">
            {{ popup.word }}
          </h6>
        </div>
      </VCardText>

      <VCardActions class="align-center gap-2 justify-end">
        <VBtn size="small" variant="elevated" @click="confirmPopup">{{ popup.buttonLabelsYes || 'OK' }}</VBtn>
        <VBtn v-if="popup.action !== 'success' && popup.action !== 'error'" size="small" variant="outlined" @click="closePopup">{{ popup.buttonLabelsNo || 'Cancel' }}</VBtn>
      </VCardActions>
    </VCard>
  </VOverlay>
</template>

<style lang="scss">
.error-dialog
.v-overlay__scrim,
.v-navigation-drawer__scrim {
  background: grey !important;
  opacity: 0.15 !important;
}
</style>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
