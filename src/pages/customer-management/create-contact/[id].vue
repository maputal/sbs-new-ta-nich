<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import axios from '@axios'

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
}

const goBackPrevious = () => {
  router.go(-1)
}

const todayDate = ref('')

const months = {
  1:'January',
  2:'February',
  3:'March',
  4:'April',
  5:'May',
  6:'June',
  7:'July',
  8:'August',
  9:'September',
  10:'October',
  11:'November',
  12:'Desember', 
}

const days = {
  0:'Sunday',
  1:'Monday',
  2:'Tuesday',
  3:'Wednesday',
  4:'Thursday',
  5:'Friday',
  6:'Saturday',
}

const todayDateF = () => {
  let today = new Date()
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date =
      dd < 10 ? '0' + dd : dd
  
  return (
    days[day] +
      ', ' +
      date +
      ' ' +
      months[month] +
      ' ' +
      year
  )
}

const projectTitle = ref('')
const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const formKeyNames = ref(['Customer', 'Contact ID', 'Contact Name'])
const formRequired = ref(['Customer', 'Contact ID', 'Contact Name'])
const refVForm = ref()
const confirmationDialog = ref(false)
const successDialog = ref(false)
const customer = ref([])
const isErrorVisible = ref(false)
const disabledGroup = ref(false)
const customErrorMessages = ref('')
const showProgressCircular = ref(false)

const formSubmit = ref({
  customer_id: route.params.id,
  customer_name: '',
  contact_id: '',
  contact_name: '',
})

const resetForm = () => {
  formSubmit.value.customer_name = ''
  formSubmit.value.contact_id = null
  formSubmit.value.contact_name = null
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const createContact = () => {
  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 1,
    data: {
      customer_id: route.params.id,
      contact_id: formSubmit.value.contact_id,
      contact_name: formSubmit.value.contact_name,
      data: {}
    }
  }

  console.log('params di createContact', params)

  axios.post(urlBE.value + 'do_contact', params)
  .then(function (response) {
    console.log('response createContact=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    successDialog.value = true
    confirmationDialog.value = false
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      confirmationDialog.value = true
  })
}

const fetchCustomers = () => {
  showProgressCircular.value = true
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 2,
    data: {
      customer_id: route.params.id,
      customer_name: '',
      description: '',
    }
  }

  console.log('params di fetchCustomers', params)

  axios.post(urlBE.value + 'do_customer', params)
  .then(function (response) {
    console.log('response fetchCustomers=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    customer.value = responseData.data
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const confirmYes = () => { 
  createContact()        
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
  fetchCustomers()

  projectTitle.value = moffas.config.project_title || ''

  if(projectTitle.value == 'danareksa'){
    formKeyNames.value = ['Customer', 'Client Code', 'Contact Name']
    formRequired.value = ['Customer', 'Client Code', 'Contact Name']
  }
})
</script>

<template>
  <section>
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    />
    <div>
      <h6 class="text-2xl font-weight-bold mb-2">
        Contact Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Create Contact 
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-4">
          <!-- 👉 Issue Date -->
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
          <!-- <span>{{ invoiceData.issuedDate }}</span> -->
          </p>
        </div>
      </div>
    </div>
    <div>
      <VCard>
        <VCardText class="pt-10">
          <v-btn 
            class="mb-5"
            icon="mdi-arrow-left"
            @click="goBackPrevious()"
          ></v-btn>              
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow
              v-for="(name, index) in formKeyNames"
              :key="index"
              class="align-center"
            >
              <VCol
                cols="12"
                md="3"
              >
                <span
                  class="ma-4 text-black font-weight-black"
                  :class="{required: formRequired.includes(name)}"
                >{{ name }}</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-if="name == 'Name'"
                  v-model="formSubmit['contact_name']"
                  focused
                  :rules="[(v) => !!v || 'Name is required']"
                />
                <VTextField
                  v-if="name == 'Contact ID' || name == 'Client Code'"
                  v-model="formSubmit['contact_id']"
                  focused
                  :rules="[(v) => !!v || 'Field is required']"
                />
                <VTextField
                  v-else-if="name != 'Customer'"
                  v-model="formSubmit[name.toLowerCase().replace(' ', '_')]"
                  focused
                  :rules="formRequired.includes(name) ? (name == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                />
                <VSelect
                  v-else-if="name == 'Customer'"
                  v-model="formSubmit['customer_id']"
                  :items="customer"
                  item-value="id"
                  item-title="name"
                  focused
                  class="text-black"
                  :disabled="!disabledGroup"
                />
              </VCol>
            </VRow>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                class="text-none"
                type="submit"
                rounded="xl"
                variant="flat"
                width="125px"
              >
                Submit
              </VBtn>
            </VSheet>
          </VForm>
        </VCardText>
      </VCard>

      <VDialog
        v-model="showProgressCircular"
        class="error-overlay-bg"
        persistent
      >
        <div class="text-center">
          <VProgressCircular
            color="primary"
            indeterminate
            :size="50" 
            :width="10"          
          ></VProgressCircular>
        </div>
      </VDialog>

      <CustomConfirmDialog
        v-model:is-dialog-visible="confirmationDialog"
        rounded="lg"
        confirmation-styling="2"
        message-title="Are you sure you want to submit this?"
        @yes="confirmYes"
      />
      <CustomNotifDialog
        v-model:is-dialog-visible="successDialog"
        rounded="lg"
        subject="submit"
        @ok="() => {
          resetForm()
        }"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}
</style>
