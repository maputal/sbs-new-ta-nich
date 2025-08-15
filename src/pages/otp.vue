<script setup>
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';
import bgImage from '@images/pages/bg-vector.png';
import logo from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';

const router = useRouter()

const logout = () => {
  router.replace('/logout')
}

const appStore = useAppStore()

const phoneNumber = ref()
const otp = ref()

const countdown = ref(0)
let timer = null

// Format countdown to MM:SS (e.g., 01:00)
const formattedCountdown = computed(() => {
  const minutes = String(Math.floor(countdown.value / 60)).padStart(2, '0')
  const seconds = String(countdown.value % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

const startCountdown = () => {
  countdown.value = 60

  // Optionally trigger resend code logic
  resendCode()

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 500)
}

const onDataError = (e) => {
  console.log('masuk error di onDataError')
  appStore.hideLoader()
  appStore.showError(e)
}

//////////////////////////////////////////////// OPERATIONS

const resendCode = () => {
  // Your actual resend logic goes here (e.g., API call)
  console.log('Code resent!')
  appStore.showLoader()

  // setTimeout(() => {
  //   console.log("This message appears after a 2-second delay.");
  //   appStore.hideLoader()
  // }, 5000); // 2000 milliseconds = 2 seconds
  return

  console.log('resendCode')

  const params = {
    row_length: rowPerPage.value,
    current_page: currentPage.value,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      tableData.value = response.broadcasts
      totalPage.value = response.total_pages
      totalBroadcast.value = response.total_rows
    },
    onDataError
  )
}

const submitForm = () => {
  if (!otp.value || otp.value.length < 6) {
    appStore.showError('Please enter the complete verification code.')
    return
  }


  console.log('Code submitForm!', otp.value)

  appStore.showLoader()

  setTimeout(() => {
    console.log("This message appears after a 2-second delay.");
    appStore.hideLoader()
    router.replace('/')
  }, 500); // 2000 milliseconds = 2 seconds

  return

  console.log('submitForm')

  appStore.showLoader()

  const params = {
    otp: otp.value,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      router.replace('/')

      appStore.hideLoader()
    },
    onDataError
  )
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center mb-8">
        <div class="d-flex">
          <VImg
            :width="160"
            :src="logo"
          />          
        </div>
      </VCardItem>

      <VCardText class="d-flex flex-column align-center text-center my-2">
        <h2 class="mb-1">
          Two Step Verification
        </h2>
        <p class="mb-2">
          We sent a verification code to your mobile. Enter the code from the mobile in the field below.
        </p>
        <h4 class="font-weight-medium">
          ******1234
          <!-- {{ phoneNumber }} -->
        </h4>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="submitForm">
          <VRow>
            <VCol cols="12">
              <AppOtpInput
                @updateOtp="(data) => {
                  otp = data
                }"
              />
            </VCol>

            <VCol cols="12">
               <div class="d-flex justify-center align-center flex-wrap text-center">
                <template v-if="countdown > 0">
                  <span>Verification code has been resent. Try again in {{ formattedCountdown }}</span>
                </template>
                <template v-else>
                  <span class="me-1">Didn't get the code?</span>
                  <a class="cursor-pointer" @click.prevent="startCountdown">Resend</a>
                </template>
              </div>
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                type="submit"
                class="text-none"
              >
                Verify My Account
              </VBtn>
            </VCol>
            <VCol cols="12" class="py-0">
              <VBtn
                block
                class="text-none"
                color="grey-300"
                @click="logout()"
              >
                Return To Login
              </VBtn>
            </VCol>
            
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="bgImage"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
