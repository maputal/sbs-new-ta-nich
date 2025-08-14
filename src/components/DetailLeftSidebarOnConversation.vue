<script setup>
import { emailValidator } from '@/@core/utils/validators'


const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
  },
  contactDetail: {
    type: Object,
    required: true,
  },
  priv: {
    type: Object,
    required: true,
  },
  isCreateCustomer: {
    type: Boolean,
  },
  projectTitle: {
    type: String,
  },
  allContactDetail: {
    type: Array,
  },
  contactDetailStore: {
    type: Array,
  },
})

const emits = defineEmits([
  'close',
  'update:isDrawerOpen', 
  'save', 
  'update:modelValue', 
])

const contactDetail = ref(props.contactDetail)
const priv = ref(props.priv)
const refVForm = ref()

const projectTitleLocal = ref()
const labelContactID = ref()

const formatHeader = (key) => {
  // Convert snake_case or camelCase to readable format
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

const onSubmit = type => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      emits('update:modelValue', false)
      emits('save', contactDetail.value)

      console.log('contactDetail.value di onSubmit save=', contactDetail.value)
    }
  })
}

watch(
  () => props.projectTitle,
  (newVal) => {
    projectTitleLocal.value = newVal
    if(newVal == 'danareksa') {
      labelContactID.value = 'Client Code'
    } else {
      labelContactID.value = 'Contact ID'
    }
    console.log("Updated labelContactID:", labelContactID.value)
  }
)

</script>

<template>
  <VCardText>
    <VForm
      ref="refVForm"
      @submit.prevent="onSubmit"
    >
      <div
        class="d-flex justify-end align-center pb-2"
      >
        <span class="chat-contact-header d-block text-primary text-xl font-weight-medium">Customer Information</span>
        <VSpacer />
        <VBtn      
          v-if="priv.hasOwnProperty('create_customer') && priv.hasOwnProperty('update_customer') || Object.keys(priv).length === 0" 
          class="text-none px-9"
          rounded="lg"
          variant="flat"
          @click="onSubmit('save')"
        >
          <div>
            Update
          </div>

          <!-- <div v-if="!isCreateCustomer">
            Update
          </div>
          <div v-else>
            Create
          </div> -->
        </VBtn>

        <!-- {{ allContactDetail }}
        <br>
        <br>
        {{ contactDetailStore }} -->
      </div>
      <VRow>
        <VCol cols="12" md="6">
          <VSheet v-if="!isCreateCustomer && projectTitleLocal !== 'danareksa'" class="align-center pt-2">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-card-account-details"
                />
                <span
                  class="text-black font-weight-black pl-2"
                > 
                  Customer ID 
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="contactDetail['customer_id']"
                  focused
                  placeholder="Nomor Identitas"
                  readonly
                />
              </VCol>
            </VRow>
          </VSheet>
          <VSheet class="align-center">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-account-box"
                />
                <span
                  class="required text-black font-weight-black pl-2"
                > 
                  {{ labelContactID }}
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="contactDetail['contact_id']"
                  placeholder="Nomor Identitas"
                  focused
                  readonly
                  :rules="[(v) => !!v || 'Name is required']"
                />
              </VCol>
            </VRow>
          </VSheet>
          <VSheet class="align-center">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-account"
                />
                <span
                  class="required text-black font-weight-black pl-2"
                > 
                  Full Name 
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="contactDetail['name']"
                  placeholder="Full Name"
                  focused
                  :readonly="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                  :rules="[(v) => !!v || 'Name is required']"
                />
              </VCol>
            </VRow>
          </VSheet>
          <VSheet class="align-center">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-map-marker"
                />
                <span
                  class="text-black font-weight-black pl-2"
                > 
                  Address 
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextarea
                  v-model="contactDetail['address']"
                  placeholder="Address"
                  no-resize
                  rows="2"
                  focused
                  :readonly="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                />
              </VCol>
            </VRow>
          </VSheet>
          <VSheet class="align-center">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-phone"
                />
                <span
                  class="required text-black font-weight-black pl-2"
                > 
                  Phone Number
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="contactDetail['phone_number']"
                  required
                  :rules="[(v) => !!v || 'Phone Number is required']"
                  focused
                />
              </VCol>
            </VRow>
          </VSheet>
          <VSheet class="align-center">
            <VRow class="pa-2">
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-email"
                />
                <span
                  class="text-black font-weight-black pl-2"
                > 
                  Email 
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="contactDetail['email']"
                  focused
                  placeholder="Email"
                  :readonly="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                  :rules="[emailValidator]"
                />
              </VCol>
            </VRow>
          </VSheet>
  
        </VCol>
        <VCol cols="12" md="6">
          <VSheet v-for="(detail, index) in allContactDetail" :key="index" class="align-center">
            <VRow  
              v-if="detail.contact_type !== 'address' && detail.contact_type !== 'email' && detail.contact_type !== 'phone_number'" 
              class="pa-2"
            >
              <VCol cols="12" md="4" class="pl-0">
                <VIcon
                  icon="mdi-account-details"
                />
                <span
                  class="text-black font-weight-black pl-2"
                > 
                  {{ formatHeader(detail.contact_type) }}
                </span>
              </VCol>
              <VCol cols="12" md="8" class="pa-0">
                <VTextField
                  v-model="detail.contact_value"
                  focused
                  :rules="[(v) => !!v || `${formatHeader(detail.contact_type)} is required`]"
                />
              </VCol>
            </VRow>
          </VSheet>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>

<style lang="scss" scoped>
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/mixins";
@use "vuetify/lib/styles/tools/states" as vuetifyStates;

.chat-contacts-list {
  --chat-content-spacing-x: 12px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block-end: 1rem;
    margin-block-start: 1.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}

.required::after {
  color: red;
  content: "*";
}
</style>
