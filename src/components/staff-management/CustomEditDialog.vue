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
  dataStaff: {
    type: Object,
    required: true,
  },  
  hasActionButton: {
    type: Boolean,
    default: true,
  },
  departments: {
    type: Object,
    required: true,
  },
  subDepartments: {
    type: Object,
    required: true,
  }, 
  priv: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue','activate', 'deactivated', 'remove', 'cancel', 'add', 'getsubdepartment', 'getStaff',])

const staffData = ref(structuredClone(toRaw(props.dataStaff)))
const refVForm = ref()
const skillsOfStaff = ref([])
const statusStaff = ref([
  {
    title: 'Active',
    value: '1'
  },
  {
    title: 'Not Active',
    value: '0'
  }
])

const levels = ref([
  {
    title: 'Admin',
    value: '1'
  },
  {
    title: 'Agent',
    value: '2'
  },
  {
    title: 'Supervisor',
    value: '3'
  }
])

const removeItem = (index) => {
  emits('remove', index)
}

const parseData = (input) => {
  const regex = /(\d+)\s*(\w+)/;
  const match = input.match(regex);
  
  if (match) {
    const number = parseInt(match[1], 10);
    const time = match[2];

    specificTime.value.number = number
    specificTime.value.time = time
    // return { number, time };
  }
}

watch(props, () => {
  staffData.value = structuredClone(toRaw(props.dataStaff))
  staffData.value.status = (staffData.value.status)?.toString()
  skillsOfStaff.value = staffData.value.job_desc?.skill
  // parseData(staffData.value.specific.time)
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits('update:modelValue', false)
      emits('save', staffData.value)
    }
  })
}

const dialogVisibleUpdate = val => {
  // emits('update:isDialogVisible', val)
  emits('cancel')
}

// Watch for changes in approvalData.unit_name and emit if it's not empty
watch(() => props.dataStaff.unit_name, (newVal) => {
  if (newVal && newVal !== '') {
    emits('getsubdepartment', newVal)
  }
})

// Watch for changes in approvalData.sub_unit_name and emit if it's not empty
watch(() => props.dataStaff.sub_unit_name, (newVal) => {
  if (newVal && newVal !== '') {
    emits('getStaff', newVal)
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
    scrollable
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
              >Name:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-model="staffData.name"
                focused
                density="compact"
                :rules="[(v) => !!v || 'Name is required']"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black required"
              >Level:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="staffData.level_id"
                :items="levels"
                item-value="value"
                item-title="title"
                density="compact"
                :rules="[(v) => !!v || 'Level is required']"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black"
              >Department:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="staffData.unit_name"
                :items="props.departments"
                focused
                :rules="[(v) => !!v || 'Department is required']"
                @update:modelValue="$emit('getsubdepartment', staffData.unit_name)"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black font-weight-black"
              >Sub Department:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="staffData.sub_unit_name"
                :items="props.subDepartments"
                focused
                :rules="[(v) => !!v || 'Sub Department is required']"
                @update:modelValue="$emit('getStaff', staffData.sub_unit_name)"
                :disabled="!staffData.unit_name"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ml-4 text-black font-weight-black required"
              >Status:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VSelect
                v-model="staffData.status"
                :items="statusStaff"
                item-value="value"
                item-title="title"
                density="compact"
                :rules="[(v) => !!v || 'Status is required']"
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" class="py-0">
              <span
                class="ml-4 text-black font-weight-black required"
              >Skills:</span>
            </VCol>
            <VCol
              cols="12"
            >
              <VCard
                v-for="(issue, index) in skillsOfStaff"
                :key="index"
                flat
                border
                class="d-flex flex-sm-row flex-column-reverse ml-4"
              > 
                <div 
                  class="pa-5 flex-grow-1"
                >
                  <VTextField
                    v-model="skillsOfStaff[index]"
                    focused
                    density="compact"
                    :rules="[(v) => !!v || 'Skills is required']"
                  />
                </div>
                <div
                  v-if="!index == 0"
                  class="d-flex flex-column item-actions pa-1"
                  :class="$vuetify.display.smAndUp ? 'border-s' : 'border-b' "
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="removeItem(index)"
                    >
                    <VIcon
                      :size="20"
                      icon="mdi-close"
                    />
                  </VBtn>
                </div>              
              </VCard>
              <div class="pl-4 pt-2">
                <VBtn
                  size="small"
                  prepend-icon="mdi-plus"
                  @click="$emit('add')"
                >
                    Add Categories
                </VBtn>
              </div>
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
