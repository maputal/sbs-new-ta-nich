<script setup>
import { useGlobalStore } from '@/store/useGlobalStore';

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

const tableHeader = ref(['No', 'Name', 'Phone Number', 'Chat Notification'])

const tableData = ref([])
const totalPage = ref(1)
const totalConversations = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const showProgressCircular = ref(true)

const interval = ref(null)

const tempFilter = ref({
  search: '',
})

const filter = ref({
  search: '',
})

// Only for development purposes
function dummymoffasdoconversationretrieves (params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    conversations : [
      {
        name: 'Lisa',
        phone_number: '6281210028232',
        total_unread_messages: 0,
        last_read_user: {
          user_id: 1, 
          user_name: 'linaa',
        },
      },
      {
        name: 'Ady Pandey',
        phone_number: '6281237615158',
        total_unread_messages: 12,
        last_read_user: {
          user_id: 2, 
          user_name: 'satriaaa',
        },
      },
      {
        name: 'Satria',
        phone_number: '6287710635667',
        total_unread_messages: 6,
        last_read_user: {
          user_id: 1, 
          user_name: 'linaaa',
        },
      },
    ],
    total_pages : 1,
    total_rows : 3,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}

/////////////////////////////////////////////////////////////

const onDataError = e => {
  showProgressCircular.value = false
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const fetchConversations = () => {
  console.log('fetchBroadcasts')

  let params = {
    row_length: rowPerPage.value,
    current_page: currentPage.value,    
  }

  if (filter.value.search != '') {
    params.search = filter.value.search
  }

  // dummymoffasdoconversationretrieves(
  //   params, 
  //   onFetchConversations, 
  //   onDataError,
  // )

  window.moffas.do_request(
    'get_conversations',
    params, 
    onFetchConversations,
    onDataError,
  )
}

const onFetchConversations = data => {
  
  const response = JSON.parse(data)

  console.log('response')
  console.log(response)

  
  if (response.hasOwnProperty('trace_id')){
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableData.value = response.conversations
  totalPage.value = response.total_page
  totalConversations.value = response.total_conversations 
  
  showProgressCircular.value = false
}

// 👉 Fetch Conversations
watch(fetchConversations)

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

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalConversations.value } entries`
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

  interval.value = setInterval(() => {
    fetchConversations()
  }, 3000)
})

onUnmounted (() => {
  clearInterval(interval.value)
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
            Conversation List
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
      </VCardText>      
      <VTable
        class="text-no-wrap"
        style="border-radius: 0;"
      >
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
                Chat Notification 
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
            <td class="text-center">           
              <RouterLink
                class="text-black pl-3"
                :to="'/support/conversation/' + row.customer_phone_number"
              >
                {{ row.customer_name }}
              </RouterLink> 
            </td>
            <td class="text-center">           
              <RouterLink
                class="text-black pl-3"
                :to="'/support/conversation/' + row.customer_phone_number"
              >
                {{ row.customer_phone_number }}
              </RouterLink> 
            </td>
            <td class="text-center">
              <RouterLink
                class="text-black pl-3"
                :to="'/support/conversation/' + row.customer_phone_number"
              >
                <p v-if="row.total_unread_messages == 0">
                  Read by {{ row.last_read_user.user_name }} ({{ row.last_read_user.user_role }})
                </p>
                <VBadge
                  v-else
                  color="error"
                  :content="row.total_unread_messages"
                  inline
                />
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
