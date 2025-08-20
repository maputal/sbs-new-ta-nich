<script setup>
import globalRequest from '@/plugins/globalRequest';
import { useGlobalStore } from '@/store/useGlobalStore';
import buildingBackground from '@images/telakses/BG_Login.png';
import Logo from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';
import {
  requiredValidator
} from '@validators';


const store = useGlobalStore()
const isPasswordVisible = ref(false)

//so that can access this.$route or this.$router on comp api
//https://router.vuejs.org/guide/advanced/composition-api.html
const route = useRoute()
const router = useRouter()

const errors = ref({
  nip: undefined,
  password: undefined,
})

const refVForm = ref()
const nip = ref('')
const password = ref('')

const userData = ref({})

const token = ref('')
const payloadFin = ref({})

const windowInnerHeight = ref(window.innerHeight)

const resetCredential = () => {
  nip.value = ''
  password.value = ''
}

const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  resetCredential()
  appStore.hideLoader()
  appStore.showError(e)
}

const getProfile = data => {
  globalRequest(
    'window.moffas.do_request',
    'getProfile',
    pload,
    onLoadOwnInfo,
    onDataError
  )
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
  // router.push(route.query.redirect ? String(route.query.redirect) : '/')
  router.replace(route.query.redirect ? String(route.query.redirect) : '/')

  // router.replace('/otp')
}

const login = () => {
  globalRequest(
    'taSecure_Login',
    '', // no op needed for login
    { username: nip.value, password: password.value },
    (res) => {
      // const result = JSON.parse(res);
      console.log('response login=', res)
      const result = res
  
      if (result.success) {
        console.log('Login successful')
        window.sessionStorage.setItem('username',nip.value)
  
        // getProfile()
  
        // Redirect to `to` query if exist or redirect to index route
        console.log('route.query.redirect', route.query.redirect)
        // router.push(route.query.redirect ? String(route.query.redirect) : '/')
        router.replace(route.query.redirect ? String(route.query.redirect) : '/')
  
        // router.replace('/otp')
      }
  
      resetCredential()
    },
    (err) => {
      console.error('Login failed', err)
      onDataError(err)
    }
  )
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
        class="d-none d-md-flex position-relative align-center"
      >
        <div
          class="w-100 h-100"
        >
          <VImg
            :max-height="windowInnerHeight"
            :src="buildingBackground"
            :cover="true"
            class="position-absolute top-0 start-0 w-100 h-100"
            style="border-top-right-radius: 15px; border-bottom-right-radius: 15px; z-index: 1;"
          />
          <div
            class="position-absolute top-0 start-0 w-100 h-100"
            style="background: linear-gradient(140.39deg, #ED1C24 10.43%, rgba(255, 203, 5, 0) 60.76%, #F67415 91.24%); border-top-right-radius: 15px; border-bottom-right-radius: 15px; z-index: 2;"
          ></div>
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
            :src="Logo"
            class="mx-auto"
          />

          <VCardTitle align="center">
            <div class="d-flex justify-center mb-5">
              <h1 class="text-primary font-weight-black mb-1 pr-1">
                Secure
              </h1>
              <h1 class="text-black font-weight-black mb-1">
                Bundling
              </h1>
            </div>
          </VCardTitle>

          <VCardText>
            <h2 class="font-weight-black mb-1">
              Sign In
            </h2>
            <p class="mb-0">
              Welcome back! Sign in to start your session
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
                    v-model="nip"
                    label="NIP"
                    :rules="[requiredValidator]"
                    :error-messages="errors.nip"
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
                    class="text-none"
                  >
                    Sign In
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
