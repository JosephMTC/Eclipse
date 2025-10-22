<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <nav class="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <router-link to="/" class="hover:underline hover:text-purple-600 transition-colors">Inicio</router-link>
      <span class="mx-2">/</span>
      <router-link to="/products" class="hover:underline hover:text-purple-600 transition-colors">Productos</router-link>
      <span v-if="product" class="mx-2">/</span>
      <span v-if="product" class="text-gray-700 font-medium">{{ product.title }}</span>
    </nav>

    <div v-if="loading" class="py-24 text-center">
      <div class="inline-flex items-center gap-3">
        <svg class="w-8 h-8 animate-spin text-purple-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-lg text-gray-600 font-medium">Cargando producto…</span>
      </div>
    </div>

    <div v-else-if="error" class="py-12 text-center">
       <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-flex items-center gap-3 shadow-md">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         <span>{{ error }}</span>
       </div>
    </div>

    <Transition name="fade" appear>
      <section v-if="product" class="grid gap-8 lg:gap-12 md:grid-cols-2 items-start">
        
        <div class="animated-component">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <Transition name="fade-image" mode="out-in">
              <img
                v-if="selectedImage"
                :key="selectedImage"
                :src="selectedImage"
                :alt="product.title"
                class="w-full h-[450px] object-cover"
              />
              <div v-else class="w-full h-[450px] bg-gray-100 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            </Transition>
          </div>
          <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
  <button
    v-for="(img, i) in product.imagesPreview"
    :key="i"
    class="rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
    :class="selectedImage === img ? 'border-purple-500 ring-2 ring-purple-300 shadow-lg' : 'border-transparent'"
    @click="selectedImage = img"
    aria-label="Ver imagen"
  >
    <img :src="img" class="w-full h-28 sm:h-24 object-cover" loading="lazy" />
  </button>
</div>

        </div>

        <div class="space-y-6 animated-component" style="animation-delay: 150ms;">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {{ product.title }}
              </h1>
              <p v-if="product.subtitle" class="mt-2 text-md text-gray-500">{{ product.subtitle }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-3xl font-bold text-purple-600">S/. {{ priceFormatted }}</div>
              <div v-if="product.stock !== undefined" class="text-sm mt-1 font-semibold" :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'">
                {{ product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado' }}
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 items-center flex-wrap">
            <span v-if="product.badge" class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold shadow-sm">
              {{ product.badge }}
            </span>
            <div v-if="product.rating" class="text-sm text-gray-600 flex items-center gap-1.5">
              <svg class="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.65L19.5 24 12 19.897 4.5 24l1.7-8.6L0.4 9.75l7.932-1.732z"/></svg>
              <span class="font-bold text-gray-800">{{ product.rating }}</span>
              <span class="text-gray-400">·</span>
              <span class="text-gray-400 hover:text-gray-600 cursor-pointer">{{ product.reviewsCount ?? 0 }} reseñas</span>
            </div>
          </div>

          <div class="prose max-w-none text-gray-700 border-t pt-4">
            <div v-html="product.descriptionHtml"></div>
          </div>
          
          <div v-if="product.attributes && Object.keys(product.attributes).length" class="space-y-4">
            <div v-for="(vals, key) in product.attributes" :key="key" class="flex items-center gap-4">
              <div class="text-sm font-semibold w-24 text-gray-700 capitalize">{{ key }}</div>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="val in vals"
                  :key="val"
                  @click="selectAttribute(key, val)"
                  :class="selectedAttributes[key] === val ? 'ring-2 ring-purple-500 bg-purple-50 text-purple-700' : 'border bg-white hover:bg-gray-50'"
                  class="px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
                  aria-pressed="false"
                >
                  {{ val }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 pt-4 border-t">
            <<div class="w-full sm:w-auto">
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center border rounded-lg overflow-hidden shadow-sm">
    <button
      @click="decrease"
      class="flex-none px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
      :disabled="qty <= 1 || processing"
      aria-label="Disminuir cantidad"
    >
      <span class="text-lg sm:text-xl font-light">−</span>
    </button>

    <input
      v-model.number="qty"
      type="number"
      min="1"
      :max="product.stock || 999"
      class="w-full sm:w-16 text-center font-semibold text-lg text-gray-800 border-y sm:border-x appearance-none focus:outline-none px-3 py-2"
      aria-label="Cantidad"
    />

    <button
      @click="increase"
      class="flex-none px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
      :disabled="(product.stock !== undefined && qty >= product.stock) || processing"
      aria-label="Aumentar cantidad"
    >
      <span class="text-lg sm:text-xl font-light">+</span>
    </button>
  </div>
</div>

            <button @click="addToCart" :disabled="product.stock === 0 || processing" class="flex-grow inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed">
              <svg v-if="!processing" class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Añadir al carrito</span>
            </button>
          </div>
          
          <Transition name="slide-fade">
<div v-if="message" class="mt-3 text-sm font-semibold" :class="messageType === 'ok' ? 'text-green-600' : 'text-red-600'">
{{ message }}
</div>
</Transition>

 <div class="mt-6 text-xs text-gray-500 flex items-center gap-4 border-t pt-4">
<span>✓ Envío en 24–48h</span>
<span>✓ Devoluciones en 14 días</span>
<span>✓ Pago seguro</span>
</div>

<div class="mt-6 border-t pt-6">
 <router-link :to="{ path: '/', hash: '#recommended-products' }"
 class="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors group">
 <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
</router-link>
 </div>
</div>
</section>
 </Transition>
 </div>
</template>
<script setup>
// --- TU LÓGICA DE SCRIPT ESTÁ INTACTA ---
import productsData from '../assets/products.json';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCartStore } from '../store';

const route = useRoute();
const router = useRouter();
const idParam = route.params.id;
const loading = ref(true);
const error = ref('');
const product = ref(null);
const selectedImage = ref('');
const qty = ref(1);
const processing = ref(false);
const message = ref('');
const messageType = ref('ok'); // 'ok' | 'error'

const cartStore = useCartStore();

function toPrice(v) {
  const parsed = parseFloat(String(v ?? 0).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchProduct(id) {
  loading.value = true;
  error.value = '';
  product.value = null;

  try {
    const docId = String(id);
    const refDoc = doc(db, 'products', docId);
    const snap = await getDoc(refDoc);

    if (snap.exists()) {
      const data = snap.data();
      product.value = {
        id: snap.id,
        title: data.title ?? data.name ?? 'Sin título',
        subtitle: data.subtitle ?? '',
        price: toPrice(data.price ?? data.unitPrice ?? data.amount),
        currency: data.currency ?? 'PEN',
        images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
        imagesPreview: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
        descriptionHtml: data.description ?? (data.descHtml ?? ''),
        stock: typeof data.stock !== 'undefined' ? Number(data.stock) : undefined,
        rating: data.rating ?? null,
        reviewsCount: data.reviewsCount ?? null,
        badge: data.badge ?? null,
        attributes: data.attributes ?? {},
        raw: data
      };
      selectedImage.value = product.value.images[0] ?? '';
      document.title = `${product.value.title} — Mi E-Commerce`;
      return;
    }

    const local = Array.isArray(productsData) ? productsData.find(p => String(p.id) === docId || String(p._id) === docId || String(p.productId) === docId) : null;
    if (local) {
      product.value = {
        id: local.id ?? local._id ?? local.productId ?? docId,
        title: local.title ?? local.name ?? 'Sin título',
        subtitle: local.subtitle ?? '',
        price: toPrice(local.price ?? local.unitPrice ?? local.amount),
        currency: local.currency ?? 'PEN',
        images: Array.isArray(local.images) ? local.images : (local.image ? [local.image] : []),
        imagesPreview: Array.isArray(local.images) ? local.images : (local.image ? [local.image] : []),
        descriptionHtml: local.description ?? local.descHtml ?? '',
        stock: typeof local.stock !== 'undefined' ? Number(local.stock) : undefined,
        rating: local.rating ?? null,
        reviewsCount: local.reviewsCount ?? null,
        badge: local.badge ?? null,
        attributes: local.attributes ?? {},
        raw: local
      };
      selectedImage.value = product.value.images[0] ?? '';
      document.title = `${product.value.title} — Mi E-Commerce (local)`;
      return;
    }

    error.value = 'Producto no encontrado.';
    setTimeout(() => router.replace({ name: 'home' }), 1400);

  } catch (e) {
    console.error('fetchProduct error', e);
    if (e?.code === 'permission-denied' || (e?.message && e.message.includes('insufficient permissions'))) {
      error.value = 'No tienes permiso para ver este producto. Inicia sesión o revisa las reglas de Firestore.';
    } else {
      error.value = 'Error cargando el producto.';
    }
  } finally {
    loading.value = false;
  }
}

const price = computed(() => product.value ? Number(product.value.price || 0) : 0);
const priceFormatted = computed(() => price.value.toFixed(2));

function increase() {
  if (processing.value) return;
  if (product.value && typeof product.value.stock !== 'undefined') {
    if (qty.value < product.value.stock) qty.value++;
    else {
      messageType.value = 'error';
      message.value = 'No hay más unidades en stock.';
      setTimeout(() => (message.value = ''), 2000);
    }
  } else {
    qty.value++;
  }
}

function decrease() {
  if (processing.value) return;
  qty.value = Math.max(1, qty.value - 1);
}

const selectedAttributes = ref({});
function selectAttribute(key, val) {
  selectedAttributes.value = { ...selectedAttributes.value, [key]: val };
}

async function addToCart() {
  if (!product.value) return;
  if (product.value.stock === 0) {
    messageType.value = 'error';
    message.value = 'Producto agotado.';
    return;
  }

  processing.value = true;
  message.value = '';

  try {
    const line = {
      id: product.value.id,
      title: product.value.title,
      price: price.value,
      qty: qty.value,
      image: selectedImage.value || product.value.images[0] || '',
      attributes: selectedAttributes.value
    };

    if (typeof cartStore.addToCart === 'function') {
      await cartStore.addToCart(line);
    } else if (Array.isArray(cartStore.items)) {
      const idx = cartStore.items.findIndex(i => (i.id ?? i.productId) === line.id);
      if (idx !== -1) {
        const existing = cartStore.items[idx];
        existing.qty = (Number(existing.qty || existing.quantity || 0) + Number(line.qty || 1));
      } else {
        cartStore.items.push(line);
      }
      if (typeof cartStore.save === 'function') await cartStore.save();
    } else {
      console.warn('No se encontró método addToCart ni array items en el store.');
    }

    messageType.value = 'ok';
    message.value = '¡Añadido al carrito!';
    setTimeout(() => (message.value = ''), 2000);
  } catch (e) {
    console.error('addToCart error', e);
    messageType.value = 'error';
    message.value = 'No se pudo añadir al carrito. Intenta de nuevo.';
  } finally {
    setTimeout(() => {
      processing.value = false;
    }, 400); // Pequeña demora para que la animación del botón se aprecie
  }
}

async function buyNow() {
  await addToCart();
  if (messageType.value === 'ok') {
    router.push({ name: 'checkout' });
  }
}

watch(() => route.params.id, (val) => {
  if (val) fetchProduct(val);
});

onMounted(() => {
  const id = route.params.id ?? idParam;
  if (!id) {
    error.value = 'Id de producto inválido.';
    return;
  }
  fetchProduct(id);
});
</script>

<style scoped>


/* Input de cantidad sin flechas */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Transición para la imagen principal */
.fade-image-enter-active,
.fade-image-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-image-enter-from,
.fade-image-leave-to {
  opacity: 0;
}

/* Transición para el mensaje de 'añadido al carrito' */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Transición de aparición para toda la tarjeta de producto */
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}

/* Keyframes para la animación de entrada de los componentes */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Aplicar la animación a los componentes principales */
.animated-component {
  animation: pop-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Ajustes a la clase 'prose' para mejor legibilidad */
.prose {
  font-size: 1rem;
  line-height: 1.7;
}
.prose h1, .prose h2, .prose h3 {
  margin-bottom: 0.5em;
  font-weight: 700;
}
.prose p {
  margin-bottom: 1em;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .prose {
    font-size: 0.95rem;
  }
  img[class*="object-cover"] {
    height: 350px;
  }
}
</style>