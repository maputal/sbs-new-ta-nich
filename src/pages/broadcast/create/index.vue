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

const toBroadList = () => {
  router.replace('/broadcast/list/')
}

const toBroadDetail = () => {
  router.replace('/broadcast/detail/' + broadcastID.value)
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


const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()

const confirmationDialog = ref(false)
const successDialog = ref(false)
const isErrorVisible = ref(false)

const template = ref([])
const group = ref([])
const dataCSV = ref([])

const customErrorMessages = ref('')

const currentPage = ref(1)
const perPage = ref(10)

const status = ref('APPROVED')
const broadcastID = ref('')

const showProgressCircular = ref(false)

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

const successDialogProps = ref({
  subject: '',
})

const formSubmit = ref({
  broadcast_template: '',
  broadcast_group: '',
  template_csv_example: '',
  schedule: new Date(),
  broadcast_csv: [],
  broadcastCsvToBase64: '',
  title: '',
})

const filteredTemplate = computed(() => {  

  let objFilteredTemplate = template.value.filter(data => data.template_id == formSubmit.value['broadcast_template']) 

  if(objFilteredTemplate.length > 0){
    return objFilteredTemplate[0]
  } else {
    return objFilteredTemplate
  }   
})

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
  showProgressCircular.value = false
}

const epoch = date => {
  return Math.floor(new Date(date).getTime()/1000)
}

const onSubmit = () => {
  if(showProgressCircular.value == false) {
    refVForm.value?.validate().then(({ valid: isValid }) => {
      if (isValid)
        confirmationDialog.value = true
    })
  }

  showProgressCircular.value = true
}

const chooseCreate = () => {
  if (formSubmit.value.broadcast_csv.length > 0) {
    csvToBase64()
  } else {
    createBroadcast()
  } 
}

const handleUpdateBroadcastGroup = () => {
  formSubmit['broadcast_csv'] = []
  formSubmit.value.broadcastCsvToBase64 = ''
}

////////// 👉 Creating New Broadcast //////////////
const createBroadcast = () => {  

  let params = {
    template_id: formSubmit.value.broadcast_template,
    schedule: epoch(formSubmit.value.schedule),
  }

  if (formSubmit.value.title != '') {
    params.title = formSubmit.value.title
  }

  if (formSubmit.value.broadcastCsvToBase64 != '') {
    params.csv = formSubmit.value.broadcastCsvToBase64
  }

  if (formSubmit.value.broadcast_group) {
    params.group_id = formSubmit.value.broadcast_group
  }
  
  console.log('params di createBroadcast')
  console.log(params)

  window.moffas.do_request(
    'create_broadcast',
    params, 
    onCreateBroadcast,
    onDataError,
  )
}

const onCreateBroadcast = data => {
  const response = JSON.parse(data)

  console.log('ini respone')
  console.log(response)

  broadcastID.value = response.broadcast_id

  if (response.hasOwnProperty('trace_id')){
    showProgressCircular.value = false
    customErrorMessages.value = response
    isErrorVisible.value = true
  } else {
    showProgressCircular.value = false
    successDialogProps.value.subject = 'submit'
    successDialog.value = true
  }
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
  
  getGroups()
  template.value = response.templates
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
const download = data => {
  
  const blob = new Blob([data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')

  showProgressCircular.value = false  

  a.setAttribute('href', url)
  a.setAttribute('download', filteredTemplate.value.name + '_' + todayDateF('csvName') + '.csv')
  a.click()
}

const csvmaker = data => {
  
  //Desired headers in the .csv. Other fields are ignored
  let headers = []

  //Choose your seperator
  const seperator = ","

  if(data){
    for (let k in data[0]){
      headers.push(k)
    }
  }

  //Prepare csv with a header row and our data
  const csv = [headers.join(seperator),
    ...data.map(row => headers.map(field => `${row[field]}`).join(seperator))]

  return csv.join("\n")
}

// JavaScript object for development purpose
const dataf = [
  { nama: 'lisa', umur: 25 },
  { nama: 'sat', umur: 24 },
]

// const dataCSV = []

const base64ToCSV = () => {
  getCsvExamples()  
}

const getCsvExamples = () => {
  console.log('getTemplates')

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

  const csvdata = csvmaker(dataCSV.value)

  download(csvdata)
  document.getElementById('action')
}

////////// 👉 Convert CSV to Base64 //////////////
const csvToBase64 = () => {
  let files = document.getElementById('file').files
  if (files.length > 0) {
    getBase64(files[0])
  }
}

const getBase64 = file => {
 
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    console.log(reader.result)
    // formSubmit.value.broadcast_csv = reader.result
    formSubmit.value.broadcastCsvToBase64 = reader.result
    createBroadcast()
  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }        
}

const onBroadcastTemplateChange = () => {
  if (filteredTemplate.value.type == 'DYNAMIC') {
    formSubmit.value.broadcast_group = ''
  }
}

// 👉 Fetch GroupManagement
watch(getTemplates)

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()
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
        Add New Broadcast
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            New broadcast message request page
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
                v-model="formSubmit['broadcast_template']"
                class="ml-7"
                :items="getTemplateAll()"
                item-value="template_id"
                item-title="name"
                focused
                :rules="[(v) => !!v || 'Template is required']"
                required
                @update:modelValue="onBroadcastTemplateChange"
              />
            </VCol>
            <VCol
              cols="12"
              md="9"
              class="d-flex align-center pl-6 justify-end"
            >
              <span
                class="text-black font-weight-black pr-3"
              > 
                Broadcast Title 
              </span>
              <VTextField
                v-model="formSubmit['title']"
                class="ml-15"
                focused
              />
            </VCol>
            <VCol    
              v-if="filteredTemplate.type == 'STATIC'"        
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
                v-model="formSubmit['broadcast_group']"
                class="ml-15"
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
                class="mr-4 text-black font-weight-black"
              > 
                Template CSV Example 
              </span>
              <VBtn
                id="action"
                v-model="formSubmit['template_csv_example']"
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
                v-model="formSubmit['schedule']"
                class="ml-9"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', defaultDate: new Date() }"
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
                class="required mr-15 text-black font-weight-black"
              > 
                Broadcast CSV 
              </span>
              <VFileInput
                id="file"
                v-model="formSubmit['broadcast_csv']"
                prepend-icon="mdi-folder-arrow-up-outline"
                density="compact"
                variant="outlined"
                :rules="[(v) => !!v || 'CSV is required']"
                required
              /> 
            </VCol>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                class="text-none me-4"
                variant="outlined"
                width="125px"
                @click="toBroadList"
              >
                Cancel
              </VBtn>
              <VBtn
                class="text-none"
                type="submit"
                variant="flat"
                width="125px"
                :disabled="!priv.hasOwnProperty('create_broadcast') && Object.keys(priv).length !== 0" 
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
      @yes="chooseCreate"
      @no="showProgressCircular = false"
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
</style>
