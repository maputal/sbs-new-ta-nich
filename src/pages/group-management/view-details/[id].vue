<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/group-management/CustomEditDialogContact.vue'
import CustomTable from '@/components/group-management/CustomTableGroupContact.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import { useGroupManagementStore } from '@/store/useGroupManagementStore'
import { watchEffect } from 'vue'

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toAddContact = () => {
  router.replace('/group-management/create-contact/' + Number(route.params.id))
}

const toGroupViewAll = () => {
  router.replace('/group-management/view-all/')
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
  12:'December', 
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

const userManagementListStore = useGroupManagementStore()

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['Name', 'NIP', 'Email', 'Phone Number', 'Action'])
const dataHeader = ref(['contact_name', 'nip', 'email', 'phone_number'])

const tableData = ref([])
const totalPage = ref(1)
const totalContact = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])

const editDialog = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)

const contact = ref([])

const isSuccess = ref({
  success: false,
  contact_id: -1,
  contact_name: -1,
  group_name: -1,
})

const tempFilter = ref({
  contact_name: '',
})

const filter = ref({
  contact_name: '',
})

const editTableData = ref({
  contact_id: '',
  nip: '',
  contact_name: '',
  email: '',
  phone_number: '',
})

const addTableData = ref([])

const editDialogProps = ref({
  editProps: [
    {
      headerName: 'Name',
      dataName: 'contact_name',
      inputType: 'text-field',
    },
    {
      headerName: 'NIP',
      dataName: 'nip',
      inputType: 'text-field',
    },
    {
      headerName: 'Email',
      dataName: 'email',
      inputType: 'text-field',
    },
    {
      headerName: 'Phone Number',
      dataName: 'phone_number',
      inputType: 'text-field',
    },
  ],
  formRequired: ['Name', 'Email', 'Phone Number'],
  row: {},
})

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  messageSubtitle: ['', ''],
  op: '',
  contact_id: '',
})

const successDialogProps = ref({
  subject: '',
})

const resetDialogProps = () => {
  editDialogProps.value.row = {}
  confirmDialogProps.value.confirmationStyling = ''
  confirmDialogProps.value.messageTitle = ''
  confirmDialogProps.value.messageSubtitle = ['', '']
  confirmDialogProps.value.op = ''
  confirmDialogProps.value.contact_id = ''
  successDialogProps.value.subject = ''
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv
const disabledButton = ref(true)

if (priv['update_group'] && priv['create_group'] || Object.keys(priv).length === 0) {
  disabledButton.value = false
}

console.log("---------- hasil priv=", priv)

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'update':
    updateContact()
    break
    
  case 'add':
    createContact()
    break
  case 'delete':
    modifyContact('contact_delete', confirmDialogProps.value.contact_id)
    break
  case 'activate':
    modifyContact('contact_activate', confirmDialogProps.value.contact_id)
    break
  case 'deactivate':
    modifyContact('contact_deactivate', confirmDialogProps.value.contact_id)
    break  
  default:
    break
  }
}

const getGroup = () => {
  console.log('getGroup')

  const params = {
    group_id: Number(route.params.id),
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }

  console.log('params')
  console.log(params)

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

  addTableData.value = response.groups
}

const setEditData = r => {
  editTableData.value.contact_id = r.contact_id
  editTableData.value.nip = r.nip
  editTableData.value.contact_name = r.contact_name
  editTableData.value.email = r.email
  editTableData.value.phone_number = r.phone_number
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
    totalRow.value = response.data.totalRow
  }).catch(error => {
    console.log("error",error)
  })
}

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e 
}

const fetchContacts = () => {
  console.log('apakah ini fetchContacts? ')
  console.log(fetchContacts)

  let params = {
    group_id: Number(route.params.id),
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }

  console.log('apakah ini params? ')
  console.log(params) 

  console.log('apakah ini route.params.id? ')
  console.log(route.params.id)

  if (filter.value.contact_name != '') {
    params.contact_name = filter.value.contact_name
  }

  window.moffas.do_request(
    'contact_get_all',
    params, 
    onFetchContacts,
    onDataError,
  )
}

const onFetchContacts = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.contacts
  totalPage.value = response.totalPage
  totalContact.value = response.totalContacts
}

const updateContact = () => {
  console.log('kalo ini updateContact')
  console.log(updateContact)

  const params = {
    contact_id: editTableData.value.contact_id,
    contact_name: editTableData.value.contact_name,
    nip: editTableData.value.nip,    
    email: editTableData.value.email,
    phone_number: editTableData.value.phone_number
  }

  window.moffas.do_request(
    'contact_update',
    params, 
    onModifyContact,
    onDataError,
  )
}

// user_delete, user_activate, user_deactivate
const modifyContact = (op, id) => {
  console.log(op)

  const params = {
    contact_id: id,
  }

  window.moffas.do_request(
    op,
    params, 
    onModifyContact,
    onDataError,
  )
}

const onModifyContact = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.contact_id

  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

watch(fetchContacts)

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})


// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalContact.value } entries`
})

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()

  // 👉 Fetch getGroup 
  getGroup()
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
        Contact Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <VChip
            v-if="addTableData[0]"
            label
            color="error"
            text-color="white"
            size="large"
            class="text-capitalize font-weight-bold me-5"
          >
            {{ addTableData[0].group_name }}
          </VChip>
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
    <VCard
      class="pa-5 mb-6"
    >
      <CustomFilter
        @filter="() => {
          filter.contact_name = tempFilter.contact_name
        }"
      >
        <VRow class="align-center">
          <span class="text-black font-weight-bold mx-4">Contact</span>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="tempFilter.contact_name"
              focused
              @keydown.enter.prevent 
              @keyup.enter="filter.contact_name = tempFilter.contact_name"
            />
          </VCol>
        </VRow>
      </CustomFilter>
    </VCard>
    <VCard>
      <VCardText 
        class="d-flex flex-row align-center text-black font-weight-bold row2"
      >
        <v-btn 
          class="mr-5"
          icon="mdi-arrow-left"
          @click="toGroupViewAll"
        ></v-btn>
        <span class="me-3">Show</span>
        <div>
          <VSelect
            v-model="rowPerPage"
            class="pagination-select rounded"
            density="compact"
            :items="[10, 20, 30, 50]"
          />
        </div>
        <span class="ms-3">entries</span>
        <VSpacer />
        <VBtn   
          v-if="addTableData[0] && addTableData[0].st == 1 && priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
          class="text-none px-4"
          rounded="lg"
          prepend-icon="mdi-plus"
          variant="flat"
          @click="toAddContact"
        >
          Add New Contact 
        </VBtn>
      </VCardText>
      
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
            <td
              v-for="(data, index1) in dataHeader"
              :key="index1"
              class="text-center"
            >
              <span class="text-black">
                {{ row[data] }}
              </span>
            </td>
            <td
              class="text-center"
            >
            <VBtn
                v-if="addTableData[0] && addTableData[0].st == 1"
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
    <CustomEditDialog
      v-model:is-dialog-visible="editDialog"
      rounded="lg"
      width="50%"
      title="Edit Contact Management"
      :edit-props="editDialogProps.editProps"
      :group-data="editTableData"
      :form-required="editDialogProps.formRequired"
      :row="editDialogProps.row"
      :priv="priv"
      @delete="() => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to delete contact'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to delete this contact?', 'This account cannot be undone.']
        confirmDialogProps.op = 'delete'
        confirmDialogProps.contact_id = editDialogProps.row['contact_id']
        successDialogProps.subject = 'delete'
        confirmDialog = true
      }"
      @save="data => {
        editTableData.contact_id = data.contact_id
        editTableData.nip = data.nip
        editTableData.email = data.email
        editTableData.contact_name = data.contact_name
        editTableData.phone_number = data.phone_number
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        confirmDialogProps.contact_id = editDialogProps.row['contact_id']
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
      @yes="chooseOP"
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="() => {
        editDialog = false
        resetDialogProps()
        fetchContacts()
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
