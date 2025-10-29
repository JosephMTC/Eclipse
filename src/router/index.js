// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router"; // <--- CAMBIO 1
import HomeView from "../views/HomeView.vue";
import ProductView from "../views/ProductView.vue";
import ProductList from "../components/ProductList.vue"; // <-- añadido: vista listado
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { auth } from "../firebase/config";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  // LISTADO de productos
  {
    path: "/products",
    name: "products",
    component: ProductList,
  },

  // DETALLE de producto
  {
    path: "/product/:id",
    name: "product",
    component: ProductView,
    props: true,
    meta: { hideHeader: true },
  },

  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { hideHeader: true },
  },

  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { hideHeader: true },
  },

  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../components/Checkout.vue"),
    meta: { requiresAuth: true, hideHeader: true },
  },
];

const router = createRouter({
  
  history: createWebHashHistory(import.meta.env.BASE_URL), // <--- CAMBIO 2
  // ---------------------------------
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;