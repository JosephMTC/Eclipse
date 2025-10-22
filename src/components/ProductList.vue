<template>
  <section class="py-16 px-4 max-w-7xl mx-auto">
    <!-- Encabezado y filtro -->
    <div class="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-2xl font-semibold text-gray-800">Explora nuestros productos</h2>
      <div class="flex items-center gap-3">
        <label for="category" class="text-gray-700 font-medium">Categoría:</label>
        <select
          id="category"
          v-model="selectedCategory"
          class="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Carrusel de productos -->
    <div class="relative group">
      <Carousel
        ref="carouselRef"
        :itemsToShow="itemsToShow"
        :wrapAround="true"
        :autoplay="false"
        class="relative cursor-pointer"
        :breakpoints="{
          380: { itemsToShow: 1 },
          640: { itemsToShow: 1 },
          768: { itemsToShow: 2 },
          1024: { itemsToShow: 3 }
        }"
        aria-label="Carrusel de productos"
        :mouse-drag="isDragEnabled"
        :touch-drag="isDragEnabled"
      >
        <Slide
          v-for="prod in filteredProducts"
          :key="prod.id ?? prod._id ?? prod.productId ?? prod.sku"
          class="px-2"
        >
          <!-- Wrapper: garantiza altura mínima y que el item ocupe todo el espacio -->
          <div
            class="h-full min-h-[14rem] sm:min-h-[16rem] md:min-h-[18rem] flex items-stretch"
          >
            <!-- clickable area que ocupa todo el slide para navegación por click/enter -->
            <div
              class="w-full h-full flex items-stretch min-w-[220px] sm:min-w-[260px]"
              role="button"
              tabindex="0"
              @click="goToProduct(getId(prod))"
              @keydown.enter.prevent="goToProduct(getId(prod))"
            >
              <ProductItem
                :product="prod"
                class="w-full h-full flex-1"
                @add-to-cart="addToCart"
                @view-product="goToProduct"
              />
            </div>
          </div>
        </Slide>

        <!-- Flechas de navegación -->
        <template #addons>
          <button
            @click="prev"
            class="absolute left-3 top-1/2 transform -translate-y-1/2
                   bg-white/95 hover:bg-white rounded-full shadow
                   opacity-100 md:opacity-0 md:group-hover:opacity-100
                   md:pointer-events-none md:group-hover:pointer-events-auto
                   z-40 transition-all duration-200 flex items-center justify-center
                   w-10 h-10 md:w-12 md:h-12
                   active:scale-90"
            aria-label="Anterior"
            tabindex="0"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-150"
                 viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6"
                    stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <button
            @click="next"
            class="absolute right-3 top-1/2 transform -translate-y-1/2
                   bg-white/95 hover:bg-white rounded-full shadow
                   opacity-100 md:opacity-0 md:group-hover:opacity-100
                   md:pointer-events-none md:group-hover:pointer-events-auto
                   z-40 transition-all duration-200 flex items-center justify-center
                   w-10 h-10 md:w-12 md:h-12
                   active:scale-90"
            aria-label="Siguiente"
            tabindex="0"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-150"
                 viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6"
                    stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

        </template>
      </Carousel>
    </div>

    <!-- Mensaje de sin resultados -->
    <div v-if="filteredProducts.length === 0" class="text-center mt-20 text-gray-500 text-lg">
      No hay productos en esta categoría.
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import productsData from '../assets/products.json';
import ProductItem from './ProductItem.vue';
import { useCartStore } from '../store';

// Datos y store
const allProducts = ref(Array.isArray(productsData) ? productsData : []);
const selectedCategory = ref('');
const cartStore = useCartStore();
const router = useRouter();

// Categorías únicas ordenadas
const categories = computed(() => {
  const unique = new Set(allProducts.value.map(p => p.category).filter(Boolean));
  return Array.from(unique).sort();
});

// Filtrado
const filteredProducts = computed(() => {
  return selectedCategory.value
    ? allProducts.value.filter(p => p.category === selectedCategory.value)
    : allProducts.value;
});

// Número inicial de ítems a mostrar (fallback)
const itemsToShow = 4;

// Referencia al carrusel
const carouselRef = ref(null);

// Prev/Next con debounce simple para evitar clicks demasiado rápidos
const navDisabled = ref(false);
function disableNavShort() {
  navDisabled.value = true;
  setTimeout(() => (navDisabled.value = false), 300);
}

function prev() {
  if (navDisabled.value) return;
  if (carouselRef.value?.prev) {
    carouselRef.value.prev();
    disableNavShort();
  }
}
function next() {
  if (navDisabled.value) return;
  if (carouselRef.value?.next) {
    carouselRef.value.next();
    disableNavShort();
  }
}

/*
  addToCart: normaliza ligeramente el objeto recibido antes de enviarlo a la store.
*/
function addToCart(product) {
  if (!product || !product.id) return;
  const qty = Number(product.qty ?? product.quantity ?? 1);
  const price = typeof cartStore.parsePrice === 'function'
    ? cartStore.parsePrice(product.price ?? product.unitPrice ?? product.amount ?? 0)
    : (Number(product.price) || 0);

  const safeProduct = {
    ...product,
    qty,
    price
  };

  cartStore.addToCart(safeProduct);
}

/* NUEVO: helper robusto para obtener id del producto */
function getId(p) {
  return p?.id ?? p?.productId ?? p?._id ?? p?.sku ?? null;
}

/* Navegar a la vista del producto */
function goToProduct(idOrProduct) {
  const id = typeof idOrProduct === 'string' || typeof idOrProduct === 'number'
    ? String(idOrProduct)
    : (getId(idOrProduct));

  if (!id) return;

  // Navegar por name: usa la ruta 'product' que definimos arriba
  router.push({ name: 'product', params: { id } }).catch(() => {
    // ignorar errores de navegación duplicada
  });
}

/* ---------- BLOQUE NUEVO: activación de drag por ancho (>= 380px) ---------- */
/* Activa mouse-drag y touch-drag solo cuando el viewport >= 380px para evitar colapsos */
const isDragEnabled = ref(typeof window !== 'undefined' ? window.innerWidth >= 380 : false);

function updateDrag() {
  isDragEnabled.value = window.innerWidth >= 380;
}

onMounted(() => {
  window.addEventListener('resize', updateDrag);
  // asegurar estado inicial correcto al montar
  updateDrag();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDrag);
});
/* --------------------------------------------------------------------------- */

</script>

<style scoped>
button {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
button:hover { transform: scale(1.05); }
button:active { transform: scale(0.9); cursor: grabbing; }
button:active svg { transform: scale(0.85); }
</style>
