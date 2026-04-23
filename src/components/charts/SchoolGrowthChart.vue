<template>
  <div class="h-64 w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chartCanvas = ref(null)
let chart = null

const isDarkMode = ref(false)

const checkDarkMode = () => {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getColors = () => {
  if (isDarkMode.value) {
    return {
      bar: '#6ee7b7',
      grid: '#374151',
      text: '#9ca3af',
      tooltipBg: '#1f2937'
    }
  } else {
    return {
      bar: '#10b981',
      grid: '#e5e7eb',
      text: '#6b7280',
      tooltipBg: '#ffffff'
    }
  }
}

const renderChart = () => {
  if (chart) chart.destroy()
  if (!chartCanvas.value || !props.data.length) return

  const colors = getColors()

  chart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: props.data.map(d => d.month),
      datasets: [{
        label: 'New Schools',
        data: props.data.map(d => d.count),
        backgroundColor: colors.bar,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: isDarkMode.value ? '#f3f4f6' : '#1f2937',
          bodyColor: isDarkMode.value ? '#e5e7eb' : '#374151'
        },
        legend: {
          labels: { color: colors.text, font: { size: 12 } }
        }
      },
      scales: {
        y: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, stepSize: 1, precision: 0 }
        },
        x: {
          grid: { display: false },
          ticks: { color: colors.text, maxRotation: 45, minRotation: 30 }
        }
      }
    }
  })
}

const handleThemeChange = () => {
  checkDarkMode()
  renderChart()
}

onMounted(() => {
  checkDarkMode()
  renderChart()
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMedia.addEventListener('change', handleThemeChange)
})

onBeforeUnmount(() => {
  if (chart) chart.destroy()
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMedia.removeEventListener('change', handleThemeChange)
})

watch(() => props.data, renderChart, { deep: true })
</script>