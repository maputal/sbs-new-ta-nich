<script setup>
defineEmits(['filter'])
</script>

<template>
  <VSheet class="d-flex align-center">
    <slot />
    <VSpacer />
    <VBtn
      class="text-none mx-4"
      width="125px"
      @click="$emit('filter')"
    >
      Filter
    </VBtn>
  </VSheet>
</template>