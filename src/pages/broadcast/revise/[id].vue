<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
import { useGlobalStore } from '@/store/useGlobalStore'
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
}

const toBroadDetail = () => {
  console.log('formSubmit.value.broadcast_id di toBroadDetail', formSubmit.value.broadcast_id)
  router.replace('/broadcast/detail/'+ formSubmit.value.broadcast_id)
  // router.replace('/broadcast/detail/'+ props.id)
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

const todayDateF = (type='') => {
  let today = new Date()
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date =
      dd < 10 ? '0' + dd : dd
  
  if(type == 'csvName'){
    return (
        date +
        '' +
        month +
        '' +
        year
    )
  } else {
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
}

const toDateDMY = (unixTimestamp) => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  let date =
      dd < 10 ? '0' + dd : dd
  
  return (
    year +
    '-' +
    month +
    '-' +
    date+
    ' ' +
    hours + 
    ':' + 
    minutes+ 
    ':' + 
    seconds
  )
}

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const confirmationDialog = ref(false)
const successDialog = ref(false)

const group = ref([])
const template = ref([])
const dataCSV = ref([])
const filteredTemplateType = ref('')
const filteredTemplateName = ref('')

const isErrorVisible = ref(false)
const showProgressCircular = ref(false)

const customErrorMessages = ref('')

const currentPage = ref(1)
const perPage = ref(10)

const status = ref('APPROVED')

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

const successDialogProps = ref({
  subject: '',
})

const formSubmit = ref({
  broadcast_template: '',
  broadcast_group: '',
  broadcast_id: '',
  template_csv_example: '',
  schedule: 0,
  broadcast_csv: [],
  broadcastCsvToBase64: '',
  type:'',
})

const filteredTemplate = () => {  
  if(formSubmit.value['broadcast_template']) {
    let objFilteredTemplate = template.value.filter((data) => data.template_id == formSubmit.value['broadcast_template']) 
  
    if(objFilteredTemplate.length > 0){
      filteredTemplateType.value = objFilteredTemplate[0].type
      filteredTemplateName.value = objFilteredTemplate[0].name

    } else {
      filteredTemplateType.value = objFilteredTemplate.type
      filteredTemplateName.value = objFilteredTemplate.name
    }   
  }
}

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
  showProgressCircular.value = false
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      confirmationDialog.value = true
  })
}

const confirmYes = () => { 
  if (formSubmit.value.broadcast_csv.length > 0) {
    csvToBase64()
  } else {
    getBroadcastUpdate()
  }      
}

const handleUpdateBroadcastGroup = () => {
  formSubmit.value.broadcast_csv = []
  formSubmit.value.broadcastCsvToBase64 = ''
}

const fetchDetails = () => {
  console.log('fetchDetails')
  
  let params = {
    broadcast_id: Number(route.params.id),    
    // broadcast_id: props.id,    
  }

  window.moffas.do_request(
    'get_broadcast',
    params, 
    onFetchDetails,
    onDataError,
  )
}

const onFetchDetails = data => {
  const response = JSON.parse(data)

  console.log('ini onFetchDetails')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  formSubmit.value.broadcast_id = response.broadcast_id
  formSubmit.value.broadcast_template = response.template_id
  formSubmit.value.broadcast_group = response.reference.group_id
  formSubmit.value.schedule = toDateDMY(response.schedule)

  getTemplates()
}

////////// 👉 Getting Broadcast Template //////////////
const getTemplates = () => {
  console.log('getTemplates')

  const params = {
    filter_by: {
      status: status.value
    }
  }

  window.moffas.do_request(
    'get_templates',
    params, 
    onGetTemplates,
    onDataError,
  )
}

const onGetTemplates = data => {
  const response = JSON.parse(data)

  console.log('ini response')
  console.log(response.templates)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  template.value = response.templates
  
  filteredTemplate()
  getGroups()
}

const getTemplateAll = () => {
  return template.value
}

////////// 👉 Getting Broadcast Group //////////////
const getGroups = () => {
  console.log('getgroups')

  const params = {
    currentPage: currentPage.value,
    perPage: perPage.value,
  }

  window.moffas.do_request(
    'group_get_all',
    params, 
    onGetGroups,
    onDataError,
  )
}

const onGetGroups = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  group.value = response.groups
}

const getGroupAll = () => {
  return group.value
}

////////// 👉 Convert Base64 to CSV //////////////
const download = (data) => {
  
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')

  console.log('ini todayDateF', todayDateF('csvName'))
  showProgressCircular.value = false  

  a.setAttribute('href', url)
  a.setAttribute('download', filteredTemplateName.value + '_' + todayDateF('csvName') + '.csv');
  a.click()
}

const csvmaker = (data) => {

  console.log('csvmaker')
  console.log(data)
  
  //Desired headers in the .csv. Other fields are ignored
  let headers = []
  //Choose your seperator
  const seperator = ",";

  if(data){
    for (let k in data[0]){
      headers.push(k)
    }
  }

  //Prepare csv with a header row and our data
  const csv = [headers.join(seperator),
  ...data.map(row => headers.map(field => `${row[field]}`).join(seperator))
  ]

  return csv.join("\n")
  
}

const base64ToCSV = () => {
  getCsvExamples()  
}

const getCsvExamples = () => {
  console.log('getCsvExamples')

  const params = {
    template_id: formSubmit.value.broadcast_template,
  }

  window.moffas.do_request(
    'get_template_parameters',
    params, 
    onCsvExamples,
    onDataError,
  )
}

const onCsvExamples = data => {
  const response = JSON.parse(data)

  console.log('response CSV')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    showProgressCircular.value = false
    
    return
  }
    
  dataCSV.value = response.parameters

  const csvdata = csvmaker(dataCSV.value);
  download(csvdata);
  document.getElementById('action');
}

////////// 👉 Convert CSV to Base64 //////////////
const csvToBase64 = () => {
  let files = document.getElementById('file').files;
  if (files.length > 0) {
    getBase64(files[0]);
  }
};

const getBase64 = (file) => {
 
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
    // formSubmit.value.broadcast_csv = reader.result
    formSubmit.value.broadcastCsvToBase64 = reader.result
    getBroadcastUpdate()
  };        
}


const epoch = (date) => {
  const dateToday = Math.floor(new Date(date).getTime()/1000)

  return dateToday
}

////////// 👉 // 👉 Revise or updating //////////////
const getBroadcastUpdate = () => {
  console.log('getBroadcastUpdate')

  const params = {
    broadcast_id: route.params.id,
    template_id: formSubmit.value['broadcast_template'],
    schedule: epoch(formSubmit.value['schedule']),
  }

  if (formSubmit.value['broadcast_group']) {
    params.group_id = formSubmit.value['broadcast_group']
  }

  if (formSubmit.value['broadcastCsvToBase64']) {
    params.csv = formSubmit.value['broadcastCsvToBase64']
  }

  window.moffas.do_request(
    'update_broadcast',
    params, 
    onGetBroadcastUpdate,
    onDataError,
  )
}

const onGetBroadcastUpdate = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
  } else {
    successDialogProps.value.subject = 'submit'
    successDialog.value = true
  }
}

const onBroadcastTemplateChange = () => {
  filteredTemplate()
  console.log('filteredTemplateType.value', filteredTemplateType.value)
  if (filteredTemplateType.value == 'DYNAMIC') {
    formSubmit.value.broadcast_group = ''
  }
}


// 👉 Fetch getTemplates
// watch(getTemplates)

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()

  fetchDetails()
})
</script>

<template>
  <section>
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    />
    <div>
      <VChip
        color="primary"
        variant="flat"
        class="text-capitalize font-weight-bold me-5 mb-7"
        prepend-icon="mdi-access-point"
      >
        Broadcast
      </VChip>
    </div>
    <div>
      <h6 class="text-2xl font-weight-bold mb-2">
        Revise Broadcast
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Revise broadcast message request page
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-4">
          <!-- 👉 Issue Date -->
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
          </p>
        </div>
      </div>
    </div>
    <div>
      <VCard>        
        <VCardText class="pt-10"> 
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"            
          > 
            <VCol
              cols="12"
              md="9"
              class="d-flex align-center pl-6 justify-end"
            >
              <span
                class="required text-black font-weight-black"
              > 
                Broadcast Template 
              </span>
              <VSelect
                class="ml-6"
                v-model="formSubmit['broadcast_template']"
                :items="getTemplateAll()"
                @update:modelValue="onBroadcastTemplateChange"
                item-value="template_id"
                item-title="name"
                focused
                :rules="[(v) => !!v || 'Template is required']"
                required
              />
            </VCol>
            <VCol    
              v-if="filteredTemplateType == 'STATIC'"        
              cols="12"
              md="9"
              class="d-flex align-center pl-6 justify-end"
            >
              <span
                class="text-black font-weight-black"
              > 
                Broadcast Group 
              </span>
              <VSelect
                class="ml-14"
                v-model="formSubmit['broadcast_group']"
                :items="getGroupAll()"
                item-value="group_id"
                item-title="group_name"
                focused
                clearable
                :disabled="formSubmit.broadcast_csv.length > 0"
                @update:modelValue="handleUpdateBroadcastGroup()"
              />
            </VCol>
            <VCol
              v-if="!formSubmit.broadcast_group"
              cols="12"
              md="9"
              class="d-flex align-center pl-6"
            >
              <span
                class="mr-3 text-black font-weight-black"
              > 
                Template CSV Example 
              </span>
              <VBtn
                v-model="formSubmit['template_csv_example']"
                id="action"
                class="text-none text-white"
                variant="flat"
                :disabled="!formSubmit.broadcast_template"
                @click="() => {
                  if(showProgressCircular == false) {
                    base64ToCSV()
                  }
                  showProgressCircular = true          
                }"
              >
                Download Example
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              md="9"
              class="d-flex align-center pl-6 justify-end"
            >
              <span
                class="required mr-16 text-black font-weight-black"
              > 
                Schedule 
              </span>
              <AppDateTimePicker
                class="ml-8"
                v-model="formSubmit['schedule']"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', defaultDate: formSubmit['schedule']}"
                :rules="[(v) => !!v || 'Schedule is required']"
                required
              />  
            </VCol>
            <VCol
              v-if="!formSubmit['broadcast_group']"
              cols="12"
              md="9"
              class="d-flex align-center pl-6"
            >
              <span
                class="mr-15 text-black font-weight-black"                
                :class="{required: filteredTemplateType == 'DYNAMIC'}"
              > 
                Broadcast CSV 
              </span>
              <VFileInput
                id="file"
                v-model="formSubmit['broadcast_csv']"
                prepend-icon="mdi-folder-arrow-up-outline"
                density="compact"
                variant="outlined"
                class="ml-2"
                :required="filteredTemplateType == 'DYNAMIC'"
              /> 
            </VCol>        
            <VSheet class="d-flex align-center pa-6 justify-end">
              <RouterLink
                :to="'/broadcast/detail/' + route.params.id"
              >
              <VBtn
                class="text-none me-4"
                variant="outlined"
                width="125px"
              >
                Cancel
              </VBtn>
              </RouterLink>
              <VBtn
                :disabled="!priv.hasOwnProperty('create_broadcast') && Object.keys(priv).length !== 0" 
                class="text-none"
                type="submit"
                variant="flat"
                width="125px"
              >              
                Submit
              </VBtn>
            </VSheet>            
          </VForm>
        </VCardText>
      </VCard>
    </div>
    <VDialog
      v-model="showProgressCircular"
      persistent
    >
      <div class="text-center">
        <VProgressCircular
          color="primary"
          indeterminate
          :size="50" 
          :width="10"          
        ></VProgressCircular>
      </div>
    </VDialog>
    <CustomConfirmDialog
      v-model:is-dialog-visible="confirmationDialog"
      rounded="lg"
      confirmation-styling="2"
      message-title="Are you sure you want to submit this?"
      @yes="() => {
        confirmYes()
      }"
    />
    <CustomNotifDialog
      v-model:is-dialog-visible="successDialog"
      rounded="lg"
      width="auto"
      :subject="successDialogProps.subject"
      @ok="() => {
        toBroadDetail()
      }"
    />
  </section>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}

// input[type="file"] {
//   border: 4px solid red;
//   border-radius: 5px;
//   padding: 5px;
// }

// .custom-file-upload {
//     border: 1px solid #ccc;
//     display: inline-block;
//     padding: 6px 12px;
//     cursor: pointer;
// }
</style>
