<template>
    <!-- Header específico para checkout -->
    <CheckoutHeader />


  <section class="checkout-container pt-28 max-w-6xl mx-auto p-6">
    <div
      class="grid gap-6 lg:grid-cols-2 items-start"
      aria-live="polite"
    >
      <aside
        class="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
        aria-label="Resumen del carrito"
      >
        <header class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">🛒 Tu carrito</h2>

          <transition name="fade-scale" mode="out-in">
            <span
              v-if="!cartItems || cartItems.length === 0"
              key="empty"
              class="text-sm text-gray-400 italic"
            >
              Vacío
            </span>

            <span
              v-else
              key="items"
              class="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full shadow-sm"
            >
              {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}
            </span>
          </transition>
        </header>

   <transition-group
  v-if="visibleCartItems && visibleCartItems.length > 0"
  name="list"
  tag="div"
  class="space-y-3 mb-6"
  aria-live="polite"
>
  <div
    v-for="item in visibleCartItems"
    :key="item.id ?? item.productId ?? item.sku ?? productName(item)"
    class="bg-gray-50 rounded-xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition"
    role="group"
  >
    <img
      :src="item.image ?? item.img ?? item.picture ?? placeholderImg"
      :alt="productName(item)"
      class="w-14 h-14 object-cover rounded-lg border"
      @error="(e) => (e.target.src = placeholderImg)"
    />

    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-800 truncate">{{ productName(item) }}</p>
      <p class="text-xs text-gray-500">x{{ itemQty(item) }}</p>

      <div class="mt-2 flex items-center gap-2">
        <button
          @click="decreaseItem(item)"
          class="px-2 py-1 rounded-md text-xs border hover:bg-gray-100"
          aria-label="Disminuir cantidad"
          :disabled="processing"
        >−</button>

        <button
          @click="increaseItem(item)"
          class="px-2 py-1 rounded-md text-xs border hover:bg-gray-100"
          aria-label="Aumentar cantidad"
          :disabled="processing"
        >+</button>
      </div>

      <!-- Precio unitario (pequeño) -->
      <div class="mt-2 text-xs text-gray-500">
        Precio: S/. {{
          Number(
            String(
              item.price ?? item.unitPrice ?? item.amount ?? (item.product && item.product.price) ?? 0
            ).replace(",", ".")
          ).toFixed(2)
        }}
      </div>
    </div>

    <!-- Total línea calculado (unitPrice * qty) -->
    <p class="text-sm font-bold text-gray-900 whitespace-nowrap">
      S/. {{
        (
          Number(
            String(
              item.price ?? item.unitPrice ?? item.amount ?? (item.product && item.product.price) ?? 0
            ).replace(",", ".")
          ) * itemQty(item)
        ).toFixed(2)
      }}
    </p>
  </div>
</transition-group>


        <div class="border-t pt-5 mt-5 space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-medium text-gray-700">S/. {{ subtotalFormatted }}</span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Envío</span>
            <span class="font-medium text-gray-700">S/. {{ shippingFeeFormatted }}</span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t">
            <span class="text-base font-semibold text-gray-900">Total</span>
            <span class="text-2xl font-extrabold text-purple-600">S/. {{ grandTotal }}</span>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold
                   bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg hover:brightness-105
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-300 transform transition
                   active:scale-95"
            @click="scrollToPayment"
          >
            Ir a pagar
          </button>

          <button
            type="button"
            @click="clearCartConfirm"
            class="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:shadow-sm transition focus:outline-none"
            :disabled="processing || !visibleCartItems || visibleCartItems.length === 0"

          >
            Vaciar carrito
          </button>
        </div>

        <p class="mt-6 text-xs text-gray-500 text-center leading-relaxed">
          🔒 Pago 100% seguro · 🚚 Envíos en 24–48h · 🔄 Devoluciones en 14 días
        </p>
      </aside>


<main id="payment-section" class="bg-white rounded-2xl shadow-lg  transform transition-all duration-400 hover:shadow-xl max-w-md mx-auto">
  <h3 class="text-lg font-semibold text-gray-800 mb-2">Información de Pago</h3>

  <form @submit.prevent="handlePayment" class="space-y-3" novalidate>
    <!-- ========== Tarjeta realista (reemplaza antiguo card-preview) ========== -->
    <div class="card-realistic rounded-xl p-4 relative overflow-hidden" aria-hidden="true">
    <div class="card-overlay" aria-hidden="true"></div>

    <div class="card-top flex items-start justify-between">
        <div class="chip" aria-hidden="true">
            <span class="chip-lines"></span>
        </div>

        <div class="card-logos flex items-center gap-3">
            <svg class="icon-contactless" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
                <path d="M2 12c0 3.31 2.69 6 6 6" stroke="rgba(255,255,255,0.9)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12c0 1.66 1.34 3 3 3" stroke="rgba(255,255,255,0.95)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div class="mc-ops" aria-hidden="true">
                <span class="mc-left"></span>
                <span class="mc-right"></span>
            </div>
        </div>
    </div>

    <div class="card-number mt-6 font-mono text-lg flex justify-between w-full">
        <span
            v-for="(group, index) in displayCardNumberGroups"
            :key="index"
            class="tracking-widest"
        >
            {{ group }}
        </span>
    </div>

    <div class="card-meta flex items-end justify-between mt-4">
        <div class="meta-left min-w-0">
            <div class="meta-label text-xs opacity-80">Titular</div>
            <div class="meta-value font-medium truncate">{{ cardName || "NOMBRE EN LA TARJETA" }}</div>
        </div>
        <div class="meta-right text-right">
            <div class="meta-label text-xs opacity-80">Vence</div>
            <div class="meta-value font-semibold">{{ displayExpiry }}</div>
        </div>
    </div>
</div>
    <!-- ========== /Tarjeta realista ========== -->

    <div class="form-group">
      <label for="cardName" class="block text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
      <input
        id="cardName"
        v-model="cardName"
        type="text"
        class="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
        placeholder="Juan Pérez"
        autocomplete="cc-name"
        required
      />
    </div>

    <div class="form-group">
      <label for="cardNumber" class="block text-sm font-medium text-gray-700">Número de tarjeta</label>
      <input
        id="cardNumber"
        v-model="cardNumber"
        @input="onCardNumberInput"
        inputmode="numeric"
        maxlength="19"
        class="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition font-mono"
        placeholder="#### #### #### ####"
        autocomplete="cc-number"
        aria-describedby="cardNumberHelp"
        required
      />
      <p id="cardNumberHelp" class="mt-1 text-xs text-gray-400">Aceptamos Visa, MasterCard y débito.</p>
    </div>

    <div class="expiry-cvv grid grid-cols-2 gap-4">
      <div>
        <label for="expiry" class="block text-sm font-medium text-gray-700">Expiración (MM/AA)</label>
        <input
          id="expiry"
          v-model="expiry"
          @input="onExpiryInput"
          inputmode="numeric"
          maxlength="5"
          class="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          placeholder="MM/AA"
          autocomplete="cc-exp"
          required
        />
      </div>

      <div>
        <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
        <input
          id="cvv"
          v-model="cvv"
          @input="onCvvInput"
          inputmode="numeric"
          maxlength="4"
          class="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          placeholder="123"
          autocomplete="cc-csc"
          required
        />
      </div>
    </div>

    <div v-if="formError" class="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert" aria-live="assertive">
      {{ formError }}
    </div>
    <div v-if="successMessage" class="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status" aria-live="polite">
      {{ successMessage }}
    </div>

    <div class="flex items-center gap-3">
      <button
        type="submit"
        :disabled="processing || !visibleCartItems || visibleCartItems.length === 0"
        class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold
                   bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg hover:brightness-105
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-300 transform transition
                   active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg v-if="processing" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
        </svg>
        <span v-if="!processing">Pagar S/. {{ grandTotal }}</span>
        <span v-else>Procesando...</span>
      </button>
    </div>

    <p class="mt-1 text-xs text-gray-400">Esta es una simulación de pago.</p>
  </form>
</main>


    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useCartStore } from "../store";
import Cart from "./Cart.vue";
import CheckoutHeader from "./navBarCheckout.vue"; // <- añade este componente (crea el archivo si no existe)

export default {
  name: "Checkout",
  components: { Cart, CheckoutHeader }, // registrar el header
  setup() {
    const cartStore = useCartStore();
    const cartItems = cartStore.items;

    // (mantén aquí TODO tu código existente: form fields, helpers, increaseItem, decreaseItem, etc.)
    // ---- comienza copia de tu setup actual ----

    // Form fields
    const cardName = ref("");
    const cardNumber = ref("");
    const expiry = ref("");
    const cvv = ref("");

    const processing = ref(false);
    const formError = ref("");
    const successMessage = ref("");

    const shippingFee = ref(7.5);

    const placeholderImg = new URL("../assets/placeholder-product.png", import.meta.url).href;

    const subtotal = computed(() => {
      if (typeof cartStore.totalPrice === "number") return Number(cartStore.totalPrice || 0);

      if (!Array.isArray(cartItems)) return 0;
      return cartItems.reduce((sum, it) => {
        const rawPrice = it?.price ?? it?.unitPrice ?? it?.amount ?? it?.product?.price ?? 0;
        const price = parseFloat(String(rawPrice).replace(",", ".")) || 0;
        const qty = Number(it?.qty ?? it?.quantity ?? it?.count ?? 1) || 0;
        return sum + price * qty;
      }, 0);
    });

    const subtotalFormatted = computed(() => subtotal.value.toFixed(2));
    const shippingFeeFormatted = computed(() => (Number(shippingFee.value || 0)).toFixed(2));
    const grandTotal = computed(() => (subtotal.value + Number(shippingFee.value || 0)).toFixed(2));

    function productName(item) {
      return item?.name ?? item?.title ?? item?.productName ?? item?.label ?? (item?.product && item.product.name) ?? "Producto";
    }
    function itemQty(item) {
      return Number(item?.qty ?? item?.quantity ?? item?.count ?? item?.amount ?? 1) || 0;
    }
    function lineTotal(item) {
      const price = Number(item?.price ?? item?.unitPrice ?? item?.amount ?? item?.product?.price ?? 0) || 0;
      return (price * itemQty(item)).toFixed(2);
    }

    const totalItems = computed(() => {
      if (!Array.isArray(cartItems)) return 0;
      return cartItems.reduce((s, it) => s + itemQty(it), 0);
    });

    // visibleCartItems: FILTRA ítems con qty > 0 y normaliza la salida.
    const visibleCartItems = computed(() => {
      if (!Array.isArray(cartItems)) return [];
      return cartItems
        .map((it) => {
          // normaliza estructura mínima para evitar "Producto" fantasma
          const qty = Number(it?.qty ?? it?.quantity ?? it?.count ?? it?.amount ?? 1) || 0;
          return { ...it, qty };
        })
        .filter((it) => it.qty > 0);
    });

    /* increaseItem y decreaseItem: conserva la versión válida única (asegúrate de borrar duplicados anteriores) */
    /* Aumentar / disminuir cantidad — intentamos varias APIs del store y si no existe, mutamos el objeto reactivo (fallback) */
    function increaseItem(item) {
  // clave robusta para identificar item
  const key = item?.id ?? item?.productId ?? item?.sku ?? (item.product && (item.product.id ?? item.product.sku)) ?? productName(item);

  // intenta encontrar en el array reactivo del store
  if (Array.isArray(cartItems)) {
    const idx = cartItems.findIndex((i) => {
      const k = i?.id ?? i?.productId ?? i?.sku ?? (i.product && (i.product.id ?? i.product.sku)) ?? productName(i);
      return k === key;
    });

    if (idx !== -1) {
      const it = cartItems[idx];

      // incrementa propiedades conocidas de cantidad (manteniendo reactividad)
      if (it.qty !== undefined) it.qty = Number(it.qty || 0) + 1;
      else if (it.quantity !== undefined) it.quantity = Number(it.quantity || 0) + 1;
      else if (it.count !== undefined) it.count = Number(it.count || 0) + 1;
      else {
        // si no existe campo de cantidad, crea uno (asume que antes era 1)
        it.qty = 2;
      }

      // si tu store necesita un método para sincronizar / persistir, intenta llamarlo (no obligatorio)
      if (typeof cartStore.save === "function") {
        try { cartStore.save(); } catch (e) { /* noop */ }
      }
      return;
    }
  }

  // si no se encontró el item en cartItems, entonces sí intentamos añadirlo como producto nuevo
  if (typeof cartStore.addToCart === "function") {
    const product = item.product ?? { ...item };
    cartStore.addToCart(product);
    return;
  }

  // fallback: si cartItems es muttable, lo añadimos manualmente
  if (Array.isArray(cartItems)) {
    cartItems.push({ ...(item || {}), qty: 1 });
    return;
  }

  alert("No se pudo aumentar la cantidad: revisa los métodos del store (addToCart, increase, updateQuantity).");
}

    function decreaseItem(item) {
  const key = item?.id ?? item?.productId ?? item?.sku ?? (item.product && (item.product.id ?? item.product.sku)) ?? productName(item);

  if (Array.isArray(cartItems)) {
    const idx = cartItems.findIndex((i) => {
      const k = i?.id ?? i?.productId ?? i?.sku ?? (i.product && (i.product.id ?? i.product.sku)) ?? productName(i);
      return k === key;
    });

    if (idx !== -1) {
      const it = cartItems[idx];
      const current = Number(it?.qty ?? it?.quantity ?? it?.count ?? 1);

      const next = Math.max(0, current - 1);

      if (it.qty !== undefined) it.qty = next;
      else if (it.quantity !== undefined) it.quantity = next;
      else if (it.count !== undefined) it.count = next;
      else it.quantity = next;

      // si llega a 0, intenta remover correctamente
      if (next === 0) {
        if (typeof cartStore.removeFromCart === "function") {
          cartStore.removeFromCart(item);
        } else if (typeof cartStore.remove === "function") {
          cartStore.remove(item);
        } else {
          // Fallback de eliminación si el store no tiene método
          cartItems.splice(idx, 1);
        }
      }

      if (typeof cartStore.save === "function") {
        try { cartStore.save(); } catch (e) { /* noop */ }
      }

      return;
    }
  }

  // si el store ofrece un método para quitar 1 unidad, usarlo
  if (typeof cartStore.decrease === "function") {
    cartStore.decrease(item);
    return;
  }
  if (typeof cartStore.removeOne === "function") {
    cartStore.removeOne(item);
    return;
  }

  alert("No se pudo disminuir la cantidad: revisa los métodos del store (decrease, removeOne, updateQuantity).");
}

    /* Vaciar carrito: intenta métodos comunes y muestra mensaje si ninguno existe */
    function clearCartConfirm() {
  if (!cartItems || cartItems.length === 0) return;
  // confirmación simple (puedes cambiar por modal si lo prefieres)
  if (!confirm("¿Deseas vaciar tu carrito? Esta acción no se puede deshacer.")) return;

  // 1) Si el store expone un método de vaciado, úsalo (preferencia)
  if (typeof cartStore.clearCart === "function") {
    try {
      cartStore.clearCart();
      return;
    } catch (e) {
      console.warn("clearCart failed:", e);
    }
  }
  if (typeof cartStore.clear === "function") {
    try {
      cartStore.clear();
      return;
    } catch (e) {
      console.warn("clear failed:", e);
    }
  }
  if (typeof cartStore.empty === "function") {
    try {
      cartStore.empty();
      return;
    } catch (e) {
      console.warn("empty failed:", e);
    }
  }

  // 2) Si el store guarda en servidor y tiene método save/commit, llámalo después de mutar
  const trySave = async () => {
    // Await agregado
    if (typeof cartStore.save === "function") {
      try { await cartStore.save(); } catch (e) { console.warn("cartStore.save() failed:", e); }
    } else if (typeof cartStore.sync === "function") {
      try { await cartStore.sync(); } catch (e) { console.warn("cartStore.sync() failed:", e); }
    }
  };

  // 3) Fallback: vaciar el array reactivo directamente (mantiene reactividad)
  if (Array.isArray(cartItems)) {
    // mutate array in-place so reactivity triggers
    cartItems.splice(0, cartItems.length);
    // intenta persistir si hay función
    trySave();
    return;
  }

  // 4) Si cartItems no es un array (improbable), intenta asignar valor reactivo si store lo permite
  if (cartStore && (cartStore.items !== undefined)) {
    try {
      if (Array.isArray(cartStore.items)) {
        cartStore.items.splice(0, cartStore.items.length);
        trySave();
        return;
      }
      // último recurso: si el store tiene setter
      if (typeof cartStore.setItems === "function") {
        cartStore.setItems([]);
        trySave();
        return;
      }
    } catch (e) {
      console.warn("No se pudo vaciar usando la API del store:", e);
    }
  }

  // Si llegamos aquí, no hay forma conocida: informa al dev
  alert("No se pudo vaciar el carrito automáticamente. Revisa los métodos del store (clearCart/clear/empty).");
}

    function scrollToPayment() {
      const el = document.getElementById("payment-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const displayCardNumberGroups = computed(() => {
  // Limpia el número de cualquier espacio y lo prepara
  const num = String(cardNumber.value || '').replace(/\s/g, '');
  const placeholder = '################';
  const paddedNum = (num + placeholder).slice(0, 16);

  // Devuelve un array con 4 grupos de 4 caracteres cada uno
  // Ejemplo: ['1234', '5678', '####', '####']
  return paddedNum.match(/.{1,4}/g) || ['####', '####', '####', '####'];
});


// Tu computed para la fecha de expiración está bien, lo puedes dejar como está.
const displayExpiry = computed(() => expiry.value || "MM/AA");

    function onCardNumberInput(e) {
      let v = e.target.value.replace(/\D/g, "").slice(0, 16);
      v = v.replace(/(.{4})/g, "$1 ").trim();
      cardNumber.value = v;
    }
    function onExpiryInput(e) {
      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
      expiry.value = v;
    }
    function onCvvInput(e) {
      cvv.value = e.target.value.replace(/\D/g, "").slice(0, 4);
    }

    function validateForm() {
      formError.value = "";
      if (!cardName.value.trim()) {
        formError.value = "Por favor ingresa el nombre que aparece en la tarjeta.";
        return false;
      }
      const digits = cardNumber.value.replace(/\s/g, "");
      if (digits.length !== 16) {
        formError.value = "Ingresa un número de tarjeta válido de 16 dígitos.";
        return false;
      }
      if (!expiry.value.match(/^\d{2}\/\d{2}$/)) {
        formError.value = "Formato de expiración inválido (MM/AA).";
        return false;
      }
      const [mm] = expiry.value.split("/").map(Number);
      if (mm < 1 || mm > 12) {
        formError.value = "Mes de expiración inválido.";
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv.value)) {
        formError.value = "CVV inválido.";
        return false;
      }
      if (!cartItems || cartItems.length === 0) {
        formError.value = "Tu carrito está vacío.";
        return false;
      }
      return true;
    }

    async function handlePayment() {
      formError.value = "";
      successMessage.value = "";

      if (!validateForm()) return;

      processing.value = true;
      try {
        await new Promise((res) => setTimeout(res, 1200));
        successMessage.value = `Pago exitoso por S/. ${grandTotal.value}. Gracias por tu compra.`;

        if (typeof cartStore.clearCart === "function") {
          cartStore.clearCart();
        } else if (typeof cartStore.clear === "function") {
          cartStore.clear();
        }
        cardNumber.value = "";
        expiry.value = "";
        cvv.value = "";
        cardName.value = "";
      } catch (err) {
        formError.value = "Ocurrió un error procesando el pago. Intenta nuevamente.";
        console.error(err);
      } finally {
        processing.value = false;
      }
    }

    // ---- fin de tu setup existente ----

    return {
      // Data del carrito
      cartItems,
      shippingFee,
      grandTotal,

      // Lógica de formulario
      cardName,
      cardNumber,
      expiry,
      cvv,
      processing,
      formError,
      successMessage,

      // Computadas del formulario
      displayCardNumberGroups,
      displayExpiry,

      // Métodos del formulario
      onCardNumberInput,
      onExpiryInput,
      onCvvInput,
      handlePayment,

      // Lógica y helpers del carrito (integrados)
      subtotal,
      subtotalFormatted,
      shippingFeeFormatted,
      productName,
      itemQty,
      lineTotal,
      totalItems,
      increaseItem,
      decreaseItem,
      clearCartConfirm,
      placeholderImg,
      scrollToPayment,

      // NUEVO: visibleCartItems expuesto al template
      visibleCartItems,
    };
  },
};
</script>


<style scoped>
/* ---------- Contenedor general (responsive) ---------- */
.checkout-container {
  padding-top: 1.5rem;
  padding-bottom: 3rem;
}

/* ---------- Card realistic (reemplaza card-preview antiguo) ---------- */
.card-realistic {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  min-height: 140px;
  display: block;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(15, 9, 49, 0.09);
  transition: transform 300ms cubic-bezier(.2,.9,.2,1), box-shadow 300ms ease, filter 240ms ease;
  background: linear-gradient(135deg, #6338f5 0%, #8b5cf6 40%, #5b7df6 100%);
  color: #fff;
  isolation: isolate;
}

/* glossy overlay / sheen */
.card-realistic::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.03) 60%, rgba(0,0,0,0.04));
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}

/* subtle diagonal shine */
.card-realistic::after {
  content: "";
  position: absolute;
  left: -40%;
  top: -30%;
  width: 140%;
  height: 60%;
  background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.18), rgba(255,255,255,0.05));
  transform: rotate(-18deg);
  filter: blur(8px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
}

/* ensure content sits above overlays */
.card-realistic > * { position: relative; z-index: 2; }

/* Top row: chip + logos */
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

/* Chip */
.chip {
  width: 44px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
  box-shadow: inset 0 -2px 8px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chip .chip-lines {
  width: 22px;
  height: 10px;
  background: linear-gradient(90deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));
  border-radius: 2px;
  opacity: 0.9;
}

/* Logos area (contactless + brand mark) */
.card-logos { display:flex; gap:10px; align-items:center; }

/* Mastercard-like mark (two overlapping circles) */
.mc-ops {
  width: 40px;
  height: 24px;
  position: relative;
  display: inline-block;
}
.mc-ops .mc-left,
.mc-ops .mc-right {
  position: absolute;
  top: 0;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.12);
}
.mc-ops .mc-left {
  left: 0;
  background: radial-gradient(circle at 30% 30%, #ff7a7a, #ff4a4a);
  transform: translateX(0);
}
.mc-ops .mc-right {
  right: 0;
  background: radial-gradient(circle at 70% 30%, #ffd27a, #ffb24a);
  transform: translateX(0);
  mix-blend-mode: screen;
}

/* Card number (embossed look) */
.card-number {
  font-size: 1.05rem;
  letter-spacing: 0.26em;
  margin-top: 12px;
  text-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.97);
  -webkit-font-smoothing: antialiased;
  font-weight: 600;
}

/* Meta row */
.card-meta {
  margin-top: 12px;
  display: flex;
  align-items: end;
  justify-content: space-between;
}
.meta-label { font-size: 0.7rem; opacity: 0.85; }
.meta-value { font-size: 0.95rem; }

/* Total badge (small) */
.card-total {
  background: rgba(0,0,0,0.08);
  color: rgba(255,255,255,0.95);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.82rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* hover lift */
.card-realistic:hover {
  transform: translateY(-6px) scale(1.003);
  box-shadow: 0 28px 60px rgba(15,9,49,0.12);
}

/* ---------- Form niceties (kept, slightly tuned) ---------- */
.form-group input,
.expiry-cvv input {
  transition: box-shadow .18s ease, transform .18s ease;
  background: #fff;
  color: #111827;
}
.form-group input:focus,
.expiry-cvv input:focus {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.06);
}

/* ---------- Animaciones para la lista de items (se mantienen) ---------- */
.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ---------- Buttons y accesibilidad ---------- */
button[disabled] { pointer-events: none; opacity: 0.6; }
[role="alert"] { outline: none; }

/* subtle spin animation for svg spinner (kept) */
@keyframes tinySpin { to { transform: rotate(360deg); } }
.animate-spin { animation: tinySpin 1s linear infinite; }

/* Responsive tweaks */
@media (max-width: 1024px) {
  .checkout-container { padding-left: 1rem; padding-right: 1rem; }
  .card-realistic { min-height: 120px; padding: 14px; border-radius: 12px; }
  .card-number { font-size: 0.98rem; letter-spacing: 0.22em; }
  .mc-ops { width: 36px; height: 20px; }
}
</style>
