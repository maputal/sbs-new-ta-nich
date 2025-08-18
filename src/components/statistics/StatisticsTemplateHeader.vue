<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  package: {
    type: Array,
    default: null,
    validator: val => {
      if (val !== null && Array.isArray(val) && val.length === 0) {
        console.error('ERROR : Empty item set for "package"!')
        
        return false
      }
      
      return true
    },
  },
  group: {
    type: Array,
    default: null,
    validator: val => {
      if (val !== null && Array.isArray(val) && val.length === 0) {
        console.error('ERROR : Empty item set for "group"!')
        
        return false
      }
      
      return true
    },
  },
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
const toItems = list =>
  Array.isArray(list)
    ? list.map(it =>
      typeof it === 'object' && it !== null
        ? it
        : { title: String(it), value: it },
    )
    : []

const packageItems = computed(() => toItems(props.package))
const groupItems   = computed(() => toItems(props.group))

// v-models for selects
const pkg = ref(null)
const grp = ref(null)

// Build payload and emit
function onShow() {
  const payload = {
    date: [startDate.value || null, endDate.value || null],
  }

  if (packageItems.value.length) payload.package = pkg.value
  if (groupItems.value.length)   payload.group   = grp.value

  // Optionally prune null dates:
  // if both null, delete date; else keep as [maybe-null, maybe-null]
  if (!payload.date[0] && !payload.date[1]) delete payload.date

  emit('show', payload)
}
</script>

<template>
  <VCard class="px-8 py-16">
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

    <!-- Package Row (render only if non-empty list) -->
    <VRow
      v-if="packageItems.length"
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
        <VSelect
          v-model="pkg"
          :items="packageItems"
          item-title="title"
          item-value="value"
          label="Select package"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          clearable
        />
      </VCol>
    </VRow>

    <!-- Group Row (render only if non-empty list) -->
    <VRow
      v-if="groupItems.length"
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
        <VSelect
          v-model="grp"
          :items="groupItems"
          item-title="title"
          item-value="value"
          label="Select group"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          clearable
        />
      </VCol>
    </VRow>

    <!-- Actions -->
    <VRow>
      <VCol cols="3" />
      <VCol cols="9">
        <VBtn @click="onShow">
          Show
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
