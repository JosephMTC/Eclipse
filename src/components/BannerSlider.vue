<template>
  <div class="relative w-full h-screen overflow-hidden">
    <transition-group name="fade" tag="div">
      <img
        v-for="(img, i) in images"
        v-show="i === currentIndex"
        :key="i"
        :src="img"
        alt="Banner"
        class="w-full h-full object-cover absolute top-0 left-0"
      />
    </transition-group>

    <!-- Overlay opcional si luego quieres poner texto -->
    <div class="absolute inset-0 bg-black/30 z-10"></div>

    <!-- Indicadores -->

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";

const images = [banner1, banner2, banner3];
const currentIndex = ref(0);
let interval = null;

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const goTo = (index) => {
  currentIndex.value = index;
};

onMounted(() => {
  interval = setInterval(next, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
