<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import DetailLeftSidebarOnConversation from '@/components/DetailLeftSidebarOnConversation.vue'
import DetailTicketOnConversation from '@/components/DetailTicketOnConversation.vue'
// import ListOfTemplates from '@/components/ListOfTemplates.vue'
import TicketsOnConversation from '@/components/TicketsOnConversation.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import axios from '@axios'

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

const showProgressCircular = ref(true)
const projectTitle = ref('')
const listResponse = ref([])

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

// =============================================== contact detail variables
const contactDetailData = ref({
  customer_id: '',
  contact_id: '',
  name: '',
  address: '',
  phone_number: route.params.id,
  email: '',
})

const contactDetailsData = ref([])
const contactDetailsDataStore = ref([])

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
  description: '',
  created_tstamp: '',
  note: '',
  file_id_attachment: '',
  assigned_group: 0,
  assigned_user: 0,
  target_time: '',
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
const fetchContactDetails = () => {
  showProgressCircular.value = true
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    current_page: 1,
    row_length: 100,
    search_filter: '',
    data: {
      customer_id: route.params.id,
      contact_id: route.query.contact_id,
    }
  }

  console.log('params di fetchContactDetails', params)

  axios.post(urlBE.value + 'retrieve_contact_details', params)
  .then(function (response) {
    console.log('response fetchContactDetails=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onError(response.data)

      return
    }

    contactDetailsData.value = responseData.data
    contactDetailsDataStore.value = JSON.parse(JSON.stringify(responseData.data))

    contactDetailData.value.customer_id = route.params.id || ''
    contactDetailData.value.contact_id = route.query.contact_id || ''
    contactDetailData.value.name = route.query.name || ''

    const addressObj = responseData.data.find(dataA => dataA.contact_type === 'address')
    const phoneObj = responseData.data.find(dataA => dataA.contact_type === 'phone_number')
    const emailObj = responseData.data.find(dataA => dataA.contact_type === 'email')

    contactDetailData.value.address = addressObj ? addressObj.contact_value : ''
    contactDetailData.value.phone_number = phoneObj ? phoneObj.contact_value : ''
    contactDetailData.value.email = emailObj ? emailObj.contact_value : ''

    showProgressCircular.value = false

    if(dictionariesData.value.length === 0) {
      getDictionaries()
    } else {
      showingTicketDetailFirst()
    }
  })
  .catch(function (error) {
    console.log(error)
    onError(error.response)
  })
}

function updateContactAndDetail () {
  console.log('masuk updateContactAndDetail')
  console.log('contactDetailsData.value updateContactAndDetail', contactDetailsData.value)
  console.log('contactDetailsDataStore.value updateContactAndDetail', contactDetailsDataStore.value)
  showProgressCircular.value = true

  let filterContactDetail = []

  // Map of contact types to their corresponding form input values
  const formValues = {
    address: contactDetailData.value.address,
    phone_number: contactDetailData.value.phone_number,
    email: contactDetailData.value.email,
  }

  // Loop through each contact type
  for (const type in formValues) {
    const newValue = formValues[type]

    const stored = contactDetailsDataStore.value.find(a => a.contact_type === type)
    const current = contactDetailsData.value.find(a => a.contact_type === type)

    // If stored doesn't exist or the value has changed
    if (!stored || stored.contact_value !== newValue) {
      if (current) {
        current.contact_value = newValue // update current data
        filterContactDetail.push(current)
      } else {
        // Fallback if current entry doesn't exist (optional)
        filterContactDetail.push({
          contact_id: contactDetailData.value.contact_id,
          contact_type: type,
          contact_value: newValue,
        })
      }
    }
  }
  console.log('filterContactDetail =', filterContactDetail)

  const newFields = filterContactDetail.map(a => a.contact_type)
  console.log('newFields =', newFields)

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 3,
    data: {
      customer_id: route.params.id,
      contact_id: contactDetailData.value.contact_id,
      contact_name: contactDetailData.value.name || "",
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
      onError(response.data)

      return
    }

    successDialog.value = true
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onError(error.response)
  })
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
  ticketDetailData.value.assigned_group = 0
  ticketDetailData.value.assigned_user = 0
  ticketDetailData.value.target_time = ''
}

const chooseOP = () => {
  switch (confirmDialogProps.value.op) {
  case 'save':
    updateContactAndDetail()
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

const updateTicket = () => {
  console.log('masuk updateTicket')
  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    op_crud: 3,
    data: {
      ticket_id: ticketDetailData.value.ticket_id,
      status: ticketDetailData.value.status,
      category: ticketDetailData.value.category,
      priority: ticketDetailData.value.priority,
      description: ticketDetailData.value.description,
      note: ticketDetailData.value.note,
      updated_tstamp: Math.floor(new Date().getTime()/1000),

      assigned_group: ticketDetailData.value.assigned_group,
      assigned_user: ticketDetailData.value.assigned_user,
      target_time: ticketDetailData.value.target_time,
      data: {},
      // assigned_user: JSON.parse(localStorage.getItem('user')).user_id,
    }
  }

  console.log('params di updateTicket', params)

  axios.post(urlBE.value + 'do_ticket_crud', params)
  .then(function (response) {
    console.log('response updateTicket=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onError(response.data)

      return
    }

    successDialogProps.value.subject = 'submit'
    successDialog.value = true
    ticketDetailData.value.note = '',
    showProgressCircular.value = false
    getActivity()
  })
  .catch(function (error) {
    console.log(error)
    onError(error.response)
  })
}

// function updateTicket () {
//   console.log("updateTicket")
//   showProgressCircular.value = true

//   let note = {
//     content: ticketDetailData.value.note,
//   }
  
//   const op = "ticket_update"

//   const params = {
//     ticket_id: ticketDetailData.value.ticket_id,
//     user_name: JSON.parse(localStorage.getItem('user')).name,
//     user_id: JSON.parse(localStorage.getItem('user')).user_id,
//     user_role: JSON.parse(localStorage.getItem('user')).role_name,
//   }

//   if(currentTicketData.value.status !== ticketDetailData.value.status){
//     params.status = ticketDetailData.value.status
//   } 
  
//   if (currentTicketData.value.category !== ticketDetailData.value.category) {
//     params.category = ticketDetailData.value.category
//   } 
  
//   if (currentTicketData.value.priority !== ticketDetailData.value.priority) {
//     params.priority = ticketDetailData.value.priority
//   }

//   if(ticketDetailData.value.file_id_attachment){
//     console.log('mssk attachment di ticketUpdate')
//     // note.attachment = { file_base64: base64ForAttachment.value }
//   }

//   params.note = note

//   console.log('params di updateTicket=', params)

//   function onSuccess(payload) {
//     console.log("on updating ticket")

//     const response = JSON.parse(payload)
//     if (response.hasOwnProperty('trace_id')){
//       showProgressCircular.value = false
//       console.log("It's error having trace_id, show pop-up")
//       showPopUp(response)
//     } else {
//       successDialogProps.value.subject = 'submit'
//       successDialog.value = true
//       ticketDetailData.value.note = '',
//       showProgressCircular.value = false
//       getActivity()
//     }
//   }

//   // Sending message to backend
//   window.moffas.do_request(
//     op,
//     params, 
//     onSuccess,
//     onError,
//   )
// }

function createTicket () {
  showProgressCircular.value = true
  console.log("createTicket")

  let note = {
    content: ticketDetailData.value.note,
  }
  const op = "ticket_create"

  const params = {
    customer_phone_number: route.params.id,
    customer_name: contactDetailData.value.name,
    status: ticketDetailData.value.status,
    category: ticketDetailData.value.category,
    priority: ticketDetailData.value.priority.key,
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

function dummymoffasdoticketretrieve (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    ticket_id: params.ticket_id || 'TCK-001',
    status: 'Open',
    category: 'SR022',
    priority: 'medium',
    description: 'Customer reports intermittent connectivity problems.; note: apa aja bole; name: rafif',
    company_id: 101,
    created_tstamp: 1721026200, // UNIX timestamp
    updated_tstamp: 1721030000,
    data: {},
    created_by: 23,
    assigned_group: 2,
    assigned_user: 2,
    target_time: 1721040000,
    contact_id: 888800001122,
    customer_id: 555500009999,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
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
    ticketDetailData.value.status = response.status
    ticketDetailData.value.category = response.category
    ticketDetailData.value.priority = response.priority
    ticketDetailData.value.description = response.description

    ticketDetailData.value.assigned_group = response.assigned_group || 0
    ticketDetailData.value.assigned_user = response.assigned_user || 0
    ticketDetailData.value.target_time = response.target_time || ''

    showProgressCircular.value = false

    isTicketDetailOpen.value = true
    getActivity()
  }

  // Fetch customer data to backend
  // window.moffas.do_request dummymoffasdoticketretrieve
  dummymoffasdoticketretrieve(
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


function dummymoffasdoticketretrieves (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    tickets : [
      {
        ticket_id: params.ticket_id || 'TCK-001',
        status: 'Open',
        category: 'SR022',
        priority: 'medium',
        description: 'Customer reports intermittent connectivity problems.; note: apa aja bole; name: rafif',
        company_id: 101,
        created_tstamp: 1721026200, // UNIX timestamp
        updated_tstamp: 1721030000,
        data: {},
        created_by: 23,
        assigned_group: 2,
        assigned_user: 2,
        target_time: 1721040000,
        contact_id: 888800001122,
        customer_id: 555500009999,
      },
    ],
    total_pages : 1,
    total_rows : 2,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

const fetchTickets = () => {
  showProgressCircular.value = true

  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    row_length: rowPerPage.value,
    current_page: currentPage.value,    
    search_filter: '',   
    filter_status: '',   
    filter_response: 0,   
    data:{
      assigned_user: 0,
      contact_id: route.query.contact_id || '',
    }
  }

  console.log('params di fetchTickets =', params)

  axios.post(urlBE.value + 'retrieve_tickets', params)
  .then(function (response) {
    console.log('response fetchTickets=', response)
    const responseData = response.data

    console.log('response', response)

    if(response.data.error_code) {
      onError(response.data)

      return
    }

    tableDataTickets.value = responseData.data
    totalPage.value = responseData.page_total
    totalRowTickets.value = responseData.recordsTotal 

    isTicketDetailOpen.value = false
    showProgressCircular.value = false
  })
  .catch(function (error) {
    console.log(error)
    onError(error.response)
  })
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

// =============================================== group operation
const groupList = ref([
  {
    group_name: 'None',
    group_id: 0,
  },
])
// Only for development purposes
function dummymoffasdofetchAssigneeGroup (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    groups : [
      {
        group_name: 'Finance',
        group_id: 1,
      },
      {
        group_name: 'Sales',
        group_id: 2,
      },
    ],
    total_pages : 1,
    total_rows : 2,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

function fetchAssigneeGroups () {
  showProgressCircular.value = true
  console.log("get_assigned_groups")

  const op = "get_assigned_groups"

  const params = {}

  console.log("params di fetchAssigneeGroups", params)

  function onSuccess(payload) {
    console.log("on fetchAssigneeGroup", payload)

    const response = JSON.parse(payload)

    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up", response)
      // if(response.error_code === '404001'){
      //   responseErrorNotFound.value = response.error_code
      //   return
      // }
      showPopUp(response)
      
      return
    }

    groupList.value.push(response.groups)

    showProgressCircular.value = false
  }

  // Fetch customer data to backend
  // window.moffas.do_request | dummymoffasdofetchAssigneeGroup
  dummymoffasdofetchAssigneeGroup(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== user operation
const userList = ref([])
// Only for development purposes
function dummymoffasdofetchAssigneeStaffs (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    staffs : [
      {
        username: 'Lisa',
        user_id: 1,
      },
      {
        username: 'Bang Capt',
        user_id: 2,
      },
    ],
    total_pages : 1,
    total_rows : 2,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

function fetchAssigneeStaffs () {
  showProgressCircular.value = true
  console.log("get_assigned_staffs")

  const op = "get_assigned_staffs"

  const params = {}

  console.log("params di fetchAssigneeStaffs", params)

  function onSuccess(payload) {
    console.log("on fetchAssigneeStaffs", payload)

    const response = JSON.parse(payload)

    if (response.hasOwnProperty('trace_id')){
      showProgressCircular.value = false
      console.log("It's error having trace_id, show pop-up", response)
      // if(response.error_code === '404001'){
      //   responseErrorNotFound.value = response.error_code
      //   return
      // }
      showPopUp(response)
      
      return
    }

    userList.value = response.staffs

    showProgressCircular.value = false
  }

  // Fetch customer data to backend
  // window.moffas.do_request | dummymoffasdofetchAssigneeStaffs
  dummymoffasdofetchAssigneeStaffs(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== dictionaries operation
const dictionariesData = ref([])

const getDictionaries = () => {
  showProgressCircular.value = true
  let params = {
    company_id: companyID.value,
    session_id: sessionID.value,
    current_page: 1,
    row_length: 100,
    search_filter: '',
    data: {}
  }

  console.log('params di getDictionaries', params)

  axios.post(urlBE.value + 'retrieve_priority', params)
  .then(function (response) {
    console.log('response getDictionaries=', response)
    const responseData = response.data

    console.log('responseData', responseData)

    if(response.data.error_code) {
      onError(response.data)

      return
    }

    dictionariesData.value = response.dictionaries
    showProgressCircular.value = false

    showingTicketDetailFirst()
  })
  .catch(function (error) {
    console.log(error)
    onError(error.response)
  })
}


// =============================================== Notes and Attachment Operation
const download = url => {
  const a = document.createElement('a')

  a.setAttribute('href', url)
  a.setAttribute('download', 'Attachment')
  a.click()
  
  // a.setAttribute('download', 'Attachment' + '.csv')
}

function dummymoffasdonotes (op,params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    activities : [
      {
        user_id: 1,
        user_name: 'Lisa',
        user_role: 'Agent',
        created_tstamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        changes: {
          status: 'In Progress',
          priority: 'High',
          category_ticket: 'SR022',
          activity: 'Changed ticket properties'
        },
        note: {
          content: 'Customer has confirmed the issue is ongoing.',
          // Uncomment if you want to test attachments
          // attachment: {
          //   file_id: 'file-12345',
          // }
        },
      },
      {
        user_id: 2,
        user_name: 'Bang Capt',
        user_role: 'Supervisor',
        created_tstamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        changes: {
          status: 'Open',
          activity: 'Initial ticket assignment'
        },
        note: {
          content: 'Ticket created and assigned to network team.',
        },
      },
    ],
    total_pages : 1,
    total_rows : 2,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
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

    fetchAssigneeGroups()
  }

  // Fetch customer data to backend
  // window.moffas.do_request dummymoffasdonotes
  dummymoffasdonotes(
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
const LazyErrorDialogs = defineAsyncComponent(
  () => import('@/views/pages/dialogs/Error-chatlive.vue'),
)

const isError = ref(false)
const errorMessage = ref("")

async function onError(response) {
  console.log("It's error onError, show pop-up")
  showProgressCircular.value = false
  showPopUp(response)

}

function showPopUp(errMessage) {
  errorMessage.value = errMessage
  isError.value = true
}

// =============================================== User interaction
const isLeftSidebarOpen = ref(true)
const isTicketDetailOpen = ref(true)
const confirmationDialog = ref(false)
const successDialog = ref(false)

const userData = ref(null)
const userDataString = localStorage.getItem('user')
userData.value = JSON.parse(userDataString)
const priv = userData.value.priv

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

const goBackPrevious = () => {
  router.go(-1)
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

const replaceCategory = (data) => {
  let result = data.replace("category", "campaign")

  // Replace any 10-digit number that is a valid epoch
  result = result.replace(/\b\d{10}\b/g, (match) => {
    return isEpoch(match) ? toTimeDMYHM(Number(match)) : match
  })

  return result 
}

const replaceCategoryAndSemicolon = (data) => {
  let result = data.replace("category", "campaign");

  // Replace any 10-digit number that is a valid epoch
  result = result.replace(/\b\d{10}\b/g, (match) => {
    return isEpoch(match) ? toTimeDMYHM(Number(match)) : match;
  });

  // Replace semicolon followed by optional whitespace with newline
  result = result.replace(/;\s*/g, '\n');

  return result;
};

// =============================================== On Life Cycle Event
const interval = ref(null)

onMounted(() => {
  console.log('Chat finish initiated di [id]')

  const isEmbeddedSignup = store.payloadFin.embedded_signup
  if(!isEmbeddedSignup){
    toLoginWaba()
  }

  fetchContactDetails()

  projectTitle.value = moffas.config.project_title || ''
  listResponse.value = moffas.config.listOfResponseCustomer || []
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
    <LazyErrorDialogs
      v-if="isError"
      v-model:isDialogVisible="isError" 
      :custom-error-message="errorMessage"
    />
    <VCard class="mb-2">
      <VCardActions class="pt-2 pb-0">
        <VBtn 
          class="mr-5 my-3"
          variant="flat"
          icon="mdi-arrow-left"
          @click="goBackPrevious"
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
      <div v-if="contactDetailsData.length > 0">
      </div>
      <DetailLeftSidebarOnConversation
        :contact-detail="contactDetailData"
        :all-contact-detail="contactDetailsData"
        :contact-detail-store="contactDetailsDataStore"
        :priv="priv"
        :isCreateCustomer="false"
        :project-title="projectTitle"
        @save="dataC => {
          contactDetailData.customer_id = dataC.customer_id
          contactDetailData.name = dataC.name
          contactDetailData.address = dataC.address
          contactDetailData.phone_number = dataC.phone_number
          contactDetailData.email = dataC.email

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
          :priv="priv"
          :project="projectTitle"
          :replaceCategory="replaceCategory"
          @close="() => {
            resetFormTicket()
            isTicketDetailOpen = true
          }"
          @todetail=" row => {
            ticketDetailData.ticket_id = row.ticket_id
            // isTicketDetailOpen = true
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
          :replaceCategory="replaceCategoryAndSemicolon"
          :user-data="userData"
          :group-options="groupList"
          :user-options="userList"
          :dictionary="dictionariesData"
          @close="() => {
            toTicketListOnConversation()
          }"
          @get-all-user="() => {
            fetchAssigneeStaffs()
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
