<script setup>
  const webVersionFooter = ref(window.moffas.config.version_footer)
</script>

<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      Copyright © 2025 Teleakses Solusindo. All Rights Reserved
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4">
      {{ webVersionFooter }}
    </span>
  </div>
</template>
