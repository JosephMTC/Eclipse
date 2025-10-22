<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store";

export default {
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    // Normaliza cartStore.items para que sea siempre un array observable
    const cartItems = computed(() => {
      // Si cartStore.items es un array directo
      if (Array.isArray(cartStore.items)) return cartStore.items;
      // Si es un ref { value: [...] }
      if (cartStore.items && Array.isArray(cartStore.items.value)) return cartStore.items.value;
      // Fallback vacío
      return [];
    });

    // Normaliza totalPrice (si tu store lo expone)
    const totalPrice = computed(() => {
      // Si el store tiene totalPrice calculado
      if (typeof cartStore.totalPrice === "number") return cartStore.totalPrice;
      // Si totalPrice es ref/computed en el store
      if (cartStore.totalPrice && typeof cartStore.totalPrice.value === "number") return cartStore.totalPrice.value;
      // Si no existe, calcularlo localmente por seguridad
      return cartItems.value.reduce((s, it) => {
        const price = Number(it?.product?.price ?? it?.price ?? 0) || 0;
        const qty = Number(it?.quantity ?? it?.qty ?? it?.count ?? 1) || 0;
        return s + price * qty;
      }, 0);
    });

    // Métodos que usan el store (asegúrate que el store implemente estos)
    function decrement(productId) {
      if (typeof cartStore.decrementItem === "function") {
        cartStore.decrementItem(productId);
      } else if (typeof cartStore.removeOne === "function") {
        cartStore.removeOne(productId);
      } else {
        // fallback: buscar el item y reducir qty manualmente si cartItems es mutable
        const idx = cartItems.value.findIndex(it => (it.product?.id ?? it.id) === productId);
        if (idx !== -1) {
          const it = cartItems.value[idx];
          const current = Number(it.quantity ?? it.qty ?? it.count ?? 1);
          const next = Math.max(0, current - 1);
          if (it.quantity !== undefined) it.quantity = next;
          else if (it.qty !== undefined) it.qty = next;
          else it.quantity = next;
          // si llega a 0 intentar eliminar
          if (next === 0) {
            if (typeof cartStore.removeFromCart === "function") cartStore.removeFromCart(productId);
            else if (Array.isArray(cartStore.items)) cartStore.items.splice(idx, 1);
            else if (cartStore.items && Array.isArray(cartStore.items.value)) cartStore.items.value.splice(idx, 1);
          }
        }
      }
    }

    function increment(product) {
      if (typeof cartStore.addToCart === "function") {
        cartStore.addToCart(product);
      } else if (typeof cartStore.increase === "function") {
        cartStore.increase(product);
      } else {
        // fallback: push manual
        if (Array.isArray(cartStore.items)) {
          const idx = cartStore.items.findIndex(i => (i.product?.id ?? i.id) === (product.id ?? product.product?.id));
          if (idx !== -1) {
            const it = cartStore.items[idx];
            it.quantity = (Number(it.quantity ?? it.qty ?? 0) || 0) + 1;
          } else {
            cartStore.items.push({ product, quantity: 1 });
          }
        } else if (cartStore.items && Array.isArray(cartStore.items.value)) {
          const list = cartStore.items.value;
          const idx = list.findIndex(i => (i.product?.id ?? i.id) === (product.id ?? product.product?.id));
          if (idx !== -1) {
            const it = list[idx];
            it.quantity = (Number(it.quantity ?? it.qty ?? 0) || 0) + 1;
          } else {
            list.push({ product, quantity: 1 });
          }
        }
      }
    }

    function remove(productId) {
      if (typeof cartStore.removeFromCart === "function") {
        cartStore.removeFromCart(productId);
      } else if (typeof cartStore.remove === "function") {
        cartStore.remove(productId);
      } else {
        // fallback splice
        const list = Array.isArray(cartStore.items) ? cartStore.items : (cartStore.items && Array.isArray(cartStore.items.value) ? cartStore.items.value : []);
        const idx = list.findIndex(it => (it.product?.id ?? it.id) === productId);
        if (idx !== -1) list.splice(idx, 1);
      }
    }

    function proceedToCheckout() {
      router.push("/checkout");
    }

    return {
      cartItems,
      totalPrice,
      decrement,
      increment,
      remove,
      proceedToCheckout,
    };
  },
};
</script>
