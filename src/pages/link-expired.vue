<script setup>
import router from '@/router';


const toLogin = () =>{
  router.replace('/login')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"      
    >
      <VCardItem class="justify-center mb-0">
        <div class="d-flex">
          <v-icon
            class="mb-5"
            color= #F44336
            icon="mdi-clock-alert-outline"
            size="112"
          ></v-icon>      
        </div>
      </VCardItem>        
      <VCardText class="text-center pt-2">        
        <h5 class="text-h5 mb-1">
          Invalid or Expired Link
        </h5>        
      </VCardText>
      <VCardText class="text-center pt-2">     
        <p class="mb-0">
          Link access expires after 30 minutes <br> and can only be used once.
        </p>
      </VCardText>
      <VCardActions class="align-center justify-center gap-2">
        <VBtn
          variant="elevated"
          @click="toLogin"
        >
          Ok
        </VBtn>
      </VCardActions>
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
