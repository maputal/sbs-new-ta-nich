<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'

const store = useGlobalStore()

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

const formKeyNames = ref(['Name', 'NIP', 'Email', 'Phone Number', 'Group'])
const formRequired = ref(['Name', 'Email', 'Phone Number', 'Group'])
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const confirmationDialog = ref(false)
const successDialog = ref(false)
const group = ref([])
const isErrorVisible = ref(false)
const disabledGroup = ref(false)
const customErrorMessages = ref('')

const formSubmit = ref({
  nip: '',
  contact_name: '',
  email: '',
  phone_number: '',
  group_id: Number(route.params.id),
})

const resetForm = () => {
  formSubmit.value.nip = ''
  formSubmit.value.contact_name = null
  formSubmit.value.email = null
  formSubmit.value.phone_number = null
  formSubmit.value.group_id = Number(route.params.id)
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const createContact = () => {

  let params = {
    nip: formSubmit.value.nip,
    contact_name: formSubmit.value.contact_name,
    email: formSubmit.value.email,
    phone_number: formSubmit.value.phone_number,
    group_id: formSubmit.value.group_id,
  }

  window.moffas.do_request(
    'contact_create',
    params, 
    onCreateContact,
    onDataError,
  )
}

const onCreateContact = data => {
  const response = JSON.parse(data)

  confirmationDialog.value = false

  if (response.hasOwnProperty('trace_id')) {
    customErrorMessages.value = response
    isErrorVisible.value = true
  } else {
    successDialog.value = true
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      confirmationDialog.value = true
  })
}

const getGroups = () => {
  console.log('createUser')

  const params = {
    currentPage: 1,
  }

  window.moffas.do_request(
    'group_get_all',
    params, 
    onGetGroups,
    onDataError,
  )
}

const onGetGroups = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  group.value = response.groups
}

const getGroupAll = () => {
  return group.value
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
  getGroups()
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
        Group Management
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
          <RouterLink
            :to="'/group-management/view-details/' + Number(route.params.id)"
          >
            <v-btn 
              class="mb-5"
              icon="mdi-arrow-left"
              @click=""
            ></v-btn>
          </RouterLink>                
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
                  v-else-if="name != 'Group'"
                  v-model="formSubmit[name.toLowerCase().replace(' ', '_')]"
                  focused
                  :rules="formRequired.includes(name) ? (name == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                />
                <VSelect
                  v-else-if="name == 'Group'"
                  v-model="formSubmit['group_id']"
                  :items="getGroupAll()"
                  item-value="group_id"
                  item-title="group_name"
                  focused
                  class="text-black"
                  style="max-width: 50%;"
                  :disabled="!disabledGroup"
                />
              </VCol>
            </VRow>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
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
