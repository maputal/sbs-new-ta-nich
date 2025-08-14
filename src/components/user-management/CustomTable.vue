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
})
</script>

<template>
  <VTable class="text-no-wrap" style="border-radius: 0;">
    <thead>
      <tr>
        <th
          v-for="(header_names, index) in props.tableHeaderNames"
          :key="index"
          class=" th-background-color"
        >
          <span
            class="d-flex justify-space-around"
            :class="{'th-span-border': header_names != tableHeaderNames[0], 'th-span-no-border': header_names == tableHeaderNames[0]}"
          >
            <span>
              {{ header_names }}
            </span>   
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
          :colspan="props.tableHeaderNames.length"
        >
          No Data Available
        </td>
      </tr>
    </tfoot>
  </VTable>
</template>

<style lang="scss" scoped>
th {
  position: relative;
}

.th-background-color {
    background-color: #F9FAFC;
}

.th-span-border {
    color: black;
    border-left: 0.2rem solid #ACA7A7;
    padding-left: 0.5rem;
}

.th-span-no-border {
    color: black; 
    padding-left: 4px;
}
</style>