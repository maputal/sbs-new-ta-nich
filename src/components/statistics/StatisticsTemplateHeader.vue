<script setup>
import { useDebounceFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const props = defineProps({
  // Supply a function or null. Signature: async (query?: string) => Array
  packageFetch: { type: Function, default: null },
  groupFetch:   { type: Function, default: null },

  // Optional UX knobs
  pkgMinChars:     { type: Number, default: 0 },
  grpMinChars:     { type: Number, default: 0 },
  pkgDebounceMs:   { type: Number, default: 500 },
  grpDebounceMs:   { type: Number, default: 500 },

  // (kept from your original)
  // You can delete these now since we no longer accept lists:
  package: { type: Array, default: null },
  group:   { type: Array, default: null },
})

const emit = defineEmits(['show'])

// ---- Dates (two pickers) ----
const startDate = ref('') // Y-m-d
const endDate   = ref('')

const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  allowInput: false,
  disableMobile: true,
}

// Normalize primitives -> { title, value }
const normalize = list =>
  Array.isArray(list)
    ? list.map(it =>
      (it && typeof it === 'object')
        ? it
        : { title: String(it), value: it },
    )
    : []

// v-models
const pkg = ref(null)
const grp = ref(null)

// Server-driven items + search state
const pkgItems   = ref([])
const pkgSearch  = ref('')
const pkgLoading = ref(false)

const grpItems   = ref([])
const grpSearch  = ref('')
const grpLoading = ref(false)

// Debounced fetchers
const doPkgFetch = useDebounceFn(async (query = '') => {
  if (!props.packageFetch) return
  if ((query?.length ?? 0) < props.pkgMinChars) {
    pkgItems.value = []
    
    return
  }
  pkgLoading.value = true
  try {
    const raw = await props.packageFetch(query)

    pkgItems.value = normalize(raw)
  } finally {
    pkgLoading.value = false
  }
}, props.pkgDebounceMs)

const doGrpFetch = useDebounceFn(async (query = '') => {
  if (!props.groupFetch) return
  if ((query?.length ?? 0) < props.grpMinChars) {
    grpItems.value = []
    
    return
  }
  grpLoading.value = true
  try {
    const raw = await props.groupFetch(query)

    grpItems.value = normalize(raw)
  } finally {
    grpLoading.value = false
  }
}, props.grpDebounceMs)

// Optional initial fetch when minChars == 0
onMounted(() => {
  if (props.packageFetch && props.pkgMinChars === 0) doPkgFetch('')
  if (props.groupFetch && props.grpMinChars === 0) doGrpFetch('')
})

// Build payload and emit
function onShow() {
  const payload = {
    date: [startDate.value || null, endDate.value || null],
  }

  if (props.packageFetch) payload.package = pkg.value
  if (props.groupFetch)   payload.group   = grp.value

  if (!payload.date[0] && !payload.date[1]) delete payload.date

  emit('show', payload)
}
</script>

<template>
  <VCard>
    <div class="px-8 py-16">
      <!-- Date Row -->
      <VRow class="mb-2">
        <VCol
          cols="3"
          class="d-flex align-center"
        >
          <VLabel class="ma-0 text-black font-weight-black">
            Date
          </VLabel>
        </VCol>
        <VCol
          cols="9"
          class="d-flex gap-8"
        >
          <AppDateTimePicker
            v-model="startDate"
            :config="dateConfig"
            label="Start date"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            color="primary"
            clearable
            :rules="[v => !!v || 'Required']"
            @click:clear="startDate = ''"
          />
          <AppDateTimePicker
            v-model="endDate"
            :config="dateConfig"
            label="End date"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            color="primary"
            clearable
            :rules="[v => !!v || 'Required']"
            @click:clear="endDate = ''"
          />
        </VCol>
      </VRow>

      <!-- Package Row (only if fetch function provided) -->
      <VRow
        v-if="packageFetch"
        class="mb-2"
      >
        <VCol
          cols="3"
          class="d-flex align-center"
        >
          <VLabel class="ma-0 text-black font-weight-black">
            Package
          </VLabel>
        </VCol>
        <VCol cols="9">
          <VAutocomplete
            v-model="pkg"
            v-model:search="pkgSearch"
            :items="pkgItems"
            item-title="title"
            item-value="value"
            label="Search package"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            clearable
            :loading="pkgLoading"
            :no-filter="true"
            :no-data-text="pkgSearch?.length < pkgMinChars
              ? `Type at least ${pkgMinChars} characters`
              : 'No results'"
            @update:search="doPkgFetch($event)"
            @update:menu="opened => { if (opened) doPkgFetch(pkgSearch) }"
          />
        </VCol>
      </VRow>

      <!-- Group Row (only if fetch function provided) -->
      <VRow
        v-if="groupFetch"
        class="mb-2"
      >
        <VCol
          cols="3"
          class="d-flex align-center"
        >
          <VLabel class="ma-0 text-black font-weight-black">
            Group
          </VLabel>
        </VCol>
        <VCol cols="9">
          <VAutocomplete
            v-model="grp"
            v-model:search="grpSearch"
            :items="grpItems"
            item-title="title"
            item-value="value"
            label="Search group"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            clearable
            :loading="grpLoading"
            :no-filter="true"
            :no-data-text="grpSearch?.length < grpMinChars
              ? `Type at least ${grpMinChars} characters`
              : 'No results'"
            @update:search="doGrpFetch($event)"
            @update:menu="opened => { if (opened) doGrpFetch(grpSearch) }"
          />
        </VCol>
      </VRow>

      <!-- Actions -->
      <VRow>
        <VCol cols="3" />
        <VCol cols="9">
          <VBtn
            class="text-none"
            @click="onShow"
          >
            Show
          </VBtn>
        </VCol>
      </VRow>
    </div>

    <slot />
  </VCard>
</template>
