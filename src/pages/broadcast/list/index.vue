<script setup>
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
}
 
const toAddBroadcast = () => {
  router.replace('/broadcast/create')
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

const toDateDMY = (unixTimestamp) => {
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
  
  return (
    date +
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
  )
}

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableHeader = ref(['No', 'User', 'Title', 'Schedule', 'Row Count', 'Status', 'Create Time', ''])

const tableData = ref([])
const totalPage = ref(1)
const totalBroadcast = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const showProgressCircular = ref(true)

const successDialog = ref(false)

const sync = ref([])

const tempFilter = ref({
  search: '',
})

const filter = ref({
  search: '',
})

const successDialogProps = ref({
  subject: '',
})

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

/////////////////////////////////////// Operation
const getSyncTemplates = () => {
  console.log('getSyncTemplates')

  const params = {}

  window.moffas.do_request(
    'sync_templates',
    params, 
    onGetSyncs,
    onDataError,
  )
}

const onGetSyncs = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  // sync.value = response.data.templates

  successDialogProps.value.subject = 'synchronization'
  successDialog.value = true
}

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const fetchBroadcasts = () => {
  console.log('fetchBroadcasts')

  let params = {
    row_length: rowPerPage.value,
    current_page: currentPage.value    
  }

  if (filter.value.search != '') {
    params.search = filter.value.search
  }

  window.moffas.do_request(
    'get_broadcasts',
    params, 
    onFetchBroadcasts,
    onDataError,
  )
}

const onFetchBroadcasts = data => {
  
  const response = JSON.parse(data)
  
  if (response.hasOwnProperty('trace_id')){
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.broadcasts
  totalPage.value = response.total_pages
  totalBroadcast.value = response.total_rows 
  
  showProgressCircular.value = false
}

// 👉 Fetch UserManagement
watch(fetchBroadcasts)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalBroadcast.value } entries`
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
        Broadcast List
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Broadcast list their respective status and delivery summary
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
      <VCardText
        class="d-flex flex-row align-center text-black font-weight-bold row2 pr-11"
      >
        <VSpacer />
        <VBtn
          class="text-none px-4 me-3"
          rounded="lg"
          prepend-icon="mdi-cloud-sync-outline"
          variant="flat"
          :disabled="!priv.hasOwnProperty('update_template') && Object.keys(priv).length !== 0" 
          @click="() => {
            getSyncTemplates()            
          }"
        >
          Sync Template
        </VBtn>
        <VBtn       
          class="text-none px-4"
          rounded="lg"
          prepend-icon="mdi-plus"
          variant="flat"
          :disabled="!priv.hasOwnProperty('create_broadcast') && Object.keys(priv).length !== 0" 
          @click="toAddBroadcast"
        >
          Add New Broadcast
        </VBtn>
      </VCardText>
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
            cols="12"
            class="mr-2"
            v-model="tempFilter.search"
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
      </VCardText>      
      <VTable class="text-no-wrap" style="border-radius: 0;">
        <thead>
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
                User 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Title 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border d-flex justify-center"
              > 
                Schedule 
              </span>
            </th>
            <th class=" th-background-color">
              <span
                class="th-span-border-row-count d-flex justify-center"
              > 
                Row Count
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
                Create Time 
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="bg-hover"
          >
            <td class="text-center text-black">
              {{ numberTable + index }}
            </td>
            <td>
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ (row.user_email) }}
              </RouterLink>              
            </td>
            <td>
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ (row.title) }}
              </RouterLink> 
            </td>
            <td>
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ toDateDMY(row.schedule) }}
              </RouterLink>              
            </td>
            <td class="text-center">
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ (row.total_rows) }}
              </RouterLink>              
            </td>
            <td>
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ (row.st) }}
              </RouterLink>              
            </td>
            <td>
              <RouterLink
                class="text-black pl-3"
                :to="'/broadcast/detail/' + row.broadcast_id"
              >
              {{ toDateDMY(row.created_time) }}
              </RouterLink>              
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
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="() => {
        fetchBroadcasts()
      }"
    />
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
