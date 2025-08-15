<script setup>
import { downloadFile } from '@/plugins/downloadFile'
import { useGlobalStore } from '@/store/useGlobalStore'

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

  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  
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

const toDate = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date = dd < 10 ? '0' + dd : dd

  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  
  return (
    date +
    ' ' +
    months[month] +
    ' ' +
    year
  )
}

const toTime = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  let formattedSeconds = seconds < 10 ? '0' + seconds : seconds
  
  return (
    hours + 
    ':' + 
    formattedMinutes+ 
    ':' + 
    formattedSeconds
  )
}

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const projectTitle = ref('')

const tableHeader = ref(['No', 'Ticket ID', 'Status', 'Phone Number', 'Create Time', 'Category', 'Description'])

const tableData = ref([])
const totalPage = ref(1)
const totalTickets = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const showProgressCircular = ref(true)

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

const isEpoch = (value) => {
  const val = Number(value)
  return (
    Number.isInteger(val) &&
    val > 946684800 &&   // Jan 1, 2000
    val < 4102444800     // Jan 1, 2100
  )
}

// const replaceCategory = (data) => {
//   let result = data.replace("category", "campaign")

//   // Replace any 10-digit number that is a valid epoch
//   result = result.replace(/\b\d{10}\b/g, (match) => {
//     return isEpoch(match) ? toDateDMY(Number(match)) : match
//   })

//   return result 
// }

const replaceCategory = (data) => {
  if (typeof data !== 'string') {
    return data;
  }

  // Replace 'category' with 'campaign'
  let result = data.replace("category", "campaign");

  // Only match 10-digit numbers that are not part of a longer word or key (like action_id)
  result = result.replace(/\b(\d{10})\b/g, (match, p1, offset, string) => {
    // Check if the match is part of a key (like action_id: 1753606392)
    const before = string.slice(0, offset);
    const keyMatch = /(\w+):\s*$/.exec(before);
    const key = keyMatch ? keyMatch[1] : null;

    // If the key is 'action_id', skip replacement
    if (key === 'action_id') return match;

    // Otherwise replace if it's a valid epoch
    return isEpoch(match) ? toDateDMY(Number(match)) : match;
  });

  return result;
}

const replaceCategoryAndSemicolon = (data) => {
  if (typeof data !== 'string') {
    return data;
  }

  let result = data.replace("category", "campaign");

  // Replace any 10-digit number that is a valid epoch
  result = result.replace(/\b(\d{10})\b/g, (match, p1, offset, string) => {
    // Check if the match is part of a key (like action_id: 1753606392)
    const before = string.slice(0, offset);
    const keyMatch = /(\w+):\s*$/.exec(before);
    const key = keyMatch ? keyMatch[1] : null;

    // If the key is 'action_id', skip replacement
    if (key === 'action_id') return match;

    // Otherwise replace if it's a valid epoch
    return isEpoch(match) ? toDateDMY(Number(match)) : match;
  });

  // result = result.replace(/\b\d{10}\b/g, (match) => {
  //   return isEpoch(match) ? toDateDMY(Number(match)) : match;
  // });

  // Replace semicolon followed by optional whitespace with newline
  result = result.replace(/;\s*/g, '\n');

  return result;
}

const filterDesc = (data, noReplace = false) => {
  if (typeof data !== 'string') {
    return data;
  }

  const fieldsToKeep = moffas.config.fields_to_keep_on_desc || [];
  const result = [];

  data.split(';').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value && fieldsToKeep.includes(key.trim())) {
      result.push(`${key.trim()}: ${value.trim()}`);
    }
  });

  // Join as string first
  let finalResult = result.join('; ');

  // Optional: Replace commas followed by whitespace with newlines
  if (noReplace == false) {
    finalResult = finalResult.replace(/;\s*/g, '\n');
  }

  return finalResult;
}

const getNameFromDesc = (data) => {
  if (typeof data !== 'string') {
    return {}
  }

  const obj = {};
  data.split(';').forEach(pair => {
    let [key, value] = pair.split(':');
    if (key && value) {
      obj[key.trim()] = value.trim();
    }
  })

  return obj;
}

const fetchTikckets = () => {
  console.log('fetchTikckets')

  showProgressCircular.value = true

  let params = {
    row_length: rowPerPage.value,
    current_page: currentPage.value,    
  }

  if (filter.value.search != '') {
    params.search = filter.value.search
  }

  // dummymoffasdoticketretrieves(
  //   params, 
  //   onFetchTikckets, 
  //   onDataError,
  // )

  window.moffas.do_request(
    'ticket_retrieves',
    params, 
    onFetchTikckets,
    onDataError,
  )
}

const onFetchTikckets = data => {
  
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
  totalTickets.value = response.total_rows  

  showProgressCircular.value = false
}

const downloadAsDoc = (type) => {
  showProgressCircular.value = true

  // Prepare CSV data
  const headers = ["No", "Ticket ID", "Status", "Name", "Phone Number", "Email", "Create Time", "Campaign", "Sales", "CLcode", "Note"];
  // const headers = ["No", "Ticket ID", "Status", "Name", "Phone Number", "Email", "Create Time", "Campaign", "Description"];
  const rows = tableData.value.map((item, index) => [
    numberTable.value + index,
    item.ticket_id,
    item.status,
    getNameFromDesc(item.description)?.name || getNameFromDesc(item.description)?.nama || getNameFromDesc(item.description)?.full_name || '',
    item.customer_phone_number,
    getNameFromDesc(item.description)?.email || '',
    toDateDMY(item.created_tstamp),
    item.category,
    // filterDesc(item.description),
    getNameFromDesc(item.description)?.sales || '',
    getNameFromDesc(item.description)?.clcode || '',
    getNameFromDesc(item.description)?.note || '',
  ]);


  downloadFile({
    headers,
    rows,
    fileName: 'Ticket List',
    type
  })

  showProgressCircular.value = false
}

// 👉 Fetch UserManagement
watch(fetchTikckets)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalTickets.value } entries`
})

const numberTable = ref(0)

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
        Customer Interaction
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <p class="mb-0 font-weight-medium">
            Ticket List
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
        <span class="text-black font-weight-bold mx-2">Search: </span>
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
        </VCol>
        <VBtn
          class="text-none"
          rounded="md"
          prepend-icon="mdi-download"
          @click="downloadAsDoc()"
          :disabled="!tableData.length"
        >
          Download
        </VBtn>
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
                class="th-span-border d-flex justify-center"
              > 
                Status 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Name 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Phone Number 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Email 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border-row-count d-flex justify-center"
              > 
                Create Time
              </span>
            </th>
            <th v-if="projectTitle === 'danareksa'" class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Campaign 
              </span>
            </th>
            <th v-else class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Category 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Sales 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Clcode 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Note 
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
              'to-red': row['status'] == 'Closed'
            }"
          >
            <td class="text-center text-black">
              {{ numberTable + index }}
            </td>
            <td>
              <RouterLink
                class="text-black"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >              
                {{ row.ticket_id }}
              </RouterLink> 
            </td>
            <td>
              <RouterLink
                class="text-no-wrap pl-3"                
                :class="{
                  'status-field-color-grey': row['status'] == 'Awaiting Response', 
                  'status-field-color-red': row['status'] == 'Closed',
                  'status-field-color-blue': row['status'] == 'Responed',
                  'status-field-color-green': row['status'] == 'Follow Up',
                }"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >              
                <VIcon
                  icon="mdi-circle-medium"
                />              
                {{ row.status }}
              </RouterLink> 
            </td>
            <td class="text-black">
              <RouterLink
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ getNameFromDesc(row.description)?.name || getNameFromDesc(row.description)?.nama || getNameFromDesc(row.description)?.full_name || '' }}
              </RouterLink>              
            </td>
            <td class="text-center text-black">
              <RouterLink
                class="text-black"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ row.customer_phone_number }}
              </RouterLink>              
            </td>
            <td class="text-no-wrap text-black">
              <RouterLink
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ getNameFromDesc(row.description)?.email || '' }}
              </RouterLink>              
            </td>
            <td class="text-black pl-3">
              <RouterLink
                class="text-no-wrap text-black"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >              
                <!-- {{ toDateDMY(row.created_tstamp) }} -->
                {{ toDate(row.created_tstamp) }}
                <br>          
                {{ toTime(row.created_tstamp) }}           
              </RouterLink>
            </td>
            <td class="text-black text-center">
              <RouterLink
                class="text-black"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >              
                {{ row.category }}             
              </RouterLink>
            </td>
            <td class="text-no-wrap text-black">
              <RouterLink
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ getNameFromDesc(row.description)?.sales || '' }}
              </RouterLink>              
            </td>
            <td class="text-no-wrap text-black">
              <RouterLink
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ getNameFromDesc(row.description)?.clcode || '' }}
              </RouterLink>              
            </td>
            <td class="text-black">
              <RouterLink
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >
                {{ getNameFromDesc(row.description)?.note || '' }}
              </RouterLink>              
            </td>
            <!-- <td
              class="text-no-wrap text-black"
            >
              <RouterLink
                class="text-black"
                :to="'/support/customer/' + row.customer_phone_number"
                @click="storeTicketId(row.ticket_id)"
              >          
                <div v-if="projectTitle === 'danareksa'" style="white-space: pre-wrap;">
                  {{ filterDesc(row.description) }}    
                </div>    
                <div v-else>
                  {{ row.description }}     
                </div>
              </RouterLink>
            </td> -->
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
    <VDialog
      v-model="showProgressCircular"
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
