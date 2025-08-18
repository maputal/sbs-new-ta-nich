<script setup>
import { downloadFile } from '@/@core/utils/downloadFile';
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import { toTimeDMYHMS } from '@/@core/utils/timeUtils';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

const goBack = () => {
  appStore.currentIMEI = route.params.id
  router.go(-1)
}

const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}
// ===============================================  
const tableHeader = ref(['No','MSISDN', 'IMEI', 'Package Name', 'Status', 'Timestamp'])
const tableData = ref([])
const totalPage = ref(1)
const totalRow = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])

function dummymoffasdofetchData(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: [
      { package_id: 1, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 2, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "FRAUD", timestamp: "1754556300", note: 'Diblokir' },
      { package_id: 3, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "TERMINATED", timestamp: "1754556300", note: 'Nomor sudah dinonaktifkan' },
      { package_id: 4, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "ACTIVE", timestamp: "1754556300", note: 'Nomor aktif dan terdaftar di sistem' },
      { package_id: 5, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "FAILED", timestamp: "1754556300", note: 'Proses gagal' },
      { package_id: 6, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 7, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 8, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 9, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 10, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 11, package_name: "Paket StreamMax", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
      { package_id: 12, package_name: "Paket Hiburan Komplit", msisdn: "12345678", imei: "354028074239107", status: "ERROR", timestamp: "1754556300", note: 'Kode area tidak dikenali' },
    ],
    total_pages: 2,
    total_rows: 20,
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}
const fetchData = () => {
  console.log('Code fetchData!')

  appStore.showLoader()

  const params = {
    row_length: rowPerPage.value,
    page_number: currentPage.value,
    msisdn: route.params.id,
  }

  // dummymoffasdofetchData | taSecure_POST
  dummymoffasdofetchData(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      tableData.value = response.data   
      totalPage.value = response.total_pages
      totalRow.value = response.total_rows

      appStore.hideLoader()
    },
    onDataError
  )
}

watch(fetchData)

// 👉 Watch currentPage
watchEffect(() => {
  console.log('masuk Watch currentPage')
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const numberTable = ref(0)

const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value
  
  numberTable.value = firstIndex  

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRow.value } entries`
})


// =============================================== Download
const downloadAsDoc = (type) => {
  appStore.showLoader()

  // Prepare CSV/Excel data
  const headers = tableHeader.value
  const rows = tableData.value.map((row, index) => [
    numberTable.value + index,
    row.msisdn,
    row.imei,
    row.package_name,
    row.status,
    toTimeDMYHMS(row.timestamp),
  ]);


  downloadFile({
    headers,
    rows,
    fileName: 'History MSISDN',
    type
  })

  appStore.hideLoader()
}

// =============================================== User interaction
const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

// =============================================== On Life Cycle Event
onMounted(() => {
  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }

  fetchData()
})
</script>

<template>
  <section>
    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Search IMEI
      </h6>
      <!-- <p class="text-subtitle-1 mb-2 font-weight-medium">
        Secure Bundling System
      </p> -->
    </div>

    <VCard class="full-height-card px-4">
      <VCardTitle class="pt-3 pb-2">
        <VRow class="align-center justify-space-between">
          <VCol cols="12" md="4" class="d-flex align-center">
            <VBtn variant="tonal" color="#4F4F4F" icon="mdi-arrow-left" @click="goBack" />
          </VCol>
          <VCol cols="12" md="2" class="d-flex justify-end px-0">
            <VLabel class="ma-0 text-black font-weight-black">History IMEI</VLabel>
          </VCol>
        </VRow>
      </VCardTitle>

      <VDivider />

      <div class="overflow-y-auto">
        <VCardText class="text-black font-weight-bold">
          <VRow>
            <VCol cols="12" md="9" class="d-flex align-center">
              <span class="me-3">Show</span>
              <div>
                <VSelect
                  v-model="rowPerPage"
                  class="pagination-select rounded"
                  density="compact"
                  focused
                  :items="[10, 20, 30, 50]"
                />
              </div>
              <span class="ms-3">entries</span>
            </VCol>
            <VCol cols="12" md="3" class="d-flex align-center justify-end">
              <VBtn
                class="text-none"
                rounded="md"
                size="small"
                color="success"
                prepend-icon="mdi-file-excel"                  
                @click="downloadAsDoc()"
                :disabled="!tableData.length"
              >
                Export to Excel
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <div class="">
          <CustomTable
            :table-header-names="tableHeader"
            :table-data-length="tableData.length"
          >
            <template #tableBody>              
              <tr
                v-for="(row, index) in tableData"
                :key="index"
                class="bg-hover"
              >
                <td class="text-center">
                  {{ numberTable + index }}
                </td>
                <td class="pl-5">{{ row.msisdn }}</td>
                <td class="pl-5">{{ row.imei }}</td>
                <td class="pl-5">{{ row.package_name }}</td>
                <td class="text-center pl-5">{{ row.status }}</td>
                <td class="text-center pl-5">{{ toTimeDMYHMS(row.timestamp) }}</td>
              </tr>
            </template>
          </CustomTable>
        </div>
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
      </div>
    </VCard>
  </section>
</template>
  
<style lang="scss" scoped>
.full-height-card {
  height: 100%;
}
.bg-hover:hover {
  background-color: rgba(68, 73, 74, 5%);
  // cursor: pointer;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
