<template>
  <BannerSlider />

  <main class="pt-28 bg-gray-50">
    <!-- Catálogo normal -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h1 class="text-3xl font-bold text-center mb-10 text-gray-800">
        Catálogo de Productos
      </h1>
      <ProductList />
    </section>

    <!-- PRODUCTOS RECOMENDADOS-->
    <section id="recommended-products" ref="revealSection" class="max-w-7xl mx-auto px-4 py-16 animated-border-section">
      <!-- Sides que dibujan el contorno -->
      <span class="border-side side-top" aria-hidden="true"></span>
      <span class="border-side side-right" aria-hidden="true"></span>
      <span class="border-side side-bottom" aria-hidden="true"></span>
      <span class="border-side side-left" aria-hidden="true"></span>

      <!-- Grid: 1 col (mobile) -> 3 cols (md+) -->
      <div class="best-products-grid grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <!-- TEXTO (col 1) -->
        <div class="px-2 md:px-0">
          <transition name="fade-slide-left">
            <div v-if="revealed" class="text-left space-y-4">
              <div class="inline-flex items-center gap-3">
                <span class="badge">Top picks</span>
                <div class="text-xs text-gray-500">Curados para ti</div>
              </div>

              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">
                Los mejores productos a un solo click
              </h2>

              <div class="mt-3 text-gray-600">
                Seleccionados cuidadosamente para darte calidad y estilo al instante.
              </div>

              <ul class="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Envío rápido 24–48h</li>
                <li>• Garantía de devolución 14 días</li>
                <li>• Pagos seguros</li>
              </ul>

              <div class="mt-4 flex flex-wrap items-center gap-3">
                <button class="btn-primary" @click="goToCatalog" aria-label="Ver catálogo">
                  Ver colección
                </button>
                <button class="btn-ghost" @click="contactSales" aria-label="Contactar ventas">
                  Hablar con ventas
                </button>
              </div>

              <div class="mt-4 flex items-center gap-3">
                <div class="stars" aria-hidden="true">
                  <svg v-for="n in 5" :key="n" class="star" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.65L19.5 24 12 19.897 4.5 24l1.7-8.6L0.4 9.75l7.932-1.732z"/>
                  </svg>
                </div>
                <div class="text-sm text-gray-500">4.8 • 1,245 reseñas</div>
              </div>
            </div>
          </transition>
        </div>

        <!-- DIVIDER vertical (col 2) -> oculto en móviles -->
        <div class="hidden md:flex items-center justify-center pointer-events-none">
          <transition name="fade">
            <div v-if="revealed" class="divider-vertical" aria-hidden="true">
              <div class="line">
                <span class="dot dot-top" aria-hidden="true"></span>
                <span class="dot dot-middle" aria-hidden="true"></span>
                <span class="dot dot-bottom" aria-hidden="true"></span>
              </div>
            </div>
          </transition>
        </div>

        <!-- IMÁGENES / Swiper (col 3 en md, col 1 en móviles) -->
        <div class="px-2 md:px-0">
          <Swiper
            :modules="[Autoplay, EffectFade, Pagination, A11y]"
            effect="fade"
            :fadeEffect="{ crossFade: true }"
            :autoplay="{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }"
            :pagination="{ clickable: true }"
            :loop="true"
            class="w-full"
          >
            <SwiperSlide
              v-for="p in recommendedProducts"
              :key="p.id"
              class="relative rounded-lg overflow-hidden product-card"
            >
              <div
                class="w-full h-full cursor-pointer"
                role="link"
                tabindex="0"
                @click="goToProduct(getId(p))"
                @keydown.enter.prevent="goToProduct(getId(p))"
                :aria-label="`Ver detalles de ${p.name}`"
              >
                <div class="w-full h-64 sm:h-80 md:h-[420px] rounded-lg overflow-hidden shadow-lg relative">
                  <img
                    :src="p.image"
                    :alt="p.name"
                    loading="lazy"
                    class="w-full h-full object-cover object-center product-image"
                  />
                  <div class="absolute inset-0 overlay flex items-end p-3 sm:p-5">
                    <div class="overlay-content w-full flex items-end justify-between gap-3">
                      <div class="text-left">
                        <div class="text-white font-semibold text-base sm:text-lg leading-tight">{{ p.name }}</div>
                        <div class="text-sm text-gray-100/90 mt-1">S/. {{ p.price }}</div>
                      </div>
                      <div class="actions flex items-center gap-2">
                        <button class="icon-btn" @click.stop="goToProduct(getId(p))" :aria-label="`Vista rápida ${p.name}`">
                          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5C7 5 2.7 8.11 1 12c1.7 3.89 6 7 11 7s9.3-3.11 11-7c-1.7-3.89-6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
                        </button>
                        <button class="btn-small" @click.stop="addToCart(p)" :aria-label="`Añadir ${p.name} al carrito`">
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  </main>

  <Footer class="mt-30" />
</template>

<script setup>
/* Components */
import BannerSlider from "../components/BannerSlider.vue";
import ProductList from "../components/ProductList.vue";
import Footer from '../components/Footer.vue';

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* Firebase */
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/* Local products JSON */
import productsData from '../assets/products.json';

/* Vue */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

/* SINGLE router declaration */
const router = useRouter();

/* ---------------------- Recommended (solo 4 productos) -------------------- */
// IDs que quieres mostrar en "Recomendados" (asegúrate existen en products.json)
const recommendedIds = ['7', '8', '9', '10'];

// Construimos recommendedProducts desde productsData (no tocamos productlist/source)
const recommendedProducts = Array.isArray(productsData)
  ? recommendedIds
      .map(id => {
        const found = productsData.find(p => String(p.id) === String(id));
        if (!found) return null;
        const filename = String(found.image ?? '').split('/').pop() || `${found.id}.jpg`;
        return {
          ...found,
          id: String(found.id),
          image: `/products/${filename}` // usa public/products/<filename>
        };
      })
      .filter(Boolean)
  : [];

/* ---------------------- REVEAL (intersection observer) ------------------- */
const revealed = ref(false);
const revealSection = ref(null);
let obs = null;

/* -------------------- CARRITO (local + Firestore) -------------------- */
const cart = ref([]); // array de items: { id, name, price, qty, image }
const LOCAL_CART_KEY = "cart_v1";

function loadLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    cart.value = raw ? JSON.parse(raw) || [] : [];
  } catch (e) {
    console.error("Error cargando carrito local:", e);
    cart.value = [];
  }
}
function saveLocalCart() {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart.value));
  } catch (e) {
    console.error("Error guardando carrito local:", e);
  }
}
function mergeCarts(localItems = [], serverItems = []) {
  const map = new Map();
  for (const it of serverItems) map.set(it.id, { ...it });
  for (const it of localItems) {
    if (map.has(it.id)) map.get(it.id).qty = (Number(map.get(it.id).qty) || 0) + (Number(it.qty) || 1);
    else map.set(it.id, { ...it });
  }
  return Array.from(map.values());
}
async function getServerCart(uid) {
  try {
    const refDoc = doc(db, "carts", uid);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.error("Error leyendo carrito servidor:", e);
    return [];
  }
}
async function saveServerCart(uid, items) {
  try {
    const refDoc = doc(db, "carts", uid);
    await setDoc(refDoc, { items: items, updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error("Error guardando carrito en servidor:", e);
  }
}
let authUnsub = null;
async function handleUserLogin(user) {
  if (!user || !user.uid) return;
  const uid = user.uid;
  const serverItems = await getServerCart(uid);
  const merged = mergeCarts(cart.value, serverItems);
  await saveServerCart(uid, merged);
  cart.value = merged;
  saveLocalCart();
  console.info("Carrito sincronizado: local -> server (merged).");
}
async function saveCartIfLoggedIn() {
  const user = auth.currentUser;
  if (!user || !user.uid) return;
  await saveServerCart(user.uid, cart.value);
}

/* -------------------- MOUNT / UNMOUNT -------------------- */
onMounted(() => {
  // reveal observer
  if (!revealSection.value) {
    revealed.value = true;
  } else {
    obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealed.value = true;
          if (obs) obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(revealSection.value);
  }

  // load cart and auth listener
  loadLocalCart();
  authUnsub = onAuthStateChanged(auth, async (user) => {
    if (user) await handleUserLogin(user);
    else console.info("Usuario no autenticado, usando carrito local.");
  });
});

onBeforeUnmount(() => {
  if (obs) obs.disconnect();
  if (authUnsub) authUnsub();
});

/* -------------------- FUNCIONES UI -------------------- */
function addToCart(product) {
  try {
    if (!product || !product.id) {
      console.warn("Producto inválido al intentar agregar al carrito:", product);
      return;
    }
    const idx = cart.value.findIndex((i) => i.id === product.id);
    if (idx >= 0) cart.value[idx].qty = (Number(cart.value[idx].qty) || 0) + 1;
    else cart.value.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      qty: 1,
      image: product.image || null
    });
    saveLocalCart();
    saveCartIfLoggedIn().catch((e) => {
      console.warn("No se pudo guardar carrito en servidor inmediatamente:", e);
    });
    console.log("Añadido al carrito:", product.name, "Carrito ahora:", cart.value);
  } catch (e) {
    console.error("Error en addToCart:", e);
  }
}
function quickView(product) {
  console.log("Quick view:", product);
}
function goToCatalog() {
  console.log("Ir al catálogo");
}
function contactSales() {
  console.log("Contactar ventas");
}

/* helper robusto para obtener id desde distintas propiedades */
function getId(p) {
  return p?.id ?? p?.productId ?? p?._id ?? p?.sku ?? null;
}

/* normalizar y navegar */
function goToProduct(idOrProduct) {
  const id = typeof idOrProduct === 'string' || typeof idOrProduct === 'number'
    ? String(idOrProduct).trim()
    : (getId(idOrProduct) ?? '');

  if (!id) {
    console.warn('goToProduct: id inválido', idOrProduct);
    return;
  }

  router.push(`/product/${encodeURIComponent(id)}`).catch(() => {});
}
</script>

<style>
:root {
  --p1: #9333ea;
  --p2: #a855f7;
  --p3: #c084fc;
  --border-thickness: 3px;
  --draw-duration: 2s;
  --gap-between-draws: 0.05s;
  --total-draw: calc((var(--draw-duration) * 4) + (var(--gap-between-draws) * 3));
}
</style>

<style scoped>
/* --- Transiciones de entrada --- */
.fade-enter-active,
.fade-leave-active,
.fade-slide-left-enter-active,
.fade-slide-left-leave-active {
  transition: opacity 700ms ease, transform 700ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-slide-left-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.fade-slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Badge y botones (texto a la izquierda) */
.badge {
  background: linear-gradient(90deg, rgba(147,51,234,0.12), rgba(168,85,247,0.08));
  color: var(--p1);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(147,51,234,0.06);
}
.btn-primary {
  background: linear-gradient(90deg, var(--p1), var(--p2));
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  box-shadow: 0 8px 30px rgba(147,51,234,0.12);
  border: none;
  cursor: pointer;
}
.btn-primary:hover { transform: translateY(-2px); }
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(99,102,241,0.08);
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.btn-small {
  background: linear-gradient(90deg, var(--p2), var(--p3));
  color: white;
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.icon-btn {
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Estrellas */
.stars { display:flex; gap:4px; }
.star path { fill: #f5c100; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15)); }

/* ===== Mejoras visuales para la tarjeta de imagen ===== */
.product-card { cursor: grab; }
.product-card:active { cursor: grabbing; }
.product-image {
  transition: transform 600ms cubic-bezier(.2,.9,.2,1), filter 400ms;
  will-change: transform;
  transform-origin: center center;
  display: block;
}
.product-card:hover .product-image {
  transform: scale(1.06);
  filter: saturate(1.05) contrast(1.02);
}

/* Overlay degradado y contenido */
.overlay {
  background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(6,6,7,0.55) 70%);
  transition: opacity 250ms ease;
  opacity: 1;
}
.overlay-content {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.product-card .actions { transform: translateY(6px); transition: transform 250ms ease; }
.product-card:hover .actions { transform: translateY(0); }

/* Pseudo-shadow para tarjeta */
.product-card .shadow-strong {
  box-shadow: 0 12px 40px rgba(15,9,49,0.18);
}

/* ===== Divisor vertical estilizado ===== */
.divider-vertical .line {
  height: 220px;
  width: 1px;
  background: linear-gradient(180deg, rgba(147,51,234,0.9), rgba(168,85,247,0.6), rgba(192,132,252,0.4));
  position: relative;
  border-radius: 6px;
  box-shadow: 0 0 18px rgba(168,85,247,0.08);
  animation: moveGradient 3.5s linear infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
@keyframes moveGradient {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}
/* Dots / badges along the line */
.divider-vertical .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--p1), var(--p3));
  box-shadow: 0 4px 14px rgba(147,51,234,0.25);
  display: block;
  transform: translateX(0);
}
/* Posiciones */
.dot-top { transform: translateY(-6px); }
.dot-middle { transform: translateY(0); }
.dot-bottom { transform: translateY(6px); }

/* ==== Swiper bullets (mejoradas) ==== */
.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: rgba(255,255,255,0.18);
  opacity: 1;
  border: 1px solid rgba(255,255,255,0.06);
}
.swiper-pagination-bullet-active {
  background: linear-gradient(90deg, var(--p1), var(--p2));
  box-shadow: 0 6px 18px rgba(147,51,234,0.18);
  transform: scale(1.2);
}

/* === Borde animado (tu código con leves ajustes) === */
.animated-border-section {
  position: relative;
  padding: calc(2.25rem + var(--border-thickness)) 1rem;
  overflow: visible;
}
.border-side {
  position: absolute;
  background: linear-gradient(90deg, var(--p1), var(--p2), var(--p3));
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.65);
  z-index: 40;
}

/* TOP */
.side-top {
  top: -1px;
  left: -1px;
  height: var(--border-thickness);
  width: calc(100% + 2px);
  transform-origin: left center;
  transform: scaleX(0);
  animation:
    drawHorizontal var(--draw-duration) linear forwards 0s,
    pulseBorder 2s ease-in-out infinite calc(var(--total-draw));
}

/* RIGHT */
.side-right {
  top: -1px;
  right: -1px;
  width: var(--border-thickness);
  height: calc(100% + 2px);
  transform-origin: top center;
  transform: scaleY(0);
  animation:
    drawVertical var(--draw-duration) linear forwards calc(var(--draw-duration) + var(--gap-between-draws)),
    pulseBorder 2s ease-in-out infinite calc(var(--total-draw));
}

/* BOTTOM */
.side-bottom {
  bottom: -1px;
  left: -1px;
  height: var(--border-thickness);
  width: calc(100% + 2px);
  transform-origin: right center;
  transform: scaleX(0);
  animation:
    drawHorizontal var(--draw-duration) linear forwards calc((var(--draw-duration) * 2) + (var(--gap-between-draws) * 2)),
    pulseBorder 2s ease-in-out infinite calc(var(--total-draw));
}

/* LEFT */
.side-left {
  top: -1px;
  left: -1px;
  width: var(--border-thickness);
  height: calc(100% + 2px);
  transform-origin: bottom center;
  transform: scaleY(0);
  animation:
    drawVertical var(--draw-duration) linear forwards calc((var(--draw-duration) * 3) + (var(--gap-between-draws) * 3)),
    pulseBorder 2s ease-in-out infinite calc(var(--total-draw));
}
@keyframes drawHorizontal { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
@keyframes drawVertical { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
@keyframes pulseBorder {
  0% { box-shadow: 0 0 6px rgba(168,85,247,0.45); filter: saturate(1); opacity: 1; }
  50% { box-shadow: 0 0 18px rgba(168,85,247,0.9); filter: saturate(1.08); opacity: 0.95; }
  100% { box-shadow: 0 0 6px rgba(168,85,247,0.45); filter: saturate(1); opacity: 1; }
}

/* Asegura que contenido importante esté por encima del borde */
.animated-border-section > .best-products-grid,
.animated-border-section .w-full {
  position: relative;
  z-index: 10;
}

/* Responsive */
@media (max-width: 768px) {
  :root { --border-thickness: 2px; }
  .animated-border-section { padding: calc(1.5rem + var(--border-thickness)) 0.75rem; }
  .divider-vertical .line { height: 160px; }
  .product-card .overlay { padding: 10px; }
}

/* ======================
   FIXES RESPONSIVE para la sección "best products"
   ====================== */

/* Alineado y separación consistentes del grid */
.best-products-grid {
  align-items: center;
  gap: 1.5rem;
}

/* Forzar que el divider esté oculto en pantallas pequeñas (seguro) */
.divider-vertical {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 767px) {
  .divider-vertical { display: none !important; }
}

/* Evitar que las tarjetas colapsen dentro del grid/flex */
.product-card {
  display: flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
}
.product-card > div {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

/* Imagen: forzar objeto cover y una altura mínima razonable para móviles */
.product-card .product-image {
  object-fit: cover;
  min-height: 180px;
  max-height: none;
}

/* Ajustes responsivos más finos para la altura de las imágenes */
@media (max-width: 639px) {
  .product-card .product-image { min-height: 220px; }
}
@media (min-width: 640px) and (max-width: 1023px) {
  .product-card .product-image { min-height: 280px; }
}

/* Divider vertical: alturas responsivas y padding reducido en pantallas pequeñas */
.divider-vertical .line {
  height: 220px;
}
@media (max-width: 768px) {
  .divider-vertical .line {
    height: 160px;
    padding: 8px 0;
  }
  .animated-border-section { padding: calc(1rem + var(--border-thickness)) 0.75rem; }
}

/* Overlay: asegurar que el contenedor ocupe todo el ancho y tenga paddings adaptativos */
.overlay {
  padding: 0;
}
@media (min-width: 640px) {
  .overlay { padding: 1rem; }
}

/* Reafirmar que el contenido esté por encima del borde (por seguridad) */
.animated-border-section > .best-products-grid,
.animated-border-section .w-full {
  position: relative;
  z-index: 10;
}
</style>
