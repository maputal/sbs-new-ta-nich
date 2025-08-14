<script setup>
const props = defineProps({
  rowPerPage: {
    type: Number,
    default: 10,
  },
  paginationData: {
    type: String,
    default: "",
  },
  totalPage: {
    type: Number,
    default: 1,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})

const currentPage = ref(props.currentPage)
const rowPerPage = ref(props.rowPerPage)
const selectedRows = ref([])
</script>

<template>
  <!-- <VCardText class="d-flex flex-row align-center text-black font-weight-bold row1">
    <span class="me-3 titleManagement">Management</span>
      <VChip
        label
        color="error"
        text-color="white"
        size="small"
        class="text-capitalize me-5"
      >
        {{ props.userData.role }} Marketing
      </VChip>
  </VCardText> -->
  <VCardText class="d-flex flex-row align-center text-black font-weight-bold row2">
    <span class="me-3">Show</span>
    <div>
      <VSelect
        v-model="rowPerPage"
        class="pagination-select rounded"
        density="compact"
        focused
        :items="[10, 20, 30, 50]"
      />
    </div>
    <span class="ms-3">entries</span>

    <VSpacer />
    <slot name="btnAddContact"/>
    <!-- <div>
      <VBtn
          class="text-none px-4"
          rounded="lg"
          prepend-icon="mdi-plus"
          variant="flat"
          @click=""
        >
          Add New Contact
        </VBtn>
    </div> -->

  </VCardText>
  <slot />
  <VDivider />
  <VCardText class="d-flex align-center font-weight-bold text-black">
    <span>
      {{ paginationData }}
    </span>
    <VSpacer />
    <VPagination
      v-model="currentPage"
      size="small"
      :total-visible="3"
      :length="props.totalPage"
      @next="selectedRows = []"
      @prev="selectedRows = []"
    />
  </VCardText>
</template>

<style lang="scss" scoped>
.pagination-select {
    padding-left: 0.625rem;
    .v-field__input,
    .v-field__append-inner {
      padding: 0.3rem;
    }
}

.input-field-background-color {
    background-color: #D9D9D9;
}

.titleManagement{
  font-size: large;
}

.row1{
  padding: 40px;
}

.row2{
  padding-left: 40px;
}
</style>