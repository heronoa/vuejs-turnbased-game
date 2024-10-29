<template>
  <div>
    <div
      v-if="authStore.loading"
      class="flex items-center justify-center min-h-screen"
    >
      <!-- Indicador de carregamento -->
      <p>Carregando...</p>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from './stores/auth'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
})
</script>
