<template>
  <img
    ref="img"
    :src="lowQualitySrc"
    :alt="alt"
    :class="[
      'transition-opacity duration-300',
      { 'opacity-0': !loaded, 'opacity-100': loaded }
    ]"
    @load="loadHighQuality"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: String,
  lowQualitySrc: String,
  alt: String
})

const img = ref(null)
const loaded = ref(false)

const loadHighQuality = () => {
  const highQualityImg = new Image()
  highQualityImg.src = props.src
  highQualityImg.onload = () => {
    img.value.src = props.src
    loaded.value = true
  }
}
</script>