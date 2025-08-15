<script setup>
import ListOfNotes from '@/components/ListOfNotes.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  ticketDetail: {
    type: Object,
    required: true,
  },
  priv: {
    type: Object,
    required: true,
  },
  toTimeDMYHM: {
    type: Function,
    required: true,
  },
  listNote: {
    type: Array,
    required: true,
  },
  isCreateCustomer: {
    type: Boolean,
  },
  project: {
    type: String,
  },
  replaceCategory: {
    type: Function
  }
})

const emits = defineEmits([
  'close', 
  'update', 
  'update:modelValue', 
  'create',
  'createnotes',
  'click',
])

const refVForm = ref()
const ticketDetailLocal = ref(props.ticketDetail)
const attachmentValidationRules = ref([
  
  value => {
    console.log('----------value', value)

    if (!value || !value.length) {
      return true; // No file selected, so validation passes
    }
    
    const allowedTypes = [
      'image/png', 
      'image/jpg', 
      'image/jpeg', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'text/csv',
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
      'text/plain'
    ]

    const maxSize = {
      'image/png': 5 * 1024 * 1024, // 5 MB for images
      'image/jpg': 5 * 1024 * 1024, // 5 MB for images
      'image/jpeg': 5 * 1024 * 1024, // 5 MB for images
      'application/pdf': 100 * 1024 * 1024, // 100 MB for PDF documents
      'application/msword': 100 * 1024 * 1024, // 100 MB for .doc files
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 100 * 1024 * 1024, // 100 MB for .docx files
      'application/vnd.ms-excel': 100 * 1024 * 1024, // 100 MB for .xls files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 100 * 1024 * 1024, // 100 MB for .xlsx files
      'text/csv': 100 * 1024 * 1024, // 100 MB for .csv files
      'application/vnd.ms-powerpoint': 100 * 1024 * 1024, // 100 MB for .ppt files
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 100 * 1024 * 1024, // 100 MB for .pptx files
      'text/plain': 100 * 1024, // 100 KB for .txt files
    }

    const fileType = value[0].type
    const fileSize = value[0].size

    if (allowedTypes.includes(fileType) && fileSize <= maxSize[fileType]) {
      return true // File type and size are within allowed limits
    } else {
      return 'File size should be less than '+ Math.round((maxSize[fileType])/ 1048576) + ' MB!'
    }
  }
]);


const noteValidationRules = computed(() => {
  const rules = []

  if (ticketDetailLocal.value.ticket_id !== '') {
    rules.push(v => !!v || 'Note is required')
  }

  return rules
})

const onSubmit = type => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      emits('update:modelValue', false)
      if (type == 'create'){
        emits('create', ticketDetailLocal.value)
      } else {
        emits('update', ticketDetailLocal.value)
      }
    }
  })
}
</script>

<template> 
  <VCardText class="pb-0">
    <VForm
      ref="refVForm"
      @submit.prevent="onSubmit"
    >
      <div>
        <div
          class="d-flex justify-end align-center pb-2"
        >
          <span class="d-block text-primary text-xl font-weight-medium">Ticket Detail</span>
          <VSpacer />
          <div class="px-3">
            <VBtn        
              :key="$route.fullPath"
              class="text-none px-4"
              rounded="lg"
              variant="outlined"
              @click="emits('close')"
            >
              Back to list
            </VBtn>
          </div>
        </div>
        <VDivider />
        <VCol
          cols="12"
          md="12"
        >
          <VCardText class="px-0 py-0">
            <VRow
              no-gutters
              class="flex-nowrap"
            >
              <VCol
                cols="5"
                class="flex-grow-1"
              >
                <div>
                  <VListItem
                    v-if="ticketDetailLocal['ticket_id'] !== ''"
                    class="px-0"
                  >
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-ticket-account"
                      />
                      <span
                        class="text-black font-weight-black pl-4"
                      > 
                        Ticket ID 
                      </span>
                    </div>
                    <VTextField
                      v-model="ticketDetailLocal['ticket_id']"
                      focused
                      readonly
                    />
                  </VListItem>
                  <VListItem
                    v-if="ticketDetailLocal['created_tstamp'] !== ''"
                    class="px-0"
                  >
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-calendar-month"
                      />
                      <span
                        class="text-black font-weight-black pl-4"
                      > 
                        Created Time 
                      </span>
                    </div>
                    
                    <VTextField
                      v-model="ticketDetailLocal['created_tstamp']"
                      focused
                      readonly
                    /> 
                  </VListItem>
                  <VListItem class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="grommet-icons:status-info"
                      />
                      <span
                        class="required text-black font-weight-black pl-4"
                      > 
                        Status 
                      </span>
                    </div>
                    <VSelect
                      v-model="ticketDetailLocal['status']"
                      :items="['Follow Up', 'Closed',]"
                      focused
                      :rules="[(v) => !!v || 'Status is required']"
                      required
                    />
                  </VListItem>
                  <VListItem class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="tabler:ticket"
                      />
                      <span
                        v-if="props.project == 'danareksa'"
                        class="required text-black font-weight-black pl-4"
                      > 
                        Campaign 
                      </span>
                      <span
                        v-else
                        class="required text-black font-weight-black pl-4"
                      > 
                        Category Ticket 
                      </span>
                    </div>
                    <VTextField
                      v-if="props.project == 'danareksa'"
                      v-model="ticketDetailLocal['category']"
                      focused
                      :rules="[(v) => !!v || 'Campaign is required']"
                      required
                      :readonly="ticketDetailLocal['ticket_id'] !== ''"
                    />
                    <VTextField
                      v-else
                      v-model="ticketDetailLocal['category']"
                      focused
                      :readonly="Object.keys(priv).length !== 0"
                      :rules="[(v) => !!v || 'Category ticket is required']"
                      required
                    />
                  </VListItem>
                  <VListItem class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-checkbox-marked"
                      />
                      <span
                        class="required text-black font-weight-black pl-4"
                      > 
                        Priority 
                      </span>
                    </div>
                    <VSelect
                      v-model="ticketDetailLocal['priority']"
                      :items="['High', 'Medium', 'Low']"
                      focused
                      :rules="[(v) => !!v || 'Priority is required']"
                      required
                    />
                  </VListItem>
                  <VListItem class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-file-document-outline"
                      />
                      <span
                        class="required text-black font-weight-black pl-4"
                      > 
                        Description 
                      </span>
                    </div>
                    <VTextarea
                      v-if="props.project == 'danareksa' && ticketDetailLocal['ticket_id'] !== ''"
                      :value="props.replaceCategory(ticketDetail['description'])"
                      no-resize
                      rows="4"
                      focused
                      :readonly="ticketDetailLocal['ticket_id'] !== ''"
                    />
                    <VTextarea
                      v-else-if="ticketDetailLocal['ticket_id'] !== ''"
                      :value="props.replaceCategory(ticketDetail['description'])"
                      no-resize
                      rows="4"
                      focused
                      :rules="[(v) => !!v || 'Description is required']"
                      required
                    />
                    <VTextarea
                      v-else
                      v-model="ticketDetailLocal['description']"
                      no-resize
                      rows="4"
                      focused
                      :readonly="ticketDetailLocal['ticket_id'] !== ''"
                      :rules="[(v) => !!v || 'Description is required']"
                      required
                    />
                  </VListItem>
                </div>
              </VCol>
              <VCol
                cols="7"
                class="flex-grow-1 pl-5"
              >
                <VListItem class="px-0">
                  <div class="pb-2">
                    <VIcon
                      icon="mdi-note-edit-outline"
                    />
                    <span
                      v-if="ticketDetailLocal['ticket_id'] == ''"
                      class="text-black font-weight-black pl-4"
                    > 
                      Note
                    </span>
                    <span
                      v-else
                      class="required text-black font-weight-black pl-4"
                    > 
                      Note
                    </span>
                  </div>
                  <VTextarea
                    v-model="ticketDetailLocal['note']"
                    no-resize
                    rows="2"
                    focused
                    :rules="noteValidationRules"
                  />
                  <!-- <VListItem class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-paperclip"
                      />
                      <span
                        class="text-black font-weight-black pl-4"
                      > 
                        Attachment 
                      </span>
                    </div>
                    
                    <VFileInput
                      id="file"
                      v-model="ticketDetailLocal.file_id_attachment"
                      accept="image/*, application/pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt"
                      :rules="attachmentValidationRules"
                      density="compact"
                      variant="outlined"
                      prepend-icon=""
                      focused
                    />  
                  </VListItem> -->
                  <div
                    v-if="ticketDetailLocal['ticket_id'] !== ''"
                    class="d-flex flex-column"
                  >
                    <VListItemTitle class="text-black font-weight-bold pl-0 pb-0 pt-2">
                      List of Activities:
                    </VListItemTitle>
                    <PerfectScrollbar
                      tag="ul"
                      class="flex-grow-1 py-0"
                      :options="{ wheelPropagation: true }"
                    >
                      <ListOfNotes 
                        :list-of-notes="props.listNote"
                        :to-time-d-m-y-h-m="props.toTimeDMYHM"
                        :project="project"
                      />
                    </PerfectScrollbar>
                  </div>
                </VListItem>
                <div class="d-flex justify-end" v-if="!isCreateCustomer">
                  <VBtn
                    v-if="
                      ticketDetailLocal['ticket_id'] == ''
                    "
                    class="text-none px-9"
                    rounded="lg"
                    variant="flat"
                    @click="onSubmit('create')"
                  >
                    Save Ticket
                  </VBtn>
                  <VBtn
                    v-else       
                    class="text-none px-9"
                    rounded="lg"
                    variant="flat"
                    @click="onSubmit('update')"
                  >
                    Update Ticket
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCol>
      </div>
    </VForm>
  </VCardText>
</template>

<style lang="scss" scoped>
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/mixins";
@use "vuetify/lib/styles/tools/states" as vuetifyStates;

.required::after {
  color: red;
  content: "*";
}

.ps {
  block-size: 360px;
}
</style>
