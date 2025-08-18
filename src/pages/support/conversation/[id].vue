<script setup>
import ChatLog from '@/components/ChatLog.vue'
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import DetailLeftSidebarOnConversation from '@/components/DetailLeftSidebarOnConversation.vue'
import DetailTicketOnConversation from '@/components/DetailTicketOnConversation.vue'
// import ListOfTemplates from '@/components/ListOfTemplates.vue'
import TicketsOnConversation from '@/components/TicketsOnConversation.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import depLogo from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png'
import { nextTick } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const store = useGlobalStore()
const route = useRoute()
const router = useRouter()

// =============================================== meta data  
const toTimeHM = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let hours = today.getHours()
  let minutes = today.getMinutes()
  
  return (
    hours.toString().padStart(2, '0') + 
    ':' + 
    minutes.toString().padStart(2, '0')
  )
}

const toTimeDMYHM = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let date =
      dd < 10 ? '0' + dd : dd
  
  return (
    date +
    '/' +
    month +
    '/' +
    year+
    ' ' +
    hours + 
    ':' + 
    minutes.toString().padStart(2, '0')
  )
}

const compareTimeStamp = epochMillis => {
  const dateFromEpoch = new Date(epochMillis * 1000)
  const today = new Date()

  return (
    dateFromEpoch.getDate() !== today.getDate() ||
    dateFromEpoch.getMonth() !== today.getMonth() ||
    dateFromEpoch.getFullYear() !== today.getFullYear()
  )
}

// =============================================== message variables
const messages = ref([]) // List of message object
const messagesBox = ref(null) // Message box element for managing scrolling

const fetchedMessageLength = ref(10)
const rowLength = ref(10)
const lastFetchedPage = ref(1)

// =============================================== send message variables
const myTextMessage = ref("")
const recipientType = ref("individual")
const messagingProduct = ref("whatsapp")
const messageType = ref("text")

let statusIcon = ref({
  read: 'mdi-check-all',
  delivered: 'mdi-check-all',
  pending: 'mdi-clock-outline',
  initiated: 'mdi-clock-outline',
  failed: 'mdi-close',
  falied: 'mdi-close',
  accepted: 'mdi-clock-outline',
  sent: 'mdi-check',
})

const statusColor = ref({
  read: 'grass-green',
  delivered: 'on-secondary',
  pending: 'on-secondary',
  initiated: 'on-secondary',
  failed: 'on-secondary',
  falied: 'on-secondary',
  accepted: 'on-secondary',
  sent: 'on-secondary',
})

// =============================================== templates variables
const myTemplateMessage = ref()
const templateID = ref("")
const isShowSelectTemplate = ref (false)

const items = ref([])
const itemsTemplate = ref([])
const templateParameters = ref({})

const getItemSubtitle = (item) => {
  console.log('masuk getItemSubtitle', item)
  for (let i = 0; i < item.length; i++) {
    if (item[i].components) {
      for (let j = 0; j < item[i].components.length; j++) {
        if (item[i].components[j].type === 'BODY') {
          itemsTemplate.value.push({ templateID: item[i].template_id, name: item[i].name, text: item[i].components[j].text });
        }
      }
    }
  }
  console.log('itemsTemplate', itemsTemplate.value)
}

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

// =============================================== utility function
const isNewMessages = ref([])
const imageURLs = ref({})

function appendMessages (messages, additionalMessages) {
  const messageMap = new Map()
  let newDataCount = 0

  messages.forEach(message => {
    messageMap.set(message.message_id, message)
  })

  additionalMessages.forEach(newMessage => {
    let imageResult = depLogo

    if (messageMap.has(newMessage.message_id)) {
      const existingMessage = messageMap.get(newMessage.message_id)

      existingMessage.tstamp = newMessage.tstamp

      if (existingMessage.side === 'business') {
        existingMessage.status = newMessage.status
      }

    } else {

      if(newMessage.type === 'image' || newMessage.type === 'video' || newMessage.type === 'audio' || newMessage.type === 'sticker' || newMessage.type === 'document') {
        console.log('--- DISINI masoook loh newMessage.data.id=', newMessage.data)
        imageResult = callingAxiosForGetImage(newMessage.data.id, newMessage.message_id)
        
        // proses calling
        async function callingAxiosForGetImage (fileID, messageID) {
          console.log("---------- masuk ke callingAxiosForGetImage")
          const searchTerm = localStorage.getItem('moffas.key')
          const encodedSearchTerm = encodeURIComponent(searchTerm)

          const searchUrl = "https://" + window.location.host +"/storage/web/whatsapp_media/" + fileID + "/view?DEP-AESKey=" + encodedSearchTerm

          base64ForAttachment.value = searchUrl
          newMessage.data.url = searchUrl
          console.log('searchUrl', searchUrl)
        }
      }
      
      messages.unshift(newMessage)
      messageMap.set(newMessage.message_id, newMessage)
      newDataCount++;

      console.log('--- DISINI NEWMESSAGE loh=', newMessage)
      console.log('--- DISINI messages loh=', messages)
      console.log('--- DISINI newMessage.data.id=', newMessage.data.id)
    }
  })
  console.log('--------------- new data found: ', newDataCount)
  if (newDataCount) {
    fetchedMessageLength.value = newDataCount
  }
  console.log('--------------- ini messages=', messageMap)

  // Sort the messages by tstamp in descending order
  messages.sort((a, b) => b.tstamp - a.tstamp)
  
  return messages
}

const chatTemplateBody = chatBody => {
  let result = chatBody
  if(chatBody && chatBody.includes("[BODY]")){
    let splittingtemplateBody = chatBody.split("[BODY]")
    let splittingtemplateHeader = splittingtemplateBody[0].split("[HEADER]")[1]
    
    if (splittingtemplateHeader) {
      result = splittingtemplateHeader + splittingtemplateBody[1] 
    } else {
      result = splittingtemplateBody[1]
    }
  }

  console.log ('result=' , result)
  
  return(result)
}


// =============================================== message operation
const firstAPICall = ref(true)
const isDoingFetchMessages = ref(false)

function fetchMessages(pageNumber, type='', scheduled = false) {
  // Fetch from backend
  console.log("pageNumber:", pageNumber)
  if (isDoingFetchMessages.value && !scheduled) {
    return
  }

  isDoingFetchMessages.value = true

  const op = "get_messages"
  let params = {
    messaging_product: messagingProduct.value,
    customer_phone_number: route.params.id,
    row_length: rowLength.value,
    page_number: pageNumber,
  }

  async function onSuccess(payload) {
    console.log("Parsing fetchMessages data")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)

    }

    // if success, messages from response store to `messages`
    messages.value = appendMessages(messages.value, response.data)

    if(type == 'onMounted'){
      fetchCustomerDetail()
    }

    // handling scroll event
    keepScrollPosition()

    if (firstAPICall.value) {
      nextTick(() => {
        toBottomMessage()
        firstAPICall.value = false
      })
    }

    // if messages exists, to next page number
    if (fetchedMessageLength.value >= rowLength.value
      && !scheduled
    ) {
      lastFetchedPage.value = pageNumber
    }

    // finish doing request
    isDoingFetchMessages.value = false
  }

  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

const dateToday = new Date()
const timeStampMilliSeconds = dateToday.getTime()
const timeStampSeconds = Math.floor(timeStampMilliSeconds / 1000)

console.log('ini timestampmilisecond=', dateToday.getTime())


function sendMessage(messageType, messageData) {
  console.log("sendMessage")

  const op = "send_message"

  const params = {
    messaging_product: messagingProduct.value,
    recipient_type: recipientType.value,
    to: route.params.id,
    type: messageType,
    data: messageData,
  }

  async function onSuccess(payload) {
    console.log("Parsing sendMessage data")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    // if success,
    // create temporary message object for user interfacing
    // and append them to `messages`

    const messageSent = {
      message_id: response.message_id,
      messaging_product: messagingProduct.value,
      to: route.params.id,
      type: messageType,
      data: messageData,
      tstamp: timeStampSeconds,
      side: "business",
      status: "pending",
    }

    messages.value.forEach((message) => {
      message.isNew = false
    })
    console.log("messages.value1 = ", messages.value)

    messages.value.unshift(messageSent)

    console.log("messages.value2 = ", messages.value)

    // Reset message input
    myTextMessage.value = ""
  }

  // Sending message to backend
  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== template operation
function getTemplates() {
  // Fetch from backend
  const op = "get_templates"
  let params = {
    // st: 'APPROVED',
    filter_by :{
      status: "APPROVED",
      type: "STATIC"
    }
  }

  function onSuccess(payload) {
    console.log("Parsing fetchTemplates data")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }

    items.value = response.templates
    console.log('items.value di getTemplates =', items.value)

    // make list of template
    getItemSubtitle(items.value)

    // delete input of Text Message and showing dropdown
    myTextMessage.value = ''
    isShowSelectTemplate.value = true
  }

  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function getTemplateParameter(templateId) {
  // Fetch from backend
  const op = "get_template_parameters"
  let params = {
    template_id: templateId
  }

  templateID.value = templateId

  console.log ('params di getTemplateParameter =', params)
  console.log ('templateID.value di getTemplateParameter =', templateID.value)

  function onSuccess(payload) {
    console.log("Parsing getTemplateParameter data")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }

    console.log('typeof (response.parameters) =', typeof (response.parameters))
    console.log('response.parameters =', response.parameters)

    response.parameters.forEach(obj => {
      templateParameters.value = obj
    })
    console.log('templateParameters.value di getTemplateParameter =', templateParameters.value)
  }

  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

function sendTemplateMessage() {
  // Fetch from backend
  const op = "send_template_message"
  let params = {
    to: route.params.id,
    template_id: templateID.value,
    parameter: templateParameters.value,
  }

  console.log('msk param di sendTemplateMessage', params)

  function onSuccess(payload) {
    console.log("Parsing fetchTemplates data")

    const response = JSON.parse(payload)
    if (response.hasOwnProperty('trace_id')){
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }

    console.log('response di sendTemplateMessage=', response)

    const templateMessageSent = {
      message_id: response.message_id,
      messaging_product: response.messaging_product,
      to: response.phone_number,
      type: 'template',
      data: {body: myTemplateMessage.value.title},
      tstamp: timeStampSeconds,
      side: "business",
      status: "pending",
    }

    messages.value.forEach((message) => {
      message.isNew = false
    })

    messages.value.unshift(templateMessageSent)

    console.log("messages.value di sendTemplateMessage = ", messages.value)

    // Reset input of Template Message and unshowing dropdown
    myTemplateMessage.value = ''
    isShowSelectTemplate.value = false
  }

  window.moffas.do_request(
    op,
    params, 
    onSuccess,
    onError,
  )
}

// =============================================== customer operation
function fetchCustomerDetail () {
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      responseErrorNotFound.value = ''
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    } else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      ticketDetailData.value.note = '',
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
    }else {
      successDialogProps.value.subject = 'submit'
      successDialog.value = true
      resetFormTicket()
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    tableDataTickets.value = response.tickets   
    totalPage.value = response.total_pages
    totalRowTickets.value = response.total_rows

    isTicketDetailOpen.value = false
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
      console.log("It's error having trace_id, show pop-up")
      showPopUp(response)
      
      return
    }

    listNote.value = response.activities
    console.log('listNote.value=', listNote.value)
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
  } 
}

// =============================================== Message Scroll Bar and Event
const keepScrollPosition = () => {
  const messagesElement = messagesBox.value.$el || messagesBox.value
  const distanceFromBottom = messagesElement.scrollHeight - messagesElement.scrollTop

  nextTick(() => {
    console.log('messagesElement from top =', messagesElement.scrollTop)
    console.log('messagesElement heigh =', messagesElement.scrollHeight)
    console.log('distance from bottom =', distanceFromBottom)
    messagesBox.value.$el.scrollTop = messagesElement.scrollHeight - distanceFromBottom
  })
}

const toBottomMessage = () => {
  const messagesElement = messagesBox.value.$el || messagesBox.value

  messagesElement.scrollTop = messagesElement.scrollHeight
}

const handleVerticalScrollEvent = event => {
  console.log('vertical scroll event triggered')
  const messagesElement = messagesBox.value.$el || messagesBox.value
  const distanceFromBottom = messagesElement.scrollHeight - messagesElement.scrollTop

  // If the top scroll postition hit 200px
  // but don't if fetched message less than row length
  // which mean there's no messages in backend existed
  console.log("will fetch fetchedMessageLength =", fetchedMessageLength.value)
  console.log("will fetch rowLength =", rowLength.value)

  if (parseInt(messagesElement.scrollTop) <= 200
    && fetchedMessageLength.value >= rowLength.value
  ) {
    const fetchedPageNumber = lastFetchedPage.value + 1

    console.log("will fetch fetchedPageNumber =", fetchedPageNumber)
    fetchMessages(fetchedPageNumber, 'onScrolling')
  } 
}

// =============================================== On Life Cycle Event
const interval = ref(null)

onMounted(() => {
  console.log('Chat finish initiated di [id]')

  const isEmbeddedSignup = store.payloadFin.embedded_signup
  if(!isEmbeddedSignup){
    toLoginWaba()
  }

  fetchMessages(1, 'onMounted')
    
  interval.value = setInterval(() => {
    fetchMessages(1, true)
  }, 5000)
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
    <VCard>
      <VNavigationDrawer
        v-model="isLeftSidebarOpen"
        absolute
        touchless
        location="start"
        width="550"
        class="chat-list-sidebar"
        :permanent="$vuetify.display.mdAndUp"
        :temporary="$vuetify.display.smAndDown"
      >
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
        <PerfectScrollbar
          tag="ul"
          class="flex-grow-1"
          :options="{ wheelPropagation: true }"
        >
          <DetailLeftSidebarOnConversation
            v-model:isDrawerOpen="isLeftSidebarOpen"
            :customer-detail="customerDetailData"
            :priv="priv"
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
        </PerfectScrollbar>
      </VNavigationDrawer>
      <VMain class="chat-content-container">
        <VCardText 
          v-if="isLeftSidebarOpen == false"
          class="d-flex flex-row align-center text-black font-weight-bold row2"
        >
          <VBtn
            variant="text"
            color="default"
            icon
            size="small"
            class="d-md-none me-3"
            @click="isLeftSidebarOpen = true"
          >
            <VIcon
              size="24"
              icon="mdi-menu"
            />
          </VBtn>
        </VCardText>
        <div class="d-flex flex-column h-100">
          <PerfectScrollbar
            ref="messagesBox"
            tag="ul"
            :options="{ wheelPropagation: true }"
            class="flex-grow-1"
            @ps-scroll-up="handleVerticalScrollEvent"
          >
            <ChatLog
              :messages="messages"
              :chat-template-body="chatTemplateBody"
              :compare-time-stamp="compareTimeStamp"
              :to-time-d-m-y-h-m="toTimeDMYHM"
              :to-time-h-m="toTimeHM"
              :status-color="statusColor"
              :status-icon="statusIcon"
              :key="base64ForAttachment"
            /> 
            <!-- :user-name-agent="ticketDetailData.servicing_agent" -->
          </PerfectScrollbar>
          <VForm
            class="d-flex align-center pt-1 mb-2 mx-5"
            :disabled="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
            @submit.prevent="() => {
              if (!isShowSelectTemplate && myTextMessage !== '') {
                sendMessage(messageType, {body: myTextMessage})
              } else if (isShowSelectTemplate && myTemplateMessage !== '') {
                sendTemplateMessage()
              }
            }"
          >
            <VTextField
              v-if="!isShowSelectTemplate"
              v-model="myTextMessage"
              variant="solo"
              class="pe-3"
              placeholder="Type your message..."
              autofocus
            />
            <VSelect
              v-if="isShowSelectTemplate"
              v-model="myTemplateMessage" 
              :items="itemsTemplate" 
              item-title="text"
              variant="solo"
              placeholder="Choose your template"
              class="custom-height-select"
              :menu-props="{
              closeOnClick: true,
              closeOnContentClick: true,
              }"
            >
              <template #append-inner>
                <VBtn
                  class="ma-0"
                  icon="mdi-close-circle-outline"
                  variant="text"
                  size="x-small"
                  @click="
                    myTemplateMessage = '',
                    isShowSelectTemplate = false
                  "
                />
              </template>
              <template v-slot:item="{ props, item }" class="pa-0">
                  <VListItem
                    class="custom-dropdown"
                    @click="() => {
                      getTemplateParameter(item.raw.templateID)
                      myTemplateMessage = props
                    }"
                  >
                    <VListItemTitle class="pb-1">
                      <VBtn
                        class="text-none"
                        variant="tonal"
                        color="grey-500"
                        :flat="true"
                      >
                        <div class="change-color-btn-text">
                          {{ item.raw.name }}
                        </div>
                      </VBtn>
                    </VListItemTitle>
                    <VListItemSubtitle class="wrap-text text-black font-weight-medium">
                      {{ item.raw.text }}
                    </VListItemSubtitle>
                  </VListItem>
              </template>
            </VSelect>

            <div class="pl-2">
              <div class="d-flex justify-center pb-1">
                <VBtn
                  class="px-7"
                  append-icon="bi:send"
                  :disabled="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                  @click="() => {
                    if (!isShowSelectTemplate && myTextMessage !== '') {
                      sendMessage(messageType, {body: myTextMessage})
                    } else if (isShowSelectTemplate && myTemplateMessage !== '') {
                      sendTemplateMessage()
                    }
                  }"
                >
                  Send
                </VBtn>
              </div>
              <div class="d-flex justify-center">
                <VBtn
                  class=""
                  color="contact-green"
                  :disabled="!priv.hasOwnProperty('create_conversation') && Object.keys(priv).length !== 0"
                  @click="getTemplates()"
                >
                  Template
                </VBtn>
              </div>
            </div>
          </VForm>
        </div>
      </VMain>
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
          :list-note="listNote"
          :to-time-d-m-y-h-m="toTimeDMYHM"
          :priv="priv"
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
