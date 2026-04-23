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
      border: '#38bdf8',
      background: 'rgba(56, 189, 248, 0.15)',
      grid: '#374151',
      text: '#9ca3af',
      tooltipBg: '#1f2937'
    }
  } else {
    return {
      border: '#0ea5e9',
      background: 'rgba(14, 165, 233, 0.2)',
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
    type: 'radar',
    data: {
      labels: props.data.map(d => d.subject),
      datasets: [{
        label: 'Average Score',
        data: props.data.map(d => d.score),
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 2,
        pointBackgroundColor: colors.border,
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6
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
        r: {
          min: 0,
          max: 100,
          ticks: { color: colors.text, stepSize: 20, backdropColor: 'transparent' },
          grid: { color: colors.grid },
          angleLines: { color: colors.grid },
          pointLabels: { color: colors.text, font: { size: 11 } }
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