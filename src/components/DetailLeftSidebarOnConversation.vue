<script setup>
import { emailValidator } from '@/@core/utils/validators'


const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
  },
  customerDetail: {
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
})

const emits = defineEmits([
  'close',
  'update:isDrawerOpen', 
  'save', 
  'update:modelValue', 
])

const customerDetail = ref(props.customerDetail)
const priv = ref(props.priv)
const refVForm = ref()

const onSubmit = type => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      emits('update:modelValue', false)
      emits('save', customerDetail.value)

      console.log('customerDetail.value di onSubmit save=', customerDetail.value)
    }
  })
}
</script>

<template>
  <VCardText>
    <VForm
      ref="refVForm"
      @submit.prevent="onSubmit"
    >
      <div
        class="d-flex justify-end align-center"
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
          <div v-if="!isCreateCustomer">
            Update
          </div>
          <div v-else>
            Create
          </div>
        </VBtn>
      </div>
      <div class="">
        <VSheet v-if="!isCreateCustomer" class="align-center pt-2">
          <VRow class="pa-2">
            <VCol cols="12" md="2" class="pl-0">
              <VIcon
                icon="mdi-card-account-details-outline"
              />
              <span
                class="text-black font-weight-black pl-2"
              > 
                Customer ID 
              </span>
            </VCol>
            <VCol cols="12" md="4" class="pa-0">
              <VTextField
                v-model="customerDetail['customer_id']"
                focused
                placeholder="Nomor Identitas"
                readonly
              />
            </VCol>
          </VRow>
        </VSheet>
        <VSheet class="align-center">
          <VRow class="pa-2">
            <VCol cols="12" md="2" class="pl-0">
              <VIcon
                icon="mdi-account"
              />
              <span
                class="required text-black font-weight-black pl-2"
              > 
                Full Name 
              </span>
            </VCol>
            <VCol cols="12" md="4" class="pa-0">
              <VTextField
                v-model="customerDetail['name']"
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
            <VCol cols="12" md="2" class="pl-0">
              <VIcon
                icon="mdi-map-marker"
              />
              <span
                class="text-black font-weight-black pl-2"
              > 
                Address 
              </span>
            </VCol>
            <VCol cols="12" md="4" class="pa-0">
              <VTextarea
                v-model="customerDetail['address']"
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
            <VCol cols="12" md="2" class="pl-0">
              <VIcon
                icon="mdi-phone"
              />
              <span
                class="required text-black font-weight-black pl-2"
              > 
                Phone Number
              </span>
            </VCol>
            <VCol cols="12" md="4" class="pa-0">
              <VTextField
                v-model="customerDetail['phone_number']"
                required
                :rules="[(v) => !!v || 'Phone Number is required']"
                focused
                :readonly="!isCreateCustomer"
              />
            </VCol>
          </VRow>
        </VSheet>
        <VSheet class="align-center">
          <VRow class="pa-2">
            <VCol cols="12" md="2" class="pl-0">
              <VIcon
                icon="mdi-email"
              />
              <span
                class="text-black font-weight-black pl-2"
              > 
                Email 
              </span>
            </VCol>
            <VCol cols="12" md="4" class="pa-0">
              <VTextField
                v-model="customerDetail['email']"
                focused
                placeholder="Email"
                :readonly="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                :rules="[emailValidator]"
              />
            </VCol>
          </VRow>
        </VSheet>
      </div>
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
