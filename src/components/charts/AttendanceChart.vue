<template>
  <div class="h-64 w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useTheme } from '@/composables/useTheme' // optional if you have a theme composable

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chartCanvas = ref(null)
let chart = null

// Detect dark mode (watch system preference OR app theme)
const isDarkMode = ref(false)

const checkDarkMode = () => {
  // If you have a theme store/composable, use that. Otherwise check prefers-color-scheme.
  // Example with system preference:
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  // If your app uses a store: const themeStore = useTheme(); isDarkMode.value = themeStore.isDark
}

// Define colors based on dark/light mode
const getColors = () => {
  if (isDarkMode.value) {
    return {
      bar: '#38bdf8',      // light blue
      grid: '#374151',
      text: '#9ca3af',
      tooltip: '#1f2937'
    }
  } else {
    return {
      bar: '#0ea5e9',
      grid: '#e5e7eb',
      text: '#6b7280',
      tooltip: '#ffffff'
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
      labels: props.data.map(d => d.date),
      datasets: [{
        label: 'Attendance Rate (%)',
        data: props.data.map(d => d.rate),
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
          backgroundColor: colors.tooltip,
          titleColor: isDarkMode.value ? '#f3f4f6' : '#1f2937',
          bodyColor: isDarkMode.value ? '#e5e7eb' : '#374151',
          borderWidth: 0,
          padding: 8
        },
        legend: {
          labels: { color: colors.text, font: { size: 12 } }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: colors.grid },
          title: { display: false },
          ticks: { color: colors.text, stepSize: 20 }
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

// Watch for system theme changes
onMounted(() => {
  checkDarkMode()
  renderChart()
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMedia.addEventListener('change', handleThemeChange)
  // If using a custom theme store, watch that store's value
})

onBeforeUnmount(() => {
  if (chart) chart.destroy()
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMedia.removeEventListener('change', handleThemeChange)
})

watch(() => props.data, renderChart, { deep: true })
</script>