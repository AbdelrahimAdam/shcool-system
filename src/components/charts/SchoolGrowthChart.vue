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
    type: 'bar',
    data: {
      labels: props.data.map(d => d.month),
      datasets: [{
        label: 'New Schools',
        data: props.data.map(d => d.count),
        backgroundColor: '#10b981'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })
</script>