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
  contactData: {
    type: Object,
    required: true,
  },
  priv: {
    type: Object,
    required: true,
  },
  contactDetails: {
    type: Array,
    default: () => [],
  },
  projectTitle: {
    type: String,
    default: null,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'save', 'update:modelValue', 'delete-contact-detail', 'add-new-contact-detail'])

const contactDataLocal = ref()
const refVForm = ref()
const isPasswordVisible = ref(false)

const refVFormContactDetail = ref()
const contactDetailsLocal = ref([]);
const isAddNewContactDetail = ref(false)

const buttonVariant= ref("tonal")
const buttonColor= ref("primary")

const labelContactID= ref("")

const newContactDetail = ref ({
  channelType: null,
  contactValue: '',
})

const optionsContactType = ref ()

const addContactDetail = () => {
  isAddNewContactDetail.value = true
}

const resetNewContactDetail = () => {
  isAddNewContactDetail.value = false
  newContactDetail.value.channelType = null
  newContactDetail.value.contactValue = ''
}

const onAddContactDetail = () => {
  refVFormContactDetail.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits("add-new-contact-detail", newContactDetail.value, contactDataLocal.value.contact_id)
      resetNewContactDetail()
    }
  })
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emits('update:modelValue', false)
      emits('save', contactDataLocal.value, contactDetailsLocal.value)
    }
  })
}

const dialogVisibleUpdate = val => {
  emits('update:isDialogVisible', val)
}

watch(() => props.contactData, (newVal) => {
  console('newVal di watch props.contactData', newVal)
  contactDataLocal.value = newVal
  // contactDataLocal.value = structuredClone(toRaw(newVal))
})

watch(
  () => props.contactDetails,
  (newVal) => {
    console.log("newVal:", newVal)
    contactDetailsLocal.value = newVal
    // contactDetailsLocal.value = [...newVal]
    console.log("Updated contactDetailsLocal:", contactDetailsLocal.value)
  }
)

watch(
  () => props.projectTitle,
  (newVal) => {
    if(newVal == 'danareksa') {
      labelContactID.value = 'Client Code'
    } else {
      labelContactID.value = 'Contact ID'
    }
    console.log("Updated labelContactID:", labelContactID.value)
  }
)

onMounted(() => {
  contactDetailsLocal.value = props.contactDetails
  contactDataLocal.value = props.contactData
  optionsContactType.value = moffas.config.options_contact_type || []
})
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
        <VCardTitle class="d-flex align-center px-0">
          <VIcon size="32">mdi-information-variant-circle</VIcon>
          <div class="px-2">Contact Info</div>            
        </VCardTitle>
        <VForm
          ref="refVForm"
          @submit.prevent="onFormSubmit"
        >
          <!-- Contact Info -->
           <VTextField 
            v-model="contactDataLocal.contact_id" 
            :label="labelContactID" 
            class="mt-3"
            focused
            :rules="[(v) => !!v || 'Name is required']"
            readonly
          />
          <VTextField 
            v-model="contactDataLocal.contact_name" 
            label="Name" 
            class="mt-3"
            focused
            :rules="[(v) => !!v || 'Name is required']"
          />

          <!-- Dynamic Contact Details -->
          <div v-for="(detail, index) in contactDetailsLocal" :key="index" class="mt-2">
            <VCard class="pt-2">
              <VCardSubtitle class="text-black font-weight-bold d-flex justify-space-between align-center">
                <div>
                  Details {{ index + 1 }}
                </div>
                <VBtn
                  class="text-none"
                  density="compact"
                  size="small"
                  color="error"
                  icon="mdi-delete-outline"
                  @click="emits('delete-contact-detail', detail)"
                />
              </VCardSubtitle>
              <VCardText>
                <!-- <VTextField 
                  v-model="detail.contact_type" 
                  label="Contact Type" 
                  class="mt-3"
                  focused
                  :rules="[(v) => !!v || 'Contact detail type is required']"
                /> -->
                <VSelect
                  v-model="detail.contact_type" 
                  label="Contact Type"
                  :items="optionsContactType"
                  item-value="value"
                  item-title="title"
                  class="mt-3"
                  focused
                  :rules="[(v) => !!v || 'Contact detail type is required']"
                  readonly
                />
                <VTextField 
                  v-model="detail.contact_value" 
                  label="Contact Value" 
                  class="mt-3"
                  focused
                  :rules="[(v) => !!v || 'Contact detail value is required']"
                />
              </VCardText>
            </VCard>
          </div>
        
          <!-- Add Details -->
          <VBtn
            :color="isAddNewContactDetail ? 'secondary' : 'primary'"
            @click="addContactDetail" 
            class="mt-2"
            size="small"
            width="100%"
            prepend-icon="mdi-plus"
            :disabled="isAddNewContactDetail"
          >Add New Contact Details</VBtn>

          <VCard v-if="isAddNewContactDetail" class="mt-3">
            <VCardSubtitle class="text-black font-weight-bold mt-3">
              <VIcon size="20">mdi-pencil-plus</VIcon>
              Add Contact Details
            </VCardSubtitle>
            <VForm ref="refVFormContactDetail" @submit.prevent="onAddContactDetail">
              <VCardText>
                <VSelect
                  v-model="newContactDetail.channelType" 
                  label="Contact Type"
                  :items="optionsContactType"
                  item-value="value"
                  item-title="title"
                  class="mt-3"
                  density="compact"
                  variant="outlined"
                  focused
                  :rules="[(v) => !!v || 'Contact detail type is required']"
                />
                <VTextField
                  v-model="newContactDetail.contactValue"
                  class="mt-3" 
                  label="Contact Value" 
                  density="compact"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Contact detail value is required']"
                />
              </VCardText>
              <VCardActions>
                <VBtn color="error" variant="outlined" class="text-none" size="small" @click="resetNewContactDetail()">
                  Cancel
                </VBtn>
                <VBtn 
                  :color="buttonColor" 
                  variant="flat" 
                  type="submit" 
                  class="text-none" 
                  size="small"
                  @mouseenter="buttonColor = 'secondary'"
                  @mouseleave="buttonColor = 'primary'"
                >
                  Submit
                </VBtn>
              </VCardActions>
            </VForm>
          </VCard>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-center"
        style="background-color: #f8f8f8;"
      >
        <!-- <VBtn
          v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') && priv.hasOwnProperty('manage_group') || Object.keys(priv).length === 0"
          class="text-none text-black px-4"
          rounded="lg"
          prepend-icon="mdi-delete-outline"
          style="background-color: #d9d9d9;"
          @click="emits('delete')"
        >
          Delete
        </VBtn> -->
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
          :variant="buttonVariant"
          @mouseenter="buttonVariant = 'flat'"
          @mouseleave="buttonVariant = 'tonal'"
          :disabled="isAddNewContactDetail"
          @click="onFormSubmit"
        >
          Update Contact
        </VBtn>

        <!-- <VBtn
          v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
          class="text-none"
          rounded="xl"
          variant="flat"
          @click="onFormSubmit"
        >
          Save Changes
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
