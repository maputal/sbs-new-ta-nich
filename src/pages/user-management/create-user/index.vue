<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import axios from '@axios'

const store = useGlobalStore()

const myUser = computed(() => ({
  name: store.user?.name,
  phone_number: store.user?.account_obj.phone_number,
  email: store.user?.account_obj.email,
  company_name: store.user?.company_name,
}))

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
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

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const formKeyNames = ref(['NIP', 'Name', 'Email', 'Phone Number', 'Password', 'Role'])
const formRequired = ref(['Name', 'Email', 'Phone Number', 'Password', 'Role'])
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const isPasswordVisible = ref(false)
const confirmationDialog = ref(false)
const successDialog = ref(false)
const role = ref([])
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const isSuccess = ref({
  success: false,
  id: -1,
})

const getFirstRoleName = () => {
  try {
    return role.value[0].name
  } catch (error) {
    return null
  }
}

const formSubmit = ref({
  nip: '',
  name: '',
  email: '',
  phone_number: '',
  password: '',
  role: null,
  // role: getFirstRoleName(),
})

const getRoleNames = () => {
  let arr = []
  role.value.forEach((items, index) => {
    arr[index] = items.role_name
  })
  
  return arr
}

const resetForm = () => {
  formSubmit.value.nip = ''
  formSubmit.value.name = null
  formSubmit.value.email = null
  formSubmit.value.phone_number = null
  formSubmit.value.password = null
  formSubmit.value.role = getFirstRoleName()
  formSubmit.value.role_id = -1
}

const onDataError = e => {  
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const createUser = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 1,

    
    data: {
      nip: formSubmit.value.nip,
      name: formSubmit.value.name,
      email: formSubmit.value.email,
      phone_number: formSubmit.value.phone_number,
      password: formSubmit.value.password,
      role_id: formSubmit.value.role, 
    }
  }

  axios.post(urlBE.value + 'do_management_user', params)
  .then(function (response) {
    console.log('response updateUser=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    successDialog.value = true

    // showProgressCircular.value = false
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

const getRoles = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    search_filter: '',   
  }

  axios.post(urlBE.value + 'retrieve_management_user_roles', params)
  .then(function (response) {
    console.log('response getRoles=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    role.value = responseData.data

    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const confirmYes = () => { 
  createUser()        
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
  getRoles()
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
        User Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Create User 
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
                md="2"
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
                  v-if="name != 'Role'"
                  v-model="formSubmit[name.toLowerCase().replace(' ', '_')]"
                  focused
                  :type="name == 'Password' ? (isPasswordVisible ? 'text' : 'password'): null"
                  :rules="formRequired.includes(name) ? (name == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                  :append-inner-icon="name == 'Password' ? (isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'): null"
                  @click:append-inner="name == 'Password' ? (isPasswordVisible = !isPasswordVisible): null"
                />
                <VSelect
                  v-else-if="name == 'Role'"
                  v-model="formSubmit['role']"
                  :items="role"
                  item-value="id"
                  item-title="role_name"
                  :rules="formRequired.includes(name) ? ([requiredValidator]) : []"
                  focused
                  style="max-width: 40%;"
                />
              </VCol>
            </VRow>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                v-if="priv.hasOwnProperty('create_user') || Object.keys(priv).length === 0"
                class="text-none"
                type="submit"
                rounded="xl"
                variant="flat"
                width="125px"
              >
                Submit
              </VBtn>
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
            </VSheet>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}
</style>
