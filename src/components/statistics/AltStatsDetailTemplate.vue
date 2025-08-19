<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CustomTable from '../user-management/CustomTable.vue'

/**
 * Props:
 * - fetcher: REQUIRED async ({ page, pageSize, sort, filters }) => Promise<{ items, total }>
 * - columns: optional [{ key, label, formatter? }]; if omitted, infer from first row (minus blacklistKeys)
 * - blacklistKeys: optional keys to hide if inferring columns
 * - filters: optional object passed to fetcher
 * - sortKey/sortDesc: optional externally controlled sort
 * - pageSize, pageSizeOptions, showRowCount, dense: UI options
 * - showCheckbox, selectedRows: passed through to CustomTable (and emits mirrored)
 * - clickAction: optional object where keys are column names and values are functions to call when clicked
 */
const props = defineProps({
  fetcher: { type: Function, required: true },
  columns: { type: Array, default: () => [] },
  blacklistKeys: { type: Array, default: () => [] },
  filters: { type: Object, default: () => ({}) },

  sortKey: { type: [String, null], default: null },
  sortDesc: { type: Boolean, default: false },

  pageSize: { type: Number, default: 10 },
  pageSizeOptions: { type: Array, default: () => [10, 20, 30, 50] },
  showRowCount: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },

  // passthroughs to CustomTable
  showCheckbox: { type: Boolean, default: false },
  selectedRows: { type: Array, default: () => [] },

  appendHeader: { type: Array, default: () => [] },
  
  // click actions for columns
  clickAction: { type: Object, default: () => ({}) },
})

const emit = defineEmits([
  'row-click',

  // mirror CustomTable events
  'update:selectedRows',
  'toggleSelectAll',
])

/* State */
const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(props.pageSize)
const loading = ref(false)
const errorMsg = ref(null)

/* Sorting (internal with ability to be externally controlled) */
const localSortKey = ref(props.sortKey)
const localSortDesc = ref(props.sortDesc)

watch(() => props.sortKey, v => (localSortKey.value = v))
watch(() => props.sortDesc, v => (localSortDesc.value = !!v))

/* Header model: explicit columns or infer from first row (respect blacklistKeys) */
const headerCols = computed(() => {
  if (props.columns && props.columns.length) return props.columns
  const first = items.value?.[0]
  if (!first) return []
  const blacklist = new Set(props.blacklistKeys || [])
  
  return Object.keys(first)
    .filter(k => !blacklist.has(k))
    .map(k => ({ key: k, label: toTitle(k) }))
})

/* CustomTable expects an array of header names (labels) */
const tableHeaderNames = computed(() => headerCols.value.map(c => c.label || c.key))

/* Row-count text */
const firstIndex = computed(() =>
  items.value.length > 0 ? (page.value - 1) * pageSize.value + 1 : 0,
)

const lastIndex = computed(() =>
  items.value.length > 0 ? (page.value - 1) * pageSize.value + items.value.length : 0,
)

const rowCountText = computed(
  () => `Showing ${firstIndex.value} to ${lastIndex.value} of ${total.value} entries`,
)

/* Check if a column is clickable */
function isColumnClickable(columnKey) {
  return props.clickAction && props.clickAction[columnKey]
}

/* Handle column click */
function handleColumnClick(columnKey, row, event) {
  if (isColumnClickable(columnKey)) {
    event.stopPropagation()
    props.clickAction[columnKey](row)
  }
}

/* Fetching */
async function runFetch() {
  loading.value = true
  errorMsg.value = null
  try {
    const result = await props.fetcher({
      page: page.value,
      pageSize: pageSize.value,
      sort: localSortKey.value ? { key: localSortKey.value, desc: localSortDesc.value } : null,
      filters: props.filters || {},
    })

    items.value = (result && result.items) || []
    total.value = Number((result && result.total) || items.value.length)
  } catch (e) {
    errorMsg.value = e?.message || 'Failed to fetch data'
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(runFetch)
watch([page, pageSize, () => props.filters, localSortKey, localSortDesc], runFetch, { deep: true })

/* Pagination length */
const pageCount = computed(() => {
  return pageSize.value > 0 ? Math.max(1, Math.ceil(total.value / pageSize.value)) : 1
})

watch(pageCount, pc => {
  if (page.value > pc) page.value = pc
})

/* Helpers */
function toTitle(k) {
  return k
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/^./, s => s.toUpperCase())
}

function onHeaderSort(colKey) {
  if (localSortKey.value === colKey) {
    localSortDesc.value = !localSortDesc.value
  } else {
    localSortKey.value = colKey
    localSortDesc.value = false
  }
}
</script>

<template>
  <div class="table-set">
    <!-- Top controls: row-count + page size -->
    <div
      v-if="showRowCount || (pageSizeOptions && pageSizeOptions.length)"
      class="d-flex align-center justify-space-between mb-3"
    >
      <div
        v-if="pageSizeOptions && pageSizeOptions.length"
        class="d-flex align-center text-black font-weight-bold ml-8 mb-3"
      >
        <span class="text-caption me-2">Show</span>
        <VSelect
          v-model="pageSize"
          :items="pageSizeOptions"
          density="compact"
          hide-details
          class="pagination-select rounded"
          style="max-width: 120px;"
        />
        <span class="text-caption ms-2">entries</span>
      </div>
    </div>

    <!-- Error banner -->
    <VAlert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      class="mb-3"
      density="comfortable"
    >
      {{ errorMsg }}
    </VAlert>

    <!-- TABLE -->
    <CustomTable
      :table-header-names="[...tableHeaderNames, ...props.appendHeader]"
      :table-data-length="items.length"
      :show-checkbox="showCheckbox"
      :selected-rows="selectedRows"
      @update:selected-rows="$emit('update:selectedRows', $event)"
      @toggle-select-all="$emit('toggleSelectAll', $event)"
    >
      <template #tableBody>
        <!-- Loading row -->
        <tr v-if="loading">
          <td :colspan="tableHeaderNames.length + (showCheckbox ? 1 : 0)">
            <div class="d-flex align-center py-6">
              <VProgressCircular
                indeterminate
                class="me-3"
              />
              <span>Loading…</span>
            </div>
          </td>
        </tr>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(row, idx) in items"
            :key="idx"
            class="bg-hover"
            style="cursor: pointer;"
            @click="$emit('row-click', row, idx)"
          >
            <!-- Auto cells from inferred or provided columns -->
            <td
              v-for="h in headerCols"
              :key="h.key"
              class="text-center"
              @click="handleColumnClick(h.key, row, $event)"
            >
              <span
                v-if="!h.formatter"
                class="text-black"
                :class="[{ 'clickable-text': isColumnClickable(h.key) }]"
              >{{ row[h.key] }}</span>
              <span
                v-else
                class="text-black"
                :class="[{ 'clickable-text': isColumnClickable(h.key) }]"
              >{{ h.formatter(row[h.key], row) }}</span>
            </td>
            
            <!-- Extra cells from parent: gets full row -->
            <td
              v-if="$slots['append-columns'] || appendHeader.length"
              class="text-center"
              @click.stop
            >
              <span>
                <slot
                  name="append-columns"
                  :item="row"
                  :index="idx"
                />
              </span>
            </td>
          </tr>

          <tr v-if="!items.length">
            <td
              :colspan="tableHeaderNames.length + (showCheckbox ? 1 : 0)"
              class="text-center text-medium-emphasis py-6"
            >
              No data
            </td>
          </tr>
        </template>
      </template>
    </CustomTable>
    
    <VDivider />

    <VCardText class="d-flex align-center font-weight-bold text-black">
      <span
        v-if="showRowCount"
        class="text-caption"
      >
        {{ rowCountText }}</span>
      <VSpacer />
      <VPagination
        v-model="page"
        :length="pageCount"
        :total-visible="7"
        size="small"
      />
    </VCardText>
  </div>
</template>

<style scoped lang="scss">
.table-set :deep(table) {
  overflow: hidden;
  border-radius: 8px;
}

.clickable-text {
  color: rgb(var(--v-theme-primary)) !important;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
}
</style>
