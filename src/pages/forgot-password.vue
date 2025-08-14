<script setup>
import router from '@/router'
import axios from '@axios'
import depLogoGrey from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png'
import {
  emailValidator,
  requiredValidator,
} from '@validators'

const email = ref('')

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      forgotPassword()
  })
}

let forgotPassword = () => true

const errors = ref({
  email: undefined,
  password: undefined,
})

const ForgetErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error-forgot-password.vue'))
const isErrorVisible = ref(false)
const customErrorMessage = ref('')
const isSetEmail = ref (false)
const refVForm = ref()

const onSendLink = () => {

  axios.post(window.moffas.config.url_forget_pass_api,{
    email: email.value,
  })
  .then(function (response) {
    console.log(response);
    isSetEmail.value = true
  })
  .catch(function (error) {
    console.log(error);
    isErrorVisible.value = true
  });
}

const toLogin = () =>{
  router.replace('/login')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <!-- erorr dialogs -->
    <ForgetErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessage"      
    />

    <!-- Title and Logo -->
    <VCard
      v-if="!isSetEmail"
      class="auth-card pa-4 pt-7"
      max-width="448"      
    >
      <VCardItem class="justify-center mb-8">
        <div class="d-flex">
          <VImg
            :width="160"
            :src="depLogoGrey"
          />          
        </div>
      </VCardItem>
      <VCardText class="pt-2">        
        <h5 class="text-h5 mb-1">
          Forgot Password
        </h5>
        <p class="mb-0">
          Enter your email and we'll send you instructions to reset your password
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

            <!-- reset password -->
            <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  :disabled="!email"
                  @click="onSendLink"
                >
                  Send Reset Link
                </VBtn>
            </VCol>

            <!-- back to login -->
            <VCol cols="12">
              <RouterLink
                class="d-flex align-center justify-center"
                :to="{ name: 'login' }"
              >
                <VIcon
                  icon="mdi-chevron-left"
                  class="flip-in-rtl"
                />
                <span>Back to login</span>
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VCard
      v-if="isSetEmail"
      class="auth-card pa-4 pt-7"
      max-width="448"      
    >
      <VCardItem class="justify-center mb-8">
        <div class="d-flex">
          <VImg
            :width="160"
            :src="depLogoGrey"
          />          
        </div>
      </VCardItem>        
      <VCardText class="pt-2">        
        <h5 class="text-h5 mb-1">
          Check your Email
        </h5>        
      </VCardText>
      <VCardText class="pt-2">     
        <p 
          class="mb-0" 
          style="color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));"
        >
          Please go to your <b>{{ email }}</b> email and click the password reset link we've sent for your account.
        </p>
      </VCardText>
      <VCardText>       
        <VBtn
          cols="12"
          display-flex
          type="submit"
          @click="toLogin"
        >
          Done
        </VBtn>      
      </VCardText>
    </VCard>     
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
