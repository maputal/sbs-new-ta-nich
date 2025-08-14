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
  departments: {
    type: Object,
    required: true,
  },
  subDepartments: {
    type: Object,
    required: true,
  },  
  listOfStaff: {
    type: Object,
    required: false,
  },    
  formSubmit: {
    type: Object,
    default: true,
  },
  priv: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue','getsubdepartment', 'getStaff', 'cancel'])

const refVForm = ref()

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emit('save', props.formSubmit)      
      emit('update:modelValue', false)
    }
  })
}

const dialogVisibleUpdate = val => {
  // emit('update:isDialogVisible', val)
  emit('cancel')
}

// onMounted(() => {

// })
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
    persistent
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
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black required"
              >Department:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="props.formSubmit.department"
                :items="props.departments"
                focused
                :rules="[(v) => !!v || 'Department is required']"
                @update:modelValue="$emit('getsubdepartment', formSubmit.department)"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black text-no-wrap required"
              >Sub Department:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="props.formSubmit.subDepartment"
                :items="props.subDepartments"
                focused
                :rules="[(v) => !!v || 'Sub Department is required']"
                @update:modelValue="$emit('getStaff', formSubmit.subDepartment)"
                :disabled="!formSubmit.department"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black required"
              >Staff:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="props.formSubmit.staffID"
                :items="props.listOfStaff"
                item-value="staff_id"
                item-title="name"
                focused
                :rules="[(v) => !!v || 'Staff is required']"
                :disabled="!formSubmit.subDepartment"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black required"
              >Reasons:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-model="props.formSubmit.reason"
                focused
                :rules="[(v) => !!v || 'Notes is required']"
                :disabled="!formSubmit.staffID"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black"
              >Notes:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-model="props.formSubmit.notes"
                focused
                :disabled="!formSubmit.staffID"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      >        
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
          rounded="m"
          variant="flat"
          @click="onFormSubmit"
        >
          Submit
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
