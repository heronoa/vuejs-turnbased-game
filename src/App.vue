<template>
  <div>
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <!-- Indicador de carregamento -->
      <p>Carregando...</p>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>
