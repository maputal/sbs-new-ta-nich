<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/group-management/CustomEditDialogGroup.vue'
import CustomTableGroup from '@/components/group-management/CustomTableGroup.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import { useGroupManagementStore } from '@/store/useGroupManagementStore'


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

const tableHeader = ref(['Group Name', 'Status', 'Action'])
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
const totalGroup = ref(0)

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
  editProps: [
    {
      headerName: 'Group Name',
      dataName: 'group_name',
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
  group_id: 0,
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
    updateGroup()
    break
  case 'delete':
    modifyGroup('group_delete', confirmDialogProps.value.group_id)
    break
  case 'activate':
    modifyGroup('group_activate', confirmDialogProps.value.group_id)
    break
  case 'deactivate':
    modifyGroup('group_deactivate', confirmDialogProps.value.group_id)
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
  isErrorVisible.value = true
  customErrorMessages.value = e  
}

const fetchGroups = () => {
  let params = {
    perPage: rowPerPage.value,
    currentPage: currentPage.value    
  }
  if (filter.value.group_name != '') {
    params.group_name = filter.value.group_name
  }

  window.moffas.do_request(
    'group_get_all',
    params, 
    onFetchGroups,
    onDataError,
  )
}

const onFetchGroups = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.groups
  totalPage.value = response.totalPage
  totalGroup.value = response.totalGroups
}

const updateGroup = () => {

  const params = {
    group_id: editTableData.value.group_id,
    group_name: editTableData.value.group_name,
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
    group_id: id,
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
  isSuccess.value.id = response.group_id

  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

watch(fetchGroups)

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
}) 

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalGroup.value } entries`
})

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
        Group Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            View Group 
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
                <span class="d-flex justify-space-around ma-2">
                  <span 
                    class="w-50"
                    :class="{'status-field-boxing-color-active': row['st'] == 1, 'status-field-boxing-color-inactive': row['st'] == 0}"
                  >
                    {{ isActive(row['st']) }}
                  </span>
                </span>
              </div>                
            </td>
            <td>
              <div class="text-center">
                <RouterLink
                  :to="'/group-management/view-details/' + row.group_id"
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
        confirmDialogProps.group_id = editDialogProps.row['group_id']
        successDialogProps.subject = 'actived account'
        confirmDialog = true
      }"
      @deactivated="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to deactivated account'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to deactivated account?', 'This account cannot be undone.']
        confirmDialogProps.op = 'deactivate'
        confirmDialogProps.group_id = editDialogProps.row['group_id']
        successDialogProps.subject = 'deactived account'
        confirmDialog = true
      }"
      @save="data => {
        editTableData.group_name = data.group_name
        editTableData.group_id = data.group_id
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        confirmDialogProps.group_name = editDialogProps.row['group_id']
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
        fetchGroups()
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
