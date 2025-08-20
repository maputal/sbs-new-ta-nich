<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

// =============================================== meta data  
const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}

// =============================================== group section
const groupID = ref('')
const groupName = ref('')

// =============================================== package section
const searchPackage = ref('')
const filter = ref({
  search: '',
})

const tableHeader = ref(['Package Name'])
const tableData = ref([])
const totalPage = ref(1)
const totalRow = ref(0)

const checkedRows = ref([])

const rowPerPagePackage = ref(10)
const currentPagePackage = ref(1)
const selectedRows = ref([])

const toggleSelectAll = (isChecked) => {
  if (isChecked) {
    checkedRows.value = tableData.value.map(row => row.package_id)
  } else {
    checkedRows.value = []
  }
}

function dummymoffasdogetPackageGroup(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: [
      { package_id: 1, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 2, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 3, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 4, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 5, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 6, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 7, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 8, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 9, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 10, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 11, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 12, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
    ],
    total_pages: 2,
    total_rows: 20,
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}

const getAllPackage = () => {
  console.log('Code getAllPackage!')

  appStore.showLoader()

  const params = {
    row_length: rowPerPagePackage.value,
    page_number: currentPagePackage.value,
    search: searchPackage.value || '',
  }

  console.log('params getAllPackage=', params)

  // dummymoffasdogetPackageGroup | taSecure_POST
  dummymoffasdogetPackageGroup(
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

const addPackageGroup = () => {
  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully added this package to the group',
    action: 'success',
    onSucc: () => {
      checkedRows.value = []
      appStore.hideLoader()
      goBack()
    },
  })

  return

  console.log('Code addPackageGroup!')
  appStore.showLoader()

  const params = {
    group_id: route.params.id,
    group_name: groupName.value,
    package: checkedRows.value,
  }

  globalRequest(
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

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully added this package to the group',
        action: 'success',
        onSucc: () => {
          checkedRows.value = []
          appStore.hideLoader()
          goBack()
        },
      })
    },
    onDataError
  )
}

// 👉 Fetch All Package
watch(getAllPackage)

// 👉 Watch currentPagePackage
watchEffect(() => {
  console.log('masuk Watch currentPagePackage')
  if (currentPagePackage.value > totalPage.value && totalPage.value > 0)
    currentPagePackage.value = totalPage.value
})

// 👉 Computing pagination data
const numberTable = ref(0)

const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPagePackage.value - 1) * rowPerPagePackage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPagePackage.value - 1) * rowPerPagePackage.value
  
  numberTable.value = firstIndex  

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRow.value } entries`
})

// =============================================== User interaction

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

// console.log("---------- hasil priv=", priv)

const chooseConfirmPopup = (data) => {
  appStore.setPopup({
    title: 'Add Package Group',
    word: 'Are you sure you want to add this package to the group?',
    action: 'confirm',
    onSucc: () => {
      addPackageGroup()
    },
  })
}

// =============================================== On Life Cycle Event
onMounted(() => {
  console.log('mounted group')

  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }

  if (localStorage.getItem('current_group')) {
    let group = JSON.parse(localStorage.getItem('current_group'))
    groupID.value = group?.group_id || ''
    groupName.value = group?.group_name || ''     
  }

  getAllPackage()
})

onBeforeRouteLeave ((to, from) => {
  if(to.name != 'group-management'){
    if (localStorage.getItem('current_group')) {
      localStorage.removeItem('current_group')       
    }
  }
})
</script>

<template>
  <section>
    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Group
      </h6>
      <!-- <p class="text-subtitle-1 mb-2 font-weight-medium">
        Secure Bundling System
      </p> -->
    </div>

    <VCard>
      <VCardTitle class="pt-3 pb-2">
        <VRow class="align-center justify-space-between">
          <VCol cols="12" md="4" class="d-flex align-center">
            <VBtn variant="tonal" color="#4F4F4F" icon="mdi-arrow-left" @click="goBack" />
          </VCol>
          <VCol cols="12" md="2" class="d-flex justify-end">
            <VLabel class="ma-0 text-black font-weight-black">Add Package Group</VLabel>
          </VCol>
        </VRow>
      </VCardTitle>

      <VDivider />
      
      <div class="overflow-y-auto">
        <!-- SINI YA SA!! -->
        <VCardText class="text-black font-weight-bold pb-0">  
          <VRow class="align-center mb-5">
            <VCol cols="12" md="2" class="d-flex align-center">
              <VLabel class="ma-0 text-black font-weight-black">Group Name:</VLabel>
            </VCol>

            <VCol cols="12" md="5">
              <VTextField
                v-model="groupName"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Group Name is required']"
                readonly
                focused
              />
            </VCol>
          </VRow>

          <VLabel class="ma-0 text-black font-weight-black">Choose Package:</VLabel>
          <VRow>
            
            <VCol cols="12" md="5" class="d-flex align-center">
              <span class="me-3">Show</span>
              <div>
                <VSelect
                  v-model="rowPerPagePackage"
                  class="pagination-select rounded"
                  density="compact"
                  focused
                  :items="[10, 20, 30, 50]"
                />
              </div>
              <span class="ms-3">entries</span>
            </VCol>
            <VCol cols="12" md="4" class="d-flex align-center">
              <VTextField
                v-model="searchPackage"
                label="Search"
                placeholder="Package Name"
                prepend-inner-icon="mdi-magnify"
                class="pa-3"
                variant="outlined"
                clearable
                focused
                density="compact"
                @keydown.enter.prevent 
                @keyup.enter="filter.search = searchPackage"
              />
            </VCol>
            <VCol cols="12" md="3" class="d-flex align-center justify-end">
              <VBtn
                class="text-none"
                rounded="md"
                size="small"
                prepend-icon="mdi-archive-plus-outline"                  
                @click="chooseConfirmPopup()"
                :disabled="!tableData.length || !checkedRows.length"
              >
                Submit
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <div class="">
          <CustomTable
            :table-header-names="tableHeader"
            :table-data-length="tableData.length"
            :show-checkbox="true"
            :selected-rows="checkedRows"
            @toggleSelectAll="toggleSelectAll"
          >
            <template #tableBody>
              <tr
                v-for="(row, index) in tableData"
                :key="index"
                class="bg-hover"
              >
                <td class="text-center d-flex justify-center align-center">
                  <VCheckbox
                    density="compact"
                    hide-details
                    color="primary"
                    :value="row.package_id"
                    v-model="checkedRows"
                  />
                </td>
                <td class="pl-5">{{ row.package_name }}</td>
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
            v-model="currentPagePackage"
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
.chat-content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-list-sidebar {
  display: flex;
  flex-direction: column;
}

.full-height-container {
  height: 75vh;
}

.full-height-card {
  height: 100%;
}

.full-height-layout {
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
