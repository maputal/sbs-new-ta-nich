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
  },
  groupOptions: {
    type: Array,
    // required: true,
  },
  userOptions: {
    type: Array,
    // required: true,
  },
  userData: {
    type: Object,
  },
  dictionary: {
    type: Array,
  },
  responseOptions: {
    type: Array,
  }
})

const emits = defineEmits([
  'close', 
  'update', 
  'update:modelValue', 
  'create',
  'click',
  'get-all-user',
])

const refVForm = ref()
const ticketDetailLocal = ref(props.ticketDetail)
const assigneeLocal = ref(0)
const formattedSlaTime= ref('')

const fieldsCustomLocal = ref({
  data: {
    content: {}
  }
})

const fieldsToBeShown= ref()

let customFieldsIcon = ref({
  response: 'mdi-comment-quote-outline',
  sales: 'mdi-account-tie',
  ao_code: 'mdi-card-account-details-star-outline',
})

const setIconFields = (key) => {
  let defaultIcon = 'mdi-invoice-list-outline'

  if(Object.hasOwn(customFieldsIcon.value, key)){
    defaultIcon = customFieldsIcon.value[key]
  }

  return defaultIcon
}

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

const onChangeGroup = () => {
  emits('get-all-user', ticketDetailLocal.value.assigned_group)
  assigneeLocal.value = 0
}

const formatHeader = (key) => {
  // Convert snake_case or camelCase to readable format
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

const setSLATime = () => {
  console.log('ticketDetailLocal.value.priority', ticketDetailLocal.value.priority)
  if (ticketDetailLocal.value.priority) {
    const now = new Date()
    const urgencyInSeconds = parseInt(ticketDetailLocal.value.priority.dictvalue)
    const newSLATime = new Date(now.getTime() + urgencyInSeconds *1000)
    ticketDetailLocal.value.target_time = newSLATime
    // ticketData.value.SLATime = newSLATime.toISOString()
    formattedSlaTime.value = ticketDetailLocal.value.target_time

    console.log('ticketDetailLocal.value.target_time', ticketDetailLocal.value.target_time)
  }
}

const onSubmit = type => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      emits('update:modelValue', false)
      // assigneeLocal.value = props.userData?.user_id

      if(Object.keys(fieldsCustomLocal.value.data.content).length !== 0){
        ticketDetailLocal.value.data.content = fieldsCustomLocal.value.data.content
      }

      console.log('ticketDetailLocal.value di onSubmit', ticketDetailLocal.value)
      console.log('assigneeLocal.value di onSubmit', assigneeLocal.value)
      if (type == 'create'){

        emits('create', ticketDetailLocal.value, assigneeLocal.value)
      } else {
        emits('update', ticketDetailLocal.value, assigneeLocal.value)
      }
    }
  })
}

watch(
  () => props.ticketDetail,
  (detail) => {
    console.log('WATCH triggered dengan ticketDetail1:', detail);

    if (!detail || !detail.ticket_id) return;

    if (detail.target_time) {
      if(Number.isInteger(detail.target_time) && detail.target_time > 946684800){
        formattedSlaTime.value = new Date(detail.target_time * 1000)
      } else {
        formattedSlaTime.value = detail.target_time;
      }
      console.log('formattedSlaTime.value:', formattedSlaTime.value);
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.ticketDetail.assigned_user,
  (newValue) => {
    if (!props.ticketDetail.assigned_user && !newValue.assigned_user){
      assigneeLocal.value = props.userData?.user_id || 0
    } else {
      assigneeLocal.value = props.ticketDetail.assigned_user
    }
    // emits('get-all-user')
  },
);

onMounted(() => {
  console.log('masuk mounted di detail nich')

  fieldsToBeShown.value = moffas.config.fields_to_show || []

  // if(props.ticketDetail.target_time){
  //   formattedSlaTime.value = new Date(props.ticketDetail.target_time * 1000)
  //   console.log('formattedSlaTime.value di mounted di detail nich')
  // }

  console.log('mounted props.isCreateCustomer:', props.isCreateCustomer);
  if(props.isCreateCustomer) {
    formattedSlaTime.value = new Date()
  }

  if (!props.ticketDetail.assigned_user){
    assigneeLocal.value = props.userData?.user_id || 0
  } else {
    assigneeLocal.value = props.ticketDetail.assigned_user
  }
  emits('get-all-user');
})
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
          <span v-if="isCreateCustomer" class="d-block text-primary text-xl font-weight-medium">Ticket Create</span>
          <span v-else class="d-block text-primary text-xl font-weight-medium">Ticket Detail</span>
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
            >
              <VCol
                cols="12"
                md="5"
                class="flex-grow-1 px-2"
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
                  <v-list-item v-if="props.project !== 'danareksa'" class="px-0">
                    <div class="pb-2">
                      <v-icon
                        icon="mdi-account-group-outline"
                      />
                      <span
                        class="text-black font-weight-black pl-2 required"
                      > 
                        Group
                      </span>
                    </div>
                    
                    <VSelect
                      v-model="ticketDetailLocal['assigned_group']"
                      :items="props.groupOptions"
                      item-title="group_name"
                      item-value="group_id"
                      variant="outlined"
                      focused
                      hide-details="auto"
                      @update:model-value="onChangeGroup"
                    />
                  </v-list-item>
                  <v-list-item class="px-0">
                    <div class="pb-2">
                      <v-icon
                        icon="mdi-clipboard-account-outline"
                      />
                      <span
                        class="text-black font-weight-black pl-2 required"
                      > 
                        Assignee 
                      </span>
                    </div>
                    <div v-if="Object.keys(props.userData?.priv).length === 0">
                      <VSelect
                        v-model="assigneeLocal"
                        :items="props.userOptions"
                        item-title="user_name"
                        item-value="user_id"
                        variant="outlined"
                        focused
                        required
                        hide-details="auto"
                        :rules="[(v) => !!v || 'Assignee is required']"
                      />
                    </div>
                    <div v-else>
                      <!-- <v-text-field
                        v-if="ticketDetailLocal['ticket_id'] == ''"
                        v-model="assigneeLocal"
                        variant="outlined"
                        focused
                        readonly
                        hide-details="auto"
                      /> -->
                      <VSelect
                        v-if="props.userOptions && ticketDetailLocal['ticket_id'] == ''"
                        v-model="assigneeLocal"
                        :items="props.userOptions"
                        item-title="user_name"
                        item-value="user_id"
                        variant="outlined"
                        focused
                        required
                        hide-details="auto"
                        readonly
                        :rules="[(v) => !!v || 'Assignee is required']"
                      /> 
                      <!-- {{ props.userOptions }} -->
                      <VSelect
                        v-if="props.userOptions && props.ticketDetail.assigned_user && ticketDetailLocal['ticket_id'] !== ''"
                        v-model="assigneeLocal"
                        :items="props.userOptions"
                        item-title="user_name"
                        item-value="user_id"
                        variant="outlined"
                        focused
                        required
                        hide-details="auto"
                        :readonly="Object.keys(priv).length !== 0"
                        :rules="[(v) => !!v || 'Assignee is required']"
                      />
                    </div>                    
                  </v-list-item>
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
                      :items="props.dictionary"
                      item-title="dictkey"
                      item-value="dictkey"
                      focused
                      :rules="[(v) => !!v || 'Priority is required']"
                      required
                      return-object
                      @update:model-value="setSLATime()"
                    />
                  </VListItem>
                  <VListItem v-if="props.project !== 'danareksa'" class="px-0">
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-timer-outline"
                      />
                      <span
                        class="required text-black font-weight-black pl-4"
                      > 
                        Sla Time 
                      </span>
                    </div>
                    <AppDateTimePicker
                      v-model="formattedSlaTime"
                      :config="{ enableTime: true, allowInput: false, clickOpens: false, dateFormat: 'Y-m-d H:i' }"
                      :rules="[(v) => !!v || 'Sla Time is required']"
                      required
                      placeholder="Select date"
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
                cols="12"
                md="7"
                class="flex-grow-1 px-2"
              >
                <!-- a -->
                <div v-if="ticketDetailLocal && ticketDetailLocal.data && ticketDetailLocal.data?.content && typeof ticketDetailLocal.data.content === 'object'">
                  <div v-if="!['sales', 'ao_code'].includes(ticketDetailLocal.data?.content)">
                    <VListItem class="px-0">
                      <div class="pb-2">
                        <VIcon :icon="setIconFields('sales')" />
                        <span class="text-black font-weight-black pl-4"> 
                          Sales
                        </span>
                      </div>
                      <VTextField
                        v-model="ticketDetailLocal.data.content.sales"
                        focused
                        :rules="[(v) => !!v || `Sales is required`]"
                      />
                    </VListItem>
                    <VListItem class="px-0">
                      <div class="pb-2">
                        <VIcon :icon="setIconFields('ao_code')" />
                        <span class="text-black font-weight-black pl-4"> 
                          AO Code
                        </span>
                      </div>
                      <VTextField
                        v-model="ticketDetailLocal.data.content.ao_code"
                        focused
                        :rules="[(v) => !!v || `AO Code is required`]"
                      />
                    </VListItem>
                  </div>
                  <div v-for="(value, key, index) in ticketDetailLocal.data?.content" :key="index">
                    <!-- b -->
                    <VListItem v-if="key === 'response'" class="px-0">
                      <div class="pb-2">
                        <VIcon
                          icon="mdi-comment-quote-outline"
                        />
                        <span
                          class="required text-black font-weight-black pl-4"
                        > 
                          {{ formatHeader(key) }}
                        </span>
                      </div>
                      <VSelect
                        v-model="ticketDetailLocal.data.content[key]"
                        :items="props.responseOptions"
                        item-title="title"
                        item-value="value"
                        focused
                        :rules="[
                          (v) => !!v || `${formatHeader(key)} is required`
                        ]"
                        required
                      />
                    </VListItem>
                    
                    <VListItem v-else-if="key !== 'response' && key !== 'sales' && key !== 'ao_code' && fieldsToBeShown?.length > 0 && fieldsToBeShown.includes(key)" class="px-0">  
                      <!-- c -->
                      <div class="pb-2">
                        <VIcon :icon="setIconFields(key)" />
                        <span class="required text-black font-weight-black pl-4"> 
                          {{ formatHeader(key) }} 
                        </span>
                      </div>
                      <VTextField
                        v-model="ticketDetailLocal.data.content[key]"
                        focused
                        :rules="[(v) => !!v || `${formatHeader(key)} is required`]"
                        required
                      />
                    </VListItem>
                  </div>

                </div>
                <div v-else-if="ticketDetailLocal && ticketDetailLocal.data && !ticketDetailLocal.data?.content">
                  <!-- d -->
                  <VListItem
                    class="px-0"
                  >
                    <div class="pb-2">
                      <VIcon
                        icon="mdi-comment-quote-outline"
                      />
                      <span
                        class="required text-black font-weight-black pl-4"
                      > 
                        Response
                      </span>
                    </div>
                    
                    <VSelect
                      v-model="fieldsCustomLocal.data.content.response"
                      :items="props.responseOptions"
                      item-title="title"
                      item-value="value"
                      focused
                      :rules="[
                        (v) => !!v || `Response is required`
                      ]"
                      required
                    />
                  </VListItem>

                  <!-- e -->
                  <div v-if="fieldsToBeShown?.length > 0">
                    <div v-for="(value, key, index) in fieldsToBeShown" :key="index">
                      <VListItem v-if="value !== 'response'" class="px-0">  
                        <div class="pb-2">
                          <VIcon :icon="setIconFields(value)" />
                          <span class="required text-black font-weight-black pl-4"> 
                            {{ formatHeader(value) }} 
                          </span>
                        </div>
                        <VTextField
                          v-model="fieldsCustomLocal.data.content[value]"
                          focused
                          :rules="[(v) => !!v || `${formatHeader(value)} is required`]"
                          required
                        />
                      </VListItem>
                    </div>
                  </div>
                </div>
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
                        :project="props.project"
                        :to-time-d-m-y-h-m="props.toTimeDMYHM"
                        :format-header="formatHeader"
                      />
                    </PerfectScrollbar>
                  </div>
                </VListItem>
                <div class="d-flex justify-end">
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
