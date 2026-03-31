<template>
  <div class="h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chartCanvas = ref(null)
let chart = null

const renderChart = () => {
  if (chart) chart.destroy()
  if (!chartCanvas.value || !props.data.length) return

  chart = new Chart(chartCanvas.value, {
    type: 'radar',
    data: {
      labels: props.data.map(d => d.subject),
      datasets: [{
        label: 'Average Score',
        data: props.data.map(d => d.score),
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: '#0ea5e9'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100 } }
    }
  })
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })
</script>