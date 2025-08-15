<script setup>
const props = defineProps({
  tableHeaderNames: {
    type: Array,
    default: () => [],
  },
  tableDataLength: {
    type: Number,
    default: 0,
  },
  showCheckbox: { // ✅ NEW: show checkbox or not
    type: Boolean,
    default: false,
  },
  selectedRows: { // ✅ NEW: array of selected items
    type: Array,
    default: () => [],
  },
  tableHeigh: {
    type: String,
    default: '50vh',
  },
})

const emit = defineEmits(["update:selectedRows", "toggleSelectAll"])

// Toggle select all checkboxes
const toggleSelectAllHandler = (isChecked) => {
  console.log('isChecked=', isChecked)
  emit("toggleSelectAll", isChecked)
}
</script>

<template>
  <VTable class="custom-table-list" :height="props.tableHeigh" :fixed-header="true">
    <thead>
      <tr>
        <th v-if="props.showCheckbox" class="text-center d-flex justify-center align-center th-background-color">
          <VCheckbox
            density="compact"
            hide-details
            color="primary"
            :model-value="props.selectedRows.length > 0 && props.selectedRows.length === props.tableDataLength"
            :disabled="!props.tableDataLength"
            @update:model-value="toggleSelectAllHandler"
          />
        </th>
        <th
          v-for="(header_names, index) in props.tableHeaderNames"
          :key="index"
          class="th-background-color"
        >
          <span
            class="d-flex justify-space-around"
            :class="{
              'th-span-border': index !== 0 || props.showCheckbox,
              'th-span-no-border': index === 0 && !props.showCheckbox
            }"
          >
            {{ header_names }}
          </span>   
        </th>
      </tr>
    </thead>
    <tbody>
      <slot name="tableBody" />
    </tbody>
    <tfoot v-show="!props.tableDataLength">
      <tr>
        <td
          class="text-center text-body-1"
          :colspan="props.showCheckbox ? props.tableHeaderNames.length + 1 : props.tableHeaderNames.length"
        >
          No Data Available
        </td>
      </tr>
    </tfoot>
  </VTable>
</template>

<style lang="scss" scoped>
// Target the VTable's header and use a background color

// Make the background color stick
.custom-table-list,
.v-table__wrapper > table > thead {
  position: sticky;
  top: 0;
  z-index: 1; /* Ensure the header is on top of the content */
}

// th {
//   position: relative;
// }

.th-background-color {
  background-color: #FFCB05 !important;
}

.th-span-border {
  color: black;
  border-left: 0.2rem solid white;
  padding-left: 0.5rem;
}

.th-span-no-border {
  color: black; 
  padding-left: 4px;
}
</style>