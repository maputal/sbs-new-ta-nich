<script setup>

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  rounded: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: "auto",
  },
  title: {
    type: String,
    default: "[title]",
  },

  // Should be an array of objects, each containing headerName, dataName, and inputType
  // if inputTypes is 'select' then must also include array of items
  tableDataAssignment: {
    type: Array,
    required: true,
  },
  numberTable: {
    required: false,
  },  
  currentPage: {
    required: false,
  },    
  rowPerPage: {
    default: false,
  },
  totalPage: {
    default: false,
  },
  selectedRows: {
    default: false,
  },
  paginationData: {
    default: false,
  },
  tableHeader: {
    default: true,
  },
  toDateDMY: {
    default: true,
  },
  priv: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'update:modelValue','update:rowPerPage', 'update:currentPage', 'todetail', 'close'])

const rowPerPageLocal = ref(structuredClone(toRaw(props.rowPerPage)))
const currentPageLocal = ref(props.currentPage)

const tiketID = ref(props.tableDataAssignment?.[0]?.ticket_id || null)
const ticketDate = ref(props.tableDataAssignment?.[0]?.ticket_tstamp || null)
const ticketStatus = ref(props.tableDataAssignment?.[0]?.ticket_status || null)
const ticketDescription = ref(props.tableDataAssignment?.[0]?.description || null)

watch([() => props.rowPerPage, () => props.currentPage], ([newRowPerPage, newCurrentPage]) => {
  console.log('masuk watch component assignment history list')
  rowPerPageLocal.value = structuredClone(toRaw(newRowPerPage))
  currentPageLocal.value = newCurrentPage
})

watch(() => props.tableDataAssignment, (newVal) => {
  if(newVal) {
    tiketID.value = newVal[0].ticket_id
    ticketDate.value = newVal[0].ticket_tstamp
    ticketStatus.value = newVal[0].ticket_status
    ticketDescription.value = newVal[0].description
  }
})

const dialogVisibleUpdate = val => {
  // emit('update:isDialogVisible', val)
  emit('close')
}

onMounted(() => {
  console.log("tableDataAssignment", props.tableDataAssignment)
})
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
    persistent
  >
    <VCard 
      :rounded="props.rounded"
    >
      <VCardTitle
        class="text-black font-weight-bold d-flex justify-space-between align-center"
      >
        <div class="">
          {{ props.title }}
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialogVisibleUpdate(false)"
        ></v-btn>
      </VCardTitle>
      <VCardText class="px-2">
        <div class="d-flex flex-row align-center text-black font-weight-bold row2"> 
          <v-col cols="3" class="py-0">
            <h6>Ticket ID</h6>
            <div 
              class="d-flex py-0"
            >
              <v-col class="px-0 py-1">
                <p class=" mb-0">
                  {{ tiketID }}
                </p>   
              </v-col>
            </div>
          </v-col>
          <v-col cols="3" class="py-0">
            <h6>Ticket Date</h6>
            <div 
              class="d-flex py-0"
            >
              <v-col class="px-0 py-1">
                <!-- <v-btn variant="tonal" rounded="xl" size="small" style="pointer-events: none;">
                  {{ toDateDMY(ticketDate) }}
                </v-btn> -->
                <p class=" mb-0">
                  {{ toDateDMY(ticketDate) }}
                </p> 
              </v-col>
            </div>
          </v-col>
          <v-col cols="3" class="py-0">
            <h6>Ticket Status</h6>
            <div class="d-flex py-0">
              <v-col class="px-0 py-1">
                <div               
                  :class="{
                    'status-field-color-grey': ticketStatus == 'AWAITING RESPONSE', 
                    'status-field-color-red': ticketStatus == 'CLOSED',
                    'status-field-color-blue': ticketStatus == 'RESPONED',
                    'status-field-color-green': ticketStatus == 'FOLLOW UP',
                  }"
                >              
                  <VIcon
                    icon="mdi-circle-medium"
                  />              
                  {{ ticketStatus }}
                </div> 
              </v-col>
            </div>
          </v-col>
        </div>
        <div class="text-black font-weight-bold pt-2">
          <v-col cols="12" class="py-0">
            <v-divider></v-divider>
            <h6 class="pt-2">Ticket Description</h6>
            <div class="d-flex py-0">
              <v-col class="px-0 py-0">
                <p class="text-sm mb-0">
                  {{ ticketDescription }}
                </p>   
              </v-col>
            </div>
          </v-col>
        </div>
      </VCardText>
      <!-- <VCardText 
        class="d-flex flex-row align-center text-black font-weight-bold row2"
      >
        <span class="me-3">Show</span>
        <div>
          <VSelect
            v-model="rowPerPageLocal"
            class="pagination-select rounded"
            density="compact"
            :items="[10, 20, 30, 50]"
            @update:model-value="$emit('update:rowPerPage', rowPerPageLocal)"
            />
        </div>
        <span class="ms-3">entries</span>
      </VCardText> -->
      <VCardText 
        class="px-1"
      >
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
                  class="th-span-border-row-count d-flex justify-center"
                > 
                  Assignee
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border d-flex justify-center"
                > 
                  Department 
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border d-flex justify-center px-8"
                > 
                  Start Time
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border d-flex justify-center px-8"
                > 
                  End Time
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border-row-count d-flex justify-center px-8"
                > 
                  Reasons
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border-row-count d-flex justify-center px-8"
                > 
                  Notes
                </span>
              </th>
              <th class=" th-background-color">
                <span
                  class="th-span-border d-flex justify-center"
                > 
                  Assignor 
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in tableDataAssignment"
              :key="index"
              class="bg-hover"
            >
              <td class="text-center text-black">
                {{ numberTable + index }}
              </td>
              <td class="text-black pl-7">
                {{ row.name }}
              </td>
              <td class="text-black text-no-wrap pl-7">
                {{ row.unit_name }}
                <br>
                ({{ row.sub_unit_name }})
              </td>
              <td class="text-black pl-7">
                <div
                  :class="{
                    'status-field-color-red': row['is_due'] == '1',
                  }"
                >  
                  {{ toDateDMY(row.start_time) }}   
                </div>  
              </td>
              <td class="text-black pl-7">
                <div
                  :class="{
                    'status-field-color-red': row['is_due'] == '1',
                  }"
                >  
                  {{ toDateDMY(row.end_time) }}   
                </div>  
              </td>
              <td class="text-black pl-7">
                {{ row.data.reason }}
              </td>
              <td class="text-black pl-7">
                {{ row.data.notes }}
              </td>
              <td class="text-black text-center pl-7">
                {{ row.creator }}
              </td>
            </tr>
          </tbody>
          <tfoot v-show="!tableDataAssignment.length">
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
      </VCardText>
      <!-- <VCardText class="d-flex align-center font-weight-bold text-black">
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
      </VCardText> -->
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
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
