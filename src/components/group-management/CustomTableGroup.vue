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
  <VTable style="border-radius: 0;">
    <thead>
      <tr>
        <th 
          scope="col"
          class="th-background-color"
        >
          <span 
            class="th-no-border d-flex justify-flex-start"
          >
            <span>Management Name</span>
          </span>
        </th>
        <th 
          scope="col"
          class="th-background-color"
        >
          <span 
            class="th-border d-flex justify-space-around"
          >
            <span>Status</span>
          </span>
        </th>
        <th 
          scope="col"
          class="th-background-color"
        >
          <span 
            class="th-border d-flex justify-space-around"
          >
            <span>Action</span>
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
  font-size:large
}

.th-background-color {
  background-color: #F9FAFC;
}

.th-border {
  color: black;
  border-left: 0.2rem solid #ACA7A7;
  // padding-left: 0.5rem;
  font-size:15px;
}

.th-no-border {
  color: black;     
  padding-left: 47px;
  padding-right: 50px;
  font-size:15px;
}
</style>