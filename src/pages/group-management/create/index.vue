<script setup>
import CustomConfirmDialog from '@/components/CustomConfirmDialog.vue'
import CustomNotifDialog from '@/components/CustomNotifDialog.vue'
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
  let day = today.getDay()
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

const formKeyNames = ref(['Group Name'])
const formRequired = ref(['Group Name'])
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const isPasswordVisible = ref(false)
const confirmationDialog = ref(false)
const successDialog = ref(false)

// const role = ref([])
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const isSuccess = ref({
  success: false,
  id: -1,
})

const formSubmit = ref({
  group_name: '',
})

const resetForm = () => {
  formSubmit.value.group_name = null
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const onDataError = e => {
  console.log(e)

  isErrorVisible.value = true
  customErrorMessages.value = e
}

const createGroup = () => {
  console.log('createGroup')

  const params = {
    group_name: formSubmit.value.group_name,
  }

  window.moffas.do_request(
    'group_create',
    params, 
    onCreateGroup,
    onDataError,
  )
}

const onCreateGroup = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }
  
  isSuccess.value.success = response.success
  isSuccess.value.id = response.data.id

  confirmationDialog.value = false
  if(isSuccess.value.success) {
    successDialog.value = true
  }
  isSuccess.value.success = false
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      confirmationDialog.value = true
  })
}

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

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
      <h6 class="text-2xl font-weight-bold mb-2">
        Group Management
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-4">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Create Group 
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-4">
          <!-- 👉 Issue Date -->
          <p class="mb-2 font-weight-medium">
            <span>{{ todayDate }} </span>
          <!-- <span>{{ invoiceData.issuedDate }}</span> -->
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
            <VRow
              v-for="(name, index) in formKeyNames"
              :key="index"
              class="align-center"
            >
              <VCol
                cols="12"
                md="3"
                lg="2"
              >
                <span
                  class="ma-4 text-black font-weight-black"
                  :class="{required: formRequired.includes(name)}"
                >{{ name }}</span>
              </VCol>
              <VCol
                cols="12"
                md="5"
              >
                <VTextField
                  v-if="name != 'Role'"
                  v-model="formSubmit[name.toLowerCase().replace(' ', '_')]"
                  focused
                />
              </VCol>
            </VRow>
            <VSheet class="d-flex align-center pa-6 justify-end">
              <VBtn
                v-if ="priv.hasOwnProperty('create_group') || Object.keys(priv).length === 0"
                class="text-none"
                type="submit"
                rounded="xl"
                variant="flat"
                width="125px"
              >
                Submit
              </VBtn>
              <CustomConfirmDialog
                v-model:is-dialog-visible="confirmationDialog"
                rounded="lg"
                confirmation-styling="2"
                message-title="Are you sure you want to submit this?"
                @yes="() => {
                  createGroup()
                  confirmationDialog = false
                  successDialog = true
                }"
              />
              <CustomNotifDialog
                v-model:is-dialog-visible="successDialog"
                rounded="lg"
                subject="submit"
                @ok="() => {
                  resetForm()
                }"
              />
            </VSheet>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}
</style>
