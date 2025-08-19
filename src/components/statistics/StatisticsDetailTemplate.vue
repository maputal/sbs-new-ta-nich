<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // Auto-rendered columns; if omitted, inferred from first row (minus blacklist)
  columns: { type: Array, default: () => [] },

  // Keys to hide when inferring columns
  blacklistKeys: { type: Array, default: () => [] },

  // REQUIRED: async ( { page, pageSize, sort, filters } ) => Promise<{ items, total }>
  fetcher: { type: Function, required: true },

  pageSize: { type: Number, default: 10 },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50] },
  filters: { type: Object, default: () => ({}) },

  // (Optional) externally-controlled sort
  sortKey: { type: [String, null], default: null },
  sortDesc: { type: Boolean, default: false },

  showRowCount: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
})

const emit = defineEmits(['row-click'])

/* State */
const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(props.pageSize)
const loading = ref(false)
const errorMsg = ref(null)

/* Sorting (can be internal or controlled via props) */
const localSortKey = ref(props.sortKey)
const localSortDesc = ref(props.sortDesc)

watch(() => props.sortKey, v => (localSortKey.value = v))
watch(() => props.sortDesc, v => (localSortDesc.value = !!v))

/* Headers */
const headerCols = computed(() => {
  if (props.columns && props.columns.length) return props.columns
  const first = items.value && items.value[0]
  if (!first) return []
  const blacklist = new Set(props.blacklistKeys || [])
  
  return Object.keys(first)
    .filter(k => !blacklist.has(k))
    .map(k => ({ key: k, label: toTitle(k) }))
})

/* Row-count */
const firstIndex = computed(() =>
  items.value.length > 0 ? (page.value - 1) * pageSize.value + 1 : 0,
)

const lastIndex = computed(() =>
  items.value.length > 0 ? (page.value - 1) * pageSize.value + items.value.length : 0,
)

const rowCountText = computed(
  () => `Showing ${firstIndex.value} to ${lastIndex.value} of ${total.value} entries`,
)

/* Fetch */
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
    errorMsg.value = e && e.message ? e.message : 'Failed to fetch data'
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(runFetch)
watch([page, pageSize, () => props.filters, localSortKey, localSortDesc], runFetch, { deep: true })

/* Helpers */
function toTitle(k) {
  return k
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/^./, s => s.toUpperCase())
}

function onRowClick(item, index) {
  emit('row-click', item, index)
}

const pageCount = computed(() => {
  return pageSize.value > 0 ? Math.max(1, Math.ceil(total.value / pageSize.value)) : 1
})

watch(pageCount, pc => {
  if (page.value > pc) page.value = pc
})
</script>

<template>
  <div class="table-set">
    <!-- Header: row-count + page-size -->
    <div
      v-if="showRowCount || (pageSizeOptions && pageSizeOptions.length)"
      class="d-flex align-center justify-space-between mb-3"
    >
      <div
        v-if="showRowCount"
        class="text-caption"
      >
        {{ rowCountText }}
      </div>

      <div
        v-if="pageSizeOptions && pageSizeOptions.length"
        class="d-flex align-center"
      >
        <span class="text-caption me-2">Rows per page</span>
        <VSelect
          v-model="pageSize"
          density="compact"
          hide-details
          :items="pageSizeOptions"
          style="max-width: 120px;"
        />
      </div>
    </div>

    <!-- Error -->
    <VAlert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      class="mb-3"
      density="comfortable"
    >
      {{ errorMsg }}
    </VAlert>

    <!-- Table -->
    <VTable
      :density="dense ? 'compact' : 'default'"
      class="text-no-wrap"
      hover
    >
      <thead>
        <tr>
          <th
            v-for="(col, i) in headerCols"
            :key="i"
          >
            <div class="d-flex align-center">
              <span>{{ col.label || col.key }}</span>

              <!-- simple sort toggle -->
              <VBtn
                v-if="col.key"
                class="ms-2"
                size="x-small"
                variant="text"
                icon
                :aria-label="`Sort by ${col.label || col.key}`"
                @click="
                  () => {
                    if (localSortKey === col.key) {
                      localSortDesc = !localSortDesc
                    } else {
                      localSortKey = col.key
                      localSortDesc = false
                    }
                  }
                "
              >
                <VIcon
                  :icon="localSortKey === col.key ? (localSortDesc ? 'mdi-sort-descending' : 'mdi-sort-ascending') : 'mdi-swap-vertical'"
                  size="18"
                />
              </VBtn>
            </div>
          </th>

          <!-- 🔌 parent can append header cells -->
          <slot name="append-headers" />
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td :colspan="headerCols.length + 1">
            <div class="d-flex align-center py-6">
              <VProgressCircular
                indeterminate
                class="me-3"
              />
              <span>Loading…</span>
            </div>
          </td>
        </tr>

        <template v-else>
          <tr
            v-for="(item, idx) in items"
            :key="idx"
            style="cursor: pointer;"
            @click="onRowClick(item, idx)"
          >
            <td
              v-for="(col, i) in headerCols"
              :key="i"
            >
              <span v-if="!col.formatter">{{ item[col.key] }}</span>
              <span v-else>{{ col.formatter(item[col.key], item) }}</span>
            </td>

            <!-- 🔌 parent can append extra body cells; full row available -->
            <slot
              name="append-columns"
              :item="item"
              :index="idx"
            />
          </tr>

          <tr v-if="!items.length">
            <td
              :colspan="headerCols.length + 1"
              class="text-center text-medium-emphasis py-6"
            >
              No data
            </td>
          </tr>
        </template>
      </tbody>
    </VTable>

    <!-- Pagination -->
    <div class="d-flex align-center justify-end mt-3">
      <VPagination
        v-model="page"
        :length="pageCount"
        total-visible="7"
      />
    </div>
  </div>
</template>

<style scoped>
.table-set :deep(table) {
  overflow: hidden;
  border-radius: 8px;
}
</style>
