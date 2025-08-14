<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'


const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
}

const toList = () => {
  showProgressCircular.value = false
  router.replace('/broadcast/list')
}

const toCreateBroadcast = () => {
  router.replace('/broadcast/create')
}

const toReviseBroadcast = () => {
  // router.replace('/broadcast/revise/' + JSON.stringify(broadcastDetail.value))
  router.replace('/broadcast/revise/' + Number(route.params.id))
  // router.replace('/broadcast/' + Number(route.params.id) + '/revise')
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

const todayDateF = (type='') => {
  let today = new Date()
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date =
      dd < 10 ? '0' + dd : dd
  
  if(type == 'csvName'){
    return (
        date +
        '' +
        month +
        '' +
        year
    )
  } else {
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
}

const toDateDMY = (unixTimestamp, type) => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  let date =
      dd < 10 ? '0' + dd : dd
      
  let finalDate = ''
  if (type == 'csvmaker') {
    let formattedMonth;
    if (month < 10) {
        formattedMonth = '0' + month;
    } else {
        formattedMonth = month;
    }

    finalDate = date +
    '-' +
    formattedMonth +
    '-' +
    year+
    ' ' +
    hours.toString().padStart(2, '0') + 
    ':' + 
    minutes.toString().padStart(2, '0') + 
    ':' + 
    seconds.toString().padStart(2, '0')
  } else {
    finalDate = date +
    ' ' +
    months[month] +
    ' ' +
    year+
    ' ' +
    hours.toString().padStart(2, '0') + 
    ':' + 
    minutes.toString().padStart(2, '0') + 
    ':' + 
    seconds.toString().padStart(2, '0')
  }
  
  return finalDate
}

const processRows = () => {  
  return (
    broadcastDetail.value.procesed_rows +
    '/' +
    broadcastDetail.value.totalRows
  )
}


const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableData = ref([])
const totalPage = ref(1)
const totalRow = ref(0)

const dataCDR = ref([])

const currentPage = ref(1)

const confirmationDialog = ref(false)
const successDialog = ref(false)
const isFinalizedSuccess = ref(false)
const showProgressCircular = ref(false)

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

const broadcastDetail = ref({
  title: '',
  template_name: '',
  template_id: '',
  broadcast_id: 0,
  schedule: 0,
  procesed_rows: '',
  totalRows: '',
  csv_name: '',
  group_name: '',
  group_id: '',
  st:'',
  referenceFrom:'',
  rejected_lines:[]
})

const successDialogProps = ref({
  subject: '',
})

const onDataError = e => {
  console.log('masuk error di onDataError')
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

/////////////////////////////////////// Operation
const fetchDetails = () => {
  console.log('fetchDetails')
  
  let params = {
    broadcast_id: Number(route.params.id),
    
  }

  window.moffas.do_request(
    'get_broadcast',
    params, 
    onFetchDetails,
    onDataError,
  )
}

const onFetchDetails = data => {
  const response = JSON.parse(data)

  console.log('ini onFetchDetails')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  showProgressCircular.value = false

  broadcastDetail.value.title = response.title
  broadcastDetail.value.template_name = response.template_name
  broadcastDetail.value.template_id = response.template_id
  broadcastDetail.value.broadcast_id = response.broadcast_id
  broadcastDetail.value.schedule = response.schedule
  broadcastDetail.value.procesed_rows = response.processed_rows
  broadcastDetail.value.totalRows = response.total_rows
  broadcastDetail.value.csv_name = response.reference.filename
  broadcastDetail.value.group_name = response.reference.group_name
  broadcastDetail.value.group_id = response.reference.group_id
  broadcastDetail.value.referenceFrom = response.reference.from
  broadcastDetail.value.st = response.st
  broadcastDetail.value.rejected_lines = response.rejected_lines
}

const fetchFinalizedBroadcast = () => {
  console.log('fetchFinalizedBroadcast')
  
  let params = {
    broadcast_id: Number(route.params.id),      
  }

  window.moffas.do_request(
    'finalize_broadcast',
    params, 
    onFetchFinalizedBroadcast,
    onDataError,
  )
}

const onFetchFinalizedBroadcast = data => {
  const response = JSON.parse(data)

  console.log('ini onFetchFinalizedBroadcast')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    console.log('masuk error di onFetchFinalizedBroadcast if has trace_id')
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  showProgressCircular.value = false

  broadcastDetail.value.st = response.st

  if(broadcastDetail.value.st) {
    successDialogProps.value.subject = 'submit'
    successDialog.value = true
  }
}

const confirmYes = () => {   
  if(showProgressCircular.value == false) {
    fetchFinalizedBroadcast()
  }
  showProgressCircular.value = true
}

const disabledRevise = () => { 
  isFinalizedSuccess.value = true        
}


////////// 👉 Convert Base64 to CSV //////////////
const download = (data) => {
  
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')

  console.log('ini todayDateF', todayDateF('csvName'))

  showProgressCircular.value = false  

  a.setAttribute('href', url)
  a.setAttribute('download', 'CDR_' + broadcastDetail.value.title + '_' + todayDateF('csvName') + '.csv');
  a.click()
}

const csvmaker = (data) => {
  
  //Desired headers in the .csv. Other fields are ignored
  let headers = []
  //Choose your seperator
  const seperator = ",";

  if(data.reports){
    for (let k in data.reports[0]){
      headers.push(k)
    }
  }

  //Prepare csv with a header row and our data
  const csv = [headers.join(seperator),
  ...data.reports.map(row => headers.map(field => `${row[field]}`).join(seperator))
  ]

  console.log('csv di csvmaker', csv)
  let lastUpdate = 'Last updated at: '+ toDateDMY(data.updated_at, 'csvmaker')
  csv.splice(0, 0, lastUpdate)

  return csv.join("\n")
  
}

const base64ToCSV = () => {
  getBroadcastCdr()
}

const getBroadcastCdr = () => {
  console.log('getTemplates')

  const params = {
    broadcast_id: Number(route.params.id),
  }

  window.moffas.do_request(
    'get_broadcast_cdr',
    params, 
    onBroadcastCdr,
    onDataError,
  )
}

const onBroadcastCdr = data => {
  const response = JSON.parse(data)

  console.log('nin response cdr')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    showProgressCircular.value = false
    
    return
  }
  
  dataCDR.value = response
  
  const csvdata = csvmaker(dataCDR.value);
  download(csvdata);
  document.getElementById('action');
}

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0  ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value
    
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRow.value } entries`
})

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
  showProgressCircular.value = true
  fetchDetails()
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
      <VChip
        color="primary"
        variant="flat"
        class="text-capitalize font-weight-bold me-5 mb-7"
        prepend-icon="mdi-access-point"
      >
        Broadcast
      </VChip>
    </div>
    <div>
      <h6 class="text-2xl font-weight-bold mb-2">
        Broadcast Detail
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Broadcast message detail page
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
      <VCardText>
        <VForm
          ref="refVForm"
        >
          <VRow
            class="align-center"
          >
            <VCol              
              cols="12"
              md="3"
              class="pt-8"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >Broadcast Title</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
              class="pt-8"
            >
              <span
                class="ma-4 font-weight-black text-no-wrap"
              >
                {{ broadcastDetail.title }}
              </span>
            </VCol>
            <VCol
              v-if="broadcastDetail.referenceFrom == 'group_id'"              
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >Broadcast Group</span>
            </VCol>
            <VCol
              v-if="broadcastDetail.referenceFrom == 'group_id'"
              cols="12"
              md="8"
            >
              <span
                class="ma-4 font-weight-black text-no-wrap"
              >
                {{ broadcastDetail.group_name }}
              </span>
            </VCol>
            <VCol
              v-if="broadcastDetail.referenceFrom == 'csv'"              
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >CSV Data</span>
            </VCol>
            <VCol
              v-if="broadcastDetail.referenceFrom == 'csv'"
              cols="12"
              md="8"
            >
              <span
                class="ma-4 font-weight-black text-no-wrap"
              >
                {{ broadcastDetail.csv_name }}
              </span>
            </VCol>
            <VCol              
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >Schedule</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <span
                class="ma-4 font-weight-black text-no-wrap"
              >
                {{ toDateDMY(broadcastDetail.schedule) }}
              </span>
            </VCol>
            <VCol              
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >Process Rows</span>
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <span
                class="ma-4 font-weight-black text-no-wrap"
              >
                {{ processRows() }}
              </span>
            </VCol>
            <VCol              
              cols="12"
              md="3"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >CDR</span>
            </VCol>
            <!-- <VCol
              cols="12"
              md="8"
            >
              <VBtn
                class="ml-4 text-none text-black"
                variant="tonal"
                color="grey"
                :disabled="broadcastDetail.st == 'CREATED'"
                @click="() => {
                  if(showProgressCircular == false) {
                    base64ToCSV()
                  }
                  showProgressCircular = true 
                }"
              >
                <div v-if="!showProgressCircular">
                  Download CDR
                </div>
                <div v-else>
                  <VProgressCircular
                    color="primary"
                    indeterminate
                  ></VProgressCircular>
                </div>
              </VBtn>
            </VCol> -->
            <VCol
              cols="12"
              md="8"
            >
              <VBtn
                class="ml-4 text-none text-black"
                variant="tonal"
                color="grey"
                :disabled="broadcastDetail.st == 'CREATED'"
                @click="() => {
                  if(showProgressCircular == false) {
                    base64ToCSV()
                  }
                  showProgressCircular = true 
                }"
              >
                Download CDR
              </VBtn>
              <VAlert
                class="ml-4 mt-2 v-col-7"
                type="warning"
                variant="outlined"
                color="error"
              >
                CSV status messages will be updated every 6 hours within a maximum period of 30 days.
              </VAlert>
            </VCol>
          </VRow>
          <VRow v-if="broadcastDetail.rejected_lines.length && broadcastDetail.st == 'CREATED'">
            <VCol              
              cols="12"
              md="3"
              class="pt-6"
            >
              <span
                class="ma-4 text-black font-weight-black text-no-wrap"
              >Rejected Lines</span>
            </VCol>
            <!-- SECTION Delivery Options -->
            <VCol
              cols="12"
              md="8"
            >
            <v-expansion-panels
              class="ml-4 text-none text-black"
            >
              <v-expansion-panel
              >
              <v-expansion-panel-title>Details</v-expansion-panel-title>
              <v-expansion-panel-text
                v-for="(row, index) in broadcastDetail.rejected_lines"
                :key="index"
              >
                {{ row }}
              </v-expansion-panel-text>                
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- !SECTION Delivery Options -->
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <!-- <VDivider />
      <div>
        <span class="d-flex flex-row align-center text-black font-weight-bold my-4 mx-9">
          Related Wallet Transaction
        </span>
      </div>
      <CustomTable
        :table-header-names="tableHeader" 
        :table-data-length="tableData.length"
      >
        <template #tableBody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
          >
            <td
              v-for="(data, index) in dataHeader"
              :key="index"
              class="text-center"
            >
              <span class="text-black">
                {{ row[data] }}
              </span>
            </td>
          </tr>
        </template>
      </CustomTable> -->
      <VDivider />
      <VCardText class="d-flex align-center font-weight-bold text-black">
        <VBtn
          v-if="
            !isFinalizedSuccess && 
            broadcastDetail.st == 'CREATED'
          "
          class="text-none me-4"
          variant="outlined"
          :disabled="!priv.hasOwnProperty('create_broadcast') && !priv.hasOwnProperty('update_broadcast') && Object.keys(priv).length !== 0"
          @click="toReviseBroadcast"
        >
          Revise
        </VBtn>
        <VBtn
          v-if="!isFinalizedSuccess && broadcastDetail.st == 'CREATED'"
          class="text-none text-white"
          color="#32BCAD"
          variant="flat"
          :disabled="!priv.hasOwnProperty('create_broadcast') && Object.keys(priv).length !== 0"
          @click="() => {
            confirmationDialog = true
          }"
        >
          Finalize
        </VBtn>
        <VSpacer />
        <VBtn
          class="text-none me-4"
          variant="outlined"
          @click="() => {
            if(showProgressCircular == false) {
              toList()
            }
            showProgressCircular = true
          }"
        >
          Back to list
        </VBtn>
        <VBtn
          v-if="priv.hasOwnProperty('create_broadcast') || Object.keys(priv).length === 0"
          class="text-none"
          variant="flat"
          @click="toCreateBroadcast"
        >
          Open as New Request
        </VBtn>
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
    <CustomConfirmDialog
      v-model:is-dialog-visible="confirmationDialog"
      rounded="lg"
      confirmation-styling="2"
      message-title="Are you sure you want to finalized this?"
      @yes="confirmYes"
      @no="showProgressCircular = false"
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="disabledRevise"
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
</style>
  
<route lang="yaml">
  meta:
    requiresAuth: true
</route>
