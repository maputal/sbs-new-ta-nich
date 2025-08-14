<script setup>
import { useTheme } from 'vuetify'
import BarChart from '@/@core/libs/chartjs/components/BarChart'
import { getLatestBarChartConfig } from '@core/libs/chartjs/chartjsConfig'

const props = defineProps({
  colors: {
    type: null,
    required: false,
  },
  data: {
    type: Array,
    required: true,
  },
})

const vuetifyTheme = useTheme()
const chartOptions = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))

const data = {
  labels: [
    'Marketing',
    'Utility',
    'Authentication',
    'Service',
  ],
  datasets: [{
    maxBarThickness: 20,
    backgroundColor: [
      'rgba(237, 35, 36, 1)',
      'rgba(237, 35, 36, 1)',
      'rgba(237, 35, 36, 1)',
      'rgba(255, 203, 5, 1)',
    ],
    borderColor: 'transparent',
    borderRadius: {
      topRight: 15,
      topLeft: 15,
    },
    data: props.data
  }],
}
</script>

<template>
    <!-- :height="400" -->
  <BarChart
    :chart-data="data"
    :chart-options="chartOptions"
    :width="450"
  />
</template>
