<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import DetailLeftSidebarOnConversation from '@/components/DetailLeftSidebarOnConversation.vue'
import DetailTicketOnConversation from '@/components/DetailTicketOnConversation.vue'
// import ListOfTemplates from '@/components/ListOfTemplates.vue'
import TicketsOnConversation from '@/components/TicketsOnConversation.vue'
import { useGlobalStore } from '@/store/useGlobalStore'

import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const store = useGlobalStore()
const route = useRoute()
const router = useRouter()

// =============================================== meta data  
const toTimeDMYHM = unixTimestamp => {
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

const showProgressCircular = ref(true)
const projectTitle = ref('')

// =============================================== customer detail variables
const customerDetailData = ref({
  customer_id: '',
  name: '',
  address: '',
  phone_number: route.params.id,
  email: '',
})

const responseErrorNotFound = ref('')

// =============================================== ticket variables
const tableHeader = ref(['No', 'Ticket ID', 'Status', 'Phone Number', 'Create Time', 'Category', 'Description'])
const tableDataTickets = ref([])

const totalPage = ref(1)
const totalRowTickets = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const listNote = ref([])

const base64ForAttachment = ref('')

const ticketDetailData = ref({
  ticket_id: '',
  status: '',
  category: '',
  priority: '',
  servicing_agent: '',
  description: '',
  created_tstamp: '',
  note:'',
  file_id_attachment:'',
})

const currentTicketData = ref({
  status: '',
  category: '',
  priority: '',
})

const setTicketDetailData = r => {
  currentTicketData.value.status = r.status,
  currentTicketData.value.category = r.category
  currentTicketData.value.priority = r.priority
}

// =============================================== customer operation
function fetchCustomerDetail () {
  showProgressCircular.value = true
  console.log("customer_retrieve")

  const op = "customer_retrieve"

  const params = {
    phone_number: route.params.id,
  }

  console.log("params", params)

  function onSuccess(payload) {
    console.log("on fetching customer detail")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up", response)
      if(response.error_code === '404001'){
        responseErrorNotFound.value = response.error_code
        return
      }
      showPopUp(response)
      
      return
    }

    customerDetailData.value.customer_id = response.customer_id
    customerDetailData.value.name = response.name
    customerDetailData.value.address = response.address
    customerDetailData.value.phone_number = response.phone_number
    customerDetailData.value.email = response.email

    showProgressCircular.value = false

    showingTicketDetailFirst()
  }

  // Fetch customer data to backend
  // window.moffas.do_request | dummymoffasdocustomerretrieve
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function updateCustomer () {
  showProgressCircular.value = true
  console.log("updateCustomer")

  const op = "customer_update"

  const params = {
    customer_id: customerDetailData.value.customer_id,
	  name: customerDetailData.value.name,
	  address: customerDetailData.value.address,
	  phone_number: customerDetailData.value.phone_number,
	  email: customerDetailData.value.email,
  }

  console.log('params di update customer=', params)
  successDialogProps.value.subject = 'submit'
  successDialog.value = true

  function onSuccess(payload) {
    console.log("on updating customer detail")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true

      showProgressCircular.value = false
    }
  }

  // Update customer to backend
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function createCustomer () {
  showProgressCircular.value = true
  console.log("createCustomer")

  const op = "customer_create"

  const params = {
	  name: customerDetailData.value.name,
	  address: customerDetailData.value.address,
	  phone_number: customerDetailData.value.phone_number,
	  email: customerDetailData.value.email,
  }

  console.log('params di create customer=', params)
  successDialogProps.value.subject = 'submit'
  successDialog.value = true

  function onSuccess(payload) {
    console.log("on creating customer detail")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      responseErrorNotFound.value = ''

      showProgressCircular.value = false
    }
  }

  // Update customer to backend
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== ticket operation
const resetFormTicket = () => {
  console.log('resetFormTicket=')
  ticketDetailData.value.ticket_id = '',
  ticketDetailData.value.created_tstamp = '',
  ticketDetailData.value.status = '',
  ticketDetailData.value.category = '',
  ticketDetailData.value.priority = '',
  ticketDetailData.value.description = '',
  ticketDetailData.value.note = '',
  ticketDetailData.value.file_id_attachment = ''
}

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'save':
    if (responseErrorNotFound.value !== '') {
      console.log('masuk disini1')
      createCustomer()

    } else {
      console.log('masuk disini2')
      updateCustomer()
    }
    break
  case 'update':
    if (ticketDetailData.value.file_id_attachment) {
      console.log('masuk disini1')
      convertToBase64('update')
    } else {
      console.log('masuk disini2')
      updateTicket()
    }
    break
  case 'create':
    if (ticketDetailData.value.file_id_attachment) {
      console.log('masuk disini3')
      convertToBase64('create')
    } else {
      console.log('masuk disini4')
      createTicket()
    }
    break
  default:
    break
  }
}

const epoch = date => {
  return Math.floor(new Date(date).getTime()/1000)
}

function updateTicket () {
  console.log("updateTicket")
  showProgressCircular.value = true

  let note = {
    content: ticketDetailData.value.note,
  }
  
  const op = "ticket_update"

  const params = {
    ticket_id: ticketDetailData.value.ticket_id,
    user_name: JSON.parse(localStorage.getItem('user')).name,
    user_id: JSON.parse(localStorage.getItem('user')).user_id,
    user_role: JSON.parse(localStorage.getItem('user')).role_name,
  }

  if(currentTicketData.value.status !== ticketDetailData.value.status){
    params.status = ticketDetailData.value.status
  } 
  
  if (currentTicketData.value.category !== ticketDetailData.value.category) {
    params.category = ticketDetailData.value.category
  } 
  
  if (currentTicketData.value.priority !== ticketDetailData.value.priority) {
    params.priority = ticketDetailData.value.priority
  }

  if(ticketDetailData.value.file_id_attachment){
    console.log('mssk attachment di ticketUpdate')
    // note.attachment = { file_base64: base64ForAttachment.value }
  }

  params.note = note

  console.log('params di updateTicket=', params)

  function onSuccess(payload) {
    console.log("on updating ticket")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    } else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      ticketDetailData.value.note = '',
      showProgressCircular.value = false
      getActivity()
    }
  }

  // Sending message to backend
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function createTicket () {
  showProgressCircular.value = true
  console.log("createTicket")

  let note = {
    content: ticketDetailData.value.note,
  }
  const op = "ticket_create"

  const params = {
    customer_phone_number: route.params.id,
    customer_name: customerDetailData.value.name,
    status: ticketDetailData.value.status,
    category: ticketDetailData.value.category,
    priority: ticketDetailData.value.priority,
    description: ticketDetailData.value.description,
    user_name: JSON.parse(localStorage.getItem('user')).name,
    user_id: JSON.parse(localStorage.getItem('user')).user_id,
    user_role: JSON.parse(localStorage.getItem('user')).role_name,
  }

  if(ticketDetailData.value.note){
    console.log('mssk note di ticketCreate')
    params.note = note
    console.log('note di ticketCreate1=', note)
  }

  if(ticketDetailData.value.file_id_attachment){
    console.log('mssk attachment di ticketCreate')
    // note.attachment = { file_base64: base64ForAttachment.value }
  }

  console.log('params di createTicket=', params)

  function onSuccess(payload) {
    console.log("on creating new ticket")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      resetFormTicket()

      showProgressCircular.value = false
    }

  }

  // Update customer to backend
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function fetchTicketDetail () {
  showProgressCircular.value = true
  console.log("masuk fetchTicketDetail")

  const op = "ticket_retrieve"

  const params = {
    ticket_id: ticketDetailData.value.ticket_id,
  }

  console.log("params", params)

  function onSuccess(payload) {
    console.log("on fetching ticket detail")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    setTicketDetailData(response)
    ticketDetailData.value.ticket_id = response.ticket_id
    ticketDetailData.value.created_tstamp = toTimeDMYHM(response.created_tstamp)
    ticketDetailData.value.servicing_agent = response.user_name
    ticketDetailData.value.status = response.status
    ticketDetailData.value.category = response.category
    ticketDetailData.value.priority = response.priority
    ticketDetailData.value.description = response.description
    

    showProgressCircular.value = false

    isTicketDetailOpen.value = true
    getActivity()
  }

  // Fetch customer data to backend
  // window.moffas.do_request dummymoffasdoticketretrieve
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

watch(rowPerPage, () => {
  console.log('masuk watch rowPerPage di parent=', rowPerPage)
  fetchTickets()
})

watch(currentPage, () => {
  console.log('masuk watch currentPage di parent=', currentPage)
  fetchTickets()
})

function fetchTickets () {
  showProgressCircular.value = true
  console.log("masuk fetchTickets")

  const op = "ticket_retrieves"

  const params = {
    current_page: currentPage.value,
    row_length: rowPerPage.value,
    filter_by: {
      phone_number:route.params.id,
    },
  }

  console.log("params", params)

  function onSuccess(payload) {
    console.log("on fetching ticket list")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    tableDataTickets.value = response.tickets   
    totalPage.value = response.total_pages
    totalRowTickets.value = response.total_rows

    isTicketDetailOpen.value = false
    showProgressCircular.value = false
  }

  // Fetch customer data to backend
  // window.moffas.do_request dummymoffasdoticketretrieves
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}


// 👉 Watch currentPage
watchEffect(() => {
  console.log('masuk Watch currentPage')
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const numberTable = ref(0)

const paginationData = computed(() => {
  const firstIndex = tableDataTickets.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableDataTickets.value.length + (currentPage.value - 1) * rowPerPage.value
  
  numberTable.value = firstIndex  

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRowTickets.value } entries`
})

// =============================================== Notes and Attachment Operation
const download = url => {
  const a = document.createElement('a')

  a.setAttribute('href', url)
  a.setAttribute('download', 'Attachment')
  a.click()
  
  // a.setAttribute('download', 'Attachment' + '.csv')
}

function getActivity () {
  showProgressCircular.value = true
  console.log("getActivity")

  const op = "activity_retrieves"

  const params = {
    filter_by: { ticket_id : ticketDetailData.value.ticket_id },
  }

  console.log("params getActivity=", params)

  function onSuccess(payload) {
    console.log("onSuccess getting activities")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    listNote.value = response.activities
    console.log('listNote.value=', listNote.value)

    showProgressCircular.value = false
  }

  // Fetch customer data to backend
  // window.moffas.do_request dummymoffasdonotes
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== Convert input file to base64
const convertToBase64 = (type='') => {
  const files = document.getElementById('file').files
  if (files.length > 0) {
    getBase64(files[0], type)
  }
}

const getBase64 = (file, type='') => {
 
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    console.log('--------reader.result=', reader.result)

    base64ForAttachment.value = reader.result
    console.log("-----base64ForAttachment di getBase64=", base64ForAttachment.value)
  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }        
}

// =============================================== Error handling
// const LazyErrorDialogs = defineAsyncComponent(
//   () => import('@/views/pages/dialogs/Error-chatlive.vue'),
// )

const isError = ref(false)
const errorMessage = ref("")

async function onError(response) {
  console.log("It's error onError, show pop-up")
  showProgressCircular.value = false
  showPopUp(response)

}

function showPopUp(errMessage) {
  // errorMessage.value = errMessage
  // isError.value = true
  appStore.showError(errMessage)


const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}}

// =============================================== User interaction
const isLeftSidebarOpen = ref(true)
const isTicketDetailOpen = ref(true)
const confirmationDialog = ref(false)
const successDialog = ref(false)

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const successDialogProps = ref({
  subject: '',
})

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  op: '',
})

const toConversationList = () => {
  router.replace('/support/list')
}

const toTicketListOnConversation = () => {  
  if (localStorage.getItem('ticket_id')) {
    localStorage.removeItem('ticket_id')       
  }
  resetFormTicket()
  fetchTickets()
  isTicketDetailOpen.value = false
}

const closeDialog = () => {  
  if (localStorage.getItem('ticket_id')) {
    localStorage.removeItem('ticket_id')       
  }    
  confirmationDialog.value = false
  successDialog.value = false
}

const showingTicketDetailFirst = () => {
  console.log('disni adakah localstorage ticket_id?=', localStorage.getItem('ticket_id'))
  if (localStorage.getItem('ticket_id')) {
    ticketDetailData.value.ticket_id = localStorage.getItem('ticket_id')
    fetchTicketDetail()
  } else {
    fetchTickets()
  }
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
//     return isEpoch(match) ? toTimeDMYHM(Number(match)) : match
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
    return isEpoch(match) ? toTimeDMYHM(Number(match)) : match;
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
    return isEpoch(match) ? toTimeDMYHM(Number(match)) : match;
  });
  // result = result.replace(/\b\d{10}\b/g, (match) => {
  //   return isEpoch(match) ? toTimeDMYHM(Number(match)) : match;
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

// =============================================== On Life Cycle Event
const interval = ref(null)

onMounted(() => {
  console.log('Chat finish initiated di [id]')

  const isEmbeddedSignup = store.payloadFin.embedded_signup
  if(!isEmbeddedSignup){
    toLoginWaba()
  }

  fetchCustomerDetail()

  projectTitle.value = moffas.config.project_title || ''
})

onUnmounted (() => {
  clearInterval(interval.value)
})

onBeforeRouteLeave ((to, from) => {
  if (localStorage.getItem('ticket_id')) {
    localStorage.removeItem('ticket_id')       
  }
})
</script>

<template>
  <section>
    <!-- <LazyErrorDialogs
      v-if="isError"
      v-model:isDialogVisible="isError" 
      :custom-error-message="errorMessage"
    /> -->
    <VCard class="mb-2">
      <VCardActions class="pt-2 pb-0">
        <VBtn 
          class="mr-5 my-3"
          variant="flat"
          icon="mdi-arrow-left"
          @click="toConversationList"
        />
        <VSpacer />
        <VBtn
          v-if="$vuetify.display.smAndDown"
          variant="text"
          color="default"
          icon
          size="small"
          @click="isLeftSidebarOpen = false"
        >
          <VIcon
            size="24"
            icon="mdi-close"
            class="text-medium-emphasis"
          />
        </VBtn>
      </VCardActions>
      <VDivider />
      <DetailLeftSidebarOnConversation
        :customer-detail="customerDetailData"
        :priv="priv"
        :isCreateCustomer="false"
        @save="dataC => {
          customerDetailData.customer_id = dataC.customer_id
          customerDetailData.name = dataC.name
          customerDetailData.address = dataC.address
          customerDetailData.phone_number = dataC.phone_number
          customerDetailData.email = dataC.email
          confirmDialogProps.confirmationStyling = '2'
          confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
          confirmDialogProps.op = 'save'
          successDialogProps.subject = 'submit'
          confirmationDialog = true
        }"
      />
    </VCard>
    <VCard>
      <div v-if="!isTicketDetailOpen">
        <TicketsOnConversation 
          v-model:row-per-page="rowPerPage"
          v-model:current-page="currentPage"
          :table-data-tickets="tableDataTickets"
          :number-table="numberTable"
          :total-page="totalPage"
          :selected-rows="selectedRows"
          :pagination-data="paginationData"
          :table-header="tableHeader"
          :to-time-d-m-y-h-m="toTimeDMYHM"
          :toDate="toDate"
          :toTime="toTime"
          :priv="priv"
          :project="projectTitle"
          :filterDesc="filterDesc"
          :getNameFromDesc="getNameFromDesc"
          @close="() => {
            resetFormTicket()
            isTicketDetailOpen = true
          }"
          @todetail=" row => {
            ticketDetailData.ticket_id = row.ticket_id
            isTicketDetailOpen = true
            fetchTicketDetail()
          }"
        />
      </div>
      <div v-else-if="isTicketDetailOpen">       
        <DetailTicketOnConversation 
          :ticket-detail="ticketDetailData"
          :isCreateCustomer="false"
          :list-note="listNote"
          :to-time-d-m-y-h-m="toTimeDMYHM"
          :priv="priv"
          :project="projectTitle"
          :replaceCategory="filterDesc"
          @close="() => {
            toTicketListOnConversation()
          }"
          @createnotes="data => {
            ticketDetailData.ticket_id = data.ticket_id
            ticketDetailData.note = data.note
            ticketDetailData.file_id_attachment = data.file_id_attachment
            confirmDialogProps.confirmationStyling = '2'
            confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
            confirmDialogProps.op = 'createNotes'
            successDialogProps.subject = 'submit'
            confirmationDialog = true
          }"
          @create="data => {
            ticketDetailData.status = data.status
            ticketDetailData.category = data.category
            ticketDetailData.priority = data.priority
            ticketDetailData.description = data.description
            ticketDetailData.note = data.note
            ticketDetailData.file_id_attachment = data.file_id_attachment
            confirmDialogProps.confirmationStyling = '2'
            confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
            confirmDialogProps.op = 'create'
            successDialogProps.subject = 'submit'
            confirmationDialog = true
          }"
          @update="(dataT) => {
            ticketDetailData.ticket_id = dataT.ticket_id
            ticketDetailData.status = dataT.status
            ticketDetailData.category = dataT.category
            ticketDetailData.priority = dataT.priority
            ticketDetailData.description = dataT.description
            ticketDetailData.note = dataT.note
            ticketDetailData.file_id_attachment = dataT.file_id_attachment
            confirmDialogProps.confirmationStyling = '2'
            confirmDialogProps.messageTitle = 'Are you sure you want to submit this?'
            confirmDialogProps.op = 'update'
            successDialogProps.subject = 'submit'
            confirmationDialog = true
          }"
        />
      </div> 
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
    
    <CustomConfirmDialog
      v-model:is-dialog-visible="confirmationDialog"
      rounded="lg"
      confirmation-styling="2"
      :message-title="confirmDialogProps.messageTitle"
      @yes="chooseOP"
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="closeDialog"
    />
  </section>
</template>
  
<style lang="scss" scoped>
.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  overflow-wrap: anywhere;

  .append-inner {
    display: flex;
    align-items: center;
    justify-content: end;
  }
}

.ps {
  block-size: 400px;
}

.bg-hover:hover {
  background-color: rgba(68, 73, 74, 5%);
  cursor: pointer;
}

.change-color-btn-text {
  color: #32bcad;
}

.wrap-text {
  -webkit-line-clamp: unset !important;
}

.custom-dropdown {
  inline-size: 600px;
}

.custom-height-select {
  font-weight: 1000; /* Adjust font weight as needed */
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
