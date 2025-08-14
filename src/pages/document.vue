<script setup>
  import { useDocumentStore } from '@/store/useDocumentStore'
import { useGlobalStore } from '@/store/useGlobalStore'
  const store = useGlobalStore()
  const myUser = computed(() => ({
    name: store.user?.name,
    phone_number: store.user?.account_obj.phone_number,
    email: store.user?.account_obj.email,
    company_name: store.user?.company_name,
  }))

  const route = useRoute()
  const router = useRouter()

  const toLoginWaba = () => {
    router.replace('/')
  }
  
  const todayDate = ref('')

  const months = {
    1:'January',
    2:'February',
    3:'March',
    4:'April',
    5:'May',
    6:'June',
    7:'July',
    8:'August',
    9:'September',
    10:'October',
    11:'November',
    12:'Desember', 
  }

  const days = {
    0:'Sunday',
    1:'Monday',
    2:'Tuesday',
    3:'Wednesday',
    4:'Thursday',
    5:'Friday',
    6:'Saturday',
  }

  const todayDateF = () => {
    let today = new Date()
    let dd = today.getDate()
    let day = today.getDay();
    let year = today.getFullYear()
    let month = today.getMonth() + 1
    let date =
      dd < 10 ? '0' + dd : dd
    return (
      days[day] +
      ', ' +
      date +
      ' ' +
      months[month] +
      ' ' +
      year
    )
  }

  onMounted(() => {
    let isEmbeddedSignup = store.payloadFin.embedded_signup
    // DEV MODE
    // isEmbeddedSignup = true
    if(!isEmbeddedSignup){
      toLoginWaba()
    }
    todayDate.value = todayDateF()
  })



  // TABLE
  const documentListStore = useDocumentStore()
  const searchQuery = ref('')
  const dateRange = ref('')
  const selectedStatus = ref()
  const rowPerPage = ref(10)
  const currentPage = ref(1)
  const totalPage = ref(1)
  const totalDocuments = ref(0)
  const documents = ref([])
  const selectedRows = ref([])
  const selectAllDocument = ref(false)

  // 👉 Fetch Documents
  watchEffect(() => {
    const [start, end] = dateRange.value ? dateRange.value.split('to') : ''

    documentListStore.fetchDocuments({
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    }).then(response => {
      documents.value = response.data.documents
      totalPage.value = response.data.totalPage
      totalDocuments.value = response.data.totalDocuments
    }).catch(error => {
      console.log("error",error)
    })
  })

  // 👉 Fetch Documents
  watchEffect(() => {
    if (currentPage.value > totalPage.value)
      currentPage.value = totalPage.value
  })

  // 👉 Computing pagination data
  const paginationData = computed(() => {
    const firstIndex = documents.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
    const lastIndex = documents.value.length + (currentPage.value - 1) * rowPerPage.value
    
    return `${ firstIndex }-${ lastIndex } of ${ totalDocuments.value }`
  })

  // 👉 Document balance variant resolver
  const resolveDocumentBalanceVariant = (balance, total) => {
    if (balance === total)
      return {
        status: 'Unpaid',
        chip: { color: 'error' },
      }
    if (balance === 0)
      return {
        status: 'Paid',
        chip: { color: 'success' },
      }
    
    return {
      status: balance,
      chip: { variant: 'text' },
    }
  }

  const resolveDocumentStatusVariantAndIcon = status => {
    if (status === 'Partial Payment')
      return {
        variant: 'warning',
        icon: 'mdi-chart-timeline-variant',
      }
    if (status === 'Paid')
      return {
        variant: 'success',
        icon: 'mdi-check',
      }
    if (status === 'Downloaded')
      return {
        variant: 'info',
        icon: 'mdi-arrow-down',
      }
    if (status === 'Draft')
      return {
        variant: 'secondary',
        icon: 'mdi-content-save-outline',
      }
    if (status === 'Sent')
      return {
        variant: 'primary',
        icon: 'mdi-email-outline',
      }
    if (status === 'Past Due')
      return {
        variant: 'error',
        icon: 'mdi-alert-circle-outline',
      }
    
    return {
      variant: 'secondary',
      icon: 'mdi-close',
    }
  }

  // 👉 Add/Remove all checkbox ids in/from array
  const selectUnselectAll = () => {
    selectAllDocument.value = !selectAllDocument.value
    if (selectAllDocument.value) {
      documents.value.forEach(document => {
        if (!selectedRows.value.includes(`check${ document.id }`))
          selectedRows.value.push(`check${ document.id }`)
      })
    } else {
      selectedRows.value = []
    }
  }
</script>
<template>
  <section>
    <h6 class="text-2xl font-weight-bold mb-2">
      Documents
    </h6>
    <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
      <!-- 👉 Left Content -->
      <div class="mb-4">
        <!-- 👉 Address -->
        <p class="mb-0 font-weight-medium">
          LOREM IPSUM
        </p>
      </div>

      <!-- 👉 Right Content -->
      <div class="mb-4">
        <!-- 👉 Issue Date -->
        <p class="mb-2 font-weight-medium">
          <span>{{ todayDate }} </span>
          <!-- <span>{{ documentData.issuedDate }}</span> -->
        </p>
      </div>
    </div>
    <div>
      <VCard id="document-list">
        <VCardText class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Rows per page -->
          <div
            class="d-flex align-center me-3"
            style="width: 171px;"
          >
            <span class="text-no-wrap me-3">Rows per page:</span>
            <VSelect
              v-model="rowPerPage"
              density="compact"
              variant="plain"
              class="pagination-select"
              :items="[10, 20, 30, 50]"
            />
          </div>

          <VSpacer />

          <div class="d-flex align-center flex-wrap gap-4">
            <!-- 👉 Download All -->

            <!-- <VBtn
              prepend-icon="mdi-plus"
              :to="{ name: 'apps-document-add' }"
            > -->
            <VBtn
              prepend-icon="mdi-plus"
            >
              Download All
            </VBtn>
          </div>
        </VCardText>

        <VDivider />

        <!-- SECTION Table -->
        <VTable class="text-no-wrap document-list-table">
          <!-- 👉 Table head -->
          <thead>
            <tr>
              <th scope="col" class="text-center">
                  No
              </th>
              <th scope="col" class="text-center">
                Document
              </th>
              <th scope="col" class="text-center">
                Action
              </th>
            </tr>
          </thead>

          <!-- 👉 Table Body -->
          <tbody>
            <tr
              v-for="document in documents"
              :key="document.id"
            >
              <!-- 👉 No -->
              <td>
                <div class="text-center">
                  {{ document.no }}                  
                </div>
              </td>

              <!-- 👉 name -->
              <td>
                <div class="text-center">
                  {{ document.name }}
                </div>
              </td>

              <!-- 👉 Actions -->
              <td>
                <div class="text-center">
                  <VBtn color="error">
                    Download
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>


          <!-- 👉 table footer  -->
          <tfoot v-show="!documents.length">
            <tr>
              <td
                colspan="8"
                class="text-center text-body-1"
              >
                No data available
              </td>
            </tr>
          </tfoot>
        </VTable>

        <VDivider />

        <!-- SECTION Pagination -->
        <VCardText class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Pagination and pagination meta -->
          <div
            class="d-flex align-center me-3"
            style="width: 171px;"
          >
            <h6 class="text-sm font-weight-regular">
              Showing Page {{ paginationData }}
            </h6>
          </div>

          <VSpacer/>

          <div class="d-flex align-center">

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
              @next="selectedRows = []"
              @prev="selectedRows = []"
            />
          </div>
        </VCardText>
      </VCard>
    </div>
  </section>
</template>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
<style lang="scss" scope>
.pagination-select {
  .v-field__input,
  .v-field__append-inner {
    padding-block-start: 0.3rem;
  }
}
</style>
