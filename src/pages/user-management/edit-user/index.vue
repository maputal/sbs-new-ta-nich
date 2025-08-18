<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { useUserManagementStore } from '@/store/useUserManagementStore'
import axios from '@axios'
import { useRouter } from 'vue-router'

const store = useGlobalStore()
const userStore = useUserManagementStore()
const appStore = useAppStore()

const router = useRouter()

const toLoginWaba = () => {
    router.replace('/')
}

const todayDate = ref('')

const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'Desember',
}

const days = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
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

const urlBE = ref(window.moffas.config.url_backoffice_helper_api)
const companyID = ref(window.moffas.config.param_company_id)
const sessionID = ref(localStorage.getItem('moffas.token'))

const formKeyNames = ref([['NIP', 'Name', 'Division'], ['Role', 'Status']])
const formRequired = ref(['NIP', 'Name', 'Password', 'Division', 'Role', 'Status'])
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const refVForm = ref()
const isPasswordVisible = ref(false)
const confirmationDialog = ref(false)
const successDialog = ref(false)
const role = ref([{ "name": "Admin", "id": 1 }, { "name": "Customer Service", "id": 2 }, { "name": "Developer", "id": 3 }]) //{name, id}
const statuses = ref(['Active', 'Inactive'])
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData.priv

console.log("---------- hasil priv=", priv)

const userInfo = ref({
    nip: '',
    name: '',
    password: '',
    division: '',
    role: null,
    status: null
    // role: getFirstRoleName(),
})

// Async loader
async function loadUserInfo() {

    appStore.showLoader()

    // Simulate async fetching — could be API or just store hydration delay
    await new Promise(resolve => setTimeout(resolve, 0)); // microtask

    console.log("Ada gak user bro")

    if (userStore.user) {
        console.log("Ada user bro")
        console.log(userStore.user)
        userInfo.value = {
            ...userStore.user
        };
    }

    appStore.hideLoader()
}

const getFirstRoleName = () => {
    try {
        return role.value[0].name
    } catch (error) {
        return null
    }
}

const getRoleNames = () => {
    let arr = []
    role.value.forEach((items, index) => {
        arr[index] = items.name
    })

    return arr
}

const onDataError = e => {
    isErrorVisible.value = true
    customErrorMessages.value = e
}

const createUser = () => {
    console.log('createUser')

    let params = {
        company_id: companyID.value,
        session_id: sessionID.value,
        op_crud: 1,


        data: {
            nip: formSubmit.value.nip,
            name: formSubmit.value.name,
            password: formSubmit.value.password,
            division: formSubmit.value.division,
            role: formSubmit.value.role,
            status: formSubmit.value.status
        }
    }

    //   window.moffas.do_request(
    //     'user_create',
    //     params, 
    //     onCreateUser,
    //     onDataError,
    //   )

    // Ceritanya berhasil
    successPopup("New user has been successfully saved")
    // kalau gagal
    // errorPopup("Apalah alasan nya")

    // For now asumsi field clear, jadi user bisa lanjut nambah kalau mau
    resetForm()

    console.log(params.data)
}

const onSubmit = () => {
    refVForm.value?.validate().then(({ valid: isValid }) => {
        if (isValid)
            confirmationDialog.value = true
    })
}

const getRoles = () => {
    let params = {
        company_id: companyID.value,
        session_id: sessionID.value
    }

    axios.post(urlBE.value + 'retrieve_management_user_roles', params)
        .then(function (response) {
            console.log('response getRoles=', response)
            const responseData = response.data

            console.log('responseData', responseData)

            if (response.data.error_code) {
                onDataError(response.data)

                return
            }

            role.value = responseData.data

            // showProgressCircular.value = false
        })
        .catch(function (error) {
            console.log(error)
            onDataError(error.response)
        })
}

const confirmYes = () => {
    //createUser()        
}

onMounted(() => {
    let isEmbeddedSignup = store.payloadFin.embedded_signup

    // DEV MODE
    // isEmbeddedSignup = true
    if (!isEmbeddedSignup) {
        toLoginWaba()
    }
    todayDate.value = todayDateF()
    getRoles()
    loadUserInfo()
})

function confirmAdditionPopup() {
    appStore.setPopup({
        title: 'Confirm Add New User',
        word: 'Are you sure you want to add this new user to the system?',
        action: 'warn',
        onSucc: () => {
            confirmYes()
        },
    })
}

function errorPopup(error_message) {
    appStore.setPopup({
        title: 'Error',
        word: error_message || 'Undefined failure!',
        action: 'error',
        onSucc: () => {
            //
        },
    })
}

function successPopup(success_message) {
    // appStore.setPopup({
    //     title: 'Success!',
    //     word: success_message || '',
    //     action: 'success',
    //     onSucc: () => {
    //         showDialogGroup.value = false
    //     },
    // })
}
</script>

<template>
    <section>
        <LazyErrorDialogs v-if="isErrorVisible" v-model:isDialogVisible="isErrorVisible"
            :custom-error-message="customErrorMessages" />
        <div>
            <h6 class="text-2xl font-weight-bold mb-2">
                User Management
            </h6>
            <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
                <!-- 👉 Left Content -->
                <div class="mb-4">
                    <!-- 👉 Address -->
                    <p class="mb-0 font-weight-medium">
                        Create User
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
                <VCardText class="d-flex align-center" style="justify-content: space-between;">
                    <v-btn icon="mdi-arrow-left" to="/user-management/view-all" class="back" />
                    <h2 style="margin: 0;">
                        Add New User
                    </h2>
                </VCardText>
                <hr>
                </hr>
                <VSpacer />
                <VCardText class="pt-10">
                    <VForm ref="refVForm" @submit.prevent="onSubmit">
                        <span class="d-flex">
                            <VCol v-for="(group, gindex) in formKeyNames" :key="gindex" class="align-center">
                                <VRow v-for="(name, index) in group" :key="index" class="align-center">
                                    <VCol cols="12" md="12">
                                        <VTextField v-if="name != 'Role' && name != 'Status'"
                                            v-model="userInfo[name.toLowerCase().replace(' ', '_')]"
                                            :type="name == 'Password' ? (isPasswordVisible ? 'text' : 'password') : null"
                                            :rules="formRequired.includes(name) ? (name == 'Email' ? [requiredValidator, emailValidator] : [requiredValidator]) : []"
                                            :append-inner-icon="name == 'Password' ? (isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline') : null"
                                            @click:append-inner="name == 'Password' ? (isPasswordVisible = !isPasswordVisible) : null"
                                            variant="outlined" :label="name" class="w-100" :placeholder="name" />
                                        <VSelect v-else-if="name == 'Role'" v-model="userInfo['role']" :items="role"
                                            item-value="id" item-title="name"
                                            :rules="formRequired.includes(name) ? ([requiredValidator]) : []"
                                            variant="outlined" :label="name" class="w-100" />
                                        <VSelect v-else-if="name == 'Status'" v-model="userInfo['status']"
                                            :items="statuses" item-value="id" item-title="status_name"
                                            :rules="formRequired.includes(name) ? ([requiredValidator]) : []"
                                            variant="outlined" :label="name" class="w-100" />
                                    </VCol>
                                </VRow>
                            </VCol>
                        </span>
                        <VSheet class="d-flex align-center pa-6 justify-end">
                            <VBtn v-if="priv.hasOwnProperty('create_user') || Object.keys(priv).length === 0"
                                class="text-none" type="submit" rounded="xl" variant="flat" width="125px"
                                @click="confirmAdditionPopup">
                                Submit
                            </VBtn>
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

.back {
    background-color: rgb(var(--v-theme-surface-variant), .82) !important;
    color: #fff;

    &:hover {
        background-color: rgba(var(--v-theme-on-surface), calc(.82 - .14));
    }

    :deep(.v-icon) {
        color: inherit;
    }
}
</style>
