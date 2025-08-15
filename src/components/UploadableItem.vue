<!-- UploadableItem.vue -->
<script setup>
import { useFileProgressStore } from '@/store/useFileUploadStore'

const props = defineProps({
  id: { type: String, required: true },     // key used in the store (e.g., filename)
  name: { type: String, default: 'Nama file' },
  progress: { type: Number},
})

const emit = defineEmits(['cancel'])

const fp = useFileProgressStore()

// Read progress from Pinia, defaults to 0 if missing
// const progress = computed(() => fp.getProgress(props.id))

function onCancel() {
  // Done by parent
  //fp.removeFile(props.id)
  emit('cancel', props.id)
}
</script>

<template>
  <VCard class="pa-5 mb-6 pt-3 position-relative">
    <div class="d-flex align-center mb-3">
      <VIcon icon="mdi-file-document" class="text-h6 me-2" />
      <VCardTitle class="text-subtitle-1  text-black py-0 px-0">{{ name }}</VCardTitle>
    </div>

    <div class="d-flex align-center">
      <VProgressLinear
        :model-value="progress"
        height="8"
        rounded
        class="flex-grow-1 text-primary"
      />
      <span class="ms-3 text-caption text-medium-emphasis" style="min-width: 5ch; text-align: right;">
        {{ Math.round(props.progress) }}%
      </span>
    </div>

    <!-- Close / cancel -->
    <VBtn
      class="position-absolute close-btn"
      variant="flat"
      density="compact"
      aria-label="Close"
      style="top: 8px; right: 8px; scale: 0.5;"
      icon="mdi-close"
      @click="onCancel"
    />
  </VCard>
</template>

<style lang="scss" scoped>
.close-btn {
  background-color: rgb(var(--v-theme-surface-variant), .32) !important;
  color: #fff;
  &:hover {
    background-color: rgba(var(--v-theme-on-surface), calc(.32 + .14));
  }
  :deep(.v-icon) { color: inherit; }
}
</style>
