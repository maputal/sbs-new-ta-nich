<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomTableGroup from '@/components/customer-management/CustomTableGroup.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/group-management/CustomEditDialogGroup.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
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

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['Customer ID', 'Customer Name', 'Description', 'Action'])
const dataHeader = ref(['customer_id', 'name', 'description'])
const editTableHeader = ref(['Customer Name'])
const editDataHeader = ref(['customer_name'])

const projectTitle = ref('')

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const tableData = ref([])
const totalPage = ref(1)
const totalCustomer = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedGroups = ref([])

const editDialog = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)


const isSuccess = ref({
  success: false,
  id: -1,
})

const tempFilter = ref({
  customer_name: '',
})

const filter = ref({
  customer_name: '',
})

const editTableData = ref({
  customer_id: '',
  customer_name: '',
})

const detailDialogProps = ref({
  headerNames: editTableHeader.value,
  dataNames: editDataHeader.value,
  row: {},
})

const editDialogProps = ref({
  editProps: [
    {
      headerName: 'Group Name',
      dataName: 'customer_name',
      inputType: 'text-field',
    },
  ],
  formRequired: ['Group Name'],
  row: {},
})

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  messageSubtitle: ['', ''],
  op: '',
  customer_id: 0,
})

const successDialogProps = ref({
  subject: '',
})

const resetDialogProps = () => {
  detailDialogProps.value.row = {}
  editDialogProps.value.row = {}
  confirmDialogProps.value.confirmationStyling = ''
  confirmDialogProps.value.messageTitle = ''
  confirmDialogProps.value.messageSubtitle = ['', '']
  confirmDialogProps.value.op = ''
  confirmDialogProps.value.customer_id = ''
  successDialogProps.value.subject = ''
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'update':
    updateGroup()
    break
  case 'delete':
    modifyGroup('group_delete', confirmDialogProps.value.customer_id)
    break
  case 'activate':
    modifyGroup('group_activate', confirmDialogProps.value.customer_id)
    break
  case 'deactivate':
    modifyGroup('group_deactivate', confirmDialogProps.value.customer_id)
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
  editTableData.value.customer_id = r.customer_id
  editTableData.value.customer_name = r.customer_name
}

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e  
}

const fetchCustomers = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value, 
    search_filter: filter.value.customer_name || '',  
  }

  console.log('params di fetchCustomers=', params)

  axios.post(urlBE.value + 'retrieve_customers', params)
  .then(function (response) {
    console.log('response fetchCustomers=', response)
    const responseData = response.data

    console.log('response', response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalCustomer.value = responseData.recordsTotal 

    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const updateGroup = () => {

  const params = {
    customer_id: editTableData.value.customer_id,
    customer_name: editTableData.value.customer_name,
  }

  window.moffas.do_request(
    'group_update',
    params, 
    onModifyGroup,
    onDataError,
  )
}

// user_delete, user_activate, user_deactivate
const modifyGroup = (op, id) => {

  const params = {
    customer_id: id,
  }

  window.moffas.do_request(
    op,
    params, 
    onModifyGroup,
    onDataError,
  )
}

const onModifyGroup = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.customer_id

  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

watch(fetchCustomers)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalCustomer.value } entries`
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

  projectTitle.value = moffas.config.project_title || ''
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
        Customer Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            View Customer 
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
          filter.customer_name = tempFilter.customer_name
        }"
      >
        <VRow class="align-center">
          <span class="text-black font-weight-bold mx-4">Group</span>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="tempFilter.customer_name"
              focused
              @keydown.enter.prevent 
              @keyup.enter="filter.customer_name = tempFilter.customer_name"
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
        <VSpacer />
        <VSpacer />
        <span class="text-black font-weight-bold mx-2">Search: </span>
        <VCol
          class="d-flex"
        >
          <VTextField
            v-model="tempFilter.customer_name"
            cols="12"
            class="mr-2"
            placeholder="Customer Name"
            density="compact"
            focused
            @keydown.enter.prevent 
            @keyup.enter="filter.customer_name = tempFilter.customer_name"
            clearable
          />
          <VBtn
            variant="text"
            icon="mdi-magnify"
            color="red-lighten-2"
            @click="() => {
              filter.customer_name = tempFilter.customer_name
            }"
          />            
        </VCol>
      </VCardText>
      <VSpacer />
      <CustomTableGroup
        :tableHeaderNames="tableHeader" 
        :tableDataLength="tableData.length"
        :project="projectTitle"
      >
        <template #tableBody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="bg-hover"
          >
            <td
              v-for="(data, index1) in dataHeader"
              :key="index1"
              class="text-left pl-16"
            >
              <span class="text-black">
                {{ row[data] }}
              </span>
            </td>
            <td>
              <div class="text-center">
                <RouterLink
                  :to="'/customer-management/view-details/' + row.customer_id"
                >
                  <VBtn
                    class="text-none text-white ma-2"
                    density="compact"
                    size="small"
                    color="#32BCAD"
                  >
                    Detail
                  </VBtn>
                </RouterLink>                
                <!-- <VBtn
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
                </VBtn> -->
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
      width="40%"
      title="Edit Group Management"
      :editProps="editDialogProps.editProps"
      :groupData="editTableData"
      :formRequired="editDialogProps.formRequired"
      :row="editDialogProps.row"
      :priv="priv"
      @activate="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to activated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to activated account?', 'This account cannot be undone.']
        confirmDialogProps.op = 'activate'
        confirmDialogProps.customer_id = editDialogProps.row['customer_id']
        successDialogProps.subject = 'actived account'
        confirmDialog = true
      }"
      @deactivated="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to deactivated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to deactivated account?', 'This account cannot be undone.']
        confirmDialogProps.op = 'deactivate'
        confirmDialogProps.customer_id = editDialogProps.row['customer_id']
        successDialogProps.subject = 'deactived account'
        confirmDialog = true
      }"
      @save="data => {
        editTableData.customer_name = data.customer_name
        editTableData.customer_id = data.customer_id
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        confirmDialogProps.customer_name = editDialogProps.row['customer_id']
        successDialogProps.subject = 'submit'
        confirmDialog = true
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
        fetchCustomers()
      }"
    />
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
