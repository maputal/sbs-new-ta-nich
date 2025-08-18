<script setup>
import StatisticsTemplateHeader from '@/components/statistics/StatisticsTemplateHeader.vue';

</script>

<template>
  <section>
    <h6 class="text-h5 font-weight-bold">
      Daily statistics
    </h6>
    <h3 class="font-weight-light mb-4">
      Indosat
    </h3>

    <StatisticsTemplateHeader
      :package="['A']"
      :group="['A','B']"
    />
  </section>
</template>
