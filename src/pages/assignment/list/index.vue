<script setup>
import CustomAssignHistoryListDialog from '@/components/re-assignment/CustomAssignmentHistoryListDialog.vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import axios from '@axios';

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

const toDateDMY = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  let date = dd < 10 ? '0' + dd : dd
  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  let formattedSeconds = seconds < 10 ? '0' + seconds : seconds
  
  return (
    date +
    ' ' +
    months[month] +
    ' ' +
    year+
    ' ' +
    hours + 
    ':' + 
    formattedMinutes+ 
    ':' + 
    formattedSeconds
  )
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['No', 'Ticket ID', 'Status', 'Phone Number', 'Create Time', 'Category', 'Description'])

const tableData = ref([])
const totalPage = ref(1)
const totalTicketAssignment = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const showProgressCircular = ref(true)

const tableHeaderHistoryList = ref(['No', 'Ticket ID', 'Ticket Date', 'Description', 'Assignee', 'Department', 'Assignor'])
const tableDataHistoryList = ref([])
const totalPageHistoryList = ref(1)
const totalTicketAssignmentHistoryList = ref(0)
const rowPerPageHistoryList = ref(10)
const currentPageHistoryList = ref(1)
const selectedRowsHistoryList = ref([])

const reAssignDialog = ref(false)
const assignHistoryDialog = ref(false)

const numberTableHistoryList = ref(0)

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const tempFilter = ref({
  search: '',
  phone_number: '',
})

const filter = ref({
  search: '',
  phone_number: '',
})

// Only for development purposes
function dummymoffasdoticketretrieves (params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    tickets : [
      {
        ticket_id: '13',
        customer_phone_number: '123456',
        name: 'Lisa',
        status: 'Closed',
        initiated_type: 'cis',
        category: 'marketing',
        priority: 'Low',
        user_name: 'diniagent',
        channel: "READ",
        description: "READ Dong",
        note: "apa kabar?",
        updated_tstamp: 1692001077,
        created_tstamp: 1691997372,
      },
      {
        ticket_id: '14',
        customer_phone_number: '78910',
        name: 'Satria',
        status: 'Closed',
        initiated_type: 'Bis',
        category: 'Marketing',
        priority: 'Low',
        user_name: 'diniagent',
        channel: "READ",
        description: "Kamu kenapa",
        note: "apa kabar?",
        updated_tstamp: 1692001077,
        created_tstamp: 1691997372,
      },
      {
        ticket_id: '15',
        customer_phone_number: '123456',
        name: 'Fitya',
        status: 'Replied',
        initiated_type: 'cis',
        category: 'marketing',
        priority: 'Low',
        user_name: 'diniagent',
        channel: "READ",
        description: "ini apa",
        note: "apa kabar?",
        updated_tstamp: 1692001077,
        created_tstamp: 1691997372,
      },
      {
        ticket_id: '16',
        customer_phone_number: '123456',
        name: 'Gina',
        status: 'Responed',
        initiated_type: 'cis',
        category: 'marketing',
        priority: 'Low',
        user_name: 'diniagent',
        channel: "READ",
        description: "READ",
        note: "apa kabar?",
        updated_tstamp: 1692001077,
        created_tstamp: 1691997372,
      },
      {
        ticket_id: '17',
        customer_phone_number: '123456',
        name: 'Vicky',
        status: 'Awaiting Response',
        initiated_type: 'cis',
        category: 'marketing',
        priority: 'Low',
        user_name: 'diniagent',
        channel: "READ",
        description: "READ",
        note: "apa kabar?",
        updated_tstamp: 1692001077,
        created_tstamp: 1691997372,
      },
    ],
    total_pages : 1,
    total_rows : 5,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

/////////////////////////////////////////////////////////////
const storeTicketId = ticketId => {
  localStorage.setItem('ticket_id', ticketId)
}

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const fetchTicketAssignment = () => {
  console.log('fetchTicketAssignment')

  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value,    
  }

  if (filter.value.search != '') {
    params.search_filter = filter.value.search
  }

  console.log('param fetchTicketAssignment=', params)

  axios.post(urlBE.value + 'retrieve_ticket_assigments', params)
  .then(function (response) {
    console.log('response assignment history=', response);
    const responseData = response.data

    if(response.data.error_code) {
      showProgressCircular.value = false
      onDataError(response.data)

      return
    }

    tableData.value = responseData.data
    totalPage.value = responseData.page_total
    totalTicketAssignment.value = responseData.recordsTotal 

    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error);
    showProgressCircular.value = false
    onDataError(error)
  });

  // dummymoffasdoticketretrieves(
  //   params, 
  //   onfetchTicketAssignment, 
  //   onDataError,
  // )

  // window.moffas.do_request(
  //   'ticket_retrieves',
  //   params, 
  //   onfetchTicketAssignment,
  //   onDataError,
  // )
}

const onfetchTicketAssignment = data => {
  
  const response = JSON.parse(data)

  console.log('response')
  console.log(response)

  
  if (response.hasOwnProperty('trace_id')){
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.tickets
  totalPage.value = response.total_pages
  totalTicketAssignment.value = response.total_rows  

  showProgressCircular.value = false
}

const getTicketAssignmentHistoryList = (ticketID) => {
  console.log('getTicketAssignmentHistoryList')

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value, 
    row_length: rowPerPageHistoryList.value,
    current_page: currentPageHistoryList.value,
    search_filter: '',
    data: {
      ticket_id: ticketID
    }
  }

  console.log('params=', params)

  axios.post(urlBE.value + 'retrieve_ticket_assignments_history', params)
  .then(function (response) {
    console.log('response getTicketAssignmentHistoryList=', response)
    
    if(response.data.error_code) {
      onDataError(response.data)

      return
    }

    const responseData = response.data

    console.log('responseData digetTicketAssignmentHistoryList =', responseData)
    console.log('responseData.data digetTicketAssignmentHistoryList =', responseData.data)

    tableDataHistoryList.value = responseData.data
    totalPageHistoryList.value = responseData.page_total
    totalTicketAssignmentHistoryList.value = responseData.recordsTotal 

    assignHistoryDialog.value = true
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onDataError(error.response)
  });

  // window.moffas.do_request(
  //   'user_get_all',
  //   params, 
  //   onfetchStaff,
  //   onDataError,
  // )
}

// 👉 Fetch TicketAssignment
watch(fetchTicketAssignment)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalTicketAssignment.value } entries`
})

const numberTable = ref(0)

///////////////////////////////////////////////// Assignment History
watch(rowPerPageHistoryList, () => {
  console.log('masuk watch rowPerPage di parent=', rowPerPageHistoryList)
  getTicketAssignmentHistoryList()
})

watch(currentPageHistoryList, () => {
  console.log('masuk watch currentPageHistoryList di parent=', currentPageHistoryList)
  getTicketAssignmentHistoryList()
})

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPageHistoryList.value > totalPageHistoryList.value && totalPageHistoryList.value > 0)
  currentPageHistoryList.value = totalPageHistoryList.value
})

// 👉 Computing pagination data
const paginationDataHistoryList = computed(() => {
  const firstIndex = tableDataHistoryList.value.length > 0 ? (currentPageHistoryList.value - 1) * rowPerPageHistoryList.value + 1 : 0
  const lastIndex = tableDataHistoryList.value.length + (currentPageHistoryList.value - 1) * rowPerPageHistoryList.value
  
  numberTableHistoryList.value = firstIndex  

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalTicketAssignmentHistoryList.value } entries`
})

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
        Assignment
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <p class="mb-0 font-weight-medium">
            Assignment List
          </p>
        </div>
        <VSpacer />
        <div class="mb-4">
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
          </p>
        </div>
      </div>
    </div>
    <VCard>
      <VCardText 
        class="d-flex flex-row align-center text-black font-weight-bold row2"
      >
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
        <!-- <span class="text-black font-weight-bold mx-2">Search: </span>
        <VCol
          class="d-flex"
        >
          <VTextField
            v-model="tempFilter.search"
            cols="12"
            class="mr-2"
            focused
            density="compact"
            @keydown.enter.prevent 
            @keyup.enter="filter.search = tempFilter.search"
          />
          <VBtn
            variant="text"
            icon="mdi-magnify"
            color="red-lighten-2"
            @click="() => {
              filter.search = tempFilter.search
            }"
          />            
        </VCol> -->
      </VCardText>      
      <VTable
        style="border-radius: 0;"
      >
        <thead class="text-no-wrap">
          <tr>
            <th class=" th-background-color">
              <span
                class="th-span-no-border d-flex justify-center"
              > 
                No 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Ticket ID 
              </span>
            </th>      
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center px-8"
              > 
                Ticket Status 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center px-16"
              > 
                Description 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Assignee
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Department
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center px-8"
              > 
                Start Time
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border-row-count d-flex justify-center px-8"
              > 
                End Time
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Assignor
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="bg-hover"
            :class="{
              'to-red': row['is_due'] == 'Closed'
            }"
          >
            <td class="text-center text-black">
              {{ numberTable + index }}
            </td>
            <td class="text-black pl-7">
              {{ row.ticket_id }}
              <v-chip size="small">
                {{ toDateDMY(row.ticket_tstamp) }}
              </v-chip>
            </td>
            <td class="text-no-wrap pl-7">
              <div               
                :class="{
                  'status-field-color-grey': row['ticket_status'] == 'AWAITING RESPONSE', 
                  'status-field-color-red': row['ticket_status'] == 'CLOSED',
                  'status-field-color-blue': row['ticket_status'] == 'RESPONED',
                  'status-field-color-green': row['ticket_status'] == 'FOLLOW UP',
                }"
              >              
                <VIcon
                  icon="mdi-circle-medium"
                />              
                {{ row.ticket_status }}
              </div> 
            </td>
            <td class="text-black pl-7">
              {{ row.description }}
            </td>
            <td class="text-black pl-7">
              {{ row.name }}
            </td>
            <td class="text-black text-no-wrap pl-7">
              {{ row.unit_name }}
              <br>
              ({{ row.sub_unit_name }})
            </td>
            <td class="text-black pl-7">
              <div
                :class="{
                  'status-field-color-red': row['is_due'] == '1',
                  'status-field-color-yellow': row['is_due'] == '2',
                }"
              >
                {{ toDateDMY(row.start_time) }}   
              </div>
            </td>
            <td class="text-black pl-7">
              <div
                :class="{
                  'status-field-color-red': row['is_due'] == '1',
                  'status-field-color-yellow': row['is_due'] == '2',
                }"
              >
                {{ toDateDMY(row.end_time) }}   
              </div>          
            </td>
            <td class="text-black text-center">
              <div v-if="row.reassignment">
                <v-badge 
                  floating 
                  :content="row.reassignment"
                  class="cursor-pointer"
                  @click.native="getTicketAssignmentHistoryList(row.ticket_id)"
                >
                  {{ row.creator }}
                </v-badge>
              </div>
              <div v-else>
                {{ row.creator }}
              </div>        
            </td>
          </tr>          
        </tbody>
        <tfoot v-show="!tableData.length">
          <tr>
            <td
              class="text-center text-body-1"
              :colspan="tableHeader.length"
            >
              <div v-if="!showProgressCircular">
                No Data Available
              </div>
              <div v-if="showProgressCircular">
                <VProgressCircular
                  :size="40"
                  color="primary"
                  indeterminate
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </VTable>
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
    <CustomAssignHistoryListDialog 
      v-model:is-dialog-visible="assignHistoryDialog"
      rounded="lg"
      width="90%"
      title="Ticket Assignment History"

      :tableDataAssignment="tableDataHistoryList"
      :numberTable="numberTableHistoryList"
      :currentPage="currentPageHistoryList"
      :rowPerPage="rowPerPageHistoryList"
      :totalPage="totalTicketAssignmentHistoryList"
      :selectedRows="selectedRowsHistoryList"
      :paginationData="paginationDataHistoryList"
      :tableHeader="tableHeaderHistoryList"
      :to-date-d-m-y="toDateDMY"
      :priv="priv"
      @close="() => {
        assignmentID = ''
        notesReAssinment = ''
        assignHistoryDialog = false
        fetchTicketAssignment()
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

  .status-field-color-grey {
    color: grey;
  }

  .status-field-color-red {
    color: #ff1f00;
  }

  .status-field-color-blue {
    color: #20cfaf;
  }

  .status-field-color-green {
    color: #05ff0d;
  }

  .status-field-color-yellow {
    color: #f1e207;
  }

  a {
    color: black;
  }

  .to-red {
    background-color:rgb(255, 0, 0, 15%);
  }

  .bg-hover:hover {
    background-color: rgba(68, 73, 74, 5%);
  }
</style>

<route lang="yaml">
  meta:
    requiresAuth: true
</route>
