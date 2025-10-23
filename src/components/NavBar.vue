<template>
  <header
    ref="nav"
    class="w-full fixed top-0 left-0 z-50 transition-all duration-300"
    :class="{
      /* MODIFICADO: Añadimos '|| isCheckoutPage' para forzar el fondo en la página de checkout */
      'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200': isHovered || isScrolled || isCheckoutPage,
      'bg-transparent': !isHovered && !isScrolled && !isCheckoutPage
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
      <button
        class="md:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="isHovered || isScrolled || isCheckoutPage ? 'text-gray-700 hover:bg-gray-100 focus:ring-purple-300' : 'text-white/90 hover:bg-white/10 focus:ring-white/25'"
        @click="isMenuOpen = !isMenuOpen"
        :aria-expanded="isMenuOpen"
        aria-label="Abrir menú"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="!isMenuOpen" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div class="absolute inset-x-0 flex justify-center pointer-events-none">
        <router-link
          to="/"
          class="pointer-events-auto inline-flex items-center gap-3 text-2xl font-extrabold tracking-wide uppercase transition-all duration-300 brand"
          :class="isHovered || isScrolled || isCheckoutPage ? 'text-gray-900' : 'text-white drop-shadow-md'"
          aria-label="Ir al inicio - Eclipse"
        >
          <img src="/src/assets/eclipse-2.svg" alt="Logo" class="w-9 h-9 rounded-lg object-contain" aria-hidden="true"/>
          <span class="leading-tight">Eclipse</span>
        </router-link>
      </div>

      <div class="w-6 h-6"></div>
    </div>

    <nav
      class="hidden md:flex justify-between items-center max-w-7xl mx-auto px-6 py-2 text-sm transition-colors duration-300"
      :class="isHovered || isScrolled || isCheckoutPage ? 'text-gray-700' : 'text-white/90 drop-shadow-md'"
      aria-label="Navegación principal"
    >
      <div class="flex gap-8 items-center">
        <router-link to="/" class="nav-link" aria-current="page">Inicio</router-link>
        <router-link to="/checkout" class="nav-link">Checkout</router-link>
        <router-link to="/products" class="nav-link">Productos</router-link>
      </div>

      <div class="flex items-center gap-6">
        <router-link
          v-if="!user"
          to="/login"
          class="nav-link subtle"
        >Login</router-link>

        <router-link
          v-if="!user"
          to="/register"
          class="btn-outline"
        >Registro</router-link>

        <button
          v-if="user"
          @click="logout"
          class="text-sm text-red-600 hover:underline focus:outline-none"
        >Cerrar Sesión</button>

        <router-link
          to="/checkout"
          class="relative flex items-center gap-3 p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="isHovered || isScrolled || isCheckoutPage ? 'text-gray-800 hover:bg-gray-100 focus:ring-purple-300' : 'text-white/95 hover:bg-white/10 focus:ring-white/25'"
          aria-label="Ver carrito de compras"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="10" cy="20" r="1.6" fill="currentColor"/>
            <circle cx="18" cy="20" r="1.6" fill="currentColor"/>
          </svg>

          <span
            v-if="cartCount > 0"
            class="cart-badge"
            :class="{ 'animate-bump': bump }"
            role="status"
            aria-live="polite"
          >
            {{ cartCount }}
          </span>
        </router-link>
      </div>
    </nav>

    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white/95 border-t px-6 py-4 flex flex-col space-y-3 shadow-sm"
    >
      <router-link to="/" @click="isMenuOpen = false" class="mobile-link">Inicio</router-link>
      <router-link to="/checkout" @click="isMenuOpen = false" class="mobile-link">Checkout</router-link>
      <router-link v-if="!user" to="/login" @click="isMenuOpen = false" class="mobile-link">Login</router-link>
      <router-link v-if="!user" to="/register" @click="isMenuOpen = false" class="mobile-link">Registro</router-link>
      <button v-if="user" @click="logout" class="text-left text-red-600">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; // <<--- 1. IMPORTAR useRoute
import { useCartStore } from "../store";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

// <<--- 2. AÑADIR ESTAS LÍNEAS PARA DETECTAR LA RUTA
const route = useRoute();
const isCheckoutPage = computed(() => route.path === '/checkout');

// Hover y scroll
const isHovered = ref(false);
const isScrolled = ref(false);
const handleScroll = () => { isScrolled.value = window.scrollY > 10; };

// Nav height ref para medición
const nav = ref(null);

function updateNavHeight() {
  // calcula la altura real del header y la pone en :root como --nav-height
  if (!nav.value) return;
  const rect = nav.value.getBoundingClientRect();
  const h = Math.ceil(rect.height || 0);
  document.documentElement.style.setProperty('--nav-height', `${h}px`);
}

// onMounted: registramos scroll + resize y medimos al inicio
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateNavHeight);
  // medir una vez montado (luego watch/resize mantendrá actualizado)
  updateNavHeight();
});

// limpieza
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateNavHeight);
});

// también re-medir cuando la ruta cambie (ej: entrada/checkout)
watch(() => route.path, () => {
  // pequeña espera para cuando la transición cambie contenido
  // (no bloqueante) — pero normalmente updateNavHeight() es suficiente.
  setTimeout(updateNavHeight, 40);
});

// Móvil, carrito y auth
const isMenuOpen = ref(false);
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems || 0);
const user = ref(auth.currentUser);

// Bump animation cuando cambia cartCount
const bump = ref(false);
watch(cartCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    bump.value = true;
    setTimeout(() => (bump.value = false), 500);
  }
});

function logout() {
  signOut(auth).then(() => {
    // Manejador más profesional en lugar de alert: redirigir o emitir evento
    user.value = null;
    // ejemplo: router.push('/')
  }).catch(err => {
    console.error('Logout error', err);
  });
}
</script>

<style scoped>
/* Brand and logo mark */
.brand { letter-spacing: 0.02em; }
.logo-mark {
  background: linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%);
  color: white;
  font-weight: 800;
  box-shadow: 0 8px 28px rgba(147,51,234,0.12);
  font-size: 0.9rem;
}

/* Links estilo profesional */
.nav-link {
  position: relative;
  font-weight: 600;
  padding: 6px 0;
  color: inherit;
  transition: color .15s ease, transform .12s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg,#9333ea,#a855f7);
  transition: width .18s ease;
  border-radius: 2px;
}
.nav-link:hover { transform: translateY(-2px); }
.nav-link:hover::after { width: 100%; }

/* Link sutil secundario */
.subtle { opacity: 0.9; font-weight: 500; }

/* Botón de registro */
.btn-outline {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(147,51,234,0.12);
  background: linear-gradient(90deg, rgba(147,51,234,0.06), rgba(168,85,247,0.04));
  color: inherit;
  font-weight: 700;
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn-outline:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(147,51,234,0.06); }

/* Mobile links */
.mobile-link {
  padding: 10px 0;
  font-weight: 600;
  color: #111827;
}

/* Cart badge (estilizado profesional) */
.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: linear-gradient(90deg,#ef4444,#f97316);
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(239,68,68,0.18);
  transform-origin: center;
  margin-left: -6px;
  padding: 0 6px;
}

/* bump animation */
@keyframes bump {
  0% { transform: scale(1); }
  30% { transform: scale(1.25); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-bump {
  animation: bump 480ms cubic-bezier(.2,.8,.2,1);
}

/* Focus visible */
button:focus, a:focus {
  outline: none;
  box-shadow: 0 4px 18px rgba(124,58,237,0.12);
  border-radius: 8px;
}

/* Ajustes estéticos cuando fondo transparente para texto blanco */
header.bg-transparent a, header.bg-transparent button {
  color: white;
}

/* Pequeños toques responsive */
@media (max-width: 768px) {
  .logo-mark { width: 36px; height: 36px; font-size: 0.85rem; }
  .nav-link { font-size: 13px; }
}
</style>
