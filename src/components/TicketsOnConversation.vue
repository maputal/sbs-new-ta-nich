<script setup>
const props = defineProps([
  'tableDataTickets', 
  'numberTable',
  'currentPage',
  'rowPerPage',
  'totalPage',
  'selectedRows',
  'paginationData',
  'tableHeader',
  'toTimeDMYHM',
  'toDate',
  'toTime',
  'priv',
  'project',
  'filterDesc',
  'getNameFromDesc',
])

const emit = defineEmits(['update:rowPerPage', 'update:currentPage', 'todetail', 'close'])

const rowPerPageLocal = ref(structuredClone(toRaw(props.rowPerPage)))
const currentPageLocal = ref(props.currentPage)
const currentProject = ref(props.project)

// watch(props, () => {
//   console.log('masuk watch component ticket1')
//   rowPerPageLocal.value = structuredClone(toRaw(props.rowPerPage))
// })

// watch(() => props.rowPerPage, () => {
//   console.log('masuk watch component ticket1')
//   rowPerPageLocal.value = structuredClone(toRaw(props.rowPerPage))
// })

watch([() => props.rowPerPage, () => props.currentPage], ([newRowPerPage, newCurrentPage]) => {
  console.log('masuk watch component ticket')
  rowPerPageLocal.value = structuredClone(toRaw(newRowPerPage))
  currentPageLocal.value = newCurrentPage
})

onMounted(() => {
  currentProject.value = props.project || ''
  console.log('currentProject.value=', currentProject.value)
})
</script>

<template>
  <VCardText 
    class="d-flex flex-row align-center text-black font-weight-bold row2"
  >
    <span class="me-3">Show</span>
    <div>
      <!-- v-model="rowPerPageLocal" -->
      <VSelect
        v-model="rowPerPageLocal"
        class="pagination-select rounded"
        density="compact"
        :items="[10, 20, 30, 50]"
        @update:model-value="$emit('update:rowPerPage', rowPerPageLocal)"
        />
    </div>
    <span class="ms-3">entries</span>
    <VSpacer />
    <VSpacer />
    <VBtn
      v-if="
        priv.hasOwnProperty('create_ticket') || 
        Object.keys(priv).length === 0
      "        
      class="text-none px-5"
      rounded="lg"
      variant="flat"
      @click="$emit('close')"
    >
      Create New Ticket
    </VBtn>
  </VCardText> 
  <VTable
    style="border-radius: 0;"
  >
    <thead class="text-no-wrap">
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
            Name 
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
            class="th-span-border d-flex justify-center"
          > 
            Email 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border-row-count d-flex justify-center"
          > 
            Create Time
          </span>
        </th>
        <th v-if="currentProject === 'danareksa'" class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Campaign 
          </span>
        </th>
        <th v-else class=" th-background-color">
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
            Sales 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Clcode 
          </span>
        </th>
        <th class=" th-background-color">
          <span
            class="th-span-border d-flex justify-center"
          > 
            Note 
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
        class="bg-hover"
        :class="{
          'to-red': row['status'] == 'Closed'
        }"
      >
        <td class="text-center text-black">
          {{ numberTable + index }}
        </td>
        <td 
          class="bg-hover"
        >             
          {{ row.ticket_id }}
        </td>
        <td
          class="text-no-wrap"                
          :class="{
            'status-field-color-red': row['status'] == 'Closed',
            'status-field-color-blue': row['status'] == 'Open',
            'status-field-color-green': row['status'] == 'Follow Up',
          }"
        >            
          <VIcon
            icon="mdi-circle-medium"
          />              
          {{ row.status }}
        </td>
        <td class="bg-hover text-center text-black">
          {{ props.getNameFromDesc(row.description)?.name || getNameFromDesc(row.description)?.nama || getNameFromDesc(row.description)?.full_name || '' }}           
        </td>
        <td class="bg-hover text-center text-black">
          {{ row.customer_phone_number }}           
        </td>
        <td class="bg-hover text-center text-black">
          {{ props.getNameFromDesc(row.description)?.email || '' }}           
        </td>
        <td class="text-no-wrap text-black pl-3">         
          <!-- {{ toTimeDMYHM(row.created_tstamp) }} -->
          {{ toDate(row.created_tstamp) }}
          <br>          
          {{ toTime(row.created_tstamp) }}  
        </td>
        <td class="text-black text-center">  
          {{ row.category }}
        </td>
        <td class="bg-hover text-black">
          {{ props.getNameFromDesc(row.description)?.sales || '' }}           
        </td>
        <td class="bg-hover text-black">
          {{ props.getNameFromDesc(row.description)?.clcode || '' }}           
        </td>
        <td class="bg-hover text-black">
          {{ props.getNameFromDesc(row.description)?.note || '' }}           
        </td>
        <!-- <td
          class="text-black"
        >          
          <div v-if="currentProject == 'danareksa'" style="white-space: pre-wrap;">
            {{ props.filterDesc(row.description) }}    
          </div>    
          <div v-else>
            {{ row.description }}     
          </div>
        </td> -->
        <td class="text-center">
          <VBtn
            class="text-none text-white ma-2"
            density="compact"
            size="small"
            color="#B65608"
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
      v-model="currentPageLocal"
      size="small"
      :total-visible="3"
      :length="props.totalPage"
      @update:model-value="$emit('update:currentPage', currentPageLocal)"
      />
      <!-- :length="props.totalPage" -->
      <!-- @next="props.selectedRows = []"
      @prev="props.selectedRows = []" -->
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

  .to-red {
    background-color: rgb(255, 0, 0, 15%);
  }

  .bg-hover:hover {
    background-color: rgba(68, 73, 74, 5%);
  }
</style>
