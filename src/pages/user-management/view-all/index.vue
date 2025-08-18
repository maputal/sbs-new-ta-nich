<script setup>
import CustomTable from '@/components/user-management/CustomTable.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
//import { useUserManagementStore } from '@/store/useUserManagementStore'
import axios from '@axios'
import {fetchMembersDummy} from '@/pages/user-management/member_dummy.js'
import { useAppStore } from '@/store/app'
import { useUserManagementStore } from '@/store/useUserManagementStore'
import { toRaw } from 'vue'

const store = useGlobalStore()

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

//const userManagementListStore = useUserManagementStore()

const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const showProgressCircular = ref(true)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const tableHeader = ref(['No', 'Login', 'Name', 'NIP', 'Division', 'Privilege', 'Status', 'Action'])
const dataHeader = ref(['login', 'name', 'nip', 'division','role'])
const editTableHeader = ref(['NIP', 'Name', 'Division', 'User Roles', 'Status']) // User roles adalah Privilege
const editDataHeader = ref(['nip', 'name', 'division', 'privilege', 'status'])

const tableData = ref([])
const totalPage = ref(1)
const totalUser = ref(3)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])


const editDialog = ref(false)

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

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv || []

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

const userStore = useUserManagementStore()

const setEditData = r => {
  console.log("SETTING")
  userStore.setUser(toRaw(r))
  router.push("/user-management/edit-user")
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

  fetchMembersDummy(params)
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
  // axios.post(urlBE.value + 'retrieve_management_users', params)
  
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

const appStore = useAppStore()

function testFunc() {
  appStore.setPopup({
      title: 'Error',
      word: 'Generic failure',
      action: 'error',
      onSucc: () => {
        showDialogGroup.value = false
      },
    })
}

function confirmDeletionPopup(id, username){
    appStore.setPopup({
        title: 'Confirm Delete User',
        word: 'Are you sure you want to delete this user? ' + (username ? `(${username})` : ''),
        action: 'warn',
        onSucc: () => {
          // delete id
          // Try delete
          successPopup("User had been deleted")

        },
      })
}

function errorPopup(error_message){
    appStore.setPopup({
      title: 'Error',
      word: error_message || 'Undefined failure!',
      action: 'error',
      onSucc: () => {
        //
      },
    })
}

function successPopup(success_message){
  appStore.setPopup({
      title: 'Success!',
      word: success_message || '',
      action: 'success',
      onSucc: () => {
        showDialogGroup.value = false
      },
    })
}

</script>

<template>
  <section>
    <!-- <LazyErrorDialogs
      :v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    /> -->
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
    <VCard>
      <VCardText class="d-flex" style="justify-content: space-between;">
        <v-btn to="/user-management/create-user" prepend-icon="mdi-account-plus" class="text-capitalize font-weight-bolder">
          Add new user
        </v-btn>
        <h2 style="line-height: 2rem;" class="mr-4">
          List User
        </h2>
      </VCardText>
      <hr></hr>
      <VSpacer/>
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
              class="text-center"
            >
              <span class="text-black">
                {{ row[data] }}
              </span>
            </td>
            <td class="text-center">
              <span class="justify-center">
                <span 
                  v-if="row['status'] != null && row['status'] != undefined"
                  class="w-90"
                  :class="{'status-field-boxing-color-active': row['status'] == 1, 'status-field-boxing-color-inactive': row['status'] == 0}"
                >
                  {{ isActive(row['status']) }}
                </span>
              </span>
            </td>
            <td class="d-flex justify-center align-center text-center">
              <VBtn
                class="text-none text-white ma-2 flex-grow-1"
                size="small"
                color="#ed1c2480"
                :disabled="disabledButton"
                @click="() => {confirmDeletionPopup(index, row.name)}"
                prepend-icon="mdi-trash-can"
              >
                Delete
              </VBtn>
              <VBtn
                class="text-none text-white ma-2 flex-grow-1"
                size="small"
                color="#C6168D80"
                :disabled="disabledButton"
                @click="() => {
                  setEditData(row)
                }"
                prepend-icon="mdi-square-edit-outline"
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
  </section>
</template>
  
  <style lang="scss" scoped>
  .status-field-boxing-color-inactive {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    color: #ed2324;
    //color: white;
    font-size: 0.7rem;
  }

  .status-field-boxing-color-active {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border-radius: 5px;
    color: #27ae60;
    //color: white;
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
  
  <!-- <route lang="yaml">
    meta:
      requiresAuth: true
  </route> -->
