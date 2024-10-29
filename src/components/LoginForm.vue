<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label class="block text-sm">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded"
        >
          Entrar
        </button>
      </form>
      <p class="text-center">
        Não tem uma conta?
        <router-link to="/signup" class="text-blue-500"
          >Cadastre-se</router-link
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const onSubmit = async () => {
      const success = await authStore.login(email.value, password.value)
      if (success) router.push('/profile')
    }

    return { email, password, onSubmit }
  },
})
</script>
