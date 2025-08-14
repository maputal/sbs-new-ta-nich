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
  headerNames: {
    type: Array,
    required: true,
  },
  dataNames: {
    type: Array,
    required: true,
  },
  row: {
    type: Object,
    required: true,
  },
  hasActionButton: {
    type: Boolean,
    default: true,
  },
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
      <VCardItem>
        <VCardTitle
          class="text-black font-weight-bold"
        >
          {{ props.title }}
        </VCardTitle>
        <template #append>
          <div>
            <VBtn
              class="text-white bg-black"
              density="compact"
              size="small"
              icon="mdi-window-close"
              @click="emits('update:isDialogVisible', false)"
            />
          </div>
        </template>
      </VCardItem>
      <VCardText>
        <VSheet
          v-for="(name, index) in props.headerNames"
          :key="index"
          class="my-2"
        >
          <span class="text-black font-weight-bold">{{ name }}</span>
          <VSpacer />
          <span class="text-black">{{ props.row[props.dataNames[index]] }}</span>
        </VSheet>
      </VCardText>
      <VCardActions
        v-if="props.hasActionButton"
        class="pa-3"
        style="background-color: #f8f8f8;"
      >
        <VSheet
          v-if="props.row['status'] == true"
          width="100%"
          style="background-color: #f8f8f8;"
        >
          <VBtn
            class="text-none"
            rounded="xl"
            variant="flat"
            block
            @click="emits('deactivate')"
            >
            Deactived Account
          </VBtn>
        </VSheet>
        <VSheet
          v-if="props.row['status'] == false"
          width="100%"
          style="background-color: #f8f8f8;"
        >
          <VBtn
            class="text-none"
            rounded="xl"
            variant="flat"
            block
            @click="emits('activate')"
            >
            Activate Account
          </VBtn>
        </VSheet>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
