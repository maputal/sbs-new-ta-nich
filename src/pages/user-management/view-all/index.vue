<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
// import CustomDetailDialog from '@/components/user-management/CustomDetailDialog.vue'
// import CustomEditDialog from '@/components/user-management/CustomEditDialog.vue'
// import CustomTable from '@/components/user-management/CustomTable.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
// import { useUserManagementStore } from '@/store/useUserManagementStore'
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
  1:'Monday',
  2:'Tuesday',
  3:'Wednesday',
  4:'Thursday',
  5:'Friday',
  6:'Saturday',
  7:'Sunday',
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

// const userManagementListStore = useUserManagementStore()

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const showProgressCircular = ref(true)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const tableHeader = ref(['No', 'NIP', 'Name', 'Email', 'Phone Number', 'Role', 'Status', 'Action'])
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

const role = ref([])


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
  status: -1,
})

const detailDialogProps = ref({
  headerNames: editTableHeader.value,
  dataNames: editDataHeader.value,
  row: {},
})

const editDialogProps = ref({
  editProps: [
    {
      headerName: 'NIP',
      dataName: 'nip',
      inputType: 'text-field',
    },
    {
      headerName: 'Name',
      dataName: 'name',
      inputType: 'text-field',
    },
    {
      headerName: 'Email',
      dataName: 'email',
      inputType: 'text-field',
    },
    {
      headerName: 'Change Password',
      dataName: 'password',
      inputType: 'text-field',
    },
    {
      headerName: 'Phone Number',
      dataName: 'phone_number',
      inputType: 'text-field',
    },
    {
      headerName: 'Role',
      dataName: 'role_name',
      inputType: 'select',
      items: [],
    },
  ],
  formRequired: ['Name', 'Email', 'Role'],
  row: {},
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
    updateUser()
    break
  case 'delete':
    modifyUser('4', confirmDialogProps.value.id)
    break
  case 'activate':
    modifyUser('user_activate', confirmDialogProps.value.id)
    break
  case 'deactivate':
    modifyUser('user_deactivate', confirmDialogProps.value.id)
    break  
  default:
    break
  }
}

const getRoleNames = () => {
  let arr = []
  console.log('ini adlah rooll', role.value)
  role.value.forEach((items, index) => {
    arr[index] = {
      name: items.role_name,
      id: items.id
    }
  })
  
  return arr
}

const getRoles = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value   
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

// const getRoles = () => {
//   console.log('getAllRoles')

//   const params = {}

//   window.moffas.do_request(
//     'role_get_all',
//     params, 
//     onGetRoles,
//     onDataError,
//   )
// }

// const onGetRoles = data => {
//   const response = JSON.parse(data)

//   if (response.hasOwnProperty('trace_id')){
//     customErrorMessages.value = response
//     isErrorVisible.value = true
    
//     return
//   }

//   role.value = response.data
//   console.log ('iniiiiiii',response.data)
// }

const isActive = n => {
  if (n) {
    return 'Active'
  }
  else {
    return 'Inactive'
  }
}

const setEditData = r => {
  editTableData.value.id = r.user_id
  editTableData.value.nip = r.nip
  editTableData.value.name = r.name
  editTableData.value.email = r.email
  editTableData.value.password = ''
  editTableData.value.phone_number = r.phone_number
  editTableData.value.role_name = r.role_name
  editTableData.value.role_id = r.role_id
  editTableData.value.status = r.status
}


const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const fetchUsers = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value,
    nip: filter.value.nip,    
    name: '', 
    search_filter: filter.value.name || '',  
  }

  axios.post(urlBE.value + 'retrieve_management_users', params)
  .then(function (response) {
    console.log('response user list=', response)
    const responseData = response.data

    console.log('response', response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalUser.value = responseData.recordsTotal 

    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

// const fetchUsers = () => {
//   console.log('fetchUsers')

//   let params = {
//     perPage: rowPerPage.value,
//     currentPage: currentPage.value,
    
//   }
//   if (filter.value.nip != '') {
//     params.nip = filter.value.nip
//   }
//   if (filter.value.name != '') {
//     params.name = filter.value.name
//   }

//   window.moffas.do_request(
//     'user_get_all',
//     params, 
//     onFetchUsers,
//     onDataError,
//   )
// }

// const onFetchUsers = data => {
//   const response = JSON.parse(data)

//   if (response.hasOwnProperty('trace_id')){
//     customErrorMessages.value = response
//     isErrorVisible.value = true
    
//     return
//   }

//   tableData.value = response.data.users
//   totalPage.value = response.data.totalPage
//   totalUser.value = response.data.totalUsers
// }

const updateUser = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 3,

    data: {
      user_id: editTableData.value.id,
      nip: editTableData.value.nip,
      name: editTableData.value.name,
      email: editTableData.value.email,
      phone_number: editTableData.value.phone_number,
      role_id: editTableData.value.role_id,
      password: editTableData.value.password,   
      status: editTableData.value.status,   
    }
  }

  console.log('params di updateUser', params)

  axios.post(urlBE.value + 'do_management_user_crud', params)
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

// const updateUser = () => {
//   console.log('updateUser')

//   const params = {
//     id: editTableData.value.id,
//     nip: editTableData.value.nip,
//     name: editTableData.value.name,
//     email: editTableData.value.email,
//     phone_number: editTableData.value.phone_number,
//     role_id: editTableData.value.role_id,
//     password: editTableData.value.password,
//   }

//   window.moffas.do_request(
//     'user_update',
//     params, 
//     onModifyUser,
//     onDataError,
//   )
// }

// user_delete, user_activate, user_deactivate

const modifyUser = (op, id) => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: op,

    data: {
      user_id: id,
    } 
  }

  console.log('params di modifyUser', params)

  axios.post(urlBE.value + 'do_management_user_crud', params)
  .then(function (response) {
    console.log('response user list=', response)
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

// const modifyUser = (op, id) => {
//   console.log(op)

//   const params = {
//     id: id,
//   }

//   window.moffas.do_request(
//     op,
//     params, 
//     onModifyUser,
//     onDataError,
//   )
// }

// const onModifyUser = data => {
//   const response = JSON.parse(data)

//   if (response.hasOwnProperty('trace_id')){
//     customErrorMessages.value = response
//     isErrorVisible.value = true
    
//     return
//   }
  
//   isSuccess.value.success = response.success
//   isSuccess.value.id = response.data.id

//   if(isSuccess.value.success) {
//     successDialog.value = true
//   }
//   isSuccess.value.success = false
// }

// 👉 Fetch UserManagement

watch(fetchUsers)

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})

// watchEffect(() => {
//   if (role.value != [])
//     editDialogProps.value.editProps.at(-1).items = getRoleNames()
// })

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
  
  // fetchUsers()
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
            View Users 
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
    <VCard
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
    </VCard>
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
            <td
              v-for="(data, index1) in dataHeader"
              :key="index1"
              class="pl-7 text-center"
            >
              <span class="text-black">
                {{ row[data] }}
              </span>
            </td>
            <td class="pl-8">
              <span class="justify-center">
                <span 
                  v-if="row['status']"
                  class="w-90"
                  :class="{'status-field-boxing-color-active': row['status'] == 1, 'status-field-boxing-color-inactive': row['status'] == 0}"
                >
                  {{ isActive(row['status']) }}
                </span>
              </span>
            </td>
            <td class="d-flex justify-center align-center text-xenter">
              <VBtn
                class="text-none text-white ma-2"
                density="compact"
                size="small"
                color="#32BCAD"
                :disabled="disabledButton"
                @click="() => {
                  detailDialogProps.row = row
                  detailDialog = true
                }"
              >
                Detail
              </VBtn>
              <VBtn
                class="text-none ma-2"
                density="compact"
                size="small"
                variant="outlined"
                :disabled="disabledButton"
                @click="() => {
                  setEditData(row)
                  editDialogProps.row = row
                  editDialog = true
                }"
              >
                Edit
              </VBtn>
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
    <!-- <CustomDetailDialog
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
        confirmDialogProps.messageSubtitle = ['Are you sure you want to activated account?', 'This account cannot be undone']
        confirmDialogProps.op = 'activate'
        confirmDialogProps.id = detailDialogProps.row['id']
        successDialogProps.subject = 'actived account'
        confirmDialog = true
      }"
      @deactivate="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to deactivated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to deactivated account?', 'This account cannot be undone']
        confirmDialogProps.op = 'deactivate'
        confirmDialogProps.id = detailDialogProps.row['id']
        successDialogProps.subject = 'deactived account'
        confirmDialog = true
      }"
    />
    <CustomEditDialog
      v-model:is-dialog-visible="editDialog"
      rounded="lg"
      width="40%"
      title="Edit User Management"
      :edit-props="editDialogProps.editProps"
      :user-data="editTableData"
      :list-of-role="role"
      :form-required="editDialogProps.formRequired"
      :row="editDialogProps.row"
      @delete="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to delete user'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to delete this user?', 'This user cannot be undone']
        confirmDialogProps.op = 'delete'
        confirmDialogProps.id = editTableData.id
        successDialogProps.subject = 'delete'
        confirmDialog = true
      }"
      @save="data => {
        editTableData.nip = data.nip
        editTableData.name = data.name
        editTableData.email = data.email
        editTableData.password = data.password
        editTableData.phone_number = data.phone_number
        editTableData.role_id = data.role_id
        editTableData.status = data.status
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        confirmDialogProps.id = editDialogProps.row['id']
        successDialogProps.subject = 'submit'
        confirmDialog = true
      }"
    /> -->
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
        fetchUsers()
      }"
    />
  </section>
</template>
  
  <style lang="scss" scoped>
  .status-field-boxing-color-inactive {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: #ed2324;
    color: white;
    font-size: 0.7rem;
  }

  .status-field-boxing-color-active {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: #1977F3;
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
