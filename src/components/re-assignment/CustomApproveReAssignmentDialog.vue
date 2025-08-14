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
  approvalData: {
    type: Object,
    required: true,
  },
  priv: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'save', 'reject', 'accept', 'update:modelValue','getsubdepartment', 'getStaff', 'cancel'])

const refVForm = ref()
const note = ref('')
const reason = ref('')

const isReassign = ref(false)

const onFormSubmitReassign = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emit('save', props.approvalData, note, reason)      
      emit('update:modelValue', false)
    }
  })
}

const onFormSubmitReject = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emit('reject', props.approvalData, note, reason)      
      emit('update:modelValue', false)
    }
  })
}

const onFormSubmitAccept = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emit('accept', props.approvalData, note, reason)      
      emit('update:modelValue', false)
    }
  })
}

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
  isReassign.value = false
  emit('cancel')
}

// Watch for changes in approvalData.unit_name and emit if it's not empty
watch(() => props.approvalData.unit_name, (newVal) => {
  if (newVal && newVal !== '') {
    emit('getsubdepartment', newVal)
  }
})

// Watch for changes in approvalData.sub_unit_name and emit if it's not empty
watch(() => props.approvalData.sub_unit_name, (newVal) => {
  if (newVal && newVal !== '') {
    emit('getStaff', newVal)
  }
})

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
        class="text-black font-weight-bold d-flex justify-space-between align-center"
      >
        {{ props.title }}

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialogVisibleUpdate(false)"
        ></v-btn>
      </VCardTitle>
      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onFormSubmitReassign"
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
                v-model="props.approvalData.unit_name"
                :items="props.departments"
                focused
                :rules="[(v) => !!v || 'Department is required']"
                @update:modelValue="$emit('getsubdepartment', props.approvalData.unit_name)"
                :readonly="!isReassign"
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
                v-model="props.approvalData.sub_unit_name"
                :items="props.subDepartments"
                focused
                :rules="[(v) => !!v || 'Sub Department is required']"
                @update:modelValue="$emit('getStaff', props.approvalData.sub_unit_name)"
                :disabled="!props.approvalData.sub_unit_name"
                :readonly="!isReassign"
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
                v-model="props.approvalData.staff_id"
                :items="props.listOfStaff"
                item-value="staff_id"
                item-title="name"
                focused
                :rules="[(v) => !!v || 'Staff is required']"
                :disabled="!props.approvalData.sub_unit_name"
                :readonly="!isReassign"
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
                v-model="reason"
                focused
                :rules="[(v) => !!v || 'Reasons is required']"
                :disabled="!props.approvalData.staff_id"
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
                v-model="note"
                focused
                :disabled="!props.approvalData.staff_id"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      > 
        <div v-if="!isReassign">
          <VBtn
            v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
            class="text-none px-5"
            rounded="xl"
            variant="flat"
            color="error"
            @click="onFormSubmitReject"
            disabled
          >
            Reject
          </VBtn>      
          <VBtn
            class="text-none px-5"
            rounded="xl"
            variant="flat"
            color="success"
            @click="onFormSubmitAccept"
            disabled
          >
            Accept
          </VBtn>
        </div>
        <VSpacer />
        <div v-if="isReassign">
          <VBtn
            class="text-none"
            @click="isReassign = !isReassign"
          >
            Cancel
          </VBtn>
          <VBtn
            v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
            class="text-none"
            rounded="m"
            variant="flat"
            @click="onFormSubmitReassign"
          >
            Submit
          </VBtn>
        </div>
        <div v-else>
          <VBtn
            v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
            class="text-none"
            rounded="m"
            variant="flat"
            prepend-icon="mdi-clipboard-account-outline"
            @click="isReassign = !isReassign"
          >
            Reassign
          </VBtn>
        </div>         
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
