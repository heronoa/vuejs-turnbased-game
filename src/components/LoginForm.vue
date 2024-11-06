<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 relative">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm">Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm">Senha</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
          Entrar
        </button>
      </form>
      <p class="text-center">
        Não tem uma conta?
        <router-link to="/signup" class="text-blue-500">Cadastre-se</router-link>
      </p>
    </div>
    <div
      class="bg-amber-400 min-h-md absolute bottom-0 left-0 right-0 py-2 md:py-0 text-center flex flex-col justify-center items-center">
      <div>Feito por com objetivo educacional por <span class="text-slate-700 hover:text-fuchsia-600 cursor-pointer"
          v-on:click="sendToGithub">Heron</span>.</div>
      <div class="block md:hidden">Qualquer dúvida mande um <a
          class="text-slate-700 hover:text-fuchsia-600 cursor-pointer" href="mailto:heron.amaral@gmail.com">email</a>.
      </div>
      <div class="hidden md:block">Seu email cadastrado não será usado para nada
        além de credencial e nem precisa ser um email
        real, caso queira que seja excluído me mande um <a class="text-slate-700 hover:text-fuchsia-600 cursor-pointer"
          href="mailto:heron.amaral@gmail.com">email</a>.</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()



const sendToGithub = () => {
  router.push("https://github.com/heronoa")
}

const onSubmit = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) router.push({ name: 'profile' })
}

</script>
