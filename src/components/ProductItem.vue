<template>
  <div
    class="bg-white rounded-2xl shadow overflow-hidden group focus-within:ring-2 focus-within:ring-purple-300"
    tabindex="0"
  >
    <div class="relative">
      <img
        :src="imgSrc"
        :alt="product.name || 'Producto'"
        loading="lazy"
        @error="onImageError"
        class="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      
    </div>

    <div class="p-4 text-center">
      <h3 class="text-lg font-semibold text-gray-800 mb-1 truncate" :title="product.name">{{ product.name }}</h3>
      <p v-if="product.category" class="text-sm text-gray-500 mb-1">{{ product.category }}</p>

      <div v-if="product.rating" class="flex items-center justify-center space-x-2 mb-1">
        <div class="flex -space-x-1">
          <svg v-for="n in 5" :key="n" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" :class="n <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'">
            <path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.65L19.5 24 12 19.897 4.5 24l1.7-8.6L0.4 9.75l7.932-1.732z"/>
          </svg>
        </div>
        <span class="text-xs text-gray-500">({{ product.reviews ?? 0 }})</span>
      </div>

      <p class="text-base font-bold text-green-600" v-html="formattedPrice"></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['add-to-cart']);

/* Placeholder: intenta usar asset local, si falla usa placeholder online */
let placeholder = '';
try {
  placeholder = new URL('../assets/placeholder-product.png', import.meta.url).href;
} catch (e) {
  placeholder = 'https://placehold.co/400x400/cccccc/ffffff?text=Producto';
}

/* Manejo de imagen con fallback */
const imgSrc = ref(props.product?.image ?? props.product?.img ?? placeholder);
function onImageError() {
  imgSrc.value = placeholder;
}

/* Formatea precio (robusto: maneja "14,99" y distintos nombres de campo) */
const formattedPrice = computed(() => {
  const raw = props.product?.price ?? props.product?.unitPrice ?? props.product?.amount ?? (props.product?.product && props.product.product.price) ?? 0;
  const priceNum = parseFloat(String(raw).replace(',', '.')) || 0;
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(priceNum);
  } catch (e) {
    return `S/. ${priceNum.toFixed(2)}`;
  }
});

/* Normaliza el objeto del producto para asegurar id/price/name/image antes de emitir */
function normalizeForStore(p) {
  const id = p?.id ?? p?.productId ?? p?.sku ?? p?._id ?? null;
  const safeId = id !== null ? String(id) : `tmp_${Math.random().toString(36).slice(2,9)}`;
  const name = p?.name ?? p?.title ?? p?.label ?? 'Producto';
  const image = p?.image ?? p?.img ?? p?.picture ?? '';
  const rawPrice = p?.price ?? p?.unitPrice ?? p?.amount ?? (p?.product && p.product.price) ?? 0;
  const price = parseFloat(String(rawPrice).replace(',', '.')) || 0;

  // devolvemos un objeto simple que tu store espera (product.id, product.price, etc.)
  return {
    id: safeId,
    name,
    image,
    price,
    qty: 1, // NUEVO: incluir qty por defecto para que el store pueda sumar cantidades directamente
    // mantenemos la referencia original por si la necesitas
    original: p
  };
}

/* Emite producto normalizado para evitar "Producto" fantasma y asegurar price numeric */
function handleAdd() {
  if (!props.product) return;
  const normalized = normalizeForStore(props.product);
  emit('add-to-cart', normalized);
}
</script>


