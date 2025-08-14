<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import { watch } from 'vue'

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
  userData: {
    type: Object,
    required: true,
  },
  listOfRole: {
    type: Array,
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

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue', 'delete', 'deactivate', 'activate'])

const userData = ref(structuredClone(toRaw(props.userData)))
const refVForm = ref()
const isPasswordVisible = ref(false)

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits('update:modelValue', false)
      emits('save', userData.value)
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
            class="d-flex align-center"
          >
            <VCol
              cols="12"
              md="3"
            >
            <!-- v-if="userData[obj.dataName] !== 'Admin'" -->
              <span
                class="mx-4 text-black font-weight-black text-no-wrap"
                :class="{required: props.formRequired.includes(obj.headerName)}"
              >{{ obj.headerName }}</span>
            </VCol>
            <VCol
              cols="12"
              md="9"
            >
              <VTextField
                v-if="obj.inputType == 'text-field'"
                v-model="userData[obj.dataName]"
                class="mx-12"
                :type="obj.headerName == 'Password' ? (isPasswordVisible ? 'text' : 'password'): null"
                :rules="formRequired.includes(obj.headerName) ? (obj.headerName == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                :append-inner-icon="obj.headerName == 'Password' ? (isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'): null"
                focused
                @click:append-inner="obj.headerName == 'Password' ? (isPasswordVisible = !isPasswordVisible): null"
                readonly
              />
              <!-- <VSelect
                v-else-if="obj.inputType == 'select' & userData[obj.dataName] !== 'Admin'"
                v-model="userData.role_id"
                :items="listOfRole"
                item-value="id"
                item-title="role_name"  
                :disabled="userData[obj.dataName] === 'Admin'"
                class="mx-12"
                focused
                readonly
              /> -->
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      >
      <!-- v-if="userData.role_name !== 'Admin' && priv.hasOwnProperty('update_user') && priv.hasOwnProperty('manage_user') || Object.keys(priv).length === 0" -->
        <!-- <VBtn
          class="text-none text-black px-4"
          rounded="lg"
          prepend-icon="mdi-delete-outline"
          style="background-color: #d9d9d9;"
          @click="emits('delete')"
        >
          Delete
        </VBtn> -->
        
        <div 
          v-if="
            userData.role_name !== 'Supervisor' ||
            userData.role_id !== 20 
          "
        >
          <VBtn
            v-if="props.row['status'] == true"
            class="text-none text-white px-4"
            variant="flat"
            prepend-icon="mdi-close-circle"
            color="error"
            @click="emits('deactivate')"
            :disabled="Object.keys(priv).length !== 0"
          >
            Deactived
          </VBtn>
          <VBtn
            v-if="props.row['status'] == false"
            class="text-none text-white px-4"
            variant="flat"
            prepend-icon="mdi-check-circle"
            color="#21BA45"
            @click="emits('activate')"
            :disabled="Object.keys(priv).length !== 0"
          >
            Activate
          </VBtn>
        </div>
        <VSpacer />
        <VBtn
          class="text-none"
          @click="dialogVisibleUpdate(false)"
        >
          Cancel
        </VBtn>
        <!-- v-if="priv.hasOwnProperty('update_user') || Object.keys(priv).length === 0" -->
        <!-- <VBtn
          class="text-none"
          variant="flat"
          @click="onFormSubmit"
        >
          Submit
        </VBtn> -->
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
