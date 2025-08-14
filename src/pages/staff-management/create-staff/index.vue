<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue';
import CustomNotifDialog from '@/components/CustomNotifDialog.vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import axios from '@axios';

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

const formKeyNames = ref(['Name', 'Department', 'Position', 'Skills', 'Location'])
const formRequired = ref(['Name', 'Department', 'Position', 'Skills', 'Location'])
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const isPasswordVisible = ref(false)
const confirmationDialog = ref(false)
const successDialog = ref(false)
const role = ref([])
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const rowPerPage = ref(10)
const currentPage = ref(1)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const isSuccess = ref({
  success: false,
  id: -1,
})

const formSubmit = ref({
  departmentID: '',
  department: '',
  subDepartment: '',
  staffName: '',
  skills: [''],
  jobDesc: '',
  level: '',
})

const departmentList = ref([])
const departments = ref([])
const subDepartments = ref([])
const levels = ref([
  {
    title: 'Viewer',
    value: '0'
  },
  {
    title: 'Agent',
    value: '1'
  },
  {
    title: 'Supervisor',
    value: '2'
  },
  // {
  //   title: 'Admin',
  //   value: '3'
  // },
])

const resetForm = () => {
  formSubmit.value.staffName = ''
  formSubmit.value.department = ''
  formSubmit.value.subDepartment = ''
  formSubmit.value.skills = ['']
  formSubmit.value.jobDesc = ''
  formSubmit.value.level = ''
}

const onDataError = e => {
  
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const removeSkills = id => {
  formSubmit.value.skills.splice(id, 1)
}

const addSkills = id => {
  formSubmit.value.skills.push('')
}

const onDepartmentChange = () => {
  subDepartments.value = []

  departmentList.value.forEach(item => {
    if (formSubmit.value.department == item.unit_name) {
      // unitNames[item.unit_name] = true;
      subDepartments.value.push(item.sub_unit_name);
      // departmentID.value = item.unit_id
    }
  })

  console.log('subDepartments.value', subDepartments.value)

  // if (filteredTemplate.value.type == 'DYNAMIC') {
  //   formSubmit.value.broadcast_group = ''
  // }
}

const onSubDepartmentChange = () => {
  formSubmit.value.departmentID = ''

  departmentList.value.forEach(item => {
    if (formSubmit.value.subDepartment == item.sub_unit_name) {
      formSubmit.value.departmentID = item.unit_id
    }
  })

  console.log('formSubmit.value.departmentID', formSubmit.value.departmentID)
}

const fetchDepartment = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: 0,
    search_filter: '',    
  }

  axios.post(urlBE.value + 'retrieve_ticket_units', params)
  .then(function (response) {
    console.log('response fetchDepartment', response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    const responseData = response.data
    departmentList.value = responseData.data

    const unitNames = {}
    departmentList.value.forEach(item => {
      if (!unitNames[item.unit_name]) {
        unitNames[item.unit_name] = true;
        departments.value.push(item.unit_name);
      }
    })

    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error);
    onDataError(error)
  });
}

const createStaff = () => {
  console.log('createStaff')

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    data: {
      unit_id: formSubmit.value.departmentID,
      unit_name: formSubmit.value.department,
      sub_unit_name: formSubmit.value.subDepartment,
      name: formSubmit.value.staffName,
      job_desc_skill: formSubmit.value.skills,
      job_desc_desc: formSubmit.value.jobDesc,
      level_id: formSubmit.value.level,
    },
    op_crud: 1,
  }

  console.log('params createStaff', params)

  axios.post(urlBE.value + 'do_ticket_staff', params)
  .then(function (response) {
    console.log('response createStaff=', response)
    // const responseData = response.data

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
}

const onCreateUser = data => {
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

const confirmYes = () => {
  createStaff()        
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
  fetchDepartment()
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
        Staff Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Create Staff 
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
            <VRow class="align-center">
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black required"
                >Name:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-model="formSubmit.staffName"
                  focused
                  :rules="[(v) => !!v || 'Name of staff is required']"
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
                >Level:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VSelect
                  v-model="formSubmit.level"
                  :items="levels"
                  item-value="value"
                  item-title="title"
                  focused
                  :rules="[(v) => !!v || 'Department is required']"
                  @update:modelValue="onDepartmentChange"
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
                >Department:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <!-- <VTextField
                  v-model="formSubmit.department"
                  focused
                  :rules="[(v) => !!v || 'Department is required']"
                /> -->
                <VSelect
                  v-model="formSubmit.department"
                  :items="departments"
                  focused
                  :rules="[(v) => !!v || 'Department is required']"
                  @update:modelValue="onDepartmentChange"
                />
              </VCol>
            </VRow>
            <VRow v-if="formSubmit.department" class="align-center">
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
                <!-- <VTextField
                  v-model="formSubmit.subDepartment"
                  focused
                  :rules="[(v) => !!v || 'Sub Department is required']"
                /> -->

                <VSelect
                  v-model="formSubmit.subDepartment"
                  :items="subDepartments"
                  focused
                  :rules="[(v) => !!v || 'Sub Department is required']"
                  @update:modelValue="onSubDepartmentChange"
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
                >Job Description:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-model="formSubmit.jobDesc"
                  focused
                  :rules="[(v) => !!v || 'Job Description is required']"
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
                >Skills:</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VCard
                  v-for="(skill, index) in formSubmit.skills"
                  :key="index"
                  flat
                  class="d-flex flex-sm-row flex-column-reverse pb-2"
                > 
                  <div 
                    class="flex-grow-1"
                  >
                    <VTextField
                      v-model="formSubmit.skills[index]"
                      focused
                      :rules="[(v) => !!v || 'Skills is required']"
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
                      @click="removeSkills(index)"
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
                    @click="addSkills()"
                  >
                      Add Skills
                  </VBtn>
                </div>
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
