// src/store/index.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  /**
   * items: array de objetos planos
   * { id, name, price, image, qty, ...otrosCampos }
   */
  const items = ref([]);

  // Helper: extrae id robustamente
  function extractId(productOrId) {
    if (!productOrId) return null;
    if (typeof productOrId === "string" || typeof productOrId === "number") return String(productOrId);
    return (
      productOrId.id ??
      productOrId.productId ??
      productOrId.sku ??
      productOrId._id ??
      null
    );
  }

  // Helper: parsea precio (maneja "14,99" y strings)
  function parsePrice(v) {
    if (v === undefined || v === null) return 0;
    const s = String(v).replace(",", ".").trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  // Busca índice en items por id robusto
  function findIndexByProduct(product) {
    const id = extractId(product);
    if (!id) return -1;
    return items.value.findIndex(
      it => String(it.id) === String(id)
    );
  }

  // Crea un objeto plano desde product (mantiene campos importantes)
  function normalizeProduct(product) {
    if (!product) return null;
    // si ya es un item plano con qty, devuélvelo (defensivo)
    if (product.id && (product.qty !== undefined || product.quantity !== undefined)) {
      return {
        ...product,
        id: String(product.id),
        qty: Number(product.qty ?? product.quantity ?? product.qty ?? 1),
        price: parsePrice(product.price ?? product.unitPrice ?? product.amount ?? product.product?.price)
      };
    }

    const id = extractId(product) ?? product.name ?? product.title ?? Math.random().toString(36).slice(2, 9);
    const name = product.name ?? product.title ?? product.label ?? (product.product && product.product.name) ?? "Producto";
    const image = product.image ?? product.img ?? product.picture ?? (product.product && product.product.image) ?? "";
    const price = parsePrice(product.price ?? product.unitPrice ?? product.amount ?? (product.product && product.product.price) ?? 0);

    return {
      ...product,
      id: String(id),
      name,
      image,
      price,
      qty: 1
    };
  }

  // Añade producto o incrementa si ya existe
// Añade producto o incrementa si ya existe
function addToCart(product) {
  if (!product) return;
  const norm = normalizeProduct(product);
  const idx = findIndexByProduct(norm);
  if (idx !== -1) {
    // <-- cambiado: sumar la cantidad solicitada en lugar de sumar siempre 1
    const increment = Number(norm.qty || 1);
    items.value[idx].qty = Number(items.value[idx].qty || 0) + increment;
  } else {
    // push objeto plano (no anidamos .product)
    items.value.push({
      id: norm.id,
      name: norm.name,
      image: norm.image,
      price: norm.price,
      qty: Number(norm.qty || 1),
      // copia cualquier campo útil
      ...Object.fromEntries(Object.entries(product).filter(([k]) => !["id","name","image","price","qty","quantity"].includes(k)))
    });
  }
}


  // Incrementa cantidad (acepta product object o id)
  function increase(productOrId) {
    const idx = findIndexByProduct(productOrId);
    if (idx !== -1) {
      items.value[idx].qty = Number(items.value[idx].qty || 0) + 1;
    } else {
      // si nos pasan un product completo sin estar en carrito, añádelo
      if (typeof productOrId === "object") addToCart(productOrId);
    }
  }

  // Decrementa cantidad (y elimina si llega a 0). acepta product o id.
  function decrease(productOrId) {
    const idx = findIndexByProduct(productOrId);
    if (idx === -1) return;
    const current = Number(items.value[idx].qty || items.value[idx].quantity || 0);
    if (current > 1) {
      items.value[idx].qty = current - 1;
    } else {
      // eliminar
      items.value.splice(idx, 1);
    }
  }

  // Alias para compatibilidad con nombres distintos en tu código
  function decrementItem(productOrId) { return decrease(productOrId); }
  function removeFromCart(productOrId) {
    const id = extractId(productOrId);
    if (!id) return;
    const idx = items.value.findIndex(it => String(it.id) === String(id));
    if (idx !== -1) items.value.splice(idx, 1);
  }
  function remove(productOrId) { return removeFromCart(productOrId); }
  function removeOne(productOrId) { return decrease(productOrId); }

  // Actualiza cantidad explícitamente (product or id, newQty)
  function updateQuantity(productOrId, newQty) {
    const idx = findIndexByProduct(productOrId);
    if (idx === -1) return;
    const nq = Math.max(0, Number(newQty || 0));
    if (nq === 0) {
      items.value.splice(idx, 1);
    } else {
      items.value[idx].qty = nq;
    }
  }

  // Limpia todo el carrito
  function clearCart() {
    items.value.splice(0, items.value.length);
  }
  // alias
  function clear() { return clearCart(); }
  function empty() { return clearCart(); }

  // Exponer un setter por si algún componente quiere reemplazar el array
  function setItems(newItems = []) {
    items.value.splice(0, items.value.length, ...newItems);
  }

  // Cálculos
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + (Number(item.qty || item.quantity || 0)), 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const price = parsePrice(item.price ?? item.unitPrice ?? item.amount ?? 0);
      const qty = Number(item.qty ?? item.quantity ?? 0);
      return sum + price * qty;
    }, 0)
  );

  return {
    // datos
    items,

    // CRUD / manipuladores
    addToCart,
    increase,
    decrease,
    removeFromCart,
    remove,
    removeOne,
    decrementItem,
    updateQuantity,
    setItems,

    // vaciado
    clearCart,
    clear,
    empty,

    // computadas
    totalItems,
    totalPrice,

    // helpers/compat
    parsePrice,
    extractId
  };
});
