<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <transition name="fade-slide" appear>
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-400"
        role="region"
        aria-labelledby="register-title"
      >
        <!-- Header -->
        <div class="mb-6 text-center">
          <img v-if="logoUrl" :src="logoUrl" alt="Mi E-Commerce" class="mx-auto w-12 h-12 mb-3" />
          <h1 id="register-title" class="text-2xl font-extrabold text-gray-900">Crea tu cuenta</h1>
          <p class="mt-2 text-sm text-gray-500">
            Regístrate para comprar, guardar favoritos y ver tu historial.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="register" novalidate>
          <div class="space-y-4">
            <!-- Nombre (opcional) -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nombre (opcional)</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                autocomplete="name"
                class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 transition"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                required
                autocomplete="email"
                class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 transition"
                :class="{'ring-2 ring-red-300': errors.field === 'email' }"
                aria-invalid="false"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <div class="relative mt-1">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 transition pr-12"
                  :class="{'ring-2 ring-red-300': errors.field === 'password' }"
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-2 rounded-md
                         text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  :aria-pressed="String(showPassword)"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.5-4.055M3 3l18 18"/>
                  </svg>
                </button>
              </div>
              <p id="password-help" class="mt-1 text-xs text-gray-400">Mínimo 6 caracteres.</p>
            </div>

            <!-- Confirmar contraseña -->
            <div>
              <label for="confirm" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <input
                id="confirm"
                type="password"
                v-model="form.confirm"
                required
                minlength="6"
                autocomplete="new-password"
                class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 transition"
                :class="{'ring-2 ring-red-300': errors.field === 'confirm' }"
              />
            </div>

            <!-- Terms checkbox -->
            <div class="flex items-center gap-2">
              <input id="terms" type="checkbox" v-model="form.terms" class="h-4 w-4 text-purple-600 rounded focus:ring-purple-400 border-gray-300" />
              <label for="terms" class="text-sm text-gray-700">
                Acepto los <router-link to="/terms" class="text-purple-600 hover:underline">términos y condiciones</router-link>
              </label>
            </div>

            <!-- Error message (aria-live) -->
            <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert" aria-live="polite">
              {{ errorMessage }}
            </div>

            <!-- Submit -->
            <div>
              <button
                type="submit"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold
                       bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg hover:brightness-105
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-300 transform transition
                       active:scale-95 disabled:opacity-60"
                :disabled="loading"
              >
                <span v-if="loading" class="inline-flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                  </svg>
                  Creando...
                </span>
                <span v-else>Crear cuenta</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-3">
              <div class="h-px bg-gray-200 flex-1"></div>
              <div class="text-xs text-gray-400">o</div>
              <div class="h-px bg-gray-200 flex-1"></div>
            </div>

            <!-- Social (visual) -->
            <div class="grid grid-cols-2 gap-3">
              <button type="button" class="py-2 rounded-lg border border-gray-200 flex items-center justify-center gap-2 hover:shadow-sm transition">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.8v-6.9h-2.4V12h2.4V9.6c0-2.4 1.4-3.7 3.5-3.7 1 0 2 .08 2 .08v2.2h-1.1c-1.1 0-1.5.71-1.5 1.44V12h2.6l-.4 2.9h-2.2v6.9A10 10 0 0022 12z"/></svg>
                <span class="text-sm text-gray-700">Continuar con Facebook</span>
              </button>
              <button type="button" class="py-2 rounded-lg border border-gray-200 flex items-center justify-center gap-2 hover:shadow-sm transition">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 12.3c0-.8-.1-1.4-.3-2H12v3.4h5.6c-.2 1.3-.9 2.3-1.9 3v2h3.1c1.8-1.7 2.8-4.2 2.8-7.4z"/></svg>
                <span class="text-sm text-gray-700">Continuar con Google</span>
              </button>
            </div>

            <!-- Login link -->
            <p class="text-center text-sm text-gray-500 mt-2">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="text-purple-600 font-semibold hover:underline"> Inicia sesión</router-link>
            </p>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";

/* Form state */
const form = ref({
  name: "",
  email: "",
  password: "",
  confirm: "",
  terms: false
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const errors = ref({ field: null });
const router = useRouter();

/* logo (usa new URL para evitar problemas con alias) */
let logoUrl = null;
try {
  logoUrl = new URL('../assets/eclipse-2.svg', import.meta.url).href;
} catch (e) {
  logoUrl = null;
}

/* Helpers */
function togglePassword() {
  showPassword.value = !showPassword.value;
}
function friendlyError(code, message) {
  if (!code) return "Error al crear la cuenta.";
  if (code === "auth/email-already-in-use") return "El correo ya está en uso.";
  if (code === "auth/weak-password") return "La contraseña es muy débil (mínimo 6 caracteres).";
  if (code === "auth/invalid-email") return "Correo inválido.";
  if (code === "auth/too-many-requests") return "Demasiados intentos. Intenta más tarde.";
  return message || "Error al crear la cuenta.";
}

/* Register */
async function register() {
  errorMessage.value = "";
  errors.value.field = null;

  // Validaciones básicas
  if (!form.value.email) {
    errors.value.field = "email";
    errorMessage.value = "Por favor ingresa tu correo.";
    return;
  }
  if (!form.value.password) {
    errors.value.field = "password";
    errorMessage.value = "Por favor ingresa tu contraseña.";
    return;
  }
  if (form.value.password.length < 6) {
    errors.value.field = "password";
    errorMessage.value = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }
  if (form.value.password !== form.value.confirm) {
    errors.value.field = "confirm";
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }
  if (!form.value.terms) {
    errors.value.field = null;
    errorMessage.value = "Debes aceptar los términos y condiciones.";
    return;
  }

  loading.value = true;
  try {
    // Crear usuario en Firebase Auth
    const userCred = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);

    // Si dieron nombre, actualizar displayName
    try {
      if (form.value.name && userCred.user) {
        await updateProfile(userCred.user, { displayName: form.value.name });
      }
    } catch (e) {
      console.warn("updateProfile error:", e);
    }

    // Crear documento en Firestore: users/{uid}
    try {
      if (userCred.user && userCred.user.uid) {
        const udoc = doc(db, "users", userCred.user.uid);
        await setDoc(udoc, {
          email: userCred.user.email,
          displayName: userCred.user.displayName || form.value.name || null,
          createdAt: serverTimestamp(),
          preferences: {},
        }, { merge: true });
      }
    } catch (e) {
      console.warn("No se pudo crear el documento de usuario en Firestore:", e);
      // No detenemos el flujo por esto.
    }

    // Redirigir al home (usuario ya autenticado)
    router.push({ name: "home" });
  } catch (err) {
    errorMessage.value = friendlyError(err.code, err.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Animación de entrada */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-enter-active {
  transition: opacity 320ms ease, transform 320ms cubic-bezier(.2,.9,.2,1);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mejor contraste para botones de social en hover */
button[type="button"] {
  cursor: pointer;
}
</style>
