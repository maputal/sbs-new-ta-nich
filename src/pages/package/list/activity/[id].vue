<script setup>
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Stores
const appStore = useAppStore()
const globalStore = useGlobalStore()

// Get package ID from route parameter
const route = useRoute()
const packageId = route.params.id

const router = useRouter()

// Page title and breadcrumb
const pageTitle = ref("Edit Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.user || !globalStore.token) {
    router.push('/')
    
    return false
  }
  
  return true
}

// Date formatting utility
const toTimeDMYHM = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  let date = dd < 10 ? '0' + dd : dd

  return (
    date +
    '/' +
    month +
    '/' +
    year+
    ' ' +
    hours +
    ':' +
    minutes.toString().padStart(2, '0') + 
    ':' +
    seconds.toString().padStart(2, '0')
  )
}

// Reactive data
const activityData = ref([])
const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = ref(1)

// Table headers
const tableHeaders = ['No', 'Time', 'User', 'Action']

// Mock activity data - replace with actual API call
const mockActivityData = [
  {
    id: 1,
    timestamp: 1735228505, // 2025-12-25 21:55:05
    user: 'Telekses',
    action: 'create package',
  },
  {
    id: 2,
    timestamp: 1735142325, // 2025-12-22 04:25:05
    user: 'Telekses',
    action: 'upload 200 MSISDN',
  },
  {
    id: 3,
    timestamp: 1735142100, // 2025-12-22 04:21:40
    user: 'Telekses',
    action: 'upload 200 MSISDN',
  },
  {
    id: 4,
    timestamp: 1735141820, // 2025-12-22 04:17:00
    user: 'Telekses',
    action: 'upload 200 MSISDN',
  },
  {
    id: 5,
    timestamp: 1735051982, // 2025-08-13 16:13:02
    user: 'Telekses',
    action: 'upload 200 MSISDN',
  },
]

// Computed properties
const filteredData = computed(() => {
  let filtered = activityData.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()

    filtered = filtered.filter(item =>
      item.user.toLowerCase().includes(query) ||
      item.action.toLowerCase().includes(query),
    )
  }

  return filtered
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return filteredData.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = filteredData.value.length > 0 ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0
  const end = Math.min(start + itemsPerPage.value - 1, filteredData.value.length)
  
  return `Showing ${start} to ${end} of ${filteredData.value.length} entries`
})

// Calculate total pages
const calculateTotalPages = () => {
  totalPages.value = Math.ceil(filteredData.value.length / itemsPerPage.value)
}

// Methods
const fetchActivityLog = async () => {
  if (!checkAuthentication()) return

  appStore.showLoader()

  try {
    // TODO: Replace with actual API call
    // const response = await window.moffas.do_request('get_package_activity', { package_id: packageId })

    // Using mock data for now
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    activityData.value = mockActivityData

    calculateTotalPages()
    
  } catch (error) {
    console.error('Failed to fetch activity log:', error)
    appStore.showError(error.message || 'Failed to load activity log. Please try again.')
  } finally {
    appStore.hideLoader()
  }
}

// Watch for search changes and recalculate pagination
const onSearchChange = () => {
  currentPage.value = 1
  calculateTotalPages()
}

const goBack = item => {
  router.push(`/package/list/${item}`)
}

// Lifecycle
onMounted(() => {
  if (checkAuthentication()) {
    fetchActivityLog()
  }
})
</script>

<template>
  <div class="package-activity-page">
    <!-- Page Header -->
    <VRow class="mb-6">
      <VCol cols="12">
        <div class="d-flex align-baseline">
          <div>
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ pageTitle }}
            </h2>
            <p class="text-h5">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>
      </VCol>
    </VRow>

    <!-- Activity Log Table -->
    <VCard>
      <VCardTitle>
        <div class="d-flex justify-space-between align-center mt-2 mb-2">
          <VBtn
            variant="flat"
            icon="mdi-arrow-left"
            color="#f0f0f0"
            size="small"
            @click="goBack(packageId)"
          />
          <h4 class="text-h5 font-weight-bold mb-2">
            Package Activity Log
          </h4>
        </div>    
      </VCardTitle>
      <VDivider />

      <!-- Table Controls -->
      <VCardText class="pb-0">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="d-flex align-center">
            <span class="text-body-2 me-2">Show</span>
            <VSelect
              v-model="itemsPerPage"
              :items="[10, 25, 50, 100]"
              variant="outlined"
              density="compact"
              style="width: 80px"
              hide-details
              @update:model-value="
                () => {
                  currentPage = 1;
                  calculateTotalPages();
                }
              "
            />
            <span class="text-body-2 ms-2">entries</span>
          </div>

          <div class="d-flex align-center">
            <span class="text-body-2 me-2">Search:</span>
            <VTextField
              v-model="searchQuery"
              variant="outlined"
              density="compact"
              style="width: 250px"
              hide-details
              placeholder="Search activities..."
              clearable
              @input="onSearchChange"
            />
          </div>
        </div>
      </VCardText>

      <!-- Data Table -->
      <VCardText class="pt-0">
        <VTable
          class="elevation-0 border"
          style="border-collapse: separate; border-spacing: 0"
        >
          <thead>
            <tr class="th-background-color">
              <th
                v-for="(header, index) in tableHeaders"
                :key="header"
                class="text-center text-subtitle-1 font-weight-bold"
                :class="{ 'border-r': index < tableHeaders.length - 1 }"
                style="border-right: 1px solid white"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="appStore.showProgressCircular">
              <td
                :colspan="tableHeaders.length"
                class="text-center py-8"
              >
                <VProgressCircular
                  :size="40"
                  color="primary"
                  indeterminate
                />
                <p class="mt-2 mb-0">
                  Loading activity log...
                </p>
              </td>
            </tr>
            <tr v-else-if="!paginatedData.length">
              <td
                :colspan="tableHeaders.length"
                class="text-center py-8 text-body-1"
              >
                No activity data available
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="hover:bg-grey-50"
                :class="{ 'bg-grey-lighten-4': index % 2 === 1 }"
                style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
              >
                <!-- No -->
                <td
                  class="text-center pa-4"
                  style="
                    width: 60px;
                    border-right: 1px solid rgba(0, 0, 0, 0.12);
                  "
                >
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <!-- Time -->
                <td
                  class="text-center pa-4"
                  style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <span class="font-weight-medium">{{
                    toTimeDMYHM(item.timestamp)
                  }}</span>
                </td>

                <!-- User -->
                <td
                  class="text-center pa-4"
                  style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <span class="font-weight-medium">
                    {{ item.user }}
                  </span>
                </td>

                <!-- Action -->
                <td class="text-center pa-4">
                  <span class="font-weight-medium">{{ item.action }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </VTable>
      </VCardText>

      <!-- Pagination -->
      <VDivider />
      <VCardText class="d-flex justify-space-between align-center">
        <span class="text-body-2 text-medium-emphasis">
          {{ paginationInfo }}
        </span>

        <VPagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          size="small"
          @update:model-value="calculateTotalPages"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.package-activity-page {
  padding: 24px;
  position: relative;
}

.th-background-color {
  background-color: #ffc107 !important;
}

.th-background-color th {
  background-color: #ffc107 !important;
  color: #000 !important;
  font-weight: 600 !important;
  padding: 12px 16px !important;
}

:deep(.v-table) {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-table__wrapper) {
  border-radius: 4px;
}

.border-r {
  border-right: 1px solid white !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .package-activity-page {
    padding: 16px;
  }
}

.hover\:bg-grey-50:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.bg-grey-lighten-4 {
  background-color: #f0f0f0;
}
</style>
