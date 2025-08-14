<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  rounded: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: "auto",
  },
  isPersistent: {
    type: Boolean,
    default: true,
  },
  subject: {
    type: String,
    default: "[subject]",
  },
})

const emits = defineEmits(['update:isDialogVisible', 'ok'])

const dialogVisibleUpdate = val => {
  emits('update:isDialogVisible', val)
}

const closeDialog = em => {
  emits(em)
  emits('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    :persistent="props.isPersistent"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard :rounded="props.rounded">
      <VCardText class="d-flex flex-column justify-center align-center ma-2">
        <br>
        <br>
        <VSheet class="text-black text-center font-weight-bold">
          Congratulations, your {{ props.subject }} was successful !
        </VSheet>
        <br>
        <VBtn
          class="text-none"
          rounded="xl"
          variant="flat"
          width="125px"
          @click="closeDialog('ok')"
        >
          OK
        </VBtn>
        <br>
      </VCardText>
    </VCard>
  </VDialog>
</template>