<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/staff-management/CustomEditDialog.vue'
import CustomDetailDialog from '@/components/user-management/CustomDetailDialog.vue'
import CustomTable from '@/components/user-management/CustomTable.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import { useUserManagementStore } from '@/store/useUserManagementStore'
import axios from '@axios'


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

const userManagementListStore = useUserManagementStore()

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['No', 'Name', 'Department', 'Sub Department', 'Skills', 'Level', 'Status', 'Actions'])
// const tableHeader = ref(['No', 'Name', 'Department', 'Position', 'Skills', 'Availability ', 'Location', 'Tickets Solved', 'Average Response Time', 'Action'])
const dataHeader = ref(['nip', 'name', 'email', 'phone_number', 'role_name'])
const editTableHeader = ref(['NIP', 'Name', 'Email', 'Phone Number', 'Role'])
const editDataHeader = ref(['nip', 'name', 'email', 'phone_number', 'role_name'])

const tableData = ref([])
const totalPage = ref(1)
const totalUser = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])

const detailDialog = ref(false)
const editDialog = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)

const showProgressCircular = ref(true)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))
const staffID = ref('')

const departmentList = ref([])
const departments = ref([])
const subDepartments = ref([])
const unitIDStore = ref(null)

const isSuccess = ref({
  success: false,
  id: -1,
})

const tempFilter = ref({
  nip: '',
  name: '',
})

const filter = ref({
  nip: '',
  name: '',
})

const editTableData = ref({
  id: '',
  nip: '',
  name: '',
  email: '',
  password: '',
  phone_number: '',
  role_name: '',
  role_id: -1,
})

const detailDialogProps = ref({
  headerNames: editTableHeader.value,
  dataNames: editDataHeader.value,
  row: {},
})

const editDialogProps = ref({
  data: {},
})

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  messageSubtitle: ['', ''],
  op: '',
  id: -1,
})

const successDialogProps = ref({
  subject: '',
})

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const resetDialogProps = () => {
  detailDialogProps.value.row = {}
  editDialogProps.value.row = {}
  confirmDialogProps.value.confirmationStyling = ''
  confirmDialogProps.value.messageTitle = ''
  confirmDialogProps.value.messageSubtitle = ['', '']
  confirmDialogProps.value.op = ''
  confirmDialogProps.value.id = -1
  successDialogProps.value.subject = ''
}

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'update':
    updateStaff()
    break
  case 'delete':
    modifyStaff('4', staffID.value)
    break
  case 'activate':
    modifyStaff('user_activate', confirmDialogProps.value.id)
    break
  case 'deactivate':
    modifyStaff('user_deactivate', confirmDialogProps.value.id)
    break  
  default:
    break
  }
}

const isActive = n => {
  if (n) {
    return 'Active'
  }
  else {
    return 'Inactive'
  }
}

const setEditData = r => {
  editTableData.value.id = r.id
  editTableData.value.nip = r.nip
  editTableData.value.name = r.name
  editTableData.value.email = r.email
  editTableData.value.password = ''
  editTableData.value.phone_number = r.phone_number
  editTableData.value.role_name = r.role_name
  editTableData.value.role_id = r.role_id
}

// Only for development purposes
const fetchDummy = () => {
  userManagementListStore.fetchUserManagement({
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
    nip: filter.value.nip,
    nama: filter.value.name,
  }).then(response => {
    tableData.value = response.data.userManagement
    totalPage.value = response.data.totalPage
    totalUser.value = response.data.totalUser
  }).catch(error => {
    console.log("error",error)
  })
}

const removeItem = (id) => {
  editDialogProps.value.data.job_desc.skill.splice(id, 1)
}

const addItem = () => {
  editDialogProps.value.data.job_desc.skill.push('')
}

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const onDepartmentChange = (data) => {
  subDepartments.value = []

  departmentList.value.forEach(item => {
    if (data == item.unit_name) {
      subDepartments.value.push(item.sub_unit_name)
    }
  })
}

const onSubDepartmentChange = (subDepartmentData) => {
  departmentList.value.forEach(item => {
    if (subDepartmentData == item.sub_unit_name) {
      let unitID = item.unit_id

      unitIDStore.value = unitID
      console.log('unitID=', unitID)
      console.log('editDialogProps.data=', editDialogProps.data)
    }
  })
}

const fetchDepartment = () => {
  console.log('fetchDepartment')

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value, 
    row_length: rowPerPage.value,
    current_page: 0,
    search_filter: '', 
  }

  axios.post(urlBE.value + 'retrieve_ticket_units', params)
  .then(function (response) {
    console.log('response department list=', response);
    
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

    console.log('departments.value=', departments.value)
  })
  .catch(function (error) {
    console.log(error);
    onDataError(error)
  });
}

const onfetchDepartment = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.data.users
  totalPage.value = response.data.page_total
  totalUser.value = response.data.totalUsers
}

const fetchStaff = () => {
  console.log('fetchStaff')

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value, 
    row_length: rowPerPage.value,
    current_page: currentPage.value,
    search_filter: '',  
  }

  axios.post(urlBE.value + 'retrieve_ticket_staffs', params)
  .then(function (response) {
    console.log('response staff list=', response);
    
    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    const responseData = response.data

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalUser.value = responseData.recordsTotal 

    fetchDepartment()

    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error);
    onDataError(error)
  });
}

const onfetchStaff = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.data.users
  totalPage.value = response.data.page_total
  totalUser.value = response.data.totalUsers
}

const updateStaff = () => {
  console.log('updateStaff')

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    data: {
      staff_id: editDialogProps.value.data.staff_id,
      name: editDialogProps.value.data.name,
      status: Number(editDialogProps.value.data.status),
      job_desc_skill: editDialogProps.value.data.job_desc.skill,
      level_id: editDialogProps.value.data.level_id
    },
    op_crud: 3,
  }

  if (unitIDStore.value) {
    params.data.unit_id = unitIDStore.value
  } else {
    params.data.unit_id = editDialogProps.value.data.unit_id
  }

  console.log('params updateStaff', params)

  axios.post(urlBE.value + 'do_ticket_staff', params)
  .then(function (response) {
    console.log('response updateStaff=', response);

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    unitIDStore.value = null

    showProgressCircular.value = false
    successDialog.value = true
  })
  .catch(function (error) {
    console.log('error di axios updateStaff', error);
    onDataError(error)
  });
}

// user_delete, user_activate, user_deactivate
const modifyStaff = (op, id) => {
  console.log(op)

  /////Note////////////
  // op_crud =
  // 1 -> insert/create
  // 2 -> read
  // 3 -> update
  // 4 -> delete

  const params = {
    data: {
      staff_id: id
    },
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: Number(op),
  }

  console.log('params modifyStaff', params)

  axios.post(urlBE.value + 'do_ticket_staff', params)
  .then(function (response) {
    console.log('response di modifyStaff=', response);
    // const responseData = response.data

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    // tableData.value = responseData.data
    // totalPage.value = responseData.total_pages
    // totalDepartment.value = responseData.recordsTotal 

    showProgressCircular.value = false
    successDialog.value = true
  })
  .catch(function (error) {
    console.log(error);
    onDataError(error)
  });
}

const onModifyStaff = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.data.id

  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

// 👉 Fetch UserManagement
watch(fetchStaff)

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value
  
  numberTable.value = firstIndex
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalUser.value } entries`
})

const numberTable = ref(0)

const disabledButton = ref(true)

if (priv['update_user'] || Object.keys(priv).length === 0) {
  disabledButton.value = false
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
  // getRoles()
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
            View Staff 
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
    <!-- <VCard
      class="pa-5 mb-6"
    >
      <CustomFilter
        @filter="() => {
          filter.nip = tempFilter.nip
          filter.name = tempFilter.name
        }"
      >
        <VRow class="align-center">
          <span class="text-black font-weight-bold mx-4">NIP</span>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="tempFilter.nip"
              focused
              @keydown.enter.prevent 
              @keyup.enter="() => {
                filter.nip = tempFilter.nip
                filter.name = tempFilter.name
              }"
            />
          </VCol>
          <span class="text-black font-weight-bold mx-4">Name</span>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="tempFilter.name"
              focused
              @keydown.enter.prevent 
              @keyup.enter="() => {
                filter.nip = tempFilter.nip
                filter.name = tempFilter.name
              }"
            />
          </VCol>
        </VRow>
      </CustomFilter>
    </VCard> -->
    <VCard>
      <VCardText class="d-flex flex-row align-center text-black font-weight-bold row2">
        <span class="me-3">Show</span>
        <div>
          <VSelect
            v-model="rowPerPage"
            class="pagination-select rounded"
            density="compact"
            focused
            :items="[10, 20, 30, 50]"
          />
        </div>
        <span class="ms-3">entries</span>
      </VCardText>
      <VSpacer />
      <CustomTable
        :table-header-names="tableHeader" 
        :table-data-length="tableData.length"
      >
        <template #tableBody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="bg-hover"
          >
            <td class="text-center">
              <span class="text-black">
                {{ numberTable + index}}
              </span>
            </td>
            <td class="pl-7">
              <span class="text-black">
                {{ row.name }}
              </span>
            </td>
            <td class="pl-7">
              <span class="text-black">
                {{ row.unit_name }}
              </span>
            </td>
            <td class="pl-7">
              <span class="text-black">
                {{ row.sub_unit_name }}
              </span>
            </td>
            <td class="text-black pl-6">
              <div               
                v-for="(data, index1) in row.job_desc.skill"
                :key="index1"
              >
                <div v-if="row.job_desc.skill.length > 1">
                  {{ 1 + index1 }}. {{ data }}
                </div>
                <div v-else>
                  {{ data }}
                </div>
              </div>
            </td>
            <td
              class="pl-7 text-center "
            > 
              <!-- <span class="text-black">
                {{ row.level_name }}
              </span> -->
              <div v-if="row.level_id == '0'">
                <span class="text-black">
                  Viewer
                </span>
              </div>
              <div v-else-if="row.level_id == '1'">
                <span class="text-black">
                  Agent
                </span>
              </div>
              <div v-else-if="row.level_id == '2'">
                <span class="text-black">
                  Supervisor
                </span>
              </div>
              <div v-else>
                <span class="text-black">
                  Admin
                </span>
              </div>
            </td>
            <td
              class="pl-7 text-center "
            > 
              <div v-if="row.status == 1">
                <span class="text-black">
                  Active
                </span>
              </div>
              <div v-else>
                <span class="text-black">
                  Not Active
                </span>
              </div>
            </td>
            <td>
              <div class="text-center">  
                <VBtn
                  class="text-none text-caption ma-2 px-3 py-1"
                  density="compact"
                  size=""
                  variant="tonal"
                  @click="() => {
                    editDialogProps.data = row
                    editDialog = true
                  }"
                >
                  Edit
                </VBtn>             
                <VBtn
                  class="text-none text-caption ma-2 px-3 py-1"
                  density="compact"
                  size=""
                  color="error"
                  variant="tonal"
                  :disabled="disabledButton"
                  @click="() => {
                    confirmDialogProps.confirmationStyling = '2'
                    confirmDialogProps.messageTitle = 'Are you sure you want to delete this?'
                    confirmDialogProps.messageSubtitle = ['', '']
                    confirmDialogProps.op = 'delete'
                    staffID = row.staff_id
                    successDialogProps.subject = 'staff deletion'
                    confirmDialog = true
                  }"
                >
                  Delete
                </VBtn>
              </div>
            </td>
          </tr>
        </template>
      </CustomTable>
      <VDivider />
      <VCardText class="d-flex align-center font-weight-bold text-black">
        <span>
          {{ paginationData }}
        </span>
        <VSpacer />
        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="3"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
    </VCard>
    <CustomDetailDialog
      v-model:is-dialog-visible="detailDialog"
      rounded="lg"
      width="30%"
      title="Detail User Management"
      :header-names="detailDialogProps.headerNames"
      :data-names="detailDialogProps.dataNames"
      :row="detailDialogProps.row"
      @activate="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to activated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to activated account?', 'This account cannot be undone.']
        confirmDialogProps.op = 'activate'
        confirmDialogProps.id = detailDialogProps.row['id']
        successDialogProps.subject = 'actived account'
        confirmDialog = true
      }"
      @deactivate="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to deactivated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to deactivated account?', 'This account cannot be undone.']
        confirmDialogProps.op = 'deactivate'
        confirmDialogProps.id = detailDialogProps.row['id']
        successDialogProps.subject = 'deactived account'
        confirmDialog = true
      }"
    />
    <CustomEditDialog
      v-model:is-dialog-visible="editDialog"
      rounded="lg"
      width="60%"
      title="Edit Staff Management"
      :dataStaff="editDialogProps.data"
      :departments="departments"
      :subDepartments="subDepartments"
      :priv="priv"
      @save="data => {
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        editDialogProps.data = data
        successDialogProps.subject = 'submit'
        confirmDialog = true
      }"
      @remove="data => {
        removeItem(data)
      }"
      @cancel="() => {
        editDialog = false
        fetchStaff()
      }"
      @add="() => {
        addItem()
      }"
      @getsubdepartment="data => {
        onDepartmentChange(data)
      }"
      @getStaff="data => {
        onSubDepartmentChange(data)
      }"
    />
    <CustomConfirmDialog
      v-model:is-dialog-visible="confirmDialog"
      rounded="lg"
      width="auto"
      :confirmation-styling="confirmDialogProps.confirmationStyling"
      :message-title="confirmDialogProps.messageTitle"
      :message-subtitle="confirmDialogProps.messageSubtitle"
      @yes="chooseOP"
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="() => {
        detailDialog = false
        editDialog = false
        resetDialogProps()
        fetchStaff()
      }"
    />

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
  </section>
</template>
  
  <style lang="scss" scoped>
  .status-field-boxing-color-inactive {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: #4d4d4f;
    color: white;
    font-size: 0.7rem;
  }

  .status-field-boxing-color-active {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: #ed2324;
    color: white;
    font-size: 0.7rem;
  }

  .input-field-background-color {
    background-color: #d9d9d9;
  }

  .pagination-select {
    padding-inline-start: 0.625rem;

    .v-field__input,
    .v-field__append-inner {
      padding: 0.3rem;
    }
  }

  .bg-hover:hover {
    background-color: rgba(68, 73, 74, 5%);
  }
  </style>
  
  <route lang="yaml">
    meta:
      requiresAuth: true
  </route>
