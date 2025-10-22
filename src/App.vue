<template>
  <div id="app">
    <!-- NavBar solo si la ruta no tiene meta.hideHeader -->
    <NavBar v-if="!$route.meta.hideHeader" />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
};
</script>

<style>
/* Estilos básicos globales */
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}

#app {
  width: 100%;
}
</style>
