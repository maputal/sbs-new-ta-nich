<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import CustomEditDialog from '@/components/customer-management/CustomEditDialogContact.vue'
import CustomTable from '@/components/group-management/CustomTableGroupContact.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import axios from '@axios'
import { watchEffect } from 'vue'

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toAddContact = () => {
  router.replace('/customer-management/create-contact/' + route.params.id)
}

const toCustomerViewAll = () => {
  router.replace('/customer-management/view-all/')
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

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const projectTitle = ref('')
const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const tableHeader = ref(['Contact ID', 'Name', 'Action'])
const dataHeader = ref(['contact_id', 'contact_name'])

const tableData = ref([])
const totalPage = ref(1)
const totalContact = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])

const editDialog = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)
const showProgressCircular = ref(false)

const contactDetailsData = ref([])
const contactDetailsDataStore = ref([])

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
  contact_name: '',
})

const customerData = ref([])

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
  data: {},
})

const successDialogProps = ref({
  subject: '',
})

const resetDialogProps = () => {
  // editDialogProps.value.row = {}
  confirmDialogProps.value.confirmationStyling = ''
  confirmDialogProps.value.messageTitle = ''
  confirmDialogProps.value.messageSubtitle = ['', '']
  confirmDialogProps.value.op = ''
  confirmDialogProps.value.contact_id = ''
  confirmDialogProps.value.data = {}
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
    updateContactAndDetail()
    break    
  case 'add':
    createContact()
    break
  case 'delete':
    deleteContactDetail()
    // modifyContact('contact_delete', confirmDialogProps.value.contact_id)
    break
  default:
    break
  }
}

const fetchCustomers = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 2,
    data: {
      customer_id: route.params.id,
      customer_name: '',
      description: '',
    }
  }

  console.log('params di fetchCustomers', params)

  axios.post(urlBE.value + 'do_customer', params)
  .then(function (response) {
    console.log('response fetchCustomers=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    customerData.value = responseData.data
    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const setEditData = r => {
  editTableData.value.contact_id = r.contact_id
  editTableData.value.contact_name = r.contact_name
}

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e 
}

function dummymoffasdofetchContacts (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    "contacts":[
      {"contact_id":39,"contact_name":"Ikhsan","group_id":15,"st":1,"nip":"","email":"ikhsan@gmail.com","phone_number":"6289655123482"},
      {"contact_id":45,"contact_name":"Nindy Puspita Dewi","group_id":15,"st":1,"nip":"","email":"nindypuspitad@gmail.com","phone_number":"62895366875783"},
      {"contact_id":37,"contact_name":"adi pandey","group_id":15,"st":1,"nip":"","email":"adi@gmail.com","phone_number":"6281237615158"},
      {"contact_id":35,"contact_name":"lisa","group_id":15,"st":1,"nip":"","email":"lisa@gmail.com","phone_number":"6281210028232"},
      {"contact_id":36,"contact_name":"satria","group_id":15,"st":1,"nip":"","email":"satria@gmail.com","phone_number":"6287710635667"},
      {"contact_id":47,"contact_name":"yaya","group_id":15,"st":1,"nip":"1101154431","email":"ffitya@gmail.com","phone_number":"8327e67"}
    ],
    "totalContacts":6,
    "totalPage":1
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

const fetchContacts = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value, 
    search_filter: filter.value.contact_name || '', 
    data:{
      customer_id: route.params.id
    }   
  }

  axios.post(urlBE.value + 'retrieve_contacts', params)
  .then(function (response) {
    console.log('response fetchContacts=', response)
    const responseData = response.data

    console.log('response', response)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalContact.value = responseData.recordsTotal 

    // showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

function dummymoffasdofetchContactDetails (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    "contact_detail":[
      {"contact_type":'email',"contact_value":"ikhsan@gmail.com"},
      {"contact_type":'phone_number',"contact_value":"6289655123482"},
    ],
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

const fetchContactDetails = () => {
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    current_page: 1,
    row_length: 100,
    search_filter: '',
    data: {
      customer_id: route.params.id,
      contact_id: editTableData.value.contact_id,
    }
  }

  console.log('params di fetchContactDetails', params)

  axios.post(urlBE.value + 'retrieve_contact_details', params)
  .then(function (response) {
    console.log('response fetchContactDetails=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    contactDetailsData.value = responseData.data
    contactDetailsDataStore.value = JSON.parse(JSON.stringify(responseData.data))

    console.log('contactDetailsData.value=', contactDetailsData.value)
    console.log('contactDetailsDataStore.value di fetchContactDetails=', contactDetailsDataStore.value)
    editDialog.value = true
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const createContactDetail = (data, ID) => {
  console.log('data=', data)
  console.log('ID=', ID)
  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 1,
    data: {
      customer_id: route.params.id,
      contact_id: ID,
      contact_type: data.channelType,
      contact_value: data.contactValue,
      data: {}
    }
  }

  console.log('params di createContactDetail', params)

  axios.post(urlBE.value + 'do_contact_detail', params)
  .then(function (response) {
    console.log('response createContactDetail=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    // successDialogProps.value.subject = 'submit'
    // successDialog.value = true
    // confirmationDialog.value = false
    showProgressCircular.value = false
    fetchContactDetails()
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const updateContactAndDetail = () => {
  console.log('masuk updateContactAndDetail')
  console.log('contactDetailsData.value updateContactAndDetail', contactDetailsData.value)
  console.log('contactDetailsDataStore.value updateContactAndDetail', contactDetailsDataStore.value)
  showProgressCircular.value = true

  let filterContactDetail = contactDetailsData.value.filter(dataA => {
    const filterContactType = contactDetailsDataStore.value.find(a => a.contact_type === dataA.contact_type)
    console.log('filterContactType=', filterContactType)
    // include if not found in filterContactType, or value is different
    return !filterContactType || filterContactType.contact_value !== dataA.contact_value
  })  

  let newFields = filterContactDetail.map((a) => a.contact_type)
  console.log('newFields=', newFields)

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 3,
    data: {
      customer_id: route.params.id,
      contact_id: editTableData.value.contact_id,
      contact_name: editTableData.value.contact_name || "",
      contact_details:filterContactDetail,
      data: {
        fields: newFields
      }
    }
  }

  console.log('params di updateContactAndDetail', params)

  axios.post(urlBE.value + 'create_contact', params)
  .then(function (response) {
    console.log('response updateContactAndDetail=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    successDialog.value = true
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
}

const deleteContactDetail = () => {
  console.log('confirmDialogProps.value.data di deleteContactDetail', confirmDialogProps.value.data)
  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 4,
    data: {
      customer_id: route.params.id,
      contact_id: confirmDialogProps.value.data.contact_id,
      contact_type: confirmDialogProps.value.data.contact_type,
      contact_value: confirmDialogProps.value.data.contact_value,
      data: {}
    }
  }

  console.log('params di deleteContactDetail', params)

  axios.post(urlBE.value + 'do_contact_detail', params)
  .then(function (response) {
    console.log('response deleteContactDetail=', response)

    const responseData = response.data
    console.log('responseData', responseData)

    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    showProgressCircular.value = false
    fetchContactDetails()
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  })
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

  projectTitle.value = moffas.config.project_title || ''

  fetchCustomers()
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
            v-if="customerData[0]"
            label
            color="primary"
            text-color="white"
            size="large"
            class="text-capitalize font-weight-bold me-5"
          >
            {{ customerData[0].name }}
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
              placeholder="Name"
              @keydown.enter.prevent 
              @keyup.enter="filter.contact_name = tempFilter.contact_name"
              clearable
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
          @click="toCustomerViewAll"
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
          v-if="customerData[0] && customerData[0].st == 1 && priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0"
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
              class=""
            >
              <span class="text-black pl-5">
                {{ row[data] }}
              </span>
            </td>
            <td
              class="text-center"
            >
              <VBtn
                class="text-none ma-2"
                density="compact"
                size="small"
                color="#32BCAD"
                :disabled="disabledButton"
                @click="() => {
                  setEditData(row)
                  fetchContactDetails()
                }"
              >
                Detail
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

    <CustomEditDialog
      v-model:is-dialog-visible="editDialog"
      rounded="lg"
      width="50%"
      title="Contact Detail"
      :contact-data="editTableData"
      :priv="priv"
      :project-title="projectTitle"
      :contact-details="contactDetailsData"
      :contact-details-store="contactDetailsDataStore"
      @add-new-contact-detail="(dataA, dataID) => {
        createContactDetail(dataA, dataID)
      }"
      @delete-contact-detail="(data) => {
        confirmDialogProps.confirmationStyling = '1'
        confirmDialogProps.messageTitle = 'You are about to delete this contact detail'
        confirmDialogProps.messageSubtitle = ['Are you sure you want to delete this contact detail?', 'This contact cannot be undone']
        confirmDialogProps.op = 'delete'
        confirmDialogProps.data = data
        successDialogProps.subject = 'delete'
        confirmDialog = true
      }"
      @save="(data, dataDetail) => {
        editTableData.contact_id = data.contact_id
        editTableData.contact_name = data.contact_name
        confirmDialogProps.confirmationStyling = '2'
        confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
        confirmDialogProps.messageSubtitle = ['', '']
        confirmDialogProps.op = 'update'
        // confirmDialogProps.contact_id = editDialogProps.row['contact_id']
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
