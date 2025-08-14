<script setup>
defineProps([
  'tableDataTickets', 
  'numberTable',
  'currentPage',
  'rowPerPage',
  'currentPage',
  'totalPage',
  'paginationData',
  'tableHeader',
])
defineEmits(['update:rowPerPage', 'update:currentPage', 'todetail', 'close'])
</script>

<template>
  <VCardText 
    class="d-flex flex-row align-center text-black font-weight-bold row2"
  >
    <span class="me-3">Show</span>
    <div>
      <VSelect
        class="pagination-select rounded"
        density="compact"
        :items="[10, 20, 30, 50]"
        :value="rowPerPage"
        @input="$emit('update:rowPerPage', $event.target.value)"
      />
    </div>
    <span class="ms-3">entries</span>
    <VSpacer />
    <VSpacer />
    <VBtn        
      class="text-none px-5"
      rounded="lg"
      variant="flat"
      @click="$emit('close')"
    >
      Create New Ticket
    </VBtn>
  </VCardText> 
  <VTable
    class="text-no-wrap"
    style="border-radius: 0;"
  >
    <thead>
      <tr>
        <th class=" th-background-color">
          <span
            class="th-span-no-border d-flex justify-center"
          > 
            No 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Ticket ID 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Status 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Phone Number 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border-row-count d-flex justify-center"
          > 
            Create Time
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Category 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Initiated Type 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Description 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Action 
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in tableDataTickets"
        :key="index"
      >
        <td class="text-center text-black">
          {{ numberTable + index }}
        </td>
        <td 
          class="bg-hover text-center"
        >             
          {{ row.ticket_id }}
        </td>
        <td
          class="pl-3"                
          :class="{
            'status-field-color-red': row['status'] == 'Close',
            'status-field-color-blue': row['status'] == 'Open',
            'status-field-color-green': row['status'] == 'Service',
          }"
        >            
          <VIcon
            icon="mdi-circle-medium"
          />              
          {{ row.status }}
        </td>
        <td class="bg-hover text-center text-black">
          {{ row.customer_phone_number }}           
        </td>
        <td class="text-black pl-3">         
          {{ row.created_tstamp }}
        </td>
        <td class="text-black text-center">  
          {{ row.category }}
        </td>
        <td
          class="text-black text-center"
        >             
          {{ row.initiated_type }}
        </td>
        <td
          class="text-black text-center"
        >          
          {{ row.description }}
        </td>
        <td class="text-center">
          <VBtn
            class="text-none text-white ma-2"
            density="compact"
            size="small"
            color="#32BCAD"
            @click="$emit('todetail', row)"
          >
            Detail
          </VBtn>
        </td>
      </tr>
    </tbody>
    <tfoot v-show="!tableDataTickets.length">
      <tr>
        <td
          class="text-center text-body-1"
          :colspan="tableHeader.length"
        >
          No Data Available
        </td>
      </tr>
    </tfoot>
  </VTable>
  <VDivider />
  <VCardText class="d-flex align-center font-weight-bold text-black">
    <span>
      {{ paginationData }}
    </span>
    <VSpacer />
    <VPagination
      size="small"
      :total-visible="3"
      :length="totalPage"
      :value="currentPage"
      @input="$emit('update:currentPage', $event.target.value)"
      @next="selectedRows = []"
      @prev="selectedRows = []"
    />
  </VCardText>
</template>

<style lang="scss" scoped>
  .pagination-select {
    padding-inline-start: 0.625rem;

    .v-field__input,
    .v-field__append-inner {
      padding: 0.3rem;
    }
  }

  .th {
    position: relative;
  }

  .th-background-color {
    background-color: #f9fafc;
  }

  .th-span-border {
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-border-row-count {
    padding: 0;
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-no-border {
    color: black;
    padding-inline-start: 4px;
  }

  .status-field-color-grey {
    color: grey;
  }

  .status-field-color-red {
    color: #ff1f00;
  }

  .status-field-color-blue {
    color: #20cfaf;
  }

  .status-field-color-green {
    color: #05ff0d;
  }
</style>
