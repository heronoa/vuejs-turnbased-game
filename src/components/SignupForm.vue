<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 relative">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Sign Up</h2>
      <div v-if="errorMsg" class="min-h-[25px]">{{ errorMsg }}</div>
      <form @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm">Username</label>
          <input v-model="username" type="name" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm">Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm">Senha</label>
          <div class="relative">
            <input v-if="showPassword === false" v-model="password" type="password" required
              class="w-full px-3 py-2 border rounded" />
            <input v-else v-model="password" type="text" required class="w-full px-3 py-2 border rounded" />
            <div v-on:click="toggleShowPassword" class="absolute cursor-pointer right-3 top-[10px] hover:scale-110">
              <img width="24" :src="EyeImage" />
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm">Confirmar senha</label>
          <div class="relative">
            <input v-if="showCPassword === false" v-model="passwordConfirmation" type="password" required
              class="w-full px-3 py-2 border rounded relative" />
            <input v-else v-model="passwordConfirmation" type="text" required
              class="w-full px-3 py-2 border rounded relative" />
            <div v-on:click="toggleShowCPassword" class="absolute cursor-pointer right-3 top-[10px] hover:scale-110">
              <img width="24" :src="EyeImage" />

            </div>
          </div>
        </div>
        <button type="submit" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
          Entrar
        </button>
      </form>
      <p class="text-center">
        Já tem uma conta?
        <router-link to="/login" class="text-blue-500">Faça o login</router-link>
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
import { signUpFieldsChecks } from '@/errorHandlers/signUpHandlers'
import EyeImage from '/src/assets/eye-svgrepo-com.svg'

const email = ref('')
const password = ref('')
const showPassword = ref<boolean>(false)
const showCPassword = ref<boolean>(false)
const passwordConfirmation = ref('')
const username = ref('')
const router = useRouter()
const authStore = useAuthStore()
const errorMsg = ref<string | undefined>(undefined)

const sendToGithub = () => {
  router.push("https://github.com/heronoa")
}

const toggleShowCPassword = () => {
  showCPassword.value = !showCPassword.value
}
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async () => {
  const missingChecks = signUpFieldsChecks({
    email: email.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value,
    username: username.value,
  })
  if (missingChecks) {
    setTimeout(() => {
      errorMsg.value = undefined
    }, 2000)
    return (errorMsg.value = missingChecks)
  }
  const success = await authStore.signup(
    username.value,
    email.value,
    password.value,
  )
  if (success) router.push({ name: 'login' })
  else {
    errorMsg.value = authStore?.loginError || 'Error on sign'
    setTimeout(() => {
      errorMsg.value = undefined
    }, 2000)
  }
}


</script>
