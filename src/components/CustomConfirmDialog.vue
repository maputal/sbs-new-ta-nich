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

  // '1' for alert style and '2' for non-alert style
  confirmationStyling: {
    type: String,
    required: true,
  },
  messageTitle: {
    type: String,
    default: "[title]",
  },

  // subtitle if included must have at least 2 strings even if the last one is empty
  messageSubtitle: {
    type: Array,
    default: () => ["[subtitle]", ""],
  },
})

const emits = defineEmits(['update:isDialogVisible', 'no', 'yes'])

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
      <VSheet
        v-if="props.confirmationStyling == '1'"
        class="d-flex justify-center align-center mt-5"
      >
        <VIcon
          icon="mdi-alert-circle-outline"
          style="color: #ED2324;"
          size="50"
        />
      </VSheet>
      <VCardText class="d-flex flex-column justify-center align-center text-center">
        <VSheet v-if="props.confirmationStyling == '1'">
          <VSheet class="text-black font-weight-bold mb-3">
            {{ props.messageTitle }}
          </VSheet>
          <VSheet
            v-for="(subtitle, index) in props.messageSubtitle"
            :key="index"
            style="color: #A0A0A0;"
          >
            {{ subtitle }}
          </VSheet>
        </VSheet>
        <VSheet v-else-if="props.confirmationStyling == '2'">
          <VSheet class="text-black font-weight-bold">
            {{ props.messageTitle }}
          </VSheet>
        </VSheet>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-6 justify-center"
        :style="props.confirmationStyling == '1' ? {'background-color': '#F8F8F8'} : {}"
      >
        <VBtn
          class="text-none font-weight-black"
          rounded="xl"
          variant="outlined"
          width="125px"
          @click="closeDialog('no')"
        >
          No
        </VBtn>
        <VBtn
          class="text-none font-weight-black"
          rounded="xl"
          variant="flat"
          width="125px"
          @click="closeDialog('yes')"
        >
          Yes
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>