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

  // Should be an array of objects, each containing headerName, dataName, and inputType
  // if inputTypes is 'select' then must also include array of items
  groupData: {
    type: Object,
    required: true,
  }, 
  packageList: {
    type: Array,
  },
  hasActionButton: {
    type: Boolean,
    default: true,
  },
  priv: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'update:modelValue','save', 'create'])

const groupData = ref(structuredClone(toRaw(props.groupData)))
const refVForm = ref()

watch(props, () => {
  groupData.value = structuredClone(toRaw(props.groupData))
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      // emits('update:modelValue', false)
      emits('save', groupData.value)
    }
  })
}

const dialogVisibleUpdate = val => {
  emits('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    persistent
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard 
      :rounded="props.rounded"
    >
      <VCardTitle
        class="text-black font-weight-bold"
      >
        {{ props.title }}
      </VCardTitle>
      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onFormSubmit"
        >
          <VRow class="align-center">
            <VCol
              cols="12"
            >
              <VTextField
                v-model="groupData.groupName"
                label="Group Name"
                variant="outlined"
                density="compact"
                focused
                readonly
              />
            </VCol>

            <VCol
              cols="12"
            >
              <v-autocomplete
                v-model="groupData.newPackageGroup"
                :items="props.packageList"
                item-title="package_name"
                item-value="package_id"
                label="Choose Package"
                variant="outlined"
                density="compact"
                chips
                multiple
                clearable
                closable-chips
                return-object
                focused
                :menu-props="{ maxHeight: 300, location: 'bottom' }"
              ></v-autocomplete>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-end"
      >            
        <!-- v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0" -->
        <VBtn
          class="text-none px-4"
          variant="flat"
          @click="onFormSubmit"
        >
          Submit
        </VBtn>
        <VBtn
          class="text-none px-4"
          variant="outlined"
          @click="() => {
            dialogVisibleUpdate(false)
          }"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}
</style>
