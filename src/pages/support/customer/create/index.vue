<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
// import DetailLeftSidebarOnConversation from '@/components/DetailLeftSidebarOnConversation.vue'
// import DetailTicketOnConversation from '@/components/DetailTicketOnConversation.vue'
// import ListOfTemplates from '@/components/ListOfTemplates.vue'
// import TicketsOnConversation from '@/components/TicketsOnConversation.vue'
import { useGlobalStore } from '@/store/useGlobalStore'

const store = useGlobalStore()
const route = useRoute()
const router = useRouter()

const toDetailCustomer = () => {
  router.push('/support/customer/' + customerPhoneNumber.value)
  // router.replace('/support/customer/' + customerPhoneNumber.value)
}

const goBackToPrevious = () => {
  router.go(-1)
}

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

const showProgressCircular = ref(false)

// =============================================== customer detail variables
const customerDetailData = ref({
  customer_id: '',
  name: '',
  address: '',
  phone_number: route.params.id,
  email: '',
})

const responseErrorNotFound = ref('')
const customerPhoneNumber = ref('')

// =============================================== ticket variables
const tableHeader = ref(['No', 'Ticket ID', 'Status', 'Phone Number', 'Create Time', 'Category', 'Description'])
const tableDataTickets = ref([])

const totalPage = ref(1)
const totalRowTickets = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const listNote = ref([])

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


// =============================================== customer operation
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

      console.log("response di createCustomer=", response)

      customerPhoneNumber.value = response.phone_number

      showProgressCircular.value = false
      // toDetailCustomer()
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
    createCustomer()
    break
  default:
    break
  }
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
  errorMessage.value = errMessage
  isError.value = true
}

// =============================================== User interaction
const isLeftSidebarOpen = ref(true)
const isTicketDetailOpen = ref(false)
const confirmationDialog = ref(false)
const successDialog = ref(false)

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData.priv

console.log("---------- hasil priv=", priv)

const successDialogProps = ref({
  subject: '',
})

const confirmDialogProps = ref({
  confirmationStyling: '',
  messageTitle: '',
  op: '',
})

const toTicketListOnConversation = () => {  
  if (localStorage.getItem('ticket_id')) {
    localStorage.removeItem('ticket_id')       
  }
  resetFormTicket()
  isTicketDetailOpen.value = false
}

const closeDialog = () => {  
  if (localStorage.getItem('ticket_id')) {
    localStorage.removeItem('ticket_id')       
  }    
  confirmationDialog.value = false
  successDialog.value = false

  toDetailCustomer()
}

// =============================================== On Life Cycle Event

onMounted(() => {
  console.log('Chat finish initiated di [id]')

  const isEmbeddedSignup = store.payloadFin.embedded_signup
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
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
          @click="goBackToPrevious"
        />
        <VSpacer />
        <!-- <VBtn
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
        </VBtn> -->
      </VCardActions>
      <VDivider />
      <DetailLeftSidebarOnConversation
        :customer-detail="customerDetailData"
        :priv="priv"
        :isCreateCustomer="true"
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
    <!-- <VCard>
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
            // fetchTicketDetail()
          }"
        />
      </div>
      <div v-else-if="isTicketDetailOpen">       
        <DetailTicketOnConversation 
          :ticket-detail="ticketDetailData"
          :isCreateCustomer="true"
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
    </VCard> -->

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
