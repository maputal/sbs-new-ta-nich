<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/department-management/CustomEditDialog.vue'
import CustomTableGroup from '@/components/user-management/CustomTable.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import { useGroupManagementStore } from '@/store/useGroupManagementStore'
import axios from '@axios'


const store = useGlobalStore()

const route = useRoute()
const router = useRouter()
  
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

const groupManagementListStore = useGroupManagementStore()

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['No', 'Department', 'Sub Department', 'Categories', 'Max Handle Time', 'Action'])
const dataHeader = ref(['group_name'])
const editTableHeader = ref(['Group Name'])
const editDataHeader = ref(['group_name'])

// Only for development purposes
const group = ref([])
const group_name = ref({})
const groupNames = ref ([
  {
    no: 1,
    id: 99999991,
    group_name: 'Marketing',
  },
  {
    no: 2,
    id: 99999992,
    group_name: 'Supervisor',
  },
  {
    no: 3,
    id: 99999993,
    group_name: 'Finance and Accounting',
  },
  {
    no: 4,
    id: 99999994,
    group_name: 'Operation',
  },
  {
    no: 5,
    id: 99999995,
    group_name: 'Research and Development',
  },  
])

const tableData = ref([])
const totalPage = ref(1)
const totalDepartment = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedGroups = ref([])

const editDialog = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)
const showProgressCircular = ref(true)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const isSuccess = ref({
  success: false,
  id: -1,
})

const tempFilter = ref({
  group_name: '',
})

const filter = ref({
  group_name: '',
})

const editTableData = ref({
  group_id: '',
  group_name: '',
})

const detailDialogProps = ref({
  headerNames: editTableHeader.value,
  dataNames: editDataHeader.value,
  row: {},
})

const editDialogProps = ref({
  data: {},
})

const deleteDepartment = ref('')

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  messageSubtitle: ['', ''],
  op: '',
  group_id: 0,
})

const successDialogProps = ref({
  subject: '',
})

const resetDialogProps = () => {
  // detailDialogProps.value.row = {}
  // editDialogProps.value.row = {}
  deleteDepartment.value = ''
  confirmDialogProps.value.confirmationStyling = ''
  confirmDialogProps.value.messageTitle = ''
  confirmDialogProps.value.messageSubtitle = ['', '']
  confirmDialogProps.value.op = ''
  confirmDialogProps.value.group_id = ''
  successDialogProps.value.subject = ''
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'update':
    updateDepartment()
    break
  case 'delete':
    modifyDepartment('4', deleteDepartment.value)
    break
  case 'activate':
    modifyDepartment('group_activate', confirmDialogProps.value.group_id)
    break
  case 'deactivate':
    modifyDepartment('group_deactivate', confirmDialogProps.value.group_id)
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
  editTableData.value.group_id = r.group_id
  editTableData.value.group_name = r.group_name
}

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e  
}

const removeDepartment = id => {
  editDialogProps.value.data.specific.issue.splice(id, 1)
}

const addItem = id => {
  editDialogProps.value.data.specific.issue.push('')
}

const fetchDepartment = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value, 
    search_filter: '',
  }
  // if (filter.value.group_name != '') {
  //   params.group_name = filter.value.group_name
  // }

  axios.post(urlBE.value + 'retrieve_ticket_units', params)
  .then(function (response) {
    console.log('response department list=', response);
    const responseData = response.data

    console.log('response')
    console.log(response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalDepartment.value = responseData.recordsTotal 

    showProgressCircular.value = false
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

  tableData.value = response.groups
  totalPage.value = response.page_total
  totalDepartment.value = response.totalDepartments
}

const updateDepartment = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    data: {
      unit_id: editDialogProps.value.data.unit_id,
      sub_unit_name: editDialogProps.value.data.sub_unit_name,
      specific_time: editDialogProps.value.data.specific.time,
      specific_issue: editDialogProps.value.data.specific.issue
    },
    op_crud: 3,
  }

  console.log('params updateDepartment', params)

  axios.post(urlBE.value + 'do_ticket_unit', params)
  .then(function (response) {
    console.log('response updateDepartment=', response);

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    showProgressCircular.value = false
    successDialog.value = true
  })
  .catch(function (error) {
    console.log('error di axios updateDepartment', error);
    onDataError(error)
  });
}

// user_delete, user_activate, user_deactivate
const modifyDepartment = (op, id) => {

  /////Note////////////
  // op_crud =
  // 1 -> insert/create
  // 2 -> read
  // 3 -> update
  // 4 -> delete

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    data: {
      unit_id: id
    },
    op_crud: Number(op),
  }

  console.log('params modifyDepartment', params)

  axios.post(urlBE.value + 'do_ticket_unit_crud', params)
  .then(function (response) {
    console.log('response department list=', response);
    const responseData = response.data

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

const onModifyDepartment = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.group_id

  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

watch(fetchDepartment)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalDepartment.value } entries`
})

const numberTable = ref(0)

const disabledButton = ref(true)

if (priv['update_group'] && priv['create_group'] || Object.keys(priv).length === 0) {
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
            View Department 
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-4">
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
          </p>
        </div>
      </div>
    </div>
    <!-- <VCard
      class="pa-5 mb-6"
    >
      <CustomFilter
        @filter="() => {
          filter.group_name = tempFilter.group_name
        }"
      >
        <VRow class="align-center">
          <span class="text-black font-weight-bold mx-4">Group</span>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="tempFilter.group_name"
              focused
              @keydown.enter.prevent 
              @keyup.enter="filter.group_name = tempFilter.group_name"
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
      <CustomTableGroup
        :tableHeaderNames="tableHeader" 
        :tableDataLength="tableData.length"
      >
        <template #tableBody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="bg-hover"
          >
            <td class="text-center text-black">
              {{ numberTable + index }}
            </td>
            <td class="text-black pl-6">
              {{ row.unit_name }}
            </td>
            <td class="text-black pl-6">
              {{ row.sub_unit_name }}
            </td>
            <td class="text-black pl-6">
              <div               
                v-for="(data, index1) in row.specific.issue"
                :key="index1"
              >
                {{ 1 + index1 }}. {{ data }}
              </div>
            </td>
            <td class="text-center text-black">
              {{ row.specific.time }}
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
                    // setEditData(row)
                    confirmDialogProps.confirmationStyling = '2'
                    confirmDialogProps.messageTitle = 'Are you sure you want to delete this?'
                    confirmDialogProps.messageSubtitle = ['', '']
                    confirmDialogProps.op = 'delete'
                    deleteDepartment = row.unit_id
                    successDialogProps.subject = 'department deletion'
                    confirmDialog = true
                  }"
                >
                  Delete
                </VBtn>
              </div>
            </td>
          </tr>
        </template>
      </CustomTableGroup>
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
          @next="selectedGroups = []"
          @prev="selectedGroups = []"
        />
      </VCardText>
    </VCard>
    <CustomEditDialog
      v-model:is-dialog-visible="editDialog"
      rounded="lg"
      width="60%"
      title="Edit Department Management"
      :dataDepartment="editDialogProps.data"
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
      @removeDepartment="data => {
        removeDepartment(data)
      }"
      @cancel="() => {
        editDialog = false
        fetchDepartment()
      }"
      @addItem="() => {
        addItem()
      }"
    />
    <CustomConfirmDialog
      v-model:is-dialog-visible="confirmDialog"
      rounded="lg"
      width="auto"
      :confirmation-styling="confirmDialogProps.confirmationStyling"
      :message-title="confirmDialogProps.messageTitle"
      :message-subtitle="confirmDialogProps.messageSubtitle"      
      @yes="
        chooseOP
        // successDialog = true
      "
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="() => {
        editDialog = false
        resetDialogProps()
        fetchDepartment()
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
    padding: 0.1rem;
    border-radius: 5px;
    background-color: #4d4d4f;
    color: white;
    font-size: 0.6rem;
  }

  .status-field-boxing-color-active {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    border-radius: 5px;
    background-color: #ed2324;
    color: white;
    font-size: 0.6rem;
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
