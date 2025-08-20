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
  editProps: {
    type: Array,
    required: true,
  },
  formRequired: {
    type: Array,
    default: () => [],
  },
  groupData: {
    type: Object,
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
  priv: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue','activate', 'deactivated'])

const groupData = ref(structuredClone(toRaw(props.groupData)))
const refVForm = ref()
const isPasswordVisible = ref(false)

watch(props, () => {
  groupData.value = structuredClone(toRaw(props.groupData))
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits('update:modelValue', false)
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
          <VRow
            v-for="(obj, index) in props.editProps"
            :key="index"
            class="align-center"
          >
            <VCol
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
                :class="{required: props.formRequired.includes(obj.headerName)}"
              >{{ obj.headerName }}</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-if="obj.inputType == 'text-field'"
                v-model="groupData[obj.dataName]"
                focused
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      >
        <VCardActions
          v-if="props.hasActionButton"
        >
          <VSheet
            v-if="props.row['st'] == true"
            width="100%"
            style="background-color: #f8f8f8;"
          >
            <VBtn
              class="text-none px-4"
              rounded="lg"
              prepend-icon="mdi-cancel"
              variant="flat"
              @click="
                emits('deactivated'),
                dialogVisibleUpdate(false)"
            >
              Deactivated Group
            </VBtn>
          </VSheet>
          <VSheet
            v-else-if="props.row['st'] == false"
            width="100%"
            style="background-color: #f8f8f8;"
          >
            <VBtn
              class="text-none px-4"
              rounded="lg"
              prepend-icon=""
              variant="flat"
              @click="
                emits('activate'),
                dialogVisibleUpdate(false)"
            >
              Activated Group
            </VBtn>
          </VSheet>
        </VCardActions>        
        
        <VSpacer />
        <VBtn
          class="text-none"
          @click="dialogVisibleUpdate(false)"
        >
          Cancel
        </VBtn>
        <!-- v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0" -->
        <VBtn
          class="text-none"
          rounded="xl"
          variant="flat"
          @click="onFormSubmit"
        >
          Save Changes
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
