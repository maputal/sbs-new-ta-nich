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
  <VTable class="text-no-wrap" style="border-radius:0;">
  <thead>
    <tr>
      <th
        v-for="(header_names, index) in props.tableHeaderNames"
        :key="index"
        class="th-background-color"
        :class="{'th-span-border': header_names != tableHeaderNames[0], 'th-span-no-border': header_names == tableHeaderNames[0]}"
      >
        <div class="hdr-grid">
          <div></div> <!-- 1/3 empty spacer -->
          <div class="text-center">{{ header_names }}</div> <!-- 2/3 text -->
          <div v-if="header_names != tableHeaderNames[0]" class="d-flex flex-column align-center" style="scale: 0.75;">
            <VBtn icon variant="plain" density="compact" class="sort-btn">
              <VIcon size="x-small" icon="mdi-triangle" />
            </VBtn>
            <VBtn icon variant="plain" density="compact" class="sort-btn">
              <VIcon size="x-small" icon="mdi-triangle-down" />
            </VBtn>
          </div> <!-- 3/3 buttons -->
        </div>
      </th>
    </tr>
  </thead>

  <tbody>
    <slot name="tableBody" />
  </tbody>

  <tfoot v-show="!props.tableDataLength">
    <tr>
      <td class="text-center text-body-1" :colspan="props.tableHeaderNames.length">
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
    background-color: #FFCB05;
    padding: 0.8rem 0;
}

.th-span-border {
    color: black;
    border-left: 0.2rem solid #F9FAFC;
    padding-left: 2px;
}

.th-span-no-border {
    color: black; 
    padding-left: 2px;
}

.sort-icons {
display: flex;
flex-direction: column;
line-height: 0;
}
.sort-btn {
min-width: 0;
padding: 0;
height: auto;
}

.hdr-grid{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* three equal thirds */
  align-items: center;
}

</style>