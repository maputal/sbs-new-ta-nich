<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'clicked'
])

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  updateModelValue(false)
  emit('clicked', true)
}

const urlConfirmPopUP = ref(window.moffas.config.url_confirm_acc_popup)
const urlLabelConfirmPopUP = ref(window.moffas.config.label_confirm_acc_popup)

</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="600"
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

        <h6 class="text-lg font-weight-medium">
          Please makesure that your browser already accept popup from 
          <a target="_blank" rel="noopener noreferrer" :href="urlConfirmPopUP">{{urlLabelConfirmPopUP}}</a> to continue with the signup flow
        </h6>
      </VCardText>

      <VCardActions class="align-center justify-center gap-2">
        <VBtn
          variant="elevated"
          @click="onConfirmation"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
