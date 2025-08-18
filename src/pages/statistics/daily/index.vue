<script setup>
import CustomTable from '@/@core/components/CustomTable.vue'
import StatisticsTemplateHeader from '@/components/statistics/StatisticsTemplateHeader.vue'
import { computed, ref } from 'vue'

const tableData = ref([
  { id: 1, first_name: 'Alice', lastName: 'Johnson', email_address: 'alice@example.com', created_at: '2025-08-18' },
  { id: 2, first_name: 'Budi', lastName: 'Johnson', email_address: 'alice@example.com', created_at: '2025-08-18' },
  { id: 3, first_name: 'Andy', lastName: 'Johnson', email_address: 'alice@example.com', created_at: '2025-08-18' },
])

const totalPage = ref(1)
const totalRow = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)

// --- blacklist keys (these will not be displayed as columns) ---
const blacklist = ['id', 'created_at', 'updated_at']

// --- header derivation ---
const formatLabel = key => {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase → camel Case
    .replace(/_/g, ' ')                     // snake_case → snake case
    .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize words
}

const tableHeaders = computed(() => {
  const first = tableData.value?.[0]
  if (!first) return []
  
  return Object.keys(first)
    .filter(k => !blacklist.includes(k)) // filter out blacklisted keys
    .map(k => ({
      key: k,
      label: formatLabel(k),
    }))
})

// If your CustomTable expects an array of labels:
const tableHeaderLabels = computed(() => tableHeaders.value.map(h => h.label))

// pagination text
const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRow.value } entries`
})
</script>

<template>
  <section>
    <h6 class="text-h5 font-weight-bold">
      Daily statistics
    </h6>
    <h3 class="font-weight-light mb-4">
      Indosat
    </h3>

    <StatisticsTemplateHeader
      :package="['A']"
      :group="['A','B']"
    >
      <VDivider />
      <VCardText class="text-black font-weight-bold">
        <VRow>
          <VCol
            cols="12"
            md="9"
            class="d-flex align-center"
          >
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
          <!--
            <VCol
            cols="12"
            md="3"
            class="d-flex align-center justify-end"
            >
            <VBtn
            class="text-none"
            rounded="md"
            size="small"
            color="success"
            prepend-icon="mdi-file-excel"                  
            :disabled="!tableData.length"
            @click="downloadAsDoc"
            >
            Export to Excel
            </VBtn>
            </VCol>
          -->
        </VRow>
      </VCardText>
      <CustomTable 
        :table-header-names="tableHeaderLabels"
        :table-data-length="tableData.length"
      >
        <template #tableBody>
          <tr
            v-for="(row, idx) in tableData"
            :key="idx"
            class="bg-hover"
          >
            <td
              v-for="h in tableHeaders"
              :key="h.key"
              class="text-center"
            >
              <span class="text-black">
                {{ row[h.key] }}
              </span>
            </td>
          </tr>
        </template>
      </CustomTable>

      <VDivider />

      <VCardText class="d-flex align-center font-weight-bold text-black">
        <span>{{ paginationData }}</span>
        <VSpacer />
        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="3"
          :length="totalPage"
        />
      </VCardText>
    </StatisticsTemplateHeader>
  </section>
</template>

