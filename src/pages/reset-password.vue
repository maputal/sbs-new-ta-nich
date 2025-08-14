<script setup>
import router from '@/router';
import depLogoGrey from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';


const toLogin = () =>{
  router.replace('/login')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <!-- Title and Logo -->
    <VCard
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
          Password Reset
        </h5>
      </VCardText>
      <VCardText class="pt-2">        
       <p class="mb-0">
          Password was successfully reset. Please check your email for your new password.
        </p>
      </VCardText>
      <VCardText>
        <VBtn
          cols="12"
          display-flex
          type="submit"
          @click="toLogin"
        >
          Login
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
