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
  title: {
    type: String,
    default: "[title]",
  },
  // headerNames: {
  //   type: Array,
  //   required: true,
  // },
  // dataNames: {
  //   type: Array,
  //   required: true,
  // },
  // row: {
  //   type: Object,
  //   required: true,
  // },
  // hasActionButton: {
  //   type: Boolean,
  //   default: true,
  // },
})

const emits = defineEmits(['update:isDialogVisible', 'activate', 'deactivate'])

const dialogVisibleUpdate = val => {
  emits('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard :rounded="props.rounded">
      <VCardItem class="pa-2">
        <div class="d-flex justify-end pt-3 pr-3">
          <VBtn 
            variant="flat"
            density="compact"
            icon="mdi-window-close"
            size="small"
            @click="emits('update:isDialogVisible', false)"
          />
        </div>

        <VCardTitle
          class="text-black text-center font-weight-bold pt-4"
        >
          {{ props.title }}
        </VCardTitle>
        <VCardSubtitle class="text-black text-center">
          Let us know how we can help
        </VCardSubtitle>
      </VCardItem>
      <div class="d-flex py-4 px-3">
        <VCol>
          <VCard
            class="mx-auto"
            max-width="344"
            variant="outlined"
            color="primary"
          >
            <div class="d-flex align-center justify-center pt-3">
              <VIcon 
                icon="ic:baseline-email" 
                color="black"
                size="x-large"
              />
            </div>
            <VCardItem>
              <VCardTitle class="text-black text-center text-lg font-weight-bold">
                Email to support
              </VCardTitle>
              <VCardSubtitle class="text-center text-grey-600">
                We’re here to help.
              </VCardSubtitle>
            </VCardItem>
            <VCardTitle class="text-black text-center text-lg text-decoration-underline font-weight-bold">
              corporate.helpdesk@ioh.co.id
            </VCardTitle>
          </VCard>
        </VCol>
        <VCol>
          <VCard
            class="mx-auto"
            max-width="344"
            variant="outlined"
            color="primary"
          >
            <div class="d-flex align-center justify-center pt-3">
              <VIcon 
                icon="material-symbols:call" 
                color="black"
                size="x-large"
              />
            </div>
            <VCardItem>
              <VCardTitle class="text-black text-center text-lg font-weight-bold">
                Call us
              </VCardTitle>
              <VCardSubtitle class="text-center text-grey-600">
                24 Hours/Mon-Fri 8am to 5pm.
              </VCardSubtitle>
            </VCardItem>
            <VCardTitle class="text-black text-center text-lg text-decoration-underline font-weight-bold">
              021-30008686
            </VCardTitle>
          </VCard>
        </VCol>
      </div>
    </VCard>
  </VDialog>
</template>
