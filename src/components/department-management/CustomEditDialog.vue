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
  dataDepartment: {
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

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue','activate', 'deactivated', 'removeDepartment', 'cancel', 'addItem'])

const departmentData = ref(structuredClone(toRaw(props.dataDepartment)))
const refVForm = ref()
const specificIssue = ref('')
const specificTime = ref({
  number: '',
  time: '',
})

const removeDepartment = (index) => {
  emits('removeDepartment', index)
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
  departmentData.value = structuredClone(toRaw(props.dataDepartment))
  specificIssue.value = departmentData.value.specific.issue
  parseData(departmentData.value.specific.time)
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits('update:modelValue', false)
      departmentData.value.specific.time = specificTime.value.number + ' ' + specificTime.value.time
      emits('save', departmentData.value)
    }
  })
}

const dialogVisibleUpdate = val => {
  // emits('update:isDialogVisible', val)
  emits('cancel')
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
        <!-- {{ departmentData }} -->
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
              <VTextField
                v-model="departmentData.unit_name"
                focused
                density="compact"
                readonly
              />
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ma-4 text-black text-no-wrap font-weight-black required"
              >Sub Department:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-model="departmentData.sub_unit_name"
                focused
                density="compact"
                required
                :rules="[(v) => !!v || 'Sub Department is required']"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="3" class="py-0">
              <span
                class="ml-4 text-black font-weight-black required"
              >Max Hanlde Time:</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <VRow>
                <VCol cols="6">
                  <VTextField
                    v-model="specificTime.number"
                    focused
                    density="compact"
                    type="number"
                  />
                </VCol>
                <VCol cols="6">
                  <VSelect
                    v-model="specificTime.time"
                    :items="['Hour', 'Day']"
                    density="compact"
                    :rules="[(v) => !!v || 'Time is required']"
                  />
                </VCol>                
              </VRow>
            </VCol>
          </VRow>
          <VRow class="align-center">
            <VCol cols="12" class="py-0">
              <span
                class="ml-4 text-black font-weight-black required"
              >Categories:</span>
            </VCol>
            <VCol
              cols="12"
            >
              <!-- dataDepartment -->
              <VCard
                v-for="(issue, index) in specificIssue"
                :key="index"
                flat
                border
                class="d-flex flex-sm-row flex-column-reverse ml-4"
              > 
                <div 
                  class="pa-5 flex-grow-1"
                >
                  <VTextField
                    v-model="specificIssue[index]"
                    focused
                    density="compact"
                    :rules="[(v) => !!v || 'Categories is required']"
                  />
                  <!-- <VTextField
                    :model-value="issue"
                    @input="specificIssue[index]"
                    focused
                    density="compact"
                  /> -->
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
                    @click="removeDepartment(index)"
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
                  @click="$emit('addItem')"
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
