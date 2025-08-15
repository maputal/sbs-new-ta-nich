<script setup>
import Logo from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';

</script>

<template>
  <div class="misc-wrapper">
    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="Logo"
        alt="Coming Soon"
        :max-width="300"
        class="mx-auto mb-10"
      />

      <div class="mb-5">
        <h2 class="text-h2 mb-2">Oops!</h2>
        <h5 class="text-h5 mb-2">Page Not Found ⚠️</h5>
        <p class="text-sm">It seems we can’t find what you’re looking for</p>
        <p class="text-sm">The page you’re looking for is not available or maybe it already moved. Make sure you’ve type URL address correctly.</p>
      </div>

      <VBtn
        to="/"
        class="mt-10"
      >
        Back to Home
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
