<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

// Router
const router = useRouter()

// Page title
const pageTitle = ref("List Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Search filters
const searchFilters = ref({
  packageName: "",
  packageCode: "",
  area: "",
  distributor: "",
  bundlingType: "",
  dateFilter: "",
  startDate: "",
  endDate: "",
  expiredFilter: "Active Only",
})

// Table search query
const tableSearchQuery = ref("")

// Filter options
const areas = ref([
  { title: "MC-GTASAPI-ABMR", value: "MC-GTASAPI-ABMR" },
  { title: "MC-TAKASU-AAANG", value: "MC-TAKASU-AAANG" },
  { title: "MC-ABMARVIRAN", value: "MC-ABMARVIRAN" },
  { title: "MC-GBTUTU", value: "MC-GBTUTU" },
])

const distributors = ref([
  { title: "Modern retail", value: "Modern retail" },
  { title: "Semi infra", value: "Semi infra" },
  { title: "Online marketplace", value: "Online marketplace" },
])

const bundlingTypes = ref([
  { title: "Select Bundling Type", value: "" },
  { title: "MISSION", value: "MISSION" },
  { title: "MISSION & IMEI", value: "MISSION & IMEI" },
  { title: "MISSION, IMEI, TAG & OFFER", value: "MISSION, IMEI, TAG & OFFER" },
  { title: "IMEI", value: "IMEI" },
  { title: "MISSION & TAC", value: "MISSION & TAC" },
])

const dateFilterOptions = ref([
  { title: "Yesterday", value: "Yesterday" },
  { title: "Last Week", value: "Last Week" },
  { title: "Last Month", value: "Last Month" },
])

const packageCodes = ref([
  "PKG-SMS-FREELOOK-021",
  "PKG-VIVO-2008-001",
  "PKG-INFRIX-STARTUP-005",
])

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemsPerPageOptions = ref([
  { title: "5", value: 5 },
  { title: "10", value: 10 },
  { title: "25", value: 25 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
])

// Loading states
const isLoading = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)

// Package data
const packages = ref([
  {
    id: 1,
    no: 1,
    packageName: "Paket StreetMix",
    keyword: "SAMSUNG",
    monogami: "YES",
    duration: 30,
    bundlingType: "MISSION",
    startDate: "2025-05-10 08:15:00",
    expiry: "2025-05-30 08:15:00",
    area: "MC-GTASAPI-ABMR",
    mission: 1,
    imei: 0,
    tac: 0,
  },
  {
    id: 2,
    no: 2,
    packageName: "Paket Sosial Media",
    keyword: "TESTER",
    monogami: "YES",
    duration: 15,
    bundlingType: "MISSION & IMEI",
    startDate: "2025-04-05 14:47:12",
    expiry: "2025-06-05 14:47:12",
    area: "MC-TAKASU-AAANG",
    mission: 1,
    imei: 0,
    tac: 0,
  },
  {
    id: 3,
    no: 3,
    packageName: "MaxiPlay",
    keyword: "VIVO",
    monogami: "YES",
    duration: 15,
    bundlingType: "MISSION, IMEI, TAG & OFFER",
    startDate: "2025-05-18 16:53:05",
    expiry: "2025-07-18 16:53:05",
    area: "MC-ABMARVIRAN",
    mission: 1,
    imei: 0,
    tac: 0,
  },
  {
    id: 4,
    no: 4,
    packageName: "Unlimited",
    keyword: "INFRIX",
    monogami: "YES",
    duration: 6,
    bundlingType: "IMEI",
    startDate: "2025-06-01 09:24:41",
    expiry: "2025-06-07 09:24:41",
    area: "MC-GBTUTU",
    mission: 0,
    imei: 1,
    tac: 0,
  },
  {
    id: 5,
    no: 5,
    packageName: "Maxim Text Package",
    keyword: "NADOKF",
    monogami: "YES",
    duration: 10,
    bundlingType: "MISSION & TAC",
    startDate: "2025-11-21 21:58:50",
    expiry: "2025-12-25 21:58:50",
    area: "MC-ABMARVIRAN",
    mission: 0,
    imei: 0,
    tac: 0,
  },
  {
    id: 6,
    no: 6,
    packageName: "Maxim Text Package",
    keyword: "NADOKF",
    monogami: "YES",
    duration: 10,
    bundlingType: "MISSION & TAC",
    startDate: "2025-11-21 21:58:50",
    expiry: "2025-12-25 21:58:50",
    area: "MC-ABMARVIRAN",
    mission: 0,
    imei: 0,
    tac: 0,
  },
  {
    id: 7,
    no: 7,
    packageName: "Maxim Text Package",
    keyword: "NADOKF",
    monogami: "YES",
    duration: 10,
    bundlingType: "MISSION & TAC",
    startDate: "2025-11-21 21:58:50",
    expiry: "2025-12-25 21:58:50",
    area: "MC-ABMARVIRAN",
    mission: 0,
    imei: 0,
    tac: 0,
  },
  {
    id: 8,
    no: 8,
    packageName: "Maxim Text Package",
    keyword: "NADOKF",
    monogami: "YES",
    duration: 10,
    bundlingType: "MISSION & TAC",
    startDate: "2025-11-21 21:58:50",
    expiry: "2025-12-25 21:58:50",
    area: "MC-ABMARVIRAN",
    mission: 0,
    imei: 0,
    tac: 0,
  },
])

// Table headers
const headers = ref([
  { title: "No", key: "no", align: "center", sortable: false, width: "60px" },
  { title: "Package Name", key: "packageName", align: "start" },
  { title: "Keyword", key: "keyword", align: "center" },
  { title: "Monogami", key: "monogami", align: "center" },
  { title: "Duration (Days)", key: "duration", align: "center" },
  { title: "Bundling Type", key: "bundlingType", align: "center" },
  { title: "Start Date", key: "startDate", align: "center" },
  { title: "Expiry", key: "expiry", align: "center" },
  { title: "Area", key: "area", align: "center" },
  { title: "MISSION", key: "mission", align: "center" },
  { title: "IMEI", key: "imei", align: "center" },
  { title: "TAC", key: "tac", align: "center" },
  { title: "Actions", key: "actions", align: "center", sortable: false },
])

// Computed
const filteredPackages = computed(() => {
  let filtered = packages.value

  // Apply form search filters
  if (searchFilters.value.packageName) {
    filtered = filtered.filter(pkg =>
      pkg.packageName
        .toLowerCase()
        .includes(searchFilters.value.packageName.toLowerCase()),
    )
  }

  if (searchFilters.value.bundlingType) {
    filtered = filtered.filter(
      pkg => pkg.bundlingType === searchFilters.value.bundlingType,
    )
  }

  if (searchFilters.value.area) {
    filtered = filtered.filter(pkg => pkg.area === searchFilters.value.area)
  }

  // Apply table search query
  if (tableSearchQuery.value) {
    const query = tableSearchQuery.value.toLowerCase()

    filtered = filtered.filter(
      pkg =>
        pkg.packageName.toLowerCase().includes(query) ||
        pkg.keyword.toLowerCase().includes(query) ||
        pkg.bundlingType.toLowerCase().includes(query) ||
        pkg.area.toLowerCase().includes(query) ||
        pkg.monogami.toLowerCase().includes(query),
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredPackages.value.length / itemsPerPage.value)
})

const paginatedPackages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredPackages.value.slice(start, end)
})

// Methods
const searchPackages = async () => {
  try {
    isSearching.value = true

    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset to first page when searching
    currentPage.value = 1
    hasSearched.value = true
  } catch (error) {
    console.error("Search failed:", error)
  } finally {
    isSearching.value = false
  }
}

const resetSearch = () => {
  searchFilters.value = {
    packageName: "",
    packageCode: "",
    area: "",
    distributor: "",
    bundlingType: "",
    dateFilter: "",
    startDate: "",
    endDate: "",
    expiredFilter: "Active Only",
  }
  tableSearchQuery.value = ""
  currentPage.value = 1
  hasSearched.value = false
}

const editPackage = item => {
  router.push(`/package/list/${item.id}`)
}

const deletePackage = item => {
  // TODO: delete functionality
  console.log("Delete package:", item)
}

// Format date helper
const formatDate = dateString => {
  const date = new Date(dateString)
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Lifecycle
onMounted(() => {
  // Load initial data if needed
})
</script>

<template>
  <div class="list-package-page">
    <!-- Page Header -->
    <VRow class="mb-4">
      <VCol cols="12">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ pageTitle }}
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ pageSubtitle }}
          </p>
        </div>
      </VCol>
    </VRow>

    <!-- Search Package Card -->
    <VRow class="mb-4">
      <VCol cols="12">
        <VCard>
          <VCardTitle class="text-h6 font-weight-bold pa-4">
            Search Package
          </VCardTitle>

          <VCardText>
            <VRow>
              <!-- Package Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="searchFilters.packageName"
                  label="Package Name"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Area -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="searchFilters.area"
                  label="Area"
                  :items="areas"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Package Code -->
              <VCol
                cols="12"
                md="6"
              >
                <VCombobox
                  v-model="searchFilters.packageCode"
                  label="Package Code"
                  :items="packageCodes"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Distributor -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="searchFilters.distributor"
                  label="Distributor"
                  :items="distributors"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Expiry Filter -->
              <VCol
                cols="12"
                md="6"
                class="pl-md-5"
              >
                <span class="text-primary">Expiry Filter</span>
                <VRadioGroup
                  v-model="searchFilters.expiredFilter"
                  inline
                  class="mt-0"
                >
                  <VRadio
                    label="Active Only"
                    value="Active Only"
                  />
                  <VRadio
                    label="Show All"
                    value="Show All"
                  />
                </VRadioGroup>
              </VCol>

              <!-- Bundling Type -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="searchFilters.bundlingType"
                  label="Bundling Type"
                  :items="bundlingTypes"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Date Filter -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="searchFilters.dateFilter"
                  label="Date Filter"
                  :items="dateFilterOptions"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>

              <!-- Date Filter -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="searchFilters.dateFilter"
                  label="Date Filter"
                  variant="outlined"
                  density="compact"
                  type="datetime-local"
                  placeholder="Select Filter Date"
                  clearable
                />
              </VCol>
            </VRow>

            <!-- Search Actions -->
            <div class="d-flex justify-end mt-4">
              <VBtn
                variant="outlined"
                color="secondary"
                class="me-2"
                @click="resetSearch"
              >
                Reset
              </VBtn>
              <VBtn
                color="error"
                :loading="isSearching"
                @click="searchPackages"
              >
                Show Result
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- No Search Message -->
    <VRow v-if="!hasSearched">
      <!--
        <VCol cols="12">
        <VCard>
        <VCardText class="text-center pa-8">
        <VIcon
        icon="mdi-magnify"
        size="64"
        color="grey-lighten-1"
        class="mb-4"
        />
        <h3 class="text-h6 text-grey-darken-1 mb-2">No Search Performed</h3>
        <p class="text-body-2 text-grey-darken-1">
        Please use the search filters above and click "Show Result" to
        display packages.
        </p>
        </VCardText>
        </VCard>
        </VCol> 
      -->
    </VRow>

    <!-- Results Section -->
    <VRow v-if="hasSearched">
      <VCol cols="12">
        <VCard>
          <!-- Items per page selector and search -->
          <VCardText class="pb-0">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="d-flex align-center">
                <span class="text-body-2 me-2">Show</span>
                <VSelect
                  v-model="itemsPerPage"
                  :items="itemsPerPageOptions"
                  variant="outlined"
                  density="compact"
                  style="width: 80px"
                  hide-details
                />
                <span class="text-body-2 ms-2">entries</span>
              </div>

              <div class="d-flex align-center">
                <span class="text-body-2 me-2">Search:</span>
                <VTextField
                  v-model="tableSearchQuery"
                  variant="outlined"
                  density="compact"
                  style="width: 200px"
                  hide-details
                  placeholder="Search..."
                  clearable
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
                    class="text-center border-r"
                    style="width: 60px; border-right: 1px solid white"
                  >
                    No
                  </th>
                  <th
                    class="text-start border-r"
                    style="border-right: 1px solid white"
                  >
                    Package Name
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Keyword
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Monogami
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Duration (Days)
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Bundling Type
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Start Date
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Expiry
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    Area
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    MISSION
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    IMEI
                  </th>
                  <th
                    class="text-center border-r"
                    style="border-right: 1px solid white"
                  >
                    TAC
                  </th>
                  <th class="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td
                    colspan="13"
                    class="text-center pa-8"
                  >
                    <VProgressCircular
                      indeterminate
                      color="primary"
                      size="48"
                    />
                    <p class="mt-4">
                      Loading packages...
                    </p>
                  </td>
                </tr>
                <tr v-else-if="paginatedPackages.length === 0">
                  <td
                    colspan="13"
                    class="text-center pa-8"
                  >
                    <VIcon
                      icon="mdi-package-variant-closed"
                      size="48"
                      color="grey-lighten-1"
                      class="mb-2"
                    />
                    <p class="text-grey-darken-1">
                      No packages found
                    </p>
                  </td>
                </tr>
                <tr
                  v-for="(item, index) in paginatedPackages"
                  v-else
                  :key="item.id"
                  :class="{ 'bg-grey-lighten-4': index % 2 === 1 }"
                >
                  <!-- No -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    {{ item.no }}
                  </td>

                  <!-- Package Name -->
                  <td style="border-right: 1px solid white">
                    <span class="font-weight-medium">{{
                      item.packageName
                    }}</span>
                  </td>

                  <!-- Keyword -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    {{ item.keyword }}
                  </td>

                  <!-- Monogami -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    <span
                      size="small"
                      variant="flat"
                    >
                      {{ item.monogami }}
                    </span>
                  </td>

                  <!-- Duration -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    {{ item.duration }}
                  </td>

                  <!-- Bundling Type -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    {{ item.bundlingType }}
                  </td>

                  <!-- Start Date -->
                  <td
                    class="text-center text-no-wrap"
                    style="border-right: 1px solid white"
                  >
                    {{ formatDate(item.startDate) }}
                  </td>

                  <!-- Expiry -->
                  <td
                    class="text-center text-no-wrap"
                    style="border-right: 1px solid white"
                  >
                    {{ formatDate(item.expiry) }}
                  </td>

                  <!-- Area -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    {{ item.area }}
                  </td>

                  <!-- MISSION -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    <span size="small">
                      {{ item.mission }}
                    </span>
                  </td>

                  <!-- IMEI -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    <span size="small">
                      {{ item.imei }}
                    </span>
                  </td>

                  <!-- TAC -->
                  <td
                    class="text-center"
                    style="border-right: 1px solid white"
                  >
                    <span size="small">
                      {{ item.tac }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="text-center">
                    <div class="d-flex justify-center gap-1">
                      <VBtn
                        icon="mdi-delete"
                        size="x-small"
                        variant="flat"
                        color="error"
                        rounded="lg"
                        @click="deletePackage(item)"
                      />
                      <VBtn
                        icon="mdi-pencil"
                        size="x-small"
                        variant="flat"
                        rounded="lg"
                        color="primary"
                        @click="editPackage(item)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </VTable>

            <!-- Pagination Info and Controls -->
            <div class="d-flex justify-space-between align-center mt-4">
              <div class="text-body-2">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{
                  Math.min(currentPage * itemsPerPage, filteredPackages.length)
                }}
                of {{ filteredPackages.length }} entries
              </div>

              <!-- Pagination -->
              <VPagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                size="small"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.list-package-page {
  padding: 24px;
}

.text-no-wrap {
  white-space: nowrap;
}

:deep(.v-table) {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-table__wrapper) {
  border-radius: 4px;
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

.bg-grey-lighten-4 {
  background-color: #f0f0f0;
}
</style>
