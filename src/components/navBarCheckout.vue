<template>
  <header class="checkout-header" role="banner" aria-label="Encabezado checkout">
    <div class="container">
      <!-- LEFT: volver al inicio -->
      <router-link to="/" class="back" aria-label="Volver al inicio">
        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="back-text">Inicio</span>
      </router-link>

      <!-- CENTER: brand (logo + name) -->
      <div class="brand" role="img" aria-label="Mi E-Commerce">
        <router-link to="/" class="brand-link" aria-label="Ir al inicio - Mi E-Commerce">
          <img class="brand-logo" :src="logoUrl" alt="Mi E-Commerce" v-if="logoUrl" />
          <span class="brand-title">Eclipse</span>
        </router-link>
      </div>

      <!-- RIGHT: espacio (aquí puedes añadir ícono de ayuda, estado de carrito, etc.) -->
      <div class="right-space" aria-hidden="true"></div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

// intenta resolver el logo con import.meta.url para evitar problemas con alias en build
let logoUrl = null;
try {
  logoUrl = new URL('../assets/eclipse-2.svg', import.meta.url).href;
} catch (e) {
  // si falla, puedes dejarlo null y se mostrará solo el texto de marca
  logoUrl = null;
}
</script>

<style scoped>
.checkout-header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 70;
  backdrop-filter: blur(6px);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92));
  border-bottom: 1px solid rgba(16,24,40,0.04);
  box-shadow: 0 6px 20px rgba(15,23,42,0.03);
}

/* contenedor centrado */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20pxx;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

/* Back link (izquierda) */
.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #374151; /* gray-700 */
  text-decoration: none;
  padding: 8px;
  border-radius: 8px;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.back:focus,
.back:hover {
  transform: translateY(-2px);
  background: rgba(147,51,234,0.04);
  box-shadow: 0 8px 24px rgba(147,51,234,0.04);
  outline: none;
}
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}
.back-text {
  font-size: 14px;
  color: #374151;
  font-weight: 600;
}

/* Brand (centro) */
.brand {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* evita competencia con el router-link interno */
}
.brand-link {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #111827;
  transition: transform .12s ease;
}
.brand-link:focus,
.brand-link:hover {
  transform: translateY(-2px);
}
.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 28px rgba(147,51,234,0.08);
  background: white;
  padding: 4px;
}
.brand-title {
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  color: #111827;
  display: inline-block;
}

/* Right spacer para balancear layout (aquí podrías colocar badge de carrito) */
.right-space {
  width: 44px;
  height: 1px;
  visibility: hidden;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .container { padding: 10px 12px; }
  .brand-logo { width: 34px; height: 34px; }
  .brand-title { font-size: 0.98rem; }
  .right-space { width: 36px; }
}
</style>
