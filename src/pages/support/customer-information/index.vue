<script setup>
import { useGlobalStore } from '@/store/useGlobalStore'
import axios from '@axios'
//ana
const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toAddContact = () => {
  router.push('/customer-management/create-contact/' + selectedCustomer.value)
}

const todayDate = ref('')

const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

const days = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

const todayDateF = () => {
  let today = new Date()
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date = dd < 10 ? '0' + dd : dd

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

const toDateDMY = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  let date =
      dd < 10 ? '0' + dd : dd
  
  return (
    date +
    ' ' +
    months[month] +
    ' ' +
    year+
    ' ' +
    hours + 
    ':' + 
    minutes+ 
    ':' + 
    seconds
  )
}


const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))
//ana
const tableHeader = ref(['Contact ID', 'Name'])
const dataHeader = ref(['contact_id', 'contact_name'])

const tableData = ref([])
const totalPage = ref(1)
const totalContact = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const selectedCustomer = ref([])
const showProgressCircular = ref(false)

const projectTitle = ref('')
//cek na

const tempFilter = ref({
  search: null,
})

const filter = ref({
  search: '',
})

const customerData = ref([])

//cek ana
const loadCustomerDropdown = () => {
  const params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: 100,
    current_page: 1,
    search_filter: '',
  }

  axios.post(urlBE.value + 'retrieve_customers', params)
    .then(response => {
      if (response.data.error_code) {
        onDataError(response.data)
        return
      }

      customerData.value = response.data.data

      // Ambil langsung dari window.moffas.config
      if (window.moffas.config.project_title?.toLowerCase() === 'danareksa') {
        const bridsCustomer = customerData.value.find(c => c.name.toLowerCase() === 'brids')
        if (bridsCustomer) {
          selectedCustomer.value = bridsCustomer.customer_id
          fetchContacts()
        }
      }
    })
    .catch(error => {
      console.error('Error loadCustomerDropdown:', error)
      onDataError(error.response)
    })
}



const setEditData = r => {
  editTableData.value.contact_id = r.contact_id
  editTableData.value.nip = r.nip
  editTableData.value.contact_name = r.contact_name
  editTableData.value.email = r.email
  editTableData.value.phone_number = r.phone_number
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
    search_filter: filter.value.search || '', 
    data : {
      customer_id : selectedCustomer.value,
    }
  }

  //console.log('Request Parameters:', params); // cek params

  if(!selectedCustomer.value) return

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
      {"contact_type":'Email',"contact_value":"ikhsan@gmail.com"},
      {"contact_type":'Nomor Telepon',"contact_value":"6289655123482"},
    ],
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

const fetchContactDetails = () => {
  console.log('apakah ini dummymoffasdofetchContactDetails? ')

  let params = {
    group_id: Number(route.params.id),
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }

  console.log('params', params)

  console.log('apakah ini route.params.id? ')
  console.log(route.params.id)

  if (filter.value.contact_name != '') {
    params.contact_name = filter.value.contact_name
  }

  // window.moffas.do_request dummymoffasdofetchContactDetails
  dummymoffasdofetchContactDetails(
    'contact_detail_get_all',
    params, 
    onFetchContactDetails,
    onDataError,
  )
}

const onFetchContactDetails = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  contactDetailsData.value = response.contact_detail
  editDialog.value = true
}

const updateContact = () => {
  console.log('kalo ini updateContact')

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

  projectTitle.value = moffas.config.project_title || ''

  // Console log untuk cek status setelah fetch
  console.log("Finished fetching customers.");
  loadCustomerDropdown();
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
        Customer Interaction
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Customer Information
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
    <VCard>
      <VCardText class="d-flex flex-row align-center text-black font-weight-bold row2 pr-11">
        <div v-if="projectTitle !== 'danareksa'" class="d-flex align-center gap-3">
          <span class="text-black font-weight-bold">Customer</span>
          <VSelect
            v-model="selectedCustomer"
            :items="customerData"
            item-title="name"
            item-value="customer_id"
            density="compact"
            class="rounded"
            variant="outlined"
            hide-details
            style="min-width: 200px"
          />
        </div>
        <VSpacer />
        <VBtn
          class="text-none px-4"
          rounded="lg"
          prepend-icon="mdi-plus"
          variant="flat"
          @click="toAddContact"
        >
          Add New Contact
        </VBtn>
      </VCardText>
      <VCardText class="d-flex flex-row align-center text-black font-weight-bold row2">
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
        <VSpacer />
        <span class="text-black font-weight-bold mx-2">Search: </span>
        <VCol class="d-flex">
          <VTextField
            v-model="tempFilter.search"
            cols="12"
            class="mr-2"
            focused
            density="compact"            
            placeholder="Name"
            @keydown.enter.prevent
            @keyup.enter="filter.search = tempFilter.search"
            clearable
          />
          <VBtn
            variant="text"
            icon="mdi-magnify"
            color="red-lighten-2"
            @click="() => {
              filter.search = tempFilter.search
            }"
          />
        </VCol>
      </VCardText>
      <VTable class="text-no-wrap" style="border-radius: 0;">
        <thead>
          <tr>
            <th class="th-background-color">
              <span class="th-span-no-border d-flex justify-center">Contact ID</span>
            </th>
            <th class="th-background-color">
              <span class="th-span-border d-flex justify-center">Name</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" class="bg-hover">
            <td class="text-black">
              <RouterLink
                class="text-black pl-3"
                :to="'/support/customer/' + selectedCustomer + '?contact_id=' + row.contact_id"
              >
                {{ row.contact_id }}
              </RouterLink>  
            </td>
            <td class="text-black">
              <RouterLink
                class="text-black pl-3"
                :to="'/support/customer/' + selectedCustomer + '?contact_id=' + row.contact_id"
              >
                {{ row.contact_name }}
              </RouterLink> 
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!tableData.length">
          <tr>
            <td class="text-center text-body-1" :colspan="tableHeader.length">
              <div v-if="!showProgressCircular">No Data Available</div>
              <div v-if="showProgressCircular">
                <VProgressCircular :size="40" color="primary" indeterminate />
              </div>
            </td>
          </tr>
        </tfoot>
      </VTable>
      <VDivider />
      <VCardText class="d-flex align-center font-weight-bold text-black">
        <span>{{ paginationData }}</span>
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
    <VDialog v-model="showProgressCircular" persistent>
      <div class="text-center">
        <VProgressCircular color="primary" indeterminate :size="50" :width="10" />
      </div>
    </VDialog>
  </section>
</template>

<style lang="scss" scoped>
  .pagination-select {
    padding-inline-start: 0.625rem;
    .v-field__input,
    .v-field__append-inner {
      padding: 0.3rem;
    }
  }

  .th {
    position: relative;
  }

  .th-background-color {
    background-color: #f9fafc;
  }

  .th-span-border {
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-border-row-count {
    padding: 0;
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-no-border {
    color: black;
    padding-inline-start: 4px;
  }

  .bg-hover:hover {
    background-color: rgba(68, 73, 74, 5%);
  }
</style>

<route lang="yaml">
  meta:
    requiresAuth: true
</route>
