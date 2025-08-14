<script setup>
import { useGlobalStore } from '@/store/useGlobalStore'
import depBuildingBackground from '@images/telakses/BG_Login_CRM.png'
import depLogoGrey from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png'
import {
  emailValidator,
  requiredValidator,
} from '@validators'


const store = useGlobalStore()
const isPasswordVisible = ref(false)

//so that can access this.$route or this.$router on comp api
//https://router.vuejs.org/guide/advanced/composition-api.html
const route = useRoute()
const router = useRouter()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()
const email = ref('')
const password = ref('')
const response = ref('')
const token = ref('')
const payloadFin = ref({})
const userData = ref({})
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref()
const windowInnerHeight = ref(window.innerHeight)

const onProceed = () => {
  let pload = { fcm_token: 'dummy', deviceuuid: 'dummy' }
  window.moffas.fin(
    password.value,
    pload,
    onSuccess,
    onUnauth,
    onError,
  )
}

const onSuccess = data => {
  console.log(data)
  token.value = data.token
  payloadFin.value = JSON.parse(data.payload)

  let pload = {}

  window.moffas.do_request(
    'getProfile',
    pload,
    onLoadOwnInfo,
    onDataError,
  )
}

const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
  resetCredential()
  console.log(e)
}

const onLoadOwnInfo = data => {
  userData.value = JSON.parse(data)

  store.SET_USER(userData)
  store.SET_TOKEN(token)
  store.SET_PAYLOAD_FIN(payloadFin)
  
  if (window.localStorage) {
    localStorage.setItem('user', JSON.stringify(userData.value))
    localStorage.setItem('token', JSON.stringify(token.value))
    localStorage.setItem('payload_fin', JSON.stringify(payloadFin.value))
  }
  
  // Redirect to `to` query if exist or redirect to index route
  console.log('route.query.redirect', route.query.redirect)
  router.push(route.query.redirect ? String(route.query.redirect) : '/')
  // router.replace(route.query.redirect ? String(route.query.redirect) : '/')
}

const onUnauth = () => {
  isErrorVisible.value = true
  customErrorMessages.value = 'Username atau Password salah'
  resetCredential()

  // console.log('Un-Auth')
}

const onDenied = () => {
  isErrorVisible.value = true
  customErrorMessages.value = 'User Denied'
  resetCredential()

  // console.log('Denied')
}

const onError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = 'Gangguan Koneksi. Silakan coba lagi'
  resetCredential()

  // console.log(e)
}

const resetCredential = () => {
  email.value = ''
  password.value = ''
}

const login = () => {
  window.moffas.login_start(
    email.value,
    onProceed,
    onUnauth,
    onDenied,
    onError,
  )
  
  // axios.post('/auth/login', {
  //   email: email.value,
  //   password: password.value,
  // }).then(r => {
  //   const { accessToken, userData } = r.data

  //   store.SET_USER(userData)
  //   store.SET_TOKEN(accessToken)
   
  //   if (window.localStorage) {
  //     localStorage.setItem('user', JSON.stringify(userData))
  //     localStorage.setItem('token', JSON.stringify(accessToken))
  //   }
   

  //   // Redirect to `to` query if exist or redirect to index route
  //   router.replace(route.query.redirect ? String(route.query.redirect) : '/')
  // }).catch(e => {
  //   const { errors: formErrors } = e.response.data

  //   errors.value = formErrors
  //   console.error(e.response.data)
  // })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <div>
    <!-- erorr dialogs -->
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    />
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <!-- <VNodeRenderer :nodes="themeConfig.app.logo" /> -->
    </div>

    <VRow
      no-gutters
      class="auth-wrapper"
    >
      <VCol
        md="7"
        class="d-none d-md-flex position-relative"
      >
        <div
          class="d-flex w-100 h-100"
        >
          <VImg
            :max-height="windowInnerHeight"
            :src="depBuildingBackground"
            cover="true"
            style="border-top-right-radius: 15px; border-bottom-right-radius: 15px;"
          />
        </div>
        <!-- <VImg
          :width="500"
          :src="depHeaderLogo"
          class="depLoginText"
        /> -->

         <div class="depLoginText pt-10 mr-16">
          <div class="custom-card-hello-login px-4 py-3">
            <h2 class="text-white">Hello, Welcome Back to</h2>
            <h1 class="text-white">Customer Relationship Management</h1>
          </div>
          <h3 class="text-white font-weight-light px-4">Sign in to access your CRM dashboard and manage customer relationships effectively</h3>
				</div>
      </VCol>

      <VCol
        cols="12"
        md="5"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          flat
          :max-width="600"
          class="mt-12 mt-sm-0 pa-4"
          :width="600"
        >
          <VImg
            :width="270"
            :src="depLogoGrey"
            class="mx-auto mb-4"
          />
          <VCardText>
            <h5 class="text-h5 font-weight-black mb-1">
              Sign In
            </h5>
            <p class="mb-0">
              Please sign-in to your account
            </p>
          </VCardText>
          <VCardText>
            <VForm
              ref="refVForm"
              @submit.prevent="onSubmit"
            >
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="email"
                    label="Email"
                    type="email"
                    :rules="[requiredValidator, emailValidator]"
                    :error-messages="errors.email"
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <VTextField
                    v-model="password"
                    label="Password"
                    :rules="[requiredValidator]"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :error-messages="errors.password"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    class="mb-4"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <!-- <div class="d-flex align-center flex-wrap justify-end mt-1 mb-4">
                    <RouterLink
                      class="text-primary ms-2 mb-1"
                      :to="{ name: 'forgot-password' }"
                    >
                      Forgot Password?
                    </RouterLink>
                  </div> -->

                  <VBtn
                    block
                    type="submit"
                  >
                    Login
                  </VBtn>
                </VCol>             
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
