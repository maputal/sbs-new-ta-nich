<script setup>
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

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const confirmationDialog = ref(false)
const successDialog = ref(false)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

// const role = ref([])
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const isSuccess = ref({
  success: false,
  id: -1,
})

const formSubmit = ref({
  department: '',
  subDepartment: '',
  categories: [''],
  maxHandleTime: '',
})

const specificTime = ref({
  number: '',
  time: '',
})

const resetForm = () => {
  formSubmit.value.department = null
  formSubmit.value.subDepartment = null
  formSubmit.value.categories = null
  formSubmit.value.maxHandleTime = null
  specificTime.value.number = null
  specificTime.value.time = null
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const onDataError = e => {
  console.log(e)

  isErrorVisible.value = true
  customErrorMessages.value = e
}

const removeCategories = id => {
  formSubmit.value.categories.splice(id, 1)
}

const addCategories = id => {
  formSubmit.value.categories.push('')
}

const createDepartment = () => {
  console.log('createDepartment')

  formSubmit.value.maxHandleTime = specificTime.value.number + ' ' + specificTime.value.time

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    data: {
      unit_name: formSubmit.value.department,
      sub_unit_name: formSubmit.value.subDepartment,
      specific_time: formSubmit.value.maxHandleTime,
      specific_issue: formSubmit.value.categories
    },
    op_crud: 1,
  }

  console.log('params createDepartment', params)

  axios.post(urlBE.value + 'do_ticket_unit', params)
  .then(function (response) {
    console.log('response department list=', response);
    // const responseData = response.data

    console.log('response dicreateDepartment')
    console.log(response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    // showProgressCircular.value = false
    successDialog.value = true
  })
  .catch(function (error) {
    console.log('error di axios dicreateDepartment', error);
    onDataError(error)
  });

  // const params = {
  //   group_name: formSubmit.value.group_name,
  // }

  // window.moffas.do_request(
  //   'group_create',
  //   params, 
  //   onCreateDepartment,
  //   onDataError,
  // )
}

const onCreateDepartment = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.data.id

  confirmationDialog.value = false
  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      confirmationDialog.value = true
  })
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
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
        Department Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Create Department 
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-4">
          <!-- 👉 Issue Date -->
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
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
            <VRow class="align-center">
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black required"
                >Department:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-model="formSubmit.department"
                  focused
                  :rules="[(v) => !!v || 'Department is required']"
                />
              </VCol>
            </VRow>
            <VRow class="align-center">
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black required"
                >Sub Department:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-model="formSubmit.subDepartment"
                  focused
                  :rules="[(v) => !!v || 'Sub Department is required']"
                />
              </VCol>
            </VRow>
            <VRow class="">
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black required"
                >Categories:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <!-- <VTextField
                  v-model="formSubmit.categories"
                  focused
                /> -->
                
                <VCard
                  v-for="(issue, index) in formSubmit.categories"
                  :key="index"
                  flat
                  class="d-flex flex-sm-row flex-column-reverse pb-2"
                > 
                  <div 
                    class="flex-grow-1"
                  >
                    <VTextField
                      v-model="formSubmit.categories[index]"
                      focused
                      :rules="[(v) => !!v || 'Categories is required']"
                    />
                  </div>
                  <div
                    v-if="!index == 0"
                    class="d-flex flex-column item-actions pa-1"
                  >
                    <VBtn
                      icon
                      size="x-small"
                      color="error"
                      @click="removeCategories(index)"
                    >
                      <VIcon
                        :size="20"
                        icon="mdi-close"
                      />
                    </VBtn>
                  </div>              
                </VCard>
                <div class="">
                  <VBtn
                    size="small"
                    prepend-icon="mdi-plus"
                    @click="addCategories()"
                  >
                      Add Categories
                  </VBtn>
                </div>
              </VCol>
            </VRow>
            <VRow class="align-center">
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black required"
                >Max Handle Time:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <!-- <VTextField
                  v-model="formSubmit.maxHandleTime"
                  focused
                /> -->
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      v-model="specificTime.number"
                      focused
                      type="number"
                      :rules="[(v) => !!v || 'Time is required']"
                    />
                  </VCol>
                  <VCol cols="6" class="pl-0">
                    <VSelect
                      v-model="specificTime.time"
                      :items="['Hour', 'Day']"
                      :rules="[(v) => !!v || 'Time is required']"
                      focused
                    />
                  </VCol>                
                </VRow>
              </VCol>
            </VRow>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                v-if ="priv.hasOwnProperty('create_group') || Object.keys(priv).length === 0"
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
                @yes="() => {
                  createDepartment()
                  confirmationDialog = false
                  successDialog = true
                }"
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
