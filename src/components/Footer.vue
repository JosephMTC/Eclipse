<template>
  <footer class="bg-white border-t border-gray-100 text-gray-700">
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <!-- LOGO + DESCRIP -->
        <div class="md:col-span-4">
          <div class="flex items-center gap-3">
            <!-- Placeholder logo (reemplaza por tu componente/logo real) -->
             <img src="/src/assets/eclipse-2.svg" alt="Logo" class="w-9 h-9 rounded-lg object-contain" aria-hidden="true"/>
            <div>
              <div class="text-lg font-extrabold text-gray-900">Eclipse</div>
              <div class="text-sm text-gray-500">La vestimenta ideal a un solo click.</div>
            </div>
          </div>

          <p class="mt-4 text-sm text-gray-600">Enviamos a todo el país. Atención al cliente 24/7 y garantía de satisfacción. Síguenos en redes para ofertas exclusivas.</p>

          <div class="mt-6 flex items-center gap-3">
            <a href="#" class="social-btn" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3V2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Tiktok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 8a4 4 0 01-4-4v10a4 4 0 11-4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>

        <!-- LINKS -->
        <nav class="md:col-span-5 grid grid-cols-2 gap-6 sm:grid-cols-3" aria-label="Footer Navigation">
          <div>
            <h4 class="text-sm font-semibold text-gray-900">Tienda</h4>
            <ul class="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" class="link">Productos</a></li>
              <li><a href="#" class="link">Ofertas</a></li>
              <li><a href="#" class="link">Nuevos</a></li>
              <li><a href="#" class="link">Categorias</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900">Compañía</h4>
            <ul class="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" class="link">Nosotros</a></li>
              <li><a href="#" class="link">Trabaja con nosotros</a></li>
              <li><a href="#" class="link">Blog</a></li>
              <li><a href="#" class="link">Prensa</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900">Soporte</h4>
            <ul class="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" class="link">Ayuda</a></li>
              <li><a href="#" class="link">Envios</a></li>
              <li><a href="#" class="link">Devoluciones</a></li>
              <li><a href="#" class="link">Contacto</a></li>
            </ul>
          </div>
        </nav>

        <!-- NEWSLETTER / CONTACT -->
        <div class="md:col-span-3">
          <h4 class="text-sm font-semibold text-gray-900">Suscríbete y recibe ofertas</h4>
          <p class="mt-2 text-sm text-gray-600">Promociones exclusivas y novedades. Cancela cuando quieras.</p>

          <form @submit.prevent="handleSubscribe" class="mt-4 flex gap-2 items-center">
            <label for="footer-email" class="sr-only">Correo electrónico</label>
            <input id="footer-email" v-model="email" type="email" placeholder="tu@correo.com" required
                   class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400" />
            <button class="btn-subscribe" type="submit" aria-label="Suscribirse">Suscribir</button>
          </form>

          <p v-if="message" class="mt-3 text-sm" :class="messageType === 'ok' ? 'text-green-600' : 'text-red-600'">{{ message }}</p>

          <div class="mt-6 text-sm text-gray-500">
            <div>Atención: <a href="tel:+511234567" class="link">+51 123 4567</a></div>
            <div class="mt-1">Correo: <a href="mailto:contacto@sweetdelights.com" class="link">yoshiyosnichi@hotmail.com</a></div>
          </div>
        </div>
      </div>

      <!-- SEPARADOR Y COPYRIGHT -->
      <div class="mt-10 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-500">© {{ new Date().getFullYear() }} Sweet Delights. Todos los derechos reservados.</div>

        <div class="flex items-center gap-4">
          <!-- métodos de pago (SVGs simple placeholders) -->
          <div class="flex items-center gap-2">
            <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true"><rect width="40" height="24" rx="4" fill="#111827"/></svg>
            <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true"><rect width="40" height="24" rx="4" fill="#111827"/></svg>
          </div>
          
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');
const messageType = ref('');

function validateEmail(e) {
  return /\S+@\S+\.\S+/.test(e);
}

function handleSubscribe() {
  if (!validateEmail(email.value)) {
    messageType.value = 'error';
    message.value = 'Ingresa un correo válido.';
    return;
  }

  // Aquí puedes llamar a tu API / servicio de suscripción
  // ejemplo: fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email: email.value }) })
  console.log('Suscribir:', email.value);

  messageType.value = 'ok';
  message.value = '¡Gracias! Te hemos suscrito.';
  email.value = '';

  setTimeout(() => { message.value = ''; }, 4000);
}
</script>

<style scoped>
/* botones y enlaces */
.link { color: rgba(55, 65, 81, 0.9); transition: color .15s ease; }
.link:hover { color: rgb(99 102 241); }
.social-btn {
  display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; background:rgba(99,102,241,0.06); color:rgb(99 102 241); transition:transform .18s ease, background .18s ease; }
.social-btn:hover { transform:translateY(-3px); background:rgba(99,102,241,0.12); }

.btn-subscribe {
  background: linear-gradient(90deg,#7c3aed,#a78bfa); color:white; padding:8px 12px; border-radius:10px; font-weight:700; border:none; cursor:pointer; box-shadow:0 8px 30px rgba(124,58,237,0.12);
}
.btn-subscribe:hover { transform: translateY(-2px); }

/* accesibilidad: ocultar label visualmente */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* adaptaciones responsivas */
@media (max-width: 768px) {
  footer .max-w-7xl { padding-left: 1rem; padding-right: 1rem; }
}
</style>
