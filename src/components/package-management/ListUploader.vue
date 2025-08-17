<template>
  <div class="data-list-component">
    <!-- Action Bar -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Left side - Show entries -->
      <div class="d-flex align-center">
        <span class="text-body-2 me-2">Show</span>
        <VSelect
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          variant="outlined"
          density="compact"
          style="width: 80px"
          hide-details
          @update:model-value="onItemsPerPageChange"
        />
        <span class="text-body-2 ms-2">entries</span>
      </div>

      <!-- Right side - Action buttons -->
      <div class="d-flex align-center gap-5">
        <VBtn
          color="#c6168d"
          variant="flat"
          size="small"
          class="text-none text-white"
          prepend-icon="mdi-upload"
          @click="handleUpload"
        >
          Upload {{ typeLabel }}
        </VBtn>
        
        <VBtn
          color="#c6168d"
          variant="flat"
          size="small"
          class="text-none text-white"
          prepend-icon="mdi-delete"
          @click="handleDelete"
        >
          Delete File Upload {{ typeLabel }}
        </VBtn>
        
        <VBtn
          color="success"
          variant="flat"
          size="small"
          prepend-icon="mdi-download"
          @click="handleExport"
        >
          Export to Excel
        </VBtn>

        <!-- Search -->
        <div class="d-flex align-center">
          <VTextField
            v-model="searchQuery"
            variant="outlined"
            density="compact"
            style="width: 200px; border-radius: 4px 0 0 4px;"
            hide-details
            placeholder="⌕"
            clearable
            class="search-input"
            @update:model-value="onSearchChange"
          />
          <VBtn
            size="small"
            variant="flat"
            color="error"
            style="height: 40px; border-radius: 0 4px 4px 0; margin-left: -1px;"
            @click="performSearch"
          >
            Search
          </VBtn>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <VCard>
      <VTable
        class="elevation-0 border"
        style="border-collapse: separate; border-spacing: 0;"
      >
        <thead>
          <tr class="th-background-color">
            <th
              class="text-center"
              style="width: 40px; border-right: 1px solid white;"
            >
              <VCheckbox
                v-model="selectAll"
                hide-details
                @update:model-value="toggleSelectAll"
              />
            </th>
            <th
              class="text-start"
              style="border-right: 1px solid white;"
            >
              {{ typeLabel }}
            </th>
            <th class="text-center">
              Package Name
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td
              colspan="3"
              class="text-center pa-8"
            >
              <VProgressCircular
                indeterminate
                color="primary"
                size="48"
              />
              <p class="mt-4">
                Loading {{ typeLabel }}...
              </p>
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0">
            <td
              colspan="3"
              class="text-center pa-8"
            >
              <VIcon
                icon="mdi-database-off"
                size="48"
                color="grey-lighten-1"
                class="mb-2"
              />
              <p class="text-grey-darken-1">
                No {{ typeLabel }} found
              </p>
            </td>
          </tr>
          <tr 
            v-for="(item, index) in paginatedData" 
            v-else 
            :key="item.id"
            :class="{ 'bg-grey-lighten-4': index % 2 === 1 }"
          >
            <!-- Checkbox -->
            <td
              class="text-center"
              style="border-right: 1px solid white;"
            >
              <VCheckbox
                v-model="selectedItems"
                :value="item.id"
                hide-details
              />
            </td>

            <!-- Data Value -->
            <td style="border-right: 1px solid white;">
              <span class="font-weight-medium">{{ item.value }}</span>
            </td>

            <!-- Package Name -->
            <td class="text-center">
              <span>{{ item.packageName }}</span>
            </td>
          </tr>
        </tbody>
      </VTable>

      <!-- Pagination Info and Controls -->
      <VCardText>
        <div class="d-flex justify-space-between align-center mt-4">
          <div class="text-body-2">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredData.length) }}
            of {{ filteredData.length }} entries
          </div>

          <!-- Pagination -->
          <VPagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            size="small"
            @update:model-value="onPageChange"
          />
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { downloadFile } from '@/plugins/downloadFile'
import { computed, onMounted, ref, watch } from 'vue'

// Props
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['imei', 'tac', 'msisdn'].includes(value),
  },
  fetchFunction: {
    type: Function,
    required: true,
  },
  uploadFunction: {
    type: Function,
    required: true,
  },
  deleteFunction: {
    type: Function,
    required: true,
  },
})

// Reactive data
const data = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedItems = ref([])
const selectAll = ref(false)

// Items per page options
const itemsPerPageOptions = ref([
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '25', value: 25 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
])

// Computed properties
const typeLabel = computed(() => {
  return props.type.toUpperCase()
})

const filteredData = computed(() => {
  if (!searchQuery.value) {
    return data.value
  }
  
  const query = searchQuery.value.toLowerCase()
  
  return data.value.filter(item => 
    item.value.toLowerCase().includes(query) ||
    item.packageName.toLowerCase().includes(query),
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return filteredData.value.slice(start, end)
})

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(selectedItems, newVal => {
  selectAll.value = newVal.length === paginatedData.value.length && paginatedData.value.length > 0
}, { deep: true })

// Methods
const fetchData = async () => {
  try {
    isLoading.value = true
    
    // Check if fetchFunction is provided, otherwise use dummy data
    let result
    
    try {
      result = await props.fetchFunction()
    } catch (error) {
      // If fetchFunction fails or is not properly implemented, use dummy data
      console.warn('FetchFunction failed, using dummy data:', error)
      result = generateDummyData()
    }
    
    // Transform the result to match our data structure
    if (Array.isArray(result)) {
      data.value = result.map((item, index) => ({
        id: item.id || index + 1,
        value: item.value || item[props.type] || item,
        packageName: item.packageName || '12*500MB',
      }))
    } else {
      // If result is not an array, use dummy data
      data.value = generateDummyData()
    }
  } catch (error) {
    console.error(`Error fetching ${props.type}:`, error)
    data.value = generateDummyData()
  } finally {
    isLoading.value = false
  }
}

const generateDummyData = () => {
  const dummyData = {
    msisdn: [
      { id: 1, value: '628589069530', packageName: '12*500MB' },
      { id: 2, value: '628158639098', packageName: '12*500MB' },
      { id: 3, value: '628588878395', packageName: '12*500MB' },
      { id: 4, value: '628588878365', packageName: '12*500MB' },
      { id: 5, value: '628588878286', packageName: '12*500MB' },
      { id: 6, value: '628123456789', packageName: '12*500MB' },
      { id: 7, value: '628987654321', packageName: '12*500MB' },
      { id: 8, value: '628555666777', packageName: '12*500MB' },
      { id: 9, value: '628444555666', packageName: '12*500MB' },
      { id: 10, value: '628777888999', packageName: '12*500MB' },
    ],
    imei: [
      { id: 1, value: '123456789012345', packageName: '12*500MB' },
      { id: 2, value: '987654321098765', packageName: '12*500MB' },
      { id: 3, value: '456789012345678', packageName: '12*500MB' },
      { id: 4, value: '789012345678901', packageName: '12*500MB' },
      { id: 5, value: '234567890123456', packageName: '12*500MB' },
      { id: 6, value: '567890123456789', packageName: '12*500MB' },
      { id: 7, value: '890123456789012', packageName: '12*500MB' },
      { id: 8, value: '345678901234567', packageName: '12*500MB' },
      { id: 9, value: '678901234567890', packageName: '12*500MB' },
      { id: 10, value: '901234567890123', packageName: '12*500MB' },
    ],
    tac: [
      { id: 1, value: '35123456', packageName: '12*500MB' },
      { id: 2, value: '35987654', packageName: '12*500MB' },
      { id: 3, value: '35456789', packageName: '12*500MB' },
      { id: 4, value: '35789012', packageName: '12*500MB' },
      { id: 5, value: '35234567', packageName: '12*500MB' },
      { id: 6, value: '35567890', packageName: '12*500MB' },
      { id: 7, value: '35890123', packageName: '12*500MB' },
      { id: 8, value: '35345678', packageName: '12*500MB' },
      { id: 9, value: '35678901', packageName: '12*500MB' },
      { id: 10, value: '35901234', packageName: '12*500MB' },
    ],
  }
  
  return dummyData[props.type] || []
}

const handleUpload = () => {
  props.uploadFunction()
}

const handleDelete = () => {
  if (selectedItems.value.length === 0) {
    alert('Please select items to delete')
    
    return
  }
  props.deleteFunction(selectedItems.value)
}

const handleExport = () => {
  const selectedData = selectedItems.value.length > 0 
    ? data.value.filter(item => selectedItems.value.includes(item.id))
    : data.value

  if (selectedData.length === 0) {
    alert('No data to export')
    
    return
  }

  // Prepare headers for the Excel export
  const headers = [typeLabel.value, 'Package Name']
  
  // Prepare rows data
  const rows = selectedData.map(item => [
    item.value,
    item.packageName,
  ])

  // Generate filename with current date and type
  const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const fileName = `${typeLabel.value}_export_${currentDate}`

  // Call the downloadFile function
  downloadFile({
    headers,
    rows,
    fileName,
    type: 'excel',
  })
}

const performSearch = () => {
  // Search is already reactive, but this can be used for additional search logic
  currentPage.value = 1
}

const onItemsPerPageChange = () => {
  currentPage.value = 1
}

const onPageChange = () => {
  selectedItems.value = []
  selectAll.value = false
}

const onSearchChange = () => {
  currentPage.value = 1
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = paginatedData.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})

// Expose methods for parent component
defineExpose({
  refreshData: fetchData,
  getSelectedItems: () => selectedItems.value,
  clearSelection: () => {
    selectedItems.value = []
    selectAll.value = false
  },
})
</script>

<style scoped>
.data-list-component {
  width: 100%;
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

.gap-2 {
  gap: 8px;
}

.search-input :deep(.v-field__input) {
  padding: 8px 12px;
  min-height: 40px;
}

.search-input :deep(.v-field__field) {
  border-radius: 4px 0 0 4px !important;
}

.search-input :deep(.v-field) {
  border-radius: 4px 0 0 4px !important;
  border-right: none !important;
}

.search-input :deep(.v-field__outline) {
  border-radius: 4px 0 0 4px !important;
}

.search-input :deep(.v-field__outline__start) {
  border-radius: 4px 0 0 4px !important;
  border-right: none !important;
}

/* .search-input :deep(.v-field__outline__end) {
  display: none !important;
} */

.search-button {
  border-radius: 0 !important;
}

.bg-grey-lighten-4 {
  background-color: #f0f0f0;
}
</style>
