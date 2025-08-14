<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators';

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
  priv: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue', 'delete'])

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
    <VCard :rounded="props.rounded">
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
              sm="8"
            >
            <!-- <span
                class="ma-4 text-black font-weight-black text-no-wrap"
                :class="{required: props.formRequired.includes(obj.headerName)}"
              >{{ obj.headerName }}</span> -->
              <VTextField
                class="ml-5"
                v-if="obj.inputType == 'text-field'"
                v-model="groupData[obj.dataName]"
                :type="obj.headerName == 'Password' ? (isPasswordVisible ? 'text' : 'password'): null"
                :rules="formRequired.includes(obj.headerName) ? (obj.headerName == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                :append-inner-icon="obj.headerName == 'Password' ? (isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'): null"
                focused
                @click:append-inner="obj.headerName == 'Password' ? (isPasswordVisible = !isPasswordVisible): null"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      >
        <VBtn
          v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') && priv.hasOwnProperty('manage_group') || Object.keys(priv).length === 0"
          class="text-none text-black px-4"
          rounded="lg"
          prepend-icon="mdi-delete-outline"
          style="background-color: #d9d9d9;"
          @click="emits('delete')"
        >
          Delete
        </VBtn>
        <VSpacer />
        <VBtn
          class="text-none"
          @click="dialogVisibleUpdate(false)"
        >
          Cancel
        </VBtn>
        <VBtn
          v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
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
